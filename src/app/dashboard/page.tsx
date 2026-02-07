"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { FileText, Lightbulb, AlertTriangle, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Domain } from "@/types";

const DOMAIN_ORDER: Domain[] = ["Finance", "Operations", "HR", "Sales", "Legal", "IT"];

export default function OrganizationOverviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    docCount: number;
    insightCount: number;
    alertCount: number;
    domainCounts: { name: string; count: number }[];
    topInsights: { id: string; title: string; domain?: Domain; priority: string }[];
    topAlerts: { id: string; title: string; severity: string; domain?: Domain }[];
  }>({
    docCount: 0,
    insightCount: 0,
    alertCount: 0,
    domainCounts: [],
    topInsights: [],
    topAlerts: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        const docs = json.documents ?? [];
        const insights = json.insights ?? [];
        const alerts = json.alerts ?? [];
        const unack = alerts.filter((a: { acknowledged: boolean }) => !a.acknowledged);

        const domainMap: Record<string, number> = {};
        DOMAIN_ORDER.forEach((d) => (domainMap[d] = 0));
        docs.forEach((d: { domain?: Domain }) => {
          if (d.domain) domainMap[d.domain]++;
        });

        const sorted = [...insights].sort((a: { priority: string }, b: { priority: string }) =>
          a.priority === "High" ? -1 : b.priority === "High" ? 1 : 0
        );

        setData({
          docCount: docs.length,
          insightCount: insights.length,
          alertCount: unack.length,
          domainCounts: DOMAIN_ORDER.map((d) => ({ name: d, count: domainMap[d] ?? 0 })),
          topInsights: sorted.slice(0, 5),
          topAlerts: unack.slice(0, 5),
        });
      } catch {
        setData((p) => ({ ...p, docCount: 0, insightCount: 0, alertCount: 0 }));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
      </DashboardLayout>
    );
  }

  const kpis = [
    { label: "Total Documents Ingested", value: data.docCount, icon: FileText },
    { label: "Total Insights Generated", value: data.insightCount, icon: Lightbulb },
    { label: "Total Active Alerts", value: data.alertCount, icon: AlertTriangle },
  ];

  return (
    <DashboardLayout>
      <SectionHeader title="Organization Overview" subtitle="Aggregated view across all 6 domains" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} hover className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-slate-700/50">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{k.label}</p>
                <p className="text-2xl font-bold text-white">{k.value}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold text-white mb-4">Cross-Domain Bar Chart</h3>
          <p className="text-slate-500 text-xs mb-2">Finance → IT (Document count per domain)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.domainCounts}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-white mb-4">Daily AI Digest</h3>
          <p className="text-slate-400 text-sm mb-4">Top 5 critical insights across domains</p>
          <div className="space-y-3 mb-4">
            {data.topInsights.length > 0 ? (
              data.topInsights.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <DomainBadge domain={a.domain} />
                    <span className="text-sm text-slate-300 truncate">{a.title}</span>
                  </div>
                  <Badge variant={a.priority === "High" ? "high" : a.priority === "Medium" ? "medium" : "low"}>{a.priority}</Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No insights</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/insights" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium text-sm">
              View Insights <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/alerts" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium text-sm">
              View Alerts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>
      <Card>
        <h3 className="font-semibold text-white mb-4">Domain Dashboards</h3>
        <p className="text-slate-400 text-sm mb-4">Switch domain in the header to view tailored dashboards</p>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_ORDER.map((d) => (
            <Link key={d} href={`/dashboard/${d.toLowerCase()}`} className="px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors">
              {d} Dashboard
            </Link>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
