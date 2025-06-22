/**
 * Password reset form with email validation and success states
 */

import {Field, type FieldProps, Form, Formik} from 'formik';
import {useState} from 'react';
import * as Yup from 'yup';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useAuth} from '@/contexts/AuthContext';
import {isValidEmail} from '@/lib/auth';

import type {AuthCallbacks, BaseAuthFormProps, PasswordResetFormData} from './types';

import {SuccessMessage} from './SuccessMessage';

/**
 * Password reset form props
 * Extends shared auth component patterns for consistency
 */
type PasswordResetFormProps = BaseAuthFormProps & Pick<AuthCallbacks, 'onCancel' | 'onSwitchToLogin'>;

/**
 * Yup validation schema for password reset form
 * Validates email format and requirement
 */
const passwordResetSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .test('is-valid-email', 'Please enter a valid email address', value => (value ? isValidEmail(value) : false)),
});

/**
 * Password reset form component with comprehensive error handling
 * Allows users to request a password reset email for their account
 */
export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({className, onCancel, onSwitchToLogin}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Auth context
  const {clearError, error: authError, loading: authLoading, resetPassword} = useAuth();

  /**
   * Handles back to login navigation
   */
  const handleBackToLogin = () => onSwitchToLogin?.();

  /**
   * Handles cancel action
   */
  const handleCancel = () => onCancel?.();

  // Initial form values
  const initialValues: PasswordResetFormData = {
    email: '',
  };

  /**
   * Handles form submission for password reset request
   * Validates email, sends reset request, and manages form state
   */
  const handleSubmit = async (
    values: PasswordResetFormData,
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
      const result = await resetPassword(values.email);

      if (result.success) {
        setResetEmail(values.email);
        setSubmitSuccess(true);
      } else {
        setFieldError('email', result.error ?? 'Password reset failed');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setFieldError('email', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show success state after successful reset request
  if (submitSuccess) {
    return (
      <Card className={className}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>

          <CardDescription>Password reset instructions have been sent</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <SuccessMessage
            message={`We've sent password reset instructions to ${resetEmail}. Please check your email and follow the link to reset your password.`}
            show={true}
            title="Email Sent Successfully"
          />

          <div className="text-muted-foreground text-sm">
            If you don't see the email in your inbox, please check your spam folder. The reset link will expire in 1
            hour for security.
          </div>

          {/* Navigation buttons */}
          <div className="flex space-x-2">
            {onSwitchToLogin && (
              <Button className="flex-1" onClick={handleBackToLogin} type="button" variant="outline">
                Back to Sign In
              </Button>
            )}

            <Button
              className="flex-1"
              onClick={() => {
                setSubmitSuccess(false);
                setResetEmail('');
              }}
              type="button"
            >
              Send Another Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>

        <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={passwordResetSchema}>
          {({errors, isSubmitting, touched}) => (
            <Form className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reset-email">
                  Email Address
                </label>

                <Field name="email">
                  {({field}: FieldProps) => (
                    <Input
                      {...field}
                      aria-describedby={
                        touched.email === true && errors.email !== undefined ? 'reset-email-error' : undefined
                      }
                      aria-invalid={touched.email === true && errors.email !== undefined}
                      disabled={isSubmitting || authLoading}
                      id="reset-email"
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
                  <div className="text-destructive text-sm" id="reset-email-error">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* General Errors */}
              {authError != null && (
                <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">{authError}</div>
              )}

              {/* Submit Button */}
              <Button className="w-full" disabled={isSubmitting || authLoading} type="submit">
                {isSubmitting || authLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
              </Button>
            </Form>
          )}
        </Formik>

        {/* Navigation */}
        <div className="flex space-x-2">
          {onSwitchToLogin && (
            <Button
              className="flex-1"
              disabled={authLoading}
              onClick={handleBackToLogin}
              type="button"
              variant="outline"
            >
              Back to Sign In
            </Button>
          )}

          {onCancel && (
            <Button className="flex-1" disabled={authLoading} onClick={handleCancel} type="button" variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
