import { useState, useEffect, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MDEditor from '@uiw/react-md-editor';
import { Loader2, Sparkles } from 'lucide-react';
import { taskApi } from '../api';
import { teamApi } from '@/features/teams/api';
import { adminApi } from '@/features/admin/api';
import type { User, Project } from '@/features/projects/types';
import { GoogleGenAI } from '@google/genai';

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

const genai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export function CreateTaskModal({ open, onOpenChange, onSuccess, project }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
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
      assignee: 'unassigned'
    },
  });

  const fetchAssignees = useCallback(async () => {
    try {
      const [allUsers, allTeams] = await Promise.all([
        adminApi.getUsers(), 
        teamApi.getTeams()
      ]);

      const collaboratorIds = new Set(project.collaborators);
      const projectTeams = allTeams.filter(team => 
        team.projects.includes(project.id) || project.teams?.includes(team.id)
      );
      
      projectTeams.forEach(team => {
        collaboratorIds.add(team.owner);
        team.collaborators.forEach(id => collaboratorIds.add(id));
      });
      
      collaboratorIds.add(project.owner);
      const relevantUsers = allUsers.filter(user => collaboratorIds.has(user.id));
      setAssignees(relevantUsers);
      
    } catch (error) {
      console.error('Failed to fetch assignees:', error);
    }
  }, [project.collaborators, project.id, project.owner]);

  useEffect(() => {
    if (open) {
      form.reset();
      fetchAssignees();
    }
  }, [open, form, fetchAssignees]);

  const enhanceDescription = async () => {
    const currentDescription = form.getValues('description');
    const title = form.getValues('title');
    if (!currentDescription.trim()) return;

    setIsEnhancing(true);
    try {
      const prompt = `You are a helpful project management assistant. Enhance the following task description to be clearer, more professional, and more actionable. Keep it concise but thorough. Use markdown formatting where appropriate.

Task Title: ${title || 'Untitled Task'}
Current Description:
${currentDescription}

Return only the enhanced description, no preamble or explanation.`;

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      });

      const enhanced = response.text;
      if (enhanced) {
        form.setValue('description', enhanced, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancing(false);
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">Create New Task</DialogTitle>
          <DialogDescription className="text-[13px]">
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
                  <FormLabel className="text-[13px]">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem data-color-mode="dark">
                  <FormLabel className="text-[13px]">Description</FormLabel>
                  <FormControl>
                    <div className="relative" data-color-mode="dark">
                      <MDEditor
                        value={field.value}
                        onChange={field.onChange}
                        preview="edit"
                        height={300}
                        visibleDragbar={false}
                        className="bg-background!"
                      />
                      <button
                        type="button"
                        onClick={enhanceDescription}
                        disabled={isEnhancing}
                        title="Enhance with AI"
                        className={cn(
                          "absolute bottom-3 right-3 z-10",
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          "bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg",
                          "hover:brightness-110 hover:shadow-[0_0_12px_rgba(129,140,248,0.5)]",
                          "transition-all duration-200",
                          "disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
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
                    <FormLabel className="text-[13px]">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/30 border-border text-[13px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border">
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
                    <FormLabel className="text-[13px]">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/30 border-border text-[13px]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border">
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
                    <FormLabel className="text-[13px]">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/30 border-border text-[13px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border">
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
                    <FormLabel className="text-[13px]">Deadline</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-secondary/30 border-border text-[13px]" 
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
                    <FormLabel className="text-[13px]">Assignee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={form.getValues().assignee}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/30 border-border text-[13px]">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border">
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
                className="text-[13px] border-border"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className={cn(
                  "min-w-[100px] text-[13px]",
                  "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
                  "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                  "transition-all duration-150"
                )}
              >
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

