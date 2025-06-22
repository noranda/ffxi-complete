import type {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Session,
  UserResponse,
} from '@supabase/supabase-js';

import {beforeEach, describe, expect, it, vi} from 'vitest';

import type {User} from '@/types';

// Mock the Supabase client first
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

import {
  getCurrentUser,
  isValidEmail,
  resetPassword,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
  updatePassword,
  validatePassword,
} from '../auth';
import {supabase} from '../supabase';

// Get the mocked auth methods
const mockAuth = vi.mocked(supabase.auth);

// Type-safe mock creators
const createMockUser = (overrides: Partial<User> = {}): User => ({
  app_metadata: {},
  aud: 'authenticated',
  confirmed_at: '2023-01-01T00:00:00Z',
  created_at: '2023-01-01T00:00:00Z',
  email: 'test@example.com',
  id: '123',
  identities: [],
  last_sign_in_at: '2023-01-01T00:00:00Z',
  role: 'authenticated',
  updated_at: '2023-01-01T00:00:00Z',
  user_metadata: {},
  ...overrides,
});

// Type-safe mock session creator
const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  expires_at: Date.now() + 3600000,
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  user,
});

// Simple mock auth error creator using partial type
const createMockAuthError = (message: string): Partial<AuthError> => ({
  message,
  name: 'AuthError',
  status: 400,
});

describe('Authentication Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console methods to avoid test output noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('signUp', () => {
    it('should return user data on successful signup', async () => {
      const mockUser = createMockUser();
      const mockResponse: AuthResponse = {
        data: {session: null, user: mockUser},
        error: null,
      };
      mockAuth.signUp.mockResolvedValue(mockResponse);

      const result = await signUp('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return error message on signup failure', async () => {
      const mockResponse: AuthResponse = {
        data: {session: null, user: null},
        error: createMockAuthError('User already registered') as AuthError,
      };
      mockAuth.signUp.mockResolvedValue(mockResponse);

      const result = await signUp('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('An account with this email already exists. Please sign in instead.');
    });

    it('should handle unexpected errors', async () => {
      mockAuth.signUp.mockRejectedValue(new Error('Network error'));

      const result = await signUp('test@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('An unexpected error occurred during signup');
    });
  });

  describe('signIn', () => {
    it('should return user data on successful login', async () => {
      const mockUser = createMockUser();
      const mockSession = createMockSession(mockUser);
      const mockResponse: AuthTokenResponsePassword = {
        data: {session: mockSession, user: mockUser},
        error: null,
      };
      mockAuth.signInWithPassword.mockResolvedValue(mockResponse);

      const result = await signIn('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return error message on login failure', async () => {
      const mockResponse: AuthTokenResponsePassword = {
        data: {session: null, user: null},
        error: createMockAuthError('Invalid login credentials') as AuthError,
      };
      mockAuth.signInWithPassword.mockResolvedValue(mockResponse);

      const result = await signIn('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Invalid email or password. Please check your credentials.');
    });
  });

  describe('signInWithOAuth', () => {
    it('should initiate OAuth flow successfully', async () => {
      const mockResponse: OAuthResponse = {
        data: {provider: 'discord', url: 'https://oauth.url'},
        error: null,
      };
      mockAuth.signInWithOAuth.mockResolvedValue(mockResponse);

      const result = await signInWithOAuth('discord');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
        provider: 'discord',
      });
    });

    it('should handle OAuth errors', async () => {
      const mockResponse: OAuthResponse = {
        data: {provider: 'google', url: null},
        error: createMockAuthError('OAuth provider not configured') as AuthError,
      };
      mockAuth.signInWithOAuth.mockResolvedValue(mockResponse);

      const result = await signInWithOAuth('google');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed. Please try again.');
    });
  });

  describe('resetPassword', () => {
    it('should send reset email successfully', async () => {
      const mockResponse = {
        data: {},
        error: null,
      };
      mockAuth.resetPasswordForEmail.mockResolvedValue(mockResponse);

      const result = await resetPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: 'http://localhost:3000/auth/reset-password',
      });
    });

    it('should handle reset password errors', async () => {
      const mockResponse = {
        data: null,
        error: createMockAuthError('Email rate limit exceeded') as AuthError,
      };
      mockAuth.resetPasswordForEmail.mockResolvedValue(mockResponse);

      const result = await resetPassword('test@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Too many email requests. Please wait a few minutes before trying again.');
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const mockUser = createMockUser();
      const mockResponse: UserResponse = {
        data: {user: mockUser},
        error: null,
      };
      mockAuth.updateUser.mockResolvedValue(mockResponse);

      const result = await updatePassword('newPassword123');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockAuth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123',
      });
    });

    it('should handle password update errors', async () => {
      // Use a more flexible mock structure for error cases
      const mockResponse: UserResponse = {
        data: {user: null},
        error: createMockAuthError('Password should be at least 6 characters') as AuthError,
      };
      mockAuth.updateUser.mockResolvedValue(mockResponse);

      const result = await updatePassword('123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters long.');
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockAuth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should handle signout errors', async () => {
      mockAuth.signOut.mockResolvedValue({
        error: createMockAuthError('Token has expired or is invalid') as AuthError,
      });

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Your session has expired. Please sign in again.');
    });

    it('should handle network errors during signout', async () => {
      mockAuth.signOut.mockRejectedValue(new Error('Network error'));

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('An unexpected error occurred during signout');
      expect(console.error).toHaveBeenCalledWith('Unexpected signout error:', expect.any(Error));
    });

    it('should handle generic auth errors', async () => {
      mockAuth.signOut.mockResolvedValue({
        error: createMockAuthError('Unknown error') as AuthError,
      });

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed. Please try again.');
    });

    it('should call supabase signOut without parameters', async () => {
      mockAuth.signOut.mockResolvedValue({
        error: null,
      });

      await signOut();

      expect(mockAuth.signOut).toHaveBeenCalledWith();
      expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = createMockUser();
      const mockResponse: UserResponse = {
        data: {user: mockUser},
        error: null,
      };
      mockAuth.getUser.mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAuth.getUser).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      // Use a flexible mock structure for null user case
      const mockResponse = {
        data: {user: null},
        error: null,
      } as unknown as UserResponse;
      mockAuth.getUser.mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockAuth.getUser.mockRejectedValue(new Error('Network error'));

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error getting current user:', expect.any(Error));
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('firstname.lastname@company.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test.example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123');

      expect(result.isValid).toBe(true);
      expect(result.requirements).toHaveLength(0);
      expect(result.strength).toBeGreaterThan(2);
    });

    it('should identify weak passwords and provide requirements', () => {
      const result = validatePassword('weak');

      expect(result.isValid).toBe(false);
      expect(result.requirements).toContain('at least 6 characters');
      expect(result.requirements).toContain('one uppercase letter');
      expect(result.requirements).toContain('one number');
      expect(result.strength).toBeLessThan(3);
    });

    it('should handle minimum length passwords', () => {
      const result = validatePassword('Pass1!');

      expect(result.isValid).toBe(true);
      expect(result.requirements).toHaveLength(0);
    });

    it('should calculate password strength accurately', () => {
      // Weak password
      expect(validatePassword('abc').strength).toBe(1);

      // Medium password (6 chars, upper, lower, number = 3 points)
      expect(validatePassword('Abc123').strength).toBe(3);

      // Strong password
      expect(validatePassword('VeryStrong123!').strength).toBe(4);
    });
  });
});
