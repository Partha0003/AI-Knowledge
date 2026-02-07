"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { Alert as AlertType, DomainRole } from "@/types";

function filterByDomain(alerts: AlertType[], role: DomainRole): AlertType[] {
  return alerts.filter((a) => a.domain === role);
}

export default function AlertsPage() {
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  useEffect(() => {
    if (!role) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        const all = json.alerts ?? [];
        setAlerts(filterByDomain(all, role));
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [role, router]);

  async function acknowledge(alertId: string) {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", alertId }),
      });
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
    } catch {
      // silent
    }
  }

  if (!role) return null;

  const severityVariant = (s: string) => (s === "High" ? "high" : s === "Medium" ? "medium" : "info");

  return (
    <DashboardLayout>
      <SectionHeader
        title="Alerts"
        subtitle={`${alerts.filter((a) => !a.acknowledged).length} active, ${alerts.filter((a) => a.acknowledged).length} acknowledged`}
      />
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
      ) : alerts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
            <p className="text-slate-400">No alerts in your domain.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} hover className={alert.acknowledged ? "opacity-70" : ""}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {alert.isDemoData && <Badge variant="info">Demo Data</Badge>}
                    <Badge variant={severityVariant(alert.severity)}>{alert.severity}</Badge>
                    <DomainBadge domain={alert.domain} />
                  </div>
                  <h3 className="font-semibold text-white">{alert.title}</h3>
                  <p className="text-slate-400 mt-2 text-sm">{alert.message}</p>
                </div>
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledge(alert.id)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Acknowledge
                  </button>
                ) : (
                  <span className="flex-shrink-0 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Acknowledged
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
