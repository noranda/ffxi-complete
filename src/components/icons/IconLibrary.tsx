import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import type {IconCategory} from '@/icons/types';

// Import icon registry
import iconRegistry from '@/icons/registry.json';
import {IconTagsService} from '@/lib/services/iconTagsService';

import {type IconEntry, IconGrid, IconLibraryHeader, IconSearch} from '.';

/**
 * Main Icon Library component
 */
const ITEMS_PER_PAGE = 100; // Number of icons to load at once

/**
 * Icon Library Component
 *
 * Development tool for viewing all available FFXI icons with their names.
 * Provides search, filtering, and copy functionality for easy reference.
 * Uses database persistence for tag management across browsers.
 */
const IconLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | IconCategory>('all');
  const [copiedIcon, setCopiedIcon] = useState<null | string>(null);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [editingIcon, setEditingIcon] = useState<null | number>(null);
  const [databaseTags, setDatabaseTags] = useState<Record<string, string[]>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'error' | 'idle' | 'saving' | 'success'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [tagsLoading, setTagsLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Process icons from flat registry array
  const allIcons = useMemo((): IconEntry[] => {
    const icons: IconEntry[] = [];

    // Handle flat array registry format
    if (Array.isArray(iconRegistry)) {
      iconRegistry.forEach(icon => {
        const tagKey = `${icon.category}-${icon.id}`;
        icons.push({
          category: icon.category as IconCategory,
          description: icon.name || `Icon ${icon.id}`,
          id: icon.id,
          name: icon.name,
          // Use database tags, fallback to original registry tags if none in database
          tags: databaseTags[tagKey] || icon.tags || [],
        });
      });
    } else {
      // Handle object registry format (fallback)
      Object.entries(iconRegistry).forEach(([category, categoryIcons]) => {
        if (Array.isArray(categoryIcons)) {
          categoryIcons.forEach(icon => {
            const tagKey = `${category}-${icon.id}`;
            icons.push({
              ...icon,
              category: category as IconCategory,
              // Use database tags, fallback to original registry tags if none in database
              tags: databaseTags[tagKey] || icon.tags || [],
            });
          });
        }
      });
    }

    return icons.sort((iconA, iconB) => iconA.name.localeCompare(iconB.name));
  }, [databaseTags]);

  // Filter icons based on search term and category
  const filteredIcons = useMemo(
    () =>
      allIcons.filter(icon => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          icon.name.toLowerCase().includes(searchLower) ||
          icon.description.toLowerCase().includes(searchLower) ||
          (icon.tags && icon.tags.some(tag => tag.toLowerCase().includes(searchLower)));
        const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [allIcons, searchTerm, selectedCategory]
  );

  // Icons to display (with pagination)
  const displayedIcons = useMemo(() => filteredIcons.slice(0, displayedCount), [filteredIcons, displayedCount]);

  // Reset displayed count when filters change
  useEffect(() => setDisplayedCount(ITEMS_PER_PAGE), [searchTerm, selectedCategory]);

  // Load more icons callback
  const loadMoreIcons = useCallback(() => {
    if (displayedCount < filteredIcons.length) {
      setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredIcons.length));
    }
  }, [displayedCount, filteredIcons.length]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreIcons();
        }
      },
      {threshold: 0.1}
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreIcons]);

  const hasMoreIcons = displayedCount < filteredIcons.length;

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {all: allIcons.length};

    // Count icons by category
    allIcons.forEach(icon => (counts[icon.category] = (counts[icon.category] || 0) + 1));

    return counts;
  }, [allIcons]);

  // Copy icon usage to clipboard
  const copyIconUsage = async (icon: IconEntry) => {
    const usage = `<FFXIIcon category="${icon.category}" name="${icon.name}" size="md" />`;

    try {
      await navigator.clipboard.writeText(usage);
      setCopiedIcon(icon.name);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Tag editing functions
  const startEditingTags = (iconId: number) => setEditingIcon(iconId);

  const saveIconTags = async (iconId: number, newTags: string[]) => {
    setEditingIcon(null);
    setSaveStatus('saving');
    setSaveMessage('Saving tags...');

    // Find the icon to get its category
    const icon = allIcons.find(icon => icon.id === iconId);
    if (!icon) {
      setSaveStatus('error');
      setSaveMessage('Error: Icon not found');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    try {
      // Get original tags from database (which now contains all registry tags)
      const tagKey = `${icon.category}-${iconId}`;
      const existingTags = databaseTags[tagKey] || [];

      // Save to database
      const {error, success} = await IconTagsService.saveIconTags({
        icon_category: icon.category,
        icon_id: iconId,
        original_tags: existingTags,
        tags: newTags,
      });

      if (success) {
        setSaveStatus('success');
        setSaveMessage('Tags saved to database');

        // Update local state to reflect the change immediately
        const tagKey = `${icon.category}-${iconId}`;
        setDatabaseTags(prev => ({
          ...prev,
          [tagKey]: newTags,
        }));
      } else {
        setSaveStatus('error');
        setSaveMessage(`Failed to save tags: ${error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(`Error saving tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Clear status after 3 seconds
    setTimeout(() => {
      setSaveStatus('idle');
      setSaveMessage('');
    }, 3000);
  };

  const cancelEditingTags = () => setEditingIcon(null);

  // Load custom tags from database on mount
  useEffect(() => {
    const loadDatabaseTags = async () => {
      setTagsLoading(true);
      try {
        const {data, error} = await IconTagsService.getAllIconTags();

        if (error) {
          setSaveStatus('error');
          setSaveMessage('Failed to load existing tags');
          setTimeout(() => {
            setSaveStatus('idle');
            setSaveMessage('');
          }, 3000);
        } else if (data) {
          // Convert database format to local format
          const tagsMap: Record<string, string[]> = {};
          data.forEach(entry => {
            const tagKey = `${entry.icon_category}-${entry.icon_id}`;
            tagsMap[tagKey] = entry.tags;
          });
          setDatabaseTags(tagsMap);
        }
      } catch {
        // Silently handle exceptions, error state already set above
      } finally {
        setTagsLoading(false);
      }
    };

    loadDatabaseTags();
  }, []);

  // Show loading state while tags are being fetched
  if (tagsLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <IconLibraryHeader
          allIconsLength={0}
          isEditMode={false}
          onToggleEditMode={() => {}}
          saveMessage="Loading tags from database..."
          saveStatus="saving"
          tagsLoading={true}
        />

        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              <div className="text-xl text-slate-400">Loading Icon Library</div>
              <div className="mt-2 text-sm text-slate-500">Fetching custom tags from database...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <IconLibraryHeader
        allIconsLength={allIcons.length}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        saveMessage={saveMessage}
        saveStatus={saveStatus}
        tagsLoading={tagsLoading}
      />

      <div className="container mx-auto px-6 py-8">
        <IconSearch
          categoryCounts={categoryCounts}
          displayedIconsLength={displayedIcons.length}
          filteredIconsLength={filteredIcons.length}
          hasMoreIcons={hasMoreIcons}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        <IconGrid
          copiedIcon={copiedIcon}
          displayedIcons={displayedIcons}
          editingIcon={editingIcon}
          filteredIconsLength={filteredIcons.length}
          hasMoreIcons={hasMoreIcons}
          isEditMode={isEditMode}
          loadingRef={loadingRef}
          onCancelEdit={cancelEditingTags}
          onCopyIconUsage={copyIconUsage}
          onSaveIconTags={saveIconTags}
          onStartEdit={startEditingTags}
        />
      </div>
    </div>
  );
};

export default IconLibrary;
