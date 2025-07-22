
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'To Do' | 'In Progress' | 'Complete';
  order: number;
  user_id?: string;
  project_id?: string | null;
  candidate_id?: string | null;
  created_at?: string;
  updated_at?: string;
  timestamp?: string;
}
