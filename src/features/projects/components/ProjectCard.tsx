import type { Project } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Users, Folder } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="leading-tight text-xl">{project.title}</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Folder className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
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
      <CardFooter className="pt-4 border-t border-border/50">
        <div className="flex -space-x-2">
          {/* Mock Avatars */}
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">ME</AvatarFallback>
          </Avatar>
          {project.collaborators.map((c, i) => (
            <Avatar key={c} className="h-8 w-8 border-2 border-background hidden sm:block">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                U{i+1}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
