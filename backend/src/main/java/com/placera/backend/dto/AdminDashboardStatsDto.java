package com.placera.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardStatsDto {

    private long totalStudents;
    private long totalCompanies;
    private long totalPublishedJobs;
    private long totalApplications;
    private long totalShortlisted;
    private long totalInterviewsScheduled;
    private long totalOffersMade;
    private long distinctStudentsWithOffers;
    private double placementRatePercentage; // (distinct students with offers / total eligible registered students) * 100
    private double shortlistingRatePercentage; // (total shortlisted / total applications) * 100
    private double interviewToOfferConversionPercentage; // (total offers / total interviews) * 100

    private List<Map<String, Object>> statusDistribution;
    private List<Map<String, Object>> applicationsByDepartment;
    private List<Map<String, Object>> topCompaniesByApplications;
    private List<Map<String, Object>> offersByDepartment;
    private List<Map<String, Object>> offersByGraduationYear;

    public AdminDashboardStatsDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getTotalPublishedJobs() { return totalPublishedJobs; }
    public void setTotalPublishedJobs(long totalPublishedJobs) { this.totalPublishedJobs = totalPublishedJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalShortlisted() { return totalShortlisted; }
    public void setTotalShortlisted(long totalShortlisted) { this.totalShortlisted = totalShortlisted; }

    public long getTotalInterviewsScheduled() { return totalInterviewsScheduled; }
    public void setTotalInterviewsScheduled(long totalInterviewsScheduled) { this.totalInterviewsScheduled = totalInterviewsScheduled; }

    public long getTotalOffersMade() { return totalOffersMade; }
    public void setTotalOffersMade(long totalOffersMade) { this.totalOffersMade = totalOffersMade; }

    public long getDistinctStudentsWithOffers() { return distinctStudentsWithOffers; }
    public void setDistinctStudentsWithOffers(long distinctStudentsWithOffers) { this.distinctStudentsWithOffers = distinctStudentsWithOffers; }

    public double getPlacementRatePercentage() { return placementRatePercentage; }
    public void setPlacementRatePercentage(double placementRatePercentage) { this.placementRatePercentage = placementRatePercentage; }

    public double getShortlistingRatePercentage() { return shortlistingRatePercentage; }
    public void setShortlistingRatePercentage(double shortlistingRatePercentage) { this.shortlistingRatePercentage = shortlistingRatePercentage; }

    public double getInterviewToOfferConversionPercentage() { return interviewToOfferConversionPercentage; }
    public void setInterviewToOfferConversionPercentage(double interviewToOfferConversionPercentage) { this.interviewToOfferConversionPercentage = interviewToOfferConversionPercentage; }

    public List<Map<String, Object>> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(List<Map<String, Object>> statusDistribution) { this.statusDistribution = statusDistribution; }

    public List<Map<String, Object>> getApplicationsByDepartment() { return applicationsByDepartment; }
    public void setApplicationsByDepartment(List<Map<String, Object>> applicationsByDepartment) { this.applicationsByDepartment = applicationsByDepartment; }

    public List<Map<String, Object>> getTopCompaniesByApplications() { return topCompaniesByApplications; }
    public void setTopCompaniesByApplications(List<Map<String, Object>> topCompaniesByApplications) { this.topCompaniesByApplications = topCompaniesByApplications; }

    public List<Map<String, Object>> getOffersByDepartment() { return offersByDepartment; }
    public void setOffersByDepartment(List<Map<String, Object>> offersByDepartment) { this.offersByDepartment = offersByDepartment; }

    public List<Map<String, Object>> getOffersByGraduationYear() { return offersByGraduationYear; }
    public void setOffersByGraduationYear(List<Map<String, Object>> offersByGraduationYear) { this.offersByGraduationYear = offersByGraduationYear; }
}
