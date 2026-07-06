import { api } from './api';
import type { Trip } from '../types/trips';
import type { CreateTripPayload, RateTripPayload } from '../types/errorManagers';

export const tripService = {
  async createTrip(payload: CreateTripPayload): Promise<Trip> {
    const { data } = await api.post<Trip>('/trips', payload);
    return data;
  },

  async getMyTrips(): Promise<Trip[]> {
    const { data } = await api.get<Trip[]>('/trips');
    return data;
  },

  async getMyDriverTrips(): Promise<Trip[]> {
    const { data } = await api.get<Trip[]>('/trips/my');
    return data;
  },

  async getPendingTrips(): Promise<Trip[]> {
    const { data } = await api.get<Trip[]>('/trips/pending');
    return data;
  },

  async getTripById(id: number): Promise<Trip> {
    const { data } = await api.get<Trip>(`/trips/${id}`);
    return data;
  },

  async acceptTrip(id: number): Promise<Trip> {
    const { data } = await api.patch<Trip>(`/trips/${id}/accept`);
    return data;
  },

  async completeTrip(id: number): Promise<Trip> {
    const { data } = await api.patch<Trip>(`/trips/${id}/complete`);
    return data;
  },

  async rateTrip(id: number, payload: RateTripPayload): Promise<Trip> {
    const { data } = await api.post<Trip>(`/trips/${id}/rate`, payload);
    return data;
  },
};