export class CookieUtils {
  static setCookie(name: string, value: string, days: number = 30): void {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
    document.cookie = cookieString;
  }

  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
  }

  static setRefreshToken(token: string): void {
    this.setCookie('refresh_token', token, 30);
  }

  static getRefreshToken(): string | null {
    return this.getCookie('refresh_token');
  }

  static clearRefreshToken(): void {
    this.deleteCookie('refresh_token');
  }
}