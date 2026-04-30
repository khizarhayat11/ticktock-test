"use client";

import { MoreHorizontal } from "lucide-react";
import type { TimesheetTask } from "@/types/timesheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Props = {
  task: TimesheetTask;
  onEdit: () => void;
  onDelete: () => void;
};

export function TimesheetTaskRow({ task, onEdit, onDelete }: Props) {
  const hoursLabel = `${Number.isFinite(task.hours) ? task.hours : 0} hrs`;

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border bg-background px-3 py-3")}>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{task.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-link/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-link">
            {task.project}
          </span>
          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
            {task.workType}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{hoursLabel}</span>
      </div>

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
          <DropdownMenuItem onSelect={onEdit} className="cursor-pointer">Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onDelete}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
}
