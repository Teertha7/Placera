package com.placera.backend.service;

import com.placera.backend.dto.InterviewDto;
import com.placera.backend.dto.ScheduleInterviewRequest;
import com.placera.backend.entity.*;
import com.placera.backend.exception.BadRequestException;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.exception.UnauthorizedException;
import com.placera.backend.repository.ApplicationRepository;
import com.placera.backend.repository.InterviewRepository;
import com.placera.backend.repository.StudentProfileRepository;
import com.placera.backend.repository.UserRepository;
import com.placera.backend.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public InterviewService(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository,
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            AuditService auditService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public InterviewDto scheduleInterview(Long applicationId, ScheduleInterviewRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (request.getScheduledTime().isBefore(Instant.now())) {
            throw new BadRequestException("Interview must be scheduled for a future time");
        }

        // Check for potential scheduling conflicts for the same student (within +- duration buffer)
        Instant windowStart = request.getScheduledTime().minus(request.getDurationMinutes(), ChronoUnit.MINUTES);
        Instant windowEnd = request.getScheduledTime().plus(request.getDurationMinutes(), ChronoUnit.MINUTES);

        List<Interview> studentInterviews = interviewRepository.findByDateRange(windowStart, windowEnd);
        boolean hasConflict = studentInterviews.stream()
                .anyMatch(i -> i.getApplication().getStudent().getId().equals(application.getStudent().getId())
                        && i.getStatus() == InterviewStatus.SCHEDULED);

        if (hasConflict) {
            throw new BadRequestException("Scheduling conflict: The student already has another interview scheduled around this time.");
        }

        Long adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId).orElse(null);

        Interview interview = new Interview(
                application,
                request.getRoundNumber(),
                request.getRoundName().trim(),
                request.getInterviewType(),
                request.getScheduledTime(),
                request.getDurationMinutes(),
                request.getLocationOrUrl(),
                request.getInstructions(),
                admin
        );
        Interview saved = interviewRepository.save(interview);

        // Advance application status to technical/interview round if currently applied/shortlisted
        if (application.getStatus() == ApplicationStatus.APPLIED || application.getStatus() == ApplicationStatus.SHORTLISTED) {
            application.setStatus(ApplicationStatus.TECHNICAL_INTERVIEW);
            applicationRepository.save(application);
            application.addStatusHistory(ApplicationStatus.SHORTLISTED, ApplicationStatus.TECHNICAL_INTERVIEW, admin,
                    "Interview scheduled: " + request.getRoundName());
        }

        // Send notification to student
        String message = String.format("An interview has been scheduled for %s (%s) on %s. Duration: %d mins.",
                application.getJob().getTitle(), request.getRoundName(), request.getScheduledTime().toString(), request.getDurationMinutes());

        notificationService.createNotification(
                application.getStudent().getUser(),
                "Interview Scheduled: " + request.getRoundName(),
                message,
                NotificationType.INTERVIEW_SCHEDULED,
                saved.getId().toString()
        );

        auditService.logEvent(admin, "SCHEDULE_INTERVIEW", "Interview", saved.getId().toString(),
                "Scheduled interview for " + application.getStudent().getUser().getFullName(), null);

        return InterviewDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<InterviewDto> getCurrentStudentInterviews() {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return interviewRepository.findByStudentId(student.getId())
                .stream()
                .map(InterviewDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InterviewDto> getUpcomingStudentInterviews() {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return interviewRepository.findUpcomingByStudentId(student.getId(), Instant.now())
                .stream()
                .map(InterviewDto::fromEntity)
                .toList();
    }

    @Transactional
    public InterviewDto cancelInterview(Long interviewId, String reason) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        interview.setStatus(InterviewStatus.CANCELLED);
        Interview updated = interviewRepository.save(interview);

        notificationService.createNotification(
                interview.getApplication().getStudent().getUser(),
                "Interview Cancelled",
                "Your scheduled interview for " + interview.getApplication().getJob().getTitle() + " has been cancelled. " +
                        (reason != null ? "Reason: " + reason : ""),
                NotificationType.INTERVIEW_SCHEDULED,
                updated.getId().toString()
        );

        auditService.logEvent(null, "CANCEL_INTERVIEW", "Interview", updated.getId().toString(),
                "Cancelled interview. Reason: " + reason, null);

        return InterviewDto.fromEntity(updated);
    }
}
