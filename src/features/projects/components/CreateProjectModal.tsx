import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { projectApi } from '../api';
import type { User } from '../types';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';


const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  collaborators: z.array(z.number()),
  repositories: z.array(z.number()),
  teams: z.array(z.number()),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProjectModal({ open, onOpenChange, onSuccess }: CreateProjectModalProps) {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuthStore();
  
  const [comboOpen, setComboOpen] = useState(false);

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      collaborators: [],
      repositories: [],
      teams: [],
    },
  });

  useEffect(() => {
    if (open) {
      projectApi.getUsers().then((fetchedUsers) => {
        const filtered = fetchedUsers.filter(u => u.id !== currentUser?.id);
        setActiveUsers(filtered);
      }).catch((err) => {
        console.error('Failed to fetch users', err);
      });
      form.reset();
    }
  }, [open, form, currentUser]);

  const onSubmit = async (values: CreateProjectValues) => {
    setIsLoading(true);
    try {
      await projectApi.createProject(values);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">Create New Project</DialogTitle>
          <DialogDescription className="text-[13px]">
            Add a new project to your workspace and assign team members.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Website Redesign" className="bg-secondary/30 border-border text-[13px]" {...field} />
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
                    <FormLabel className="text-[13px]">Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Briefly describe what this project is about..." className="bg-secondary/30 border-border text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collaborators"
                render={({ field }) => {
                   const selectedUsers = activeUsers.filter(u => field.value.includes(u.id));

                   return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[13px]">Collaborators</FormLabel>
                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={comboOpen}
                              className="w-full justify-between font-normal h-auto min-h-10 bg-secondary/30 border-border text-[13px]"
                            >
                               <div className="flex flex-wrap gap-1 items-center max-w-[85%]">
                                  {selectedUsers.length > 0 ? (
                                    selectedUsers.map(user => (
                                       <Badge key={user.id} variant="secondary" className="mr-1 mb-1 text-[11px]"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           field.onChange(field.value.filter(id => id !== user.id));
                                         }}
                                       >
                                          {user.username}
                                          <X className="ml-1 h-3 w-3 hover:text-destructive cursor-pointer" />
                                       </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground mr-auto text-[13px]">Select collaborators...</span>
                                  )}
                               </div>
                              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[450px] p-0 border-border" align="start">
                          <Command>
                            <CommandInput placeholder="Search user by username or email..." className="text-[13px]" />
                            <CommandEmpty className="text-[13px]">No user found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto w-full">
                              {activeUsers.map((user) => {
                                const isSelected = field.value.includes(user.id);
                                return (
                                  <CommandItem
                                    key={user.id}
                                    value={`${user.username} ${user.email}`}
                                    onSelect={() => {
                                      if (isSelected) {
                                        field.onChange(field.value.filter(id => id !== user.id));
                                      } else {
                                        field.onChange([...field.value, user.id]);
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        isSelected ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                       <span className="text-[13px]">{user.username}</span>
                                       <span className="text-[11px] text-muted-foreground">{user.email}</span>
                                    </div>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    <FormDescription className="text-[11px]">Search and select users to collaborate on this project. You are automatically set as the owner.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="text-[13px] border-border">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className={cn(
                  "text-[13px]",
                  "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
                  "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                  "transition-all duration-150"
                )}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
