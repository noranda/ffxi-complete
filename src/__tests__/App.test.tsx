import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import App from '../App';

// Mock the useAuth hook to return a stable, non-loading state
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithProvider: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
    clearError: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders the application', () => {
    render(<App />);

    // Check that the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('displays the main heading when not loading', () => {
    render(<App />);

    // Look for the main heading (should be visible when not loading)
    expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
    expect(screen.getByText('FFXI Progress Tracker')).toBeInTheDocument();
  });
});
