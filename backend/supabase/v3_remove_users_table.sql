-- ============================================================
-- PLOXI V3 — Remove users table, separate admin/vendor auth
-- Run in Supabase SQL Editor AFTER deploying code changes
-- ============================================================

-- ── 1. Add missing columns to admin_users ────────────────────
-- These columns support password management and account status
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'platform_admin'
  CHECK (role IN ('platform_admin', 'consultant', 'manager'));
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_changed_at timestamptz;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_token text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_expires timestamptz;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ── 2. Add missing columns to vendors ────────────────────────
-- These columns support vendor password reset flow
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS password_reset_token text;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS password_reset_expires timestamptz;

-- ── 3. Indexes for new columns ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ── 4. Migrate existing platform users to admin_users ────────
-- Run this BEFORE dropping the users table to preserve
-- consultant and manager accounts.
-- This will skip any rows whose email already exists in admin_users.
INSERT INTO admin_users (id, name, email, password_hash, role, is_active, password_changed_at, created_at)
SELECT id, name, email, password_hash, role, is_active, password_changed_at, created_at
FROM users
WHERE role IN ('platform_admin', 'consultant', 'manager')
ON CONFLICT (email) DO NOTHING;

-- ── 5. Drop the users table ─────────────────────────────────
-- ⚠️ CAUTION: Only run this AFTER:
--   1. All code changes are deployed and verified
--   2. Step 4 migration has been executed successfully
--   3. You have confirmed admin login works against admin_users
--   4. You have confirmed vendor login works against vendors
--
-- UNCOMMENT the line below when ready:
-- DROP TABLE IF EXISTS users CASCADE;

-- ── 6. Clean up old indexes (run after dropping users) ───────
-- UNCOMMENT these after dropping the users table:
-- DROP INDEX IF EXISTS idx_users_email;
-- DROP INDEX IF EXISTS idx_users_role;
