import { apiClient } from './client';
import {
  ApiResponse,
  JobListItem,
  JobDetail,
  CompanyJobItem,
  JobsQueryParams,
  CandidateApplication,
  JobApplicationsQueryParams,
  ApplicationItem,
} from '@/types';

export interface CreateJobPayload {
  title: string;
  description: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
}

export async function getJobsListApi(
  params?: JobsQueryParams
): Promise<{ jobs: JobListItem[]; meta: ApiResponse['meta'] }> {
  const response = await apiClient.get<ApiResponse<JobListItem[]>>('/jobs', {
    params,
  });
  return {
    jobs: response.data.data,
    meta: response.data.meta,
  };
}

export async function getJobDetailApi(id: string): Promise<JobDetail> {
  const response = await apiClient.get<ApiResponse<JobDetail>>(`/jobs/${id}`);
  return response.data.data;
}

export async function applyJobApi(jobId: string): Promise<ApplicationItem> {
  const response = await apiClient.post<ApiResponse<ApplicationItem>>(
    `/jobs/${jobId}/apply`
  );
  return response.data.data;
}

export async function getMyJobsApi(): Promise<CompanyJobItem[]> {
  const response = await apiClient.get<ApiResponse<CompanyJobItem[]>>('/jobs/mine');
  return response.data.data;
}

export async function createJobApi(
  payload: CreateJobPayload
): Promise<CompanyJobItem> {
  const response = await apiClient.post<ApiResponse<CompanyJobItem>>(
    '/jobs',
    payload
  );
  return response.data.data;
}

export async function getJobApplicantsApi(
  jobId: string,
  params?: JobApplicationsQueryParams
): Promise<{ applications: CandidateApplication[]; meta: ApiResponse['meta'] }> {
  const response = await apiClient.get<ApiResponse<CandidateApplication[]>>(
    `/jobs/${jobId}/applications`,
    { params }
  );
  return {
    applications: response.data.data,
    meta: response.data.meta,
  };
}

