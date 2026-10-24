# Placera REST API Reference Guide

## 1. API Architecture & Standards

The Placera REST API provides a standardized, secure JSON interface for all client interactions.

### Base URLs
- **Local Development**: `http://localhost:8080` (or proxied via Vite at `http://localhost:5173/api`)
- **Production (Azure Container Apps)**: `https://<app-name>.<region>.azurecontainerapps.io/api`
- **Interactive OpenAPI Documentation**: `http://localhost:8080/swagger-ui/index.html`
- **Raw OpenAPI Specification**: `http://localhost:8080/v3/api-docs`

### Authentication Model
The API supports dual stateless authentication:
1. **HTTP Authorization Header**: `Authorization: Bearer <jwt-token>`
2. **HttpOnly Cookie**: Automatic inclusion of the `placera_token` cookie for web clients.

Tokens are cryptographically signed using HMAC-SHA256 (`HS256`) and expire after 24 hours (configurable via `app.jwt.expiration-ms`).

---

## 2. Standard Response Envelope

All API endpoints return responses encapsulated in a consistent structure:

### Success Response Format
```json
{
  "success": true,
  "message": "Application submitted successfully.",
  "data": { ... },
  "timestamp": "2026-10-24T10:15:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Student does not meet the minimum CGPA requirement (Requires: 8.00, Actual: 7.45)",
  "data": null,
  "timestamp": "2026-10-24T10:15:00.000Z"
}
```

### Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure, deadline expired, or eligibility criteria unmet.
- `401 Unauthorized`: Missing, expired, or invalid authentication token.
- `403 Forbidden`: Insufficient permissions for the requested resource (e.g. Student accessing Admin route).
- `404 Not Found`: Requested resource does not exist.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email, duplicate application submission).
- `500 Internal Server Error`: Unhandled server exception with sanitized error messaging.

---

## 3. Endpoints Directory

### 3.1 Authentication & Session (`/api/auth`)

#### Register Student
- **Method**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "riya.sharma@placera.edu",
  "password": "SecurePassword123!",
  "firstName": "Riya",
  "lastName": "Sharma",
  "phoneNumber": "+919876543210",
  "registrationNumber": "CS2022045",
  "department": "Computer Science and Engineering",
  "degree": "B.Tech",
  "graduationYear": 2025,
  "cgpa": 8.75,
  "backlogCount": 0,
  "skills": "Java, Spring Boot, React, PostgreSQL, Docker"
}
```
- **Response**: `201 Created` with JWT token and user profile object.

#### User Login
- **Method**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@placera.edu",
  "password": "AdminPassword123!"
}
```
- **Response**: `200 OK` with token and user details. Sets `placera_token` HttpOnly cookie.

#### Get Current User Profile
- **Method**: `GET /api/auth/me`
- **Access**: Authenticated (`STUDENT` or `ADMIN`)
- **Response**: Returns identity details and associated student academic record (if student).

#### Logout
- **Method**: `POST /api/auth/logout`
- **Access**: Authenticated
- **Response**: Clears `placera_token` cookie and invalidates client session state.

---

### 3.2 Student Management (`/api/students`)

#### Get Current Student Profile
- **Method**: `GET /api/students/profile`
- **Access**: Authenticated (`STUDENT`)
- **Response**: Complete student profile with academic history, skills, links, and active resume ID.

#### Update Student Profile
- **Method**: `PUT /api/students/profile`
- **Access**: Authenticated (`STUDENT`)
- **Request Body**:
```json
{
  "phoneNumber": "+919876543210",
  "department": "Computer Science and Engineering",
  "degree": "B.Tech",
  "graduationYear": 2025,
  "cgpa": 8.90,
  "backlogCount": 0,
  "skills": "Java 21, Spring Boot, React, TypeScript, Azure, Docker",
  "linkedinUrl": "https://linkedin.com/in/riyasharma",
  "githubUrl": "https://github.com/riyasharma",
  "portfolioUrl": "https://riyasharma.dev"
}
```
- **Security Rule**: Students cannot elevate their role, alter their email, or manipulate application status through profile updates.

