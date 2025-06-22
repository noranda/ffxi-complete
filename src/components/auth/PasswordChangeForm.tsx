import {ErrorMessage, Field, Form, Formik, type FormikHelpers} from 'formik';
import * as Yup from 'yup';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';

import {useAuth} from '../../contexts/AuthContext';

type FormStatus = {
  message: string;
  type: 'error' | 'success';
};

/**
 * Password change form component
 *
 * Uses Formik for form state management and Yup for validation.
 * Handles password change functionality with validation and confirmation.
 * Includes proper error handling and loading states.
 */
export const PasswordChangeForm: React.FC = () => {
  const {updatePassword} = useAuth();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
      .required('Please confirm your password'),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  // Initial form values
  const initialValues = {
    confirmPassword: '',
    newPassword: '',
  };

  /**
   * Handles form submission with validation and API calls
   */
  const handleSubmit = async (
    values: typeof initialValues,
    {resetForm, setStatus, setSubmitting}: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const result = await updatePassword(values.newPassword);

      if (result.error) {
        setStatus({
          message: typeof result.error === 'string' ? result.error : 'Failed to update password',
          type: 'error',
        });
      } else {
        setStatus({message: 'Password changed successfully', type: 'success'});
        // Clear form after showing success message for 2 seconds
        setTimeout(() => resetForm(), 2000);
      }
    } catch {
      setStatus({message: 'Failed to update password', type: 'error'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>

      <CardContent>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {({
            isSubmitting,
            status,
            values,
          }: {
            isSubmitting: boolean;
            status?: FormStatus;
            values: typeof initialValues;
          }) => (
            <Form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="newPassword">
                  New Password
                </label>

                <Field as={Input} id="newPassword" name="newPassword" type="password" />

                <ErrorMessage name="newPassword">
                  {(message: string) =>
                    message ? (
                      <div className="text-destructive mt-1 text-sm" role="alert">
                        {message}
                      </div>
                    ) : null
                  }
                </ErrorMessage>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" />

                <ErrorMessage name="confirmPassword">
                  {(message: string) =>
                    message ? (
                      <div className="text-destructive mt-1 text-sm" role="alert">
                        {message}
                      </div>
                    ) : null
                  }
                </ErrorMessage>
              </div>

              {status && (
                <div
                  aria-live="polite"
                  className={cn('text-sm', status.type === 'success' ? 'text-green-600' : 'text-destructive')}
                  role="alert"
                >
                  {status.message}
                </div>
              )}

              <Button disabled={isSubmitting || !values.newPassword || !values.confirmPassword} type="submit">
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
