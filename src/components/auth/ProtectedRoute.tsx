/**
 * Route guard component that ensures only authenticated users can access protected content.
 * Automatically redirects unauthenticated users to login while preserving their intended destination.
 * Supports both standard children and function-as-children patterns for flexible auth-aware rendering.
 */

import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {useAuth} from '@/contexts/AuthContext';

import type {ProtectedRouteAuthState} from './types';

/**
 * Props for the ProtectedRoute component
 */
export type ProtectedRouteProps = {
  /** Child components to render when authenticated */
  children: ((authState: ProtectedRouteAuthState) => React.ReactNode) | React.ReactNode;
  /** Custom loading component to show while authenticating */
  loadingComponent?: React.ReactNode;
  /** Custom redirect path for unauthenticated users (defaults to /login) */
  redirectTo?: string;
};

/**
 * Default loading component with spinner for protected route authentication checks.
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center" data-testid="protected-route-loading">
      <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />

      <div className="text-muted-foreground mt-2 text-sm">Checking authentication...</div>
    </div>
  </div>
);

/**
 * Protected Route component that guards authenticated areas and handles auth state transitions.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, loadingComponent, redirectTo = '/login'}) => {
  const {isAuthenticated, loading} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================
  // Redirect Logic for Unauthenticated Users
  // ============================================================
  useEffect(() => {
    // Only redirect when auth check is complete (not loading) and user is not authenticated
    if (!loading && !isAuthenticated) {
      void navigate(redirectTo, {
        // Use replace to avoid creating back button loops
        replace: true,
        // Preserve original destination for post-login redirect
        state: {from: location.pathname},
      });
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location.pathname]);

  // ============================================================
  // Render Logic - Three States
  // ============================================================

  // State 1: Loading - Show spinner while auth status is being determined
  if (loading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // State 2: Unauthenticated - Return null while redirect is processing
  // This prevents flash of protected content during navigation
  if (!isAuthenticated) {
    return null;
  }

  // State 3: Authenticated - Render children with optional auth state injection

  // Function-as-children pattern: inject auth state for components that need it
  if (typeof children === 'function') {
    return (
      <>
        {(children as (authState: ProtectedRouteAuthState) => React.ReactNode)({
          isAuthenticated,
          loading,
        })}
      </>
    );
  }

  // Standard children pattern: render components directly
  return <>{children as React.ReactNode}</>;
};
