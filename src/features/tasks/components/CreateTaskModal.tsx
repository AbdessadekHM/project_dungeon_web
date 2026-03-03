import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { taskApi } from '../api';
import { teamApi } from '@/features/teams/api';
import type { User, Project } from '@/features/projects/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['todo', 'in_progress', 'finished']),
  priority: z.enum(['low', 'medium', 'high']),
  task_type: z.enum(['feature', 'bug', 'documentation', 'other']),
  deadline: z.string().min(1, 'Deadline is required'),
  assignee: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  project: Project;
}

export function CreateTaskModal({ open, onOpenChange, onSuccess, project }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignees, setAssignees] = useState<User[]>([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
      task_type: 'feature',
      deadline: new Date().toISOString().split('T')[0],
      assignee: 'unassigned' // 'unassigned' is a special value handled before submit
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      fetchAssignees();
    }
  }, [open, project.id]);

  const fetchAssignees = async () => {
    try {
      // 1. Fetch all users and all teams (since we don't have a specific endpoint for project's teams/users)
      const [allUsers, allTeams] = await Promise.all([
        teamApi.getUsers(),
        teamApi.getTeams()
      ]);

      // 2. Identify the direct collaborators
      const collaboratorIds = new Set(project.collaborators);
      
      // 3. Identify all teams associated with this project 
      // (a team has a projects array containing project IDs)
      const projectTeams = allTeams.filter(team => team.projects.includes(project.id));
      
      // 4. Add all members and owners from those teams to the collaborator set
      projectTeams.forEach(team => {
        collaboratorIds.add(team.owner);
        team.collaborators.forEach(id => collaboratorIds.add(id));
      });
      
      // 5. Always include the project owner as a possible assignee
      collaboratorIds.add(project.owner);

      // 6. Filter users down to just those IDs
      const relevantUsers = allUsers.filter(user => collaboratorIds.has(user.id));
      setAssignees(relevantUsers);
      
    } catch (error) {
      console.error('Failed to fetch assignees:', error);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        task_type: data.task_type,
        deadline: data.deadline,
        project: project.id,
        assignee: data.assignee && data.assignee !== 'unassigned' ? parseInt(data.assignee) : null
      };
      
      await taskApi.createTask(payload);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to {project.title}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      className="bg-background/50 resize-none h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="finished">Finished</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="task_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-background/50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={form.getValues().assignee}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned" className="italic text-muted-foreground">Unassigned</SelectItem>
                        {assignees.map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
