

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
  owner: number; // User ID
  collaborators: number[]; // User IDs
  repositories: number[]; // Repo IDs
  teams: number[]; // Team IDs
  tasks_count?: number; // Added for UI display
}
