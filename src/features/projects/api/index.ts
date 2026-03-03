import { apiClient } from '@/lib/axios';
import type { Project, User } from '../types';

export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/management/projects/');
    return response.data;
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post('/management/projects/', data);
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/account/users/');
    return response.data;
  },
};
