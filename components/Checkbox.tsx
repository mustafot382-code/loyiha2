"use client";

import { Check } from "lucide-react";

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150 ${
        checked
          ? "border-primary bg-primary"
          : "border-border bg-surface hover:border-primary/50"
      }`}
    >
      {checked && <Check size={13} strokeWidth={3} className="text-white" />}
    </button>
  );
}
