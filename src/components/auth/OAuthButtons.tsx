import {Button} from '@/components/ui';

/**
 * Props for the OAuthButtons component
 */
export type OAuthButtonsProps = {
  /** Whether OAuth buttons are disabled */
  disabled?: boolean;
  /** Discord error message */
  discordError?: string;
  /** Discord loading state */
  discordLoading?: boolean;
  /** Google error message */
  googleError?: string;
  /** Google loading state */
  googleLoading?: boolean;
  /** Callback for Discord OAuth sign-up */
  onDiscordClick: () => void;
  /** Callback for Discord retry */
  onDiscordRetry?: () => void;
  /** Callback for Google OAuth sign-up */
  onGoogleClick: () => void;
  /** Callback for Google retry */
  onGoogleRetry?: () => void;
  /** Show Discord retry button */
  showDiscordRetry?: boolean;
  /** Show Google retry button */
  showGoogleRetry?: boolean;
};

/**
 * OAuth authentication buttons for Discord and Google sign-in
 * Provides consistent styling, individual loading states, error handling, and retry functionality
 */
export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  disabled = false,
  discordError,
  discordLoading = false,
  googleError,
  googleLoading = false,
  onDiscordClick,
  onDiscordRetry,
  onGoogleClick,
  onGoogleRetry,
  showDiscordRetry = false,
  showGoogleRetry = false,
}) => {
  const discordErrorId = 'discord-error';
  const googleErrorId = 'google-error';

  return (
    <>
      {/* OAuth Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or continue with</span>
        </div>
      </div>

      {/* Error Messages */}
      {discordError && (
        <div
          aria-describedby={discordErrorId}
          aria-live="polite"
          className="text-destructive text-sm"
          id={discordErrorId}
          role="alert"
        >
          {discordError}
          {showDiscordRetry && onDiscordRetry && !discordLoading && (
            <Button className="ml-2 h-auto p-1 text-xs" onClick={onDiscordRetry} size="sm" variant="link">
              Retry Discord
            </Button>
          )}
        </div>
      )}

      {googleError && (
        <div
          aria-describedby={googleErrorId}
          aria-live="polite"
          className="text-destructive text-sm"
          id={googleErrorId}
          role="alert"
        >
          {googleError}
          {showGoogleRetry && onGoogleRetry && !googleLoading && (
            <Button className="ml-2 h-auto p-1 text-xs" onClick={onGoogleRetry} size="sm" variant="link">
              Retry Google
            </Button>
          )}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          aria-busy={discordLoading}
          aria-describedby={discordError && !discordLoading ? discordErrorId : undefined}
          disabled={disabled || discordLoading}
          onClick={onDiscordClick}
          variant="outline"
        >
          {discordLoading ? 'Signing in with Discord...' : 'Discord'}
        </Button>

        <Button
          aria-busy={googleLoading}
          aria-describedby={googleError && !googleLoading ? googleErrorId : undefined}
          disabled={disabled || googleLoading}
          onClick={onGoogleClick}
          variant="outline"
        >
          {googleLoading ? 'Signing in with Google...' : 'Google'}
        </Button>
      </div>
    </>
  );
};
