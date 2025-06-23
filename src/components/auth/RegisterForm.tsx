/**
 * Registration form with email validation, password strength checking, and OAuth support
 */

import {Field, type FieldProps, Form, Formik} from 'formik';
import {useState} from 'react';
import * as Yup from 'yup';

import {Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input} from '@/components/ui';
import {useAuth} from '@/contexts/AuthContext';
import {isValidEmail, validatePassword} from '@/lib/auth';

import type {AuthCallbacks, BaseAuthFormProps, RegisterFormData} from './types';

import {OAuthButtons} from './OAuthButtons';
import {PasswordFieldWithStrength} from './PasswordFieldWithStrength';
import {SuccessMessage} from './SuccessMessage';

/**
 * Registration form props
 * Extends shared auth component patterns for consistency
 */
type RegisterFormProps = BaseAuthFormProps & Pick<AuthCallbacks, 'onSuccess' | 'onSwitchToLogin'>;

/**
 * Yup validation schema for registration form
 * Validates email format, password strength, and password confirmation matching
 */
const registrationSchema = Yup.object({
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  email: Yup.string()
    .required('Email is required')
    .test('is-valid-email', 'Please enter a valid email address', value => (value ? isValidEmail(value) : false)),
  password: Yup.string()
    .required('Password is required')
    .test('password-strength', function (value) {
      if (!value) return this.createError({message: 'Password is required'});

      const validation = validatePassword(value);
      if (!validation.isValid) {
        return this.createError({
          message: `Password must have: ${validation.requirements.join(', ')}`,
        });
      }
      return true;
    }),
});

/**
 * Registration form component with comprehensive validation and error handling
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({className, onSuccess, onSwitchToLogin}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auth context
  const {clearError, error: authError, loading: authLoading, signInWithProvider, signUp} = useAuth();

  /**
   * Handles OAuth provider sign up for Discord and Google
   * Clears existing errors and attempts sign up with the specified provider
   */
  const handleOAuthSignUp = async (provider: 'discord' | 'google') => {
    try {
      clearError();
      const result = await signInWithProvider(provider);
      if (result.success) {
        setSubmitSuccess(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error(`${provider} sign up error:`, err);
    }
  };

  /**
   * Handles Discord OAuth button click with error logging
   */
  const handleDiscordClick = () =>
    handleOAuthSignUp('discord').catch(err => console.error('Discord signup error:', err));

  /**
   * Handles Google OAuth button click with error logging
   */
  const handleGoogleClick = () => handleOAuthSignUp('google').catch(err => console.error('Google signup error:', err));

  /**
   * Switches to login form when user clicks sign in link
   */
  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  // Initial form values
  const initialValues: RegisterFormData = {
    confirmPassword: '',
    email: '',
    password: '',
  };

  /**
   * Handles form submission for user registration
   * Validates form data, calls sign up API, and manages form state during submission
   */
  const handleSubmit = async (
    values: RegisterFormData,
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
      const result = await signUp(values.email, values.password);

      if (result.success) {
        setSubmitSuccess(true);
        onSuccess?.();
      } else {
        setFieldError('confirmPassword', result.error ?? 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFieldError('confirmPassword', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>

        <CardDescription>Enter your information to create a new FFXI Complete account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SuccessMessage
          message="Please check your email to confirm your account before signing in."
          show={submitSuccess}
          title="Registration successful!"
        />

        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={registrationSchema}>
          {({errors, isSubmitting, touched, values}) => (
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

              <PasswordFieldWithStrength
                disabled={isSubmitting || authLoading}
                error={errors.password}
                name="password"
                touched={touched.password}
                value={values.password || ''}
              />

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <Field name="confirmPassword">
                  {({field}: FieldProps) => (
                    <Input
                      {...field}
                      aria-describedby={
                        touched.confirmPassword === true && errors.confirmPassword !== undefined
                          ? 'confirm-password-error'
                          : undefined
                      }
                      aria-invalid={touched.confirmPassword === true && errors.confirmPassword !== undefined}
                      disabled={isSubmitting || authLoading}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      type="password"
                    />
                  )}
                </Field>

                {touched.confirmPassword === true && errors.confirmPassword !== undefined && (
                  <div className="text-destructive text-sm" id="confirm-password-error">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* General Errors */}
              {authError != null && (
                <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">{authError}</div>
              )}

              {/* Submit Button */}
              <Button className="w-full" disabled={isSubmitting || authLoading || submitSuccess} type="submit">
                {isSubmitting || authLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form>
          )}
        </Formik>

        <OAuthButtons
          disabled={authLoading || submitSuccess}
          onDiscordClick={handleDiscordClick}
          onGoogleClick={handleGoogleClick}
        />

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>

            <Button disabled={authLoading} onClick={handleSwitchToLogin} size="sm" type="button" variant="link">
              Sign in here
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
