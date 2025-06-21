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

const App: React.FC<unknown> = () => {
  const {user, loading, signUp, signIn, signInWithProvider, signOut} =
    useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<
    'testing' | 'connected' | 'error'
  >('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    // Test Supabase connection on component mount
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

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'text-yellow-500';
      case 'connected':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...';
      case 'connected':
        return 'Connected to Supabase ✅';
      case 'error':
        return 'Connection failed ❌';
      default:
        return 'Unknown status';
    }
  };

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">FFXI Complete</h1>
          <p className="text-muted-foreground">
            Track your Final Fantasy XI character progress across jobs, skills,
            and collections
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
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
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm text-destructive">
                      <strong>Error:</strong> {errorMessage}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please check your .env.local file and ensure you have the
                      correct Supabase URL and anon key.
                    </p>
                  </div>
                )}

                {connectionStatus === 'connected' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      🎉 Great! Your Supabase backend is connected and ready.
                      Next step: Set up the database schema.
                    </p>
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
              <div className="flex gap-2 mb-4">
                <Button
                  variant={!showRegisterForm ? 'default' : 'outline'}
                  onClick={() => {
                    setShowRegisterForm(false);
                  }}
                  size="sm"
                >
                  Test Interface
                </Button>
                <Button
                  variant={showRegisterForm ? 'default' : 'outline'}
                  onClick={() => {
                    setShowRegisterForm(true);
                  }}
                  size="sm"
                >
                  Register Form
                </Button>
              </div>

              {showRegisterForm ? (
                <div className="max-w-md mx-auto">
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
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                      }}
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                      }}
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
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      User ID: {user?.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Email: {user?.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
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
                <div className="p-3 bg-muted rounded-md text-sm">{message}</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Phase 2: Database</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User authentication</li>
                    <li>• Character management</li>
                    <li>• Database schema</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Phase 3: Tracking</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
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
