package com.placera.backend.bootstrap;

import com.placera.backend.entity.*;
import com.placera.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${placera.admin.bootstrap-email:admin@placera.edu}")
    private String adminEmail;

    @Value("${placera.admin.bootstrap-password:AdminPlacera#2026!}")
    private String adminPassword;

    @Value("${placera.admin.bootstrap-first-name:Placement}")
    private String adminFirstName;

    @Value("${placera.admin.bootstrap-last-name:Dean}")
    private String adminLastName;

    public DataInitializer(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            InterviewRepository interviewRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.interviewRepository = interviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initAdminUser();
        initDevSampleData();
    }

    private void initAdminUser() {
        if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
            User admin = new User(
                    adminEmail.toLowerCase().trim(),
                    passwordEncoder.encode(adminPassword),
                    Role.ADMIN,
                    adminFirstName,
                    adminLastName,
                    "+91-9876543210"
            );
            userRepository.save(admin);
            log.info("Initialized bootstrap Placement Administrator account: {}", adminEmail);
        }
    }

    private void initDevSampleData() {
        if (studentProfileRepository.count() > 0) {
            log.info("Development sample data already present, skipping seed.");
            return;
        }

        log.info("Seeding fictional development sample data for demonstration...");

        User admin = userRepository.findByEmailIgnoreCase(adminEmail).orElse(null);

        // 1. Fictional Companies
        Company techFlow = new Company("TechFlow Systems", "Enterprise software solutions and scalable distributed systems",
                "Information Technology", "https://techflow-demo.example.com", "Bengaluru, India",
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80");
        companyRepository.save(techFlow);

        Company cloudScale = new Company("CloudScale Technologies", "Next-generation cloud infrastructure and DevOps automation",
                "Cloud Computing", "https://cloudscale-demo.example.com", "Hyderabad, India",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80");
        companyRepository.save(cloudScale);

        Company nexaHealth = new Company("NexaHealth Solutions", "AI-assisted clinical analytics and health informatics",
                "Healthcare Technology", "https://nexahealth-demo.example.com", "Pune, India",
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80");
        companyRepository.save(nexaHealth);

        Company finVertex = new Company("FinVertex Analytics", "High-frequency quantitative trading algorithms and risk analysis",
                "Financial Technology", "https://finvertex-demo.example.com", "Mumbai, India",
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=128&auto=format&fit=crop&q=80");
        companyRepository.save(finVertex);

        // 2. Fictional Student Accounts
        String defaultStudentPass = passwordEncoder.encode("StudentPass#2026!");

        User userRohan = new User("rohan.sharma@placera.edu", defaultStudentPass, Role.STUDENT, "Rohan", "Sharma", "+91-9123456780");
        userRepository.save(userRohan);
        StudentProfile profileRohan = new StudentProfile(userRohan, "2022BCS0142", "Computer Science", "B.Tech", 2026, new BigDecimal("8.85"), 0);
        profileRohan.setSkills("Java, Spring Boot, React, PostgreSQL, Docker");
        profileRohan.setLinkedinUrl("https://linkedin.com/in/demo-rohan");
        profileRohan.setGithubUrl("https://github.com/demo-rohan");
        studentProfileRepository.save(profileRohan);

        User userPriya = new User("priya.nair@placera.edu", defaultStudentPass, Role.STUDENT, "Priya", "Nair", "+91-9123456781");
        userRepository.save(userPriya);
        StudentProfile profilePriya = new StudentProfile(userPriya, "2022BIT0088", "Information Technology", "B.Tech", 2026, new BigDecimal("9.20"), 0);
        profilePriya.setSkills("Python, AWS, Terraform, Kubernetes, Go");
        profilePriya.setLinkedinUrl("https://linkedin.com/in/demo-priya");
        profilePriya.setGithubUrl("https://github.com/demo-priya");
        studentProfileRepository.save(profilePriya);

        User userAnanya = new User("ananya.patel@placera.edu", defaultStudentPass, Role.STUDENT, "Ananya", "Patel", "+91-9123456782");
        userRepository.save(userAnanya);
        StudentProfile profileAnanya = new StudentProfile(userAnanya, "2022ECE0055", "Electronics & Communication", "B.Tech", 2026, new BigDecimal("7.45"), 1);
        profileAnanya.setSkills("C++, Embedded Systems, Verilog, IoT");
        studentProfileRepository.save(profileAnanya);

        User userVikram = new User("vikram.verma@placera.edu", defaultStudentPass, Role.STUDENT, "Vikram", "Verma", "+91-9123456783");
        userRepository.save(userVikram);
        StudentProfile profileVikram = new StudentProfile(userVikram, "2021BME0021", "Mechanical Engineering", "B.Tech", 2025, new BigDecimal("6.90"), 0);
        profileVikram.setSkills("CAD, MATLAB, FEA, Robotics");
        studentProfileRepository.save(profileVikram);

        // 3. Fictional Jobs
        Instant futureDeadline1 = Instant.now().plus(14, ChronoUnit.DAYS);
        Instant futureDeadline2 = Instant.now().plus(21, ChronoUnit.DAYS);

        // Job 1: Full Stack Engineer @ TechFlow
        Job job1 = new Job(techFlow, "Graduate Full Stack Engineer",
                "Join our core SaaS platform engineering team to build high-throughput microservices and responsive web applications using modern Java, Spring Boot, and React.",
                JobType.FULL_TIME, "Bengaluru (Hybrid)", new BigDecimal("1200000"), new BigDecimal("1600000"), "INR",
                JobStatus.PUBLISHED, futureDeadline1, admin);
        job1.addSkill("Java");
        job1.addSkill("Spring Boot");
        job1.addSkill("React");
        job1.addSkill("PostgreSQL");
        JobEligibilityRule rule1 = new JobEligibilityRule(job1, new BigDecimal("7.50"), 0,
                "Computer Science,Information Technology", "2026");
        job1.setEligibilityRule(rule1);
        jobRepository.save(job1);

        // Job 2: Cloud Infrastructure Associate @ CloudScale
        Job job2 = new Job(cloudScale, "Cloud Infrastructure & DevOps Associate",
                "Work closely with our SRE and infrastructure operations team managing distributed Azure Container Apps, Kubernetes clusters, and Terraform deployment pipelines.",
                JobType.FULL_TIME, "Hyderabad (On-site)", new BigDecimal("1400000"), new BigDecimal("1800000"), "INR",
                JobStatus.PUBLISHED, futureDeadline2, admin);
        job2.addSkill("Cloud Computing");
        job2.addSkill("Linux");
        job2.addSkill("Docker");
        job2.addSkill("Terraform");
        JobEligibilityRule rule2 = new JobEligibilityRule(job2, new BigDecimal("8.00"), 0,
                "Computer Science,Information Technology,Electronics & Communication", "2026");
        job2.setEligibilityRule(rule2);
        jobRepository.save(job2);

        // Job 3: HealthTech Product Analyst @ NexaHealth
        Job job3 = new Job(nexaHealth, "Clinical Data Analyst Intern",
                "6-month pre-placement internship analyzing healthcare operations, clinical workflows, and system integration data with potential conversion to full-time.",
                JobType.INTERN_TO_FULL_TIME, "Pune (Remote)", new BigDecimal("50000"), new BigDecimal("75000"), "INR",
                JobStatus.PUBLISHED, futureDeadline1, admin);
        job3.addSkill("Data Analysis");
        job3.addSkill("SQL");
        job3.addSkill("Python");
        JobEligibilityRule rule3 = new JobEligibilityRule(job3, new BigDecimal("7.00"), 1,
                "Computer Science,Information Technology,Electronics & Communication,Mechanical Engineering", "2025,2026");
        job3.setEligibilityRule(rule3);
        jobRepository.save(job3);

        // Job 4: FinVertex Quantitative Trainee
        Job job4 = new Job(finVertex, "Quantitative Systems Trainee",
                "Develop algorithmic execution strategies and ultra-low latency trading pipelines using modern C++ and quantitative statistical models.",
                JobType.FULL_TIME, "Mumbai (On-site)", new BigDecimal("2000000"), new BigDecimal("2500000"), "INR",
                JobStatus.PUBLISHED, futureDeadline2, admin);
        job4.addSkill("Algorithms");
        job4.addSkill("C++");
        job4.addSkill("Statistics");
        JobEligibilityRule rule4 = new JobEligibilityRule(job4, new BigDecimal("8.50"), 0,
                "Computer Science,Information Technology", "2026");
        job4.setEligibilityRule(rule4);
        jobRepository.save(job4);

        // 4. Sample Applications across stages
        // Rohan -> TechFlow (TECHNICAL_INTERVIEW)
        Application app1 = new Application(job1, profileRohan, null);
        app1.setStatus(ApplicationStatus.TECHNICAL_INTERVIEW);
        app1.setInternalNotes("Strong algorithmic knowledge and good practical Spring Boot project portfolio.");
        applicationRepository.save(app1);
        statusHistoryRepository.save(new ApplicationStatusHistory(app1, null, ApplicationStatus.APPLIED, userRohan, "Applied via portal"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app1, ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED, admin, "Shortlisted based on CGPA and skills"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app1, ApplicationStatus.SHORTLISTED, ApplicationStatus.TECHNICAL_INTERVIEW, admin, "Passed coding assessment"));

        // Rohan -> CloudScale (APPLIED)
        Application app2 = new Application(job2, profileRohan, null);
        app2.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app2);
        statusHistoryRepository.save(new ApplicationStatusHistory(app2, null, ApplicationStatus.APPLIED, userRohan, "Applied via portal"));

        // Priya -> CloudScale (SELECTED / OFFERED)
        Application app3 = new Application(job2, profilePriya, null);
        app3.setStatus(ApplicationStatus.SELECTED);
        app3.setInternalNotes("Outstanding candidate with hands-on Terraform and containerization expertise. Made offer of 16 LPA.");
        applicationRepository.save(app3);
        statusHistoryRepository.save(new ApplicationStatusHistory(app3, null, ApplicationStatus.APPLIED, userPriya, "Applied via portal"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app3, ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED, admin, "Profile top match"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app3, ApplicationStatus.SHORTLISTED, ApplicationStatus.TECHNICAL_INTERVIEW, admin, "Cleared technical round 1 & 2"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app3, ApplicationStatus.TECHNICAL_INTERVIEW, ApplicationStatus.HR_INTERVIEW, admin, "Cleared HR round"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app3, ApplicationStatus.HR_INTERVIEW, ApplicationStatus.SELECTED, admin, "Offer rolled out"));

        // Ananya -> NexaHealth (SHORTLISTED)
        Application app4 = new Application(job3, profileAnanya, null);
        app4.setStatus(ApplicationStatus.SHORTLISTED);
        applicationRepository.save(app4);
        statusHistoryRepository.save(new ApplicationStatusHistory(app4, null, ApplicationStatus.APPLIED, userAnanya, "Applied via portal"));
        statusHistoryRepository.save(new ApplicationStatusHistory(app4, ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED, admin, "Shortlisted for interview"));

        // 5. Sample Interviews
        Instant interviewTime1 = Instant.now().plus(2, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS);
        Interview interview1 = new Interview(app1, 1, "Technical Round 1 - Systems Architecture",
                InterviewType.ONLINE, interviewTime1, 60, "https://meet.google.com/abc-defg-hij",
                "Please have your code editor and web camera enabled.", admin);
        interviewRepository.save(interview1);

        // 6. Sample In-app Notifications
        notificationRepository.save(new Notification(userRohan, "Interview Scheduled: Technical Round 1",
                "Your Technical Round 1 with TechFlow Systems is scheduled on " + interviewTime1,
                NotificationType.INTERVIEW_SCHEDULED, app1.getId().toString()));

        notificationRepository.save(new Notification(userPriya, "Offer Received: CloudScale Technologies!",
                "Congratulations! You have received a placement offer for the role of Cloud Infrastructure & DevOps Associate.",
                NotificationType.APPLICATION_STATUS, app3.getId().toString()));

        log.info("Development sample data seeded successfully.");
    }
}
