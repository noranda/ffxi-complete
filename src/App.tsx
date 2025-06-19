/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import reactLogo from './assets/react.svg';

import './App.css';

import viteLogo from '/vite.svg';

const App: React.FC<unknown> = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center mb-8">
          <a
            className="mr-4"
            href="https://vite.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt="Vite logo" className="h-24 w-24" src={viteLogo} />
          </a>

          <a href="https://react.dev" rel="noopener noreferrer" target="_blank">
            <img
              alt="React logo"
              className="h-24 w-24 animate-spin"
              src={reactLogo}
            />
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">FFXI-Complete</h1>

        <div className="flex justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Setup Complete!</CardTitle>

              <CardDescription>
                TailwindCSS v4 with dark theme and shadcn/ui are working!
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <div className="text-muted-foreground">
                Edit{' '}
                <code className="bg-muted px-2 py-1 rounded text-muted-foreground">
                  src/App.tsx
                </code>{' '}
                to test HMR
              </div>

              <Button onClick={() => setCount(count => count + 1)}>
                count is {count}
              </Button>

              <div className="text-sm text-muted-foreground">
                Click the button to test React state updates
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
