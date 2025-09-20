import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

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
  async signUp({ email, password, name }: SignUpParams): Promise<CognitoUser> {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
        },
      });
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async confirmSignUp(email: string, code: string): Promise<string> {
    try {
      await Auth.confirmSignUp(email, code);
      return 'User confirmed successfully';
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  }

  async signIn({ email, password }: SignInParams): Promise<CognitoUser> {
    try {
      const user = await Auth.signIn(email, password);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const attributes = await Auth.userAttributes(user);
      
      const userData: User = {
        id: user.username,
        email: attributes.find(attr => attr.Name === 'email')?.Value || '',
        name: attributes.find(attr => attr.Name === 'name')?.Value || '',
      };
      
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentSession(): Promise<any> {
    try {
      const session = await Auth.currentSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  async resendConfirmationCode(email: string): Promise<void> {
    try {
      await Auth.resendSignUp(email);
    } catch (error) {
      console.error('Error resending confirmation code:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await Auth.forgotPassword(email);
    } catch (error) {
      console.error('Error initiating forgot password:', error);
      throw error;
    }
  }

  async forgotPasswordSubmit(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
