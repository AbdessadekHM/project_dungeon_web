import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List, Users as UsersIcon } from 'lucide-react';
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

import { useTranslation } from 'react-i18next';

export function Teams() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [teams, setTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('teams.title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('teams.description')}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-secondary/50 p-0.5 rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-7 w-7 rounded-md transition-all duration-200",
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
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
                "h-7 w-7 rounded-md transition-all duration-200",
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className={cn(
              "h-8 rounded-lg text-[13px] font-medium gap-1.5 px-4",
              "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
              "hover:brightness-110 hover:shadow-glow-indigo",
              "transition-all duration-150"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('teams.createTeam')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">{t('teams.loadingTeams')}</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-20 px-8 border border-dashed border-border rounded-xl bg-card/50">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('teams.noTeams')}</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            {t('teams.noTeamsDescription')}
          </p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className={cn(
              "rounded-lg text-sm font-medium gap-2 px-5 py-2 h-auto",
              "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
              "hover:brightness-110 hover:shadow-glow-indigo",
              "transition-all duration-200"
            )}
          >
            <Plus className="h-4 w-4" />
            {t('teams.createFirstTeam')}
          </Button>
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
