import { apiClient } from './client';
import { ApiResponse, AuthResponseData, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'JOB_SEEKER' | 'COMPANY';
  companyName?: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponseData> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    '/auth/login',
    payload
  );
  return response.data.data;
}

export async function registerApi(
  payload: RegisterPayload
): Promise<AuthResponseData> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    '/auth/register',
    payload
  );
  return response.data.data;
}

export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User | { user: User }>>('/auth/me');
  const payload = response.data.data;
  if (payload && typeof payload === 'object' && 'user' in payload && payload.user) {
    return payload.user;
  }
  return payload as User;
}

