"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/Checkbox";
import type { Student } from "@/lib/types";

export function StudentsTable({
  students,
  groupName,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  students: Student[];
  groupName: string | null;
  onToggleActive: (student: Student, next: boolean) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}) {
  if (!groupName) {
    return (
      <div className="mt-8 rounded-xl2 border border-dashed border-border bg-surface px-6 py-14 text-center">
        <p className="font-display text-base font-semibold text-ink">
          Pick a group to see its roster
        </p>
        <p className="mt-1 text-sm text-muted">
          Select one of the groups above, or create a new one.
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="mt-8 rounded-xl2 border border-dashed border-border bg-surface px-6 py-14 text-center">
        <p className="font-display text-base font-semibold text-ink">
          {groupName} has no students yet
        </p>
        <p className="mt-1 text-sm text-muted">
          Use "Add student" to add the first one.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl2 border border-border bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-5 py-3.5 font-mono font-medium">No.</th>
            <th className="px-5 py-3.5">Full name</th>
            <th className="px-5 py-3.5">Age</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Active</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.id}
              className="border-b border-border last:border-b-0 hover:bg-bg/60"
            >
              <td className="px-5 py-4 font-mono text-sm text-muted">
                {index + 1}
              </td>
              <td className="px-5 py-4 text-sm font-medium text-ink">
                {student.full_name}
              </td>
              <td className="px-5 py-4 font-mono text-sm text-ink">
                {student.age ?? "—"}
              </td>
              <td className="px-5 py-4 text-sm text-muted">
                {student.email || "—"}
              </td>
              <td className="px-5 py-4">
                <Checkbox
                  checked={student.is_active}
                  onChange={(next) => onToggleActive(student, next)}
                  label={`Mark ${student.full_name} active`}
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${student.full_name}`}
                    className="rounded-lg bg-danger-tint p-2 text-danger transition-colors hover:bg-danger hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.full_name}`}
                    className="rounded-lg border border-border p-2 text-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
