import { EventType, Event } from "./events";

export interface JobPostBody {
  url: string;
  title: string;
  company: string;
  location: string;
  pay_rate?: string;
  requirements: string;
  applied_date: string;
  notes?: string;
}

export type JobUpdateBody = Partial<JobPostBody> & { id: number };

export type Jobject = JobPostBody & {
  id: number;
  created_at: string;
  updated_at: string;
  status: EventType;
};

export type JobWithEvents = Jobject & {
  events: Event[];
};

export enum FieldNames {
  URL = "url",
  REQUIREMENTS = "requirements",
  TITLE = "title",
  COMPANY = "company",
  LOCATION = "location",
  PAY_RATE = "pay_rate",
  NOTES = "notes",
  APPLIED_DATE = "applied_date",
}

export const FieldLabels: Record<FieldNames, string> = {
  [FieldNames.URL]: "job\u00A0post link",
  [FieldNames.REQUIREMENTS]: "requirements",
  [FieldNames.TITLE]: "job title",
  [FieldNames.COMPANY]: "company",
  [FieldNames.LOCATION]: "location",
  [FieldNames.PAY_RATE]: "$$$",
  [FieldNames.NOTES]: "notes",
  [FieldNames.APPLIED_DATE]: "applied date",
};
