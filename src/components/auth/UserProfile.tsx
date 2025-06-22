import {useAuth} from '../../contexts/AuthContext';
import {PasswordChangeForm} from './PasswordChangeForm';
import {ProfileForm} from './ProfileForm';

/**
 * User profile management component
 *
 * Orchestrates profile information and password change forms.
 * Provides loading and authentication states.
 */
export const UserProfile: React.FC = () => {
  const {loading, user} = useAuth();

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span>Loading...</span>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <span>Please log in to view your profile.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <ProfileForm />
      <PasswordChangeForm />
    </div>
  );
};
