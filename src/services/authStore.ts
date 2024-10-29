import { secureStorageService } from './secureStorage';
import { User, AuthState } from '../types/api';

const AUTH_KEY = 'auth_user';

class AuthStore {
  private static instance: AuthStore;
  private currentUser: User | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();

  private constructor() {
    this.initializeFromStorage();
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      const userData = await secureStorageService.getItem(AUTH_KEY);
      if (userData) {
        this.currentUser = JSON.parse(userData);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
    }
  }

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  async setUser(user: User): Promise<void> {
    this.currentUser = user;
    try {
      await secureStorageService.setItem(AUTH_KEY, JSON.stringify(user));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getUserId(): string {
    return this.currentUser?.id || '';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Anonymous User';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  async clear(): Promise<void> {
    this.currentUser = null;
    try {
      await secureStorageService.removeItem(AUTH_KEY);
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  private getState(): AuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.currentUser,
      loading: false,
      error: null
    };
  }
}

export const authStore = AuthStore.getInstance();