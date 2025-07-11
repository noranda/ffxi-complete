import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useState} from 'react';

import {Button} from '@/components/ui/button';
import {FFXIIcon} from '@/icons';
import {cn} from '@/lib/utils';

import type {IconEntry} from './types';

type IconCardProps = {
  icon: IconEntry;
  isCopied: boolean;
  isEditing: boolean;
  isEditMode: boolean;
  onCancelEdit: () => void;
  onCopy: () => void;
  onSaveTags: (tags: string[]) => void;
  onStartEdit: () => void;
};

/**
 * Individual icon card component with editing capabilities
 */
const IconCard: React.FC<IconCardProps> = ({
  icon,
  isCopied,
  isEditing,
  isEditMode,
  onCancelEdit,
  onCopy,
  onSaveTags,
  onStartEdit,
}) => {
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isEditing) {
      setEditingTags([...(icon.tags || [])]);
    }
  }, [isEditing, icon.tags]);

  const handleSaveTags = () => {
    onSaveTags(editingTags);
    setNewTag('');
  };

  const handleCancelEdit = () => {
    setEditingTags([]);
    setNewTag('');
    onCancelEdit();
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !editingTags.includes(trimmedTag)) {
      setEditingTags([...editingTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => setEditingTags(editingTags.filter(tag => tag !== tagToRemove));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTag();
    }
  };

  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-left transition-all hover:border-cyan-500 hover:bg-slate-800',
        isCopied && 'border-green-500 bg-green-900/20',
        isEditing && 'border-orange-500 bg-orange-900/20'
      )}
      onClick={() => {
        if (!isEditMode && !isEditing) {
          onCopy();
        }
      }}
    >
      {/* Icon Display */}
      <div className="mb-3 flex justify-center">
        <FFXIIcon
          category={icon.category}
          className="transition-transform group-hover:scale-110"
          name={icon.name}
          size="xl"
        />
      </div>

      {/* Icon Info */}
      <div className="space-y-1">
        <div className="truncate text-sm font-medium text-white" title={icon.name}>
          {icon.name}
        </div>

        <div className="truncate text-xs text-slate-400" title={icon.description}>
          {icon.description}
        </div>

        <div className="flex justify-between text-xs">
          <span className="font-mono text-cyan-400">{icon.category}</span>
          <span className="text-slate-500">ID: {icon.id}</span>
        </div>

        {/* Tags - Display or Edit Mode */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            {/* Editing Tags */}
            <div className="flex flex-wrap gap-1">
              {editingTags.map((tag, index) => (
                <span
                  className="inline-flex items-center gap-1 rounded bg-orange-700 px-1 py-0.5 text-[9px] text-slate-200"
                  key={index}
                >
                  {tag}

                  <Button
                    className="h-3 w-3 text-slate-400 hover:text-white"
                    onClick={() => removeTag(tag)}
                    size="icon"
                  >
                    <FontAwesomeIcon icon={faXmark} size="xs" />
                  </Button>
                </span>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="flex gap-1">
              <input
                className="flex-1 rounded bg-slate-700 px-1.5 py-0.5 text-[9px] text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                onChange={event => setNewTag(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
                type="text"
                value={newTag}
              />

              <Button className="h-5 px-1.5 text-[9px]" onClick={() => addTag()} size="sm" variant="secondary">
                +
              </Button>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-1">
              <Button className="h-5 px-1.5 text-[9px]" onClick={handleSaveTags} size="sm" variant="default">
                Save
              </Button>

              <Button className="h-5 px-1.5 text-[9px]" onClick={handleCancelEdit} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Display Tags */}
            {icon.tags && icon.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {icon.tags.map((tag, index) => (
                  <span
                    className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300"
                    key={index}
                    title={`Tag: ${tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {isEditMode && !isEditing && (
              <div className="mt-2 flex gap-1">
                <Button
                  className="h-6 bg-orange-600 px-2 text-[10px] text-white hover:bg-orange-700"
                  onClick={event => {
                    event.stopPropagation();
                    onStartEdit();
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Edit Tags
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Copy Feedback */}
      {isCopied && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-green-900/80">
          <div className="text-sm font-medium text-green-300">Copied!</div>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-cyan-500/0 transition-colors group-hover:bg-cyan-500/5" />
    </div>
  );
};

export default IconCard;
