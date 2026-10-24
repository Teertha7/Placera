package com.placera.backend.service;

import com.placera.backend.dto.AdminDashboardStatsDto;
import com.placera.backend.entity.Application;
import com.placera.backend.entity.ApplicationStatus;
import com.placera.backend.entity.InterviewStatus;
import com.placera.backend.entity.Role;
import com.placera.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public AnalyticsService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();

        long totalStudents = studentProfileRepository.count();
        long totalCompanies = companyRepository.count();
        long totalPublishedJobs = jobRepository.countActivePublishedJobs(Instant.now());
        long totalApplications = applicationRepository.count();
        long totalShortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long totalInterviews = interviewRepository.countByStatus(InterviewStatus.SCHEDULED) +
                interviewRepository.countByStatus(InterviewStatus.COMPLETED);
        long totalOffers = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long distinctStudentsWithOffers = applicationRepository.countDistinctStudentsWithOffers();

        stats.setTotalStudents(totalStudents);
        stats.setTotalCompanies(totalCompanies);
        stats.setTotalPublishedJobs(totalPublishedJobs);
        stats.setTotalApplications(totalApplications);
        stats.setTotalShortlisted(totalShortlisted);
        stats.setTotalInterviewsScheduled(totalInterviews);
        stats.setTotalOffersMade(totalOffers);
        stats.setDistinctStudentsWithOffers(distinctStudentsWithOffers);

        // Meaning of Placement Rate:
        // Denominator: Total registered student profiles
        // Numerator: Distinct students who have received at least one offer (SELECTED status)
        double placementRate = (totalStudents > 0)
                ? ((double) distinctStudentsWithOffers / totalStudents) * 100.0
                : 0.0;
        stats.setPlacementRatePercentage(Math.round(placementRate * 100.0) / 100.0);

        // Shortlisting Rate: (Total shortlisted / Total applications) * 100
        double shortlistingRate = (totalApplications > 0)
                ? ((double) totalShortlisted / totalApplications) * 100.0
                : 0.0;
        stats.setShortlistingRatePercentage(Math.round(shortlistingRate * 100.0) / 100.0);

        // Interview to Offer Conversion: (Total Offers / Total Interviews) * 100
        double conversionRate = (totalInterviews > 0)
                ? ((double) totalOffers / totalInterviews) * 100.0
                : 0.0;
        stats.setInterviewToOfferConversionPercentage(Math.round(conversionRate * 100.0) / 100.0);

        // Aggregated distribution charts
        stats.setStatusDistribution(mapStatusDistribution(applicationRepository.countApplicationsByStatus()));
        stats.setApplicationsByDepartment(mapDepartmentDistribution(applicationRepository.countApplicationsByDepartment()));
        stats.setTopCompaniesByApplications(mapCompanyDistribution(applicationRepository.countApplicationsByCompany()));
        stats.setOffersByDepartment(mapOffersByDepartment(applicationRepository.countOffersByDepartment()));
        stats.setOffersByGraduationYear(mapOffersByGraduationYear(applicationRepository.countOffersByGraduationYear()));

        return stats;
    }

    private List<Map<String, Object>> mapStatusDistribution(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> map = new HashMap<>();
            map.put("status", row[0].toString());
            map.put("count", row[1]);
            list.add(map);
        }
        return list;
    }

    private List<Map<String, Object>> mapDepartmentDistribution(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> map = new HashMap<>();
            map.put("department", row[0] != null ? row[0].toString() : "Unknown");
            map.put("count", row[1]);
            list.add(map);
        }
        return list;
    }

    private List<Map<String, Object>> mapCompanyDistribution(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> map = new HashMap<>();
            map.put("company", row[0].toString());
            map.put("count", row[1]);
            list.add(map);
        }
        return list;
    }

    private List<Map<String, Object>> mapOffersByDepartment(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> map = new HashMap<>();
            map.put("department", row[0] != null ? row[0].toString() : "Unknown");
            map.put("offers", row[1]);
            list.add(map);
        }
        return list;
    }

    private List<Map<String, Object>> mapOffersByGraduationYear(List<Object[]> raw) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : raw) {
            Map<String, Object> map = new HashMap<>();
            map.put("graduationYear", row[0]);
            map.put("studentsPlaced", row[1]);
            list.add(map);
        }
        return list;
    }

    @Transactional(readOnly = true)
    public byte[] exportApplicationsReportCsv() {
        List<Application> applications = applicationRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write CSV Header
            writer.println("Application ID,Student Name,Registration Number,Department,Degree,Graduation Year,CGPA,Company,Job Title,Job Type,Salary Range,Status,Applied Date");

            for (Application app : applications) {
                String id = sanitizeCsvCell(app.getId().toString());
                String studentName = sanitizeCsvCell(app.getStudent().getUser().getFullName());
                String regNo = sanitizeCsvCell(app.getStudent().getRegistrationNumber());
                String dept = sanitizeCsvCell(app.getStudent().getDepartment());
                String degree = sanitizeCsvCell(app.getStudent().getDegree());
                String gradYear = sanitizeCsvCell(app.getStudent().getGraduationYear().toString());
                String cgpa = sanitizeCsvCell(app.getStudent().getCgpa().toString());
                String company = sanitizeCsvCell(app.getJob().getCompany().getName());
                String jobTitle = sanitizeCsvCell(app.getJob().getTitle());
                String jobType = sanitizeCsvCell(app.getJob().getJobType().name());
                String salary = sanitizeCsvCell(app.getJob().getSalaryMin() + " - " + app.getJob().getSalaryMax() + " " + app.getJob().getSalaryCurrency());
                String status = sanitizeCsvCell(app.getStatus().name());
                String appliedDate = sanitizeCsvCell(app.getCreatedAt().toString());

                writer.println(String.join(",",
                        id, studentName, regNo, dept, degree, gradYear, cgpa,
                        company, jobTitle, jobType, salary, status, appliedDate));
            }
        }
        return out.toByteArray();
    }

    /**
     * Prevent CSV Formula Injection by prepending an apostrophe if the field starts with
     * '=', '+', '-', '@', tab, or carriage return, and quoting properly.
     */
    private String sanitizeCsvCell(String value) {
        if (value == null) return "\"\"";
        String trimmed = value.trim();
        if (trimmed.startsWith("=") || trimmed.startsWith("+") || trimmed.startsWith("-") || trimmed.startsWith("@")
                || trimmed.startsWith("\t") || trimmed.startsWith("\r")) {
            trimmed = "'" + trimmed;
        }
        // Escape quotes
        trimmed = trimmed.replace("\"", "\"\"");
        return "\"" + trimmed + "\"";
    }
}
