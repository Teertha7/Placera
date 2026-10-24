package com.placera.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 255)
    private String name;

    private String description;

    @NotBlank(message = "Industry is required")
    @Size(max = 100)
    private String industry;

    @Size(max = 500)
    private String website;

    @Size(max = 255)
    private String location;

    @Size(max = 500)
    private String logoUrl;

    public CreateCompanyRequest() {}

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
}
