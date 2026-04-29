export function getTimesheetsSourceUrl() {
  // Central place to swap between mock and real endpoints.
  return "/api/timesheets";
}

export function getTimesheetSourceUrlById(id: string) {
  return `/api/timesheets/${encodeURIComponent(id)}`;
}
