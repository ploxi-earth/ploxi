-- ============================================================
-- Remove vendor documents workflow (documents table)
-- Run in Supabase SQL Editor after backing up if you need row data.
-- ============================================================

DROP TABLE IF EXISTS public.documents CASCADE;
