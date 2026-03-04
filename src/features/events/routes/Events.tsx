import { Plus, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Events() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Events</h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">Manage project events here.</p>
        </div>
        <Button 
          className={cn(
            "h-8 rounded-md text-[13px] font-medium gap-1.5",
            "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
            "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
            "transition-all duration-150"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Create Event
        </Button>
      </div>

      {/* Empty state */}
      <div className="text-center p-16 border border-dashed border-border rounded-lg bg-secondary/10">
        <div className="h-12 w-12 rounded-xl bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-[13px]">No events yet. Create your first event to get started.</p>
      </div>
    </div>
  );
}
