import {
  JobsQueryParams,
  MyApplicationsQueryParams,
  JobApplicationsQueryParams,
} from '@/types';

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  jobs: {
    all: ['jobs'] as const,
    list: (params?: JobsQueryParams) =>
      params
        ? (['jobs', 'list', params] as const)
        : (['jobs', 'list'] as const),
    detail: (id: string) => ['jobs', 'detail', id] as const,
    mine: ['jobs', 'mine'] as const,
    applicants: (jobId: string, params?: JobApplicationsQueryParams) =>
      params
        ? (['jobs', 'applicants', jobId, params] as const)
        : (['jobs', 'applicants', jobId] as const),
  },
  applications: {
    all: ['applications'] as const,
    mine: (params?: MyApplicationsQueryParams) =>
      params
        ? (['applications', 'mine', params] as const)
        : (['applications', 'mine'] as const),
    history: (id: string) => ['applications', 'history', id] as const,
  },
};

