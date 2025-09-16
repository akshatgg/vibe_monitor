interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'token_expires_at';

  setTokens(data: TokenData): void {
    const expiresAt = Date.now() + (data.expires_in * 1000);

    localStorage.setItem(this.ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;

    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) return true;

    // Add 5 minute buffer before expiration
    const bufferTime = 5 * 60 * 1000;
    return Date.now() >= (parseInt(expiresAt) - bufferTime);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  hasValidToken(): boolean {
    const accessToken = this.getAccessToken();
    return !!(accessToken && !this.isTokenExpired());
  }
}

export const tokenService = new TokenService();