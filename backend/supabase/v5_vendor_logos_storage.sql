-- ============================================================
-- PLOXI V5 — Vendor logos (DB column + Storage bucket + policies)
-- Run in Supabase SQL Editor after prior migrations.
-- ============================================================

-- 1. Vendors: public URL for logo (served from Supabase Storage)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Storage bucket (public read; uploads go through your API with service role)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-logos', 'vendor-logos', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 3. Anyone can read objects in vendor-logos (controlled path: {vendor_id}/logo.*)
DROP POLICY IF EXISTS "Public read vendor-logos" ON storage.objects;
CREATE POLICY "Public read vendor-logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'vendor-logos');

-- Note: Inserts/updates/deletes are not granted to anon/authenticated roles here.
-- Your Next.js API uses the service role and enforces JWT; path is always {vendor_id}/logo.<ext>.
