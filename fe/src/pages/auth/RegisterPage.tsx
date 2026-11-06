import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { registerFormSchema, RegisterFormValues } from '@/features/auth/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase, AlertCircle, User, Building } from 'lucide-react';
import axios from 'axios';
import { ApiResponse } from '@/types';

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [serverError, setServerError] = useState<string | null>(null);

  const initialRole = roleParam === 'COMPANY' ? 'COMPANY' : 'JOB_SEEKER';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: initialRole,
      name: '',
      email: '',
      password: '',
      companyName: '',
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (roleParam === 'COMPANY' || roleParam === 'JOB_SEEKER') {
      setValue('role', roleParam);
    }
  }, [roleParam, setValue]);

  const handleRoleChange = (role: 'JOB_SEEKER' | 'COMPANY') => {
    setValue('role', role);
    setSearchParams({ role });
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const user = await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        companyName: data.role === 'COMPANY' ? data.companyName : undefined,
      });

      navigate(user.role === 'COMPANY' ? '/company/jobs' : '/jobs', {
        replace: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiResponse>(err)) {
        const errorData = err.response?.data;
        if (errorData?.errors && errorData.errors.length > 0) {
          errorData.errors.forEach((e) => {
            setError(e.field as keyof RegisterFormValues, {
              message: e.message,
            });
          });
        } else {
          setServerError(
            errorData?.message || 'Pendaftaran gagal, silakan coba lagi.'
          );
        }
      } else {
        setServerError('Terjadi kesalahan jaringan, silakan coba lagi.');
      }
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
          <CardDescription>
            Pilih peran Anda untuk memulai pengalaman di Indokerja
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange('JOB_SEEKER')}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition ${
                selectedRole === 'JOB_SEEKER'
                  ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <User className="h-6 w-6" />
              <div className="text-sm font-semibold">Pencari Kerja</div>
              <div className="text-xs text-muted-foreground">Melamar pekerjaan</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('COMPANY')}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition ${
                selectedRole === 'COMPANY'
                  ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Building className="h-6 w-6" />
              <div className="text-sm font-semibold">Perusahaan</div>
              <div className="text-xs text-muted-foreground">Buka lowongan kerja</div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Nama Lengkap
              </label>
              <Input
                placeholder="Contoh: Budi Santoso"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            {selectedRole === 'COMPANY' && (
              <div className="animate-in fade-in-50">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Nama Perusahaan
                </label>
                <Input
                  placeholder="Contoh: PT Teknologi Bangsa"
                  {...register('companyName')}
                  error={errors.companyName?.message}
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Alamat Email
              </label>
              <Input
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Kata Sandi
              </label>
              <PasswordInput
                placeholder="Minimal 8 karakter kombinasi huruf & angka"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Daftar Sebagai {selectedRole === 'COMPANY' ? 'Perusahaan' : 'Pencari Kerja'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

