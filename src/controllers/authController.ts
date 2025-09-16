import { tokenService } from '@/services/tokenService';
import { apiService } from '@/services/apiService';

interface AuthResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

export class AuthController {
  async handleGoogleSignIn(authorizationCode: string): Promise<AuthResult> {
    try {
      // Send authorization code to FastAPI backend
      const userData = {
        authorization_code: authorizationCode,
        redirect_uri: `${window.location.origin}/auth/google/callback`
      };
      console.log('Exchanging authorization code for real Google tokens:', userData);

      // Exchange authorization code for real Google tokens directly
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}/auth/google/callback`
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code for tokens');
      }

      const tokenData = await tokenResponse.json();
      console.log('Received real Google tokens:', tokenData);

      // Store real Google tokens with Google's expiry time
      tokenService.setTokens({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in
      });

      console.log('Real Google tokens stored in localStorage');

      // Later: Send user info to FastAPI backend (commented for testing)
      // const response = await apiService.post('/api/v1/auth/google', userData);

      // if (response.status === 200 && response.data) {
      //   // Store tokens using localStorage
      //   tokenService.setTokens({
      //     access_token: (response.data as any).access_token,
      //     refresh_token: (response.data as any).refresh_token,
      //     expires_in: (response.data as any).expires_in || 3600
      //   });
    
      return {
        success: true,
        redirectUrl: '/workspace'
      };
      // else {
      //   return {
      //     success: false,
      //     error: response.error || 'Authentication failed'
      //   };
      // }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: 'Failed to process authentication'
      };
    }
  }

  async handleGoogleCallback(): Promise<AuthResult> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      // const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        return {
          success: false,
          error: `OAuth error: ${error}`
        };
      }

      if (!code) {
        return {
          success: false,
          error: 'No authorization code received'
        };
      }

      // Clean up stored state (optional validation)
      // const storedState = localStorage.getItem('oauth_state');
      localStorage.removeItem('oauth_state');

     
      if (process.env.NODE_ENV === 'development') {
        // console.log('OAuth state validation:', { received: state, stored: storedState });
      }

      // Exchange authorization code for tokens
      return await this.handleGoogleSignIn(code);
    } catch (error) {
      console.error('Google callback error:', error);
      return {
        success: false,
        error: 'Failed to process callback'
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiService.post('/api/v1/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens locally
      tokenService.clearTokens();
      // Redirect to auth page
      window.location.href = '/auth';
    }
  }

  isAuthenticated(): boolean {
    return tokenService.hasValidToken();
  }

  async checkAuthStatus(): Promise<boolean> {
    if (!tokenService.hasValidToken()) {
      return false;
    }

    try {
      const response = await apiService.get('/api/v1/auth/me');
      return response.status === 200;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }
}

export const authController = new AuthController();