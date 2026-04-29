import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { TimesheetJson } from "@/types/timesheet";

export const runtime = "nodejs";

async function loadMockTimesheets(): Promise<TimesheetJson[]> {
  const filePath = path.join(process.cwd(), "public", "mock", "timesheets.json");
  const raw = await readFile(filePath, "utf8");
  const json: unknown = JSON.parse(raw);

  if (!Array.isArray(json)) return [];
  return json as TimesheetJson[];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const timesheets = await loadMockTimesheets();
    const found = timesheets.find((t) => t.id === id);

    if (!found) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(found);
  } catch {
    return NextResponse.json({ error: "Failed to load timesheet" }, { status: 500 });
  }
}
