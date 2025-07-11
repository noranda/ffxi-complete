/**
 * Authentication Context for FFXI Complete
 *
 * Provides centralized authentication state management across the entire application.
 * This context manages user sessions, loading states, and authentication operations
 * in a single place to ensure consistency and prevent multiple auth listeners.
 */

import type {User} from '@supabase/supabase-js';

import {createContext, useContext, useEffect, useState} from 'react';

import type {
  AuthProvider as AuthProviderType,
  AuthResult,
  SessionInfoResult,
  SessionRefreshResult,
  SessionValidationResult,
} from '@/lib/auth';

import {
  getCurrentUser,
  getSessionInfo,
  refreshSession as refreshSessionManually,
  resetPassword,
  signIn,
  signInWithOAuth,
  signOut,
  signUp,
  updatePassword,
  updateProfile,
  validateSession,
} from '@/lib/auth';
import {supabase} from '@/lib/supabase';

/**
 * Authentication context type definition
 *
 * Defines the shape of authentication state and methods available
 * throughout the application via the AuthContext.
 */
export type AuthContextType = {
  clearError: () => void;
  error: null | string;
  getSessionInfo: () => Promise<SessionInfoResult>;
  isAuthenticated: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  refreshSession: () => Promise<SessionRefreshResult>;
  resetPassword: (email: string) => Promise<AuthResult<null>>;
  signIn: (email: string, password: string) => Promise<AuthResult<User>>;
  signInWithProvider: (provider: AuthProviderType) => Promise<AuthResult<User>>;
  signOut: () => Promise<AuthResult<null>>;
  signUp: (email: string, password: string) => Promise<AuthResult<User>>;
  updatePassword: (newPassword: string) => Promise<AuthResult<null>>;
  updateProfile: (profileData: {display_name?: string; full_name?: string}) => Promise<AuthResult<User>>;
  user: null | User;
  validateSession: () => Promise<SessionValidationResult>;
};

/**
 * Authentication context
 *
 * React context that provides authentication state and methods to all
 * child components. Should be consumed via the useAuth hook.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for the AuthProvider component
 */
type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Authentication Provider Component
 *
 * Manages authentication state for the entire application and provides
 * it to all child components via React Context. Should wrap the root
 * App component to ensure authentication state is available everywhere.
 *
 * Features:
 * - Automatic session detection and restoration
 * - Real-time auth state synchronization
 * - Centralized loading and error state management
 * - Single Supabase auth listener for the entire app
 * - Session persistence and refresh handling
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  // Core authentication state
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // Derived state
  const isAuthenticated = !!user;

  // Initialize authentication state and set up listeners
  useEffect(() => {
    let isMounted = true;

    /**
     * Initializes authentication state from current Supabase session
     */
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

    // Start initialization
    void initializeAuth();

    // Set up Supabase auth state listener
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted) return;

      // Update user state based on session
      setUser(session?.user ?? null);
      setLoading(false);

      // Clear errors on successful authentication
      if (session?.user) {
        setError(null);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Authentication method implementations with consistent error handling

  /**
   * Handles user registration with email and password including loading and error state management
   */
  const handleSignUp = async (email: string, password: string): Promise<AuthResult<User>> => {
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

  /**
   * Handles user sign-in with email and password authentication including state management
   */
  const handleSignIn = async (email: string, password: string): Promise<AuthResult<User>> => {
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

  /**
   * Handles OAuth authentication with external providers including redirect handling
   */
  const handleSignInWithProvider = async (provider: AuthProviderType): Promise<AuthResult<User>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithOAuth(provider);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } finally {
      // Note: Loading state will be updated by the auth state listener
      // when OAuth redirect completes
      setLoading(false);
    }
  };

  /**
   * Handles user sign-out and clears authentication state
   *
   * Performs complete session cleanup including:
   * - Terminating Supabase session on server
   * - Clearing local authentication state
   * - Resetting error and loading states
   * - Triggering auth state change listeners
   */
  const handleSignOut = async (): Promise<AuthResult<null>> => {
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

  /**
   * Handles password reset request for user email addresses
   */
  const handleResetPassword = async (email: string): Promise<AuthResult<null>> => {
    setError(null);

    const result = await resetPassword(email);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  /**
   * Handles password update for authenticated users
   */
  const handleUpdatePassword = async (newPassword: string): Promise<AuthResult<null>> => {
    setError(null);

    const result = await updatePassword(newPassword);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  /**
   * Handles profile metadata update for authenticated users
   */
  const handleUpdateProfile = async (profileData: {
    display_name?: string;
    full_name?: string;
  }): Promise<AuthResult<User>> => {
    setError(null);

    const result = await updateProfile(profileData);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  // Enhanced utility methods with session management

  /**
   * Validates the current session
   */
  const handleValidateSession = async (): Promise<SessionValidationResult> => await validateSession();

  /**
   * Manually refresh the current session
   */
  const handleRefreshSession = async (): Promise<SessionRefreshResult> => {
    setError(null);

    const result = await refreshSessionManually();

    if (!result.success && result.error) {
      setError(result.error);
    }

    return result;
  };

  /**
   * Get detailed session information
   */
  const handleGetSessionInfo = async (): Promise<SessionInfoResult> => await getSessionInfo();

  // Utility methods

  /**
   * Clears any authentication error state
   */
  const clearError = () => setError(null);

  /**
   * Refreshes the current authentication state from Supabase
   */
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

  // Context value
  const contextValue: AuthContextType = {
    clearError,
    error,
    getSessionInfo: handleGetSessionInfo,
    isAuthenticated,
    loading,
    refresh,
    refreshSession: handleRefreshSession,
    resetPassword: handleResetPassword,
    signIn: handleSignIn,
    signInWithProvider: handleSignInWithProvider,
    signOut: handleSignOut,
    signUp: handleSignUp,
    updatePassword: handleUpdatePassword,
    updateProfile: handleUpdateProfile,
    user,
    validateSession: handleValidateSession,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume authentication context
 *
 * Provides access to authentication state and methods from the AuthContext.
 * Must be used within an AuthProvider component tree.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * Helper hook to check authentication status
 *
 * Convenience hook that returns only the authentication status
 * from the auth context. Useful when you only need to check
 * if a user is logged in.
 */
export const useIsAuthenticated = (): boolean => {
  const {isAuthenticated} = useAuth();
  return isAuthenticated;
};
