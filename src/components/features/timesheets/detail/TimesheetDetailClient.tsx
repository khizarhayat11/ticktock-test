"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { Timesheet, TimesheetStatus } from "@/types/timesheet";
import type { TimesheetTask, TimesheetDay } from "@/types/timesheet-detail";
import {
  dayKey,
  eachDayInclusive,
  formatDateRange,
  formatDayLabel,
  parseTimesheetJson,
} from "@/lib/utils";
import { getTimesheetSourceUrlById } from "@/lib/timesheets-data-source";

import { Button } from "@/components/ui/button";
import { TimesheetDaySection } from "./TimesheetDaySection";

import { TimesheetStatusPill } from "../TimesheetStatusPill";
import { TimesheetDetailSkeleton } from "../../../skeleton/TimesheetDetailSkeleton";

function makeStableTaskId(timesheetId: string, dayKey: string, index: number) {
  return `${timesheetId}-${dayKey}-${index}`;
}

function createClientTaskId(prefix: string) {
  // Used for user-created tasks only. Initial data is deterministic.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}`;
}

function createTemplateTasks({
  timesheetId,
  dayKey,
  count,
}: {
  timesheetId: string;
  dayKey: string;
  count: number;
}): TimesheetTask[] {
  return Array.from({ length: count }, (_, index) => ({
    id: makeStableTaskId(timesheetId, dayKey, index),
    name: "Homepage Development",
    project: "Project Name",
    hours: 4,
  }));
}

function buildInitialTasks({
  timesheetId,
  status,
  days,
}: {
  timesheetId: string;
  status: TimesheetStatus;
  days: TimesheetDay[];
}): Record<string, TimesheetTask[]> {
  const byDay: Record<string, TimesheetTask[]> = {};

  // Deterministic initial data based on the timesheet status.
  for (let i = 0; i < days.length; i += 1) {
    const key = days[i].key;

    if (status === "missing") {
      byDay[key] = [];
      continue;
    }

    if (status === "incomplete") {
      const count = i === 0 || i === 1 ? 2 : i === 2 ? 1 : 0;
      byDay[key] = createTemplateTasks({ timesheetId, dayKey: key, count });
      continue;
    }

    // completed
    byDay[key] = createTemplateTasks({ timesheetId, dayKey: key, count: 2 });
  }

  return byDay;
}

export function TimesheetDetailClient({ timesheetId }: { timesheetId: string }) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tasksByDay, setTasksByDay] = useState<Record<string, TimesheetTask[]>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(getTimesheetSourceUrlById(timesheetId), {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to load timesheet (${res.status})`);
        }

        const json: unknown = await res.json();
        const found = parseTimesheetJson(json);
        setTimesheet(found);

        const days = eachDayInclusive(found.startDate, found.endDate).map((date) => ({
          key: dayKey(date),
          date,
          label: formatDayLabel(date),
        }));

        setTasksByDay(buildInitialTasks({ timesheetId: found.id, status: found.status, days }));
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Failed to load timesheet";
        setError(message);
        setTimesheet(null);
        setTasksByDay({});
      } finally {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      }
    }

    void load();

    return () => controller.abort();
  }, [timesheetId]);

  const days: TimesheetDay[] = useMemo(() => {
    if (!timesheet) return [];
    return eachDayInclusive(timesheet.startDate, timesheet.endDate).map((date) => ({
      key: dayKey(date),
      date,
      label: formatDayLabel(date),
    }));
  }, [timesheet]);

  const loggedHours = useMemo(() => {
    let total = 0;
    for (const key of Object.keys(tasksByDay)) {
      for (const t of tasksByDay[key] ?? []) {
        total += Number.isFinite(t.hours) ? t.hours : 0;
      }
    }
    return total;
  }, [tasksByDay]);

  const targetHours = useMemo(() => {
    // Reasonable default: 8hrs per day in the date range.
    return days.length * 8;
  }, [days.length]);

  const percent = useMemo(() => {
    if (targetHours <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((loggedHours / targetHours) * 100)));
  }, [loggedHours, targetHours]);

  const progressStatus: TimesheetStatus | null = useMemo(() => {
    if (!timesheet) return null;
    if (targetHours <= 0) return timesheet.status;

    if (loggedHours <= 0) return "missing";
    if (loggedHours >= targetHours) return "completed";
    return "incomplete";
  }, [loggedHours, targetHours, timesheet]);

  const progressBarClassName = useMemo(() => {
    const status = progressStatus ?? "incomplete";
    return status === "completed"
      ? "bg-status-completed-foreground"
      : status === "missing"
        ? "bg-status-missing-foreground"
        : "bg-status-incomplete-foreground";
  }, [progressStatus]);

  const dateRangeLabel = useMemo(() => {
    if (!timesheet) return "";
    return formatDateRange(timesheet.startDate, timesheet.endDate);
  }, [timesheet]);

  const handleAddTask = (dayKey: string) => {
    setTasksByDay((prev) => {
      const next: Record<string, TimesheetTask[]> = { ...prev };
      const list = [...(next[dayKey] ?? [])];
      list.push({
        id: createClientTaskId(dayKey),
        name: "New task",
        project: "Project",
        hours: 0,
      });
      next[dayKey] = list;
      return next;
    });
  };

  const handleChangeTask = (dayKey: string, taskId: string, nextTask: TimesheetTask) => {
    setTasksByDay((prev) => {
      const next: Record<string, TimesheetTask[]> = { ...prev };
      next[dayKey] = (next[dayKey] ?? []).map((t) => (t.id === taskId ? nextTask : t));
      return next;
    });
  };

  const handleDeleteTask = (dayKey: string, taskId: string) => {
    setTasksByDay((prev) => {
      const next: Record<string, TimesheetTask[]> = { ...prev };
      next[dayKey] = (next[dayKey] ?? []).filter((t) => t.id !== taskId);
      return next;
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border bg-background">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">This week&apos;s timesheet</h1>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground">{dateRangeLabel}</p>
              {timesheet && (
                <TimesheetStatusPill status={progressStatus ?? timesheet.status} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 sm:w-70">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {loggedHours}/{targetHours} hrs
              </span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className={`h-1.5 rounded-full ${progressBarClassName}`}
                style={{ width: `${percent}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard" prefetch={false}>
              Back
            </Link>
          </Button>
        </div>

        {error && (
          <div className="px-4 pb-4 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <TimesheetDetailSkeleton />
        ) : !timesheet ? (
          <div className="px-4 pb-6 text-sm text-muted-foreground">
            Timesheet not found.
          </div>
        ) : (
          <div className="divide-y">
            {days.map((day) => (
              <TimesheetDaySection
                key={day.key}
                day={day}
                tasks={tasksByDay[day.key] ?? []}
                onAddTask={() => handleAddTask(day.key)}
                onChangeTask={(taskId, next) => handleChangeTask(day.key, taskId, next)}
                onDeleteTask={(taskId) => handleDeleteTask(day.key, taskId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
