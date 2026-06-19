"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving}
          className="rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
