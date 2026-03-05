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
import { cn } from '@/lib/utils';
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

import { useTranslation } from 'react-i18next';

export function EditTeamModal({ team, open, onOpenChange, onSuccess, allUsers }: EditTeamModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditTeamForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collaborators, setCollaborators] = useState<number[]>([]);
  const [selectedNewUser, setSelectedNewUser] = useState<string>('');
  const { t } = useTranslation();

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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">{t('teams.editTitle', { name: team.name })}</DialogTitle>
          <DialogDescription className="text-[13px]">
            {t('teams.editDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border pb-2">{t('teams.generalInfo')}</h3>
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-[13px] font-medium">{t('teams.teamName')}</label>
              <Input 
                id="edit-name" 
                className="bg-secondary/30 border-border text-[13px]"
                {...register('name', { required: t('teams.nameRequired') })}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-[13px] font-medium">{t('common.description')}</label>
              <Textarea 
                id="edit-description" 
                className="resize-none h-24 bg-secondary/30 border-border text-[13px]"
                {...register('description', { required: t('teams.descriptionRequired') })}
              />
              {errors.description && <p className="text-[11px] text-destructive">{errors.description.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border pb-2">{t('teams.manageMembers')}</h3>
            
            {/* Add new member */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-medium">{t('teams.addCollaborator')}</label>
                <Select value={selectedNewUser} onValueChange={setSelectedNewUser}>
                  <SelectTrigger className="bg-secondary/30 border-border text-[13px]">
                    <SelectValue placeholder={t('teams.selectUserToAdd')} />
                  </SelectTrigger>
                  <SelectContent className="border-border">
                    {availableUsersToAdd.length === 0 ? (
                      <div className="p-2 text-[13px] text-muted-foreground italic text-center">{t('teams.noMoreUsers')}</div>
                    ) : (
                      availableUsersToAdd.map(u => (
                        <SelectItem key={u.id} value={u.id.toString()} className="text-[13px]">
                          {u.username} ({u.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddUser} disabled={!selectedNewUser} className="text-[13px]">
                <UserPlus className="h-4 w-4 mr-2" />
                {t('common.create')}
              </Button>
            </div>

            {/* Current Members List */}
            <div className="rounded-md border border-border bg-secondary/10 divide-y divide-border max-h-[200px] overflow-y-auto">
              {/* Owner */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">O</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium flex items-center gap-2">
                      {allUsers.find(u => u.id === team.owner)?.username || t('teams.userNumber', { id: team.owner })}
                      <span className="text-[10px] bg-accent-subtle text-primary px-1.5 py-0.5 rounded-full font-semibold uppercase">{t('teams.owner')}</span>
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" disabled className="opacity-50 h-7 w-7">
                  <Check className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>

              {/* Collaborators */}
              {collaborators.map(userId => {
                const u = allUsers.find(user => user.id === userId);
                return (
                  <div key={userId} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">
                          {u?.username?.substring(0, 1).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-medium">{u?.username || t('teams.userNumber', { id: userId })}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7"
                      onClick={() => handleRemoveUser(userId)}
                      title={t('teams.removeUser')}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              {collaborators.length === 0 && (
                <div className="p-4 text-center text-[13px] text-muted-foreground italic">
                  {t('teams.noExternalCollaborators')}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="text-[13px] border-border">{t('common.cancel')}</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "text-[13px]",
                "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
                "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                "transition-all duration-150"
              )}
            >
              {isSubmitting ? t('teams.saving') : t('teams.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
