"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { DollarSign, Truck, Users, TrendingUp, Scale, Cpu } from "lucide-react";
import type { DomainRole } from "@/types";

const ROLES: { role: DomainRole; icon: React.ElementType; label: string }[] = [
  { role: "Finance", icon: DollarSign, label: "Finance" },
  { role: "Operations", icon: Truck, label: "Operations" },
  { role: "HR", icon: Users, label: "HR" },
  { role: "Sales", icon: TrendingUp, label: "Sales" },
  { role: "Legal", icon: Scale, label: "Legal" },
  { role: "IT", icon: Cpu, label: "IT" },
];

export default function LoginPage() {
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);

  function handleSelect(role: DomainRole) {
    setRole(role);
    router.push(`/dashboard/${role.toLowerCase()}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="layout-container mx-auto py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Select Your Role
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Choose a domain to view your tailored dashboard
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.role}
                  onClick={() => handleSelect(r.role)}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="font-medium text-white">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
