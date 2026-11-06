import React from 'react';
import { ApplicationStatus } from '@/types';
import { getStatusBadgeConfig } from '@/utils/format';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { label, className: badgeClass } = getStatusBadgeConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeClass,
        className
      )}
    >
      {label}
    </span>
  );
};

