import { Prisma, Role, JobStatus, ApplicationStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { PaginationMeta } from '../../utils/response';
import {
  MyApplicationsQuery,
  JobApplicationsQuery,
  UpdateStatusBody,
} from './applications.schema';

export class ApplicationsService {
  async apply(jobId: string, applicantId: string): Promise<unknown> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    if (job.status !== JobStatus.OPEN) {
      throw AppError.badRequest('Lowongan pekerjaan ini sudah ditutup');
    }

    const existing = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    });

    if (existing) {
      throw AppError.conflict('Anda sudah melamar lowongan ini');
    }

    try {
      const application = await prisma.$transaction(async (tx) => {
        const newApp = await tx.application.create({
          data: {
            jobId,
            applicantId,
            status: ApplicationStatus.APPLIED,
          },
        });

        await tx.applicationHistory.create({
          data: {
            applicationId: newApp.id,
            fromStatus: null,
            toStatus: ApplicationStatus.APPLIED,
            changedById: applicantId,
            note: 'Melamar lowongan pekerjaan',
          },
        });

        return newApp;
      });

      return application;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw AppError.conflict('Anda sudah melamar lowongan ini');
      }
      throw error;
    }
  }

  async getMyApplications(
    applicantId: string,
    query: MyApplicationsQuery
  ): Promise<{ applications: unknown[]; meta: PaginationMeta }> {
    const where: Prisma.ApplicationWhereInput = {
      applicantId,
      ...(query.status ? { status: query.status } : {}),
    };

    const total = await prisma.application.count({ where });

    const rawApplications = await prisma.application.findMany({
      where,
      select: {
        id: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const applications = rawApplications.map((app) => ({
      id: app.id,
      status: app.status,
      appliedAt: app.appliedAt,
      job: {
        id: app.job.id,
        title: app.job.title,
        location: app.job.location,
        jobType: app.job.jobType,
      },
      company: {
        name: app.job.company.name,
      },
    }));

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      applications,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getJobApplications(
    jobId: string,
    userId: string,
    query: JobApplicationsQuery
  ): Promise<{ applications: unknown[]; meta: PaginationMeta }> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: { userId: true },
        },
      },
    });

    if (!job || job.company.userId !== userId) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    const where: Prisma.ApplicationWhereInput = {
      jobId,
      ...(query.status ? { status: query.status } : {}),
    };

    const total = await prisma.application.count({ where });

    const applications = await prisma.application.findMany({
      where,
      select: {
        id: true,
        status: true,
        appliedAt: true,
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      applications,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async updateStatus(
    applicationId: string,
    userId: string,
    body: UpdateStatusBody
  ): Promise<unknown> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!application || application.job.company.userId !== userId) {
      throw AppError.notFound('Lamaran pekerjaan tidak ditemukan');
    }

    if (application.status === body.status) {
      throw AppError.badRequest(
        'Status baru tidak boleh sama dengan status lamaran saat ini'
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.application.update({
        where: { id: applicationId },
        data: { status: body.status },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: body.status,
          changedById: userId,
          note: body.note ?? null,
        },
      });

      return updatedApp;
    });

    return updated;
  }

  async getApplicationHistory(
    applicationId: string,
    userId: string,
    role: Role
  ): Promise<unknown[]> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!application) {
      throw AppError.notFound('Lamaran pekerjaan tidak ditemukan');
    }

    const isApplicant = role === Role.JOB_SEEKER && application.applicantId === userId;
    const isCompanyOwner = role === Role.COMPANY && application.job.company.userId === userId;

    if (!isApplicant && !isCompanyOwner) {
      throw AppError.notFound('Lamaran pekerjaan tidak ditemukan');
    }

    const history = await prisma.applicationHistory.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        fromStatus: true,
        toStatus: true,
        note: true,
        createdAt: true,
        changedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return history;
  }
}

export const applicationsService = new ApplicationsService();

