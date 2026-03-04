import type { Project } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Users, Folder } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="rounded-lg border border-border bg-card hover:border-primary/30 transition-all duration-150 cursor-pointer overflow-hidden group relative">
      {/* Left accent bar on hover */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="leading-tight text-[15px] font-semibold group-hover:text-primary transition-colors duration-150">{project.title}</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0">
            <Folder className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-1.5 text-muted-foreground text-[13px] leading-relaxed">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--status-done)' }} />
            <span>{project.tasks_count || 0} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{project.collaborators.length + 1} members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border bg-secondary/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2.5">
            <Avatar className="h-7 w-7 ring-2 ring-card shadow-sm z-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">ME</AvatarFallback>
            </Avatar>
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
        </div>
      </CardFooter>
    </Card>
  );
}
