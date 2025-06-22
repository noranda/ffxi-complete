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
 * OAuth authentication buttons for Discord and Google sign-in
 * Provides consistent styling and disabled state handling
 */
export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  disabled = false,
  onDiscordClick,
  onGoogleClick,
}) => (
  <>
    {/* OAuth Divider */}
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>

      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background text-muted-foreground px-2">
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
