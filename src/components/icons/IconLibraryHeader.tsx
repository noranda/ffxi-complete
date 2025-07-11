import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

type IconLibraryHeaderProps = {
  allIconsLength: number;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  saveMessage?: string;
  saveStatus?: 'error' | 'idle' | 'saving' | 'success';
  tagsLoading?: boolean;
};

/**
 * Header component for the icon library with title and controls
 */
const IconLibraryHeader: React.FC<IconLibraryHeaderProps> = ({
  allIconsLength,
  isEditMode,
  onToggleEditMode,
  saveMessage,
  saveStatus,
  tagsLoading = false,
}) => (
  <header className="bg-[#21252a] px-6 py-4 shadow-lg">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button asChild variant="default">
          <a href="/">
            <FontAwesomeIcon icon={faArrowLeft} size="xs" /> Back to App
          </a>
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-white">FFXI Icon Library</h1>
          <div className="text-sm text-slate-400">Development Tool</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Save Status Indicator */}
        {(saveStatus !== 'idle' && saveMessage) || tagsLoading ? (
          <div
            className={cn(
              'flex items-center gap-2 rounded px-3 py-1 text-sm',
              tagsLoading && 'bg-blue-900/50 text-blue-300',
              saveStatus === 'saving' && 'bg-blue-900/50 text-blue-300',
              saveStatus === 'success' && 'bg-green-900/50 text-green-300',
              saveStatus === 'error' && 'bg-red-900/50 text-red-300'
            )}
          >
            {(saveStatus === 'saving' || tagsLoading) && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
            )}
            {saveStatus === 'success' && <span className="text-green-400">✓</span>}
            {saveStatus === 'error' && <span className="text-red-400">✗</span>}

            <span>{tagsLoading ? 'Loading tags from database...' : saveMessage}</span>
          </div>
        ) : null}

        <Button
          className={cn(
            'text-white transition-colors',
            isEditMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-600 hover:bg-slate-700'
          )}
          onClick={onToggleEditMode}
          variant="secondary"
        >
          {isEditMode ? 'Exit Edit Mode' : 'Edit Tags'}
        </Button>
      </div>
    </div>

    <div className="container mx-auto px-6 py-4">
      <div className="text-slate-300">
        Browse all {allIconsLength} authentic FFXI icons.
        {isEditMode
          ? ' Click the edit button on any icon to modify its tags.'
          : ' Click any icon to copy its usage code.'}
      </div>
    </div>
  </header>
);

export default IconLibraryHeader;
