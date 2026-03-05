import type { Task } from '@/features/tasks/types';
export type { Task };

export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  role: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: number; 
  collaborators: number[]; 
  repositories: number[]; 
  teams: number[]; 
  tasks_count?: number; 
  collaborators_count?: number;
}

