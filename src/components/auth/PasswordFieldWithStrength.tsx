import {Field, type FieldProps} from 'formik';

import {Input} from '@/components/ui/input';
import {validatePassword} from '@/lib/auth';

/**
 * Props for the PasswordFieldWithStrength component
 */
type PasswordFieldWithStrengthProps = {
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error message if validation failed */
  error?: string;
  /** HTML id for the input */
  id?: string;
  /** Field label text */
  label?: string;
  /** Field name for Formik integration */
  name: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field has been touched */
  touched?: boolean;
  /** Current password value */
  value: string;
};

/**
 * Password input field with real-time strength validation and visual feedback
 *
 * Features:
 * - Real-time password strength validation
 * - Visual strength indicator with color coding
 * - Accessibility support with proper ARIA labels
 * - Requirements display for incomplete passwords
 *
 * @example
 * ```tsx
 * <PasswordFieldWithStrength
 *   name="password"
 *   value={values.password}
 *   touched={touched.password}
 *   error={errors.password}
 *   disabled={isSubmitting}
 *   label="Password"
 *   placeholder="Enter a strong password"
 * />
 * ```
 */
export const PasswordFieldWithStrength: React.FC<
  PasswordFieldWithStrengthProps
> = ({
  disabled = false,
  error,
  id,
  label = 'Password',
  name,
  placeholder = 'Enter a strong password',
  touched = false,
  value,
}) => {
  // Get password strength for display
  const passwordValidation = validatePassword(value || '');
  const showPasswordStrength = value.length > 0;
  const hasError = touched && Boolean(error);

  return (
    <div className="space-y-2">
      <label htmlFor={id ?? name} className="text-sm font-medium">
        {label}
      </label>

      <Field name={name}>
        {({field}: FieldProps) => (
          <Input
            {...field}
            aria-describedby={
              hasError
                ? `${name}-error`
                : showPasswordStrength
                  ? `${name}-strength`
                  : undefined
            }
            aria-invalid={hasError}
            disabled={disabled}
            id={id ?? name}
            placeholder={placeholder}
            type="password"
          />
        )}
      </Field>

      {hasError && (
        <div id={`${name}-error`} className="text-sm text-destructive">
          {error ?? 'An error occurred'}
        </div>
      )}

      {showPasswordStrength && !hasError && (
        <div id={`${name}-strength`} className="text-xs text-muted-foreground">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-sm">Password strength:</div>
              <div className="flex gap-1">
                {Array.from({length: 4}, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-4 rounded ${
                      i < passwordValidation.strength
                        ? passwordValidation.strength === 1
                          ? 'bg-red-500'
                          : passwordValidation.strength === 2
                            ? 'bg-yellow-500'
                            : passwordValidation.strength === 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            {passwordValidation.requirements.length > 0 && (
              <div className="text-muted-foreground">
                Still needed: {passwordValidation.requirements.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
