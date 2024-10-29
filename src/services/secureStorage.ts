import { SecureStorage } from '@nativescript/core';

const secureStorage = new SecureStorage();

export const secureStorageService = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await secureStorage.setSync({
        key,
        value
      });
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const result = await secureStorage.getSync({
        key
      });
      return result.value;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await secureStorage.removeSync({
        key
      });
    } catch (error) {
      console.error('Error removing secure data:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await secureStorage.clearSync();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }
};