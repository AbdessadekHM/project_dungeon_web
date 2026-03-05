import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, LayoutGrid, List, CheckCircle2 } from 'lucide-react';
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

import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('tasks.title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('tasks.description')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-secondary/50 p-0.5 rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('kanban')}
              className={cn(
                "h-7 w-7 rounded-md transition-all duration-200",
                viewMode === 'kanban' 
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

          {/* Create Task CTA */}
          {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
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
              {t('tasks.createTask')}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">{t('tasks.loading')}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 px-8 border border-dashed border-border rounded-xl bg-card/50">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('tasks.noTasks')}</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            {t('tasks.noTasksDescription')}
          </p>
          {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
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
              {t('tasks.createFirst')}
            </Button>
          )}
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
