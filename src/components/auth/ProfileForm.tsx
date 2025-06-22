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
 * Profile form component for editing user information
 *
 * Uses Formik for form state management and Yup for validation.
 * Handles profile data display, validation, and updates including
 * full name, display name, and email fields.
 */
export const ProfileForm: React.FC = () => {
  const {updateProfile, user} = useAuth();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    displayName: Yup.string().matches(
      /^[a-zA-Z0-9_]*$/,
      'Display name can only contain letters, numbers, and underscores'
    ),
    fullName: Yup.string().required('Full name is required'),
  });

  // Initial form values
  const initialValues = {
    displayName: (user?.user_metadata?.display_name as string) || '',
    fullName: (user?.user_metadata?.full_name as string) || '',
  };

  /**
   * Handles form submission with validation and API calls
   */
  const handleSubmit = async (
    values: typeof initialValues,
    {setStatus, setSubmitting}: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const result = await updateProfile({
        display_name: values.displayName,
        full_name: values.fullName,
      });

      if (result.error) {
        setStatus({
          message: typeof result.error === 'string' ? result.error : 'Failed to update profile',
          type: 'error',
        });
      } else {
        setStatus({message: 'Profile updated successfully', type: 'success'});
      }
    } catch {
      setStatus({message: 'Failed to update profile', type: 'error'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and preferences</CardDescription>
      </CardHeader>

      <CardContent>
        <Formik
          enableReinitialize={true} // Update form when user data changes
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({
            dirty,
            isSubmitting,
            resetForm,
            status,
          }: {
            dirty: boolean;
            isSubmitting: boolean;
            resetForm: () => void;
            status?: FormStatus;
          }) => (
            <Form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="fullName">
                  Full Name
                </label>

                <Field as={Input} id="fullName" name="fullName" type="text" />

                <ErrorMessage name="fullName">
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
                <label className="mb-1 block text-sm font-medium" htmlFor="displayName">
                  Display Name
                </label>

                <Field as={Input} id="displayName" name="displayName" type="text" />

                <ErrorMessage name="displayName">
                  {(message: string) =>
                    message ? (
                      <div className="text-destructive mt-1 text-sm" role="alert">
                        {message}
                      </div>
                    ) : null
                  }
                </ErrorMessage>
              </div>

              {dirty && <div className="text-muted-foreground text-sm">You have unsaved changes</div>}

              {status && (
                <div
                  aria-live="polite"
                  className={cn('text-sm', status.type === 'success' ? 'text-green-600' : 'text-destructive')}
                  role="alert"
                >
                  {status.message}
                </div>
              )}

              {isSubmitting && <div className="text-muted-foreground text-sm">Updating profile...</div>}

              <div className="flex gap-2">
                <Button disabled={!dirty || isSubmitting} type="submit">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button disabled={!dirty} onClick={() => resetForm()} type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
