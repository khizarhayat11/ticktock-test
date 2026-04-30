export type TimesheetTask = {
  id: string;
  name: string;
  project: string;
  workType: string;
  hours: number;
};
export type TimesheetDay = {
  key: string;
  date: Date;
  label: string;
};
