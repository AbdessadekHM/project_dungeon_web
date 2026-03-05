import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Folder, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal';
import { ProjectTable } from '../components/ProjectTable';
import { useAppStore } from '@/stores/useAppStore';
import { projectApi } from '@/features/projects/api';
import type { Project } from '@/features/projects/types';

import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedProject } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}/tasks`);
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('dashboard.description')}</p>
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
              "transition-all duration-200"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('common.newProject')}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">{t('dashboard.loadingProjects')}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 px-8 border border-dashed border-border rounded-xl bg-card/50">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('dashboard.noProjects')}</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            {t('dashboard.noProjectsDescription')}
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
            {t('dashboard.createFirstProject')}
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleProjectSelect(project)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <ProjectTable projects={projects} onProjectSelect={handleProjectSelect} />
      )}

      {/* Recent Activity placeholder — only shown when projects exist */}
      {!isLoading && projects.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">{t('dashboard.recentActivity')}</h2>
          </div>
          <div className="rounded-xl border border-border bg-card/30 p-8 text-center">
            <p className="text-muted-foreground text-sm">{t('dashboard.noActivity')}</p>
          </div>
        </div>
      )}

      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onSuccess={fetchProjects}
      />
    </div>
  );
}
