import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

export const applicationIdParamSchema = z
  .object({
    id: z.string().uuid('ID lamaran harus berupa UUID yang valid'),
  })
  .strict();

export const myApplicationsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z
      .enum([
        ApplicationStatus.APPLIED,
        ApplicationStatus.REVIEWING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.ACCEPTED,
      ])
      .optional(),
  })
  .strict();

export const jobApplicationsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z
      .enum([
        ApplicationStatus.APPLIED,
        ApplicationStatus.REVIEWING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.ACCEPTED,
      ])
      .optional(),
  })
  .strict();

export const updateStatusBodySchema = z
  .object({
    status: z.enum(
      [
        ApplicationStatus.APPLIED,
        ApplicationStatus.REVIEWING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.ACCEPTED,
      ],
      { message: 'Status lamaran tidak valid' }
    ),
    note: z
      .string({ message: 'Catatan harus berupa string' })
      .trim()
      .max(500, 'Catatan maksimal 500 karakter')
      .optional(),
  })
  .strict();

export type MyApplicationsQuery = z.infer<typeof myApplicationsQuerySchema>;
export type JobApplicationsQuery = z.infer<typeof jobApplicationsQuerySchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusBodySchema>;

