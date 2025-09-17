import { getCookie, setCookie, deleteCookie } from 'cookies-next';

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
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000));

    setCookie(this.ACCESS_TOKEN_KEY, data.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt
    });

    setCookie(this.REFRESH_TOKEN_KEY, data.refresh_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    setCookie(this.EXPIRES_AT_KEY, expiresAt.getTime().toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt
    });
  }

  getAccessToken(): string | null {
    return getCookie(this.ACCESS_TOKEN_KEY) as string || null;
  }

  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_KEY) as string || null;
  }

  isTokenExpired(): boolean {
    const expiresAt = getCookie(this.EXPIRES_AT_KEY) as string;
    if (!expiresAt) return true;

    // Add 5 minute buffer before expiration
    const bufferTime = 5 * 60 * 1000;
    return Date.now() >= (parseInt(expiresAt) - bufferTime);
  }

  clearTokens(): void {
    deleteCookie(this.ACCESS_TOKEN_KEY);
    deleteCookie(this.REFRESH_TOKEN_KEY);
    deleteCookie(this.EXPIRES_AT_KEY);
  }

  hasValidToken(): boolean {
    const accessToken = this.getAccessToken();
    return !!(accessToken && !this.isTokenExpired());
  }
}

export const tokenService = new TokenService();