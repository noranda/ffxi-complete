import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '@/contexts/AuthContext';

import {AuthContext} from '@/contexts/AuthContext';

import {Register} from '../Register';

// Mock the RegisterForm component
vi.mock('@/components/auth/RegisterForm', () => ({
  RegisterForm: ({onSuccess, onSwitchToLogin}: {onSuccess?: () => void; onSwitchToLogin?: () => void}) => (
    <div data-testid="register-form">
      <button data-testid="success-button" onClick={onSuccess}>
        Trigger Success
      </button>

      <button data-testid="switch-button" onClick={onSwitchToLogin}>
        Switch to Login
      </button>
    </div>
  ),
}));

// Mock auth context for testing
const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
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

// Test wrapper component
const TestWrapper: React.FC<{
  authContext?: Partial<AuthContextType>;
  children: React.ReactNode;
}> = ({authContext = {}, children}) => (
  <AuthContext.Provider value={createMockAuthContext(authContext)}>{children}</AuthContext.Provider>
);
describe('Register', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Rendering', () => {
    it('renders registration page with centered layout', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();

      // Check that the page has proper layout classes
      const pageContainer = screen.getByTestId('register-form').closest('[class*="min-h-screen"]');
      expect(pageContainer).toBeInTheDocument();
    });

    it('renders RegisterForm component', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });

    it('has responsive padding and centering', () => {
      const {container} = render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');

      const innerDiv = outerDiv.querySelector('[class*="max-w-md"]');
      expect(innerDiv).toBeInTheDocument();
    });
  });

  describe('Authentication State Handling', () => {
    it('renders normally when user is not authenticated', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: false}}>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });

    it('calls onRegistrationSuccess when user is already authenticated', () => {
      const onRegistrationSuccess = vi.fn();

      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <Register onRegistrationSuccess={onRegistrationSuccess} />
        </TestWrapper>
      );

      expect(onRegistrationSuccess).toHaveBeenCalledOnce();
    });

    it('does not render form when user is authenticated and has success callback', () => {
      const onRegistrationSuccess = vi.fn();

      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <Register onRegistrationSuccess={onRegistrationSuccess} />
        </TestWrapper>
      );

      expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    });

    it('renders form when user is authenticated but no success callback provided', () => {
      render(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });
  });

  describe('Callback Props', () => {
    it('passes onSuccess callback to RegisterForm', () => {
      const onRegistrationSuccess = vi.fn();

      render(
        <TestWrapper>
          <Register onRegistrationSuccess={onRegistrationSuccess} />
        </TestWrapper>
      );

      // The mock RegisterForm should receive and be able to call the callback
      expect(screen.getByTestId('success-button')).toBeInTheDocument();
    });

    it('passes onSwitchToLogin callback to RegisterForm', () => {
      const onSwitchToLogin = vi.fn();

      render(
        <TestWrapper>
          <Register onSwitchToLogin={onSwitchToLogin} />
        </TestWrapper>
      );

      // The mock RegisterForm should receive and be able to call the callback
      expect(screen.getByTestId('switch-button')).toBeInTheDocument();
    });

    it('handles missing callback props gracefully', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();

      // Should not throw when callbacks are undefined
      expect(() => {
        screen.getByTestId('success-button').click();
        screen.getByTestId('switch-button').click();
      }).not.toThrow();
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct CSS classes for full-height centered layout', () => {
      const {container} = render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const outerContainer = container.firstChild as HTMLElement;
      expect(outerContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-background');
    });

    it('applies responsive padding classes', () => {
      const {container} = render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const outerContainer = container.firstChild as HTMLElement;
      expect(outerContainer).toHaveClass('px-4', 'py-12', 'sm:px-6', 'lg:px-8');
    });

    it('constrains form width appropriately', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      const formContainer = screen.getByTestId('register-form').parentElement;
      expect(formContainer).toHaveClass('w-full', 'max-w-md');
    });
  });

  describe('Integration', () => {
    it('works with all props provided', () => {
      const onRegistrationSuccess = vi.fn();
      const onSwitchToLogin = vi.fn();

      render(
        <TestWrapper>
          <Register onRegistrationSuccess={onRegistrationSuccess} onSwitchToLogin={onSwitchToLogin} />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByTestId('success-button')).toBeInTheDocument();
      expect(screen.getByTestId('switch-button')).toBeInTheDocument();
    });

    it('handles auth state changes appropriately', () => {
      const onRegistrationSuccess = vi.fn();

      const {rerender} = render(
        <TestWrapper authContext={{isAuthenticated: false}}>
          <Register onRegistrationSuccess={onRegistrationSuccess} />
        </TestWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(onRegistrationSuccess).not.toHaveBeenCalled();

      // Simulate user becoming authenticated
      rerender(
        <TestWrapper authContext={{isAuthenticated: true}}>
          <Register onRegistrationSuccess={onRegistrationSuccess} />
        </TestWrapper>
      );

      expect(onRegistrationSuccess).toHaveBeenCalledOnce();
      expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    });
  });
});
