package com.placera.backend.dto;

import com.placera.backend.entity.JobEligibilityRule;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class JobEligibilityRuleDto {

    private BigDecimal minCgpa;
    private Integer maxBacklogs;
    private List<String> allowedDepartments;
    private List<Integer> allowedGraduationYears;

    public JobEligibilityRuleDto() {}

    public static JobEligibilityRuleDto fromEntity(JobEligibilityRule rule) {
        if (rule == null) return null;
        JobEligibilityRuleDto dto = new JobEligibilityRuleDto();
        dto.setMinCgpa(rule.getMinCgpa());
        dto.setMaxBacklogs(rule.getMaxBacklogs());

        if (rule.getAllowedDepartments() != null && !rule.getAllowedDepartments().isBlank()) {
            dto.setAllowedDepartments(Arrays.stream(rule.getAllowedDepartments().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList());
        } else {
            dto.setAllowedDepartments(Collections.emptyList());
        }

        if (rule.getAllowedGraduationYears() != null && !rule.getAllowedGraduationYears().isBlank()) {
            dto.setAllowedGraduationYears(Arrays.stream(rule.getAllowedGraduationYears().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Integer::parseInt)
                    .toList());
        } else {
            dto.setAllowedGraduationYears(Collections.emptyList());
        }

        return dto;
    }

    public BigDecimal getMinCgpa() { return minCgpa; }
    public void setMinCgpa(BigDecimal minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public List<String> getAllowedDepartments() { return allowedDepartments; }
    public void setAllowedDepartments(List<String> allowedDepartments) { this.allowedDepartments = allowedDepartments; }

    public List<Integer> getAllowedGraduationYears() { return allowedGraduationYears; }
    public void setAllowedGraduationYears(List<Integer> allowedGraduationYears) { this.allowedGraduationYears = allowedGraduationYears; }
}
