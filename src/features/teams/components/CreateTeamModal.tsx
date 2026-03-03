import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { teamApi } from '../api';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
        owner: user?.id || 1, // Fallback if user store missing ID
        collaborators: [], // Empty initially
        projects: [], 
      });
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create team', error);
      // Ideally show toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Give your team a name and description to get started. You can add collaborators and assign projects later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Team Name</label>
            <Input 
              id="name" 
              placeholder="e.g. Frontend Ninjas"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description" 
              placeholder="What does this team do?"
              className="resize-none"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
