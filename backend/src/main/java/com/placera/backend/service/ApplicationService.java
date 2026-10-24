package com.placera.backend.service;

import com.placera.backend.dto.*;
import com.placera.backend.entity.*;
import com.placera.backend.exception.BadRequestException;
import com.placera.backend.exception.DuplicateResourceException;
import com.placera.backend.exception.EligibilityFailedException;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.exception.UnauthorizedException;
import com.placera.backend.repository.ApplicationRepository;
import com.placera.backend.repository.ApplicationStatusHistoryRepository;
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

import java.time.Instant;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final JobService jobService;
    private final StudentProfileRepository studentProfileRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            JobService jobService,
            StudentProfileRepository studentProfileRepository,
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            EligibilityService eligibilityService,
            NotificationService notificationService,
            AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.jobService = jobService;
        this.studentProfileRepository = studentProfileRepository;
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.eligibilityService = eligibilityService;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public ApplicationDto submitApplication(Long jobId, CreateApplicationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Job job = jobService.getEntityById(jobId);

        // 1. Check job status
        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new BadRequestException("This job opportunity is not currently accepting applications");
        }

        // 2. Check deadline
        if (job.getDeadline().isBefore(Instant.now())) {
            throw new BadRequestException("The deadline for this job posting has expired (" + job.getDeadline() + ")");
        }

        // 3. Check duplicate application
        if (applicationRepository.existsByJobIdAndStudentId(jobId, student.getId())) {
            throw new DuplicateResourceException("You have already submitted an application for " + job.getTitle() + " at " + job.getCompany().getName());
        }

        // 4. Server-side Eligibility Verification
        JobEligibilityCheckResult eligibility = eligibilityService.evaluateEligibility(student, job);
        if (!eligibility.isEligible()) {
            throw new EligibilityFailedException(
                    "You do not meet the eligibility requirements for this job",
                    eligibility.getReasons()
            );
        }

        // 5. Select Resume
        Resume resume = null;
        if (request != null && request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specified resume not found"));
            if (!resume.getStudent().getId().equals(student.getId())) {
                throw new UnauthorizedException("You cannot use another student's resume");
            }
        } else {
            // Pick latest active resume
            resume = resumeRepository.findFirstByStudentIdAndActiveTrueOrderByUploadedAtDesc(student.getId())
                    .orElseThrow(() -> new BadRequestException("Please upload a resume in your profile before applying for jobs"));
        }

        // 6. Create Application
        Application application = new Application(job, student, resume);
        Application saved = applicationRepository.save(application);

        // 7. Initial Status History
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved, null, ApplicationStatus.APPLIED, student.getUser(), "Initial application submitted by student"
        );
        statusHistoryRepository.save(history);

        // 8. Notification
        notificationService.createNotification(
                student.getUser(),
                "Application Submitted",
                "Your application for " + job.getTitle() + " at " + job.getCompany().getName() + " was submitted successfully.",
                NotificationType.APPLICATION_STATUS,
                saved.getId().toString()
        );

        auditService.logEvent(student.getUser(), "SUBMIT_APPLICATION", "Application", saved.getId().toString(),
                "Applied to job " + job.getTitle(), null);

        return ApplicationDto.fromEntity(saved, false);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getCurrentStudentApplications() {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return applicationRepository.findByStudentIdWithJob(student.getId())
                .stream()
                .map(app -> ApplicationDto.fromEntity(app, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole(Role.ADMIN);

        if (!isAdmin) {
            // Check student ownership
            if (!application.getStudent().getUser().getId().equals(currentUserId)) {
                throw new UnauthorizedException("You do not have permission to view this application");
            }
            return ApplicationDto.fromEntity(application, false);
        }

        return ApplicationDto.fromEntity(application, true);
    }

    @Transactional
    public ApplicationDto withdrawApplication(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (!application.getStudent().getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You cannot withdraw another student's application");
        }

        if (application.getStatus().isTerminal()) {
            throw new BadRequestException("Cannot withdraw an application that is already in terminal state: " + application.getStatus());
        }

        ApplicationStatus prevStatus = application.getStatus();
        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application updated = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                updated, prevStatus, ApplicationStatus.WITHDRAWN, application.getStudent().getUser(), "Application withdrawn by student"
        );
        statusHistoryRepository.save(history);

        notificationService.createNotification(
                application.getStudent().getUser(),
                "Application Withdrawn",
                "You have successfully withdrawn your application for " + updated.getJob().getTitle() + ".",
                NotificationType.APPLICATION_STATUS,
                updated.getId().toString()
        );

        auditService.logEvent(application.getStudent().getUser(), "WITHDRAW_APPLICATION", "Application", updated.getId().toString(),
                "Withdrew application", null);

        return ApplicationDto.fromEntity(updated, false);
    }

    @Transactional
    public ApplicationDto updateStatusByAdmin(Long id, UpdateApplicationStatusRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        Long adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId).orElse(null);

        ApplicationStatus currentStatus = application.getStatus();
        ApplicationStatus newStatus = request.getStatus();

        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new BadRequestException(String.format("Invalid status transition from '%s' to '%s'", currentStatus, newStatus));
        }

        application.setStatus(newStatus);
        if (request.getInternalNotes() != null) {
            application.setInternalNotes(request.getInternalNotes());
        }
        Application updated = applicationRepository.save(application);

        // Record Status History
        String note = (request.getReasonOrNote() != null && !request.getReasonOrNote().isBlank())
                ? request.getReasonOrNote().trim()
                : "Status transitioned to " + newStatus;

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                updated, currentStatus, newStatus, admin, note
        );
        statusHistoryRepository.save(history);

        // Send Notification to Student
        String title = "Application Update: " + updated.getJob().getTitle();
        String message = switch (newStatus) {
            case SHORTLISTED -> "Congratulations! You have been shortlisted for " + updated.getJob().getTitle() + " at " + updated.getJob().getCompany().getName() + ".";
            case ASSESSMENT -> "You have been invited for an online assessment for " + updated.getJob().getTitle() + ".";
            case TECHNICAL_INTERVIEW -> "You have advanced to the Technical Interview round for " + updated.getJob().getTitle() + ".";
            case HR_INTERVIEW -> "You have advanced to the HR Interview round for " + updated.getJob().getTitle() + ".";
            case SELECTED -> "Congratulations! You have been offered the role of " + updated.getJob().getTitle() + " at " + updated.getJob().getCompany().getName() + "!";
            case REJECTED -> "Thank you for your interest in " + updated.getJob().getTitle() + ". The recruitment team has decided not to proceed with your application at this time.";
            default -> "Your application status for " + updated.getJob().getTitle() + " was updated to " + newStatus + ".";
        };

        notificationService.createNotification(
                updated.getStudent().getUser(),
                title,
                message,
                NotificationType.APPLICATION_STATUS,
                updated.getId().toString()
        );

        auditService.logEvent(admin, "UPDATE_APPLICATION_STATUS", "Application", updated.getId().toString(),
                "Transitioned from " + currentStatus + " to " + newStatus, null);

        return ApplicationDto.fromEntity(updated, true);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationDto> searchApplicationsForAdmin(Long jobId, Long companyId, ApplicationStatus status,
                                                          String department, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return applicationRepository.searchApplications(jobId, companyId, status, department, query, pageable)
                .map(app -> ApplicationDto.fromEntity(app, true));
    }
}
