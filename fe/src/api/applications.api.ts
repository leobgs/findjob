import { apiClient } from './client';
import {
  ApiResponse,
  ApplicationItem,
  ApplicationHistoryItem,
  MyApplicationsQueryParams,
  ApplicationStatus,
} from '@/types';

export interface UpdateStatusPayload {
  status: ApplicationStatus;
  note?: string;
}

export async function getMyApplicationsApi(
  params?: MyApplicationsQueryParams
): Promise<{ applications: ApplicationItem[]; meta: ApiResponse['meta'] }> {
  const response = await apiClient.get<ApiResponse<ApplicationItem[]>>(
    '/applications/mine',
    { params }
  );
  return {
    applications: response.data.data,
    meta: response.data.meta,
  };
}

export async function getApplicationHistoryApi(
  applicationId: string
): Promise<ApplicationHistoryItem[]> {
  const response = await apiClient.get<ApiResponse<ApplicationHistoryItem[]>>(
    `/applications/${applicationId}/history`
  );
  return response.data.data;
}

export async function updateApplicationStatusApi(
  applicationId: string,
  payload: UpdateStatusPayload
): Promise<ApplicationItem> {
  const response = await apiClient.patch<ApiResponse<ApplicationItem>>(
    `/applications/${applicationId}/status`,
    payload
  );
  return response.data.data;
}

