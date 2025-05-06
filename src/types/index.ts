export type Priority = 1 | 2 | 3 | 4;

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  projectId: string | null;
  sectionId: string | null;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  labels: string[];
}

export interface Section {
  id: string;
  name: string;
  projectId: string;
  order: number;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
  sections: Section[];
  tasks: Task[];  // Tasks not assigned to a section
}

export interface ViewType {
  type: 'inbox' | 'today' | 'upcoming' | 'project';
  projectId?: string;
}
