package com.placera.backend.service;

import com.placera.backend.dto.*;
import com.placera.backend.entity.*;
import com.placera.backend.exception.BadRequestException;
import com.placera.backend.exception.ResourceNotFoundException;
import com.placera.backend.repository.JobEligibilityRuleRepository;
import com.placera.backend.repository.JobRepository;
import com.placera.backend.repository.StudentProfileRepository;
import com.placera.backend.repository.UserRepository;
import com.placera.backend.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobEligibilityRuleRepository eligibilityRuleRepository;
    private final CompanyService companyService;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final EligibilityService eligibilityService;
    private final AuditService auditService;

    public JobService(
            JobRepository jobRepository,
            JobEligibilityRuleRepository eligibilityRuleRepository,
            CompanyService companyService,
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            EligibilityService eligibilityService,
            AuditService auditService) {
        this.jobRepository = jobRepository;
        this.eligibilityRuleRepository = eligibilityRuleRepository;
        this.companyService = companyService;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.eligibilityService = eligibilityService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<JobDto> searchJobs(JobStatus status, JobType jobType, String location, Long companyId,
                                   boolean activeDeadlineOnly, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Instant now = Instant.now();

        Page<Job> jobs = jobRepository.searchJobs(status, jobType, location, companyId, activeDeadlineOnly, now, query, pageable);

        // Check if currently authenticated user is a student to annotate eligibility
        StudentProfile studentProfile = null;
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            studentProfile = studentProfileRepository.findByUserId(userId).orElse(null);
        } catch (Exception ignored) {}

        final StudentProfile finalStudent = studentProfile;

        return jobs.map(job -> {
            JobDto dto = JobDto.fromEntity(job);
            if (finalStudent != null) {
                JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(finalStudent, job);
                dto.setUserEligible(result.isEligible());
                dto.setIneligibilityReasons(result.getReasons());
            }
            return dto;
        });
    }

    @Transactional(readOnly = true)
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        JobDto dto = JobDto.fromEntity(job);

        try {
            Long userId = SecurityUtils.getCurrentUserId();
            Optional<StudentProfile> sp = studentProfileRepository.findByUserId(userId);
            if (sp.isPresent()) {
                JobEligibilityCheckResult result = eligibilityService.evaluateEligibility(sp.get(), job);
                dto.setUserEligible(result.isEligible());
                dto.setIneligibilityReasons(result.getReasons());
            }
        } catch (Exception ignored) {}

        return dto;
    }

    @Transactional(readOnly = true)
    public JobEligibilityCheckResult checkEligibilityForCurrentStudent(Long jobId) {
        Long userId = SecurityUtils.getCurrentUserId();
        StudentProfile student = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        return eligibilityService.evaluateEligibility(student, job);
    }

    @Transactional(readOnly = true)
    public Job getEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    @Transactional
    public JobDto createJob(CreateJobRequest request) {
        Company company = companyService.getEntityById(request.getCompanyId());

        Long adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId).orElse(null);

        JobStatus initialStatus = request.isPublishImmediately() ? JobStatus.PUBLISHED : JobStatus.DRAFT;

        Job job = new Job(
                company,
                request.getTitle().trim(),
                request.getDescription(),
                request.getJobType(),
                request.getLocation().trim(),
                request.getSalaryMin(),
                request.getSalaryMax(),
                request.getSalaryCurrency(),
                initialStatus,
                request.getDeadline(),
                admin
        );

        // Required skills
        if (request.getRequiredSkills() != null) {
            for (String skill : request.getRequiredSkills()) {
                if (skill != null && !skill.isBlank()) {
                    job.addSkill(skill.trim());
                }
            }
        }

        // Eligibility rule
        String allowedDepts = String.join(",", request.getAllowedDepartments());
        String allowedYears = String.join(",", request.getAllowedGraduationYears().stream().map(Object::toString).toList());
        JobEligibilityRule rule = new JobEligibilityRule(job, request.getMinCgpa(), request.getMaxBacklogs(), allowedDepts, allowedYears);
        job.setEligibilityRule(rule);

        Job saved = jobRepository.save(job);
        auditService.logEvent(admin, "CREATE_JOB", "Job", saved.getId().toString(),
                "Created job: " + saved.getTitle() + " for " + company.getName(), null);

        return JobDto.fromEntity(saved);
    }

    @Transactional
    public JobDto updateJob(Long id, UpdateJobRequest request) {
        Job job = getEntityById(id);

        if (request.getTitle() != null) job.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getLocation() != null) job.setLocation(request.getLocation().trim());
        if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
        if (request.getSalaryCurrency() != null) job.setSalaryCurrency(request.getSalaryCurrency());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());

        if (request.getRequiredSkills() != null) {
            job.getRequiredSkills().clear();
            for (String s : request.getRequiredSkills()) {
                if (s != null && !s.isBlank()) {
                    job.addSkill(s.trim());
                }
            }
        }

        JobEligibilityRule rule = job.getEligibilityRule();
        if (rule != null) {
            if (request.getMinCgpa() != null) rule.setMinCgpa(request.getMinCgpa());
            if (request.getMaxBacklogs() != null) rule.setMaxBacklogs(request.getMaxBacklogs());
            if (request.getAllowedDepartments() != null && !request.getAllowedDepartments().isEmpty()) {
                rule.setAllowedDepartments(String.join(",", request.getAllowedDepartments()));
            }
            if (request.getAllowedGraduationYears() != null && !request.getAllowedGraduationYears().isEmpty()) {
                rule.setAllowedGraduationYears(String.join(",", request.getAllowedGraduationYears().stream().map(Object::toString).toList()));
            }
        }

        Job updated = jobRepository.save(job);
        auditService.logEvent(null, "UPDATE_JOB", "Job", updated.getId().toString(), "Updated job details", null);

        return JobDto.fromEntity(updated);
    }

    @Transactional
    public JobDto publishJob(Long id) {
        Job job = getEntityById(id);
        if (job.getDeadline().isBefore(Instant.now())) {
            throw new BadRequestException("Cannot publish a job with an expired deadline. Please update the deadline first.");
        }
        job.setStatus(JobStatus.PUBLISHED);
        Job updated = jobRepository.save(job);
        auditService.logEvent(null, "PUBLISH_JOB", "Job", updated.getId().toString(), "Published job: " + job.getTitle(), null);
        return JobDto.fromEntity(updated);
    }

    @Transactional
    public JobDto closeJob(Long id) {
        Job job = getEntityById(id);
        job.setStatus(JobStatus.CLOSED);
        Job updated = jobRepository.save(job);
        auditService.logEvent(null, "CLOSE_JOB", "Job", updated.getId().toString(), "Closed job: " + job.getTitle(), null);
        return JobDto.fromEntity(updated);
    }
}
