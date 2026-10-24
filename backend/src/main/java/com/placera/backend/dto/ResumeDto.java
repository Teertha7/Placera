package com.placera.backend.dto;

import com.placera.backend.entity.Resume;
import java.time.Instant;

public class ResumeDto {

    private Long id;
    private String fileName;
    private String contentType;
    private Long fileSizeBytes;
    private Instant uploadedAt;

    public ResumeDto() {}

    public static ResumeDto fromEntity(Resume resume) {
        if (resume == null) return null;
        ResumeDto dto = new ResumeDto();
        dto.setId(resume.getId());
        dto.setFileName(resume.getFileName());
        dto.setContentType(resume.getContentType());
        dto.setFileSizeBytes(resume.getFileSizeBytes());
        dto.setUploadedAt(resume.getUploadedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
