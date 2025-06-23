/**
 * OAuthButtons Component Tests
 *
 * Comprehensive test suite covering:
 * - Basic rendering and interaction
 * - Individual loading states for each provider
 * - Error handling and retry mechanisms
 * - Accessibility features
 * - Props handling and validation
 */

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {OAuthButtons} from '../OAuthButtons';

describe('OAuthButtons', () => {
  const defaultProps = {
    onDiscordClick: vi.fn(),
    onGoogleClick: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  describe('Basic Rendering', () => {
    it('should render both OAuth buttons', () => {
      render(<OAuthButtons {...defaultProps} />);

      expect(screen.getByRole('button', {name: /discord/i})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: /google/i})).toBeInTheDocument();
    });

    it('should render OAuth divider text', () => {
      render(<OAuthButtons {...defaultProps} />);

      expect(screen.getByText('Or continue with')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onDiscordClick when Discord button is clicked', async () => {
      const user = userEvent.setup();
      render(<OAuthButtons {...defaultProps} />);

      await user.click(screen.getByRole('button', {name: /discord/i}));

      expect(defaultProps.onDiscordClick).toHaveBeenCalledOnce();
    });

    it('should call onGoogleClick when Google button is clicked', async () => {
      const user = userEvent.setup();
      render(<OAuthButtons {...defaultProps} />);

      await user.click(screen.getByRole('button', {name: /google/i}));

      expect(defaultProps.onGoogleClick).toHaveBeenCalledOnce();
    });
  });

  describe('Disabled State', () => {
    it('should disable both buttons when disabled prop is true', () => {
      render(<OAuthButtons {...defaultProps} disabled={true} />);

      expect(screen.getByRole('button', {name: /discord/i})).toBeDisabled();
      expect(screen.getByRole('button', {name: /google/i})).toBeDisabled();
    });

    it('should not call onClick handlers when buttons are disabled', async () => {
      const user = userEvent.setup();
      render(<OAuthButtons {...defaultProps} disabled={true} />);

      await user.click(screen.getByRole('button', {name: /discord/i}));
      await user.click(screen.getByRole('button', {name: /google/i}));

      expect(defaultProps.onDiscordClick).not.toHaveBeenCalled();
      expect(defaultProps.onGoogleClick).not.toHaveBeenCalled();
    });
  });

  describe('Individual Loading States', () => {
    it('should show Discord loading state when discordLoading is true', () => {
      render(<OAuthButtons {...defaultProps} discordLoading={true} />);

      const discordButton = screen.getByRole('button', {name: /signing in with discord/i});
      expect(discordButton).toBeDisabled();
      expect(discordButton).toHaveTextContent('Signing in with Discord...');
    });

    it('should show Google loading state when googleLoading is true', () => {
      render(<OAuthButtons {...defaultProps} googleLoading={true} />);

      const googleButton = screen.getByRole('button', {name: /signing in with google/i});
      expect(googleButton).toBeDisabled();
      expect(googleButton).toHaveTextContent('Signing in with Google...');
    });

    it('should allow Google button to be clicked when only Discord is loading', async () => {
      const user = userEvent.setup();
      render(<OAuthButtons {...defaultProps} discordLoading={true} />);

      const googleButton = screen.getByRole('button', {name: /google/i});
      expect(googleButton).not.toBeDisabled();

      await user.click(googleButton);
      expect(defaultProps.onGoogleClick).toHaveBeenCalledOnce();
    });

    it('should allow Discord button to be clicked when only Google is loading', async () => {
      const user = userEvent.setup();
      render(<OAuthButtons {...defaultProps} googleLoading={true} />);

      const discordButton = screen.getByRole('button', {name: /discord/i});
      expect(discordButton).not.toBeDisabled();

      await user.click(discordButton);
      expect(defaultProps.onDiscordClick).toHaveBeenCalledOnce();
    });
  });

  describe('Error Handling', () => {
    it('should display Discord error message when discordError is provided', () => {
      render(<OAuthButtons {...defaultProps} discordError="Discord authentication failed" />);

      expect(screen.getByText('Discord authentication failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display Google error message when googleError is provided', () => {
      render(<OAuthButtons {...defaultProps} googleError="Google authentication failed" />);

      expect(screen.getByText('Google authentication failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display both error messages when both providers have errors', () => {
      render(<OAuthButtons {...defaultProps} discordError="Discord failed" googleError="Google failed" />);

      expect(screen.getByText('Discord failed')).toBeInTheDocument();
      expect(screen.getByText('Google failed')).toBeInTheDocument();
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
  });

  describe('Retry Functionality', () => {
    it('should show retry button for Discord when retryable error occurs', () => {
      const onDiscordRetry = vi.fn();
      render(
        <OAuthButtons
          {...defaultProps}
          discordError="Network error"
          onDiscordRetry={onDiscordRetry}
          showDiscordRetry={true}
        />
      );

      expect(screen.getByRole('button', {name: /retry discord/i})).toBeInTheDocument();
    });

    it('should show retry button for Google when retryable error occurs', () => {
      const onGoogleRetry = vi.fn();
      render(
        <OAuthButtons
          {...defaultProps}
          googleError="Network error"
          onGoogleRetry={onGoogleRetry}
          showGoogleRetry={true}
        />
      );

      expect(screen.getByRole('button', {name: /retry google/i})).toBeInTheDocument();
    });

    it('should call onDiscordRetry when Discord retry button is clicked', async () => {
      const user = userEvent.setup();
      const onDiscordRetry = vi.fn();
      render(
        <OAuthButtons
          {...defaultProps}
          discordError="Network error"
          onDiscordRetry={onDiscordRetry}
          showDiscordRetry={true}
        />
      );

      await user.click(screen.getByRole('button', {name: /retry discord/i}));

      expect(onDiscordRetry).toHaveBeenCalledOnce();
    });

    it('should call onGoogleRetry when Google retry button is clicked', async () => {
      const user = userEvent.setup();
      const onGoogleRetry = vi.fn();
      render(
        <OAuthButtons
          {...defaultProps}
          googleError="Network error"
          onGoogleRetry={onGoogleRetry}
          showGoogleRetry={true}
        />
      );

      await user.click(screen.getByRole('button', {name: /retry google/i}));

      expect(onGoogleRetry).toHaveBeenCalledOnce();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for loading states', () => {
      render(<OAuthButtons {...defaultProps} discordLoading={true} googleLoading={true} />);

      const discordButton = screen.getByRole('button', {name: /signing in with discord/i});
      const googleButton = screen.getByRole('button', {name: /signing in with google/i});

      expect(discordButton).toHaveAttribute('aria-busy', 'true');
      expect(googleButton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper ARIA attributes for error messages', () => {
      render(<OAuthButtons {...defaultProps} discordError="Error message" />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should associate error messages with their respective buttons', () => {
      render(<OAuthButtons {...defaultProps} discordError="Discord error" />);

      const discordButton = screen.getByRole('button', {name: /discord/i});
      const errorElement = screen.getByRole('alert');

      expect(discordButton).toHaveAttribute('aria-describedby');
      expect(errorElement).toHaveAttribute('id');
    });
  });

  describe('Combined States', () => {
    it('should handle loading and error states simultaneously', () => {
      render(
        <OAuthButtons {...defaultProps} discordError="Previous error" discordLoading={true} googleLoading={true} />
      );

      expect(screen.getByRole('button', {name: /signing in with discord/i})).toBeDisabled();
      expect(screen.getByRole('button', {name: /signing in with google/i})).toBeDisabled();
      expect(screen.getByText('Previous error')).toBeInTheDocument();
    });

    it('should show both loading and error states when they occur simultaneously', () => {
      render(<OAuthButtons {...defaultProps} discordError="Error" discordLoading={true} />);

      expect(screen.getByRole('button', {name: /signing in with discord/i})).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});
