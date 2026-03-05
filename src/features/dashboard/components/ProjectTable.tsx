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
import { Search, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/types';

interface ProjectTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

import { useTranslation } from 'react-i18next';

export function ProjectTable({ projects, onProjectSelect }: ProjectTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

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
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-[150px] lg:w-[250px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.filterProjects')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-[13px] pl-8 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
            />
          </div>
          {searchQuery && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
              className="h-8 px-2 text-muted-foreground text-[13px]"
            >
              {t('common.reset')}
            </Button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="w-[300px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2.5">{t('common.project')}</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2.5">{t('common.description')}</TableHead>
              <TableHead className="w-[100px] text-center text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2.5">{t('common.tasksColumn')}</TableHead>
              <TableHead className="w-[100px] text-center text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2.5">{t('common.membersColumn')}</TableHead>
              <TableHead className="w-[100px] text-center text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2.5">{t('common.statusColumn')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-[13px]">
                  {t('common.noProjectsFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => {
                const tasksCount = project.tasks_count || 0;
                // Dummy logic for table view status
                const percentage = tasksCount === 0 ? 0 : Math.round((Math.floor(tasksCount * 0.6) / tasksCount) * 100);
                const statusLabelKey = percentage >= 70 ? 'project.onTrack' : percentage >= 40 ? 'project.atRisk' : 'project.behind';
                const statusClass = percentage >= 70 ? 'status-on-track' : percentage >= 40 ? 'status-at-risk' : 'status-behind';
                
                return (
                  <TableRow 
                    key={project.id} 
                    onClick={() => onProjectSelect(project)}
                    className="cursor-pointer border-border hover:bg-secondary/30 transition-colors duration-200 group relative"
                  >
                    <TableCell className="px-4">
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                          <Folder className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-[13px] font-medium group-hover:text-primary transition-colors duration-200">{project.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground/80 text-[13px] truncate max-w-[400px] px-4" title={project.description}>
                      {project.description}
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <span className="inline-flex items-center justify-center bg-secondary px-2 py-0.5 rounded-full text-[11px] font-medium">
                        {tasksCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <span className="inline-flex items-center justify-center bg-secondary px-2 py-0.5 rounded-full text-[11px] font-medium">
                        {(project.collaborators_count !== undefined ? project.collaborators_count : (project.collaborators?.length || 0)) + 1}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
                        {t(statusLabelKey)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
