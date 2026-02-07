"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { FileText, Lightbulb, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAppStore } from "@/store/useAppStore";
import type { Domain, DomainRole } from "@/types";

const DOMAINS: DomainRole[] = ["Finance", "Operations", "HR", "Sales", "Legal", "IT"];

function filterByDomain<T extends { domain?: Domain }>(items: T[], domain: string): T[] {
  return items.filter((i) => i.domain?.toLowerCase() === domain.toLowerCase());
}

export default function DomainDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const domainParam = params.domain as string;
  const setRole = useAppStore((s) => s.setRole);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    domainInsights: { id: string; title: string; domain?: Domain; priority: string; type?: string }[];
    domainAlerts: { id: string; title: string; severity: string; domain?: Domain }[];
    domainDocs: number;
    crossDomain: { name: string; count: number }[];
  }>({ domainInsights: [], domainAlerts: [], domainDocs: 0, crossDomain: [] });

  const domainName = DOMAINS.find((d) => d.toLowerCase() === domainParam) ?? domainParam;
  const isValidDomain = DOMAINS.some((d) => d.toLowerCase() === domainParam);

  useEffect(() => {
    if (isValidDomain) setRole(domainName as DomainRole);
  }, [domainName, isValidDomain, setRole]);

  useEffect(() => {
    if (!isValidDomain) {
      router.replace("/dashboard");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        const docs = json.documents ?? [];
        const insights = json.insights ?? [];
        const alerts = json.alerts ?? [];
        const unack = alerts.filter((a: { acknowledged: boolean }) => !a.acknowledged);

        const domainIns = filterByDomain(insights, domainParam);
        const domainAl = filterByDomain(unack, domainParam);
        const domainDocsCount = filterByDomain(docs, domainParam).length;

        const domainMap: Record<string, number> = {};
        DOMAINS.forEach((d) => (domainMap[d] = 0));
        docs.forEach((d: { domain?: Domain }) => {
          if (d.domain) domainMap[d.domain]++;
        });

        setData({
          domainInsights: domainIns,
          domainAlerts: domainAl,
          domainDocs: domainDocsCount,
          crossDomain: DOMAINS.map((d) => ({ name: d, count: domainMap[d] ?? 0 })),
        });
      } catch {
        setData({ domainInsights: [], domainAlerts: [], domainDocs: 0, crossDomain: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [domainParam, isValidDomain]);

  if (!isValidDomain) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SectionHeader
        title={`${domainName} Dashboard`}
        subtitle="Domain-specific insights, alerts, and action items"
        action={
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400">
            <ExternalLink className="w-4 h-4" />
            Organization Overview
          </Link>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card hover className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-slate-700/50">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Documents</p>
            <p className="text-2xl font-bold text-white">{data.domainDocs}</p>
          </div>
        </Card>
        <Card hover className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-slate-700/50">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Insights</p>
            <p className="text-2xl font-bold text-white">{data.domainInsights.length}</p>
          </div>
        </Card>
        <Card hover className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-slate-700/50">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Alerts</p>
            <p className="text-2xl font-bold text-white">{data.domainAlerts.length}</p>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold text-white mb-4">Cross-Domain Dependency</h3>
          <p className="text-slate-500 text-xs mb-2">Document distribution (read-only)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.crossDomain}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-white mb-4">Alerts in {domainName}</h3>
          {data.domainAlerts.length > 0 ? (
            <div className="space-y-3">
              {data.domainAlerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30">
                  <span className="text-sm text-slate-300 truncate">{a.title}</span>
                  <Badge variant={a.severity === "High" ? "high" : a.severity === "Medium" ? "medium" : "info"}>{a.severity}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No alerts in this domain</p>
          )}
          <Link href="/alerts" className="inline-flex items-center gap-1 mt-3 text-blue-400 hover:text-blue-300 font-medium text-sm">
            View Alerts <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>
      <Card>
        <h3 className="font-semibold text-white mb-4">Action Items for {domainName}</h3>
        {data.domainInsights.length > 0 ? (
          <div className="space-y-3">
            {data.domainInsights.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <DomainBadge domain={a.domain} />
                  <span className="text-sm font-medium text-slate-200 truncate">{a.title}</span>
                  {a.type && <Badge variant="default">{a.type}</Badge>}
                </div>
                <Badge variant={a.priority === "High" ? "high" : a.priority === "Medium" ? "medium" : "low"}>{a.priority}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No insights in this domain</p>
        )}
        <Link href="/insights" className="inline-flex items-center gap-1 mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm">
          View all insights <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    </DashboardLayout>
  );
}
