import { z } from 'zod';
import { JobType } from '@prisma/client';

export const listJobsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().optional(),
    jobType: z.enum([
      JobType.FULL_TIME,
      JobType.PART_TIME,
      JobType.CONTRACT,
      JobType.INTERNSHIP,
      JobType.FREELANCE,
    ]).optional(),
    location: z.string().trim().optional(),
  })
  .strict();

export const createJobSchema = z
  .object({
    title: z
      .string({ message: 'Judul lowongan wajib diisi' })
      .trim()
      .min(3, 'Judul lowongan minimal 3 karakter')
      .max(150, 'Judul lowongan maksimal 150 karakter'),
    description: z
      .string({ message: 'Deskripsi lowongan wajib diisi' })
      .trim()
      .min(20, 'Deskripsi lowongan minimal 20 karakter'),
    location: z
      .string({ message: 'Lokasi lowongan wajib diisi' })
      .trim()
      .min(1, 'Lokasi lowongan tidak boleh kosong'),
    jobType: z.enum(
      [
        JobType.FULL_TIME,
        JobType.PART_TIME,
        JobType.CONTRACT,
        JobType.INTERNSHIP,
        JobType.FREELANCE,
      ],
      { message: 'Tipe pekerjaan tidak valid' }
    ),
    salaryMin: z.coerce
      .number()
      .int('Gaji minimal harus berupa bilangan bulat')
      .positive('Gaji minimal harus bernilai positif')
      .optional(),
    salaryMax: z.coerce
      .number()
      .int('Gaji maksimal harus berupa bilangan bulat')
      .positive('Gaji maksimal harus bernilai positif')
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: 'Gaji maksimal harus lebih besar atau sama dengan gaji minimal',
      path: ['salaryMax'],
    }
  );

export const jobIdParamSchema = z
  .object({
    id: z.string().uuid('ID lowongan harus berupa UUID yang valid'),
  })
  .strict();

export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;

