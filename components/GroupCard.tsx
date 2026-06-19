"use client";

import { Switch } from "@/components/Switch";
import type { GroupWithCount } from "@/lib/types";

const ACCENTS = ["#4338CA", "#0E8A82", "#D97706", "#DB2777", "#2563EB", "#16A34A"];

function accentFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % ACCENTS.length;
  return ACCENTS[hash];
}

export function GroupCard({
  group,
  selected,
  onSelect,
}: {
  group: GroupWithCount;
  selected: boolean;
  onSelect: (next: boolean) => void;
}) {
  const accent = accentFor(group.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(true)}
      aria-pressed={selected}
      className={`group relative flex w-64 shrink-0 flex-col gap-6 overflow-hidden rounded-xl2 border bg-surface p-5 text-left transition-all duration-150 ${
        selected
          ? "border-primary shadow-cardHover ring-1 ring-primary/30"
          : "border-border shadow-card hover:border-primary/40 hover:shadow-cardHover"
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="pl-2">
        <h3 className="truncate font-display text-xl font-semibold text-ink">
          {group.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {group.student_count}{" "}
          {group.student_count === 1 ? "student" : "students"}
        </p>
      </div>
      <div className="flex items-center justify-between pl-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {selected ? "Viewing" : "View roster"}
        </span>
        <Switch
          checked={selected}
          onChange={onSelect}
          label={`Select ${group.name}`}
        />
      </div>
    </button>
  );
}
