package com.placera.backend.controller;

import com.placera.backend.dto.*;
import com.placera.backend.service.ApplicationService;
import com.placera.backend.service.InterviewService;
import com.placera.backend.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Student Operations", description = "Student profile, resume, applications, and interview endpoints")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentController {

    private final StudentService studentService;
    private final ApplicationService applicationService;
    private final InterviewService interviewService;

    public StudentController(
            StudentService studentService,
            ApplicationService applicationService,
            InterviewService interviewService) {
        this.studentService = studentService;
        this.applicationService = applicationService;
        this.interviewService = interviewService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student profile and academic metrics")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile() {
        StudentProfileDto profile = studentService.getCurrentStudentProfile();
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me")
    @Operation(summary = "Update allowed personal details, skills, and portfolio links")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(@Valid @RequestBody UpdateStudentProfileRequest request) {
        StudentProfileDto updated = studentService.updateCurrentStudentProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping(value = "/me/resumes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload and activate student PDF resume")
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(@RequestParam("file") MultipartFile file) {
        ResumeDto resume = studentService.uploadResume(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resume uploaded successfully", resume));
    }

    @GetMapping("/me/resumes")
    @Operation(summary = "List current student's resumes")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getResumes() {
        List<ResumeDto> resumes = studentService.getCurrentStudentResumes();
        return ResponseEntity.ok(ApiResponse.ok(resumes));
    }

    @GetMapping("/me/applications")
    @Operation(summary = "Get all applications submitted by the current student")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplications() {
        List<ApplicationDto> applications = applicationService.getCurrentStudentApplications();
        return ResponseEntity.ok(ApiResponse.ok(applications));
    }

    @GetMapping("/me/interviews")
    @Operation(summary = "Get all scheduled and past interviews for the current student")
    public ResponseEntity<ApiResponse<List<InterviewDto>>> getInterviews() {
        List<InterviewDto> interviews = interviewService.getCurrentStudentInterviews();
        return ResponseEntity.ok(ApiResponse.ok(interviews));
    }

    @GetMapping("/me/interviews/upcoming")
    @Operation(summary = "Get upcoming scheduled interviews for the current student")
    public ResponseEntity<ApiResponse<List<InterviewDto>>> getUpcomingInterviews() {
        List<InterviewDto> interviews = interviewService.getUpcomingStudentInterviews();
        return ResponseEntity.ok(ApiResponse.ok(interviews));
    }
}
