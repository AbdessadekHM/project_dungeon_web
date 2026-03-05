import { useState, useMemo, useCallback } from 'react';
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
  MoreHorizontal, PlusCircle, Search
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { TypeBadge } from './TypeBadge';
import type { Task } from '../types';
import type { User } from '@/features/projects/types';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';

interface DataTableProps {
  tasks: Task[];
  users: User[];
  onTaskUpdate?: (taskId: number, newStatus: Task['status']) => Promise<void> | void;
  onTaskClick?: (task: Task) => void;
}

import { useTranslation } from 'react-i18next';

export function TaskTable({ tasks, onTaskUpdate, onTaskClick }: DataTableProps) {
  const { user } = useAuthStore();
  const { selectedProject } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const { t } = useTranslation();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const toggleFilter = useCallback((filter: string[], setFilter: (f: string[]) => void, value: string) => {
    if (filter.includes(value)) {
      setFilter(filter.filter(v => v !== value));
    } else {
      setFilter([...filter, value]);
    }
  }, []);

//   const formatStatus = (s: string) => s === 'in_progress' ? 'In Progress' : s === 'todo' ? 'Todo' : 'Done';
//   const formatPriority = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('tasks.filterTasks')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-[13px] pl-8 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed border-border text-[13px]">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                {t('tasks.statusColumn')}
                {statusFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal text-[11px]">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px] border-border">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('tasks.filterByStatus')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['todo', 'in_progress', 'finished'].map(val => (
                <DropdownMenuCheckboxItem
                  key={val}
                  checked={statusFilter.includes(val)}
                  onCheckedChange={() => toggleFilter(statusFilter, setStatusFilter, val)}
                  className="text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <StatusBadge status={val} />
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed border-border text-[13px]">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                {t('tasks.priorityColumn')}
                {priorityFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal text-[11px]">
                    {priorityFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px] border-border">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('tasks.filterByPriority')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['low', 'medium', 'high'].map(val => (
                <DropdownMenuCheckboxItem
                  key={val}
                  checked={priorityFilter.includes(val)}
                  onCheckedChange={() => toggleFilter(priorityFilter, setPriorityFilter, val)}
                  className="text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={val} />
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(statusFilter.length > 0 || priorityFilter.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              onClick={() => { setStatusFilter([]); setPriorityFilter([]); setSearchQuery(''); }}
              className="h-8 px-2 text-muted-foreground text-[13px]"
            >
              {t('common.reset')}
            </Button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="w-[90px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">{t('tasks.taskColumn')}</TableHead>
              <TableHead className="min-w-[300px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">{t('tasks.titleColumn')}</TableHead>
              <TableHead className="min-w-[300px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">{t('tasks.typeColumn')}</TableHead>
              <TableHead className="w-[150px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">{t('tasks.statusColumn')}</TableHead>
              <TableHead className="w-[120px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">{t('tasks.priorityColumn')}</TableHead>
              <TableHead className="w-[50px] px-4 py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-[13px]">
                  {t('tasks.noTasksFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="group border-b border-border hover:bg-secondary/50 transition-colors duration-150 relative"
                >
                  {/* Left accent bar on hover */}
                  {/* <td className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" /> */}
                  
                  <TableCell className="font-mono text-[12px] text-muted-foreground w-[90px] px-4">
                    TASK-{task.id.toString().padStart(4, '0')}
                  </TableCell>
                  <TableCell className="font-mono text-[12px] text-muted-foreground w-[90px] px-4">
                    {task.title}
                  </TableCell>
                  <TableCell className="font-mono text-[12px] text-muted-foreground w-[90px] px-4">

                    <TypeBadge type={task.task_type || 'other'} />
                  </TableCell>
                  <TableCell className="px-4">
                    <Select 
                      defaultValue={task.status} 
                      onValueChange={(value) => onTaskUpdate?.(task.id, value as Task['status'])}
                    >
                      <SelectTrigger className="w-[140px] h-8 bg-transparent border-none shadow-none focus:ring-0 p-0 hover:bg-secondary/50 rounded-md data-[state=open]:bg-secondary/50 transition-colors">
                        <SelectValue>
                          <div className="flex items-center gap-2 pl-1">
                            <StatusBadge status={task.status} />
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="border-border">
                        <SelectItem value="todo">
                          <StatusBadge status="todo" />
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <StatusBadge status="in_progress" />
                        </SelectItem>
                        <SelectItem value="finished">
                          <StatusBadge status="finished" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4">
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="px-4">
                    {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border">
                          <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">{t('tasks.actions')}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onTaskClick?.(task)} className="text-[13px] cursor-pointer">{t('tasks.editTask')}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive text-[13px] cursor-pointer">{t('tasks.deleteTask')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
