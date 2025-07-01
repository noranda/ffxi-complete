/**
 * Login page component
 *
 * Provides the main login interface for FFXI Complete with email/password
 * authentication and OAuth provider options. Handles navigation between
 * login, registration, and password reset flows.
 */

import {useNavigate} from 'react-router-dom';

import {LoginForm} from '@/components/auth';

/**
 * Login page component
 *
 * Renders the login form with proper navigation handling for different
 * authentication flows. Redirects users after successful authentication
 * and provides links to registration and password reset.
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Handles successful login by redirecting to dashboard
   */
  const handleLoginSuccess = () => void navigate('/', {replace: true});

  /**
   * Handles navigation to registration page
   */
  const handleSwitchToRegister = () => void navigate('/register');

  /**
   * Handles navigation to password reset page
   */
  const handleForgotPassword = () => void navigate('/reset-password');

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">FFXI Complete</h1>

          <div className="text-muted-foreground mt-2 text-sm">Track your Final Fantasy XI progress</div>
        </div>

        <LoginForm
          className="mt-8"
          onForgotPassword={handleForgotPassword}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>
    </div>
  );
};
