

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: number;
  collaborators: number[];
  tasks_count?: number;
}
