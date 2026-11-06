import React from 'react';
import { Link } from 'react-router-dom';
import { JobListItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatSalary, getJobTypeLabel, formatDateShort } from '@/utils/format';
import { MapPin, Building2, Banknote, Calendar, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: JobListItem;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link to={`/jobs/${job.id}`} className="group block focus:outline-none">
      <Card className="h-full border border-border bg-card transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {job.title}
              </CardTitle>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{job.company.name}</span>
              </div>
            </div>

            {job.hasApplied && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Sudah Dilamar
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1 font-medium text-emerald-700">
              <Banknote className="h-3.5 w-3.5 shrink-0" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {getJobTypeLabel(job.jobType)}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDateShort(job.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

