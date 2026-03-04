import { apiClient } from '@/lib/axios';
import type { User } from '@/features/projects/types';

export const adminApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/account/users/');
    return response.data;
  },

  createUser: async (data: Record<string, unknown>): Promise<User> => {
    // Explicitly use the registration endpoint without changing the current user's token
    const response = await apiClient.post('/account/register/', data);
    return response.data;
  }
};
