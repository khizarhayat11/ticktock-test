export type TimesheetStatus = "completed" | "incomplete" | "missing";

// Wire format (e.g. from JSON/mock/API)
export type TimesheetJson = {
  id: string;
  week: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
};

export type TimesheetsJson = TimesheetJson[];

// In-app format (parsed/normalized)
export type Timesheet = {
  id: string;
  week: number;
  startDate: Date;
  endDate: Date;
  status: TimesheetStatus;
};

export type TimesheetTask = {
  id: string;
  name: string;
  project: string;
  workType: string;
  hours: number;
};

export type TimesheetTaskDraft = Pick<
  TimesheetTask,
  "name" | "project" | "workType" | "hours"
>;

export type TimesheetTasksByDay = Record<string, TimesheetTask[]>;

export type TimesheetDay = {
  key: string;
  date: Date;
  label: string;
};

export type TimesheetsFiltersState = {
  status: TimesheetStatus | "all";
  month: string | "all";
};
