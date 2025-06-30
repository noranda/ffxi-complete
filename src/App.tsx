/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import './App.css';

import {AppBar, LeftSidebar, MainLayout} from '@/components/layout';
import {Typography} from '@/components/ui';

// Mock character data for demonstration
const mockCharacter = {
  created_at: new Date().toISOString(),
  id: 'demo-character-id',
  is_public: false,
  name: 'Adelheid',
  privacy_updated_at: new Date().toISOString(),
  public_url_slug: 'adelheid-bahamut',
  server: 'Bahamut',
  updated_at: new Date().toISOString(),
  user_id: 'demo-user',
};

/**
 * Root application component
 */
const App: React.FC = () => (
  <MainLayout
    header={
      <AppBar
        onCollectionSettingsToggle={() => console.log('Collection settings toggled')}
        onLoginClick={() => console.log('Login clicked')}
      />
    }
    leftSidebar={<LeftSidebar character={mockCharacter} />}
  >
    <div className="p-6">
      <Typography className="text-2xl font-bold" variant="h1">
        FFXI Complete
      </Typography>

      <Typography className="text-muted-foreground mt-2" variant="p">
        Character progression tracking application
      </Typography>
    </div>
  </MainLayout>
);

export default App;
