package com.placera.backend.dto;

import com.placera.backend.entity.Job;
import com.placera.backend.entity.JobStatus;
import com.placera.backend.entity.JobType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

public class JobDto {

    private Long id;
    private CompanyDto company;
    private String title;
    private String description;
    private JobType jobType;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryCurrency;
    private JobStatus status;
    private Instant deadline;
    private Instant createdAt;
    private JobEligibilityRuleDto eligibilityRule;
    private List<String> requiredSkills;
    private long applicantsCount;
    private boolean expired;
    private Boolean userEligible;
    private List<String> ineligibilityReasons;

    public JobDto() {}

    public static JobDto fromEntity(Job job) {
        if (job == null) return null;
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setCompany(CompanyDto.fromEntity(job.getCompany()));
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setJobType(job.getJobType());
        dto.setLocation(job.getLocation());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setSalaryCurrency(job.getSalaryCurrency());
        dto.setStatus(job.getStatus());
        dto.setDeadline(job.getDeadline());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpired(job.getDeadline() != null && job.getDeadline().isBefore(Instant.now()));

        if (job.getEligibilityRule() != null) {
            dto.setEligibilityRule(JobEligibilityRuleDto.fromEntity(job.getEligibilityRule()));
        }

        if (job.getRequiredSkills() != null) {
            dto.setRequiredSkills(job.getRequiredSkills().stream()
                    .map(s -> s.getSkillName())
                    .toList());
        } else {
            dto.setRequiredSkills(Collections.emptyList());
        }

        if (job.getApplications() != null) {
            dto.setApplicantsCount(job.getApplications().size());
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CompanyDto getCompany() { return company; }
    public void setCompany(CompanyDto company) { this.company = company; }

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

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public JobEligibilityRuleDto getEligibilityRule() { return eligibilityRule; }
    public void setEligibilityRule(JobEligibilityRuleDto eligibilityRule) { this.eligibilityRule = eligibilityRule; }

    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public long getApplicantsCount() { return applicantsCount; }
    public void setApplicantsCount(long applicantsCount) { this.applicantsCount = applicantsCount; }

    public boolean isExpired() { return expired; }
    public void setExpired(boolean expired) { this.expired = expired; }

    public Boolean getUserEligible() { return userEligible; }
    public void setUserEligible(Boolean userEligible) { this.userEligible = userEligible; }

    public List<String> getIneligibilityReasons() { return ineligibilityReasons; }
    public void setIneligibilityReasons(List<String> ineligibilityReasons) { this.ineligibilityReasons = ineligibilityReasons; }
}
