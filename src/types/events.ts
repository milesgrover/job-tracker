export enum EventType {
  Applied = "applied",
  Recruiter_contact = "recruiter_contact",
  Interview_scheduled = "interview_scheduled",
  Interviewed = "interviewed",
  Offer = "offer",
  Awaiting_response = "awaiting_response",
  Followed_up = "followed_up",
  Rejected = "rejected",
  Other = "other",
}

export interface EventBody {
  id?: number;
  job_id: number;
  event_date: string;
  event_type: EventType;
  details?: string;
}

export type Event = EventBody & {
  id: number;
  updatedAt: string;
  createdAt: string;
};

export const enum EventParamNames {
  EVENT_TYPE = "event_type",
  EVENT_DATE = "event_date",
  DETAILS = "details",
}
