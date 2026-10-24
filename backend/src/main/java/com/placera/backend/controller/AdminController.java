package com.placera.backend.controller;

import com.placera.backend.dto.*;
import com.placera.backend.entity.ApplicationStatus;
import com.placera.backend.entity.JobStatus;
import com.placera.backend.entity.JobType;
import com.placera.backend.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Placement Administration", description = "Administrative management of students, companies, jobs, applications, and analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StudentService studentService;
    private final CompanyService companyService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final InterviewService interviewService;
    private final AnalyticsService analyticsService;

    public AdminController(
            StudentService studentService,
            CompanyService companyService,
            JobService jobService,
            ApplicationService applicationService,
            InterviewService interviewService,
            AnalyticsService analyticsService) {
        this.studentService = studentService;
        this.companyService = companyService;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.interviewService = interviewService;
        this.analyticsService = analyticsService;
    }

    // Dashboard & Analytics
    @GetMapping("/dashboard")
    @Operation(summary = "Get executive dashboard live recruitment KPIs and conversion rates")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get recruitment analytics data")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getAnalytics() {
        AdminDashboardStatsDto stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/reports/export")
    @Operation(summary = "Export application and placement outcomes as CSV with formula injection sanitization")
    public ResponseEntity<byte[]> exportReportsCsv() {
        byte[] csvData = analyticsService.exportApplicationsReportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"placera_placement_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    // Students
    @GetMapping("/students")
    @Operation(summary = "Search and filter registered students")
    public ResponseEntity<ApiResponse<Page<StudentProfileDto>>> searchStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer graduationYear,
            @RequestParam(required = false) BigDecimal minCgpa,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<StudentProfileDto> students = studentService.searchStudentsForAdmin(department, graduationYear, minCgpa, query, page, size);
        return ResponseEntity.ok(ApiResponse.ok(students));
    }

    @PatchMapping("/students/{id}/active")
    @Operation(summary = "Activate or deactivate a student account")
    public ResponseEntity<ApiResponse<Void>> toggleStudentActive(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        studentService.toggleStudentActiveState(id, active);
        return ResponseEntity.ok(ApiResponse.ok("Student status updated", null));
    }

    // Companies
    @GetMapping("/companies")
    @Operation(summary = "Search and filter hiring partner companies")
    public ResponseEntity<ApiResponse<Page<CompanyDto>>> searchCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<CompanyDto> companies = companyService.searchCompanies(query, activeOnly, page, size);
        return ResponseEntity.ok(ApiResponse.ok(companies));
    }

    @PostMapping("/companies")
    @Operation(summary = "Create a new recruiting partner company")
    public ResponseEntity<ApiResponse<CompanyDto>> createCompany(@Valid @RequestBody CreateCompanyRequest request) {
        CompanyDto company = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Company created successfully", company));
    }

    @PutMapping("/companies/{id}")
    @Operation(summary = "Update recruiting company details")
    public ResponseEntity<ApiResponse<CompanyDto>> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCompanyRequest request) {
        CompanyDto updated = companyService.updateCompany(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Company updated successfully", updated));
    }

    @PatchMapping("/companies/{id}/toggle-active")
    @Operation(summary = "Toggle active status of a company")
    public ResponseEntity<ApiResponse<Void>> toggleCompanyActive(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean active = body.getOrDefault("active", true);
        companyService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.ok("Company active state updated", null));
    }

    // Jobs
    @GetMapping("/jobs")
    @Operation(summary = "Search all jobs including drafts and closed postings")
    public ResponseEntity<ApiResponse<Page<JobDto>>> searchJobs(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<JobDto> jobs = jobService.searchJobs(status, jobType, location, companyId, false, query, page, size);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create a new job posting with eligibility rules and skills")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody CreateJobRequest request) {
        JobDto job = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job posting created successfully", job));
    }

    @PutMapping("/jobs/{id}")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request) {
        JobDto updated = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Job posting updated successfully", updated));
    }

    @PatchMapping("/jobs/{id}/publish")
    @Operation(summary = "Publish a draft job posting to students")
    public ResponseEntity<ApiResponse<JobDto>> publishJob(@PathVariable Long id) {
        JobDto published = jobService.publishJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job published successfully", published));
    }

    @PatchMapping("/jobs/{id}/close")
    @Operation(summary = "Close a job posting from further applications")
    public ResponseEntity<ApiResponse<JobDto>> closeJob(@PathVariable Long id) {
        JobDto closed = jobService.closeJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job closed successfully", closed));
    }

    // Applications
    @GetMapping("/applications")
    @Operation(summary = "Filter and manage all student applications")
    public ResponseEntity<ApiResponse<Page<ApplicationDto>>> searchApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<ApplicationDto> applications = applicationService.searchApplicationsForAdmin(jobId, companyId, status, department, query, page, size);
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }

    @PatchMapping("/applications/{id}/status")
    @Operation(summary = "Advance or update application stage with state-transition validation and internal notes")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        ApplicationDto updated = applicationService.updateStatusByAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Application stage updated successfully", updated));
    }

    // Interviews
    @PostMapping("/applications/{applicationId}/interviews")
    @Operation(summary = "Schedule an interview round for a student application")
    public ResponseEntity<ApiResponse<InterviewDto>> scheduleInterview(
            @PathVariable Long applicationId,
            @Valid @RequestBody ScheduleInterviewRequest request) {
        InterviewDto interview = interviewService.scheduleInterview(applicationId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Interview scheduled successfully", interview));
    }

    @PatchMapping("/interviews/{id}/cancel")
    @Operation(summary = "Cancel a scheduled interview")
    public ResponseEntity<ApiResponse<InterviewDto>> cancelInterview(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : "Administrative decision";
        InterviewDto cancelled = interviewService.cancelInterview(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Interview cancelled", cancelled));
    }
}
