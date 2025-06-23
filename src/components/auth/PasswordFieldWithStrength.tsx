import {Field, type FieldProps} from 'formik';

import {Input} from '@/components/ui';
import {validatePassword} from '@/lib/auth';
import {cn} from '@/lib/utils';

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
 * Password input field with real-time strength validation and visual feedback.
 * Features real-time password strength validation, visual strength indicator with color coding,
 * accessibility support with proper ARIA labels, and requirements display for incomplete passwords.
 */
export const PasswordFieldWithStrength: React.FC<PasswordFieldWithStrengthProps> = ({
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
      <label className="text-sm font-medium" htmlFor={id ?? name}>
        {label}
      </label>

      <Field name={name}>
        {({field}: FieldProps) => (
          <Input
            {...field}
            aria-describedby={hasError ? `${name}-error` : showPasswordStrength ? `${name}-strength` : undefined}
            aria-invalid={hasError}
            disabled={disabled}
            id={id ?? name}
            placeholder={placeholder}
            type="password"
          />
        )}
      </Field>

      {hasError && (
        <div className="text-destructive text-sm" id={`${name}-error`}>
          {error ?? 'An error occurred'}
        </div>
      )}

      {showPasswordStrength && !hasError && (
        <div className="text-muted-foreground text-xs" id={`${name}-strength`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-sm">Password strength:</div>

              <div className="flex gap-1">
                {Array.from({length: 4}, (_, i) => (
                  <div
                    className={cn(
                      'h-1 w-4 rounded',
                      i < passwordValidation.strength
                        ? passwordValidation.strength === 1
                          ? 'bg-red-500'
                          : passwordValidation.strength === 2
                            ? 'bg-yellow-500'
                            : passwordValidation.strength === 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                        : 'bg-gray-200'
                    )}
                    key={i}
                  />
                ))}
              </div>
            </div>

            {passwordValidation.requirements.length > 0 && (
              <div className="text-muted-foreground">Still needed: {passwordValidation.requirements.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
