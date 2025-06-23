/**
 * Main application component with enhanced development environment features:
 * - Hot Module Replacement (HMR) with error overlay
 * - Fast Refresh for React components
 * - Source maps for debugging
 * - Optimized dependency pre-bundling
 */
import './App.css';

import {AppBar, MainLayout} from '@/components/layout';

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
  />
);

export default App;
