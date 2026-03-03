import { TaskKanbanCard } from './TaskKanbanCard';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

interface TaskKanbanBoardProps {
  tasks: Task[];
  users: User[];
}

export function TaskKanbanBoard({ tasks, users }: TaskKanbanBoardProps) {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-slate-100 dark:bg-slate-800/50',
      dotColor: 'bg-slate-400',
      tasks: tasks.filter(t => t.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'bg-blue-50 dark:bg-blue-950/20',
      dotColor: 'bg-blue-500',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'finished',
      title: 'Finished',
      color: 'bg-green-50 dark:bg-green-950/20',
      dotColor: 'bg-green-500',
      tasks: tasks.filter(t => t.status === 'finished')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full">
      {columns.map(column => (
        <div key={column.id} className={`rounded-xl border border-border/50 ${column.color} flex flex-col h-full min-h-[500px]`}>
          <div className="p-4 border-b border-border/10 flex items-center justify-between sticky top-0 bg-inherit z-10 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
              <h3 className="font-semibold text-sm">{column.title}</h3>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/50 border border-border/50 text-muted-foreground">
              {column.tasks.length}
            </span>
          </div>
          
          <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
            {column.tasks.length === 0 ? (
              <div className="h-32 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                No tasks
              </div>
            ) : (
              column.tasks.map(task => (
                <TaskKanbanCard key={task.id} task={task} users={users} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
