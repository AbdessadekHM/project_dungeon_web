import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowUp, ArrowRight, ArrowDown, 
  Circle, Clock, CheckCircle2, 
  MoreHorizontal, PlusCircle, Search, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';

interface DataTableProps {
  tasks: Task[];
  users: User[];
}

export function TaskTable({ tasks }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const toggleFilter = (filter: string[], setFilter: (f: string[]) => void, value: string) => {
    if (filter.includes(value)) {
      setFilter(filter.filter(v => v !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'todo': return <Circle className="w-4 h-4 text-muted-foreground" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'finished': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <ArrowUp className="w-4 h-4 text-destructive" />;
      case 'medium': return <ArrowRight className="w-4 h-4 text-amber-500" />;
      case 'low': return <ArrowDown className="w-4 h-4 text-muted-foreground" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'feature': return <Badge variant="outline" className="font-normal text-xs bg-primary/5 text-primary border-primary/20">Feature</Badge>;
      case 'bug': return <Badge variant="outline" className="font-normal text-xs bg-destructive/5 text-destructive border-destructive/20">Bug</Badge>;
      case 'documentation': return <Badge variant="outline" className="font-normal text-xs bg-purple-500/5 text-purple-500 border-purple-500/20">Documentation</Badge>;
      default: return <Badge variant="outline" className="font-normal text-xs">Other</Badge>;
    }
  };

  const formatStatus = (s: string) => s === 'in_progress' ? 'In Progress' : s === 'todo' ? 'Todo' : 'Done';
  const formatPriority = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 bg-background/50 border-border/50"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-dashed border-border/50 bg-background/50">
                <PlusCircle className="mr-2 h-4 w-4" />
                Status
                {statusFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['todo', 'in_progress', 'finished'].map(val => (
                <DropdownMenuCheckboxItem
                  key={val}
                  checked={statusFilter.includes(val)}
                  onCheckedChange={() => toggleFilter(statusFilter, setStatusFilter, val)}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(val)}
                    <span>{formatStatus(val)}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-dashed border-border/50 bg-background/50">
                <PlusCircle className="mr-2 h-4 w-4" />
                Priority
                {priorityFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                    {priorityFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['low', 'medium', 'high'].map(val => (
                <DropdownMenuCheckboxItem
                  key={val}
                  checked={priorityFilter.includes(val)}
                  onCheckedChange={() => toggleFilter(priorityFilter, setPriorityFilter, val)}
                >
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(val)}
                    <span>{formatPriority(val)}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(statusFilter.length > 0 || priorityFilter.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              onClick={() => { setStatusFilter([]); setPriorityFilter([]); setSearchQuery(''); }}
              className="h-9 px-2 text-muted-foreground lg:px-3"
            >
              Reset
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-9 hidden md:flex">
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-md border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30 hover:bg-muted/30">
            <TableRow className="border-border/50">
              <TableHead className="w-[80px]">Task</TableHead>
              <TableHead className="min-w-[400px]">Title</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Priority</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id} className="border-border/20 hover:bg-muted/30 group">
                  <TableCell className="font-medium text-muted-foreground text-sm">
                    TASK-{task.id.toString().padStart(4, '0')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(task.task_type || 'other')}
                      <span className="font-medium truncate max-w-[500px]" title={task.title}>
                        {task.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getStatusIcon(task.status)}
                      <span>{formatStatus(task.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getPriorityIcon(task.priority)}
                      <span>{formatPriority(task.priority)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
