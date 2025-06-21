import {Button} from '@/components/ui/button';

/**
 * Props for the OAuthButtons component
 */
type OAuthButtonsProps = {
  /** Whether OAuth buttons are disabled */
  disabled?: boolean;
  /** Callback for Discord OAuth sign-up */
  onDiscordClick: () => void;
  /** Callback for Google OAuth sign-up */
  onGoogleClick: () => void;
};

/**
 * OAuth provider buttons with consistent styling and divider
 *
 * Features:
 * - Discord and Google OAuth integration
 * - Consistent button styling and layout
 * - Visual divider with "Or continue with" text
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <OAuthButtons
 *   disabled={authLoading}
 *   onDiscordClick={handleDiscordSignUp}
 *   onGoogleClick={handleGoogleSignUp}
 * />
 * ```
 */
export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  disabled = false,
  onDiscordClick,
  onGoogleClick,
}) => {
  return (
    <>
      {/* OAuth Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button disabled={disabled} onClick={onDiscordClick} variant="outline">
          Discord
        </Button>
        <Button disabled={disabled} onClick={onGoogleClick} variant="outline">
          Google
        </Button>
      </div>
    </>
  );
};
