import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TaskTable } from '../components/TaskTable';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { useAppStore } from '@/stores/useAppStore';
import { taskApi } from '../api';
import { teamApi } from '@/features/teams/api';
import { adminApi } from '@/features/admin/api';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

export function Tasks() {
  const { projectId } = useParams();
  const { selectedProject } = useAppStore();
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const pId = projectId || selectedProject?.id;
      if (!pId) return;

      const [tasksRes, , usersRes] = await Promise.all([
        taskApi.getTasks(pId),
        teamApi.getTeams(), 
        adminApi.getUsers()
      ]);
      setTasks(tasksRes); 
      setUsers(usersRes); 
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, selectedProject?.id]);

  useEffect(() => {
    if (projectId || selectedProject?.id) {
      fetchData();
    }
  }, [projectId, selectedProject?.id, fetchData]);

  const handleTaskUpdate = async (taskId: number, newStatus: Task['status']) => {
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      await taskApi.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
      fetchData();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">Manage and track project tasks.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-secondary/50 p-0.5 rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('kanban')}
              className={cn(
                "h-7 w-7 rounded-sm transition-all duration-150",
                viewMode === 'kanban' 
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

          {/* Create Task CTA */}
          {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
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
              Create Task
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground text-[13px] animate-pulse">Loading tasks...</p>
        </div>
      ) : viewMode === 'list' ? (
        <TaskTable tasks={tasks} users={users} onTaskUpdate={handleTaskUpdate} onTaskClick={setEditingTask} />
      ) : (
        <TaskKanbanBoard tasks={tasks} users={users} onTaskClick={setEditingTask} />
      )}

      {selectedProject && (
        <>
          <CreateTaskModal 
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSuccess={fetchData}
            project={selectedProject}
          />
          <EditTaskModal
            task={editingTask}
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
            onSuccess={fetchData}
            project={selectedProject}
          />
        </>
      )}
    </div>
  );
}
