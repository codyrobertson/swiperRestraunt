import { ApiResponse, ApiError } from '../types/api';

export async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<ApiResponse<T>> {
  const { timeout = 5000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      const error = new Error(response.statusText) as ApiError;
      error.status = response.status;
      error.code = 'API_ERROR';
      throw error;
    }

    const data = await response.json();
    return { data, error: null, loading: false };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
      loading: false,
    };
  }
}