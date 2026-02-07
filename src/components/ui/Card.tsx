"use client";

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-700/50 bg-slate-800/60 p-5 ${
        hover ? "hover:bg-slate-800/80 hover:border-slate-600/50 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
