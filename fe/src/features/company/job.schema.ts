import { z } from 'zod';

export const createJobFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Judul lowongan minimal 3 karakter')
      .max(150, 'Judul lowongan maksimal 150 karakter'),
    description: z
      .string()
      .trim()
      .min(20, 'Deskripsi lowongan minimal 20 karakter'),
    location: z
      .string()
      .trim()
      .min(1, 'Lokasi pekerjaan tidak boleh kosong'),
    jobType: z.enum(
      ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'],
      { required_error: 'Tipe pekerjaan wajib dipilih' }
    ),
    salaryMin: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === '' || val === undefined ? undefined : Number(val)))
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: 'Gaji minimal harus bernilai positif',
      }),
    salaryMax: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === '' || val === undefined ? undefined : Number(val)))
      .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
        message: 'Gaji maksimal harus bernilai positif',
      }),
  })
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

export type CreateJobFormValues = z.infer<typeof createJobFormSchema>;

