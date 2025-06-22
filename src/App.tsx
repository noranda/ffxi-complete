/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import './App.css';

import {useCallback, useEffect, useState} from 'react';

import {RegisterForm} from '@/components/auth/RegisterForm';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useAuth} from '@/hooks';
import {supabase} from '@/lib/supabase';

/**
 * Root application component with authentication testing and Supabase connection status
 */
const App: React.FC<unknown> = () => {
  const {loading, signIn, signInWithProvider, signOut, signUp, user} =
    useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'error' | 'testing'
  >('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    /**
     * Tests Supabase connection by attempting to retrieve current session
     */
    const testConnection = async () => {
      try {
        // Try to access Supabase (this will work even without tables)
        const {error} = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setConnectionStatus('connected');
        console.log('✅ Supabase connection successful');
      } catch (err) {
        setConnectionStatus('error');
        const message = err instanceof Error ? err.message : 'Unknown error';
        setErrorMessage(message);
        console.error('❌ Supabase connection failed:', err);
      }
    };

    void testConnection();
  }, []);

  /**
   * Returns the appropriate CSS color class based on connection status
   */
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'testing':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  /**
   * Returns user-friendly status text with icons based on connection state
   */
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to Supabase ✅';
      case 'error':
        return 'Connection failed ❌';
      case 'testing':
        return 'Testing connection...';
      default:
        return 'Unknown status';
    }
  };

  /**
   * Handles user registration with email and password including error handling
   */
  const handleSignUp = useCallback(async () => {
    try {
      setMessage('Signing up...');
      const result = await signUp(email, password);
      if (result.success) {
        setMessage('✅ Sign up successful! Check your email for confirmation.');
      } else {
        setMessage(`❌ Sign up failed: ${result.error}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMessage}`);
    }
  }, [email, password, signUp]);

  /**
   * Handles user sign-in with email and password authentication
   */
  const handleSignIn = async () => {
    try {
      setMessage('Signing in...');
      const result = await signIn(email, password);
      if (result.success) {
        setMessage('✅ Sign in successful!');
      } else {
        setMessage(`❌ Sign in failed: ${result.error}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMessage}`);
    }
  };

  /**
   * Handles OAuth authentication for Discord and Google providers
   */
  const handleOAuthSignIn = async (provider: 'discord' | 'google') => {
    try {
      setMessage(`Signing in with ${provider}...`);
      const result = await signInWithProvider(provider);
      if (result.success) {
        setMessage(`✅ ${provider} sign in initiated!`);
      } else {
        setMessage(`❌ ${provider} sign in failed: ${result.error}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMessage}`);
    }
  };

  /**
   * Handles user sign-out and clears session state
   */
  const handleSignOut = async () => {
    try {
      setMessage('Signing out...');
      const result = await signOut();
      if (result.success) {
        setMessage('✅ Signed out successfully!');
      } else {
        setMessage(`❌ Sign out failed: ${result.error}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">FFXI Complete</h1>

          <div className="text-muted-foreground">
            Track your Final Fantasy XI character progress across jobs, skills,
            and collections
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Backend Connection Status</CardTitle>

              <CardDescription>
                Testing connection to Supabase backend
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className={`font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </div>

                {connectionStatus === 'error' && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
                    <div className="text-destructive text-sm">
                      <strong>Error:</strong>

                      {errorMessage}
                    </div>

                    <div className="text-muted-foreground mt-2 text-sm">
                      Please check your .env.local file and ensure you have the
                      correct Supabase URL and anon key.
                    </div>
                  </div>
                )}

                {connectionStatus === 'connected' && (
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <div className="text-sm text-green-700 dark:text-green-300">
                      🎉 Great! Your Supabase backend is connected and ready.
                      Next step: Set up the database schema.
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FFXI Complete - Auth Test</CardTitle>

              <CardDescription>
                {user
                  ? `Welcome, ${user.email}!`
                  : 'Test authentication system'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Toggle between test interface and RegisterForm */}
              <div className="mb-4 flex gap-2">
                <Button
                  onClick={() => {
                    setShowRegisterForm(false);
                  }}
                  size="sm"
                  variant={!showRegisterForm ? 'default' : 'outline'}
                >
                  Test Interface
                </Button>

                <Button
                  onClick={() => {
                    setShowRegisterForm(true);
                  }}
                  size="sm"
                  variant={showRegisterForm ? 'default' : 'outline'}
                >
                  Register Form
                </Button>
              </div>

              {showRegisterForm ? (
                <div className="mx-auto max-w-md">
                  <RegisterForm
                    onSuccess={() => {
                      setMessage(
                        '✅ Registration successful from RegisterForm!'
                      );
                      setShowRegisterForm(false);
                    }}
                    onSwitchToLogin={() => {
                      setMessage(
                        'Switch to login clicked (login form coming in task 3.3)'
                      );
                      setShowRegisterForm(false);
                    }}
                  />
                </div>
              ) : !user ? (
                <>
                  <div className="space-y-2">
                    <Input
                      onChange={e => {
                        setEmail(e.target.value);
                      }}
                      placeholder="Email"
                      type="email"
                      value={email}
                    />

                    <Input
                      onChange={e => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Password"
                      type="password"
                      value={password}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        void handleSignUp();
                      }}
                    >
                      Sign Up
                    </Button>

                    <Button
                      className="w-full"
                      onClick={() => {
                        void handleSignIn();
                      }}
                      variant="outline"
                    >
                      Sign In
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        void handleOAuthSignIn('discord');
                      }}
                      variant="secondary"
                    >
                      Sign in with Discord
                    </Button>

                    <Button
                      className="w-full"
                      onClick={() => {
                        void handleOAuthSignIn('google');
                      }}
                      variant="secondary"
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2 text-center">
                    <div className="text-muted-foreground text-sm">
                      User ID: {user?.id}
                    </div>

                    <div className="text-muted-foreground text-sm">
                      Email: {user?.email}
                    </div>

                    <div className="text-muted-foreground text-sm">
                      Created:{' '}
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      void handleSignOut();
                    }}
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </div>
              )}

              {message && (
                <div className="bg-muted rounded-md p-3 text-sm">{message}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>

              <CardDescription>
                Features we'll build in the next phases
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Phase 2: Database</h3>

                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• User authentication</li>
                    <li>• Character management</li>
                    <li>• Database schema</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Phase 3: Tracking</h3>

                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Job progress</li>
                    <li>• Skills tracking</li>
                    <li>• Collections system</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button className="mr-4">Get Started (Coming Soon)</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
