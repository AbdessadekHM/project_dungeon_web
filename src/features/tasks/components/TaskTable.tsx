import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

interface TaskTableProps {
  tasks: Task[];
  users: User[];
}

export function TaskTable({ tasks, users }: TaskTableProps) {
  const getUserName = (id: number | null) => {
    if (!id) return { username: 'Unassigned', initial: '?' };
    const user = users.find(u => u.id === id);
    return user 
      ? { username: user.username, initial: user.username.substring(0, 2).toUpperCase() } 
      : { username: 'Unknown', initial: '?' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo': return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> To Do</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><Clock className="w-3 h-3" /> In Progress</Badge>;
      case 'finished': return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 className="w-3 h-3" /> Finished</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500 hover:bg-amber-600 border-transparent text-white">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No tasks available.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const assignee = getUserName(task.assignee);
              
              return (
                <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    {task.title}
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-1">
                      {task.description}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.assignee ? (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {assignee.initial}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted border border-dashed flex items-center justify-center">
                          <span className="text-[10px] text-muted-foreground">?</span>
                        </div>
                      )}
                      <span className="text-sm">{assignee.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
