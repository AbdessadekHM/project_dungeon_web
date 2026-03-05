import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { issuesApi } from '../api';
import { projectApi } from '@/features/projects/api';
import type { Issue } from '../types';
import type { Task } from '@/features/tasks/types';
import { CreateIssueDialog } from '../components/CreateIssueDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Plus, 
  Search, 
  MoreVertical,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export function Issues() {
  const { selectedProject } = useAppStore();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedProject?.id) return;
    setLoading(true);
    try {
      const [issuesData, tasksData] = await Promise.all([
        issuesApi.getIssuesByProject(selectedProject.id),
        projectApi.getProjectTasks(selectedProject.id)
      ]);
      setIssues(issuesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteIssue = async (id: number) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    try {
      await issuesApi.deleteIssue(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete issue:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'open' | 'resolved' | 'closed') => {
    try {
      await issuesApi.updateIssueStatus(id, status);
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [issues, searchQuery]);

  // Lookup task title efficiently
  const getTaskTitle = (taskId: number) => {
    return tasks.find(t => t.id === taskId)?.title || 'Unknown Task';
  };

  if (!selectedProject) return null;

  return (
    <div className="h-full flex flex-col pt-3">
      {/* Header */}
      <div className="flex-none px-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight truncate">Issues</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-md px-2 py-0.5 font-medium shrink-0">
              {issues.length}
            </Badge>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="shrink-0 h-9 px-4 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 px-6 py-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Filters/Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background border-border"
              />
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading issues...</div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Bug className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No issues found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px] mx-auto">
                {searchQuery ? "No issues match your search criteria." : "There are no issues reported for this project yet."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Report First Issue
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="group relative bg-card border border-border hover:border-primary/30 rounded-xl p-5 shadow-sm transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="text-base font-semibold text-foreground truncate">{issue.title}</h3>
                        <Badge 
                          variant={issue.status === 'resolved' ? 'default' : issue.status === 'closed' ? 'secondary' : 'destructive'}
                          className="capitalize text-[10px] px-2 py-0 h-5"
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {issue.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{getTaskTitle(issue.task)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Reported on {format(new Date(issue.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(issue.id, 'open')}>Mark as Open</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(issue.id, 'resolved')}>Mark as Resolved</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(issue.id, 'closed')}>Mark as Closed</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Issue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateIssueDialog 
        projectId={selectedProject.id}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onIssueCreated={fetchData}
      />
    </div>
  );
}
