import type { Team } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Folder, ShieldUser } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-ambient-hover hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="leading-tight text-2xl font-bold group-hover:text-primary transition-colors">{team.name}</CardTitle>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2 text-muted-foreground text-sm leading-relaxed">{team.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
            <ShieldUser className="h-4 w-4 text-primary/70" />
            <span className="font-medium text-foreground/80">Owner: #{team.owner}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Folder className="h-4 w-4" />
            <span>{team.projects.length} project{team.projects.length !== 1 && 's'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/30 bg-muted/10 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {team.collaborators.length} Member{team.collaborators.length !== 1 && 's'}
          </div>
          <div className="flex -space-x-3">
            {team.collaborators.slice(0, 4).map((c, i) => (
              <Avatar key={c} className="h-8 w-8 ring-2 ring-background shadow-sm" style={{ zIndex: 9 - i }}>
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                  U{c}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.collaborators.length > 4 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-[10px] font-medium text-muted-foreground z-0 shadow-sm">
                +{team.collaborators.length - 4}
              </div>
            )}
            {team.collaborators.length === 0 && (
              <div className="text-xs text-muted-foreground italic mr-2">Empty</div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
