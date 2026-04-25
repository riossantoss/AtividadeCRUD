export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>;
export type UpdateTaskDTO = Partial<CreateTaskDTO> & { completed?: boolean };
