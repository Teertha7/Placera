export type Role = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export type JobType = 'FULL_TIME' | 'INTERNSHIP' | 'INTERN_TO_FULL_TIME';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'ASSESSMENT'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type InterviewType = 'ONLINE' | 'IN_PERSON';

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export type NotificationType = 'APPLICATION_STATUS' | 'INTERVIEW_SCHEDULED' | 'JOB_ALERT' | 'SYSTEM';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  phoneNumber?: string;
  active: boolean;
}

export interface Resume {
  id: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  user?: User;
  registrationNumber: string;
  department: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  backlogCount: number;
  skills?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumes: Resume[];
  activeResume?: Resume;
  activeApplicationsCount: number;
  offersCount: number;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  location?: string;
  logoUrl?: string;
  active: boolean;
  activeJobsCount: number;
}

export interface JobEligibilityRule {
  minCgpa: number;
  maxBacklogs: number;
  allowedDepartments: string[];
  allowedGraduationYears: number[];
}

export interface Job {
  id: number;
  company: Company;
  title: string;
  description: string;
  jobType: JobType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: JobStatus;
  deadline: string;
  createdAt: string;
  eligibilityRule?: JobEligibilityRule;
  requiredSkills: string[];
  applicantsCount: number;
  expired: boolean;
  userEligible?: boolean;
  ineligibilityReasons?: string[];
}

export interface ApplicationStatusHistory {
  id: number;
  previousStatus?: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedByName?: string;
  reasonOrNote?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentRegistrationNumber: string;
  roundNumber: number;
  roundName: string;
  interviewType: InterviewType;
  scheduledTime: string;
  durationMinutes: number;
  locationOrUrl?: string;
  instructions?: string;
  status: InterviewStatus;
  createdAt: string;
}

export interface Application {
  id: number;
  job: Job;
  student: StudentProfile;
  resume?: Resume;
  status: ApplicationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: ApplicationStatusHistory[];
  interviews: Interview[];
}

export interface JobEligibilityCheckResult {
  eligible: boolean;
  reasons: string[];
  studentCgpa: number;
  requiredMinCgpa: number;
  studentBacklogs: number;
  allowedMaxBacklogs: number;
  studentDepartment: string;
  allowedDepartments: string[];
  studentGraduationYear: number;
  allowedGraduationYears: number[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  referenceId?: string;
  read: boolean;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalCompanies: number;
  totalPublishedJobs: number;
  totalApplications: number;
  totalShortlisted: number;
  totalInterviewsScheduled: number;
  totalOffersMade: number;
  distinctStudentsWithOffers: number;
  placementRatePercentage: number;
  shortlistingRatePercentage: number;
  interviewToOfferConversionPercentage: number;
  statusDistribution: { status: string; count: number }[];
  applicationsByDepartment: { department: string; count: number }[];
  topCompaniesByApplications: { company: string; count: number }[];
  offersByDepartment: { department: string; offers: number }[];
  offersByGraduationYear: { graduationYear: number; studentsPlaced: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
