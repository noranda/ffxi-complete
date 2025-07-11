import type {IconCategory} from '@/icons/types';

type IconSearchProps = {
  categoryCounts: Record<string, number>;
  displayedIconsLength: number;
  filteredIconsLength: number;
  hasMoreIcons: boolean;
  onCategoryChange: (category: 'all' | IconCategory) => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
  selectedCategory: 'all' | IconCategory;
};

/**
 * Search and filter controls for the icon library
 */
const IconSearch: React.FC<IconSearchProps> = ({
  categoryCounts,
  displayedIconsLength,
  filteredIconsLength,
  hasMoreIcons,
  onCategoryChange,
  onSearchChange,
  searchTerm,
  selectedCategory,
}) => (
  <div className="mb-8 space-y-4">
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Search Input */}
      <div className="flex-1">
        <input
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search icons by name, description, or tags..."
          type="text"
          value={searchTerm}
        />
      </div>

      {/* Category Filter */}
      <div className="sm:w-48">
        <select
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
          onChange={event => onCategoryChange(event.target.value as 'all' | IconCategory)}
          value={selectedCategory}
        >
          <option value="all">All Categories ({categoryCounts.all})</option>

          {Object.entries(categoryCounts)
            .filter(([category]) => category !== 'all')
            .map(([category, count]) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
              </option>
            ))}
        </select>
      </div>
    </div>

    {/* Results Count */}
    <div className="text-sm text-slate-400">
      Showing {displayedIconsLength} of {filteredIconsLength} icons
      {hasMoreIcons && ' (scroll down for more)'}
    </div>
  </div>
);

export default IconSearch;
