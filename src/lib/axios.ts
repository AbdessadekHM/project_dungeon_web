import axios from 'axios';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Refresh (Basic implementation)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 Unauthorized and we haven't already tried retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { tokens, clearAuth } = useAuthStore.getState();

      if (tokens?.refresh) {
        try {
          // Attempt to get a new access token
          const refreshResponse = await axios.post(`${import.meta.env.VITE_API_URL}/account/token/refresh/`, {
            refresh: tokens.refresh,
          });

          // Update store with new access token
          useAuthStore.setState((state) => ({
            tokens: {
              ...state.tokens!,
              access: refreshResponse.data.access,
            },
          }));

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out the user
          clearAuth();
          return Promise.reject(refreshError);
        }
      } else {
         clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
