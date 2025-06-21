/**
 * RegisterForm Demo Page
 *
 * A standalone demo page to showcase the RegisterForm component
 * Access this at: http://localhost:5173/register-demo
 */

import {RegisterForm} from '@/components/auth/RegisterForm';

/**
 * Demo page for the RegisterForm component
 */
export const RegisterDemo: React.FC<unknown> = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            RegisterForm Demo
          </h1>
          <p className="text-muted-foreground text-sm">
            Testing the complete registration form with validation, error
            handling, and OAuth
          </p>
        </div>

        <RegisterForm
          onSuccess={() => {
            alert('Registration successful! (Demo mode)');
          }}
          onSwitchToLogin={() => {
            alert('Switch to login clicked! (Login form coming in task 3.3)');
          }}
        />

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to main app
          </a>
        </div>
      </div>
    </div>
  );
};
