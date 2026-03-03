import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Team } from '../types';

interface TeamTableProps {
  teams: Team[];
  onTeamSelect: (team: Team) => void;
}

export function TeamTable({ teams, onTeamSelect }: TeamTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const query = searchQuery.toLowerCase();
      const descMatch = team.description ? team.description.toLowerCase().includes(query) : false;
      return team.name.toLowerCase().includes(query) || descMatch;
    });
  }, [teams, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-[13px] pl-8 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          {searchQuery && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
              className="h-8 px-2 text-muted-foreground text-[13px]"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="w-[300px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Team Name</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Owner ID</TableHead>
              <TableHead className="w-[100px] text-center text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Projects</TableHead>
              <TableHead className="w-[100px] text-center text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Members</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-[13px]">
                  No teams found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TableRow 
                  key={team.id} 
                  onClick={() => onTeamSelect(team)}
                  className="cursor-pointer border-border hover:bg-secondary/50 transition-colors duration-150 group relative"
                >
                  {/* Left accent bar */}
                  <td className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-[13px] font-medium">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[12px] font-mono px-4">
                    #{team.owner}
                  </TableCell>
                  <TableCell className="text-center px-4">
                    <span className="inline-flex items-center justify-center bg-secondary px-2 py-0.5 rounded-full text-[11px] font-medium">
                      {team.projects.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-center px-4">
                    <span className="inline-flex items-center justify-center bg-secondary px-2 py-0.5 rounded-full text-[11px] font-medium">
                      {team.collaborators.length + 1}
                    </span>
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
