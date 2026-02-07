"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Lightbulb } from "lucide-react";
import type { ProcessedInsight, DomainRole } from "@/types";

function filterByDomain(insights: ProcessedInsight[], role: DomainRole): ProcessedInsight[] {
  return insights.filter((i) => i.domain === role);
}

export default function InsightsPage() {
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<ProcessedInsight[]>([]);

  useEffect(() => {
    if (!role) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        const all = json.insights ?? [];
        setInsights(filterByDomain(all, role));
      } catch {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [role, router]);

  if (!role) return null;

  const priorityVariant = (p: string) => (p === "High" ? "high" : p === "Medium" ? "medium" : "low");

  return (
    <DashboardLayout>
      <SectionHeader title={`Insights for ${role}`} subtitle={`${insights.length} insights in your domain`} />
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
      ) : insights.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No insights in your domain.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} hover>
              <div className="flex flex-wrap gap-2 mb-3">
                {insight.isDemoData && <Badge variant="info">Demo Data</Badge>}
                <Badge variant={priorityVariant(insight.priority)}>{insight.priority}</Badge>
                <Badge variant="default">{insight.type}</Badge>
                <DomainBadge domain={insight.domain} />
              </div>
              <h3 className="font-semibold text-white">{insight.title}</h3>
              <p className="text-slate-400 mt-2 text-sm">{insight.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
