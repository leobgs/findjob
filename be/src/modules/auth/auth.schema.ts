import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z
  .object({
    name: z
      .string({ message: 'Nama wajib berupa string' })
      .trim()
      .min(2, 'Nama minimal 2 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z
      .string({ message: 'Email wajib berupa string' })
      .trim()
      .toLowerCase()
      .email('Format email tidak valid'),
    password: z
      .string({ message: 'Password wajib berupa string' })
      .min(8, 'Password minimal 8 karakter')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password harus mengandung kombinasi huruf dan angka'),
    role: z.enum([Role.JOB_SEEKER, Role.COMPANY], {
      message: 'Role harus berupa JOB_SEEKER atau COMPANY',
    }),
    companyName: z.string().trim().min(2, 'Nama perusahaan minimal 2 karakter').max(100).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.role === Role.COMPANY) {
        return !!data.companyName && data.companyName.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Nama perusahaan (companyName) wajib diisi untuk akun perusahaan',
      path: ['companyName'],
    }
  );

export const loginSchema = z
  .object({
    email: z
      .string({ message: 'Email wajib diisi' })
      .trim()
      .toLowerCase()
      .email('Format email tidak valid'),
    password: z.string({ message: 'Password wajib diisi' }),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
