import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal';
import { ProjectTable } from '../components/ProjectTable';
import { useAppStore } from '@/stores/useAppStore';
import { projectApi } from '@/features/projects/api';
import type { Project } from '@/features/projects/types';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedProject } = useAppStore();
  const navigate = useNavigate();

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your projects and collaborate with your team.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all font-medium rounded-xl"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg bg-muted/10">
           <p className="text-muted-foreground mb-4">You have no projects yet.</p>
           <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create your first project</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleProjectSelect(project)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <ProjectTable projects={projects} onProjectSelect={handleProjectSelect} />
      )}

      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onSuccess={fetchProjects}
      />
    </div>
  );
}
