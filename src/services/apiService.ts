import { tokenService } from './tokenService';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = tokenService.getAccessToken();
      const headers = new Headers(options.headers);

      if (token && !tokenService.isTokenExpired()) {
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
          // Refresh failed, redirect to login
          tokenService.clearTokens();
          window.location.href = '/auth';
          return { error: 'Authentication failed', status: 401 };
        }
      }

      return { data, status: response.status };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error', status: 500 };
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const tokenData = await response.json();
        tokenService.setTokens(tokenData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();