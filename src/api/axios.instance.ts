import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const apiClient = axios.create({
  timeout: 15000,
  baseURL:
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const session = useAuthStore.getState();
      if (session.token && error.config?.headers.Authorization === `Bearer ${session.token}`) {
        session.clearSession();
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error('Error de red'),
    );
  },
);
