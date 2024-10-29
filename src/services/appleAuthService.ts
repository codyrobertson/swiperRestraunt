import { AppleSignIn } from '@nativescript/apple-sign-in';

interface AppleAuthResponse {
  userId: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

export class AppleAuthService {
  static async signIn(): Promise<AppleAuthResponse> {
    try {
      const result = await AppleSignIn.signIn({
        scopes: ['email', 'fullName']
      });

      return {
        userId: result.user.id,
        email: result.user.email,
        fullName: {
          givenName: result.fullName?.givenName,
          familyName: result.fullName?.familyName
        }
      };
    } catch (error) {
      console.error('Apple Sign In failed:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<string | null> {
    try {
      const credentials = await AppleSignIn.getCredentialState();
      return credentials.userId;
    } catch {
      return null;
    }
  }
}