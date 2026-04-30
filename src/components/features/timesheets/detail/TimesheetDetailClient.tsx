"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type {
  Timesheet,
  TimesheetDay,
  TimesheetStatus,
  TimesheetTask,
  TimesheetTaskDraft,
  TimesheetTasksByDay,
} from "@/types/timesheet";
import {
  buildTimesheetDays,
  formatDateRange,
  parseTimesheetJson,
  sumTimesheetHours,
} from "@/lib/utils";
import { getTimesheetSourceUrlById } from "@/lib/timesheets-data-source";

import { Button } from "@/components/ui/button";
import { TimesheetDaySection } from "./TimesheetDaySection";
import { TaskEntryDialog } from "./TaskEntryDialog";

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
  taskDayKey,
  count,
}: {
  timesheetId: string;
  taskDayKey: string;
  count: number;
}): TimesheetTask[] {
  return Array.from({ length: count }, (_, index) => ({
    id: makeStableTaskId(timesheetId, taskDayKey, index),
    name: "Homepage Development",
    project: "Project Name",
    workType: "Development",
    hours: 4,
  }));
}

type DialogState =
  | { mode: "add"; dayKey: string }
  | { mode: "edit"; dayKey: string; taskId: string }
  | null;

function buildInitialTasks({
  timesheetId,
  status,
  days,
}: {
  timesheetId: string;
  status: TimesheetStatus;
  days: TimesheetDay[];
}): TimesheetTasksByDay {
  const byDay: TimesheetTasksByDay = {};

  // Deterministic initial data based on the timesheet status.
  for (let i = 0; i < days.length; i += 1) {
    const key = days[i].key;

    if (status === "missing") {
      byDay[key] = [];
      continue;
    }

    if (status === "incomplete") {
      const count = i === 0 || i === 1 ? 2 : i === 2 ? 1 : 0;
      byDay[key] = createTemplateTasks({ timesheetId, taskDayKey: key, count });
      continue;
    }

    // completed
    byDay[key] = createTemplateTasks({ timesheetId, taskDayKey: key, count: 2 });
  }

  return byDay;
}

export function TimesheetDetailClient({ timesheetId }: { timesheetId: string }) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tasksByDay, setTasksByDay] = useState<TimesheetTasksByDay>({});
  const [dialogState, setDialogState] = useState<DialogState>(null);

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
        const days = buildTimesheetDays(found.startDate, found.endDate);

        setTimesheet(found);
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

  const days: TimesheetDay[] = timesheet
    ? buildTimesheetDays(timesheet.startDate, timesheet.endDate)
    : [];
  const loggedHours = sumTimesheetHours(tasksByDay);
  const targetHours = days.length * 8;
  const percent =
    targetHours <= 0
      ? 0
      : Math.max(0, Math.min(100, Math.round((loggedHours / targetHours) * 100)));
  const progressStatus: TimesheetStatus | null =
    !timesheet
      ? null
      : targetHours <= 0
        ? timesheet.status
        : loggedHours <= 0
          ? "missing"
          : loggedHours >= targetHours
            ? "completed"
            : "incomplete";
  const progressBarClassName =
    progressStatus === "completed"
      ? "bg-status-completed-foreground"
      : progressStatus === "missing"
        ? "bg-status-missing-foreground"
        : "bg-status-incomplete-foreground";
  const dateRangeLabel = timesheet
    ? formatDateRange(timesheet.startDate, timesheet.endDate)
    : "";

  const handleAddTask = (dayKey: string) => {
    setDialogState({ mode: "add", dayKey });
  };

  const handleChangeTask = (dayKey: string, taskId: string, nextTask: TimesheetTask) => {
    setTasksByDay((prev) => {
      const next: TimesheetTasksByDay = { ...prev };
      next[dayKey] = (next[dayKey] ?? []).map((t) => (t.id === taskId ? nextTask : t));
      return next;
    });
  };

  const handleEditTask = (dayKey: string, taskId: string) => {
    setDialogState({ mode: "edit", dayKey, taskId });
  };

  const handleDeleteTask = (dayKey: string, taskId: string) => {
    setTasksByDay((prev) => {
      const next: TimesheetTasksByDay = { ...prev };
      next[dayKey] = (next[dayKey] ?? []).filter((t) => t.id !== taskId);
      return next;
    });
  };

  const selectedTask =
    !dialogState || dialogState.mode !== "edit"
      ? null
      : (tasksByDay[dialogState.dayKey] ?? []).find(
          (task) => task.id === dialogState.taskId,
        ) ?? null;

  const projectOptions = Array.from(
    new Set([
      "Project Name",
      ...Object.values(tasksByDay).flatMap((tasks) => tasks.map((task) => task.project)),
    ]),
  );

  const handleSaveTask = (draft: TimesheetTaskDraft) => {
    if (!dialogState) return;

    const normalizedTask = {
      name: draft.name.trim() || "Untitled task",
      project: draft.project.trim() || "Project Name",
      workType: draft.workType.trim() || "Development",
      hours: Math.max(0, Number.isFinite(draft.hours) ? draft.hours : 0),
    };

    if (dialogState.mode === "add") {
      setTasksByDay((prev) => {
        const next: TimesheetTasksByDay = { ...prev };
        const list = [...(next[dialogState.dayKey] ?? [])];
        list.push({
          id: createClientTaskId(dialogState.dayKey),
          ...normalizedTask,
        });
        next[dialogState.dayKey] = list;
        return next;
      });
      setDialogState(null);
      return;
    }

    if (!selectedTask) return;

    handleChangeTask(dialogState.dayKey, dialogState.taskId, {
      ...selectedTask,
      ...normalizedTask,
    });
    setDialogState(null);
  };

  const dialogKey =
    !dialogState
      ? "task-dialog-closed"
      : dialogState.mode === "add"
        ? `task-dialog-add-${dialogState.dayKey}`
        : `task-dialog-edit-${dialogState.dayKey}-${dialogState.taskId}`;

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
                onEditTask={(taskId) => handleEditTask(day.key, taskId)}
                onDeleteTask={(taskId) => handleDeleteTask(day.key, taskId)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskEntryDialog
        key={dialogKey}
        mode={dialogState?.mode ?? "add"}
        open={dialogState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState(null);
          }
        }}
        onSave={handleSaveTask}
        initialTask={selectedTask}
        projectOptions={projectOptions}
      />
    </div>
  );
}
