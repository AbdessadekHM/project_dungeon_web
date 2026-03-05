import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Link2, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/features/events/types';

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
}

export function EventDetailDialog({ open, onOpenChange, event }: EventDetailDialogProps) {
  if (!event) return null;

  const isHoliday = event.source === 'holiday';
  const hasMeetLink = !!event.meet_link;

  const renderAttendees = () => {
    if (!event.attendees || event.attendees.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Users className="h-4 w-4 text-muted-foreground" />
          Attendees ({event.attendees.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {event.attendees.map((attendee: any, i) => {
            const email = attendee.email;
            const status = attendee.responseStatus;
            
            return (
              <Badge key={i} variant="outline" className="flex items-center gap-1.5 py-1 px-2.5">
                <span className="truncate max-w-[150px]">{email}</span>
                {status && (
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'accepted' ? 'bg-emerald-500' : 
                    status === 'declined' ? 'bg-destructive' : 
                    status === 'tentative' ? 'bg-amber-500' : 'bg-muted-foreground'
                  }`} title={status} />
                )}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Badge 
              variant="secondary" 
              className={`capitalize px-3 py-1 ${
                isHoliday ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                event.source === 'google' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {isHoliday ? 'Holiday' : event.source === 'google' ? 'Google Calendar' : 'Local Event'}
            </Badge>
            {event.event_type !== 'holiday' && (
              <Badge variant="outline" className="capitalize text-muted-foreground">
                {event.event_type}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight">
            {event.title}
          </DialogTitle>
          {event.description && (
            <DialogDescription className="text-base mt-3 whitespace-pre-wrap text-muted-foreground/80">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-md shrink-0">
                <CalendarIcon className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.start), 'EEEE, MMMM d, yyyy')}
                  {!event.allDay && event.end && format(new Date(event.start), 'yyyy-MM-dd') !== format(new Date(event.end), 'yyyy-MM-dd') && (
                    <> - <br/>{format(new Date(event.end), 'EEEE, MMMM d, yyyy')}</>
                  )}
                </p>
              </div>
            </div>

            {!event.allDay && (
              <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded-md shrink-0">
                  <Clock className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                  </p>
                </div>
              </div>
            )}
            
            {event.allDay && (
               <div className="flex items-start gap-3">
                <div className="bg-muted p-2 rounded-md shrink-0">
                  <Info className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Duration</p>
                  <p className="text-sm text-muted-foreground">All Day Event</p>
                </div>
              </div>
            )}
          </div>

          {renderAttendees()}
          
          {hasMeetLink && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-emerald-500/10 p-2 rounded-md shrink-0">
                  <Link2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Google Meet</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {event.meet_link}
                  </p>
                </div>
              </div>
              <Button 
                className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={() => window.open(event.meet_link, '_blank')}
              >
                <Link2 className="h-4 w-4" />
                Join Meeting
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
