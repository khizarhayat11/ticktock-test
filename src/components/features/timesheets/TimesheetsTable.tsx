"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import type { Timesheet, TimesheetStatus } from "@/types/timesheet";
import { STATUS_LABEL, formatDateRange } from "@/lib/utils";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TimesheetsTable({ items }: { items: Timesheet[] }) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-muted/20">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-40 px-6 py-4 uppercase tracking-wide">
              <HeadWithSort label="Week #" />
            </TableHead>
            <TableHead className="px-6 py-4 uppercase tracking-wide">
              <HeadWithSort label="Date" />
            </TableHead>
            <TableHead className="w-40 px-6 py-4 uppercase tracking-wide">
              <HeadWithSort label="Status" />
            </TableHead>
            <TableHead className="w-30 px-6 py-4 text-right uppercase tracking-wide">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                No timesheets found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((t) => {
              const actionLabel =
                t.status === "completed" ? "View" : t.status === "incomplete" ? "Update" : "Create";

              const href = `/dashboard/timesheets/${t.id}`;

              return (
                <TableRow key={t.id}>
                  <TableCell className="px-6 py-4 font-medium bg-[#f9fafb]">{t.week}</TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground">
                    {formatDateRange(t.startDate, t.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusPill status={t.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button asChild variant="link" size="sm" className="h-auto px-0 text-link">
                      <Link href={href} prefetch={false}>
                        {actionLabel}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function HeadWithSort({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span>{label}</span>
      <ArrowDown className="size-3 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}

function StatusPill({ status }: { status: TimesheetStatus }) {
  const label = STATUS_LABEL[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide",
        status === "completed" && "bg-status-completed text-status-completed-foreground",
        status === "incomplete" && "bg-status-incomplete text-status-incomplete-foreground",
        status === "missing" && "bg-status-missing text-status-missing-foreground"
      )}
    >
      {label.toUpperCase()}
    </span>
  );
}
