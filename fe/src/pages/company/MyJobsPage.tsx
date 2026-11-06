import React from 'react';
import { Link } from 'react-router-dom';
import { useMyJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatSalary, formatDate, getJobTypeLabel } from '@/utils/format';
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  Banknote,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const MyJobsPage: React.FC = () => {
  const { data: jobs, isLoading, isError, error, refetch } = useMyJobs();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Lowongan Perusahaan Saya
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola lowongan aktif dan pantau kandidat pelamar yang masuk
          </p>
        </div>

        <Link to="/company/jobs/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Buat Lowongan Baru
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Lowongan"
          message={(error as Error)?.message || 'Terjadi kesalahan saat memuat daftar lowongan.'}
          onRetry={() => refetch()}
        />
      ) : !jobs || jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Belum Ada Lowongan"
          description="Perusahaan Anda belum mempublikasikan lowongan pekerjaan apa pun. Mulai cari talenta terbaik sekarang!"
          action={
            <Link to="/company/jobs/new">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Pasang Lowongan Pertama
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {getJobTypeLabel(job.jobType)}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                          job.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {job.status === 'OPEN' ? 'Aktif' : 'Ditutup'}
                      </span>
                    </div>

                    <CardTitle className="mt-2 text-xl font-bold text-foreground">
                      {job.title}
                    </CardTitle>
                  </div>

                  <Link to={`/company/jobs/${job.id}/applicants`}>
                    <Button
                      variant={job.applicantCount > 0 ? 'default' : 'outline'}
                      className="gap-2 font-medium"
                    >
                      <Users className="h-4 w-4" />
                      Kelola Pelamar ({job.applicantCount})
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Dibuat pada {formatDate(job.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="text-xs text-muted-foreground">
                    Total {job.applicantCount} kandidat telah melamar lowongan ini
                  </span>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Pratinjau Halaman Publik
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

