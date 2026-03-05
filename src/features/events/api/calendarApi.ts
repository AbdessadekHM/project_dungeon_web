import apiClient from '@/lib/axios';
import type { 
  CalendarEvent, 
  CreateEventPayload, 
  GoogleConnectionStatus 
} from '../types';

export const calendarApi = {
  // Local/Google Events CRUD
  getEvents: async (projectId: number) => {
    const response = await apiClient.get<CalendarEvent[]>(`/google_calendar/events/`, {
        params: { project: projectId }
    });
    return response.data;
  },

  getGoogleAuthUrl: async () => {
    const response = await apiClient.get<{ authorization_url: string; state: string; code_verifier?: string }>(
      '/google_calendar/auth-url/'
    );
    return response.data;
  },

  exchangeGoogleCode: async (code: string, codeVerifier: string) => {
    const response = await apiClient.post<{ message: string }>(
      '/google_calendar/callback/',
      { code, code_verifier: codeVerifier }
    );
    return response.data;
  },

  getGoogleConnectionStatus: async () => {
    const response = await apiClient.get<GoogleConnectionStatus>(
      '/google_calendar/status/'
    );
    return response.data;
  },

  syncGoogleEvents: async (timeMin?: string, timeMax?: string) => {
    const response = await apiClient.get<CalendarEvent[]>(
      '/google_calendar/sync/',
      { params: { time_min: timeMin, time_max: timeMax } }
    );
    return response.data;
  },

  createGoogleEvent: async (data: CreateEventPayload) => {
    const response = await apiClient.post<CalendarEvent>(
      '/google_calendar/create/',
      data
    );
    return response.data;
  },

  disconnectGoogle: async () => {
    const response = await apiClient.delete('/google_calendar/status/');
    return response.data;
  },

  // Get users for attendees (non-admins)
  getPotentialAttendees: async () => {
    const response = await apiClient.get('/account/users/');
    return response.data;
  },

  // Fetch Public Holidays
  getPublicHolidays: async (year: number) => {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/MA`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch public holidays:', error);
      return [];
    }
  }
};
