package com.placera.backend.service;

import com.placera.backend.dto.JobEligibilityCheckResult;
import com.placera.backend.entity.Job;
import com.placera.backend.entity.JobEligibilityRule;
import com.placera.backend.entity.StudentProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityServiceTest {

    private EligibilityService eligibilityService;

    @BeforeEach
    void setUp() {
        eligibilityService = new EligibilityService();
    }

    @Test
    @DisplayName("Should evaluate eligible when student meets all criteria")
    void testEligibleStudent() {
        StudentProfile student = new StudentProfile();
        student.setCgpa(new BigDecimal("8.50"));
        student.setBacklogCount(0);
        student.setDepartment("Computer Science");
        student.setGraduationYear(2026);

        Job job = new Job();
        JobEligibilityRule rule = new JobEligibilityRule(job, new BigDecimal("7.50"), 0,
                "Computer Science,Information Technology", "2026");
        job.setEligibilityRule(rule);

        JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(student, job);

        assertTrue(result.isEligible());
        assertTrue(result.getReasons().isEmpty());
    }

    @Test
    @DisplayName("Should evaluate ineligible when CGPA is below minimum threshold")
    void testIneligibleCgpa() {
        StudentProfile student = new StudentProfile();
        student.setCgpa(new BigDecimal("7.20"));
        student.setBacklogCount(0);
        student.setDepartment("Computer Science");
        student.setGraduationYear(2026);

        Job job = new Job();
        JobEligibilityRule rule = new JobEligibilityRule(job, new BigDecimal("8.00"), 0,
                "Computer Science", "2026");
        job.setEligibilityRule(rule);

        JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(student, job);

        assertFalse(result.isEligible());
        assertEquals(1, result.getReasons().size());
        assertTrue(result.getReasons().get(0).contains("Minimum required CGPA"));
    }

    @Test
    @DisplayName("Should evaluate ineligible when backlogs exceed limit")
    void testIneligibleBacklogs() {
        StudentProfile student = new StudentProfile();
        student.setCgpa(new BigDecimal("8.50"));
        student.setBacklogCount(2);
        student.setDepartment("Computer Science");
        student.setGraduationYear(2026);

        Job job = new Job();
        JobEligibilityRule rule = new JobEligibilityRule(job, new BigDecimal("7.00"), 0,
                "Computer Science", "2026");
        job.setEligibilityRule(rule);

        JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(student, job);

        assertFalse(result.isEligible());
        assertTrue(result.getReasons().stream().anyMatch(r -> r.contains("Maximum allowed backlogs")));
    }

    @Test
    @DisplayName("Should evaluate ineligible when department is not allowed")
    void testIneligibleDepartment() {
        StudentProfile student = new StudentProfile();
        student.setCgpa(new BigDecimal("9.00"));
        student.setBacklogCount(0);
        student.setDepartment("Civil Engineering");
        student.setGraduationYear(2026);

        Job job = new Job();
        JobEligibilityRule rule = new JobEligibilityRule(job, new BigDecimal("7.00"), 0,
                "Computer Science,Information Technology", "2026");
        job.setEligibilityRule(rule);

        JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(student, job);

        assertFalse(result.isEligible());
        assertTrue(result.getReasons().stream().anyMatch(r -> r.contains("Job is not open to your department")));
    }

    @Test
    @DisplayName("Should evaluate ineligible when graduation year does not match")
    void testIneligibleGraduationYear() {
        StudentProfile student = new StudentProfile();
        student.setCgpa(new BigDecimal("8.50"));
        student.setBacklogCount(0);
        student.setDepartment("Computer Science");
        student.setGraduationYear(2024);

        Job job = new Job();
        JobEligibilityRule rule = new JobEligibilityRule(job, new BigDecimal("7.00"), 0,
                "Computer Science", "2025,2026");
        job.setEligibilityRule(rule);

        JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(student, job);

        assertFalse(result.isEligible());
        assertTrue(result.getReasons().stream().anyMatch(r -> r.contains("graduation year")));
    }
}
