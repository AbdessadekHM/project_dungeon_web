import { Plus, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Repositories() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Repositories</h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">Manage project repositories here.</p>
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
          Add Repository
        </Button>
      </div>

      {/* Empty state */}
      <div className="text-center p-16 border border-dashed border-border rounded-lg bg-secondary/10">
        <div className="h-12 w-12 rounded-xl bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <Github className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-[13px]">No repositories linked. Add a repository to track code changes.</p>
      </div>
    </div>
  );
}
