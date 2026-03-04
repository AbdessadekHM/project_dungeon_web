import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { calendarApi } from '../api/calendarApi';
import type { Attendee, CreateEventPayload } from '../types';
import { Loader2, Video, Users, Calendar } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: { start: Date; end: Date } | null;
  projectId: number;
  onEventCreated: () => void;
}

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  selectedSlot,
  projectId,
  onEventCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Attendee[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    event_type: 'meeting',
    create_meet: false,
    attendees: [] as number[]
  });

  useEffect(() => {
    if (open) {
      fetchUsers();
      if (selectedSlot) {
        // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
        const format = (date: Date) => {
          const pad = (n: number) => n.toString().padStart(2, '0');
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };
        setFormData(prev => ({
          ...prev,
          start_time: format(selectedSlot.start),
          end_time: format(selectedSlot.end)
        }));
      }
    }
  }, [open, selectedSlot]);

  const fetchUsers = async () => {
    try {
      const data = await calendarApi.getPotentialAttendees();
      setUsers(data.filter((u: any) => u.role !== 'admin'));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateEventPayload = {
        ...formData,
        project: projectId,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };
      
      await calendarApi.createGoogleEvent(payload);
      onEventCreated();
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        event_type: 'meeting',
        create_meet: false,
        attendees: []
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please check your Google connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendee = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(userId)
        ? prev.attendees.filter(id => id !== userId)
        : [...prev.attendees, userId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Schedule a meeting or event. This will be synced with your Google Calendar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g. Project Sync Meeting"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              className="rounded-xl border-border bg-muted/30 focus:bg-background transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-sm font-semibold">Start Date & Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                required
                className="rounded-xl border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-sm font-semibold">End Date & Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                required
                className="rounded-xl border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this meeting..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl border-border bg-muted/30 focus:bg-background min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Google Meet</span>
                <span className="text-xs text-muted-foreground">Add a video conference link</span>
              </div>
            </div>
            <Checkbox
              checked={formData.create_meet}
              onCheckedChange={checked => setFormData({ ...formData, create_meet: !!checked })}
              className="h-5 w-5 rounded-md border-primary"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Invite Attendees
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[150px] overflow-y-auto p-4 border border-border rounded-xl bg-muted/20">
              {users.map(user => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={formData.attendees.includes(user.id)}
                    onCheckedChange={() => toggleAttendee(user.id)}
                  />
                  <Label 
                    htmlFor={`user-${user.id}`} 
                    className="text-xs font-medium cursor-pointer truncate"
                  >
                    {user.username} ({user.email})
                  </Label>
                </div>
              ))}
              {users.length === 0 && <span className="text-xs text-muted-foreground italic col-span-2">No collaborators found.</span>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="rounded-xl px-8 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
