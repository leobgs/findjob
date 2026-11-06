import { Prisma, Role, JobStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { PaginationMeta } from '../../utils/response';
import { ListJobsQuery, CreateJobInput } from './jobs.schema';

export class JobsService {
  async listJobs(
    userId: string,
    role: Role,
    query: ListJobsQuery,
  ): Promise<{ jobs: unknown[]; meta: PaginationMeta }> {
    const where: Prisma.JobWhereInput = {
      status: JobStatus.OPEN,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { company: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.jobType) {
      where.jobType = query.jobType;
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    const total = await prisma.job.count({ where });

    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        location: true,
        salaryMin: true,
        salaryMax: true,
        jobType: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    let formattedJobs = jobs as Array<Record<string, unknown>>;

    if (role === Role.JOB_SEEKER && jobs.length > 0) {
      const jobIds = jobs.map((j) => j.id);
      const userApplications = await prisma.application.findMany({
        where: {
          applicantId: userId,
          jobId: { in: jobIds },
        },
        select: { jobId: true },
      });

      const appliedJobIds = new Set(userApplications.map((a) => a.jobId));
      formattedJobs = jobs.map((job) => ({
        ...job,
        hasApplied: appliedJobIds.has(job.id),
      }));
    }

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      jobs: formattedJobs,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getJobById(jobId: string, userId: string, role: Role): Promise<unknown> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
          },
        },
      },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    if (role === Role.JOB_SEEKER) {
      const application = await prisma.application.findUnique({
        where: {
          jobId_applicantId: {
            jobId,
            applicantId: userId,
          },
        },
        select: {
          id: true,
          status: true,
          appliedAt: true,
        },
      });

      return {
        ...job,
        application: application ?? null,
      };
    }

    return job;
  }

  async createJob(userId: string, input: CreateJobInput): Promise<unknown> {
    const company = await prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw AppError.forbidden('Profil perusahaan tidak ditemukan untuk pengguna ini');
    }

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: input.title,
        description: input.description,
        location: input.location,
        jobType: input.jobType,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        status: JobStatus.OPEN,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return job;
  }

  async getMyJobs(userId: string): Promise<unknown[]> {
    const company = await prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw AppError.forbidden('Profil perusahaan tidak ditemukan untuk pengguna ini');
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return jobs.map(({ _count, ...rest }) => ({
      ...rest,
      applicantCount: _count.applications,
    }));
  }
}

export const jobsService = new JobsService();
