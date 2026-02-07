"use client";

import { Navbar } from "./Navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="layout-container mx-auto py-6">{children}</div>
      </main>
    </div>
  );
}
