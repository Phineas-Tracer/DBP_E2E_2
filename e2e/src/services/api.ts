import axios, { type AxiosError } from 'axios';
import type { ApiErrorBody } from '../types/errorManagers';

export const TOKEN_KEY = 'uber_token';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRoute = window.location.pathname === '/login';
    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;
    if (data) {
      if (data.error) return data.error;
      const fieldMessages = Object.values(data).filter(Boolean) as string[];
      if (fieldMessages.length > 0) return fieldMessages.join(' · ');
    }
    if (err.message) return err.message;
  }
  return fallback;
}