import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Combines class names using clsx and merges Tailwind CSS classes intelligently
 * Handles conditional classes and removes duplicate/conflicting Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
