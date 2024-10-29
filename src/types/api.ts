export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface ApiError extends Error {
  code: string;
  status?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  preferences?: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface SessionState {
  id: string | null;
  participants: User[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}