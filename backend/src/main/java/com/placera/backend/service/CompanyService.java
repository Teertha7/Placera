package com.placera.backend.service;

import com.placera.backend.dto.CompanyDto;
import com.placera.backend.dto.CreateCompanyRequest;
import com.placera.backend.dto.UpdateCompanyRequest;
import com.placera.backend.entity.Company;
import com.placera.backend.exception.DuplicateResourceException;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.repository.CompanyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final AuditService auditService;

    public CompanyService(CompanyRepository companyRepository, AuditService auditService) {
        this.companyRepository = companyRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> getActiveCompanies() {
        return companyRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(CompanyDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<CompanyDto> searchCompanies(String query, Boolean activeOnly, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        return companyRepository.searchCompanies(query, activeOnly, pageable)
                .map(CompanyDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return CompanyDto.fromEntity(company);
    }

    @Transactional(readOnly = true)
    public Company getEntityById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    @Transactional
    public CompanyDto createCompany(CreateCompanyRequest request) {
        if (companyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("A company with name '" + request.getName() + "' already exists");
        }

        Company company = new Company(
                request.getName().trim(),
                request.getDescription(),
                request.getIndustry().trim(),
                request.getWebsite(),
                request.getLocation(),
                request.getLogoUrl()
        );
        Company saved = companyRepository.save(company);
        auditService.logEvent(null, "CREATE_COMPANY", "Company", saved.getId().toString(), "Created company: " + saved.getName(), null);

        return CompanyDto.fromEntity(saved);
    }

    @Transactional
    public CompanyDto updateCompany(Long id, UpdateCompanyRequest request) {
        Company company = getEntityById(id);

        if (request.getName() != null && !request.getName().equalsIgnoreCase(company.getName())) {
            if (companyRepository.existsByNameIgnoreCase(request.getName())) {
                throw new DuplicateResourceException("A company with name '" + request.getName() + "' already exists");
            }
            company.setName(request.getName().trim());
        }

        if (request.getDescription() != null) company.setDescription(request.getDescription());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry().trim());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite().trim());
        if (request.getLocation() != null) company.setLocation(request.getLocation().trim());
        if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl().trim());
        if (request.getActive() != null) company.setActive(request.getActive());

        Company updated = companyRepository.save(company);
        auditService.logEvent(null, "UPDATE_COMPANY", "Company", updated.getId().toString(), "Updated company details", null);

        return CompanyDto.fromEntity(updated);
    }

    @Transactional
    public void toggleActive(Long id, boolean active) {
        Company company = getEntityById(id);
        company.setActive(active);
        companyRepository.save(company);
        auditService.logEvent(null, active ? "ACTIVATE_COMPANY" : "DEACTIVATE_COMPANY", "Company", company.getId().toString(),
                "Company active set to " + active, null);
    }
}
