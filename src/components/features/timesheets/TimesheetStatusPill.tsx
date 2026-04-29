"use client";

import type { TimesheetStatus } from "@/types/timesheet";
import { cn, STATUS_LABEL } from "@/lib/utils";

export function TimesheetStatusPill({ status }: { status: TimesheetStatus }) {
  const label = STATUS_LABEL[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide",
        status === "completed" &&
          "bg-status-completed text-status-completed-foreground",
        status === "incomplete" &&
          "bg-status-incomplete text-status-incomplete-foreground",
        status === "missing" && "bg-status-missing text-status-missing-foreground",
      )}
    >
      {label.toUpperCase()}
    </span>
  );
}
