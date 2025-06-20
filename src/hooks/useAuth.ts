import {useEffect, useState} from 'react';
import type {User} from '@supabase/supabase-js';

import type {AuthProvider, AuthResult} from '@/lib/auth';
import {
  getCurrentUser,
  resetPassword,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
  updatePassword,
} from '@/lib/auth';
import {supabase} from '@/lib/supabase';

/**
 * Authentication hook state and methods
 *
 * Provides complete authentication state management including:
 * - Current user session
 * - Loading states for all operations
 * - Error handling with user-friendly messages
 * - Convenient methods for all auth operations
 */
export type UseAuthReturn = {
  // Current state
  user: User | null;
  loading: boolean;
  error: string | null;

  // Authentication methods
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithProvider: (
    provider: AuthProvider
  ) => Promise<Omit<AuthResult, 'data'>>;
  signOut: () => Promise<Omit<AuthResult, 'data'>>;
  resetPassword: (email: string) => Promise<Omit<AuthResult, 'data'>>;
  updatePassword: (newPassword: string) => Promise<Omit<AuthResult, 'data'>>;

  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
};

/**
 * Authentication hook for the FFXI Progress Tracker
 *
 * This hook provides complete authentication state management including:
 * - Automatic session detection and refresh
 * - Real-time auth state changes via Supabase listeners
 * - Loading states for all operations
 * - Consistent error handling
 * - Convenient methods for all authentication operations
 *
 * @returns Object with current auth state and authentication methods
 *
 * @example
 * ```tsx
 * const {user, loading, signIn, signOut, error} = useAuth();
 *
 * const handleLogin = async (email: string, password: string) => {
 *   const result = await signIn(email, password);
 *   if (!result.success) {
 *     console.error('Login failed:', result.error);
 *   }
 * };
 *
 * if (loading) return <div>Loading...</div>;
 * if (user) return <div>Welcome, {user.email}</div>;
 * return <LoginForm onSubmit={handleLogin} />;
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  // Core authentication state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state on mount
  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('🔐 Auth state changed:', event, session?.user?.email);

      // Update user state based on session
      setUser(session?.user ?? null);
      setLoading(false);

      // Clear any existing errors on successful auth
      if (session?.user) {
        setError(null);
      }

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ User signed in successfully');
          break;
        case 'SIGNED_OUT':
          console.log('👋 User signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('🔄 Session token refreshed');
          break;
        case 'USER_UPDATED':
          console.log('👤 User profile updated');
          break;
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Authentication methods with consistent error handling and loading states
  const handleSignUp = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUp(email, password);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithProvider = async (
    provider: AuthProvider
  ): Promise<Omit<AuthResult, 'data'>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithOAuth(provider);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } finally {
      // Note: Loading state will be updated by auth state listener
      // when OAuth redirect completes
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<Omit<AuthResult, 'data'>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signOut();

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    email: string
  ): Promise<Omit<AuthResult, 'data'>> => {
    setError(null);

    const result = await resetPassword(email);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  const handleUpdatePassword = async (
    newPassword: string
  ): Promise<Omit<AuthResult, 'data'>> => {
    setError(null);

    const result = await updatePassword(newPassword);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  // Utility methods
  const clearError = (): void => {
    setError(null);
  };

  const refresh = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to refresh auth state:', err);
      setError('Failed to refresh authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Current state
    user,
    loading,
    error,

    // Authentication methods
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithProvider: handleSignInWithProvider,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,

    // Utility methods
    clearError,
    refresh,
  };
};

/**
 * Helper hook to check if user is authenticated
 *
 * @returns True if user is signed in, false otherwise
 *
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 *
 * if (isAuthenticated) {
 *   return <Dashboard />;
 * } else {
 *   return <LoginPage />;
 * }
 * ```
 */
export const useIsAuthenticated = (): boolean => {
  const {user} = useAuth();
  return !!user;
};
