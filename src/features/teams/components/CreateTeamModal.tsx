import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { teamApi } from '../api';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CreateTeamForm {
  name: string;
  description: string;
}

export function CreateTeamModal({ open, onOpenChange, onSuccess }: CreateTeamModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTeamForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const onSubmit = async (data: CreateTeamForm) => {
    setIsSubmitting(true);
    try {
      await teamApi.createTeam({
        name: data.name,
        description: data.description,
        owner: user?.id || 1,
        collaborators: [],
        projects: [], 
      });
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create team', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">Create New Team</DialogTitle>
          <DialogDescription className="text-[13px]">
            Give your team a name and description to get started.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[13px] font-medium">Team Name</label>
            <Input 
              id="name" 
              placeholder="e.g. Frontend Ninjas"
              className="bg-secondary/30 border-border text-[13px]"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-[13px] font-medium">Description</label>
            <Textarea 
              id="description" 
              placeholder="What does this team do?"
              className="resize-none bg-secondary/30 border-border text-[13px]"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-[11px] text-destructive">{errors.description.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-[13px] border-border">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "text-[13px]",
                "bg-gradient-to-br from-indigo-500 to-violet-600 text-white",
                "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                "transition-all duration-150"
              )}
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
