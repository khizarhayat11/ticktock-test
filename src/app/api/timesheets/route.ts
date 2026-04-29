import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

async function loadMockTimesheets() {
  const filePath = path.join(process.cwd(), "public", "mock", "timesheets.json");
  const raw = await readFile(filePath, "utf8");
  const json: unknown = JSON.parse(raw);
  return json;
}

export async function GET() {
  try {
    const json = await loadMockTimesheets();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: "Failed to load timesheets" }, { status: 500 });
  }
}
