export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'finished';
  priority: 'low' | 'medium' | 'high';
  task_type: 'feature' | 'bug' | 'documentation' | 'other';
  project: number; // Project ID
  assignee: number | null; // User ID
  deadline: string; // Date string YYYY-MM-DD
}

export type CreateTaskDTO = Omit<Task, 'id'>;
export type UpdateTaskDTO = Partial<CreateTaskDTO>;
