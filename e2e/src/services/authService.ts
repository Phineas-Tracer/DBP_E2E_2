import { api } from './api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/errorManagers';

export const authService = {
  async register(payload: RegisterPayload): Promise<string> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data.token;
  },

  async login(payload: LoginPayload): Promise<string> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data.token;
  },
};