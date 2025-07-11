import {AppBar, LeftSidebar, MainLayout, TabNavigation} from '@/components/layout';
import {FFXIIcon} from '@/icons';

// Mock character data with simplified structure
const mockCharacter = {
  avatar_url: null,
  created_at: new Date().toISOString(),
  id: 'mock-id',
  jobs: {},
  last_updated: new Date().toISOString(),
  linkshell_id: null,
  mounts: {},
  server: 'Asura',
  skills: {},
  trusts: {},
  user_id: 'mock-user',
  username: 'Noranda',
};

const mockCollections = [
  {id: 'abilities', label: 'Abilities'},
  {id: 'magic', label: 'Magic'},
  {id: 'status', label: 'Status'},
];

const mockProgressData = {
  abilities: {completed: 5, total: 8},
  magic: {completed: 4, total: 7},
  status: {completed: 45, total: 627},
};

/**
 * Main application component showcasing the hybrid FFXI icon system
 * with legacy backward compatibility and authentic/custom icon integration.
 */
function App() {
  return (
    <MainLayout
      footer={<div className="bg-card text-muted-foreground p-4 text-center text-sm">© 2025 FFXI Complete</div>}
      header={<AppBar onCollectionSettingsToggle={() => {}} onLoginClick={() => {}} />}
      leftSidebar={
        <LeftSidebar
          character={{
            ...mockCharacter,
            is_public: false,
            name: mockCharacter.username,
            privacy_updated_at: mockCharacter.created_at,
            public_url_slug: null,
            updated_at: mockCharacter.last_updated,
          }}
        />
      }
      tabNavigation={
        <TabNavigation
          activeTab="status"
          collections={mockCollections}
          onTabChange={() => {}}
          progressData={mockProgressData}
        />
      }
    >
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">FFXI Icon System Demo</h2>

            <div className="mb-6 text-slate-300">
              Authentic FFXI icons from Tetsouo/FfxiIconsHD - 642 icons across 3 categories
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">Status Effects</h3>

                <div className="flex gap-3">
                  <FFXIIcon category="status" name="poison" size="lg" />
                  <FFXIIcon category="status" name="paralysis" size="lg" />
                  <FFXIIcon category="status" name="blindness" size="lg" />
                  <FFXIIcon category="status" name="silence" size="lg" />
                  <FFXIIcon category="status" name="haste" size="lg" />
                  <FFXIIcon category="status" name="protect" size="lg" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">Magic Spells</h3>

                <div className="flex gap-3">
                  <FFXIIcon category="magic" name="cure" size="lg" />
                  <FFXIIcon category="magic" name="fire" size="lg" />
                  <FFXIIcon category="magic" name="blizzard" size="lg" />
                  <FFXIIcon category="magic" name="thunder" size="lg" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">Status Effects</h3>

                <div className="flex gap-3">
                  <FFXIIcon category="status" name="haste" size="lg" />
                  <FFXIIcon category="status" name="protect" size="lg" />
                  <FFXIIcon category="status" name="shell" size="lg" />
                  <FFXIIcon category="status" name="regen" size="lg" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">Negative Effects</h3>

                <div className="flex gap-3">
                  <FFXIIcon category="status" name="curse" size="lg" />
                  <FFXIIcon category="status" name="doom" size="lg" />
                  <FFXIIcon category="status" name="virus" size="lg" />
                  <FFXIIcon category="status" name="disease" size="lg" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-white">Size Variations</h3>

              <div className="flex items-center gap-3">
                <FFXIIcon category="status" name="poison" size="xs" />
                <FFXIIcon category="status" name="poison" size="sm" />
                <FFXIIcon category="status" name="poison" size="md" />
                <FFXIIcon category="status" name="poison" size="lg" />
                <FFXIIcon category="status" name="poison" size="xl" />
                <FFXIIcon category="status" name="poison" size="xxl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
