package com.placera.backend.dto;

import com.placera.backend.entity.JobType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class CreateJobRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Job title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotBlank(message = "Location is required")
    @Size(max = 255)
    private String location;

    @DecimalMin(value = "0.00")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.00")
    private BigDecimal salaryMax;

    private String salaryCurrency = "INR";

    @NotNull(message = "Application deadline is required")
    @Future(message = "Application deadline must be in the future")
    private Instant deadline;

    // Eligibility Criteria
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "10.00")
    private BigDecimal minCgpa = BigDecimal.ZERO;

    @Min(value = 0)
    private Integer maxBacklogs = 0;

    @NotEmpty(message = "At least one allowed department must be specified")
    private List<String> allowedDepartments;

    @NotEmpty(message = "At least one allowed graduation year must be specified")
    private List<Integer> allowedGraduationYears;

    private List<String> requiredSkills;

    private boolean publishImmediately = false;

    public CreateJobRequest() {}

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getSalaryMin() { return salaryMin; }
    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }

    public BigDecimal getSalaryMax() { return salaryMax; }
    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }

    public String getSalaryCurrency() { return salaryCurrency; }
    public void setSalaryCurrency(String salaryCurrency) { this.salaryCurrency = salaryCurrency; }

    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }

    public BigDecimal getMinCgpa() { return minCgpa; }
    public void setMinCgpa(BigDecimal minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public List<String> getAllowedDepartments() { return allowedDepartments; }
    public void setAllowedDepartments(List<String> allowedDepartments) { this.allowedDepartments = allowedDepartments; }

    public List<Integer> getAllowedGraduationYears() { return allowedGraduationYears; }
    public void setAllowedGraduationYears(List<Integer> allowedGraduationYears) { this.allowedGraduationYears = allowedGraduationYears; }

    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public boolean isPublishImmediately() { return publishImmediately; }
    public void setPublishImmediately(boolean publishImmediately) { this.publishImmediately = publishImmediately; }
}
