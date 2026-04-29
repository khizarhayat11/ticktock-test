import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Timesheet, TimesheetJson, TimesheetStatus } from "@/types/timesheet";

const STATUS_LABEL: Record<TimesheetStatus, string> = {
  completed: "Completed",
  incomplete: "Incomplete",
  missing: "Missing",
};

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function monthLabel(key: string) {
  const [yearStr, monthStr] = key.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const date = new Date(year, monthIndex, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateRange(start: Date, end: Date) {
  const startDay = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(start);
  const endDay = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(end);
  const startMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(start);
  const endMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(end);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}, ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
  }

  return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
}

function parseDateOnly(value: unknown, fieldName: string): Date {
  if (typeof value !== "string") {
    throw new Error(`Invalid timesheet: ${fieldName} must be a string`)
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (match) {
    const year = Number(match[1])
    const monthIndex = Number(match[2]) - 1
    const day = Number(match[3])

    const date = new Date(year, monthIndex, day)
    if (
      Number.isNaN(date.valueOf()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== monthIndex ||
      date.getDate() !== day
    ) {
      throw new Error(`Invalid timesheet: ${fieldName} has an invalid date`)
    }
    return date
  }

  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Invalid timesheet: ${fieldName} must be a valid date string`)
  }
  return date
}

function parseTimesheetsJson(value: unknown): Timesheet[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid timesheets JSON: expected an array")
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid timesheets JSON: item at index ${index} is not an object`)
    }

    const record = item as Partial<TimesheetJson> & Record<string, unknown>
    const id = record.id
    const week = record.week
    const status = record.status

    if (typeof id !== "string") {
      throw new Error(`Invalid timesheets JSON: id at index ${index} must be a string`)
    }
    if (typeof week !== "number" || !Number.isFinite(week)) {
      throw new Error(`Invalid timesheets JSON: week at index ${index} must be a number`)
    }
    if (status !== "completed" && status !== "incomplete" && status !== "missing") {
      throw new Error(`Invalid timesheets JSON: status at index ${index} is invalid`)
    }

    const startDate = parseDateOnly(record.startDate, "startDate")
    const endDate = parseDateOnly(record.endDate, "endDate")

    return {
      id,
      week,
      startDate,
      endDate,
      status,
    }
  })
}

export { STATUS_LABEL, formatDateRange, monthKey, monthLabel, parseDateOnly, parseTimesheetsJson };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
