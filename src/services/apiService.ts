import { tokenService } from './tokenService';
import { errorHandler } from '@/lib/errorHandler';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Check if token is expired or about to expire, and refresh if needed
      await this.ensureValidToken();

      const token = tokenService.getAccessToken();
      const headers = new Headers(options.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (response.status === 401 && token) {
        // Token might be expired, try refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          headers.set('Authorization', `Bearer ${tokenService.getAccessToken()}`);
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
          });
          const retryData = await retryResponse.json();
          return { data: retryData, status: retryResponse.status };
        } else {
          // Refresh failed, handle auth error properly
          errorHandler.handleAuthError('Token refresh failed', {
            customMessage: 'Your session has expired. Please log in again.',
            redirectToAuth: true
          });
          return { error: 'Authentication failed', status: 401 };
        }
      }

      return { data, status: response.status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      errorHandler.handleNetworkError(errorMessage, {
        customMessage: 'Failed to connect to server. Please check your internet connection.'
      });
      return { error: errorMessage, status: 500 };
    }
  }

  private async ensureValidToken(): Promise<void> {
    const hasValidToken = tokenService.hasValidToken();
    const refreshToken = tokenService.getRefreshToken();

    if (!hasValidToken && refreshToken) {
      // Token is expired or about to expire, refresh it
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        // Refresh failed, handle auth error properly
        errorHandler.handleAuthError('Token validation failed', {
          customMessage: 'Session expired. Redirecting to login...',
          redirectToAuth: true
        });
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const params = new URLSearchParams({
        refresh_token: refreshToken
      });

      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const tokenData = await response.json();
        tokenService.setTokens({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || refreshToken,
          expires_in: tokenData.expires_in 
        });
        return true;
      }

      // Handle non-200 responses from refresh endpoint
      const errorMessage = `Token refresh failed with status ${response.status}`;
      errorHandler.handleAuthError(errorMessage, {
        customMessage: 'Unable to refresh your session. Please log in again.',
        showAlert: false // Don't show alert here as it will be handled by the caller
      });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh network error';
      errorHandler.handleNetworkError(errorMessage, {
        customMessage: 'Network error during token refresh. Please try again.',
        showAlert: false // Don't show alert here as it will be handled by the caller
      });
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // User-specific API methods
  async getUserProfile(): Promise<ApiResponse<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>> {
    return this.get('/api/v1/auth/me');
  }
}

export const apiService = new ApiService();