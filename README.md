# AI Knowledge Compass

**Interactive prototype for paper presentation, hackathon, and live demo**

---

## Overview

### What Problem It Solves

Organizations today have knowledge scattered across emails, PDFs, spreadsheets, and chat. This leads to:

- Time wasted searching for information
- Delayed decisions
- No clear, role-based view of what matters
- Duplication and inconsistent understanding

### Why It Matters

Leaders need visibility across domains. Teams need only the insights relevant to them. Alerts need to surface risks and approvals early. AI Knowledge Compass aims to turn scattered data into structured, role-based intelligence.

### What Makes This Different

Unlike generic search or dashboards, this system:

- Delivers insights **by domain** (Finance, Operations, HR, etc.)
- Uses a central **Knowledge Core** to connect and prioritize information
- Supports **real-time alerts** and acknowledgment workflows
- Provides a **visual Knowledge Graph** to show cross-domain relationships

---

## Core Concept

### Knowledge Core

The Knowledge Core is the central layer that:

- Stores ingested documents
- Applies rule-based intelligence
- Generates insights and alerts
- Routes content to the right domains

### Domain-Based Insight Delivery

Instead of one-size-fits-all, insights are filtered and shown by domain. Finance sees finance-related insights; Operations sees operations-related ones.

### Cross-Domain Intelligence

The system models connections between domains: risks, approval flows, and dependencies. This supports leadership visibility and cross-team coordination.

---

## Supported Domains

| Domain      | Focus Areas                                   |
|------------|-----------------------------------------------|
| **Finance**| Budget reports, approval delays, revenue risks |
| **Operations** | Process delays, vendor dependencies, delivery risks |
| **HR**     | Hiring status, attrition signals, policy updates |
| **Sales**  | Pipeline status, target gaps, deal risks      |
| **Legal**  | Contract approvals, compliance alerts, review bottlenecks |
| **IT**     | Deployment updates, incident reports, security notices |

---

## Application Flow

1. **Data ingestion** — Documents, emails, and spreadsheets are uploaded.
2. **Knowledge storage** — Content is stored in the Knowledge Core.
3. **Insight generation** — Rule-based logic produces insights with domain, priority, and type.
4. **Alert creation** — High-priority or risk-related items trigger alerts.
5. **Role-based delivery** — Insights and alerts are shown to the relevant domains.

---

## Dashboard Structure

### Global Dashboard (Organization Overview)

- Total documents, insights, and alerts
- Cross-domain bar chart (Finance → IT)
- Daily AI Digest (top critical insights)
- Leadership-level visibility

### Domain Dashboards

- Domain-specific metrics
- Domain alerts
- Domain action items
- Cross-domain dependency indicators (read-only)

Each domain dashboard is tailored so users see only what matters to their role.

---

## Knowledge Graph

### Purpose

The Knowledge Graph visualizes how domains connect through risks, dependencies, and approval flows.

### How to Interpret It

- **Center node:** Knowledge Core (AI intelligence layer)
- **Surrounding nodes:** Finance, Operations, HR, Sales, Legal, IT
- **Connections:** Risk dependency, approval flow, cross-domain influence

### Why It Helps Decision-Makers

Leaders can quickly see:

- Which domains depend on each other
- Where bottlenecks or risks may appear
- How changes in one domain affect others

---

## Learning & Onboarding

### Role-Based Guidance

Each domain has tailored guidance on:

- What to review daily
- How to act on insights and alerts
- Best practices for that domain

### Continuous Learning Support

Helps new hires onboard and supports cross-team understanding so everyone uses the system effectively.

---

## Prototype Scope

- **High-fidelity UI prototype** — Fully interactive, suitable for live demo.
- **Simulated intelligence** — Rule-based logic, no real ML models.
- **Concept demonstration** — Shows flow, value, and UX; not production-ready.
- **Preloaded demo data** — Dashboards and pages are populated from seed data.

---

## How to Present This Project

### Suggested Demo Flow

1. **Opening** — Problem + solution (30–40 seconds).
2. **Landing** — One-sentence value proposition.
3. **Role selection** — Explain 6 domains and the ability to switch.
4. **Organization Overview** — Leadership view and KPIs.
5. **Domain dashboard** — Domain-specific view.
6. **Insights** — Tagging and readability.
7. **Alerts** — Severity and acknowledgment.
8. **Knowledge Graph** — Visual explanation of connections.
9. **Upload** — Ingestion and simulated detection.
10. **Knowledge Campus** — Learning and onboarding.
11. **Closing** — Summarize value and end with the “compass” message.

### Common Judge Questions

| Question | Suggested Answer |
|----------|------------------|
| "Is this real ML?" | "No. This is a prototype using rule-based logic to simulate intelligence. Real ML would be a next step." |
| "How does it know what’s relevant?" | "We use deterministic rules—for example, keywords like 'risk' or 'approval' set priority and domain visibility." |
| "Can it scale?" | "This demo uses local JSON. Production would use a real database and APIs." |
| "Who sees what?" | "Each domain sees only its own insights and alerts. Leaders see the Organization Overview." |

### Presenting Confidently

- Focus on the **flow** and **value**, not implementation details.
- Emphasize **role-based delivery** and **cross-domain visibility**.
- Use the script to stay on track; adapt if judges ask follow-ups.

---

## Future Scope

- **Real ML integration** — Replace rule-based logic with trained models.
- **Real-time data pipelines** — Connect to live email, document, and collaboration systems.
- **Enterprise deployment** — SSO, audit logs, and compliance controls.
- **More domains and custom roles** — Extend beyond the six domains.
- **API and integrations** — Connect to CRMs, ERPs, and other tools.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the role selector to explore.

---

*AI Knowledge Compass — Navigating organizational knowledge intelligently.*
