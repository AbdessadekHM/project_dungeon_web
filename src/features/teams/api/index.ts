import { apiClient } from '@/lib/axios';
import type { Team, User, Project } from '../types';

export const teamApi = {
  getTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get('/management/teams/');
    return response.data;
  },

  getTeam: async (id: number): Promise<Team> => {
    const response = await apiClient.get(`/management/teams/${id}/`);
    return response.data;
  },

  createTeam: async (data: Partial<Team>): Promise<Team> => {
    const response = await apiClient.post('/management/teams/', data);
    return response.data;
  },

  updateTeam: async (id: number, data: Partial<Team>): Promise<Team> => {
    const response = await apiClient.patch(`/management/teams/${id}/`, data);
    return response.data;
  },

  deleteTeam: async (id: number): Promise<void> => {
    await apiClient.delete(`/management/teams/${id}/`);
  },

  // Helpers to get expanded data since Django sends IDs
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/account/users/');
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/management/projects/');
    return response.data;
  }
};
