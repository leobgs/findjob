import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ApplicationStatus, CandidateApplication } from "@/types";
import { useUpdateApplicationStatus } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { CheckCircle2 } from "lucide-react";

const STATUS_OPTIONS: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: "APPLIED", label: "Terkirim (Applied)" },
  { value: "REVIEWING", label: "Sedang Ditinjau (Reviewing)" },
  { value: "SHORTLISTED", label: "Lolos Seleksi (Shortlisted)" },
  { value: "ACCEPTED", label: "Diterima (Accepted)" },
  { value: "REJECTED", label: "Ditolak (Rejected)" },
];

interface StatusSelectDialogProps {
  jobId: string;
  candidate: CandidateApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StatusSelectDialog: React.FC<StatusSelectDialogProps> = ({
  jobId,
  candidate,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("REVIEWING");
  const [note, setNote] = useState("");

  const updateMutation = useUpdateApplicationStatus(jobId);

  useEffect(() => {
    if (candidate) {
      setNewStatus(candidate.status);
      setNote("");
    }
  }, [candidate]);

  if (!candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === candidate.status) {
      return;
    }

    updateMutation.mutate(
      {
        applicationId: candidate.id,
        payload: {
          status: newStatus,
          note: note.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  const isSameStatus = newStatus === candidate.status;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogCloseButton onClick={onClose} />
      <DialogHeader>
        <DialogTitle>Ubah Status Lamaran Kandidat</DialogTitle>
        <DialogDescription>
          Pilih status baru untuk kandidat dan tambahkan catatan evaluasi jika
          diperlukan.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Candidate Info Summary */}
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
          <div className="font-semibold text-foreground text-sm">
            {candidate.applicant.name}
          </div>
          <div className="text-muted-foreground">
            {candidate.applicant.email}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-muted-foreground">Status saat ini:</span>
            <StatusBadge status={candidate.status} />
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Status Baru <span className="text-destructive">*</span>
          </label>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
            iconClassName="right-3.5"
          >
            {STATUS_OPTIONS.map((option) => {
              if (
                option.value === "APPLIED" &&
                candidate.status !== "APPLIED"
              ) {
                return null;
              }

              const isCurrent = option.value === candidate.status;

              return (
                <option
                  key={option.value}
                value={option.value}
                  disabled={isCurrent}
                >
                  {option.label} {isCurrent ? "(Status Saat Ini)" : ""}
                </option>
              );
            })}
          </Select>
        </div>

        {/* Optional Note */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Catatan / Alasan Perubahan
            </label>
            <span className="text-[11px] text-muted-foreground">
              {note.length}/500 karakter
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Kandidat memenuhi kriteria teknis, lanjut ke tahap wawancara user..."
            className="flex w-full rounded-lg border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={updateMutation.isPending}
            disabled={isSameStatus}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
