"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import type { Group, Student } from "@/lib/types";

export type StudentFormValues = {
  full_name: string;
  age: string;
  email: string;
  group_id: string;
};

export function StudentFormDialog({
  open,
  mode,
  groups,
  defaultGroupId,
  student,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  groups: Group[];
  defaultGroupId: string | null;
  student?: Student | null;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<StudentFormValues>({
    full_name: "",
    age: "",
    email: "",
    group_id: defaultGroupId ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && student) {
      setValues({
        full_name: student.full_name,
        age: student.age?.toString() ?? "",
        email: student.email ?? "",
        group_id: student.group_id,
      });
    } else {
      setValues({
        full_name: "",
        age: "",
        email: "",
        group_id: defaultGroupId ?? "",
      });
    }
    setError(null);
  }, [open, mode, student, defaultGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.full_name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!values.group_id) {
      setError("Choose a group.");
      return;
    }
    if (values.age && Number.isNaN(Number(values.age))) {
      setError("Age must be a number.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add student" : "Edit student"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            autoFocus
            value={values.full_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, full_name: e.target.value }))
            }
            placeholder="e.g. Nozim Kozimov"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Age
            </label>
            <input
              value={values.age}
              onChange={(e) =>
                setValues((v) => ({ ...v, age: e.target.value }))
              }
              inputMode="numeric"
              placeholder="12"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Group
            </label>
            <select
              value={values.group_id}
              onChange={(e) =>
                setValues((v) => ({ ...v, group_id: e.target.value }))
              }
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-primary"
            >
              <option value="" disabled>
                Choose…
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            value={values.email}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
            type="email"
            placeholder="name@example.com"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-bg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving
              ? "Saving…"
              : mode === "add"
                ? "Add student"
                : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
