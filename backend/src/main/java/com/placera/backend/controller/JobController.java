package com.placera.backend.controller;

import com.placera.backend.dto.ApiResponse;
import com.placera.backend.dto.JobDto;
import com.placera.backend.dto.JobEligibilityCheckResult;
import com.placera.backend.entity.JobStatus;
import com.placera.backend.entity.JobType;
import com.placera.backend.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs (Public & Student)", description = "Browse, search, and verify eligibility for campus placement jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Search and filter published job opportunities")
    public ResponseEntity<ApiResponse<Page<JobDto>>> searchJobs(
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // By default, public browse shows only PUBLISHED jobs
        Page<JobDto> jobs = jobService.searchJobs(
                JobStatus.PUBLISHED, jobType, location, companyId, activeOnly, query, page, size);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full job description, company details, and eligibility criteria")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(job));
    }

    @GetMapping("/{id}/eligibility")
    @Operation(summary = "Check eligibility of currently logged-in student against this job's criteria")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<JobEligibilityCheckResult>> checkEligibility(@PathVariable Long id) {
        JobEligibilityCheckResult result = jobService.checkEligibilityForCurrentStudent(id);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
