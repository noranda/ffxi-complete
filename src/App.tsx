/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import './App.css';

import {AppBar, BottomNavigation, LeftSidebar, MainLayout} from '@/components/layout';

// Mock character data for demo
const mockCharacter = {
  created_at: '2024-01-01T00:00:00Z',
  id: 'demo-character-id',
  is_public: false,
  name: 'Thalassa',
  privacy_updated_at: '2024-01-01T00:00:00Z',
  public_url_slug: 'thalassa-bahamut',
  server: 'Bahamut',
  updated_at: '2024-01-01T00:00:00Z',
  user_id: 'demo-user-id',
};

/**
 * Root application component
 */
const App: React.FC = () => (
  <MainLayout
    footer={
      <BottomNavigation
        activeTab="jobs"
        character={mockCharacter}
        onTabChange={tab => console.log('Tab changed to:', tab)}
      />
    }
    header={
      <AppBar
        onCollectionSettingsToggle={() => console.log('Collection settings toggled')}
        onLoginClick={() => console.log('Login clicked')}
      />
    }
    leftSidebar={<LeftSidebar character={mockCharacter} />}
  >
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">FFXI Complete Demo</h1>

      <div className="text-muted-foreground mb-4">
        This demo shows the BottomNavigation component on mobile and LeftSidebar on desktop.
      </div>

      <div className="text-muted-foreground mb-4">Try resizing your browser window to see the responsive behavior:</div>

      <ul className="text-muted-foreground list-disc space-y-2 pl-6">
        <li>
          <strong>Desktop (md+):</strong> LeftSidebar visible, BottomNavigation hidden
        </li>

        <li>
          <strong>Mobile (&lt; md):</strong> LeftSidebar hidden, BottomNavigation visible at bottom
        </li>

        <li>
          <strong>Character controls:</strong> Switch and menu buttons (currently just for demo)
        </li>

        <li>
          <strong>Navigation tabs:</strong> Jobs, Skills, Trusts (click to see console output)
        </li>
      </ul>
    </div>
  </MainLayout>
);

export default App;
