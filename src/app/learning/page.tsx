"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle } from "lucide-react";
import type { DomainRole } from "@/types";

const LEARNING_CONTENT: Record<DomainRole, { title: string; desc: string; items: string[] }[]> = {
  Finance: [
    { title: "Budget & Revenue", desc: "Monitor variance, approvals, and cash flow", items: ["Review KPI cards regularly", "Act on high-priority alerts", "Track cross-domain impact"] },
  ],
  Operations: [
    { title: "Process & Delivery", desc: "Manage delays and vendor dependencies", items: ["Check process delay reports", "Review delivery risk notices", "Use the Knowledge Graph for dependencies"] },
  ],
  HR: [
    { title: "Hiring & Attrition", desc: "Stay on top of talent and policy", items: ["Monitor hiring status", "Review attrition signals", "Act on policy updates"] },
  ],
  Sales: [
    { title: "Pipeline & Deals", desc: "Track targets and deal risks", items: ["Review pipeline status", "Address target gaps", "Act on deal risk alerts"] },
  ],
  Legal: [
    { title: "Contracts & Compliance", desc: "Manage approvals and compliance", items: ["Review contract approvals", "Act on compliance alerts", "Resolve review bottlenecks"] },
  ],
  IT: [
    { title: "Systems & Security", desc: "Monitor deployments and incidents", items: ["Track deployment updates", "Review incident reports", "Act on security notices"] },
  ],
};

export default function LearningPage() {
  const router = useRouter();
  const role = useAppStore((s) => s.role);

  useEffect(() => {
    if (!role) router.replace("/login");
  }, [role, router]);

  if (!role) return null;

  const content = LEARNING_CONTENT[role] ?? LEARNING_CONTENT.Finance;

  return (
    <DashboardLayout>
      <SectionHeader title={`Learning & Onboarding for ${role}`} subtitle="Role-based guidance and best practices" />
      <div className="grid gap-4">
        {content.map((section, i) => (
          <Card key={i} hover>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="text-slate-400 mt-1 text-sm">{section.desc}</p>
                <ul className="mt-4 space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
