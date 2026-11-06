import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMyApplications } from "@/hooks/useApplications";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { HistoryTimelineModal } from "@/features/applications/HistoryTimelineModal";
import { formatSalary, formatDate, getJobTypeLabel } from "@/utils/format";
import { ApplicationStatus } from "@/types";
import {
  FileText,
  Building2,
  MapPin,
  Banknote,
  Calendar,
  History,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";

export const MyApplicationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const statusFilter =
    (searchParams.get("status") as ApplicationStatus) || undefined;

  const { data, isLoading, isError, error, refetch } = useMyApplications({
    page,
    limit: 6,
    status: statusFilter,
  });

  const handleStatusFilterChange = (status?: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Riwayat Lamaran Saya
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau perkembangan dan status terbaru dari seluruh lowongan yang
            Anda lamar
          </p>
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full sm:w-56">
          <Select
            value={statusFilter || ''}
            onChange={(e) =>
              handleStatusFilterChange(e.target.value || undefined)
            }
          >
            <option value="">Semua Status</option>
            <option value="APPLIED">Terkirim (Applied)</option>
            <option value="REVIEWING">Sedang Ditinjau</option>
            <option value="SHORTLISTED">Lolos Seleksi</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-5 space-y-3"
            >
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
          title="Gagal Memuat Lamaran"
          message={
            (error as Error)?.message ||
            "Terjadi kesalahan saat memuat riwayat lamaran."
          }
          onRetry={() => refetch()}
        />
      ) : !data?.applications || data.applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum Ada Lamaran"
          description={
            statusFilter
              ? "Tidak ada lamaran yang cocok dengan status yang Anda pilih."
              : "Anda belum melamar pekerjaan apa pun saat ini. Mulai cari lowongan yang sesuai!"
          }
          action={
            <Link to="/jobs">
              <Button className="gap-2">
                <Briefcase className="h-4 w-4" />
                Cari Lowongan Kerja
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.applications.map((app) => (
            <Card key={app.id} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {app.job?.title || 'Lowongan Pekerjaan'}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>
                        {app.company?.name ||
                          app.job?.company?.name ||
                          'Perusahaan'}
                      </span>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{app.job.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      {formatSalary(app.job.salaryMin, app.job.salaryMax)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Dilamar pada {formatDate(app.appliedAt || app.createdAt)}
                    </span>
                  </div>

                  <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {getJobTypeLabel(app.job.jobType)}
                  </span>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/70 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAppId(app.id)}
                    className="gap-1.5"
                  >
                    <History className="h-4 w-4" />
                    Lihat Riwayat Status
                  </Button>

                  <Link to={`/jobs/${app.job.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <ExternalLink className="h-4 w-4" />
                      Lihat Lowongan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

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

      {/* History Modal */}
      <HistoryTimelineModal
        applicationId={selectedAppId}
        isOpen={Boolean(selectedAppId)}
        onClose={() => setSelectedAppId(null)}
      />
    </div>
  );
};
