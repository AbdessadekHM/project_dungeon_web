import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Repositories() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage project repositories here.</p>
        </div>
        <Button 
          className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all font-medium rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Add Repository
        </Button>
      </div>
    </div>
  );
}
