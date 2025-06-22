import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthResult} from '@/lib/auth';

import {getCurrentUser, resetPassword, signIn, signInWithOAuth, signOut, signUp, updatePassword} from '@/lib/auth';
import {supabase} from '@/lib/supabase';

import {AuthProvider, useAuth, useIsAuthenticated} from '../AuthContext';

// Mock the auth functions
vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
}));

// Mock Supabase with proper types
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            callback: vi.fn(),
            id: 'test-subscription-id',
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  },
}));

const mockUser = {
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00Z',
  email: 'test@example.com',
  id: 'test-user-id',
  role: 'authenticated',
  user_metadata: {},
} as const;

// Test wrapper component
const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => <AuthProvider>{children}</AuthProvider>;
describe('AuthContext', () => {
  const mockUnsubscribe = vi.fn();
  const mockOnAuthStateChange = vi.fn().mockReturnValue({
    data: {
      subscription: {
        callback: vi.fn(),
        id: 'test-subscription-id',
        unsubscribe: mockUnsubscribe,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(mockOnAuthStateChange);
    vi.mocked(getCurrentUser).mockResolvedValue(null);
  });

  afterEach(() => vi.clearAllMocks());

  describe('AuthProvider', () => {
    it('should initialize with loading state', async () => {
      const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);

      // Wait for the initial auth check to complete to avoid act warnings
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    it('should load current user on initialization', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      vi.mocked(getCurrentUser).mockRejectedValue(new Error('Initialization failed'));

      const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should set up auth state change listener', async () => {
      renderHook(() => useAuth(), {wrapper: TestWrapper});

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(expect.any(Function));

      // Wait for initial loading to complete to avoid act warnings
      await waitFor(() => expect(mockOnAuthStateChange).toHaveBeenCalled());
    });

    it('should handle auth state changes', async () => {
      let authStateCallback: (event: string, session: null | {user: typeof mockUser}) => void;

      const mockImplementation = vi.fn().mockImplementation(callback => {
        authStateCallback = callback as typeof authStateCallback;
        return {
          data: {
            subscription: {
              callback: vi.fn(),
              id: 'test-subscription-id',
              unsubscribe: mockUnsubscribe,
            },
          },
        };
      });

      vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(mockImplementation);

      const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      // Wait for initial load
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Simulate sign in event
      act(() => authStateCallback('SIGNED_IN', {user: mockUser}));

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clean up subscription on unmount', async () => {
      const {unmount} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      // Wait for initial auth check to complete
      await waitFor(() => expect(mockOnAuthStateChange).toHaveBeenCalled());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });

    describe('authentication methods', () => {
      it('should handle sign up', async () => {
        const mockResult: AuthResult = {
          data: mockUser,
          error: null,
          success: true,
        };
        vi.mocked(signUp).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let signUpResult: AuthResult;
        await act(async () => (signUpResult = await result.current.signUp('test@example.com', 'password')));

        expect(signUp).toHaveBeenCalledWith('test@example.com', 'password');
        expect(signUpResult!).toEqual(mockResult);
      });

      it('should handle sign up errors', async () => {
        const mockResult: AuthResult = {
          data: null,
          error: 'Sign up failed',
          success: false,
        };
        vi.mocked(signUp).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => await result.current.signUp('test@example.com', 'password'));

        expect(result.current.error).toBe('Sign up failed');
      });

      it('should handle sign in', async () => {
        const mockResult: AuthResult = {
          data: mockUser,
          error: null,
          success: true,
        };
        vi.mocked(signIn).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let signInResult: AuthResult;
        await act(async () => (signInResult = await result.current.signIn('test@example.com', 'password')));

        expect(signIn).toHaveBeenCalledWith('test@example.com', 'password');
        expect(signInResult!).toEqual(mockResult);
      });

      it('should handle OAuth sign in', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: null,
          success: true,
        };
        vi.mocked(signInWithOAuth).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let oauthResult: Omit<AuthResult, 'data'>;
        await act(async () => (oauthResult = await result.current.signInWithProvider('google')));

        expect(signInWithOAuth).toHaveBeenCalledWith('google');
        expect(oauthResult!).toEqual(mockResult);
      });

      it('should handle sign out', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: null,
          success: true,
        };
        vi.mocked(signOut).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let signOutResult: Omit<AuthResult, 'data'>;
        await act(async () => (signOutResult = await result.current.signOut()));

        expect(signOut).toHaveBeenCalled();
        expect(signOutResult!).toEqual(mockResult);
      });

      it('should handle sign out errors', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: 'Sign out failed',
          success: false,
        };
        vi.mocked(signOut).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => await result.current.signOut());

        expect(result.current.error).toBe('Sign out failed');
      });

      it('should clear error state before sign out', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: null,
          success: true,
        };
        vi.mocked(signOut).mockResolvedValue(mockResult);

        // First set an error via failed sign in
        const signInError: AuthResult = {
          data: null,
          error: 'Sign in failed',
          success: false,
        };
        vi.mocked(signIn).mockResolvedValue(signInError);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Trigger an error first
        await act(async () => await result.current.signIn('test@example.com', 'wrongpassword'));
        expect(result.current.error).toBe('Sign in failed');

        // Sign out should clear the error
        await act(async () => await result.current.signOut());

        expect(result.current.error).toBe(null);
      });

      it('should handle password reset', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: null,
          success: true,
        };
        vi.mocked(resetPassword).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let resetResult: Omit<AuthResult, 'data'>;
        await act(async () => (resetResult = await result.current.resetPassword('test@example.com')));

        expect(resetPassword).toHaveBeenCalledWith('test@example.com');
        expect(resetResult!).toEqual(mockResult);
      });

      it('should handle password update', async () => {
        const mockResult: Omit<AuthResult, 'data'> = {
          error: null,
          success: true,
        };
        vi.mocked(updatePassword).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        let updateResult: Omit<AuthResult, 'data'>;
        await act(async () => (updateResult = await result.current.updatePassword('newpassword')));

        expect(updatePassword).toHaveBeenCalledWith('newpassword');
        expect(updateResult!).toEqual(mockResult);
      });
    });

    describe('utility methods', () => {
      it('should clear error', async () => {
        // First set an error
        const mockResult: AuthResult = {
          data: null,
          error: 'Test error',
          success: false,
        };
        vi.mocked(signIn).mockResolvedValue(mockResult);

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Trigger an error
        await act(async () => await result.current.signIn('test@example.com', 'password'));

        expect(result.current.error).toBe('Test error');

        // Clear the error
        act(() => result.current.clearError());

        expect(result.current.error).toBe(null);
      });

      it('should refresh auth state', async () => {
        vi.mocked(getCurrentUser)
          .mockResolvedValueOnce(null) // Initial load
          .mockResolvedValueOnce(mockUser); // Refresh call

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.user).toBe(null);

        await act(async () => await result.current.refresh());

        expect(result.current.user).toEqual(mockUser);
        expect(getCurrentUser).toHaveBeenCalledTimes(2);
      });

      it('should handle refresh errors', async () => {
        vi.mocked(getCurrentUser)
          .mockResolvedValueOnce(null) // Initial load
          .mockRejectedValueOnce(new Error('Refresh failed')); // Refresh call

        const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => await result.current.refresh());

        expect(result.current.error).toBe('Failed to refresh authentication. Please try again.');
      });
    });
  });

  describe('useIsAuthenticated hook', () => {
    it('should return false when user is not authenticated', async () => {
      const {result} = renderHook(() => useIsAuthenticated(), {
        wrapper: TestWrapper,
      });

      // Wait for auth initialization to complete
      await waitFor(() => expect(result.current).toBe(false));
    });

    it('should return true when user is authenticated', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const {result} = renderHook(() => useIsAuthenticated(), {
        wrapper: TestWrapper,
      });

      // Wait for auth initialization to complete
      await waitFor(() => expect(result.current).toBe(true));
    });

    it('should throw error when used outside AuthProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useIsAuthenticated())).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });
  });
});
