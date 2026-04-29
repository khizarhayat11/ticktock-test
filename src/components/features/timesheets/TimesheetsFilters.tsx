"use client";

import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

import type { TimesheetsFiltersState, TimesheetStatus } from "@/types/timesheet";
import { STATUS_LABEL, monthLabel } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TimesheetsFilters({
  months,
  value,
  onChange,
}: {
  months: string[];
  value: TimesheetsFiltersState;
  onChange: (next: TimesheetsFiltersState) => void;
}) {
  const statusLabel = value.status === "all" ? "Status" : STATUS_LABEL[value.status];
  const monthText = value.month === "all" ? "Date Range" : monthLabel(value.month);

  const setStatus = useCallback(
    (status: TimesheetStatus | "all") => onChange({ ...value, status }),
    [onChange, value]
  );

  const setMonth = useCallback(
    (month: string | "all") => onChange({ ...value, month }),
    [onChange, value]
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-between sm:w-auto"
          >
            <span className="truncate">{monthText}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => setMonth("all")}>All</DropdownMenuItem>
          {months.length > 0 && <DropdownMenuSeparator />}
          {months.map((key) => (
            <DropdownMenuItem key={key} onSelect={() => setMonth(key)}>
              {monthLabel(key)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-between sm:w-auto"
          >
            <span className="truncate">{statusLabel}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => setStatus("all")}>All</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setStatus("completed")}>Completed</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("incomplete")}>Incomplete</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("missing")}>Missing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
}
