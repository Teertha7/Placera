package com.placera.backend.dto;

import com.placera.backend.entity.Interview;
import com.placera.backend.entity.InterviewStatus;
import com.placera.backend.entity.InterviewType;
import java.time.Instant;

public class InterviewDto {

    private Long id;
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogoUrl;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentRegistrationNumber;
    private Integer roundNumber;
    private String roundName;
    private InterviewType interviewType;
    private Instant scheduledTime;
    private Integer durationMinutes;
    private String locationOrUrl;
    private String instructions;
    private InterviewStatus status;
    private Instant createdAt;

    public InterviewDto() {}

    public static InterviewDto fromEntity(Interview interview) {
        if (interview == null) return null;
        InterviewDto dto = new InterviewDto();
        dto.setId(interview.getId());
        if (interview.getApplication() != null) {
            dto.setApplicationId(interview.getApplication().getId());
            if (interview.getApplication().getJob() != null) {
                dto.setJobId(interview.getApplication().getJob().getId());
                dto.setJobTitle(interview.getApplication().getJob().getTitle());
                if (interview.getApplication().getJob().getCompany() != null) {
                    dto.setCompanyName(interview.getApplication().getJob().getCompany().getName());
                    dto.setCompanyLogoUrl(interview.getApplication().getJob().getCompany().getLogoUrl());
                }
            }
            if (interview.getApplication().getStudent() != null) {
                dto.setStudentId(interview.getApplication().getStudent().getId());
                dto.setStudentRegistrationNumber(interview.getApplication().getStudent().getRegistrationNumber());
                if (interview.getApplication().getStudent().getUser() != null) {
                    dto.setStudentName(interview.getApplication().getStudent().getUser().getFullName());
                    dto.setStudentEmail(interview.getApplication().getStudent().getUser().getEmail());
                }
            }
        }
        dto.setRoundNumber(interview.getRoundNumber());
        dto.setRoundName(interview.getRoundName());
        dto.setInterviewType(interview.getInterviewType());
        dto.setScheduledTime(interview.getScheduledTime());
        dto.setDurationMinutes(interview.getDurationMinutes());
        dto.setLocationOrUrl(interview.getLocationOrUrl());
        dto.setInstructions(interview.getInstructions());
        dto.setStatus(interview.getStatus());
        dto.setCreatedAt(interview.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentRegistrationNumber() { return studentRegistrationNumber; }
    public void setStudentRegistrationNumber(String studentRegistrationNumber) { this.studentRegistrationNumber = studentRegistrationNumber; }

    public Integer getRoundNumber() { return roundNumber; }
    public void setRoundNumber(Integer roundNumber) { this.roundNumber = roundNumber; }

    public String getRoundName() { return roundName; }
    public void setRoundName(String roundName) { this.roundName = roundName; }

    public InterviewType getInterviewType() { return interviewType; }
    public void setInterviewType(InterviewType interviewType) { this.interviewType = interviewType; }

    public Instant getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(Instant scheduledTime) { this.scheduledTime = scheduledTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getLocationOrUrl() { return locationOrUrl; }
    public void setLocationOrUrl(String locationOrUrl) { this.locationOrUrl = locationOrUrl; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
