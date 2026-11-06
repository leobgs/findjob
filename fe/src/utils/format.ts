import { ApplicationStatus, JobType } from '@/types';

export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined
): string {
  if (!min && !max) {
    return 'Gaji dirahasiakan';
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  if (min && max) {
    if (min === max) {
      return formatter.format(min);
    }
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }

  if (min) {
    return `Mulai dari ${formatter.format(min)}`;
  }

  return `Hingga ${formatter.format(max!)}`;
}

export function formatDate(dateString?: string | number | Date | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(dateString?: string | number | Date | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getJobTypeLabel(type: JobType): string {
  const labels: Record<JobType, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Kontrak',
    INTERNSHIP: 'Magang',
    FREELANCE: 'Freelance',
  };
  return labels[type] || type;
}

export function getStatusBadgeConfig(status: ApplicationStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'APPLIED':
      return {
        label: 'Terkirim',
        className: 'bg-slate-100 text-slate-800 border-slate-300',
      };
    case 'REVIEWING':
      return {
        label: 'Sedang Ditinjau',
        className: 'bg-blue-50 text-blue-700 border-blue-300',
      };
    case 'SHORTLISTED':
      return {
        label: 'Lolos Seleksi',
        className: 'bg-amber-50 text-amber-800 border-amber-300',
      };
    case 'ACCEPTED':
      return {
        label: 'Diterima',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      };
    case 'REJECTED':
      return {
        label: 'Ditolak',
        className: 'bg-rose-50 text-rose-700 border-rose-300',
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-800 border-gray-300',
      };
  }
}

