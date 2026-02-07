// ============================================================
// Predefined Seed Data for 6 Domains
// ============================================================

import type { IngestedDocument, MockDataStore } from "@/types";
import { processDocuments } from "./mockIntelligenceEngine";

const now = new Date().toISOString();

const SEED_DOCUMENTS: IngestedDocument[] = [
  // ---------- FINANCE (3+ docs, 2+ insights, 1+ alert) ----------
  {
    id: "doc-fin-1",
    source: "pdf",
    name: "Q4 Budget Report",
    content: "Budget variance analysis shows delay in approval for capital expenditure. Finance team flagged risk of overspend in Operations. Pending approval from CFO.",
    department: "Finance",
    domain: "Finance",
    uploadedAt: now,
  },
  {
    id: "doc-fin-2",
    source: "email",
    name: "Revenue Risk Alert",
    content: "Critical revenue risk identified in Asia-Pacific region. Approval needed for contingency budget. Delay in closing Q3 accounts.",
    department: "Finance",
    domain: "Finance",
    uploadedAt: now,
  },
  {
    id: "doc-fin-3",
    source: "spreadsheet",
    name: "Cash Flow Forecast",
    content: "Updated cash flow projections. Task update: payment terms renegotiation with vendors. No immediate risk.",
    department: "Finance",
    domain: "Finance",
    uploadedAt: now,
  },
  // ---------- OPERATIONS (3+ docs) ----------
  {
    id: "doc-ops-1",
    source: "pdf",
    name: "Process Delay Report",
    content: "Significant process delay in fulfillment center B. Vendor dependency on Logistics Corp causing bottlenecks. Risk of SLA breach.",
    department: "Operations",
    domain: "Operations",
    uploadedAt: now,
  },
  {
    id: "doc-ops-2",
    source: "email",
    name: "Delivery Risk Notice",
    content: "Delivery risk escalated for Eastern region. Approval required for alternative carrier. Dependency on current vendor at risk.",
    department: "Operations",
    domain: "Operations",
    uploadedAt: now,
  },
  {
    id: "doc-ops-3",
    source: "spreadsheet",
    name: "Inventory Status",
    content: "Task update: Stock levels normalized. Vendor dependencies documented. No critical delay.",
    department: "Operations",
    domain: "Operations",
    uploadedAt: now,
  },
  // ---------- HR (3+ docs) ----------
  {
    id: "doc-hr-1",
    source: "pdf",
    name: "Hiring Status Q4",
    content: "Hiring status update: 12 positions open. Attrition signals in Engineering. Risk of talent gap. Approval needed for retention budget.",
    department: "HR",
    domain: "HR",
    uploadedAt: now,
  },
  {
    id: "doc-hr-2",
    source: "email",
    name: "Policy Update Notice",
    content: "New remote work policy requires approval. Attrition analysis shows delay in exit interviews. Important for compliance.",
    department: "HR",
    domain: "HR",
    uploadedAt: now,
  },
  {
    id: "doc-hr-3",
    source: "spreadsheet",
    name: "Headcount Tracker",
    content: "Task update: Headcount reconciled. Hiring pipeline status updated. No critical attrition risk.",
    department: "HR",
    domain: "HR",
    uploadedAt: now,
  },
  // ---------- SALES (3+ docs) ----------
  {
    id: "doc-sales-1",
    source: "pdf",
    name: "Pipeline Status Report",
    content: "Pipeline status shows target gap of 15%. Deal risks on Enterprise accounts. Approval pending for discount authority.",
    department: "Sales",
    domain: "Sales",
    uploadedAt: now,
  },
  {
    id: "doc-sales-2",
    source: "email",
    name: "Deal Risk Alert",
    content: "High-value deal at risk due to approval delay. Target gap widening. Urgent action required.",
    department: "Sales",
    domain: "Sales",
    uploadedAt: now,
  },
  {
    id: "doc-sales-3",
    source: "spreadsheet",
    name: "Quarterly Targets",
    content: "Task update: Target tracking sheet updated. Pipeline forecast revised. Action items for managers.",
    department: "Sales",
    domain: "Sales",
    uploadedAt: now,
  },
  // ---------- LEGAL (3+ docs) ----------
  {
    id: "doc-legal-1",
    source: "pdf",
    name: "Contract Approval Queue",
    content: "Contract approval backlog. Compliance alert on vendor agreement. Review bottlenecks in Legal. Risk of delay.",
    department: "Legal",
    domain: "Legal",
    uploadedAt: now,
  },
  {
    id: "doc-legal-2",
    source: "email",
    name: "Compliance Alert",
    content: "Compliance alert: GDPR review required. Approval needed from Legal. Critical risk if delayed.",
    department: "Legal",
    domain: "Legal",
    uploadedAt: now,
  },
  {
    id: "doc-legal-3",
    source: "spreadsheet",
    name: "Review Status Tracker",
    content: "Task update: Contract review status. No immediate compliance risk. Dependency on external counsel.",
    department: "Legal",
    domain: "Legal",
    uploadedAt: now,
  },
  // ---------- IT / ENGINEERING (3+ docs) ----------
  {
    id: "doc-it-1",
    source: "pdf",
    name: "Deployment Update",
    content: "Deployment delay on v2.3. Incident report: Minor outage in staging. Security notice: patch required. Approval for maintenance window.",
    department: "IT",
    domain: "IT",
    uploadedAt: now,
  },
  {
    id: "doc-it-2",
    source: "email",
    name: "Incident Report",
    content: "Incident report: API latency spike. Risk of customer impact. Security notice issued. Urgent review.",
    department: "IT",
    domain: "IT",
    uploadedAt: now,
  },
  {
    id: "doc-it-3",
    source: "spreadsheet",
    name: "Sprint Status",
    content: "Task update: Sprint velocity tracking. Deployment schedule updated. No critical incidents.",
    department: "IT",
    domain: "IT",
    uploadedAt: now,
  },
];

export function getSeedData(): MockDataStore {
  const { insights, alerts } = processDocuments(SEED_DOCUMENTS);

  const insightsWithDomain = insights.map((ins) => {
    const doc = SEED_DOCUMENTS.find((d) => d.id === ins.documentId);
    return { ...ins, domain: doc?.domain, isDemoData: true };
  });

  const alertsWithDomain = alerts.map((alert) => {
    const ins = insightsWithDomain.find((i) => i.id === alert.insightId);
    return { ...alert, domain: ins?.domain, isDemoData: true };
  });

  const docsWithDemo = SEED_DOCUMENTS.map((d) => ({ ...d, isDemoData: true }));

  return {
    documents: docsWithDemo,
    insights: insightsWithDomain,
    alerts: alertsWithDomain,
  };
}
