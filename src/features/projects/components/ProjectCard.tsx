import type { Project } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Users, Folder } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-ambient-hover hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="leading-tight text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
            <Folder className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2 text-muted-foreground text-sm leading-relaxed">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-status-progress-text" />
            <span>{project.tasks_count || 0} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.collaborators.length + 1} members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-border/30 bg-muted/10">
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-3">
            {/* Mock Avatars */}
            <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm z-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">ME</AvatarFallback>
            </Avatar>
            {project.collaborators.slice(0, 3).map((c, i) => (
              <Avatar key={c} className="h-8 w-8 ring-2 ring-background shadow-sm" style={{ zIndex: 9 - i }}>
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                  U{i+1}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.collaborators.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-[10px] font-medium text-muted-foreground z-0">
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
