/**
 * AuthErrorBoundary Component Tests
 *
 * Tests for error boundary that catches and handles authentication flow errors
 * with proper fallback UI and error reporting.
 */

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {AuthErrorBoundary} from '../AuthErrorBoundary';

// Mock component that throws errors for testing
const ThrowError: React.FC<{errorMessage?: string; shouldThrow: boolean}> = ({
  errorMessage = 'Test error',
  shouldThrow,
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

describe('AuthErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeEach(() => (console.error = vi.fn()));
  afterEach(() => (console.error = originalError));

  describe('Error-free Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <AuthErrorBoundary>
          <div>Test content</div>
        </AuthErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should not show error UI when children render successfully', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={false} />
        </AuthErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch and display error when child component throws', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError errorMessage="Generic error" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should display custom error message when provided', () => {
      render(
        <AuthErrorBoundary fallbackMessage="Custom error message">
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should show retry button by default when error occurs', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByRole('button', {name: /try again/i})).toBeInTheDocument();
    });

    it('should hide retry button when showRetry is false', () => {
      render(
        <AuthErrorBoundary showRetry={false}>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.queryByRole('button', {name: /try again/i})).not.toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('should reset error state and re-render children when retry is clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const TestComponent: React.FC = () => <ThrowError shouldThrow={shouldThrow} />;

      const {rerender} = render(
        <AuthErrorBoundary>
          <TestComponent />
        </AuthErrorBoundary>
      );

      // Verify error state
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click retry
      await user.click(screen.getByRole('button', {name: /try again/i}));

      // Re-render with fixed component
      rerender(
        <AuthErrorBoundary>
          <TestComponent />
        </AuthErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should call onRetry callback when retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(
        <AuthErrorBoundary onRetry={onRetry}>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      await user.click(screen.getByRole('button', {name: /try again/i}));

      expect(onRetry).toHaveBeenCalledOnce();
    });
  });

  describe('Error Reporting', () => {
    it('should call onError callback when error is caught', () => {
      const onError = vi.fn();
      const testError = new Error('Test error');

      render(
        <AuthErrorBoundary onError={onError}>
          <ThrowError errorMessage="Test error" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(testError, expect.any(Object));
    });

    it('should include error details in onError callback', () => {
      const onError = vi.fn();

      render(
        <AuthErrorBoundary onError={onError}>
          <ThrowError errorMessage="Specific error" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      const [error, errorInfo] = onError.mock.calls[0];
      expect(error.message).toBe('Specific error');
      expect(errorInfo).toHaveProperty('componentStack');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for error display', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have accessible error message structure', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: /try again/i})).toBeInTheDocument();
    });
  });

  describe('Authentication-specific Errors', () => {
    it('should detect and handle authentication errors specifically', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError errorMessage="Authentication failed" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByText(/authentication error/i)).toBeInTheDocument();
    });

    it('should detect and handle network errors specifically', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError errorMessage="Network request failed" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    it('should suggest appropriate actions for different error types', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError errorMessage="Network request failed" shouldThrow={true} />
        </AuthErrorBoundary>
      );

      expect(screen.getByText(/please check your internet connection/i)).toBeInTheDocument();
    });
  });
});
