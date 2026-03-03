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
import { Search, Settings2, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/types';

interface ProjectTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export function ProjectTable({ projects, onProjectSelect }: ProjectTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const query = searchQuery.toLowerCase();
      return project.title.toLowerCase().includes(query) || 
             project.description.toLowerCase().includes(query);
    });
  }, [projects, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-8 bg-background/50 border-border/50"
            />
          </div>
          {searchQuery && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
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
              <TableHead className="w-[300px]">Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] text-center">Tasks</TableHead>
              <TableHead className="w-[100px] text-center">Members</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow 
                  key={project.id} 
                  onClick={() => onProjectSelect(project)}
                  className="cursor-pointer border-border/20 hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-primary" />
                      <span className="font-medium">{project.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-[400px]" title={project.description}>
                    {project.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                      {project.tasks_count || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                      {project.collaborators.length + 1}
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
