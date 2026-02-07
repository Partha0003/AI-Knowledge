// ============================================================
// Mock AI Intelligence Engine
// Rule-based relevance logic - NO real ML
// ============================================================

import type {
  IngestedDocument,
  ProcessedInsight,
  Alert,
  Role,
  AlertSeverity,
} from "@/types";

const HIGH_PRIORITY_KEYWORDS = ["delay", "risk", "approval", "pending approval", "compliance", "incident", "critical"];
const EMPLOYEE_KEYWORDS = ["task update"];
const CEO_DOMAINS = ["Finance", "Legal"];

function extractPriority(text: string): "High" | "Medium" | "Low" {
  const lower = text.toLowerCase();
  const hasHighPriority = HIGH_PRIORITY_KEYWORDS.some((kw) =>
    lower.includes(kw.toLowerCase())
  );
  if (hasHighPriority) return "High";
  if (lower.includes("urgent") || lower.includes("important")) return "Medium";
  return "Low";
}

function getRelevanceRoles(
  document: IngestedDocument,
  priority: string
): Role[] {
  const lower = document.content.toLowerCase();
  const department = document.department ?? "";
  const domain = document.domain ?? department;

  // Finance or Legal + High Priority → CEO and Manager
  if (CEO_DOMAINS.some((d) => domain.toLowerCase().includes(d.toLowerCase())) && priority === "High") {
    return ["CEO", "Manager"];
  }

  // Task update / execution → Employee (and often Manager)
  if (EMPLOYEE_KEYWORDS.some((kw) => lower.includes(kw))) {
    return lower.includes("manager") || lower.includes("action") ? ["Manager", "Employee"] : ["Employee"];
  }

  // Default role mapping by priority
  if (priority === "High") return ["CEO", "Manager"];
  if (priority === "Medium") return ["Manager", "Employee"];
  return ["Employee"];
}

function determineInsightType(
  content: string,
  relevanceRoles: Role[]
): "strategic" | "action" | "task" | "update" {
  const lower = content.toLowerCase();
  if (relevanceRoles.includes("CEO")) return "strategic";
  if (relevanceRoles.includes("Manager")) {
    if (lower.includes("approval") || lower.includes("dependency"))
      return "action";
  }
  if (lower.includes("task")) return "task";
  return "update";
}

function shouldCreateAlert(priority: string, content: string): boolean {
  if (priority !== "High") return false;
  const lower = content.toLowerCase();
  return (
    lower.includes("risk") ||
    lower.includes("delay") ||
    lower.includes("approval") ||
    lower.includes("compliance") ||
    lower.includes("incident")
  );
}

function getAlertSeverity(content: string): AlertSeverity {
  const lower = content.toLowerCase();
  if (lower.includes("risk") && lower.includes("delay")) return "High";
  if (lower.includes("risk") || lower.includes("approval")) return "High";
  if (lower.includes("delay")) return "Medium";
  return "Info";
}

export function processDocument(document: IngestedDocument): {
  insight: ProcessedInsight;
  alert?: Alert;
} {
  const priority = extractPriority(document.content);
  const relevanceRoles = getRelevanceRoles(document, priority);
  const type = determineInsightType(document.content, relevanceRoles);

  const insight: ProcessedInsight = {
    domain: document.domain,
    id: `insight-${document.id}-${Date.now()}`,
    documentId: document.id,
    priority,
    relevanceRoles,
    title: document.name,
    summary: document.content.slice(0, 150) + (document.content.length > 150 ? "..." : ""),
    type,
  };

  const createAlert = shouldCreateAlert(priority, document.content);
  if (createAlert) {
    insight.alertFlag = true;
    insight.alertSeverity = getAlertSeverity(document.content);
    const alert: Alert = {
      domain: document.domain,
      id: `alert-${document.id}-${Date.now()}`,
      insightId: insight.id,
      title: `Alert: ${document.name}`,
      message: document.content.slice(0, 200),
      severity: insight.alertSeverity ?? "Info",
      acknowledged: false,
      createdAt: new Date().toISOString(),
      relevantRoles: relevanceRoles,
    };
    return { insight, alert };
  }

  return { insight };
}

export function processDocuments(
  documents: IngestedDocument[]
): { insights: ProcessedInsight[]; alerts: Alert[] } {
  const insights: ProcessedInsight[] = [];
  const alerts: Alert[] = [];

  for (const doc of documents) {
    try {
      const result = processDocument(doc);
      insights.push(result.insight);
      if (result.alert) {
        alerts.push(result.alert);
      }
    } catch {
      // Skip failed documents - ensure no crashes
    }
  }

  return { insights, alerts };
}
