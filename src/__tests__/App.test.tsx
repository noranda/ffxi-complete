import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import App from '@/App';

describe('App', () => {
  it('renders the application', () => {
    render(<App />);

    // The app should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('displays the FFXI Complete content within MainLayout', async () => {
    render(<App />);

    // Wait for the FFXI Complete content to appear
    await screen.findByText('FFXI Complete');

    // Verify the main heading is present
    expect(screen.getByText('FFXI Complete')).toBeInTheDocument();

    // Verify the description is present
    expect(
      screen.getByText('Track your Final Fantasy XI character progress across jobs, skills, and collections')
    ).toBeInTheDocument();

    // Verify the MainLayout structure is present
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('main-content-area')).toBeInTheDocument();

    // Verify feature cards are present
    expect(screen.getByText('Character Management')).toBeInTheDocument();
    expect(screen.getByText('Job Progression')).toBeInTheDocument();
    expect(screen.getByText('Skills & Collections')).toBeInTheDocument();
    expect(screen.getByText('Public Sharing')).toBeInTheDocument();
  });
});
