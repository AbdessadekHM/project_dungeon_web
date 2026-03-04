import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { CalendarEvent } from '../types';

const localizer = momentLocalizer(moment);

interface EventCalendarProps {
  events: CalendarEvent[];
  onSelectSlot?: (slotInfo: any) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ 
  events, 
  onSelectSlot, 
  onSelectEvent 
}) => {
  const [view, setView] = React.useState<any>(Views.MONTH);
  const [date, setDate] = React.useState<Date>(new Date());

  // Convert ISO dates to Date objects for react-big-calendar
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    // Add specific classes for coloring
    className: `event-${event.source} event-${event.event_type}`
  }));

  return (
    <div className="h-full min-h-[700px]">
      <Calendar
        localizer={localizer}
        events={formattedEvents as any}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={(e) => onSelectEvent?.(e as any)}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        allDayAccessor="allDay"
        eventPropGetter={(event: any) => ({
            className: event.className
        })}
        popup
        messages={{
          next: "Next",
          previous: "Previous",
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "Agenda",
        }}
      />
    </div>
  );
};
