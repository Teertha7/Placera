# Placera — Campus Placement Management & Recruitment Analytics Platform

> **Tagline:** *Where Talent Meets Opportunity.*

[![CI Pipeline](https://github.com/your-org/placera/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/placera/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spring Boot 3.3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![React 18](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker Compose](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/Terraform-1.5+-7B42BC.svg)](https://www.terraform.io/)
[![Azure Container Apps](https://img.shields.io/badge/Azure-Container%20Apps-0078D4.svg)](https://azure.microsoft.com/services/container-apps/)

---

## 1. Project Overview

**Placera** is a centralized, cloud-native campus recruitment management and analytics platform engineered to connect students, academic institutions, and corporate hiring partners. It unifies the entire university placement lifecycle into a single, high-performance workflow:
- **Student Academic Verification**: Automated profile tracking with graduation batch, CGPA, and backlog constraints.
- **Rules-Based Eligibility Engine**: Real-time server-side evaluation preventing ineligible submissions and explaining cutoff criteria to students transparently.
- **Multi-Stage Recruitment Funnel**: Tracking candidates through Applied, Shortlisted, Assessment, Technical Interview, HR Interview, Selected, and Withdrawn stages.
- **Interactive Interview Scheduling**: Virtual meeting link distribution, round definitions, and calendar coordination.
- **Executive Analytics & Reporting**: Real-time placement rates, salary brackets (average, median, highest CTC), department-wise breakdown, and CSV data export protected against spreadsheet formula injection.
- **Enterprise Security & Cloud-Native DevOps**: Dual JWT authentication (Bearer + HttpOnly cookie), magic-bytes PDF resume validation, multi-stage Docker builds, Terraform Infrastructure as Code (IaC), GitHub Actions CI/CD with OIDC, and k6 load-testing suites.

---

## 2. System Architecture

```mermaid
graph TD
    subgraph Client ["Client Presentation Tier"]
        Browser["User Browser (Desktop / Mobile)"]
    end

    subgraph CDN ["Frontend Static Tier"]
        SWA["Azure Static Web Apps / Nginx Container<br/>(React 18 • TypeScript • Tailwind CSS • Vite)"]
    end

    subgraph BackendServices ["Backend Compute Tier"]
        ACA["Azure Container Apps / Docker Container<br/>(Spring Boot 3.3 • Java 21)"]
        Actuator["Spring Boot Actuator<br/>(/actuator/health, metrics)"]
        Security["Spring Security 6<br/>(JWT + BCrypt + RBAC)"]
    end

    subgraph DataStorage ["Data & Storage Tier"]
        PG[("PostgreSQL 16 Database<br/>Flyway Migration Engine")]
        Blob[("Azure Blob Storage / Local Volume<br/>Private Resumes")]
    end

    subgraph Observability ["Observability Tier"]
        AppInsights["Azure Application Insights / Log Analytics"]
    end

    Browser -->|HTTPS / Assets| SWA
    Browser -->|REST API Requests (JWT)| ACA
    ACA --> Security
    ACA --> Actuator
    ACA -->|Connection Pool (HikariCP)| PG
    ACA -->|Private Document Access| Blob
    ACA -->|Telemetry & Metrics| AppInsights
```

---

## 3. Technology Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 & Vite** | High-performance Single-Page Application (SPA) development. |
| **Language** | **TypeScript 5** | Strict compile-time type safety across API contracts and state. |
| **Styling & Icons** | **Tailwind CSS & Lucide React** | Responsive design system, custom Placera color palette, accessible icons. |
| **Data Visualization** | **Recharts** | Interactive SVG charts for placement statistics and pipeline stages. |
| **Backend Framework** | **Spring Boot 3.3.4 (Java 21)** | Enterprise RESTful API services, modular domain architecture. |
| **Security** | **Spring Security 6 & JJWT** | Stateless HMAC-SHA256 tokens, BCrypt password hashing, RBAC. |
| **Data Access** | **Spring Data JPA & Hibernate 6** | Eager-fetch joined repositories, index-optimized queries, HikariCP. |
| **Database** | **PostgreSQL 16 & Flyway** | ACID-compliant relational storage, automated deterministic migrations. |
| **Containerization** | **Docker & Docker Compose** | Multi-stage production container builds and local developer stack. |
| **Cloud Compute** | **Azure Container Apps (ACA)** | Serverless container hosting with automated scale-to-zero compute. |
| **Cloud Static Web** | **Azure Static Web Apps (SWA)** | Global CDN edge-distribution for the React client. |
| **Infrastructure as Code** | **Terraform (HashiCorp)** | Declarative cloud resource provisioning in `infra/terraform/`. |
| **CI/CD** | **GitHub Actions** | Automated linting, test suites, Docker build, and OIDC Azure deployment. |
| **Performance Testing** | **k6 (Grafana)** | Four Golden Signals performance benchmarking under 50 VUs load. |

---

## 4. Quickstart: Run Locally in 2 Minutes

### Option A: Complete Docker Compose Stack (Recommended)
Everything you need (PostgreSQL 16, Spring Boot 3.3, and React on Nginx) launches with a single command:

```bash
# 1. Clone repository
git clone https://github.com/your-org/placera.git
cd placera

# 2. Copy the sample environment file
cp .env.example .env

# 3. Build and launch all containers
docker compose up --build -d
```

Once running:
- **Web Application**: [http://localhost](http://localhost) (or port `80`)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Actuator Health Probe**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

To view real-time logs:
```bash
docker compose logs -f
```

To stop all containers:
```bash
docker compose down
```

---

### Option B: Local Developer Mode (Host Services)

#### 1. Start PostgreSQL
```bash
docker run -d --name placera-local-pg \
  -e POSTGRES_DB=placera_db \
  -e POSTGRES_USER=placera_user \
  -e POSTGRES_PASSWORD=placera_secure_dev_pass_2026 \
  -p 5432:5432 postgres:16-alpine
```

#### 2. Launch Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
*The backend starts on `http://localhost:8080` and automatically runs Flyway migrations and seeds demo data.*

#### 3. Launch Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
*The frontend starts on `http://localhost:5173` with an automatic reverse proxy forwarding `/api` calls to port `8080`.*

---

## 5. Seed Accounts & Demo Credentials

Placera includes deterministic database seeding out of the box. Quick-login buttons are provided on the login page for immediate evaluator testing:

| Role | Email Address | Password | Profile Description |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@placera.edu` | `AdminPassword123!` | Campus Placement Officer (Full administrative portal) |
| **Student (Eligible)** | `riya.sharma@placera.edu` | `StudentPassword123!` | B.Tech CSE, 2025 batch, CGPA 8.75, 0 backlogs |
| **Student (Boundary)** | `rohit.verma@placera.edu` | `StudentPassword123!` | B.Tech ME, 2025 batch, CGPA 7.20, 1 backlog |

---

## 6. Automated Testing & Verification

### Run Backend Unit & Integration Tests
```bash
cd backend
mvn clean test
```
*Runs 12 comprehensive automated tests covering eligibility verification, duplicate application prevention, application stage transitions, and authentication flows.*

### Run Frontend Component Tests & TypeScript Verification
```bash
cd frontend
npm test             # Executes Vitest component tests
npm run build        # Executes TypeScript compilation & asset bundling
```

### Run Performance & Load Tests (k6)
```bash
# Execute Golden Signals load test against local or remote environment
k6 run k6/load-test.js
```
*Measures Latency (p95 < 250ms), Traffic (50 VUs), and Error Rates (< 1%).*

---

## 7. Cloud Deployment & Terraform IaC

Infrastructure as Code is located in `infra/terraform/` and provisions production Azure resources:
- Azure Container Apps Environment & Backend Service
- Azure Static Web Apps (Frontend)
- Azure Database for PostgreSQL Flexible Server
- Azure Blob Storage (Resumes)
- Azure Container Registry (ACR)
- Log Analytics Workspace & Application Insights

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
# Apply only with authorized budget approval:
# terraform apply
```

> **Zero Spending Guarantee**: When using Azure Container Apps, the backend is configured with `min_replicas = 0`. Compute resources scale down to zero running instances when idle, incurring zero computing costs during non-use.

---

## 8. Documentation Suite

Comprehensive technical guides are available in the [`docs/`](docs/) directory:

- [**System Architecture Document**](docs/architecture.md): Detailed component design, data flows, and state machine specifications.
- [**Database Design & Schema Guide**](docs/database-design.md): Entity-relationship diagrams, table specifications, indexing rationale, and audit history design.
- [**REST API Reference Guide**](docs/api-guide.md): Standard request/response envelopes, authentication models, status codes, and endpoint directory.
- [**Deployment & Operations Guide**](docs/deployment-guide.md): Local Docker Compose operations, Azure Terraform provisioning, and GitHub Actions CI/CD setup.
- [**Security Architecture & Review**](docs/security-review.md): STRIDE threat modeling, RBAC enforcement, magic-bytes PDF inspection, and CSV formula injection defenses.
- [**Quality Assurance & Testing Strategy**](docs/testing-strategy.md): Testing pyramid, MockMvc integration tests, Vitest component tests, and k6 load tests.
- [**Cloud Cost Management & Budget Guide**](docs/cost-management.md): Student budget containment, scale-to-zero configuration, and teardown commands.
- [**Evaluator Demo Walkthrough Script**](docs/demo-script.md): 10-minute step-by-step evaluation script for grading or demonstration.

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
