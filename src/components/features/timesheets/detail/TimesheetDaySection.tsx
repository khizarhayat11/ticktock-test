"use client";

import { Plus } from "lucide-react";

import type { TimesheetTask, TimesheetDay } from "@/types/timesheet-detail";

import { Button } from "@/components/ui/button";
import { TimesheetTaskRow } from "./TimesheetTaskRow";


type Props = {
  day: TimesheetDay;
  tasks: TimesheetTask[];
  onAddTask: () => void;
  onChangeTask: (taskId: string, next: TimesheetTask) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TimesheetDaySection({
  day,
  tasks,
  onAddTask,
  onChangeTask,
  onDeleteTask,
}: Props) {
  return (
    <section className="grid gap-3 px-4 py-4 sm:grid-cols-[96px_1fr]">
      <div className="text-sm font-semibold">{day.label}</div>

      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TimesheetTaskRow
              key={task.id}
              task={task}
              onChange={(next) => onChangeTask(task.id, next)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/10 px-3 py-3 text-sm text-muted-foreground">
            No tasks yet.
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center text-muted-foreground"
          onClick={onAddTask}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add new task
        </Button>
      </div>
    </section>
  );
}
