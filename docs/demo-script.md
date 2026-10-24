# Placera Comprehensive Demonstration & Evaluator Script

## 1. Demo Overview

This step-by-step walkthrough script is designed for professors, hiring managers, and evaluators to systematically demonstrate all core features of **Placera** in **10–12 minutes**.

### Demo Credentials
Placera automatically pre-populates seed data with one-click quick login buttons on the login page:

| Role | Email Address | Password | Profile Summary |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@placera.edu` | `AdminPassword123!` | Campus Placement Officer (Full Administrative Access) |
| **Student (Eligible)** | `riya.sharma@placera.edu` | `StudentPassword123!` | B.Tech CSE, 2025 batch, CGPA: 8.75, 0 backlogs |
| **Student (Boundary)** | `rohit.verma@placera.edu` | `StudentPassword123!` | B.Tech ME, 2025 batch, CGPA: 7.20, 1 backlog |

---

## 2. Walkthrough Steps

### Phase 1: Brand Identity & Public Landing Page (2 minutes)
1. Navigate to `http://localhost` (or `http://localhost:5173`).
2. **Observe Branding & Design**:
   - Notice the custom Placera SVG logo mark representing interconnected career pathways.
   - Professional SaaS color system: Deep Navy (`#0B192C`), Slate surfaces, and Electric Blue accents.
3. **Scroll the Public Landing Page**:
   - **Hero Section**: Headline *"Your Campus. Your Career. Your Next Move."* with clear call-to-action buttons.
   - **Live Product Preview**: Embedded preview of the student and administrative analytics interfaces.
   - **Feature Highlights**: Automated eligibility verification, interactive interview scheduling, and enterprise analytics.
   - **Workflow Explanation**: Visual 4-step recruitment funnel (Discover -> Verify -> Interview -> Offer).
   - **Platform Metrics & FAQ**: Sample metrics transparently labeled as illustrative; interactive FAQ accordion.

---

### Phase 2: Student Experience (4 minutes)
1. Click **Sign In** in the top navigation bar.
2. Click the quick-fill demo button: **"Demo Student (Riya Sharma)"** and click **Sign In**.
3. **Inspect the Student Dashboard**:
   - Notice real data derived directly from the database: Eligible Jobs, Active Applications, Interviews Scheduled, and Offers Received.
   - Review the *Recommended Opportunities* carousel and *Upcoming Interviews* card.
4. **Inspect & Update Student Profile**:
   - Navigate to **Profile** via the sidebar.
   - Observe academic credentials (Registration Number: `CS2022045`, Department: `Computer Science and Engineering`, CGPA: `8.75`).
   - Add a skill tag (e.g., `Terraform, Azure`) and click **Save Profile Changes**. Notice the instant toast notification.
5. **Manage PDF Resume**:
   - In the resume section, click **Upload Resume**.
   - Select a sample PDF document (`sample.pdf`).
   - Notice the magic bytes inspection validating that the binary is a real PDF. Once uploaded, click **Download / View** to verify secure retrieval.
6. **Browse Jobs & Test Real-Time Eligibility**:
   - Navigate to **Browse Jobs**.
   - Review published openings from CloudScale Systems, NexaFin Tech, CyberSentinel Labs, and DataMinds AI.
   - Notice the **Eligibility Badge**:
     - On *Senior Cloud Platform Engineer* (Requires CGPA 7.5, CSE/IT, 0 backlogs), Riya is marked **Eligible** with a green badge.
     - Select a role restricted to Mechanical Engineering or higher CGPA: Notice the red **Ineligible** badge and click to inspect the failure reasons modal explaining exactly why.
7. **Submit an Application**:
   - Open *Senior Cloud Platform Engineer* by CloudScale Systems.
   - Click **Apply Now**.
   - Select the active resume and confirm submission.
   - Observe immediate UI state transition: The button changes to **Applied**, preventing accidental duplicate submissions.
8. **Track Application Status**:
   - Navigate to **My Applications**.
   - View the application card showing status `APPLIED` with the visual timeline step active.

---

### Phase 3: Administrative Experience & Pipeline Management (4 minutes)
1. Click the top-right user menu and select **Sign Out**.
2. Click **Sign In**, select **"Demo Admin (Placement Officer)"**, and submit.
3. **Inspect the Executive Analytics Dashboard**:
   - Real-time aggregated KPIs: Total Students (4), Total Companies (4), Active Jobs (4), Total Applications, Placement Rate, and CTC metrics.
   - Interactive charts:
     - **Recruitment Pipeline Stage Distribution** (Applied, Shortlisted, Interviewing, Selected).
     - **Placement Rate by Department** (CSE, IT, ECE, ME).
4. **Manage Corporate Recruitment Partners**:
   - Navigate to **Companies** in the sidebar.
   - Review partner profiles (industry, website, location, active job count).
   - Click **Add Company** to create a new corporate profile.
5. **Post a New Job Opening (3-Step Wizard with Preview)**:
   - Navigate to **Job Postings** and click **Post New Job**.
   - **Step 1 (Basic Details)**: Select company, enter title, job type, location, and salary bracket.
   - **Step 2 (Eligibility Rules)**: Set minimum CGPA, maximum backlogs, eligible departments, and required skills.
   - **Step 3 (Preview & Publish)**: Review formatted student-facing preview and click **Publish Opening**.
6. **Manage Applicant Pipeline & Transition Stages**:
   - Navigate to **Applications**.
   - Filter applicants by Job (*Senior Cloud Platform Engineer*).
   - Locate Riya Sharma's application.
   - Click **View Resume** to inspect the submitted PDF.
   - Click **Update Status**: Select `SHORTLISTED`, enter notes *"Strong system design portfolio"*, and save.
7. **Schedule an Interview**:
   - Click **Schedule Interview** for Riya Sharma.
   - Set Round Name: *"Technical Architecture & Algorithms"*.
   - Round Type: `VIRTUAL`.
   - Meeting URL: `https://meet.placera.edu/interview-riya-cs`.
   - Scheduled Time: Tomorrow at 2:00 PM. Click **Confirm Schedule**.
8. **Extend Final Placement Offer**:
   - Click **Update Status** again and advance the student to `SELECTED` with note *"Outstanding interview performance. Corporate offer extended."*
9. **Export Secure CSV Reports**:
   - Navigate to **Analytics & Reports**.
   - Notice that the executive placement rate and stage counts have automatically updated in real-time.
   - Click **Export Applications CSV** and **Export Placements CSV**.
   - Open the exported CSV file: Note that all columns are neatly populated and safe from spreadsheet formula injection.

---

### Phase 4: Student Verification & Full Loop Closure (2 minutes)
1. Sign out of the Administrator account and sign back in as **Riya Sharma**.
2. **Observe Real-Time Notifications**:
   - Notice the notification bell badge count incremented in the top navigation bar.
   - Click the bell to open the dropdown: View notifications for *"Application Status Shortlisted"*, *"Interview Scheduled"*, and *"Offer Received!"*.
3. **Verify Scheduled Interview**:
   - Navigate to **Interviews**: Notice the active interview card displaying the date, time countdown, duration, and direct meeting link button.
4. **Verify Application Final Status**:
   - Navigate to **My Applications**: The application now proudly displays a green `SELECTED` badge.
   - Click the application to inspect the full chronological audit timeline showing every transition from `APPLIED` to `SELECTED` along with administrative feedback.
