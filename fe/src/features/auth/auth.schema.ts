import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama minimal 2 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z
      .string()
      .trim()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        'Password harus mengandung kombinasi huruf dan angka'
      ),
    role: z.enum(['JOB_SEEKER', 'COMPANY'], {
      required_error: 'Role harus dipilih',
    }),
    companyName: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'COMPANY') {
        return !!data.companyName && data.companyName.trim().length >= 2;
      }
      return true;
    },
    {
      message: 'Nama perusahaan wajib diisi (minimal 2 karakter)',
      path: ['companyName'],
    }
  );

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

