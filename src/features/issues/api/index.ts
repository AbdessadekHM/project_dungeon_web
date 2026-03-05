import apiClient from '@/lib/axios';
import type { Issue } from '../types';

export const issuesApi = {
  getIssuesByProject: async (projectId: number): Promise<Issue[]> => {
    const response = await apiClient.get<Issue[]>('/management/issues/', {
      params: { project: projectId }
    });
    return response.data;
  },

  createIssue: async (data: Omit<Issue, 'id' | 'created_by' | 'created_at'>): Promise<Issue> => {
    const response = await apiClient.post<Issue>('/management/issues/', data);
    return response.data;
  },

  updateIssueStatus: async (issueId: number, status: 'open' | 'resolved' | 'closed'): Promise<Issue> => {
    const response = await apiClient.patch<Issue>(`/management/issues/${issueId}/`, { status });
    return response.data;
  },

  deleteIssue: async (issueId: number): Promise<void> => {
    await apiClient.delete(`/management/issues/${issueId}/`);
  }
};
