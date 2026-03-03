import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { teamApi } from '../api';
import type { Team, User } from '../types';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserMinus, UserPlus, Check } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

interface EditTeamModalProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  allUsers: User[];
}

interface EditTeamForm {
  name: string;
  description: string;
}

export function EditTeamModal({ team, open, onOpenChange, onSuccess, allUsers }: EditTeamModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditTeamForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collaborators, setCollaborators] = useState<number[]>([]);
  const [selectedNewUser, setSelectedNewUser] = useState<string>('');

  useEffect(() => {
    if (team && open) {
      setValue('name', team.name);
      setValue('description', team.description);
      setCollaborators([...team.collaborators]);
    } else if (!open) {
      reset();
      setCollaborators([]);
      setSelectedNewUser('');
    }
  }, [team, open, setValue, reset]);

  if (!team) return null;

  const onSubmit = async (data: EditTeamForm) => {
    setIsSubmitting(true);
    try {
      await teamApi.updateTeam(team.id, {
        name: data.name,
        description: data.description,
        collaborators: collaborators,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update team', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setCollaborators(prev => prev.filter(id => id !== userId));
  };

  const handleAddUser = () => {
    if (!selectedNewUser) return;
    const userId = parseInt(selectedNewUser, 10);
    if (!collaborators.includes(userId)) {
      setCollaborators(prev => [...prev, userId]);
    }
    setSelectedNewUser('');
  };

  const availableUsersToAdd = allUsers.filter(u => 
    !collaborators.includes(u.id) && u.id !== team.owner
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team: {team.name}</DialogTitle>
          <DialogDescription>
            Update team details and manage collaborators.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">General Info</h3>
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Team Name</label>
              <Input 
                id="edit-name" 
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="edit-description" 
                className="resize-none h-24"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">Manage Members</h3>
            
            {/* Add new member */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Add Collaborator</label>
                <Select value={selectedNewUser} onValueChange={setSelectedNewUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsersToAdd.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground italic text-center">No more users available</div>
                    ) : (
                      availableUsersToAdd.map(u => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.username} ({u.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddUser} disabled={!selectedNewUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Current Members List */}
            <div className="rounded-md border bg-muted/20 divide-y max-h-[200px] overflow-y-auto">
              {/* Owner (Cannot be removed here) */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">O</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {allUsers.find(u => u.id === team.owner)?.username || `User #${team.owner}`}
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold uppercase">Owner</span>
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" disabled className="opacity-50">
                  <Check className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Collaborators */}
              {collaborators.map(userId => {
                const u = allUsers.find(user => user.id === userId);
                return (
                  <div key={userId} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {u?.username?.substring(0, 1).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{u?.username || `User #${userId}`}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveUser(userId)}
                      title="Remove user"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              {collaborators.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <span className="italic">No external collaborators yet.</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
