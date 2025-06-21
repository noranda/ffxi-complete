/**
 * Authentication Context for FFXI Complete
 *
 * Provides centralized authentication state management across the entire application.
 * This context manages user sessions, loading states, and authentication operations
 * in a single place to ensure consistency and prevent multiple auth listeners.
 */

import {createContext, useContext, useEffect, useState} from 'react';
import type {User} from '@supabase/supabase-js';

import type {AuthProvider as AuthProviderType, AuthResult} from '@/lib/auth';
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
 * Authentication context type definition
 *
 * Defines the shape of authentication state and methods available
 * throughout the application via the AuthContext.
 */
export type AuthContextType = {
  // Authentication state
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Authentication methods
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithProvider: (
    provider: AuthProviderType
  ) => Promise<Omit<AuthResult, 'data'>>;
  signOut: () => Promise<Omit<AuthResult, 'data'>>;
  resetPassword: (email: string) => Promise<Omit<AuthResult, 'data'>>;
  updatePassword: (newPassword: string) => Promise<Omit<AuthResult, 'data'>>;

  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
};

/**
 * Authentication context
 *
 * React context that provides authentication state and methods to all
 * child components. Should be consumed via the useAuth hook.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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
 *
 * @param children - Child components that will have access to auth context
 *
 * @example
 * ```tsx
 * // In App.tsx or main.tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  // Core authentication state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const isAuthenticated = !!user;

  // Initialize authentication state and set up listeners
  useEffect(() => {
    let isMounted = true;

    // Initialize auth state from current session
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      console.log('🔐 Auth state changed:', event, session?.user?.email);

      // Update user state based on session
      setUser(session?.user ?? null);
      setLoading(false);

      // Clear errors on successful authentication
      if (session?.user) {
        setError(null);
      }

      // Handle specific auth events for logging and potential side effects
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
        case 'PASSWORD_RECOVERY':
          console.log('🔑 Password recovery initiated');
          break;
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Authentication method implementations with consistent error handling

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
    provider: AuthProviderType
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
      // Note: Loading state will be updated by the auth state listener
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

  // Context value
  const contextValue: AuthContextType = {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Methods
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithProvider: handleSignInWithProvider,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,

    // Utilities
    clearError,
    refresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to consume authentication context
 *
 * Provides access to authentication state and methods from the AuthContext.
 * Must be used within an AuthProvider component tree.
 *
 * @returns Authentication context value with state and methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {user, loading, signIn, signOut, error} = useAuth();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (user) return <div>Welcome, {user.email}</div>;
 *   return <LoginForm onSubmit={signIn} />;
 * };
 * ```
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
 *
 * @returns True if user is authenticated, false otherwise
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const ProtectedComponent = () => {
 *   const isAuthenticated = useIsAuthenticated();
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" replace />;
 *   }
 *
 *   return <Dashboard />;
 * };
 * ```
 */
export const useIsAuthenticated = (): boolean => {
  const {isAuthenticated} = useAuth();
  return isAuthenticated;
};
