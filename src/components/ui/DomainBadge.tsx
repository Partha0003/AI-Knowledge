"use client";

import type { Domain } from "@/types";

const DOMAIN_COLORS: Record<string, string> = {
  Finance: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Operations: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  HR: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Sales: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Legal: "bg-red-500/20 text-red-400 border-red-500/30",
  IT: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export function DomainBadge({ domain }: { domain?: Domain | string | null }) {
  if (!domain) return null;
  const c = DOMAIN_COLORS[domain] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${c}`}>
      {domain}
    </span>
  );
}
