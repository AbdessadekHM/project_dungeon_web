import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { issuesApi } from '../api';
import { projectApi } from '@/features/projects/api';
import type { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  description: z.string().min(1, 'Description is required'),
  task: z.string().min(1, 'Please select a related task'),
});

type IssueFormValues = z.infer<typeof issueSchema>;

interface CreateIssueDialogProps {
  projectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueCreated: () => void;
}

export function CreateIssueDialog({ projectId, open, onOpenChange, onIssueCreated }: CreateIssueDialogProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      task: '',
    },
  });

  useEffect(() => {
    if (open) {
      // Fetch tasks for the project to populate the dropdown
      projectApi.getProjectTasks(projectId).then(setTasks).catch(console.error);
      form.reset();
    }
  }, [open, projectId, form]);

  const onSubmit = async (data: IssueFormValues) => {
    setIsLoading(true);
    try {
      await issuesApi.createIssue({
        title: data.title,
        description: data.description,
        status: 'open',
        task: parseInt(data.task, 10),
        project: projectId,
      });
      toast.success('Issue created successfully', {
        description: 'Your issue has been logged.',
      });
      onIssueCreated();
      onOpenChange(false);
    } catch {
      toast.error('Error', {
        description: 'Failed to create issue. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Report a problem or bug related to a specific task in this project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Login button not working" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Task</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="Describe the issue in detail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Issue'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
