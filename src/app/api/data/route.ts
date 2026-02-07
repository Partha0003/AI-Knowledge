import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { processDocuments } from "@/lib/mockIntelligenceEngine";
import { getSeedData } from "@/lib/seedData";
import type { IngestedDocument, MockDataStore } from "@/types";

const DATA_PATH = path.join(process.cwd(), "data", "mockData.json");

function readData(): MockDataStore {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const seed = getSeedData();
      writeData(seed);
      return seed;
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as MockDataStore;
    const docs = data.documents ?? [];
    const insights = data.insights ?? [];
    const alerts = data.alerts ?? [];
    if (docs.length === 0 && insights.length === 0 && alerts.length === 0) {
      const seed = getSeedData();
      writeData(seed);
      return seed;
    }
    return { documents: docs, insights, alerts };
  } catch {
    const seed = getSeedData();
    writeData(seed);
    return seed;
  }
}

function writeData(data: MockDataStore): void {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Write error:", e);
  }
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "add") {
      const documents = (body.documents ?? []) as IngestedDocument[];
      if (documents.length === 0) {
        return NextResponse.json(
          { error: "No documents provided" },
          { status: 400 }
        );
      }

      const data = readData();
      const newDocs = documents.map((d) => ({
        ...d,
        id: d.id ?? `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        uploadedAt: d.uploadedAt ?? new Date().toISOString(),
      }));

      const { insights, alerts } = processDocuments(newDocs);

      data.documents = [...(data.documents ?? []), ...newDocs];
      data.insights = [...(data.insights ?? []), ...insights];
      data.alerts = [...(data.alerts ?? []), ...alerts];

      writeData(data);
      return NextResponse.json({ success: true, count: newDocs.length });
    }

    if (action === "clear") {
      const seed = getSeedData();
      writeData(seed);
      return NextResponse.json({ success: true });
    }

    if (action === "acknowledge") {
      const alertId = body.alertId as string;
      if (!alertId) {
        return NextResponse.json(
          { error: "alertId required" },
          { status: 400 }
        );
      }
      const data = readData();
      const alert = (data.alerts ?? []).find((a) => a.id === alertId);
      if (alert) {
        alert.acknowledged = true;
        writeData(data);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
