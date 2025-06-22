/**
 * Unit tests for Login page component
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '@/contexts/AuthContext';

import {AuthContext} from '@/contexts/AuthContext';

import {Login} from '../Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

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

// Test wrapper component
const TestWrapper: React.FC<{
  authContext: AuthContextType;
  children: React.ReactNode;
}> = ({authContext, children}) => (
  <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
);
describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login page with branding and form', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('FFXI Complete')).toBeInTheDocument();
      expect(
        screen.getByText('Track your Final Fantasy XI progress')
      ).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Sign In'})).toBeInTheDocument();
    });
  });

  describe('Navigation Handling', () => {
    it('should navigate to dashboard on successful login', async () => {
      const user = userEvent.setup();
      const mockSignIn = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({signIn: mockSignIn});

      render(
        <TestWrapper authContext={mockAuthContext}>
          <Login />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', {name: 'Sign In'});

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true});
      });
    });

    it('should navigate to register page when switch to register clicked', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <Login />
        </TestWrapper>
      );

      const registerLink = screen.getByRole('button', {
        name: 'Create one here',
      });
      await user.click(registerLink);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('should navigate to password reset page when forgot password clicked', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <Login />
        </TestWrapper>
      );

      const forgotPasswordLink = screen.getByRole('button', {
        name: 'Forgot password?',
      });
      await user.click(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
    });
  });

  describe('OAuth Integration', () => {
    it('should handle OAuth authentication through LoginForm', async () => {
      const user = userEvent.setup();
      const mockSignInWithProvider = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        signInWithProvider: mockSignInWithProvider,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <Login />
        </TestWrapper>
      );

      const discordButton = screen.getByRole('button', {
        name: 'Discord',
      });
      await user.click(discordButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', {replace: true});
      });
    });
  });
});
