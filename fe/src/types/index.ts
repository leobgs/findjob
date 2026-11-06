export type Role = 'JOB_SEEKER' | 'COMPANY';

export type JobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE';

export type JobStatus = 'OPEN' | 'CLOSED';

export type ApplicationStatus =
  | 'APPLIED'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'ACCEPTED';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
  errors?: ValidationErrorDetail[];
  requestId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: {
    id: string;
    name: string;
  } | null;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface JobListItem {
  id: string;
  title: string;
  location: string;
  jobType: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
  hasApplied?: boolean;
}

export interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    email?: string;
  };
  application?: {
    id: string;
    status: ApplicationStatus;
    appliedAt?: string;
    createdAt?: string;
  } | null;
}

export interface CompanyJobItem {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
}

export interface ApplicationItem {
  id: string;
  status: ApplicationStatus;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  job: {
    id: string;
    title: string;
    location: string;
    jobType: JobType;
    salaryMin?: number | null;
    salaryMax?: number | null;
    status?: JobStatus;
    company?: {
      id?: string;
      name: string;
    };
  };
  company?: {
    id?: string;
    name: string;
  };
}

export interface CandidateApplication {
  id: string;
  status: ApplicationStatus;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  applicant: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApplicationHistoryItem {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  createdAt: string;
  changedBy: {
    id: string;
    name: string;
    role: Role;
  };
}

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: JobType;
  location?: string;
}

export interface MyApplicationsQueryParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}

export interface JobApplicationsQueryParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}

