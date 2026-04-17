-- ============================================================
-- PLOXI V9 -- vendor dashboard enhancement alignment
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS vendor_type text DEFAULT 'service';

UPDATE vendors
SET vendor_type = 'service'
WHERE vendor_type IS NULL OR vendor_type = '';

ALTER TABLE vendor_profiles
  ADD COLUMN IF NOT EXISTS locations_served text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS industry_focus text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS corporate_profile text,
  ADD COLUMN IF NOT EXISTS legal_entity_name text,
  ADD COLUMN IF NOT EXISTS gst_number text,
  ADD COLUMN IF NOT EXISTS registered_address text,
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false;

ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS vendor_timezone text;

UPDATE meetings
SET status = COALESCE(NULLIF(status, ''), 'scheduled');

ALTER TABLE agreements
  ADD COLUMN IF NOT EXISTS viewed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS signed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS recipient_email text,
  ADD COLUMN IF NOT EXISTS docusign_envelope_id text,
  ADD COLUMN IF NOT EXISTS docusign_provider text DEFAULT 'docusign';

ALTER TABLE services
  DROP COLUMN IF EXISTS pricing;
