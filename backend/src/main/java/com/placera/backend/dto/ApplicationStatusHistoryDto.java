package com.placera.backend.dto;

import com.placera.backend.entity.ApplicationStatus;
import com.placera.backend.entity.ApplicationStatusHistory;
import java.time.Instant;

public class ApplicationStatusHistoryDto {

    private Long id;
    private ApplicationStatus previousStatus;
    private ApplicationStatus newStatus;
    private String changedByName;
    private String reasonOrNote;
    private Instant createdAt;

    public ApplicationStatusHistoryDto() {}

    public static ApplicationStatusHistoryDto fromEntity(ApplicationStatusHistory history) {
        if (history == null) return null;
        ApplicationStatusHistoryDto dto = new ApplicationStatusHistoryDto();
        dto.setId(history.getId());
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        if (history.getChangedByUser() != null) {
            dto.setChangedByName(history.getChangedByUser().getFullName());
        }
        dto.setReasonOrNote(history.getReasonOrNote());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ApplicationStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ApplicationStatus previousStatus) { this.previousStatus = previousStatus; }

    public ApplicationStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ApplicationStatus newStatus) { this.newStatus = newStatus; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getReasonOrNote() { return reasonOrNote; }
    public void setReasonOrNote(String reasonOrNote) { this.reasonOrNote = reasonOrNote; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
