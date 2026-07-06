import { api } from './api';
import type { User } from '../types/user';

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async getAvailableDrivers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/drivers/available');
    return data;
  },
};