-- ============================================================
-- PLOXI V10 -- DocuSign delivery verification
-- Adds a persisted delivery state for the frontend-owned send flow.
-- ============================================================

ALTER TABLE agreements
  ADD COLUMN IF NOT EXISTS docusign_status text;

UPDATE agreements
SET docusign_status = COALESCE(NULLIF(docusign_status, ''), 'sent')
WHERE docusign_envelope_id IS NOT NULL
  AND (docusign_status IS NULL OR docusign_status = '');