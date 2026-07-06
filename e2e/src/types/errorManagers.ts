import type { Role } from './user';

export interface AuthResponse {
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateTripPayload {
  pickupAddress: string;
  dropoffAddress: string;
}

export interface RateTripPayload {
  rating: number;
  comment?: string;
}

export interface ApiErrorBody {
  error?: string;
  [field: string]: string | undefined;
}