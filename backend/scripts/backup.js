/**
 * Ploxi Earth – Supabase Backup Script
 *
 * Exports all table data to JSON files in a timestamped directory.
 * Usage: node scripts/backup.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TABLES = [
  'admin_users',
  'vendors',
  'vendor_profiles',
  'onboarding_stages',
  'meetings',
  'agreements',
  'users',
  'corporate_registrations',
  'cleantech_registrations',
  'climate_finance_registrations',
  'ghg_calculations',
  'services',
  'projects',
  'documents',
  'notifications',
  'sustainability_reports',
];

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, '..', 'backups', `backup-${timestamp}`);

  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`\n📦 Starting Supabase backup → ${backupDir}\n`);

  let totalRows = 0;

  for (const table of TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.error(`  ❌ ${table}: ${error.message}`);
        continue;
      }

      const rows = data || [];
      totalRows += rows.length;

      const filePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));

      console.log(`  ✅ ${table}: ${rows.length} rows`);
    } catch (err) {
      console.error(`  ❌ ${table}: ${err.message}`);
    }
  }

  // Write metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.SUPABASE_URL,
    tables: TABLES,
    totalRows,
  };
  fs.writeFileSync(path.join(backupDir, '_metadata.json'), JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Backup complete! ${totalRows} total rows across ${TABLES.length} tables.\n`);
}

backup().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
