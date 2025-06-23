import {Component, type ErrorInfo} from 'react';

import {Button} from '@/components/ui';

/**
 * Props for the AuthErrorBoundary component
 */
export type AuthErrorBoundaryProps = {
  /** Child components to render when no error occurs */
  children: React.ReactNode;
  /** Custom fallback message to display when error occurs */
  fallbackMessage?: string;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Whether to show retry button */
  showRetry?: boolean;
};

/**
 * State for the AuthErrorBoundary component
 */
type AuthErrorBoundaryState = {
  error: Error | null;
  hasError: boolean;
};

/**
 * Error boundary component for authentication flows
 *
 * Catches JavaScript errors in authentication components and displays
 * a fallback UI with appropriate error messages and retry functionality.
 * Provides specific handling for authentication and network errors.
 *
 * NOTE: This uses a class component because React Error Boundaries require
 * the `getDerivedStateFromError` and `componentDidCatch` lifecycle methods,
 * which are only available in class components. There are no hook equivalents
 * for error boundary functionality as of React 19.
 */
export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  /**
   * Constructor - initializes component state
   */
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {error: null, hasError: false};
  }

  /**
   * Static method called when an error is caught
   */
  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {error, hasError: true};
  }

  /**
   * Called when an error is caught - used for error reporting
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Determines error type and appropriate messaging
   */
  getErrorMessage() {
    const {fallbackMessage} = this.props;
    const {error} = this.state;

    if (fallbackMessage) {
      return fallbackMessage;
    }

    if (!error) {
      return 'Something went wrong with authentication.';
    }

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
      return 'Authentication Error: Please try signing in again.';
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return 'Network Error: There was a problem with your connection.';
    }

    return 'Something went wrong. Please try again.';
  }

  /**
   * Gets appropriate suggestion based on error type
   */
  getErrorSuggestion() {
    const {error} = this.state;

    if (!error) {
      return null;
    }

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return 'Please check your internet connection and try again.';
    }

    if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
      return 'You may need to sign out and sign in again.';
    }

    return null;
  }

  /**
   * Handles retry button click - resets error state
   */
  handleRetry = () => {
    this.setState({error: null, hasError: false});
    this.props.onRetry?.();
  };

  /**
   * Renders component content
   */
  render() {
    const {children, showRetry = true} = this.props;
    const {hasError} = this.state;

    if (hasError) {
      const errorMessage = this.getErrorMessage();
      const suggestion = this.getErrorSuggestion();

      return (
        <div aria-live="assertive" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          <div className="font-medium">{errorMessage}</div>

          {suggestion && <div className="mt-1 text-sm">{suggestion}</div>}
          {showRetry && (
            <Button className="mt-3" onClick={this.handleRetry} size="sm" variant="outline">
              Try Again
            </Button>
          )}
        </div>
      );
    }

    return children;
  }
}
