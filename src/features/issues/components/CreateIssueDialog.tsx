import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { issuesApi } from '@/features/issues/api';
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

import { useTranslation } from 'react-i18next';

export function CreateIssueDialog({ projectId, open, onOpenChange, onIssueCreated }: CreateIssueDialogProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const issueSchema = z.object({
    title: z.string().min(1, t('issues.titleRequired')).max(150),
    description: z.string().min(1, t('issues.descriptionRequired')),
    task: z.string().min(1, t('issues.taskRequired')),
  });

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
      toast.success(t('issues.successCreated'), {
        description: t('issues.successCreatedDesc'),
      });
      onIssueCreated();
      onOpenChange(false);
    } catch {
      toast.error(t('issues.errorTitle'), {
        description: t('issues.errorCreated'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('issues.reportTitle')}</DialogTitle>
          <DialogDescription>
            {t('issues.reportDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('issues.titlePlaceholder')} {...field} />
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
                  <FormLabel>{t('issues.relatedTask')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('issues.selectTask')} />
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
                  <FormLabel>{t('common.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('issues.describeDetail')}
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
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('issues.creating') : t('issues.saveIssue')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
