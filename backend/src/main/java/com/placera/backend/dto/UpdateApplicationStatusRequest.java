package com.placera.backend.dto;

import com.placera.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicationStatusRequest {

    @NotNull(message = "New application status is required")
    private ApplicationStatus status;

    private String reasonOrNote;

    private String internalNotes;

    public UpdateApplicationStatusRequest() {}

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getReasonOrNote() { return reasonOrNote; }
    public void setReasonOrNote(String reasonOrNote) { this.reasonOrNote = reasonOrNote; }

    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
}
