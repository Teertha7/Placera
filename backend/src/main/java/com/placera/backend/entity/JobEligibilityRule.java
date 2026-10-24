package com.placera.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "job_eligibility_rules")
public class JobEligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal minCgpa = BigDecimal.ZERO;

    @Column(name = "max_backlogs", nullable = false)
    private Integer maxBacklogs = 0;

    @Column(name = "allowed_departments", nullable = false, columnDefinition = "TEXT")
    private String allowedDepartments; // comma-separated, e.g. "Computer Science,Information Technology,Electronics"

    @Column(name = "allowed_graduation_years", nullable = false, columnDefinition = "TEXT")
    private String allowedGraduationYears; // comma-separated, e.g. "2025,2026"

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public JobEligibilityRule() {}

    public JobEligibilityRule(Job job, BigDecimal minCgpa, Integer maxBacklogs,
                              String allowedDepartments, String allowedGraduationYears) {
        this.job = job;
        this.minCgpa = minCgpa != null ? minCgpa : BigDecimal.ZERO;
        this.maxBacklogs = maxBacklogs != null ? maxBacklogs : 0;
        this.allowedDepartments = allowedDepartments;
        this.allowedGraduationYears = allowedGraduationYears;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public BigDecimal getMinCgpa() { return minCgpa; }
    public void setMinCgpa(BigDecimal minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public String getAllowedDepartments() { return allowedDepartments; }
    public void setAllowedDepartments(String allowedDepartments) { this.allowedDepartments = allowedDepartments; }

    public String getAllowedGraduationYears() { return allowedGraduationYears; }
    public void setAllowedGraduationYears(String allowedGraduationYears) { this.allowedGraduationYears = allowedGraduationYears; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
