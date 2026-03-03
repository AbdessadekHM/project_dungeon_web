import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskTable } from '../components/TaskTable';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { useAppStore } from '@/stores/useAppStore';
import { taskApi } from '../api';
import { teamApi } from '@/features/teams/api';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

export function Tasks() {
  const { projectId } = useParams();
  const { selectedProject } = useAppStore();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (projectId || selectedProject?.id) {
      fetchData();
    }
  }, [projectId, selectedProject?.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const pId = projectId || selectedProject?.id;
      if (!pId) return;

      const [tasksData, usersData] = await Promise.all([
        taskApi.getTasks(pId),
        teamApi.getUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage project tasks here.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Kanban View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all font-medium rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : viewMode === 'list' ? (
        <TaskTable tasks={tasks} users={users} />
      ) : (
        <TaskKanbanBoard tasks={tasks} users={users} />
      )}

      {selectedProject && (
        <CreateTaskModal 
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={fetchData}
          project={selectedProject}
        />
      )}
    </div>
  );
}
