import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import App from '../App';

describe('App', () => {
  it('renders the application', () => {
    render(<App />);

    // Check that the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<App />);

    // Look for the main heading
    expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
  });
});
