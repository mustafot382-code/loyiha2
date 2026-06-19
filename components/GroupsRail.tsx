"use client";

import { GroupCard } from "@/components/GroupCard";
import type { GroupWithCount } from "@/lib/types";

export function GroupsRail({
  groups,
  selectedGroupId,
  onSelect,
  query,
}: {
  groups: GroupWithCount[];
  selectedGroupId: string | null;
  onSelect: (id: string) => void;
  query: string;
}) {
  if (groups.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-border bg-surface px-6 py-10 text-center">
        <p className="font-display text-base font-semibold text-ink">
          {query ? `No groups match "${query}"` : "No groups yet"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {query
            ? "Try a different search term."
            : "Create your first group to start adding students."}
        </p>
      </div>
    );
  }

  return (
    <div className="rail flex gap-4 overflow-x-auto pb-2">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          selected={group.id === selectedGroupId}
          onSelect={() => onSelect(group.id)}
        />
      ))}
    </div>
  );
}
