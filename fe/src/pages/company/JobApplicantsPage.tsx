import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useJobApplicants, useJobDetail } from '@/hooks/useJobs';
import { StatusSelectDialog } from '@/features/company/StatusSelectDialog';
import { HistoryTimelineModal } from '@/features/applications/HistoryTimelineModal';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format';
import { ApplicationStatus, CandidateApplication } from '@/types';
import {
  ArrowLeft,
  Users,
  Calendar,
  History,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
} from 'lucide-react';

export const JobApplicantsPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const statusFilter =
    (searchParams.get('status') as ApplicationStatus) || undefined;

  const [selectedCandidateForStatus, setSelectedCandidateForStatus] =
    useState<CandidateApplication | null>(null);
  const [selectedAppIdForHistory, setSelectedAppIdForHistory] =
    useState<string | null>(null);

  const { data: job, isLoading: isJobLoading } = useJobDetail(jobId!);
  const {
    data: applicantsData,
    isLoading: isApplicantsLoading,
    isError,
    error,
    refetch,
  } = useJobApplicants(jobId!, {
    page,
    limit: 10,
    status: statusFilter,
  });

  const handleStatusFilterChange = (status?: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const totalPages = applicantsData?.meta?.totalPages || 1;

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <ErrorState
          title="Gagal Memuat Data Pelamar"
          message={
            (error as Error)?.message ||
            'Lowongan pekerjaan tidak ditemukan atau Anda tidak memiliki akses ke lowongan ini.'
          }
          onRetry={() => refetch()}
        />
        <div className="mt-4 text-center">
          <Link to="/company/jobs">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Lowongan Saya
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          to="/company/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Lowongan Perusahaan
        </Link>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Daftar Pelamar
            </h1>
            {isJobLoading ? (
              <Skeleton className="mt-1 h-5 w-64" />
            ) : (
              <p className="mt-1 text-sm font-medium text-primary">
                Lowongan: {job?.title} ({job?.location})
              </p>
            )}
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-56">
            <Select
              value={statusFilter || ''}
              onChange={(e) =>
                handleStatusFilterChange(e.target.value || undefined)
              }
            >
              <option value="">Semua Status Pelamar</option>
              <option value="APPLIED">Terkirim (Applied)</option>
              <option value="REVIEWING">Sedang Ditinjau</option>
              <option value="SHORTLISTED">Lolos Seleksi</option>
              <option value="ACCEPTED">Diterima</option>
              <option value="REJECTED">Ditolak</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isApplicantsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : !applicantsData?.applications ||
        applicantsData.applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum Ada Pelamar"
          description={
            statusFilter
              ? 'Tidak ada pelamar dengan status yang Anda pilih.'
              : 'Belum ada pelamar yang mengirimkan lamaran untuk lowongan ini.'
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden rounded-xl border border-border bg-card shadow-sm md:block overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Nama Pelamar
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Kontak / Email
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Tanggal Melamar
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status Lamaran
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applicantsData.applications.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{item.applicant.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{item.applicant.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(item.appliedAt || item.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCandidateForStatus(item)}
                          className="gap-1.5"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Ubah Status
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppIdForHistory(item.id)}
                          className="gap-1.5"
                          title="Lihat riwayat status"
                        >
                          <History className="h-3.5 w-3.5" />
                          Riwayat
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="space-y-3 md:hidden">
            {applicantsData.applications.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">
                      {item.applicant.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.applicant.email}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(item.appliedAt || item.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCandidateForStatus(item)}
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Ubah Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppIdForHistory(item.id)}
                    className="gap-1.5 text-xs"
                  >
                    <History className="h-3.5 w-3.5" />
                    Riwayat
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>

              <span className="text-xs font-medium text-muted-foreground">
                Halaman {page} dari {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="gap-1"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Status Update Dialog */}
      <StatusSelectDialog
        jobId={jobId!}
        candidate={selectedCandidateForStatus}
        isOpen={Boolean(selectedCandidateForStatus)}
        onClose={() => setSelectedCandidateForStatus(null)}
        onSuccess={() => refetch()}
      />

      {/* History Timeline Modal */}
      <HistoryTimelineModal
        applicationId={selectedAppIdForHistory}
        isOpen={Boolean(selectedAppIdForHistory)}
        onClose={() => setSelectedAppIdForHistory(null)}
      />
    </div>
  );
};

