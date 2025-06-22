/**
 * Unit tests for LoginForm component
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '@/contexts/AuthContext';

import {AuthContext} from '@/contexts/AuthContext';

import {LoginForm} from '../LoginForm';

// Mock auth context helper
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
  authContext: AuthContextType;
  children: React.ReactNode;
}> = ({authContext, children}) => <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
describe('LoginForm', () => {
  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Sign In'})).toBeInTheDocument();
    });

    it('should render forgot password link when callback provided', () => {
      const mockAuthContext = createMockAuthContext();
      const onForgotPassword = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm onForgotPassword={onForgotPassword} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', {name: 'Forgot password?'})).toBeInTheDocument();
    });
  });

  describe('Form Validation', () =>
    it('should show validation errors for empty fields', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', {name: 'Sign In'});
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    }));

  describe('Form Submission', () => {
    it('should call signIn with correct credentials', async () => {
      const user = userEvent.setup();
      const mockSignIn = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({signIn: mockSignIn});

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', {name: 'Sign In'});

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123'));
    });

    it('should call onSuccess callback when login succeeds', async () => {
      const user = userEvent.setup();
      const mockSignIn = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({signIn: mockSignIn});
      const onSuccess = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm onSuccess={onSuccess} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', {name: 'Sign In'});

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('OAuth Authentication', () =>
    it('should call signInWithProvider for Discord OAuth', async () => {
      const user = userEvent.setup();
      const mockSignInWithProvider = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        signInWithProvider: mockSignInWithProvider,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm />
        </TestWrapper>
      );

      const discordButton = screen.getByRole('button', {
        name: 'Discord',
      });
      await user.click(discordButton);

      await waitFor(() => expect(mockSignInWithProvider).toHaveBeenCalledWith('discord'));
    }));

  describe('Loading States', () =>
    it('should disable form when auth context is loading', () => {
      const mockAuthContext = createMockAuthContext({loading: true});

      render(
        <TestWrapper authContext={mockAuthContext}>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Email Address')).toBeDisabled();
      expect(screen.getByLabelText('Password')).toBeDisabled();
      expect(screen.getByRole('button', {name: 'Signing In...'})).toBeDisabled();
    }));
});
