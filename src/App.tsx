/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import './App.css';

import {MainLayout} from '@/components/layout/MainLayout';

/**
 * Root application component
 */
const App: React.FC = () => (
  <MainLayout>
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">FFXI Complete</h1>

        <div className="text-muted-foreground mt-2">
          Track your Final Fantasy XI character progress across jobs, skills, and collections
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-muted-foreground">
          Welcome to FFXI Complete! This application will help you track your character's progress across all aspects of
          Final Fantasy XI.
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Character Management</h3>

            <div className="text-muted-foreground text-sm">
              Create and manage multiple characters with detailed progress tracking.
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Job Progression</h3>

            <div className="text-muted-foreground text-sm">Track levels and progress across all 32 FFXI jobs.</div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Skills & Collections</h3>

            <div className="text-muted-foreground text-sm">Monitor skill levels and collection completion status.</div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Public Sharing</h3>

            <div className="text-muted-foreground text-sm">Share your character progress with the community.</div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default App;
