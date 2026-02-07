"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Upload, Sparkles } from "lucide-react";
import type { Domain } from "@/types";

type Source = "pdf" | "email" | "spreadsheet";

function detectDomain(content: string, department: string): Domain | null {
  const text = (content + " " + department).toLowerCase();
  if (text.includes("finance") || text.includes("budget") || text.includes("revenue")) return "Finance";
  if (text.includes("operations") || text.includes("process") || text.includes("delivery")) return "Operations";
  if (text.includes("hr") || text.includes("hiring") || text.includes("attrition")) return "HR";
  if (text.includes("sales") || text.includes("pipeline") || text.includes("deal")) return "Sales";
  if (text.includes("legal") || text.includes("contract") || text.includes("compliance")) return "Legal";
  if (text.includes("it") || text.includes("deployment") || text.includes("incident")) return "IT";
  return null;
}

function detectPriority(content: string): "High" | "Medium" | "Low" {
  const lower = content.toLowerCase();
  if (lower.includes("risk") || lower.includes("delay") || lower.includes("approval")) return "High";
  if (lower.includes("urgent") || lower.includes("important")) return "Medium";
  return "Low";
}

export default function UploadPage() {
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const [source, setSource] = useState<Source>("pdf");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  if (!role) {
    router.replace("/login");
    return null;
  }

  const detectedDomain = content || department ? detectDomain(content, department) : null;
  const detectedPriority = content ? detectPriority(content) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim() || !content.trim()) {
      setError("Name and content are required.");
      return;
    }

    setLoading(true);
    try {
      const doc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        source,
        name: name.trim(),
        content: content.trim(),
        department: department.trim() || undefined,
        domain: detectedDomain || undefined,
        uploadedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", documents: [doc] }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      setSuccess(true);
      setName("");
      setContent("");
      setDepartment("");
    } catch {
      setError("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    setClearing(true);
    setError("");
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      setSuccess(false);
    } catch {
      setError("Failed to clear data");
    } finally {
      setClearing(false);
    }
  }

  return (
    <DashboardLayout>
      <SectionHeader title="Upload Data" subtitle="Ingest documents to generate insights and alerts" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Data Source</label>
              <div className="flex gap-4">
                {(["pdf", "email", "spreadsheet"] as Source[]).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="radio" name="source" checked={source === s} onChange={() => setSource(s)} className="rounded-full" />
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {source === "pdf" && "PDF Name"}
                {source === "email" && "Email Subject"}
                {source === "spreadsheet" && "Row / Cell Text"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Budget Report.pdf"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Enter content. Include 'risk', 'delay', 'approval' for high priority; mention domain (Finance, Operations, etc.)."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Department (optional)</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Finance, Operations, HR, Sales, Legal, IT"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30">{error}</div>}
            {success && <div className="text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">✓ Data ingested. Insights and alerts generated.</div>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {loading ? "Ingesting..." : "Ingest Data"}
              </button>
              <button type="button" onClick={handleClear} disabled={clearing} className="px-4 py-3 text-slate-400 hover:text-white text-sm rounded-lg transition-colors">
                {clearing ? "Clearing..." : "Reset"}
              </button>
            </div>
          </form>
        </Card>
        <Card>
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Detected Insights (Simulated)
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            AI preview based on your input. Insights are generated after ingestion.
          </p>
          {(content || department) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Domain:</span>
                {detectedDomain ? <DomainBadge domain={detectedDomain} /> : <span className="text-slate-500 text-sm">Not detected</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Priority:</span>
                {detectedPriority && <Badge variant={detectedPriority === "High" ? "high" : detectedPriority === "Medium" ? "medium" : "low"}>{detectedPriority}</Badge>}
              </div>
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-xs text-slate-500 mb-1">Preview</p>
                <p className="text-sm text-slate-300 line-clamp-3">
                  {content.slice(0, 150)}
                  {content.length > 150 ? "..." : ""}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Enter content to see simulated detection.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