#### Student Dashboard Metrics
- **Method**: `GET /api/students/dashboard`
- **Access**: Authenticated (`STUDENT`)
- **Response**:
```json
{
  "totalEligibleJobs": 6,
  "submittedApplications": 2,
  "applicationsInProgress": 1,
  "interviewsScheduled": 1,
  "offersReceived": 0,
  "upcomingInterviews": [ ... ],
  "recentApplications": [ ... ],
  "recommendedJobs": [ ... ]
}
```

---

### 3.3 Job Postings & Eligibility (`/api/jobs`)

#### Search and Browse Jobs
- **Method**: `GET /api/jobs`
- **Access**: Authenticated (`STUDENT`, `ADMIN`)
- **Query Parameters**:
  - `keyword` (String, optional): Matches job title, company name, or description.
  - `jobType` (String, optional): `FULL_TIME`, `INTERNSHIP`, `INTERN_TO_FULL_TIME`.
  - `location` (String, optional): Partial match for city or remote.
  - `minSalary` (BigDecimal, optional): Minimum annual base compensation.
  - `department` (String, optional): Filter by allowed student department.
  - `activeDeadlineOnly` (Boolean, default `true`): Hides past-deadline opportunities.
  - `page` (Integer, default `0`), `size` (Integer, default `20`).

#### Get Job Details
- **Method**: `GET /api/jobs/{id}`
- **Access**: Authenticated

#### Check Student Eligibility
- **Method**: `GET /api/jobs/{id}/eligibility`
- **Access**: Authenticated (`STUDENT`)
- **Response**:
```json
{
  "eligible": false,
  "reasons": [
    "Minimum CGPA required is 8.00 (your CGPA: 7.45)",
    "Eligible departments: [Computer Science and Engineering] (your department: Mechanical Engineering)"
  ]
}
```

#### Create Job Posting
- **Method**: `POST /api/jobs`
- **Access**: Authenticated (`ADMIN`)
- **Request Body**:
```json
{
  "companyId": 1,
  "title": "Cloud Platform Engineer",
  "description": "Architect high-performance distributed microservices...",
  "jobType": "FULL_TIME",
  "location": "Bengaluru, India (Hybrid)",
  "salaryMin": 1800000.00,
  "salaryMax": 2400000.00,
  "salaryCurrency": "INR",
  "deadline": "2026-11-30T23:59:59Z",
  "minCgpa": 7.50,
  "maxBacklogs": 0,
  "allowedDepartments": ["Computer Science and Engineering", "Information Technology"],
  "allowedGraduationYears": [2025, 2026],
  "requiredSkills": ["Java", "Docker", "Kubernetes", "PostgreSQL"]
}
```

---

### 3.4 Applications Workflow (`/api/applications`)

#### Submit Application
- **Method**: `POST /api/applications/jobs/{jobId}`
- **Access**: Authenticated (`STUDENT`)
- **Request Body**:
```json
{
  "resumeId": 3
}
```
- **Validation Rules**:
  1. Job deadline must be strictly in the future.
  2. Student must not have an existing application for this job (prevented by UK constraint).
  3. Server evaluates all `JobEligibilityRule` constraints against the current student record. Fails with `400 Bad Request` if ineligibility criteria exist.

#### Get Current Student's Applications
- **Method**: `GET /api/applications/my-applications`
- **Access**: Authenticated (`STUDENT`)

#### Get Application Details with Audit Timeline
- **Method**: `GET /api/applications/{id}`
- **Access**: Application Owner (`STUDENT`) or `ADMIN`
- **Response**: Application record including associated company, job, resume, and chronological `statusHistory` list.

#### Withdraw Application
- **Method**: `POST /api/applications/{id}/withdraw`
- **Access**: Application Owner (`STUDENT`)

#### Admin: Get Applicants for a Job
- **Method**: `GET /api/applications/job/{jobId}`
- **Access**: Authenticated (`ADMIN`)

#### Admin: Update Application Stage
- **Method**: `PUT /api/applications/{id}/status`
- **Access**: Authenticated (`ADMIN`)
- **Request Body**:
```json
{
  "status": "TECHNICAL_INTERVIEW",
  "reasonOrNote": "Passed Round 1 Coding Assessment with 98% test case coverage."
}
```
- **Lifecycle Enforcements**: Verified against state-transition policy. Records an immutable entry in `application_status_history` and triggers a real-time notification to the student.

