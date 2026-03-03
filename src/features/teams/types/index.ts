import type { Project, User } from '@/features/projects/types';

export interface Team {
  id: number;
  name: string;
  description: string;
  owner: number; 
  collaborators: number[]; 
  projects: number[]; 
}

export type { Project, User };
