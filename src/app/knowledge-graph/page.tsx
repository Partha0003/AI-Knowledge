"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Network } from "lucide-react";

const DOMAINS = ["Finance", "Operations", "HR", "Sales", "Legal", "IT"];
const DOMAIN_COLORS: Record<string, string> = {
  Finance: "#0ea5e9",
  Operations: "#22c55e",
  HR: "#a855f7",
  Sales: "#f59e0b",
  Legal: "#ef4444",
  IT: "#6366f1",
};

const TOOLTIPS: Record<string, string> = {
  core: "AI Knowledge Core: Central intelligence layer that processes, prioritizes, and routes insights across all organizational domains.",
  Finance: "Finance: Budget reports, approval delays, revenue risks. Connects to Operations (risk dependency) and Legal (approval flow).",
  Operations: "Operations: Process delays, vendor dependencies, delivery risks. Receives influence from Finance, Sales, IT.",
  HR: "HR: Hiring status, attrition signals, policy updates. Connects to Legal for approval flow.",
  Sales: "Sales: Pipeline status, target gaps, deal risks. Cross-domain influence on Operations.",
  Legal: "Legal: Contract approvals, compliance alerts, review bottlenecks. Approval flow to Finance and HR.",
  IT: "IT: Deployment updates, incident reports, security notices. Risk dependency with Operations.",
};

const CENTER = { x: 400, y: 220 };
const RADIUS = 160;

export default function KnowledgeGraphPage() {
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (!role) router.replace("/login");
  }, [role, router]);

  const handleSelect = (id: string) => {
    const next = selected === id ? null : id;
    setSelected(next);
    setTooltip(next ? TOOLTIPS[id] ?? null : null);
  };

  if (!role) return null;

  const domainPositions = DOMAINS.map((d, i) => {
    const angle = (i / DOMAINS.length) * 2 * Math.PI - Math.PI / 2;
    return {
      id: d,
      x: CENTER.x + RADIUS * Math.cos(angle),
      y: CENTER.y + RADIUS * Math.sin(angle),
    };
  });

  const edges = [
    { type: "Risk dependency", from: "Finance", to: "Operations" },
    { type: "Approval flow", from: "Legal", to: "Finance" },
    { type: "Cross-domain", from: "Sales", to: "Operations" },
    { type: "Approval flow", from: "HR", to: "Legal" },
    { type: "Risk dependency", from: "IT", to: "Operations" },
  ];

  const active = selected ? [selected, ...edges.filter((e) => e.from === selected || e.to === selected).flatMap((e) => [e.from, e.to])] : [];

  return (
    <DashboardLayout>
      <SectionHeader
        title="Knowledge Graph"
        subtitle="AI intelligence brain: Click nodes to highlight connections and see explanations"
      />
      <Card>
        <div className="overflow-x-auto rounded-xl bg-slate-900/50 p-6 relative">
          <svg width="800" height="440" viewBox="0 0 800 440" className="mx-auto">
            {domainPositions.map((d) => (
              <line
                key={`center-${d.id}`}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={d.x}
                y2={d.y}
                stroke={active.length === 0 || active.includes(d.id) ? "rgba(59, 130, 246, 0.5)" : "rgba(71, 85, 105, 0.2)"}
                strokeWidth={active.length === 0 || active.includes(d.id) ? 2 : 0.5}
                strokeDasharray="4 4"
              />
            ))}
            {edges.map((e, i) => {
              const from = domainPositions.find((p) => p.id === e.from);
              const to = domainPositions.find((p) => p.id === e.to);
              if (!from || !to) return null;
              const show = active.length === 0 || active.includes(e.from) || active.includes(e.to);
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={show ? "rgba(34, 197, 94, 0.5)" : "rgba(71, 85, 105, 0.15)"}
                  strokeWidth={show ? 2 : 0.5}
                />
              );
            })}
            <g onClick={() => handleSelect("core")} className="cursor-pointer">
              <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={50}
                fill="#3b82f6"
                stroke={selected === "core" ? "#60a5fa" : "transparent"}
                strokeWidth={3}
              />
              <text x={CENTER.x} y={CENTER.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight={600}>
                Knowledge Core
              </text>
            </g>
            {domainPositions.map((d) => {
              const isActive = active.length === 0 || active.includes(d.id);
              return (
                <g key={d.id} onClick={() => handleSelect(d.id)} className="cursor-pointer">
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={36}
                    fill={DOMAIN_COLORS[d.id] ?? "#64748b"}
                    stroke={selected === d.id ? "#f8fafc" : "transparent"}
                    strokeWidth={3}
                    opacity={isActive ? 1 : 0.35}
                  />
                  <text x={d.x} y={d.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight={500}>
                    {d.id}
                  </text>
                </g>
              );
            })}
          </svg>
          {tooltip && (
            <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-600 text-sm text-slate-300">
              {tooltip}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-slate-400">
            <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Knowledge Core</span>
            {DOMAINS.map((d) => (
              <span key={d}><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: DOMAIN_COLORS[d] }} />{d}</span>
            ))}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
