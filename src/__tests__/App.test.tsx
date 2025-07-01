import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import App from '@/App';
import {AuthProvider} from '@/contexts/AuthContext';

describe('App', () => {
  it('renders the application', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // The app should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('displays the clean layout with AppBar only', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Wait for the FFXI Complete branding to appear in AppBar
    await screen.findByText('FFXI Complete');

    // Verify the AppBar branding is present
    expect(screen.getByText('FFXI Complete')).toBeInTheDocument();

    // Verify the MainLayout structure is present
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('main-content-area')).toBeInTheDocument();

    // Verify the AppBar is present
    expect(screen.getByTestId('app-bar')).toBeInTheDocument();
    expect(screen.getByTestId('collection-settings-toggle')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();

    // Verify no content cards are present (clean layout)
    expect(screen.queryByText('Character Management')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Progression')).not.toBeInTheDocument();
    expect(screen.queryByText('Skills & Collections')).not.toBeInTheDocument();
    expect(screen.queryByText('Public Sharing')).not.toBeInTheDocument();
  });
});
