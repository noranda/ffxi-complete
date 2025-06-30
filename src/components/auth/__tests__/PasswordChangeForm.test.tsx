import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {AuthContext, type AuthContextType} from '../../../contexts/AuthContext';
import {PasswordChangeForm} from '../PasswordChangeForm';

/**
 * Mock helper to create AuthContext with specified state
 */
const createMockAuthContext = (overrides: Partial = {}): AuthContextType => ({
  clearError: vi.fn(),
  error: null,
  getSessionInfo: vi.fn().mockResolvedValue({session: null}),
  isAuthenticated: true,
  loading: false,
  refresh: vi.fn(),
  refreshSession: vi.fn().mockResolvedValue({session: null}),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithProvider: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn().mockResolvedValue({error: null, success: true}),
  updateProfile: vi.fn(),
  user: null,
  validateSession: vi.fn().mockResolvedValue({valid: true}),
  ...overrides,
});

/**
 * Test wrapper that provides AuthContext
 */
const TestWrapper: React.FC = ({authContext, children}) => (
  <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
);

describe('PasswordChangeForm', () => {
  it('renders password change form', () => {
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    // Check for the card title and description (unique texts)
    expect(screen.getByText('Update your account password')).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /change password/i})).toBeInTheDocument();
  });

  it('validates password length requirements', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'short');
    await user.type(confirmPasswordInput, 'short');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument());
  });

  it('validates password confirmation match', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'validPassword123');
    await user.type(confirmPasswordInput, 'differentPassword123');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
  });

  it('calls updatePassword with correct data on submit', async () => {
    const user = userEvent.setup();
    const mockUpdatePassword = vi.fn().mockResolvedValue({
      error: null,
      success: true,
    });
    const authContext = createMockAuthContext({
      updatePassword: mockUpdatePassword,
    });

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'newValidPassword123');
    await user.type(confirmPasswordInput, 'newValidPassword123');
    await user.click(submitButton);

    await waitFor(() => expect(mockUpdatePassword).toHaveBeenCalledWith('newValidPassword123'));
  });

  it('displays success message after successful password change', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'newValidPassword123');
    await user.type(confirmPasswordInput, 'newValidPassword123');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Password changed successfully')).toBeInTheDocument());
  });

  it('displays error message on update failure', async () => {
    const user = userEvent.setup();
    const mockUpdatePassword = vi.fn().mockResolvedValue({
      error: 'Password update failed',
      success: false,
    });
    const authContext = createMockAuthContext({
      updatePassword: mockUpdatePassword,
    });

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'newValidPassword123');
    await user.type(confirmPasswordInput, 'newValidPassword123');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Password update failed')).toBeInTheDocument());
  });

  it('clears form after successful password change', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'newValidPassword123');
    await user.type(confirmPasswordInput, 'newValidPassword123');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Password changed successfully')).toBeInTheDocument());

    // Wait for form to be cleared after 2-second delay
    await waitFor(
      () => {
        expect(newPasswordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
      },
      {timeout: 3000}
    ); // Wait up to 3 seconds for the form to clear
  });

  it('disables submit button when fields are empty', () => {
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', {name: /change password/i});

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when both fields are filled', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <PasswordChangeForm />
      </TestWrapper>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', {name: /change password/i});

    await user.type(newPasswordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(submitButton).toBeEnabled();
  });
});
