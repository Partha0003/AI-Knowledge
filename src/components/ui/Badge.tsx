"use client";

type BadgeVariant = "high" | "medium" | "low" | "success" | "warning" | "info" | "default";

const variants: Record<BadgeVariant, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  default: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
