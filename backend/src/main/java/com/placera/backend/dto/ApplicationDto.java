package com.placera.backend.dto;

import com.placera.backend.entity.Application;
import com.placera.backend.entity.ApplicationStatus;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

public class ApplicationDto {

    private Long id;
    private JobDto job;
    private StudentProfileDto student;
    private ResumeDto resume;
    private ApplicationStatus status;
    private String internalNotes; // Included only for admin users
    private Instant createdAt;
    private Instant updatedAt;
    private List<ApplicationStatusHistoryDto> statusHistory;
    private List<InterviewDto> interviews;

    public ApplicationDto() {}

    public static ApplicationDto fromEntity(Application app, boolean includeAdminFields) {
        if (app == null) return null;
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJob(JobDto.fromEntity(app.getJob()));
        dto.setStudent(StudentProfileDto.fromEntity(app.getStudent()));
        dto.setResume(ResumeDto.fromEntity(app.getResume()));
        dto.setStatus(app.getStatus());
        dto.setCreatedAt(app.getCreatedAt());
        dto.setUpdatedAt(app.getUpdatedAt());

        if (includeAdminFields) {
            dto.setInternalNotes(app.getInternalNotes());
        }

        if (app.getStatusHistory() != null) {
            dto.setStatusHistory(app.getStatusHistory().stream()
                    .map(ApplicationStatusHistoryDto::fromEntity)
                    .toList());
        } else {
            dto.setStatusHistory(Collections.emptyList());
        }

        if (app.getInterviews() != null) {
            dto.setInterviews(app.getInterviews().stream()
                    .map(InterviewDto::fromEntity)
                    .toList());
        } else {
            dto.setInterviews(Collections.emptyList());
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobDto getJob() { return job; }
    public void setJob(JobDto job) { this.job = job; }

    public StudentProfileDto getStudent() { return student; }
    public void setStudent(StudentProfileDto student) { this.student = student; }

    public ResumeDto getResume() { return resume; }
    public void setResume(ResumeDto resume) { this.resume = resume; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<ApplicationStatusHistoryDto> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<ApplicationStatusHistoryDto> statusHistory) { this.statusHistory = statusHistory; }

    public List<InterviewDto> getInterviews() { return interviews; }
    public void setInterviews(List<InterviewDto> interviews) { this.interviews = interviews; }
}
