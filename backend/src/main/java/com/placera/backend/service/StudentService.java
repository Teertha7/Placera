package com.placera.backend.service;

import com.placera.backend.dto.ResumeDto;
import com.placera.backend.dto.StudentProfileDto;
import com.placera.backend.dto.UpdateStudentProfileRequest;
import com.placera.backend.entity.Resume;
import com.placera.backend.entity.Role;
import com.placera.backend.entity.StudentProfile;
import com.placera.backend.entity.User;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.exception.UnauthorizedException;
import com.placera.backend.repository.ApplicationRepository;
import com.placera.backend.repository.ResumeRepository;
import com.placera.backend.repository.StudentProfileRepository;
import com.placera.backend.repository.UserRepository;
import com.placera.backend.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeStorageService storageService;
    private final AuditService auditService;

    public StudentService(
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            ResumeRepository resumeRepository,
            ApplicationRepository applicationRepository,
            ResumeStorageService storageService,
            AuditService auditService) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.applicationRepository = applicationRepository;
        this.storageService = storageService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public StudentProfileDto getCurrentStudentProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));

        StudentProfileDto dto = StudentProfileDto.fromEntity(profile);
        dto.setActiveApplicationsCount(applicationRepository.countActiveByStudentId(profile.getId()));
        dto.setOffersCount(applicationRepository.countOffersByStudentId(profile.getId()));
        return dto;
    }

    @Transactional(readOnly = true)
    public StudentProfile getStudentProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));
    }

    @Transactional(readOnly = true)
    public StudentProfile getStudentProfileById(Long studentId) {
        return studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + studentId));
    }

    @Transactional
    public StudentProfileDto updateCurrentStudentProfile(UpdateStudentProfileRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (request.getSkills() != null) {
            profile.setSkills(request.getSkills().trim());
        }
        if (request.getLinkedinUrl() != null) {
            profile.setLinkedinUrl(request.getLinkedinUrl().trim());
        }
        if (request.getGithubUrl() != null) {
            profile.setGithubUrl(request.getGithubUrl().trim());
        }
        if (request.getPortfolioUrl() != null) {
            profile.setPortfolioUrl(request.getPortfolioUrl().trim());
        }

        if (request.getPhoneNumber() != null) {
            User user = profile.getUser();
            user.setPhoneNumber(request.getPhoneNumber().trim());
            userRepository.save(user);
        }

        StudentProfile updated = studentProfileRepository.save(profile);
        auditService.logEvent(profile.getUser(), "UPDATE_PROFILE", "StudentProfile", profile.getId().toString(), "Updated profile details", null);

        StudentProfileDto dto = StudentProfileDto.fromEntity(updated);
        dto.setActiveApplicationsCount(applicationRepository.countActiveByStudentId(profile.getId()));
        dto.setOffersCount(applicationRepository.countOffersByStudentId(profile.getId()));
        return dto;
    }

    @Transactional
    public ResumeDto uploadResume(MultipartFile file) {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        String storageKey = storageService.storeFile(file);

        // Deactivate previous resumes
        List<Resume> existingResumes = resumeRepository.findByStudentIdAndActiveTrueOrderByUploadedAtDesc(profile.getId());
        for (Resume r : existingResumes) {
            r.setActive(false);
            resumeRepository.save(r);
        }

        Resume newResume = new Resume(
                profile,
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf",
                storageKey,
                "application/pdf",
                file.getSize()
        );
        Resume savedResume = resumeRepository.save(newResume);

        auditService.logEvent(profile.getUser(), "UPLOAD_RESUME", "Resume", savedResume.getId().toString(),
                "Uploaded resume: " + savedResume.getFileName(), null);

        return ResumeDto.fromEntity(savedResume);
    }

    @Transactional(readOnly = true)
    public List<ResumeDto> getCurrentStudentResumes() {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return resumeRepository.findByStudentIdAndActiveTrueOrderByUploadedAtDesc(profile.getId())
                .stream()
                .map(ResumeDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<StudentProfileDto> searchStudentsForAdmin(String department, Integer graduationYear, BigDecimal minCgpa, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "registrationNumber"));
        return studentProfileRepository.searchStudents(department, graduationYear, minCgpa, query, pageable)
                .map(sp -> {
                    StudentProfileDto dto = StudentProfileDto.fromEntity(sp);
                    dto.setActiveApplicationsCount(applicationRepository.countActiveByStudentId(sp.getId()));
                    dto.setOffersCount(applicationRepository.countOffersByStudentId(sp.getId()));
                    return dto;
                });
    }

    @Transactional
    public void toggleStudentActiveState(Long studentId, boolean active) {
        StudentProfile profile = getStudentProfileById(studentId);
        User user = profile.getUser();
        user.setActive(active);
        userRepository.save(user);
        auditService.logEvent(null, active ? "ACTIVATE_USER" : "DEACTIVATE_USER", "User", user.getId().toString(),
                "Toggled active state to " + active, null);
    }
}
