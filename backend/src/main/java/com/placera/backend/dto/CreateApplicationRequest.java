package com.placera.backend.dto;

public class CreateApplicationRequest {

    private Long resumeId; // Optional: If omitted, uses student's latest active resume

    public CreateApplicationRequest() {}

    public CreateApplicationRequest(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
}
