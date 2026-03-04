import type { Project } from "@/features/projects/types";

export interface Attendee {
  id: number;
  email: string;
  username: string;
}

export interface GoogleAttendee {
  email: string;
  responseStatus?: string;
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  description: string;
  start: string; // ISO string
  end: string;   // ISO string
  event_type: 'meeting' | 'issues' | 'other';
  google_event_id?: string;
  meet_link?: string;
  attendees?: GoogleAttendee[] | Attendee[];
  source: 'local' | 'google';
  project?: number | Project;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees: number[]; // User IDs
  create_meet: boolean;
  event_type: string;
  project: number;
}

export interface GoogleConnectionStatus {
  connected: boolean;
  connected_at?: string;
}
