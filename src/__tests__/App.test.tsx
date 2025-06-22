import {render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import App from '../App';
import {AuthProvider} from '../contexts/AuthContext';

// Mock the auth utilities
vi.mock('../lib/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  resetPassword: vi.fn(),
  signIn: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updatePassword: vi.fn(),
}));

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({data: {session: null}, error: null}),
      onAuthStateChange: vi.fn(() => ({
        data: {subscription: {unsubscribe: vi.fn()}},
      })),
    },
  },
}));

// Test wrapper with AuthProvider
const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => <AuthProvider>{children}</AuthProvider>;
describe('App', () => {
  it('renders the application', async () => {
    render(<App />, {wrapper: TestWrapper});

    // Wait for auth initialization to complete to avoid act warnings
    await waitFor(() => expect(document.body).toBeInTheDocument());
  });

  it('displays the main heading when not loading', async () => {
    render(<App />, {wrapper: TestWrapper});

    // Wait for loading to complete and main content to appear
    await screen.findByText('FFXI Complete');

    // Look for the main heading (should be visible when not loading)
    expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
    expect(screen.getByText('FFXI Complete')).toBeInTheDocument();
  });
});
