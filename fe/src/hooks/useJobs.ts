import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  getJobsListApi,
  getJobDetailApi,
  applyJobApi,
  getMyJobsApi,
  createJobApi,
  getJobApplicantsApi,
  CreateJobPayload,
} from '@/api/jobs.api';
import { JobsQueryParams, JobApplicationsQueryParams } from '@/types';
import { toast } from 'sonner';

export function useJobs(params?: JobsQueryParams) {
  return useQuery({
    queryKey: queryKeys.jobs.list(params),
    queryFn: () => getJobsListApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
}

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => getJobDetailApi(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useApplyJob(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => applyJobApi(jobId),
    onSuccess: () => {
      toast.success('Lamaran Anda berhasil dikirim!');
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 409) {
        toast.error('Anda sudah pernah melamar lowongan ini.');
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      } else {
        toast.error(
          err.response?.data?.message || 'Gagal mengirim lamaran. Silakan coba lagi.'
        );
      }
    },
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: queryKeys.jobs.mine,
    queryFn: getMyJobsApi,
    staleTime: 30000,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => createJobApi(payload),
    onSuccess: () => {
      toast.success('Lowongan berhasil dipublikasikan!');
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || 'Gagal membuat lowongan pekerjaan.'
      );
    },
  });
}

export function useJobApplicants(
  jobId: string,
  params?: JobApplicationsQueryParams
) {
  return useQuery({
    queryKey: queryKeys.jobs.applicants(jobId, params),
    queryFn: () => getJobApplicantsApi(jobId, params),
    placeholderData: keepPreviousData,
    enabled: !!jobId,
    staleTime: 30000,
  });
}

