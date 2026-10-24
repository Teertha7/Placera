package com.placera.backend.service;

import com.placera.backend.dto.JobEligibilityCheckResult;
import com.placera.backend.entity.Job;
import com.placera.backend.entity.JobEligibilityRule;
import com.placera.backend.entity.StudentProfile;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityService {

    public JobEligibilityCheckResult evaluateEligibility(StudentProfile student, Job job) {
        JobEligibilityCheckResult result = new JobEligibilityCheckResult();
        List<String> reasons = new ArrayList<>();

        result.setStudentCgpa(student.getCgpa());
        result.setStudentBacklogs(student.getBacklogCount());
        result.setStudentDepartment(student.getDepartment());
        result.setStudentGraduationYear(student.getGraduationYear());

        JobEligibilityRule rule = job.getEligibilityRule();
        if (rule == null) {
            result.setEligible(true);
            return result;
        }

        result.setRequiredMinCgpa(rule.getMinCgpa());
        result.setAllowedMaxBacklogs(rule.getMaxBacklogs());

        // Parse allowed departments
        List<String> allowedDepts = Arrays.stream(rule.getAllowedDepartments().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        result.setAllowedDepartments(allowedDepts);

        // Parse allowed graduation years
        List<Integer> allowedYears = Arrays.stream(rule.getAllowedGraduationYears().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
        result.setAllowedGraduationYears(allowedYears);

        // 1. CGPA Check
        if (rule.getMinCgpa() != null && student.getCgpa().compareTo(rule.getMinCgpa()) < 0) {
            reasons.add(String.format("Minimum required CGPA is %.2f, but your current CGPA is %.2f",
                    rule.getMinCgpa(), student.getCgpa()));
        }

        // 2. Backlogs Check
        if (rule.getMaxBacklogs() != null && student.getBacklogCount() > rule.getMaxBacklogs()) {
            reasons.add(String.format("Maximum allowed backlogs is %d, but you currently have %d",
                    rule.getMaxBacklogs(), student.getBacklogCount()));
        }

        // 3. Department Check
        boolean deptMatch = allowedDepts.stream()
                .anyMatch(d -> d.equalsIgnoreCase(student.getDepartment()));
        if (!deptMatch) {
            reasons.add(String.format("Job is not open to your department ('%s'). Eligible: %s",
                    student.getDepartment(), String.join(", ", allowedDepts)));
        }

        // 4. Graduation Year Check
        boolean yearMatch = allowedYears.contains(student.getGraduationYear());
        if (!yearMatch) {
            reasons.add(String.format("Job is for %s batch, but your graduation year is %d",
                    allowedYears.toString(), student.getGraduationYear()));
        }

        result.setEligible(reasons.isEmpty());
        result.setReasons(reasons);
        return result;
    }
}
