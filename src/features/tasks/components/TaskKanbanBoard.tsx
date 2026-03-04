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
  onTaskClick?: (task: Task) => void;
}

export function TaskKanbanBoard({ tasks: initialTasks, users, onTaskClick }: TaskKanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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

    const newStatus = destination.droppableId as 'todo' | 'in_progress' | 'finished';
    const updatedTasks = tasks.map(t => 
      t.id.toString() === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await taskApi.updateTask(parseInt(draggableId), { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
      setTasks(initialTasks);
    }
  };

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      bgClass: 'bg-var(--status-todo-bg)]',
      dotStyle: { backgroundColor: 'var(--status-todo)' },
      tasks: tasks.filter(t => t.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      bgClass: 'bg-var(--status-progress-bg)]',
      dotStyle: { backgroundColor: 'var(--status-progress)' },
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'finished',
      title: 'Finished',
      bgClass: 'bg-var(--status-done-bg)]',
      dotStyle: { backgroundColor: 'var(--status-done)' },
      tasks: tasks.filter(t => t.status === 'finished')
    }
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start h-full">
        {columns.map(column => (
          <div key={column.id} className={`rounded-lg border border-border ${column.bgClass} flex flex-col h-full min-h-[500px]`}>
            <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between sticky top-0 bg-inherit z-10 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={column.dotStyle} />
                <h3 className="font-semibold text-[13px] text-foreground">{column.title}</h3>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-card/50 border border-border/50 text-muted-foreground">
                {column.tasks.length}
              </span>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div 
                  className={`p-3 flex flex-col gap-2 flex-1 overflow-y-auto transition-colors duration-150 ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.tasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground text-[13px]">
                      No tasks
                    </div>
                  ) : (
                    column.tasks.map((task, index) => (
                      <TaskKanbanCard 
                        key={task.id} 
                        task={task} 
                        users={users} 
                        index={index} 
                        onClick={() => onTaskClick?.(task)}
                      />
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
