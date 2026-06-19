"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";

export function AddGroupDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setName("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(name.trim());
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Add group">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Group name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Group 3"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create group"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
