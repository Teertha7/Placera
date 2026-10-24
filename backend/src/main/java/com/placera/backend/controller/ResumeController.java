package com.placera.backend.controller;

import com.placera.backend.entity.Resume;
import com.placera.backend.entity.Role;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.exception.UnauthorizedException;
import com.placera.backend.repository.ResumeRepository;
import com.placera.backend.security.SecurityUtils;
import com.placera.backend.service.ResumeStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
@Tag(name = "Resumes", description = "Secure resume download and access management")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final ResumeStorageService storageService;

    public ResumeController(ResumeRepository resumeRepository, ResumeStorageService storageService) {
        this.resumeRepository = resumeRepository;
        this.storageService = storageService;
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download or view resume PDF with role-based access control")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole(Role.ADMIN);

        // Security check: Only the owning student or an administrator can access this resume
        if (!isAdmin && !resume.getStudent().getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Access denied: You do not have permission to view this resume");
        }

        Resource resource = storageService.loadFileAsResource(resume.getStorageKey());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFileName() + "\"")
                .body(resource);
    }
}
