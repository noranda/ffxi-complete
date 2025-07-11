/**
 * Icon Tags Service
 *
 * Handles database operations for development icon tag management.
 * Provides cross-browser, persistent tag storage for the icon library.
 */

import {supabase} from '@/lib/supabase';

export type IconTagEntry = {
  created_at: string;
  icon_category: string;
  icon_id: number;
  id: string;
  metadata?: Record<string, unknown>;
  original_tags: string[];
  tags: string[];
  updated_at: string;
  user_id: string;
};

export type IconTagUpdate = {
  icon_category: string;
  icon_id: number;
  metadata?: Record<string, unknown>;
  original_tags?: string[];
  tags: string[];
};

/**
 * Service for managing icon tags in the database
 */
export class IconTagsService {
  /**
   * Clear all custom tags for the current user
   */
  static async clearAllTags(): Promise<{error: Error | null; success: boolean}> {
    try {
      const {data: user} = await supabase.auth.getUser();
      if (!user.user) {
        return {error: new Error('User not authenticated'), success: false};
      }

      const {error} = await supabase.from('dev_icon_tags').delete().eq('user_id', user.user.id);

      if (error) {
        console.error('Failed to clear all tags:', error);
        return {error, success: false};
      }

      return {error: null, success: true};
    } catch (error) {
      console.error('Exception clearing all tags:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error'),
        success: false,
      };
    }
  }

  /**
   * Delete custom tags for an icon (reverts to original)
   */
  static async deleteIconTags(iconId: number, iconCategory: string): Promise<{error: Error | null; success: boolean}> {
    try {
      const {data: user} = await supabase.auth.getUser();
      if (!user.user) {
        return {error: new Error('User not authenticated'), success: false};
      }

      const {error} = await supabase
        .from('dev_icon_tags')
        .delete()
        .eq('user_id', user.user.id)
        .eq('icon_id', iconId)
        .eq('icon_category', iconCategory);

      if (error) {
        console.error('Failed to delete icon tags:', error);
        return {error, success: false};
      }

      return {error: null, success: true};
    } catch (error) {
      console.error('Exception deleting icon tags:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error'),
        success: false,
      };
    }
  }

  /**
   * Export all tags as JSON for backup or sharing
   */
  static async exportTags(): Promise<{data: null | unknown; error: Error | null}> {
    const {data, error} = await this.getAllIconTags();

    if (error || !data) {
      return {data: null, error};
    }

    const exportData = {
      tags: data.map(entry => ({
        icon_category: entry.icon_category,
        icon_id: entry.icon_id,
        original_tags: entry.original_tags,
        tags: entry.tags,
        updated_at: entry.updated_at,
      })),
      timestamp: new Date().toISOString(),
      total_icons: data.length,
      version: '1.0',
    };

    return {data: exportData, error: null};
  }

  /**
   * Get all icon tags (global for development team)
   */
  static async getAllIconTags(): Promise<{data: IconTagEntry[] | null; error: Error | null}> {
    try {
      // For development tool, use a fixed dev user ID to share tags globally
      const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';

      // Fetch all records using pagination to overcome 1000 record limit
      let allData: IconTagEntry[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const {data, error} = await supabase
          .from('dev_icon_tags')
          .select('*')
          .eq('user_id', DEV_USER_ID)
          .order('icon_category, icon_id')
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.error('❌ Database error:', error);
          return {data: null, error};
        }

        if (data && data.length > 0) {
          allData = allData.concat(data as IconTagEntry[]);
          hasMore = data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }

      return {data: allData as IconTagEntry[], error: null};
    } catch (error) {
      console.error('💥 Exception fetching icon tags:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Get tags for a specific icon
   */
  static async getIconTags(
    iconId: number,
    iconCategory: string
  ): Promise<{data: null | string[]; error: Error | null}> {
    try {
      const {data: user} = await supabase.auth.getUser();
      if (!user.user) {
        return {data: null, error: new Error('User not authenticated')};
      }

      const {data, error} = await supabase
        .from('dev_icon_tags')
        .select('tags')
        .eq('user_id', user.user.id)
        .eq('icon_id', iconId)
        .eq('icon_category', iconCategory)
        .single();

      if (error) {
        // If no record found, that's not an error - just no custom tags
        if (error.code === 'PGRST116') {
          return {data: null, error: null};
        }
        console.error('Failed to fetch icon tags:', error);
        return {data: null, error};
      }

      return {data: data.tags, error: null};
    } catch (error) {
      console.error('Exception fetching icon tags:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Get count of custom tagged icons
   */
  static async getTaggedIconsCount(): Promise<{count: number; error: Error | null}> {
    try {
      const {data: user} = await supabase.auth.getUser();
      if (!user.user) {
        return {count: 0, error: new Error('User not authenticated')};
      }

      const {count, error} = await supabase
        .from('dev_icon_tags')
        .select('*', {count: 'exact', head: true})
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Failed to count tagged icons:', error);
        return {count: 0, error};
      }

      return {count: count || 0, error: null};
    } catch (error) {
      console.error('Exception counting tagged icons:', error);
      return {
        count: 0,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Save or update tags for an icon
   */
  static async saveIconTags(data: IconTagUpdate): Promise<{error: Error | null; success: boolean}> {
    try {
      // For development tool, use a fixed dev user ID to share tags globally
      const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';

      const {error} = await supabase.from('dev_icon_tags').upsert(
        {
          icon_category: data.icon_category,
          icon_id: data.icon_id,
          metadata: data.metadata || {},
          original_tags: data.original_tags || [],
          tags: data.tags,
          user_id: DEV_USER_ID,
        },
        {
          onConflict: 'user_id,icon_id,icon_category',
        }
      );

      if (error) {
        console.error('❌ Database save error:', error);
        return {error, success: false};
      }

      return {error: null, success: true};
    } catch (error) {
      console.error('💥 Exception saving icon tags:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error'),
        success: false,
      };
    }
  }
}
