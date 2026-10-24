package com.placera.backend.dto;

import com.placera.backend.entity.Company;

public class CompanyDto {

    private Long id;
    private String name;
    private String description;
    private String industry;
    private String website;
    private String location;
    private String logoUrl;
    private boolean active;
    private long activeJobsCount;

    public CompanyDto() {}

    public static CompanyDto fromEntity(Company company) {
        if (company == null) return null;
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setDescription(company.getDescription());
        dto.setIndustry(company.getIndustry());
        dto.setWebsite(company.getWebsite());
        dto.setLocation(company.getLocation());
        dto.setLogoUrl(company.getLogoUrl());
        dto.setActive(company.isActive());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getActiveJobsCount() { return activeJobsCount; }
    public void setActiveJobsCount(long activeJobsCount) { this.activeJobsCount = activeJobsCount; }
}
