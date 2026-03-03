import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { TaskKanbanCard } from './TaskKanbanCard';
import { taskApi } from '../api';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

interface TaskKanbanBoardProps {
  tasks: Task[];
  users: User[];
}

export function TaskKanbanBoard({ tasks: initialTasks, users }: TaskKanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sync state if props change (e.g., after creation)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find(t => t.id.toString() === draggableId);
    if (!draggedTask) return;

    // Optimistic update
    const newStatus = destination.droppableId as 'todo' | 'in_progress' | 'finished';
    const updatedTasks = tasks.map(t => 
      t.id.toString() === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await taskApi.updateTask(parseInt(draggableId), { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on failure
      setTasks(initialTasks);
    }
  };

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
    <DragDropContext onDragEnd={onDragEnd}>
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
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div 
                  className={`p-3 flex flex-col gap-3 flex-1 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.tasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                      No tasks
                    </div>
                  ) : (
                    column.tasks.map((task, index) => (
                      <TaskKanbanCard key={task.id} task={task} users={users} index={index} />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
