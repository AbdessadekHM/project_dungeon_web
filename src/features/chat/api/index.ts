import { apiClient } from '@/lib/axios';

export interface ChatMessage {
  id: number;
  project: number;
  sender: number;
  sender_username: string;
  content: string;
  created_at: string;
}

export const chatApi = {
  getMessages: async (projectId: number | string): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`/management/messages/?project=${projectId}`);
    return response.data;
  },
};
