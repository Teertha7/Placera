package com.placera.backend.controller;

import com.placera.backend.dto.ApiResponse;
import com.placera.backend.dto.CompanyDto;
import com.placera.backend.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Companies (Public)", description = "Public company directory endpoints")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    @Operation(summary = "Get list of active hiring partner companies")
    public ResponseEntity<ApiResponse<List<CompanyDto>>> getActiveCompanies() {
        List<CompanyDto> companies = companyService.getActiveCompanies();
        return ResponseEntity.ok(ApiResponse.ok(companies));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<ApiResponse<CompanyDto>> getCompanyById(@PathVariable Long id) {
        CompanyDto company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.ok(company));
    }
}
