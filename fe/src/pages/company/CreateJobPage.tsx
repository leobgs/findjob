import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateJob } from '@/hooks/useJobs';
import {
  createJobFormSchema,
  CreateJobFormValues,
} from '@/features/company/job.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { ApiResponse } from '@/types';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      jobType: 'FULL_TIME',
      salaryMin: undefined,
      salaryMax: undefined,
    },
  });

  const onSubmit = (data: CreateJobFormValues) => {
    createJobMutation.mutate(
      {
        title: data.title,
        description: data.description,
        location: data.location,
        jobType: data.jobType,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      },
      {
        onSuccess: () => {
          navigate('/company/jobs');
        },
        onError: (err: unknown) => {
          if (axios.isAxiosError<ApiResponse>(err)) {
            const errorData = err.response?.data;
            if (errorData?.errors && errorData.errors.length > 0) {
              errorData.errors.forEach((e) => {
                setError(e.field as keyof CreateJobFormValues, {
                  message: e.message,
                });
              });
            }
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/company/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Lowongan Perusahaan
      </Link>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Buat Lowongan Pekerjaan Baru
          </CardTitle>
          <CardDescription>
            Isi formulir berikut dengan jelas untuk menarik talenta terbaik
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Judul Posisi Pekerjaan <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Contoh: Senior Backend Engineer"
                {...register('title')}
                error={errors.title?.message}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Deskripsi & Kualifikasi Pekerjaan <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={7}
                placeholder="Jelaskan tanggung jawab utama, persyaratan teknis, dan keuntungan bekerja di perusahaan Anda (minimal 20 karakter)..."
                {...register('description')}
                className="flex w-full rounded-lg border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location & Job Type Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Lokasi Kerja <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Contoh: Jakarta Selatan / Remote"
                  {...register('location')}
                  error={errors.location?.message}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Tipe Pekerjaan <span className="text-destructive">*</span>
                </label>
                <Select
                  {...register('jobType')}
                  error={errors.jobType?.message}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Kontrak</option>
                  <option value="INTERNSHIP">Magang (Internship)</option>
                  <option value="FREELANCE">Freelance</option>
                </Select>
              </div>
            </div>

            {/* Salary Range Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Gaji Minimal (IDR) <span className="text-xs text-muted-foreground">(Opsional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="Contoh: 10000000"
                  {...register('salaryMin')}
                  error={errors.salaryMin?.message}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Gaji Maksimal (IDR) <span className="text-xs text-muted-foreground">(Opsional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="Contoh: 18000000"
                  {...register('salaryMax')}
                  error={errors.salaryMax?.message}
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link to="/company/jobs">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={createJobMutation.isPending}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Publikasikan Lowongan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

