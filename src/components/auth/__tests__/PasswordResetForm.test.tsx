/**
 * Unit tests for PasswordResetForm component
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '@/contexts/AuthContext';
import type {AuthResult} from '@/lib/auth';

import {AuthContext} from '@/contexts/AuthContext';

import {PasswordResetForm} from '../PasswordResetForm';

// Mock auth context helper
const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  clearError: vi.fn(),
  error: null,
  getSessionInfo: vi.fn(),
  isAuthenticated: false,
  loading: false,
  refresh: vi.fn(),
  refreshSession: vi.fn(),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithProvider: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
  user: null,
  validateSession: vi.fn(),
  ...overrides,
});

// Test wrapper component
type TestWrapperProps = {
  authContext: AuthContextType;
  children: React.ReactNode;
};

const TestWrapper: React.FC<TestWrapperProps> = ({authContext, children}) => (
  <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
);

describe('PasswordResetForm', () => {
  describe('Rendering', () => {
    it('should render password reset form with all required elements', () => {
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      expect(screen.getByText('Reset Password')).toBeInTheDocument();
      expect(
        screen.getByText("Enter your email address and we'll send you a link to reset your password")
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Send Reset Email'})).toBeInTheDocument();
    });

    it('should render back to sign in button when callback provided', () => {
      const mockAuthContext = createMockAuthContext();
      const onSwitchToLogin = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm onSwitchToLogin={onSwitchToLogin} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', {name: 'Back to Sign In'})).toBeInTheDocument();
    });

    it('should render cancel button when callback provided', () => {
      const mockAuthContext = createMockAuthContext();
      const onCancel = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm onCancel={onCancel} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email field', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });
      await user.click(submitButton);

      await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    });

    it('should show validation error for invalid email format', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument());
    });

    it('should not show validation error for valid email format', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument());
    });
  });

  describe('Form Submission', () => {
    it('should call resetPassword with correct email', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => expect(mockResetPassword).toHaveBeenCalledWith('test@example.com'));
    });

    it('should show success state when password reset succeeds', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Check Your Email')).toBeInTheDocument();
        expect(screen.getByText('Email Sent Successfully')).toBeInTheDocument();
        expect(screen.getByText(/We've sent password reset instructions to test@example.com/)).toBeInTheDocument();
      });
    });

    it('should show error message when password reset fails', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({
        error: 'User not found',
        success: false,
      });
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => expect(screen.getByText('User not found')).toBeInTheDocument());
    });

    it('should handle unexpected errors during submission', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockRejectedValue(new Error('Network error'));
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() =>
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
      );
    });
  });

  describe('Success State', () => {
    it('should allow user to send another email from success state', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      // Submit form to get to success state
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for success state
      await waitFor(() => expect(screen.getByText('Check Your Email')).toBeInTheDocument());

      // Click send another email button
      const sendAnotherButton = screen.getByRole('button', {
        name: 'Send Another Email',
      });
      await user.click(sendAnotherButton);

      // Should return to form state
      await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      });
    });

    it('should call onSwitchToLogin when back to sign in is clicked', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn().mockResolvedValue({success: true});
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });
      const onSwitchToLogin = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm onSwitchToLogin={onSwitchToLogin} />
        </TestWrapper>
      );

      // Submit form to get to success state
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for success state
      await waitFor(() => expect(screen.getByText('Check Your Email')).toBeInTheDocument());

      // Click back to sign in button
      const backButton = screen.getByRole('button', {name: 'Back to Sign In'});
      await user.click(backButton);

      expect(onSwitchToLogin).toHaveBeenCalled();
    });
  });

  describe('Navigation Callbacks', () => {
    it('should call onSwitchToLogin when back to sign in is clicked from form', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();
      const onSwitchToLogin = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm onSwitchToLogin={onSwitchToLogin} />
        </TestWrapper>
      );

      const backButton = screen.getByRole('button', {name: 'Back to Sign In'});
      await user.click(backButton);

      expect(onSwitchToLogin).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockAuthContext = createMockAuthContext();
      const onCancel = vi.fn();

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm onCancel={onCancel} />
        </TestWrapper>
      );

      const cancelButton = screen.getByRole('button', {name: 'Cancel'});
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should disable form when auth context is loading', () => {
      const mockAuthContext = createMockAuthContext({loading: true});

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Email Address')).toBeDisabled();
      expect(screen.getByRole('button', {name: 'Sending Reset Email...'})).toBeDisabled();
    });

    it('should show loading text during form submission', async () => {
      const user = userEvent.setup();
      const mockResetPassword = vi.fn(() => new Promise<AuthResult<null>>(() => {})); // Never resolves
      const mockAuthContext = createMockAuthContext({
        resetPassword: mockResetPassword,
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', {
        name: 'Send Reset Email',
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => expect(screen.getByRole('button', {name: 'Sending Reset Email...'})).toBeDisabled());
    });
  });

  describe('Error Handling', () => {
    it('should display auth context errors', () => {
      const mockAuthContext = createMockAuthContext({
        error: 'Rate limit exceeded',
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });

    it('should clear errors when user types in email field', async () => {
      const user = userEvent.setup();
      const mockClearError = vi.fn();
      const mockAuthContext = createMockAuthContext({
        clearError: mockClearError,
        error: 'Some error',
      });

      render(
        <TestWrapper authContext={mockAuthContext}>
          <PasswordResetForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'test@example.com');

      expect(mockClearError).toHaveBeenCalled();
    });
  });
});
