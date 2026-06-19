"use client";

import { Search, Plus, UserPlus } from "lucide-react";

export function Header({
  query,
  onQueryChange,
  onAddGroup,
  onAddStudent,
  addStudentDisabled,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onAddGroup: () => void;
  onAddStudent: () => void;
  addStudentDisabled: boolean;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-base font-bold text-white">
          
        </div>
        <div className="hidden sm:block">
          <p className="font-display text-base font-semibold leading-tight text-ink">
            Student Manager
          </p>
          <p className="text-xs text-muted">Groups & roster</p>
        </div>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by group name"
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAddGroup}
          className="inline-flex items-center gap-1.5 rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-tint"
        >
          <Plus size={16} />
          Add group
        </button>
        <button
          type="button"
          onClick={onAddStudent}
          disabled={addStudentDisabled}
          title={
            addStudentDisabled ? "Select a group first" : "Add a student"
          }
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UserPlus size={16} />
          Add student
        </button>
      </div>
    </header>
  );
}
