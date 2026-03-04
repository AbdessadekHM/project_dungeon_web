import { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { EventCalendar } from '../components/EventCalendar';
import { GoogleCalendarConnect } from '../components/GoogleCalendarConnect';
import { CreateEventDialog } from '../components/CreateEventDialog';
import { calendarApi } from '../api/calendarApi';
import type { CalendarEvent } from '../types';

export function Events() {
  const { user } = useAuthStore();
  const { selectedProject } = useAppStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!selectedProject?.id) return;
    
    setLoading(true);
    try {
      // Fetch local events (from our database) and public holidays concurrently
      const [localEvents, holidaysData] = await Promise.all([
        calendarApi.getEvents(selectedProject.id),
        calendarApi.getPublicHolidays(new Date().getFullYear()) // Pass correct year dynamically
      ]);
      
      let allEvents = [...localEvents];

      // Format holidays to match CalendarEvent
      const mappedHolidays: CalendarEvent[] = holidaysData.map((h: { date: string; name: string; countryCode: string; localName: string }, index: number) => ({
        id: `holiday-${h.date}-${index}`,
        title: h.name,
        description: `Public Holiday: ${h.localName} in ${h.countryCode}`,
        start: new Date(`${h.date}T00:00:00`).toISOString(),
        end: new Date(`${h.date}T23:59:59`).toISOString(),
        event_type: 'holiday',
        source: 'holiday',
        allDay: true
      }));

      // Add holidays to timeline
      allEvents = [...allEvents, ...mappedHolidays];

      // If Google is connected, also fetch from Google Calendar
      if (isGoogleConnected) {
        try {
            const googleEvents = await calendarApi.syncGoogleEvents();
            
            // Deduplicate: filter out google events that already exist locally
            const localGoogleIds = new Set(
              localEvents.map((e: CalendarEvent) => e.google_event_id).filter((id: string | undefined) => id)
            );
            const uniqueGoogleEvents = googleEvents.filter(
              (e: CalendarEvent) => !localGoogleIds.has(e.id as string)
            );
            
            allEvents = [...allEvents, ...uniqueGoogleEvents];
        } catch (err) {
            console.error('Failed to sync Google events:', err);
        }
      }

      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject?.id, isGoogleConnected]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (user?.role === 'admin' || user?.id === selectedProject?.owner) {
      setSelectedSlot(slotInfo);
      setIsDialogOpen(true);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    if (event.meet_link) {
        window.open(event.meet_link, '_blank');
    }
  };

  if (!selectedProject) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-dashed border-border mt-8">
        <p className="text-muted-foreground">Please select a project to view events.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Events & Calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sync your project with Google Calendar and schedule meetings.</p>
        </div>
        
        {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
          <Button 
            onClick={() => {
                setSelectedSlot({ start: new Date(), end: new Date(Date.now() + 3600000) });
                setIsDialogOpen(true);
            }}
            className={cn(
              "h-10 rounded-xl text-[14px] font-bold gap-2 px-6",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
              "hover:brightness-110 hover:scale-105 transition-all duration-200"
            )}
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      <GoogleCalendarConnect onStatusChange={setIsGoogleConnected} />

      <div className="bg-card rounded-2xl border border-border p-2 shadow-xl shadow-foreground/5 min-h-[700px] relative">
        {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )}
        
        <EventCalendar 
            events={events} 
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
        />
      </div>

      <CreateEventDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedSlot={selectedSlot}
        projectId={selectedProject.id}
        onEventCreated={fetchEvents}
      />
    </div>
  );
}
