import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MoreVertical } from "lucide-react";
import type { Task } from "../types";
import type { User } from "@/features/projects/types";

interface TaskKanbanCardProps {
  task: Task;
  users: User[];
}

export function TaskKanbanCard({ task, users }: TaskKanbanCardProps) {
  const getUserName = (id: number | null) => {
    if (!id) return { username: 'Unassigned', initial: '?' };
    const user = users.find(u => u.id === id);
    return user 
      ? { username: user.username, initial: user.username.substring(0, 2).toUpperCase() } 
      : { username: 'Unknown', initial: '?' };
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const assignee = getUserName(task.assignee);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className={`capitalize ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div>
          <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
            {task.description}
          </p>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          
          {task.assignee ? (
            <Avatar className="h-6 w-6 border-2 border-background shadow-sm" title={assignee.username}>
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {assignee.initial}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div 
              className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center shadow-sm"
              title="Unassigned"
            >
              <span className="text-[10px] text-muted-foreground">?</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
