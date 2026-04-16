-- ============================================================
-- PLOXI V8 — investor_registrations full schema alignment
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE investor_registrations
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS organization_type text,
  ADD COLUMN IF NOT EXISTS fund_size_range text,
  ADD COLUMN IF NOT EXISTS aum text,
  ADD COLUMN IF NOT EXISTS fund_vintage text,
  ADD COLUMN IF NOT EXISTS min_investment text,
  ADD COLUMN IF NOT EXISTS max_investment text,
  ADD COLUMN IF NOT EXISTS financing_types text[],
  ADD COLUMN IF NOT EXISTS investment_structures text[],
  ADD COLUMN IF NOT EXISTS esg_focus text[],
  ADD COLUMN IF NOT EXISTS impact_metrics text[],
  ADD COLUMN IF NOT EXISTS certifications text[],
  ADD COLUMN IF NOT EXISTS sdg_alignment text[],
  ADD COLUMN IF NOT EXISTS investment_criteria text,
  ADD COLUMN IF NOT EXISTS portfolio_companies text,
  ADD COLUMN IF NOT EXISTS recent_investments text,
  ADD COLUMN IF NOT EXISTS value_add text,
  ADD COLUMN IF NOT EXISTS decision_timeline text,
  ADD COLUMN IF NOT EXISTS due_diligence_process text;

-- In case an older table version enforced NOT NULL on arrays, relax it
-- so empty selections can be saved as NULL during draft/OTP phase.
ALTER TABLE investor_registrations
  ALTER COLUMN sectors_of_interest DROP NOT NULL,
  ALTER COLUMN investment_stages DROP NOT NULL,
  ALTER COLUMN geographic_focus DROP NOT NULL,
  ALTER COLUMN financing_types DROP NOT NULL,
  ALTER COLUMN investment_structures DROP NOT NULL,
  ALTER COLUMN esg_focus DROP NOT NULL,
  ALTER COLUMN impact_metrics DROP NOT NULL,
  ALTER COLUMN certifications DROP NOT NULL,
  ALTER COLUMN sdg_alignment DROP NOT NULL;

UPDATE investor_registrations
SET last_name = COALESCE(NULLIF(last_name, ''), 'N/A')
WHERE last_name IS NULL OR last_name = '';

UPDATE investor_registrations
SET organization_type = COALESCE(NULLIF(organization_type, ''), 'Other')
WHERE organization_type IS NULL OR organization_type = '';

ALTER TABLE investor_registrations
  ALTER COLUMN last_name SET DEFAULT 'N/A',
  ALTER COLUMN organization_type SET DEFAULT 'Other';