---

### 3.5 Resume Management (`/api/resumes`)

#### Upload Resume
- **Method**: `POST /api/resumes/upload`
- **Access**: Authenticated (`STUDENT`)
- **Content-Type**: `multipart/form-data` (file part name: `file`)
- **Validation**:
  - File extension check (`.pdf`).
  - MIME type check (`application/pdf`).
  - Magic bytes binary signature verification (first 4 bytes must be `%PDF`).
  - Max file size: 5 MB.
- **Storage**: Persisted to local volume (`uploads/resumes/`) or Azure Blob Storage with cryptographically secure UUID key.

#### Download / View Resume
- **Method**: `GET /api/resumes/{id}/download`
- **Access**: Resume Owner (`STUDENT`) or `ADMIN`
- **Response**: Binary stream with `Content-Type: application/pdf` and `Content-Disposition: inline`.

---

### 3.6 Interview Scheduling (`/api/interviews`)

#### Schedule Interview
- **Method**: `POST /api/interviews`
- **Access**: Authenticated (`ADMIN`)
- **Request Body**:
```json
{
  "applicationId": 12,
  "roundNumber": 2,
  "roundName": "System Design & Cloud Architecture",
  "interviewType": "VIRTUAL",
  "scheduledTime": "2026-11-10T14:30:00Z",
  "durationMinutes": 60,
  "locationOrUrl": "https://meet.placera.edu/interview-cloud-eng",
  "instructions": "Be prepared to sketch architecture diagrams on a virtual whiteboard."
}
```

#### Student: My Scheduled Interviews
- **Method**: `GET /api/interviews/my-interviews`
- **Access**: Authenticated (`STUDENT`)

---

### 3.7 Administrator Management & Analytics (`/api/admin`)

#### Placement Analytics Dashboard
- **Method**: `GET /api/admin/dashboard`
- **Access**: Authenticated (`ADMIN`)
- **Response**:
```json
{
  "totalStudents": 150,
  "totalCompanies": 12,
  "activeJobs": 8,
  "totalApplications": 320,
  "offersMade": 42,
  "placementPercentage": 84.5,
  "averageSalary": 1420000.00,
  "highestSalary": 3200000.00,
  "stageDistribution": {
    "APPLIED": 120,
    "SHORTLISTED": 45,
    "TECHNICAL_INTERVIEW": 20,
    "SELECTED": 42
  },
  "departmentStats": [ ... ]
}
```

#### Export Applications CSV
- **Method**: `GET /api/admin/export/applications`
- **Access**: Authenticated (`ADMIN`)
- **Content-Type**: `text/csv`
- **Security Protection**: Safe escaping and single-quote prepending on fields starting with `=`, `+`, `-`, `@`, `\t`, or `\r` to prevent CSV Formula Injection in Microsoft Excel or Google Sheets.

#### Export Placement Records CSV
- **Method**: `GET /api/admin/export/placements`
- **Access**: Authenticated (`ADMIN`)

---

### 3.8 Notifications (`/api/notifications`)

#### Get Notifications
- **Method**: `GET /api/notifications`
- **Access**: Authenticated

#### Get Unread Count
- **Method**: `GET /api/notifications/unread-count`
- **Access**: Authenticated

#### Mark Notification as Read
- **Method**: `PUT /api/notifications/{id}/read`
- **Access**: Authenticated

#### Mark All Notifications Read
- **Method**: `PUT /api/notifications/read-all`
- **Access**: Authenticated

---

### 3.9 System Health & Observability (`/actuator`)

#### Health Check
- **Method**: `GET /actuator/health`
- **Access**: Public (readiness and liveness probes)
- **Response**:
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP", "details": { "database": "PostgreSQL", "validationQuery": "isValid()" } },
    "diskSpace": { "status": "UP" },
    "ping": { "status": "UP" }
  }
}
```

#### Performance Metrics
- **Method**: `GET /actuator/metrics`
- **Access**: Admin / Internal
- **Details**: JVM memory utilization, garbage collection, thread pools, and HikariCP connection metrics.
