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
export const RegisterDemo: React.FC<unknown> = () => (
  <div className="bg-background flex min-h-screen items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-foreground mb-2 text-2xl font-bold">
          RegisterForm Demo
        </h1>

        <div className="text-muted-foreground text-sm">
          Testing the complete registration form with validation, error
          handling, and OAuth
        </div>
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
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          href="/"
        >
          ← Back to main app
        </a>
      </div>
    </div>
  </div>
);
