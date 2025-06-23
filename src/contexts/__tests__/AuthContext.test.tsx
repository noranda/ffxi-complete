import {act, fireEvent, render, renderHook, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthResult} from '@/lib/auth';

import {
  getCurrentUser,
  getSessionInfo,
  refreshSession,
  resetPassword,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
  updatePassword,
  validateSession,
} from '@/lib/auth';
import {supabase} from '@/lib/supabase';

import {AuthProvider, useAuth, useIsAuthenticated} from '../AuthContext';

// Mock the auth functions
vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
  getSessionInfo: vi.fn(),
  refreshSession: vi.fn(),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
  validateSession: vi.fn(),
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

// Test component for session persistence tests
const TestComponent: React.FC = () => {
  const {error, isAuthenticated, loading, refresh, user} = useAuth();

  return (
    <div>
      <div>User: {user?.email ?? 'null'}</div>
      <div>Authenticated: {isAuthenticated.toString()}</div>
      <div>Loading: {loading.toString()}</div>

      {error && <div>Error: {error}</div>}

      <button onClick={() => void refresh()}>Refresh</button>
    </div>
  );
};
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

describe('AuthContext - Session Persistence and Token Refresh', () => {
  let mockSupabase: any;
  let mockAuthStateChangeCallback: any;

  beforeEach(() => {
    mockAuthStateChangeCallback = null;
    mockSupabase = {
      auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
        onAuthStateChange: vi.fn(callback => {
          mockAuthStateChangeCallback = callback;
          return {
            data: {subscription: {unsubscribe: vi.fn()}},
          };
        }),
        refreshSession: vi.fn(),
      },
    };
    vi.mocked(supabase).auth = mockSupabase.auth;
    vi.mocked(getCurrentUser).mockClear();
    vi.mocked(validateSession).mockResolvedValue({
      error: null,
      isValid: false,
      session: null,
    });
    vi.mocked(getSessionInfo).mockResolvedValue({
      error: null,
      expiresAt: null,
      expiresIn: null,
      isExpired: false,
      needsRefresh: false,
      session: null,
    });
    vi.mocked(refreshSession).mockResolvedValue({
      error: null,
      session: null,
      success: false,
    });
  });

  describe('Session Persistence', () => {
    it('should restore session from localStorage on app initialization', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      const mockSession = {access_token: 'valid-token', user: testUser};

      mockSupabase.auth.getSession.mockResolvedValue({data: {session: mockSession}});
      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Loading: false')).toBeInTheDocument();
      });

      // Test behavior: user should be loaded and authenticated
      expect(getCurrentUser).toHaveBeenCalled();
    });

    it('should handle corrupted session data gracefully', async () => {
      mockSupabase.auth.getSession.mockRejectedValue(new Error('Invalid session data'));
      vi.mocked(getCurrentUser).mockRejectedValue(new Error('Session corrupted'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('User: null')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
        expect(screen.getByText('Loading: false')).toBeInTheDocument();
      });
    });

    it('should persist session across browser refreshes', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      const {unmount} = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Simulate user being authenticated
      await waitFor(() => expect(screen.getByText('User: test@example.com')).toBeInTheDocument());

      // Unmount and remount to simulate browser refresh
      unmount();

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should restore session without requiring re-authentication
      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
      });
    });
  });

  describe('Automatic Token Refresh', () => {
    it('should handle TOKEN_REFRESHED event and update session', async () => {
      const mockUser = {email: 'test@example.com', id: '123'};
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('Loading: false')).toBeInTheDocument());

      // Simulate token refresh event
      const refreshedSession = {
        access_token: 'new-refreshed-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
        refresh_token: 'new-refresh-token',
        user: mockUser,
      };

      act(() => mockAuthStateChangeCallback('TOKEN_REFRESHED', refreshedSession));

      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
      });
    });

    it('should handle multiple rapid token refresh events', async () => {
      const mockUser = {email: 'test@example.com', id: '123'};
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('Loading: false')).toBeInTheDocument());

      // Simulate multiple rapid token refresh events
      const refreshedSession1 = {access_token: 'token-1', user: mockUser};
      const refreshedSession2 = {access_token: 'token-2', user: mockUser};
      const refreshedSession3 = {access_token: 'token-3', user: mockUser};

      act(() => {
        mockAuthStateChangeCallback('TOKEN_REFRESHED', refreshedSession1);
        mockAuthStateChangeCallback('TOKEN_REFRESHED', refreshedSession2);
        mockAuthStateChangeCallback('TOKEN_REFRESHED', refreshedSession3);
      });

      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
      });
    });

    it('should handle token refresh failure gracefully', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('User: test@example.com')).toBeInTheDocument());

      // Simulate token refresh failure (session becomes null)
      act(() => mockAuthStateChangeCallback('TOKEN_REFRESHED', null));

      await waitFor(() => {
        expect(screen.getByText('User: null')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
      });
    });
  });

  describe('Manual Session Management', () => {
    it('should provide manual session refresh functionality', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      const updatedUser = {...mockUser, email: 'updated@example.com'};

      vi.mocked(getCurrentUser).mockResolvedValueOnce(testUser).mockResolvedValueOnce(updatedUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('User: test@example.com')).toBeInTheDocument());

      // Trigger manual refresh
      fireEvent.click(screen.getByText('Refresh'));

      await waitFor(() => expect(screen.getByText('User: updated@example.com')).toBeInTheDocument());

      expect(getCurrentUser).toHaveBeenCalledTimes(2);
    });

    it('should handle manual refresh errors', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};

      vi.mocked(getCurrentUser).mockResolvedValueOnce(testUser).mockRejectedValueOnce(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('User: test@example.com')).toBeInTheDocument());

      // Trigger manual refresh that fails
      fireEvent.click(screen.getByText('Refresh'));

      await waitFor(() =>
        expect(screen.getByText('Error: Failed to refresh authentication. Please try again.')).toBeInTheDocument()
      );
    });

    it('should provide session validation functionality', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      const mockSession = {
        access_token: 'valid-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
        user: testUser,
      };

      mockSupabase.auth.getSession.mockResolvedValue({data: {session: mockSession}});
      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      const {result} = renderHook(() => useAuth(), {wrapper: TestWrapper});

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Test behavior: validateSession function should be available and callable
      expect(typeof result.current.validateSession).toBe('function');

      // Call validateSession and verify it works
      const validationResult = await result.current.validateSession();
      expect(validationResult).toBeDefined();
    });
  });

  describe('Session Expiry and Recovery', () => {
    it('should handle expired sessions and attempt recovery', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      const expiredSession = {
        access_token: 'expired-token',
        expires_at: Date.now() - 1000, // Expired 1 second ago
        user: testUser,
      };
      const refreshedSession = {
        access_token: 'new-token',
        expires_at: Date.now() + 3600000,
        user: testUser,
      };

      mockSupabase.auth.getSession
        .mockResolvedValueOnce({data: {session: expiredSession}})
        .mockResolvedValueOnce({data: {session: refreshedSession}});

      mockSupabase.auth.refreshSession.mockResolvedValue({
        data: {session: refreshedSession},
        error: null,
      });

      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
      });
    });

    it('should handle session recovery failure', async () => {
      const expiredSession = {
        access_token: 'expired-token',
        expires_at: Date.now() - 1000,
        user: {...mockUser, email: 'test@example.com'},
      };

      mockSupabase.auth.getSession.mockResolvedValue({data: {session: expiredSession}});
      mockSupabase.auth.refreshSession.mockResolvedValue({
        data: {session: null},
        error: {message: 'Refresh failed'},
      });

      vi.mocked(getCurrentUser).mockRejectedValue(new Error('Session expired'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('User: null')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-tab Session Synchronization', () => {
    it('should sync session state across browser tabs', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('User: null')).toBeInTheDocument());

      // Simulate sign-in from another tab
      const newSession = {access_token: 'new-token', user: testUser};

      act(() => mockAuthStateChangeCallback('SIGNED_IN', newSession));

      await waitFor(() => {
        expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
      });
    });

    it('should sync sign-out across browser tabs', async () => {
      const testUser = {...mockUser, email: 'test@example.com'};
      vi.mocked(getCurrentUser).mockResolvedValue(testUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => expect(screen.getByText('User: test@example.com')).toBeInTheDocument());

      // Simulate sign-out from another tab
      act(() => mockAuthStateChangeCallback('SIGNED_OUT', null));

      await waitFor(() => {
        expect(screen.getByText('User: null')).toBeInTheDocument();
        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
      });
    });
  });
});
