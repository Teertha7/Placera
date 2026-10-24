package com.placera.backend.dto;

import com.placera.backend.entity.StudentProfile;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

public class StudentProfileDto {

    private Long id;
    private Long userId;
    private UserDto user;
    private String registrationNumber;
    private String department;
    private String degree;
    private Integer graduationYear;
    private BigDecimal cgpa;
    private Integer backlogCount;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private List<ResumeDto> resumes;
    private ResumeDto activeResume;
    private long activeApplicationsCount;
    private long offersCount;

    public StudentProfileDto() {}

    public static StudentProfileDto fromEntity(StudentProfile sp) {
        if (sp == null) return null;
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(sp.getId());
        if (sp.getUser() != null) {
            dto.setUserId(sp.getUser().getId());
            dto.setUser(UserDto.fromEntity(sp.getUser()));
        }
        dto.setRegistrationNumber(sp.getRegistrationNumber());
        dto.setDepartment(sp.getDepartment());
        dto.setDegree(sp.getDegree());
        dto.setGraduationYear(sp.getGraduationYear());
        dto.setCgpa(sp.getCgpa());
        dto.setBacklogCount(sp.getBacklogCount());
        dto.setSkills(sp.getSkills());
        dto.setLinkedinUrl(sp.getLinkedinUrl());
        dto.setGithubUrl(sp.getGithubUrl());
        dto.setPortfolioUrl(sp.getPortfolioUrl());

        if (sp.getResumes() != null) {
            List<ResumeDto> list = sp.getResumes().stream()
                    .filter(r -> r.isActive())
                    .map(ResumeDto::fromEntity)
                    .toList();
            dto.setResumes(list);
            if (!list.isEmpty()) {
                dto.setActiveResume(list.get(0));
            }
        } else {
            dto.setResumes(Collections.emptyList());
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public BigDecimal getCgpa() { return cgpa; }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; }

    public Integer getBacklogCount() { return backlogCount; }
    public void setBacklogCount(Integer backlogCount) { this.backlogCount = backlogCount; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public List<ResumeDto> getResumes() { return resumes; }
    public void setResumes(List<ResumeDto> resumes) { this.resumes = resumes; }

    public ResumeDto getActiveResume() { return activeResume; }
    public void setActiveResume(ResumeDto activeResume) { this.activeResume = activeResume; }

    public long getActiveApplicationsCount() { return activeApplicationsCount; }
    public void setActiveApplicationsCount(long activeApplicationsCount) { this.activeApplicationsCount = activeApplicationsCount; }

    public long getOffersCount() { return offersCount; }
    public void setOffersCount(long offersCount) { this.offersCount = offersCount; }
}
