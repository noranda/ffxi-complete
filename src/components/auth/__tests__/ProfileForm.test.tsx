import type {User} from '@supabase/supabase-js';

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import type {AuthContextType} from '../../../contexts/AuthContext';

import {AuthContext} from '../../../contexts/AuthContext';
import {ProfileForm} from '../ProfileForm';

/**
 * Mock helper to create AuthContext with specified state
 */
const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  clearError: vi.fn(),
  error: null,
  isAuthenticated: true,
  loading: false,
  refresh: vi.fn(),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithProvider: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn().mockResolvedValue({error: null, success: true}),
  user: {
    email: 'test@example.com',
    id: 'test-user-id',
    user_metadata: {
      display_name: 'TestUser',
      full_name: 'Test User',
    },
  } as unknown as User,
  ...overrides,
});

/**
 * Test wrapper that provides AuthContext
 */
const TestWrapper: React.FC<{
  authContext: AuthContextType;
  children: React.ReactNode;
}> = ({authContext, children}) => <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;

describe('ProfileForm', () => {
  it('displays user profile information', () => {
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();
  });

  it('validates required full name field', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', {name: /save changes/i});

    // Clear the full name field
    await user.clear(fullNameInput);
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Full name is required')).toBeInTheDocument());
  });

  it('validates display name format', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const displayNameInput = screen.getByLabelText(/display name/i);
    const submitButton = screen.getByRole('button', {name: /save changes/i});

    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'invalid name!');
    await user.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText('Display name can only contain letters, numbers, and underscores')).toBeInTheDocument()
    );
  });

  it('calls updateProfile with correct data on submit', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = vi.fn().mockResolvedValue({
      error: null,
      success: true,
    });
    const authContext = createMockAuthContext({
      updateProfile: mockUpdateProfile,
    });

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const submitButton = screen.getByRole('button', {name: /save changes/i});

    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Updated Name');
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'UpdatedUser');
    await user.click(submitButton);

    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        display_name: 'UpdatedUser',
        full_name: 'Updated Name',
      })
    );
  });

  it('displays success message after successful update', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', {name: /save changes/i});

    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Updated Name');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Profile updated successfully')).toBeInTheDocument());
  });

  it('displays error message on update failure', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = vi.fn().mockResolvedValue({
      error: 'Update failed',
      success: false,
    });
    const authContext = createMockAuthContext({
      updateProfile: mockUpdateProfile,
    });

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', {name: /save changes/i});

    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Updated Name');
    await user.click(submitButton);

    await waitFor(() => expect(screen.getByText('Update failed')).toBeInTheDocument());
  });

  it('shows unsaved changes indicator', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);

    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Changed Name');

    await waitFor(() => expect(screen.getByText('You have unsaved changes')).toBeInTheDocument());
  });

  it('resets form on cancel', async () => {
    const user = userEvent.setup();
    const authContext = createMockAuthContext();

    render(
      <TestWrapper authContext={authContext}>
        <ProfileForm />
      </TestWrapper>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const cancelButton = screen.getByRole('button', {name: /cancel/i});

    await user.clear(fullNameInput);
    await user.type(fullNameInput, 'Changed Name');
    await user.click(cancelButton);

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
  });
});
