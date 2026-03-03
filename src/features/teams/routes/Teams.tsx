import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { teamApi } from '../api';
import type { Team, User, Project } from '../types';
import { TeamCard } from '../components/TeamCard';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { EditTeamModal } from '../components/EditTeamModal';
import { TeamDetailsModal } from '../components/TeamDetailsModal';

export function Teams() {
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
        teamApi.getUsers(),
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
    // Transfer from Details to Edit modal
    const team = selectedTeamForDetails;
    setSelectedTeamForDetails(null);
    setSelectedTeamForEdit(team);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize collaborators and manage project access.</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all font-medium rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground animate-pulse">Loading teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl bg-muted/10 shadow-sm">
           <p className="text-muted-foreground mb-4">You have no teams yet.</p>
           <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create your first team</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} onClick={() => setSelectedTeamForDetails(team)}>
              <TeamCard team={team} />
            </div>
          ))}
        </div>
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
