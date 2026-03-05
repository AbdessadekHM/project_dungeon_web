export interface Issue {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'resolved' | 'closed';
  task: number;
  project: number;
  created_by: number;
  created_at: string;
}
