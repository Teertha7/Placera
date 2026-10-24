package com.placera.backend.dto;

import com.placera.backend.entity.InterviewType;
import jakarta.validation.constraints.*;
import java.time.Instant;

public class ScheduleInterviewRequest {

    @Min(value = 1)
    private Integer roundNumber = 1;

    @NotBlank(message = "Round name is required (e.g., 'Technical Interview 1', 'HR Discussion')")
    @Size(max = 100)
    private String roundName;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Interview must be scheduled for a future time")
    private Instant scheduledTime;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 300, message = "Duration cannot exceed 300 minutes")
    private Integer durationMinutes = 45;

    @Size(max = 500)
    private String locationOrUrl;

    private String instructions;

    public ScheduleInterviewRequest() {}

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
}
