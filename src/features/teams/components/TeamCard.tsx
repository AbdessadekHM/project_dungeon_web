import type { Team } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Folder, ShieldUser } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="rounded-lg border border-border bg-card hover:border-primary/30 transition-all duration-150 cursor-pointer overflow-hidden group relative flex flex-col h-full">
      {/* Left accent bar on hover */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="leading-tight text-[15px] font-semibold group-hover:text-primary transition-colors duration-150">{team.name}</CardTitle>
          <div className="h-9 w-9 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-1.5 text-muted-foreground text-[13px] leading-relaxed">{team.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 flex-1">
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <ShieldUser className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium text-foreground/80">Owner: #{team.owner}</span>
          </div>
          <div className="flex items-center gap-1">
            <Folder className="h-3.5 w-3.5" />
            <span>{team.projects.length} project{team.projects.length !== 1 && 's'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border bg-secondary/20 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {team.collaborators.length} Member{team.collaborators.length !== 1 && 's'}
          </div>
          <div className="flex -space-x-2.5">
            {team.collaborators.slice(0, 4).map((c, i) => (
              <Avatar key={c} className="h-7 w-7 ring-2 ring-card shadow-sm" style={{ zIndex: 9 - i }}>
                <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-medium">
                  U{c}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.collaborators.length > 4 && (
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-secondary border-2 border-card text-[10px] font-medium text-muted-foreground z-0 shadow-sm">
                +{team.collaborators.length - 4}
              </div>
            )}
            {team.collaborators.length === 0 && (
              <div className="text-[11px] text-muted-foreground italic">Empty</div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
