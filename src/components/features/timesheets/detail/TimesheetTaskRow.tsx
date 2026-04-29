"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import type { TimesheetTask } from "@/types/timesheet-detail";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Props = {
  task: TimesheetTask;
  onChange: (next: TimesheetTask) => void;
  onDelete: () => void;
};

export function TimesheetTaskRow({ task, onChange, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TimesheetTask>(task);

  const hoursLabel = useMemo(() => {
    const value = Number.isFinite(task.hours) ? task.hours : 0;
    return `${value} hrs`;
  }, [task.hours]);

  const startEdit = () => {
    setDraft(task);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(task);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const normalizedHours = Number.isFinite(draft.hours) ? draft.hours : 0;
    onChange({
      ...draft,
      name: draft.name.trim() || "Untitled task",
      project: draft.project.trim() || "Project",
      hours: Math.max(0, normalizedHours),
    });
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background px-3 py-2",
        isEditing && "bg-muted/20",
      )}
    >
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Task name"
              aria-label="Task name"
            />
            <Input
              value={draft.project}
              onChange={(e) =>
                setDraft((d) => ({ ...d, project: e.target.value }))
              }
              placeholder="Project"
              aria-label="Project"
            />
            <Input
              type="number"
              min={0}
              step={0.25}
              value={String(draft.hours)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, hours: Number(e.target.value) }))
              }
              placeholder="Hours"
              aria-label="Hours"
            />
          </div>
        ) : (
          <div className="truncate text-sm font-medium">{task.name}</div>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{hoursLabel}</span>
          <span className="rounded-md bg-link/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-link">
            {task.project}
          </span>
        </div>
      )}

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={saveEdit}>
            Save
          </Button>
        </div>
      ) : (
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Task actions"
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={startEdit}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      )}
    </div>
  );
}
