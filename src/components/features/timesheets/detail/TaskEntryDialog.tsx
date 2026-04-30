"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import type { TimesheetTask } from "@/types/timesheet-detail";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TaskDraft = Pick<TimesheetTask, "name" | "project" | "workType" | "hours">;

type Props = {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: TaskDraft) => void;
  initialTask?: TimesheetTask | null;
  projectOptions: string[];
};

const DEFAULT_WORK_TYPES = [
  "Bug fixes",
  "Development",
  "Testing",
  "Documentation",
  "Meeting",
];

const EMPTY_DRAFT: TaskDraft = {
  name: "",
  project: "",
  workType: DEFAULT_WORK_TYPES[0],
  hours: 0,
};

function buildDraft(initialTask: TimesheetTask | null | undefined, projectOptions: string[]) {
  if (initialTask) {
    return {
      name: initialTask.name,
      project: initialTask.project,
      workType: initialTask.workType,
      hours: initialTask.hours,
    };
  }

  return {
    ...EMPTY_DRAFT,
    project: projectOptions[0] ?? "Project Name",
  };
}

export function TaskEntryDialog({
  mode,
  open,
  onOpenChange,
  onSave,
  initialTask,
  projectOptions,
}: Props) {
  const [draft, setDraft] = useState<TaskDraft>(() => buildDraft(initialTask, projectOptions));

  const availableProjects = useMemo(() => {
    const baseOptions = projectOptions.length > 0 ? projectOptions : ["Project Name"];
    return Array.from(new Set(baseOptions));
  }, [projectOptions]);

  const canSubmit =
    draft.project.trim().length > 0 &&
    draft.workType.trim().length > 0 &&
    draft.name.trim().length > 0;

  const submitLabel = mode === "edit" ? "Save changes" : "Add entry";
  const title = mode === "edit" ? "Edit Entry" : "Add New Entry";

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Use this form to {mode === "edit" ? "edit" : "add"} a timesheet entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="entry-project">Select Project *</Label>
            <div className="relative">
              <select
                id="entry-project"
                value={draft.project}
                onChange={(e) =>
                  setDraft((current) => ({ ...current, project: e.target.value }))
                }
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {availableProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-work-type">Type of Work *</Label>
            <div className="relative">
              <select
                id="entry-work-type"
                value={draft.workType}
                onChange={(e) =>
                  setDraft((current) => ({ ...current, workType: e.target.value }))
                }
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {DEFAULT_WORK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-description">Task description *</Label>
            <Textarea
              id="entry-description"
              value={draft.name}
              onChange={(e) =>
                setDraft((current) => ({ ...current, name: e.target.value }))
              }
              placeholder="Write text here ..."
              className="min-h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground">A note for extra info</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-hours">Hours *</Label>
            <div
              className="inline-flex items-center overflow-hidden rounded-lg border border-input bg-background"
              aria-labelledby="entry-hours"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-none border-r"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    hours: Math.max(0, current.hours - 1),
                  }))
                }
                aria-label="Decrease hours"
              >
                <Minus className="size-3.5" />
              </Button>
              <div className="min-w-12 px-3 text-center text-sm font-medium">
                {draft.hours}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-none border-l"
                onClick={() =>
                  setDraft((current) => ({ ...current, hours: current.hours + 1 }))
                }
                aria-label="Increase hours"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="sm:flex-1 cursor-pointer"
            disabled={!canSubmit}
            onClick={() => onSave(draft)}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
