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

export function TeamDetailsModal({ team, open, onOpenChange, allUsers, allProjects, onEditClick }: TeamDetailsModalProps) {
  const { setSelectedProject } = useAppStore();
  const navigate = useNavigate();

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
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl">
        {/* Header section */}
        <div className="p-6 border-b bg-muted/10 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                {team.name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {team.description}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onEditClick} className="gap-2 shrink-0 shadow-sm">
              <Edit className="h-4 w-4" />
              Edit Team
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Members Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold tracking-tight">Team Members</h3>
              <Badge variant="secondary" className="ml-2 font-mono">{team.collaborators.length + 1}</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Owner Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
                 <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">O</AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-medium text-sm">{owner?.username || `User #${team.owner}`}</span>
                     <ShieldUser className="h-3.5 w-3.5 text-primary" />
                   </div>
                   <span className="text-xs text-muted-foreground">{owner?.email || 'Owner'}</span>
                 </div>
              </div>

              {/* Collaborators */}
              {team.collaborators.map(userId => {
                const c = allUsers.find(u => u.id === userId);
                return (
                  <div key={userId} className="flex items-center gap-3 p-3 rounded-xl border bg-card shadow-sm">
                    <Avatar>
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                          {c?.username?.substring(0, 1).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{c?.username || `User #${userId}`}</span>
                      <span className="text-xs text-muted-foreground">{c?.email || 'Collaborator'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <h3 className="text-lg font-semibold tracking-tight">Contributing Projects</h3>
              <Badge variant="secondary" className="ml-2 font-mono">{teamProjects.length}</Badge>
            </div>
            
            {teamProjects.length === 0 ? (
              <div className="text-center p-8 rounded-xl border border-dashed bg-muted/5">
                <p className="text-muted-foreground text-sm">This team is not currently assigned to any projects.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamProjects.map(project => (
                  <div key={project.id} onClick={() => handleProjectClick(project)}>
                    {/* Re-use ProjectCard, standardizing look */}
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
