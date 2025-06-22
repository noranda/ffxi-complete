/**
 * Unit tests for ProtectedRoute component
 *
 * RED PHASE: These tests are written FIRST to define the expected behavior
 * of the ProtectedRoute component before implementation.
 */

import type {User} from '@supabase/supabase-js';

import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '@/contexts/AuthContext';

import {AuthContext} from '@/contexts/AuthContext';

import {ProtectedRoute} from '../';

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth context helper
const createMockAuthContext = (
  overrides: Partial<AuthContextType> = {}
): AuthContextType => ({
  clearError: vi.fn(),
  error: null,
  isAuthenticated: false,
  loading: false,
  refresh: vi.fn(),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithProvider: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
  user: null,
  ...overrides,
});

// Test wrapper component with router and auth context
const TestWrapper: React.FC<{
  authContext?: Partial<AuthContextType>;
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({authContext = {}, children, initialEntries = ['/protected']}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AuthContext.Provider value={createMockAuthContext(authContext)}>
      {children}
    </AuthContext.Provider>
  </MemoryRouter>
);

// Test child component for protected route testing
const TestChild: React.FC<{testId?: string}> = ({
  testId = 'protected-content',
}) => <div data-testid={testId}>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Required Behavior', () => {
    it('should render children when user is authenticated', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not authenticated', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: false, loading: false}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        replace: true,
        state: {from: '/protected'},
      });
    });

    it('should not redirect while authentication is loading', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: false, loading: true}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner while authentication is loading', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: false, loading: true}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-route-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show custom loading component when provided', () => {
      const CustomLoader: React.FC = () => (
        <div data-testid="custom-loader">Loading...</div>
      );

      render(
        <TestWrapper authContext={{isAuthenticated: false, loading: true}}>
          <ProtectedRoute loadingComponent={<CustomLoader />}>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(
        screen.queryByTestId('protected-route-loading')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Custom Redirect Paths', () => {
    it('should redirect to custom login path when specified', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: false, loading: false}}>
          <ProtectedRoute redirectTo="/custom-login">
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/custom-login', {
        replace: true,
        state: {from: '/protected'},
      });
    });

    it('should preserve current location in state for post-login redirect', () => {
      render(
        <TestWrapper
          authContext={{isAuthenticated: false, loading: false}}
          initialEntries={['/dashboard/settings']}
        >
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        replace: true,
        state: {from: '/dashboard/settings'},
      });
    });
  });

  describe('Error Handling', () => {
    it('should still render children when authenticated despite auth errors', () => {
      render(
        <TestWrapper
          authContext={{
            error: 'Some auth error',
            isAuthenticated: true,
            loading: false,
          }}
        >
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect when not authenticated even with auth errors', () => {
      render(
        <TestWrapper
          authContext={{
            error: 'Authentication failed',
            isAuthenticated: false,
            loading: false,
          }}
        >
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        replace: true,
        state: {from: '/protected'},
      });
    });
  });

  describe('Component Composition', () => {
    it('should support multiple children', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <ProtectedRoute>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should support function as children pattern', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <ProtectedRoute>
            {() => <TestChild testId="function-child" />}
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('function-child')).toBeInTheDocument();
    });

    it('should pass authentication status to function children', () => {
      const mockFunctionChild = vi.fn(() => (
        <TestChild testId="auth-aware-child" />
      ));

      render(
        <TestWrapper authContext={{isAuthenticated: true, loading: false}}>
          <ProtectedRoute>{mockFunctionChild}</ProtectedRoute>
        </TestWrapper>
      );

      expect(mockFunctionChild).toHaveBeenCalledWith({
        isAuthenticated: true,
        loading: false,
      });
      expect(screen.getByTestId('auth-aware-child')).toBeInTheDocument();
    });
  });

  describe('Integration with AuthContext', () => {
    it('should work with all AuthContext states', () => {
      const user: User = {
        app_metadata: {},
        aud: 'authenticated',
        confirmation_sent_at: undefined,
        confirmed_at: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        factors: [],
        id: '123',
        identities: [],
        last_sign_in_at: '2023-01-01T00:00:00Z',
        phone: undefined,
        phone_confirmed_at: undefined,
        role: 'authenticated',
        updated_at: '2023-01-01T00:00:00Z',
        user_metadata: {},
      };

      render(
        <TestWrapper
          authContext={{
            error: null,
            isAuthenticated: true,
            loading: false,
            user,
          }}
        >
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should respond to authentication state changes', () => {
      const {rerender} = render(
        <TestWrapper authContext={{isAuthenticated: false, loading: false}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        replace: true,
        state: {from: '/protected'},
      });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      // Simulate user logging in
      rerender(
        <TestWrapper authContext={{isAuthenticated: true, loading: false}}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
