import { 
  Dialog, DialogContent, DialogDescription, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Team, User, Project } from '../types';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { Edit, ShieldUser, Users } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useNavigate } from 'react-router-dom';

interface TeamDetailsModalProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allUsers: User[];
  allProjects: Project[];
  onEditClick: () => void;
}

import { useTranslation } from 'react-i18next';

export function TeamDetailsModal({ team, open, onOpenChange, allUsers, allProjects, onEditClick }: TeamDetailsModalProps) {
  const { setSelectedProject } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!team) return null;

  const owner = allUsers.find(u => u.id === team.owner);
  const teamProjects = allProjects.filter(p => team.projects.includes(p.id));

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    onOpenChange(false);
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 overflow-hidden border-border bg-card shadow-lg">
        {/* Header section */}
        <div className="p-6 border-b border-border bg-secondary/20 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <DialogTitle className="text-[15px] font-semibold flex items-center gap-3">
                {team.name}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-[13px]">
                {team.description}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onEditClick} className="gap-2 shrink-0 text-[13px] border-border">
              <Edit className="h-3.5 w-3.5" />
              {t('teams.editTeam')}
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Members Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-[13px] font-semibold tracking-tight">{t('teams.teamMembers')}</h3>
              <Badge variant="secondary" className="ml-2 font-mono text-[11px]">{team.collaborators.length + 1}</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Owner Card */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-accent-subtle">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-[11px] font-bold">O</AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-medium text-[13px]">{owner?.username || t('teams.userNumber', { id: team.owner })}</span>
                     <ShieldUser className="h-3.5 w-3.5 text-primary" />
                   </div>
                   <span className="text-[11px] text-muted-foreground">{owner?.email || t('teams.owner')}</span>
                 </div>
              </div>

              {/* Collaborators */}
              {team.collaborators.map(userId => {
                const c = allUsers.find(u => u.id === userId);
                return (
                  <div key={userId} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-[11px] font-medium">
                          {c?.username?.substring(0, 1).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-[13px]">{c?.username || t('teams.userNumber', { id: userId })}</span>
                      <span className="text-[11px] text-muted-foreground">{c?.email || t('teams.collaboratorLabel')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <h3 className="text-[13px] font-semibold tracking-tight">{t('teams.contributingProjects')}</h3>
              <Badge variant="secondary" className="ml-2 font-mono text-[11px]">{teamProjects.length}</Badge>
            </div>
            
            {teamProjects.length === 0 ? (
              <div className="text-center p-8 rounded-lg border border-dashed border-border bg-secondary/10">
                <p className="text-muted-foreground text-[13px]">{t('teams.noProjectsAssigned')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamProjects.map(project => (
                  <div key={project.id} onClick={() => handleProjectClick(project)}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
