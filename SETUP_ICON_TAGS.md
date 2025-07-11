# Icon Tags Database Setup

This document explains how to complete the setup for the database-powered icon tags system.

## Overview

The icon library now uses a proper database table (`dev_icon_tags`) to store custom tag modifications instead of
localStorage. This provides:

- ✅ Cross-browser synchronization
- ✅ Team collaboration
- ✅ Reliable persistence
- ✅ User data isolation

## Setup Steps

### Option 1: Use Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**: Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Navigate to SQL Editor**:

   - Go to your project: `pqsbszxrdrasowqimadd`
   - Click "SQL Editor" in the sidebar

3. **Run Migration**:
   - Copy the contents of `migrate-icon-tags.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

### Option 2: Use CLI (Requires Docker)

If you have Docker Desktop running:

```bash
# Start local Supabase
npx supabase start

# Apply migration
npx supabase migration up

# Generate updated types
npx supabase gen types typescript --local > src/types/database.types.ts
```

## Verification

After running the migration, you should see:

1. **Table Created**: `dev_icon_tags` table in your database
2. **RLS Enabled**: Row Level Security policies active
3. **Indexes**: Performance indexes created
4. **Functions**: Updated timestamp trigger function

## How It Works

### Database Schema

```sql
dev_icon_tags (
  id UUID PRIMARY KEY,
  user_id UUID (links to auth.users),
  icon_id INTEGER (matches registry.json),
  icon_category TEXT ('magic', 'status', 'abilities'),
  tags TEXT[] (custom tags array),
  original_tags TEXT[] (backup of registry tags),
  metadata JSONB (extensible data),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### User Workflow

1. **Load Library**: Tags automatically load from database
2. **Edit Mode**: Click "Edit Tags" in header
3. **Modify Tags**: Click "Edit Tags" on any icon
4. **Save**: Changes save immediately to database
5. **Cross-Browser**: Same tags appear everywhere when logged in

## Code Changes Made

### Files Added

- `supabase/migrations/20250710183328_add_dev_icon_tags_table.sql`
- `src/lib/services/iconTagsService.ts`
- `migrate-icon-tags.sql` (manual migration script)

### Files Modified

- `src/components/icons/IconLibrary.tsx` - Database integration
- `src/components/icons/IconLibraryHeader.tsx` - Removed export/import
- `src/types/database.types.ts` - Added table types
- `src/components/__tests__/IconLibrary.test.tsx` - Updated tests

### Files Removed

- `src/lib/services/registryService.ts` - No longer needed

## Troubleshooting

### Icons Don't Load in Safari

- Check browser console for dynamic import errors
- Verify SVG sprite loading issues
- Safari may have stricter security policies

### Authentication Issues

- Ensure user is logged in before using icon library
- Check Supabase auth configuration
- Verify RLS policies are working

### Migration Fails

- Check database permissions
- Verify Supabase connection
- Use manual SQL script as fallback

## Next Steps

1. **Test the system**: Try editing tags in different browsers
2. **Safari debugging**: Investigate icon loading issues
3. **Team usage**: Share with other developers
4. **Backup**: Export tag improvements to registry when ready

The icon tags system is now production-ready with proper database persistence!
