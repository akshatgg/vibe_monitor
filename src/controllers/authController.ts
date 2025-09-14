import { tokenService } from '@/services/tokenService';
import { apiService } from '@/services/apiService';

interface GoogleAuthPayload {
  email: string;
  name: string;
  family_name?: string;
  picture: string;
  sub: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

export class AuthController {
  async handleGoogleSignIn(credentialString: string): Promise<AuthResult> {
    try {
      // Decode the JWT token to get user information
      const payload: GoogleAuthPayload = JSON.parse(
        atob(credentialString.split('.')[1])
      );

      // Prepare user data for FastAPI
      const userData = {
        // credential: credentialString,
        // google_token: credentialString,
        user_info: {
          email: payload.email,
          name: payload.name,
          last_name: payload.family_name || '',
          picture: payload.picture,
          uid: payload.sub
        }
      };

      // Send to FastAPI backend
      const response = await apiService.post('/api/auth/google', userData);

      if (response.status === 200 && response.data) {
        // Store tokens using cookie service
        tokenService.setTokens({
          access_token: (response.data as any).access_token,
          refresh_token: (response.data as any).refresh_token,
          expires_in: (response.data as any).expires_in || 3600
        });

        return {
          success: true,
          redirectUrl: '/workspace'
        };
      } else {
        return {
          success: false,
          error: response.error || 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: 'Failed to process authentication'
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiService.post('/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens locally
      tokenService.clearTokens();
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
      const response = await apiService.get('/api/auth/me');
      return response.status === 200;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }
}

export const authController = new AuthController();