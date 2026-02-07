// ============================================================
// AI Knowledge Compass - Shared Types
// ============================================================

export type Role = "CEO" | "Manager" | "Employee";
export type DomainRole = "Finance" | "Operations" | "HR" | "Sales" | "Legal" | "IT";

export type AlertSeverity = "High" | "Medium" | "Info";

export type DocumentSource =
  | "pdf"
  | "email"
  | "spreadsheet"
  | "other";

export type Domain =
  | "Finance"
  | "Operations"
  | "HR"
  | "Sales"
  | "Legal"
  | "IT";

export interface IngestedDocument {
  id: string;
  source: DocumentSource;
  name: string;
  content: string;
  department?: string;
  domain?: Domain;
  uploadedAt: string;
  isDemoData?: boolean;
}

export interface ProcessedInsight {
  id: string;
  documentId: string;
  priority: "High" | "Medium" | "Low";
  relevanceRoles: Role[];
  title: string;
  summary: string;
  alertFlag?: boolean;
  alertSeverity?: AlertSeverity;
  type: "strategic" | "action" | "task" | "update" | "risk" | "approval" | "dependency";
  domain?: Domain;
}

export interface Alert {
  id: string;
  insightId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  acknowledged: boolean;
  createdAt: string;
  relevantRoles: Role[];
  domain?: Domain;
  isDemoData?: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "document" | "project" | "role" | "domain";
  domain?: Domain;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: "related_to" | "owned_by";
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface MockDataStore {
  documents: IngestedDocument[];
  insights: ProcessedInsight[];
  alerts: Alert[];
}
