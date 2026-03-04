import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { teamApi } from '../api';
import type { Team, User, Project } from '../types';
import { TeamCard } from '../components/TeamCard';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { EditTeamModal } from '../components/EditTeamModal';
import { TeamDetailsModal } from '../components/TeamDetailsModal';
import { TeamTable } from '../components/TeamTable';
import { adminApi } from '@/features/admin/api';

export function Teams() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teams, setTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<Team | null>(null);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState<Team | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teamsData, usersData, projectsData] = await Promise.all([
        teamApi.getTeams(),
        adminApi.getUsers(),
        teamApi.getProjects()
      ]);
      setTeams(teamsData);
      setAllUsers(usersData);
      setAllProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch teams data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = () => {
    const team = selectedTeamForDetails;
    setSelectedTeamForDetails(null);
    setSelectedTeamForEdit(team);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">Organize collaborators and manage project access.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-secondary/50 p-0.5 rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-7 w-7 rounded-sm transition-all duration-150",
                viewMode === 'grid' 
                  ? 'bg-card shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(
                "h-7 w-7 rounded-sm transition-all duration-150",
                viewMode === 'list' 
                  ? 'bg-card shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className={cn(
              "h-8 rounded-md text-[13px] font-medium gap-1.5",
              "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
              "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
              "transition-all duration-150"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Create Team
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground text-[13px] animate-pulse">Loading teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border rounded-lg bg-secondary/10">
           <p className="text-muted-foreground mb-4 text-[13px]">You have no teams yet.</p>
           <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="text-[13px] border-border">Create your first team</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.id} onClick={() => setSelectedTeamForDetails(team)}>
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      ) : (
        <TeamTable teams={teams} onTeamSelect={setSelectedTeamForDetails} />
      )}

      <CreateTeamModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onSuccess={fetchData}
      />

      <TeamDetailsModal
        team={selectedTeamForDetails}
        open={!!selectedTeamForDetails}
        onOpenChange={(open) => !open && setSelectedTeamForDetails(null)}
        allUsers={allUsers}
        allProjects={allProjects}
        onEditClick={handleEditClick}
      />

      <EditTeamModal
        team={selectedTeamForEdit}
        open={!!selectedTeamForEdit}
        onOpenChange={(open) => !open && setSelectedTeamForEdit(null)}
        onSuccess={fetchData}
        allUsers={allUsers}
      />
    </div>
  );
}
