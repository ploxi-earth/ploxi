-- ============================================================
-- PLOXI V7 — Climate finance: one table per track (reference parity)
-- Run in Supabase SQL Editor. Keeps legacy climate_finance_registrations for history.
-- ============================================================

-- Raise funding (aligned with ploxi-sustainability-platform + Abdul form fields)
CREATE TABLE IF NOT EXISTS raise_funding_registrations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  text NOT NULL,
  company_name           text,
  full_name              text,
  phone                  text,
  organization           text,
  project_name           text,
  project_description    text,
  funding_required       text,
  project_stage          text,
  sector                 text,
  funding_stage          text,
  funding_amount         text,
  funding_purpose        text,
  current_revenue        text,
  use_of_funds           text,
  email_verified         boolean NOT NULL DEFAULT false,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','completed','reviewed','contacted','converted')),
  user_type              text NOT NULL DEFAULT 'raise_funding',
  completed_at           timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS raise_funding_registrations_email_lower_idx
  ON raise_funding_registrations (lower(email));

-- Investor (core columns; extra fields nullable for future forms)
CREATE TABLE IF NOT EXISTS investor_registrations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  text NOT NULL,
  first_name             text,
  last_name              text,
  phone                  text,
  organization_name      text,
  website                text,
  sectors_of_interest    text[],
  investment_stages      text[],
  geographic_focus       text[],
  typical_ticket_size    text,
  fund_name              text,
  fund_size              text,
  email_verified         boolean NOT NULL DEFAULT false,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','completed','reviewed','contacted','converted')),
  user_type              text NOT NULL DEFAULT 'investor',
  completed_at           timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS investor_registrations_email_lower_idx
  ON investor_registrations (lower(email));

-- Participant
CREATE TABLE IF NOT EXISTS participant_registrations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  text NOT NULL,
  first_name             text,
  last_name              text,
  phone                  text,
  organization           text,
  intent_type            text[],
  area_of_interest       text,
  message                text,
  email_verified         boolean NOT NULL DEFAULT false,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','completed','reviewed','contacted','converted')),
  user_type              text NOT NULL DEFAULT 'participant',
  completed_at           timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS participant_registrations_email_lower_idx
  ON participant_registrations (lower(email));
