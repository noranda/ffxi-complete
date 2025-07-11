/**
 * Seed Script: Import Registry Tags to Database
 *
 * This script imports all tags from registry.json into the dev_icon_tags table
 * Run with: npx tsx scripts/seedRegistryTags.ts
 */

import {createClient} from '@supabase/supabase-js';

// eslint-disable-next-line import/no-internal-modules
import iconRegistry from '../src/icons/registry.json';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pqsbszxrdrasowqimadd.supabase.co';
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc2JzenhyZHJhc293cWltYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjE1MjcsImV4cCI6MjA2NTkzNzUyN30.C1ezO86TZKx82tjevYUCFRZ0_sGtCUIi1FQYFBcBwUU';

const supabase = createClient(supabaseUrl, supabaseKey);

type RegistryIcon = {
  category: string;
  file: string;
  id: number;
  name: string;
  original_filename?: string;
  tags: string[];
};

/**
 * Seeds registry tags into the database for development use
 */
async function seedRegistryTags() {
  console.log('🌱 Starting registry tags import...');
  console.log(`📊 Found ${iconRegistry.length} icons in registry`);

  const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';
  let importedCount = 0;
  let errorCount = 0;

  // Clear existing dev tags first
  console.log('🧹 Clearing existing dev tags...');
  const {error: clearError} = await supabase.from('dev_icon_tags').delete().eq('user_id', DEV_USER_ID);

  if (clearError) {
    console.error('❌ Error clearing existing tags:', clearError);
    return;
  }

  console.log('✅ Existing tags cleared');

  // Process icons in batches for better performance
  const BATCH_SIZE = 100;
  const batches = [];

  for (let i = 0; i < iconRegistry.length; i += BATCH_SIZE) {
    batches.push(iconRegistry.slice(i, i + BATCH_SIZE));
  }

  console.log(`📦 Processing ${batches.length} batches of ${BATCH_SIZE} icons each...`);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`⚡ Processing batch ${batchIndex + 1}/${batches.length}...`);

    const batchData = batch.map((icon: RegistryIcon) => ({
      icon_category: icon.category,
      icon_id: icon.id,
      metadata: {
        file: icon.file,
        name: icon.name,
        original_filename: icon.original_filename,
      },
      original_tags: icon.tags || [],
      tags: icon.tags || [],
      user_id: DEV_USER_ID,
    }));

    const {error} = await supabase.from('dev_icon_tags').insert(batchData);

    if (error) {
      console.error(`❌ Error in batch ${batchIndex + 1}:`, error);
      errorCount += batch.length;
    } else {
      importedCount += batch.length;
      console.log(`✅ Batch ${batchIndex + 1} completed (${batch.length} icons)`);
    }
  }

  console.log('\n🎉 Import completed!');
  console.log(`✅ Successfully imported: ${importedCount} icons`);
  console.log(`❌ Errors: ${errorCount} icons`);
  console.log(`📊 Total processed: ${importedCount + errorCount} icons`);

  // Verify the import
  const {count, error: countError} = await supabase
    .from('dev_icon_tags')
    .select('*', {count: 'exact', head: true})
    .eq('user_id', DEV_USER_ID);

  if (countError) {
    console.error('❌ Error verifying import:', countError);
  } else {
    console.log(`🔍 Verification: ${count} records in database`);
  }
}

// Run the seed script
seedRegistryTags()
  .then(() => {
    console.log('\n✨ Registry tags import complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
