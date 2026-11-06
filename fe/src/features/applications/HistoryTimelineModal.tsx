import React from 'react';
import { useApplicationHistory } from '@/hooks/useApplications';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format';
import { History, ArrowRight, UserCircle2, MessageSquare } from 'lucide-react';

interface HistoryTimelineModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const HistoryTimelineModal: React.FC<HistoryTimelineModalProps> = ({
  applicationId,
  isOpen,
  onClose,
  title = 'Riwayat Status Lamaran',
}) => {
  const { data: history, isLoading, isError } = useApplicationHistory(
    isOpen ? applicationId : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogCloseButton onClick={onClose} />
      <DialogHeader>
        <div className="flex items-center gap-2 text-primary">
          <History className="h-5 w-5" />
          <DialogTitle>{title}</DialogTitle>
        </div>
        <DialogDescription>
          Catatan kronologis setiap perubahan status yang terjadi pada lamaran ini.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            Gagal memuat data riwayat status. Silakan coba kembali.
          </div>
        ) : !history || history.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada catatan riwayat status untuk lamaran ini.
          </div>
        ) : (
          <ol className="relative ml-3 border-l-2 border-border/80 space-y-6 py-2">
            {history.map((item, index) => (
              <li key={item.id} className="ml-6">
                <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-background ring-4 ring-background">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index === history.length - 1
                        ? 'bg-primary animate-pulse'
                        : 'bg-muted-foreground'
                    }`}
                  />
                </span>

                <div className="rounded-lg border border-border bg-card p-3.5 shadow-sm space-y-2">
                  {/* Status Transition Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.fromStatus ? (
                      <>
                        <StatusBadge status={item.fromStatus} />
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <StatusBadge status={item.toStatus} />
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Lamaran Awal:</span>
                        <StatusBadge status={item.toStatus} />
                      </div>
                    )}
                  </div>

                  {/* Note / Catatan if provided */}
                  {item.note && (
                    <div className="flex items-start gap-1.5 rounded-md bg-muted/50 p-2.5 text-xs text-foreground">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                      <p className="italic">"{item.note}"</p>
                    </div>
                  )}

                  {/* Metadata: Actor & Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <UserCircle2 className="h-3.5 w-3.5" />
                      <span>{item.changedBy.name}</span>
                      <span className="text-[10px] text-muted-foreground/80">
                        ({item.changedBy.role === 'COMPANY' ? 'Perusahaan' : 'Pelamar'})
                      </span>
                    </div>
                    <time dateTime={item.createdAt}>
                      {formatDate(item.createdAt)}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Dialog>
  );
};

