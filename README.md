# AI Knowledge Compass

End-to-End Interactive Prototype for paper presentation, hackathon, and live demo.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Flow

1. **Landing** (`/`) → Enter Knowledge Compass
2. **Login** (`/login`) → Select role: CEO, Manager, or Employee
3. **Dashboard** (`/dashboard`) → Role-based dashboards
4. **Upload** (`/upload`) → Add mock data (PDF name, email subject, spreadsheet text)
5. **Insights** (`/insights`) → Role-specific insights from mock intelligence
6. **Alerts** (`/alerts`) → Severity-tagged alerts with acknowledge
7. **Knowledge Graph** (`/knowledge-graph`) → Visual graph with click interactions
8. **Learning** (`/learning`) → Role-based onboarding content

## Mock Intelligence Logic

- **High priority**: text contains "delay", "risk", "approval"
- **Finance + High** → visible to CEO and Manager
- **Task update** → visible to Employee

Data is stored in `data/mockData.json`.
