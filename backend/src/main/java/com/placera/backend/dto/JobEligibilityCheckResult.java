package com.placera.backend.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class JobEligibilityCheckResult {

    private boolean eligible;
    private List<String> reasons = new ArrayList<>();
    private BigDecimal studentCgpa;
    private BigDecimal requiredMinCgpa;
    private Integer studentBacklogs;
    private Integer allowedMaxBacklogs;
    private String studentDepartment;
    private List<String> allowedDepartments;
    private Integer studentGraduationYear;
    private List<Integer> allowedGraduationYears;

    public JobEligibilityCheckResult() {}

    public JobEligibilityCheckResult(boolean eligible) {
        this.eligible = eligible;
    }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public BigDecimal getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(BigDecimal studentCgpa) { this.studentCgpa = studentCgpa; }

    public BigDecimal getRequiredMinCgpa() { return requiredMinCgpa; }
    public void setRequiredMinCgpa(BigDecimal requiredMinCgpa) { this.requiredMinCgpa = requiredMinCgpa; }

    public Integer getStudentBacklogs() { return studentBacklogs; }
    public void setStudentBacklogs(Integer studentBacklogs) { this.studentBacklogs = studentBacklogs; }

    public Integer getAllowedMaxBacklogs() { return allowedMaxBacklogs; }
    public void setAllowedMaxBacklogs(Integer allowedMaxBacklogs) { this.allowedMaxBacklogs = allowedMaxBacklogs; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public List<String> getAllowedDepartments() { return allowedDepartments; }
    public void setAllowedDepartments(List<String> allowedDepartments) { this.allowedDepartments = allowedDepartments; }

    public Integer getStudentGraduationYear() { return studentGraduationYear; }
    public void setStudentGraduationYear(Integer studentGraduationYear) { this.studentGraduationYear = studentGraduationYear; }

    public List<Integer> getAllowedGraduationYears() { return allowedGraduationYears; }
    public void setAllowedGraduationYears(List<Integer> allowedGraduationYears) { this.allowedGraduationYears = allowedGraduationYears; }
}
