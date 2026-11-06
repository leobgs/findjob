import React from "react";
import { useSearchParams } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/features/jobs/JobCard";
import { JobFilters } from "@/features/jobs/JobFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Button } from "@/components/ui/button";
import { JobType } from "@/types";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const location = searchParams.get("location") || undefined;
  const jobType = (searchParams.get("jobType") as JobType) || undefined;

  const { data, isLoading, isError, error, refetch } = useJobs({
    page,
    limit: 6,
    search,
    location,
    jobType,
  });

  const handleFilterChange = (newFilters: {
    search?: string;
    jobType?: JobType;
    location?: string;
    page: number;
  }) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.jobType) params.set("jobType", newFilters.jobType);
    if (newFilters.location) params.set("location", newFilters.location);
    params.set("page", newFilters.page.toString());
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Eksplor Lowongan Pekerjaan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Temukan kesempatan karir terbaik dari berbagai perusahaan terkemuka
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <JobFilters
        search={search}
        jobType={jobType}
        location={location}
        onFilterChange={handleFilterChange}
      />

      {/* Content State Handling */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-5 space-y-4"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Gagal Memuat Lowongan"
          message={
            (error as Error)?.message ||
            "Terjadi kesalahan saat memuat daftar lowongan."
          }
          onRetry={() => refetch()}
        />
      ) : !data?.jobs || data.jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Tidak Ada Lowongan Ditemukan"
          description="Coba ubah kata kunci pencarian, filter tipe pekerjaan, atau lokasi Anda."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {data?.meta && (
            <div className="text-xs font-medium text-muted-foreground text-center -mt-2">
              Menampilkan {data.jobs.length} dari total {data.meta.total}{" "}
              lowongan
            </div>
          )}

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
        </>
      )}
    </div>
  );
};
