import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  getMyApplicationsApi,
  getApplicationHistoryApi,
  updateApplicationStatusApi,
  UpdateStatusPayload,
} from '@/api/applications.api';
import { MyApplicationsQueryParams } from '@/types';
import { toast } from 'sonner';

export function useMyApplications(params?: MyApplicationsQueryParams) {
  return useQuery({
    queryKey: queryKeys.applications.mine(params),
    queryFn: () => getMyApplicationsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
}

export function useApplicationHistory(applicationId: string | null) {
  return useQuery({
    queryKey: queryKeys.applications.history(applicationId || ''),
    queryFn: () => getApplicationHistoryApi(applicationId!),
    enabled: !!applicationId,
    staleTime: 30000,
  });
}

export function useUpdateApplicationStatus(jobId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: UpdateStatusPayload;
    }) => updateApplicationStatusApi(applicationId, payload),
    onSuccess: (_, variables) => {
      toast.success('Status lamaran berhasil diperbarui!');
      if (jobId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobs.applicants(jobId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['jobs', 'applicants'],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.history(variables.applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.mine,
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || 'Gagal memperbarui status lamaran.'
      );
    },
  });
}

