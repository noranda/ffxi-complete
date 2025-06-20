import type {RealtimeChannel, Session} from '@supabase/supabase-js';
import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthResult} from '@/lib/auth';
import type {User} from '@/types';

// Mock the auth utilities first
vi.mock('@/lib/auth', () => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
  updatePassword: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
    },
  },
}));

import * as authUtils from '@/lib/auth';
import {supabase} from '@/lib/supabase';

import {useAuth, useIsAuthenticated} from '../useAuth';

// Get the mocked functions
const mockSignUp = vi.mocked(authUtils.signUp);
const mockSignIn = vi.mocked(authUtils.signIn);
const mockSignInWithOAuth = vi.mocked(authUtils.signInWithOAuth);
const mockSignOut = vi.mocked(authUtils.signOut);
const mockResetPassword = vi.mocked(authUtils.resetPassword);
const mockGetCurrentUser = vi.mocked(authUtils.getCurrentUser);
const mockOnAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange);

// Type-safe mock creators
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  confirmed_at: '2023-01-01T00:00:00Z',
  last_sign_in_at: '2023-01-01T00:00:00Z',
  ...overrides,
});

const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user,
});

const createMockSubscription = (): Partial<RealtimeChannel> => ({
  unsubscribe: vi.fn(),
});

describe('useAuth', () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock auth state change subscription
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: createMockSubscription(),
      },
    } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>);
  });

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      mockGetCurrentUser.mockResolvedValue(null);

      const {result} = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load current user on mount', async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      mockGetCurrentUser.mockRejectedValue(new Error('Auth error'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to initialize auth:',
        expect.any(Error)
      );
    });
  });

  describe('auth state changes', () => {
    it('should handle auth state changes via listener', async () => {
      mockGetCurrentUser.mockResolvedValue(null);

      const {result} = renderHook(() => useAuth());

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate auth state change callback
      const [callback] = mockOnAuthStateChange.mock.calls[0];
      const mockSession = createMockSession(mockUser);

      await act(async () => {
        callback('SIGNED_IN', mockSession);
      });

      // Wait for the state update to complete
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should clear user on sign out', async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser);

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Simulate sign out
      const [callback] = mockOnAuthStateChange.mock.calls[0];

      await act(async () => {
        callback('SIGNED_OUT', null);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('authentication methods', () => {
    it('should handle successful sign up', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockSignUp.mockResolvedValue({
        success: true,
        data: mockUser,
        error: null,
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult: AuthResult;
      await act(async () => {
        signUpResult = await result.current.signUp(
          'test@example.com',
          'password123'
        );
      });

      expect(signUpResult!.success).toBe(true);
      expect(signUpResult!.data).toEqual(mockUser);
      expect(result.current.error).toBeNull();
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });

    it('should handle sign up errors', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockSignUp.mockResolvedValue({
        success: false,
        data: null,
        error: 'Email already exists',
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult: AuthResult;
      await act(async () => {
        signUpResult = await result.current.signUp(
          'test@example.com',
          'password123'
        );
      });

      expect(signUpResult!.success).toBe(false);
      expect(signUpResult!.error).toBe('Email already exists');
      expect(result.current.error).toBe('Email already exists');
    });

    it('should handle successful sign in', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockSignIn.mockResolvedValue({
        success: true,
        data: mockUser,
        error: null,
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: AuthResult;
      await act(async () => {
        signInResult = await result.current.signIn(
          'test@example.com',
          'password123'
        );
      });

      expect(signInResult!.success).toBe(true);
      expect(signInResult!.data).toEqual(mockUser);
      expect(result.current.error).toBeNull();
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });

    it('should handle OAuth sign in', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockSignInWithOAuth.mockResolvedValue({
        success: true,
        error: null,
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let oauthResult: Omit<AuthResult, 'data'>;
      await act(async () => {
        oauthResult = await result.current.signInWithProvider('discord');
      });

      expect(oauthResult!.success).toBe(true);
      expect(mockSignInWithOAuth).toHaveBeenCalledWith('discord');
    });

    it('should handle sign out', async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser);
      mockSignOut.mockResolvedValue({
        success: true,
        error: null,
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      let signOutResult: Omit<AuthResult, 'data'>;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult!.success).toBe(true);
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle password reset', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockResetPassword.mockResolvedValue({
        success: true,
        error: null,
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let resetResult: Omit<AuthResult, 'data'>;
      await act(async () => {
        resetResult = await result.current.resetPassword('test@example.com');
      });

      expect(resetResult!.success).toBe(true);
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('utility methods', () => {
    it('should clear errors', async () => {
      mockGetCurrentUser.mockResolvedValue(null);
      mockSignIn.mockResolvedValue({
        success: false,
        data: null,
        error: 'Invalid credentials',
      });

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Create an error
      await act(async () => {
        await result.current.signIn('test@example.com', 'wrongpassword');
      });

      expect(result.current.error).toBe('Invalid credentials');

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should refresh auth state', async () => {
      mockGetCurrentUser.mockResolvedValueOnce(null);

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();

      // Mock updated user for refresh
      mockGetCurrentUser.mockResolvedValueOnce(mockUser);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(2);
    });

    it('should handle refresh errors', async () => {
      mockGetCurrentUser.mockResolvedValueOnce(null);

      const {result} = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Mock refresh error
      mockGetCurrentUser.mockRejectedValueOnce(new Error('Network error'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.error).toBe(
        'Failed to refresh authentication. Please try again.'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Failed to refresh auth state:',
        expect.any(Error)
      );
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from auth changes on unmount', () => {
      const mockUnsubscribe = vi.fn();
      const mockSubscription = createMockSubscription();
      mockSubscription.unsubscribe = mockUnsubscribe;

      mockOnAuthStateChange.mockReturnValue({
        data: {
          subscription: mockSubscription,
        },
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>);
      mockGetCurrentUser.mockResolvedValue(null);

      const {unmount} = renderHook(() => useAuth());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});

describe('useIsAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: createMockSubscription(),
      },
    } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>);
  });

  it('should return false when user is not authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const {result} = renderHook(() => useIsAuthenticated());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should return true when user is authenticated', async () => {
    const mockUser = createMockUser();

    mockGetCurrentUser.mockResolvedValue(mockUser);

    const {result} = renderHook(() => useIsAuthenticated());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
