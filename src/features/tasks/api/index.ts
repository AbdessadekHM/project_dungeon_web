import { apiClient } from '@/lib/axios';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

export const taskApi = {
  getTasks: async (projectId: string | number): Promise<Task[]> => {
    // We assume backend either filters by project, or we fetch all and filter client side
    // If backend doesn't support ?project=id we'll filter it ourselves
    const response = await apiClient.get<Task[]>('/management/tasks/');
    return response.data.filter(t => t.project.toString() === projectId.toString());
  },
  
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    const response = await apiClient.post<Task>('/management/tasks/', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskDTO): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/management/tasks/${id}/`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/management/tasks/${id}/`);
  }
};
