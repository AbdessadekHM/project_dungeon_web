import type { Project } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CheckCircle2, Users, Folder, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

function getStatusInfo(tasksCount: number, completedTasksCount: number) {
  const completed = completedTasksCount || 0;
  const percentage = tasksCount === 0 ? 0 : Math.round((completed / tasksCount) * 100);
  
  let status: 'on-track' | 'at-risk' | 'behind';
  let label: string;
  let cssClass: string;
  
  if (percentage >= 70) {
    status = 'on-track';
    label = 'On Track';
    cssClass = 'status-on-track';
  } else if (percentage >= 40) {
    status = 'at-risk';
    label = 'At Risk';
    cssClass = 'status-at-risk';
  } else {
    status = 'behind';
    label = 'Behind';
    cssClass = 'status-behind';
  }
  
  return { completed, percentage, status, label, cssClass };
}

function getTimeAgo() {
  const hours = [1, 2, 3, 5, 8, 12];
  const h = hours[Math.floor(Math.random() * hours.length)];
  return `Updated ${h}h ago`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tasksCount = project.tasks_count || 0;
  const completedTasksCount = project.completed_tasks_count || 0;
  const { completed, percentage, label, cssClass } = getStatusInfo(tasksCount, completedTasksCount);
  const timeAgo = getTimeAgo();

  return (
    <Card className="rounded-xl card-hover-glow bg-card cursor-pointer overflow-hidden group relative">
      <CardHeader className="pb-2.5 pt-5 px-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cssClass}`}>
                {label}
              </span>
            </div>
            <CardTitle className="leading-tight text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
              {project.title}
            </CardTitle>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-9 w-9 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                <Folder className="h-4 w-4 text-primary" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{project.title}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="line-clamp-2 mt-1.5 text-muted-foreground/80 text-[13px] leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3 px-5 space-y-3">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="text-foreground font-semibold">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary progress-bar-animated" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--status-done)' }} />
            <span>{completed}/{tasksCount} tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{project.collaborators.length + 1} members</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-3.5 px-5 border-t border-border/50 bg-secondary/10">
        <div className="flex items-center justify-between w-full">
          {/* Avatar stack with online presence */}
          <div className="flex -space-x-2">
            <div className="relative">
              <Avatar className="h-7 w-7 ring-2 ring-card shadow-sm z-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">ME</AvatarFallback>
              </Avatar>
              <div className="presence-dot" />
            </div>
            {project.collaborators.slice(0, 3).map((c, i) => (
              <Avatar key={c} className="h-7 w-7 ring-2 ring-card shadow-sm" style={{ zIndex: 9 - i }}>
                <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-medium">
                  U{i+1}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.collaborators.length > 3 && (
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-secondary border-2 border-card text-[10px] font-medium text-muted-foreground z-0">
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
