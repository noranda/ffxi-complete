import type {IconEntry} from './types';

import IconCard from './IconCard';

type IconGridProps = {
  copiedIcon: null | string;
  displayedIcons: IconEntry[];
  editingIcon: null | number;
  filteredIconsLength: number;
  hasMoreIcons: boolean;
  isEditMode: boolean;
  loadingRef: React.RefObject<HTMLDivElement | null>;
  onCancelEdit: () => void;
  onCopyIconUsage: (icon: IconEntry) => void;
  onSaveIconTags: (iconId: number, tags: string[]) => void;
  onStartEdit: (iconId: number) => void;
};

/**
 * Grid layout component for displaying icons with infinite scroll
 */
const IconGrid: React.FC<IconGridProps> = ({
  copiedIcon,
  displayedIcons,
  editingIcon,
  filteredIconsLength,
  hasMoreIcons,
  isEditMode,
  loadingRef,
  onCancelEdit,
  onCopyIconUsage,
  onSaveIconTags,
  onStartEdit,
}) => (
  <>
    {/* Icon Grid */}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {displayedIcons.map(icon => (
        <IconCard
          icon={icon}
          isCopied={copiedIcon === icon.name}
          isEditing={editingIcon === icon.id}
          isEditMode={isEditMode}
          key={`${icon.category}-${icon.name}`}
          onCancelEdit={onCancelEdit}
          onCopy={() => onCopyIconUsage(icon)}
          onSaveTags={(tags: string[]) => onSaveIconTags(icon.id, tags)}
          onStartEdit={() => onStartEdit(icon.id)}
        />
      ))}
    </div>

    {/* Loading trigger for infinite scroll */}
    {hasMoreIcons && (
      <div className="py-8" ref={loadingRef}>
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            <span>Loading more icons...</span>
          </div>
        </div>
      </div>
    )}

    {/* No Results */}
    {filteredIconsLength === 0 && (
      <div className="py-16 text-center">
        <div className="text-xl text-slate-400">No icons found</div>
        <div className="mt-2 text-sm text-slate-500">Try adjusting your search terms or category filter</div>
      </div>
    )}
  </>
);

export default IconGrid;
