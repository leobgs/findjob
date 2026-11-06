import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobDetail, useApplyJob } from '@/hooks/useJobs';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from '@/components/ui/dialog';
import {
  formatSalary,
  getJobTypeLabel,
  formatDate,
  formatDateShort,
} from '@/utils/format';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Banknote,
  Briefcase,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  Users,
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { data: job, isLoading, isError, error, refetch } = useJobDetail(id!);
  const applyMutation = useApplyJob(id!);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="rounded-xl border border-border p-6 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <ErrorState
          title="Lowongan Tidak Ditemukan"
          message={(error as Error)?.message || 'Lowongan yang Anda cari tidak tersedia atau telah dihapus.'}
          onRetry={() => refetch()}
        />
        <div className="mt-4 text-center">
          <Link to={user?.role === 'COMPANY' ? '/company/jobs' : '/jobs'}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {user?.role === 'COMPANY'
                ? 'Kembali ke Lowongan Saya'
                : 'Kembali ke Daftar Lowongan'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSeeker = user?.role === 'JOB_SEEKER';
  const hasApplied = Boolean(job.application);

  const handleApply = () => {
    applyMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmModalOpen(false);
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() =>
          user?.role === 'COMPANY'
            ? navigate('/company/jobs')
            : navigate('/jobs')
        }
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {user?.role === 'COMPANY'
          ? 'Kembali ke Lowongan Saya'
          : 'Kembali ke Daftar Lowongan'}
      </button>

      {/* Company Preview Notice */}
      {user?.role === 'COMPANY' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              Mode Pratinjau Publik
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              — Ini adalah tampilan lowongan Anda yang dilihat oleh pencari kerja.
            </span>
          </div>
          <Link to={`/company/jobs/${job.id}/applicants`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5 text-primary" />
              Kelola Pelamar Lowongan
            </Button>
          </Link>
        </div>
      )}

      {/* Header Banner Card */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {getJobTypeLabel(job.jobType)}
                </span>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    job.status === 'OPEN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {job.status === 'OPEN' ? 'Perekrutan Aktif' : 'Sudah Ditutup'}
                </span>
              </div>

              <CardTitle className="text-2xl font-bold sm:text-3xl">
                {job.title}
              </CardTitle>

              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                <span>{job.company.name}</span>
              </div>
            </div>

            {/* Apply Action CTA */}
            {isSeeker && (
              <div className="sm:self-center">
                {hasApplied ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-right sm:min-w-[200px]">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Status Lamaran:
                    </div>
                    <div className="mt-1">
                      <StatusBadge status={job.application!.status} />
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDateShort(
                          job.application?.appliedAt || job.application?.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                ) : job.status === 'OPEN' ? (
                  <Button
                    size="lg"
                    onClick={() => setConfirmModalOpen(true)}
                    className="w-full gap-2 font-semibold shadow-md sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Lamar Pekerjaan Ini
                  </Button>
                ) : (
                  <Button size="lg" disabled className="w-full sm:w-auto">
                    Lowongan Telah Ditutup
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Highlights Row */}
        <CardContent className="border-t border-border/70 pt-4">
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4 sm:text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lokasi</span>
              </div>
              <div className="font-semibold text-foreground">{job.location}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Banknote className="h-4 w-4 text-emerald-600" />
                <span>Estimasi Gaji</span>
              </div>
              <div className="font-semibold text-emerald-700">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>Tipe Pekerjaan</span>
              </div>
              <div className="font-semibold text-foreground">
                {getJobTypeLabel(job.jobType)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Dipublikasikan</span>
              </div>
              <div className="font-semibold text-foreground">
                {formatDate(job.createdAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description Content */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            Deskripsi Pekerjaan & Kualifikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {job.description}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Apply */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogCloseButton onClick={() => setConfirmModalOpen(false)} />
        <DialogHeader>
          <DialogTitle>Konfirmasi Pengiriman Lamaran</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin melamar posisi berikut? Profil dan kontak Anda
            akan dikirimkan ke perusahaan.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg border border-border bg-muted/40 p-3 space-y-1.5 text-sm">
          <div className="font-semibold text-foreground">{job.title}</div>
          <div className="text-xs text-muted-foreground">
            {job.company.name} • {job.location}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setConfirmModalOpen(false)}
            disabled={applyMutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleApply}
            isLoading={applyMutation.isPending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Ya, Kirim Lamaran
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

