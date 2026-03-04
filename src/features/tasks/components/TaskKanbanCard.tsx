import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MoreVertical, GripVertical } from "lucide-react";
import { Draggable } from '@hello-pangea/dnd';
import { PriorityBadge } from './PriorityBadge';
import { TypeBadge } from './TypeBadge';
import type { Task } from "../types";
import type { User } from "@/features/projects/types";

interface TaskKanbanCardProps {
  task: Task;
  users: User[];
  index: number;
  onClick?: () => void;
}

export function TaskKanbanCard({ task, users, index, onClick }: TaskKanbanCardProps) {
  const getUserName = (id: number | null) => {
    if (!id) return { username: 'Unassigned', initial: '?' };
    const user = users.find(u => u.id === id);
    return user 
      ? { username: user.username, initial: user.username.substring(0, 2).toUpperCase() } 
      : { username: 'Unknown', initial: '?' };
  };

  const assignee = getUserName(task.assignee);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={onClick}
          className={`cursor-pointer card-hover-glow rounded-xl group ${snapshot.isDragging ? 'shadow-lg border-primary/50! rotate-1' : ''}`}
        >
          <CardContent className="p-3 space-y-2.5">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <div 
                  {...provided.dragHandleProps} 
                  className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </div>
                <TypeBadge type={task.task_type || 'other'} />
              </div>
              <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {task.title}
              </h4>
              <p className="text-[12px] text-muted-foreground/80 line-clamp-2 mt-1">
                {task.description}
              </p>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div className="flex items-center gap-3">
                <PriorityBadge priority={task.priority} />
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
              
              {task.assignee ? (
                <div className="relative">
                  <Avatar className="h-6 w-6 border-2 border-card shadow-sm" title={assignee.username}>
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {assignee.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="presence-dot" style={{ width: '6px', height: '6px', borderWidth: '1.5px' }} />
                </div>
              ) : (
                <div 
                  className="h-6 w-6 rounded-full bg-secondary border-2 border-card flex items-center justify-center shadow-sm"
                  title="Unassigned"
                >
                  <span className="text-[10px] text-muted-foreground">?</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
