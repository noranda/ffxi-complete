/**
 * Login form with email/password authentication and OAuth support
 */

import {Field, type FieldProps, Form, Formik} from 'formik';
import {useState} from 'react';
import * as Yup from 'yup';

import {Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input} from '@/components/ui';
import {useAuth} from '@/contexts/AuthContext';
import {isValidEmail} from '@/lib/auth';

import type {AuthCallbacks, BaseAuthFormProps, LoginFormData} from './types';

import {OAuthButtons} from './OAuthButtons';

/**
 * Login form props
 * Extends shared auth component patterns for consistency
 */
type LoginFormProps = BaseAuthFormProps & Pick<AuthCallbacks, 'onForgotPassword' | 'onSuccess' | 'onSwitchToRegister'>;

/**
 * Yup validation schema for login form
 * Validates email format and password presence
 */
const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .test('is-valid-email', 'Please enter a valid email address', value => (value ? isValidEmail(value) : false)),
  password: Yup.string().required('Password is required'),
});

/**
 * Login form component with comprehensive error handling and OAuth support
 */
export const LoginForm: React.FC<LoginFormProps> = ({className, onForgotPassword, onSuccess, onSwitchToRegister}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auth context
  const {clearError, error: authError, loading: authLoading, signIn, signInWithProvider} = useAuth();

  /**
   * Handles OAuth provider sign in for Discord and Google
   * Clears existing errors and attempts sign in with the specified provider
   */
  const handleOAuthSignIn = async (provider: 'discord' | 'google') => {
    try {
      clearError();
      const result = await signInWithProvider(provider);
      if (result.success) {
        setSubmitSuccess(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error(`${provider} sign in error:`, err);
    }
  };

  /**
   * Handles Discord OAuth button click with error logging
   */
  const handleDiscordClick = () =>
    handleOAuthSignIn('discord').catch(err => console.error('Discord signin error:', err));

  /**
   * Handles Google OAuth button click with error logging
   */
  const handleGoogleClick = () => handleOAuthSignIn('google').catch(err => console.error('Google signin error:', err));

  /**
   * Triggers forgot password callback when user clicks forgot password link
   */
  const handleForgotPasswordClick = () => onForgotPassword?.();

  /**
   * Switches to registration form when user clicks create account link
   */
  const handleSwitchToRegister = () => onSwitchToRegister?.();

  // Initial form values
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  /**
   * Handles form submission for user login
   * Validates form data, calls sign in API, and manages form state during submission
   */
  const handleSubmit = async (
    values: LoginFormData,
    {
      setFieldError,
      setSubmitting,
    }: {
      setFieldError: (field: string, message: string) => void;
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    // Clear previous errors
    clearError();

    try {
      const result = await signIn(values.email, values.password);

      if (result.success) {
        setSubmitSuccess(true);
        onSuccess?.();
      } else {
        setFieldError('password', result.error ?? 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setFieldError('password', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>

        <CardDescription>Sign in to your FFXI Complete account to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {submitSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3">
            <div className="text-sm text-green-800">Successfully signed in! Redirecting...</div>
          </div>
        )}

        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={loginSchema}>
          {({errors, isSubmitting, touched}) => (
            <Form className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email Address
                </label>

                <Field name="email">
                  {({field}: FieldProps) => (
                    <Input
                      {...field}
                      aria-describedby={
                        touched.email === true && errors.email !== undefined ? 'email-error' : undefined
                      }
                      aria-invalid={touched.email === true && errors.email !== undefined}
                      disabled={isSubmitting || authLoading}
                      id="email"
                      onChange={event => {
                        field.onChange(event);
                        if (authError !== null) {
                          clearError();
                        }
                      }}
                      placeholder="your.email@example.com"
                      type="email"
                    />
                  )}
                </Field>

                {touched.email === true && errors.email !== undefined && (
                  <div className="text-destructive text-sm" id="email-error">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>

                  {onForgotPassword && (
                    <Button
                      disabled={authLoading}
                      onClick={handleForgotPasswordClick}
                      size="sm"
                      type="button"
                      variant="link"
                    >
                      Forgot password?
                    </Button>
                  )}
                </div>

                <Field name="password">
                  {({field}: FieldProps) => (
                    <Input
                      {...field}
                      aria-describedby={
                        touched.password === true && errors.password !== undefined ? 'password-error' : undefined
                      }
                      aria-invalid={touched.password === true && errors.password !== undefined}
                      disabled={isSubmitting || authLoading}
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                    />
                  )}
                </Field>

                {touched.password === true && errors.password !== undefined && (
                  <div className="text-destructive text-sm" id="password-error">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* General Errors */}
              {authError != null && (
                <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">{authError}</div>
              )}

              {/* Submit Button */}
              <Button className="w-full" disabled={isSubmitting || authLoading || submitSuccess} type="submit">
                {isSubmitting || authLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <OAuthButtons
          disabled={authLoading || submitSuccess}
          onDiscordClick={handleDiscordClick}
          onGoogleClick={handleGoogleClick}
        />

        {/* Switch to Register */}
        {onSwitchToRegister && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>

            <Button disabled={authLoading} onClick={handleSwitchToRegister} size="sm" type="button" variant="link">
              Create one here
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
