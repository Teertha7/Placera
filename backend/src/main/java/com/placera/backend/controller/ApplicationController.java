package com.placera.backend.controller;

import com.placera.backend.dto.ApiResponse;
import com.placera.backend.dto.ApplicationDto;
import com.placera.backend.dto.CreateApplicationRequest;
import com.placera.backend.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Applications", description = "Student job applications, status timeline, and withdrawal")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/api/jobs/{jobId}/applications")
    @Operation(summary = "Submit an application for a published job opportunity")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDto>> submitApplication(
            @PathVariable Long jobId,
            @RequestBody(required = false) CreateApplicationRequest request) {
        ApplicationDto application = applicationService.submitApplication(jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully", application));
    }

    @GetMapping("/api/applications/{id}")
    @Operation(summary = "Get detailed application status, history timeline, and scheduled interviews")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(@PathVariable Long id) {
        ApplicationDto application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok(application));
    }

    @PatchMapping("/api/applications/{id}/withdraw")
    @Operation(summary = "Withdraw an active job application")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDto>> withdrawApplication(@PathVariable Long id) {
        ApplicationDto application = applicationService.withdrawApplication(id);
        return ResponseEntity.ok(ApiResponse.ok("Application withdrawn successfully", application));
    }
}
