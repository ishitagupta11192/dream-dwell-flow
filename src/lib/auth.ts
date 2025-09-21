import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import hasAwsConfig from './aws-config';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

class AuthService {
  async signUp({ email, password, name }: SignUpParams): Promise<any> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      const { user } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async confirmSignUp(email: string, code: string): Promise<string> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      return 'User confirmed successfully';
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  }

  async signIn({ email, password }: SignInParams): Promise<any> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      const user = await signIn({ username: email, password });
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (!hasAwsConfig) {
      return; // No-op when AWS is not configured
    }
    
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!hasAwsConfig) {
      return null;
    }
    
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      const userData: User = {
        id: user.username,
        email: attributes.email || '',
        name: attributes.name || '',
      };
      
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentSession(): Promise<any> {
    if (!hasAwsConfig) {
      return null;
    }
    
    try {
      // In Amplify v6, session is handled differently
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!hasAwsConfig) {
      return false;
    }
    
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  async resendConfirmationCode(email: string): Promise<void> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      await resendSignUpCode({ username: email });
    } catch (error) {
      console.error('Error resending confirmation code:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      await resetPassword({ username: email });
    } catch (error) {
      console.error('Error initiating forgot password:', error);
      throw error;
    }
  }

  async forgotPasswordSubmit(email: string, code: string, newPassword: string): Promise<void> {
    if (!hasAwsConfig) {
      throw new Error('Authentication not available. AWS configuration required.');
    }
    
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
