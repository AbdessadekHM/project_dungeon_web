import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal';

export function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data for initial UI stage
  const mockProjects = [
    { id: 1, title: 'Project Alpha', description: 'Main frontend development for the game.', owner: 1, collaborators: [2, 3], tasks_count: 12 },
    { id: 2, title: 'Backend API', description: 'Django REST framework implementation.', owner: 1, collaborators: [4], tasks_count: 5 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your projects and collaborate with your team.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-md hover:shadow-primary/20 transition-all">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  );
}
