-- ============================================================
-- PLOXI V2 — Additional Schema Migration
-- Run in Supabase SQL Editor AFTER the v1 vendor_management_schema.sql
-- Existing tables: admin_users, vendors, vendor_profiles,
--                  onboarding_stages, meetings, agreements
-- ============================================================

-- ── 1. Users (platform admins, consultants, managers) ────────
-- NOTE: Vendors authenticate via the `vendors` table (custom JWT).
-- This table is for non-vendor platform users used by the
-- consultant / manager / admin portal features.
CREATE TABLE IF NOT EXISTS users (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  email                 text UNIQUE NOT NULL,
  password_hash         text NOT NULL,
  role                  text NOT NULL CHECK (role IN ('platform_admin','vendor','consultant','manager')),
  is_active             boolean NOT NULL DEFAULT true,
  password_changed_at   timestamptz,
  password_reset_token  text,
  password_reset_expires timestamptz,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ── 2. Corporate Registrations ───────────────────────────────
CREATE TABLE IF NOT EXISTS corporate_registrations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Step 1: Company Details
  full_name              text NOT NULL,
  designation            text NOT NULL,
  company_name           text NOT NULL,
  website                text,
  industry_sector        text NOT NULL,
  custom_industry        text,
  email                  text NOT NULL,
  phone                  text NOT NULL,
  -- Step 2: ESG & Compliance
  current_esg_frameworks text[],
  esg_reporting_status   text,
  primary_esg_goals      text[],
  compliance_regulations text[],
  annual_revenue_band    text,
  employee_count         text,
  sustainability_team_size text,
  -- Step 2 (v1-compatible fields)
  geography              text,
  esg_frameworks         text,
  sustainability_stage   text,
  esg_saas_integration   text,
  -- Step 3: Verification
  hear_about_us          text,
  additional_notes       text,
  -- Meta
  email_verified         boolean DEFAULT false,
  registration_step      integer DEFAULT 1,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','completed','reviewed','contacted','converted')),
  completed_at           timestamptz,
  reviewed_by            uuid,
  review_note            text,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

-- ── 3. CleanTech Registrations ───────────────────────────────
CREATE TABLE IF NOT EXISTS cleantech_registrations (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Step 1: Company Info
  company_name         text NOT NULL,
  website              text,
  solution_type        text NOT NULL,
  target_industries    text[],
  geographic_regions   text[],
  contact_name         text NOT NULL,
  contact_email        text NOT NULL,
  company_description  text NOT NULL,
  -- Step 2: Requirements
  revenue_stage        text,
  team_size            text,
  funding_status       text,
  key_differentiators  text,
  clients_served       text,
  partnership_goals    text[],
  -- Meta
  email_verified       boolean DEFAULT false,
  registration_step    integer DEFAULT 1,
  status               text NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','completed','reviewed','approved','rejected')),
  completed_at         timestamptz,
  reviewed_by          uuid,
  review_note          text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ── 4. Climate Finance Registrations ─────────────────────────
CREATE TABLE IF NOT EXISTS climate_finance_registrations (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_type        text NOT NULL CHECK (engagement_type IN ('raise_funding','investor','participate')),
  -- Common
  full_name              text NOT NULL,
  email                  text NOT NULL,
  phone                  text,
  organization           text,
  website                text,
  -- Raise Funding
  project_name           text,
  project_description    text,
  funding_required       text,
  project_stage          text,
  sector                 text,
  -- Investor
  investment_focus       text[],
  ticket_size            text,
  geographic_preference  text[],
  -- Participate
  participation_type     text,
  area_of_interest       text,
  message                text,
  -- Meta
  email_verified         boolean DEFAULT false,
  registration_step      integer DEFAULT 1,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','completed','reviewed','contacted','converted')),
  completed_at           timestamptz,
  reviewed_by            uuid,
  review_note            text,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

-- ── 5. GHG Calculations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ghg_calculations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            text,
  user_id               uuid,
  company_name          text,
  reporting_year        integer,
  -- Stored as JSONB for nested scope data
  scope1                jsonb,
  scope2                jsonb,
  scope3                jsonb,
  -- Results
  total_scope1_tco2e    numeric,
  total_scope2_tco2e    numeric,
  total_scope3_tco2e    numeric,
  total_emissions_tco2e numeric,
  results               jsonb,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ── 6. Services (Vendor Portal) ─────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id         uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id           uuid,
  name              text NOT NULL,
  description       text,
  category          text,
  sector            text,
  tags              text[],
  status            text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','inactive','draft')),
  pricing           text,
  delivery_timeline text,
  cover_image       text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ── 7. Projects (Vendor Portal) ─────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id     uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id       uuid,
  title         text NOT NULL,
  description   text,
  client        text,
  value         numeric DEFAULT 0,
  status        text NOT NULL DEFAULT 'opportunity'
                CHECK (status IN ('opportunity','proposal','in_progress','completed','cancelled')),
  start_date    date,
  end_date      date,
  progress      integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  sector        text,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ── 8. Notifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL,
  vendor_id   uuid REFERENCES vendors(id) ON DELETE SET NULL,
  type        text DEFAULT 'info'
              CHECK (type IN ('info','success','warning','action','system')),
  title       text NOT NULL,
  message     text NOT NULL,
  link        text,
  is_read     boolean DEFAULT false,
  read_at     timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── 9. Sustainability Reports ───────────────────────────────
CREATE TABLE IF NOT EXISTS sustainability_reports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id     uuid NOT NULL,
  client_name       text NOT NULL,
  reporting_period  text NOT NULL,
  reporting_year    integer NOT NULL,
  -- Data Sections (JSONB for nested data)
  energy_data       jsonb,
  water_data        jsonb,
  waste_data        jsonb,
  emissions_data    jsonb,
  social_data       jsonb,
  governance_data   jsonb,
  -- Lifecycle
  status            text DEFAULT 'draft'
                    CHECK (status IN ('draft','submitted','under_review','approved','published')),
  approved_by       uuid,
  approved_at       timestamptz,
  published_at      timestamptz,
  report_file_url   text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ── Disable RLS on all new tables (service-role access only) ─
ALTER TABLE users                         DISABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_registrations       DISABLE ROW LEVEL SECURITY;
ALTER TABLE cleantech_registrations       DISABLE ROW LEVEL SECURITY;
ALTER TABLE climate_finance_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE ghg_calculations              DISABLE ROW LEVEL SECURITY;
ALTER TABLE services                      DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects                      DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reports        DISABLE ROW LEVEL SECURITY;

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email                ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role                 ON users(role);
CREATE INDEX IF NOT EXISTS idx_corp_reg_email             ON corporate_registrations(email);
CREATE INDEX IF NOT EXISTS idx_corp_reg_status            ON corporate_registrations(status);
CREATE INDEX IF NOT EXISTS idx_cleantech_reg_email        ON cleantech_registrations(contact_email);
CREATE INDEX IF NOT EXISTS idx_cleantech_reg_status       ON cleantech_registrations(status);
CREATE INDEX IF NOT EXISTS idx_climate_reg_email          ON climate_finance_registrations(email);
CREATE INDEX IF NOT EXISTS idx_climate_reg_status         ON climate_finance_registrations(status);
CREATE INDEX IF NOT EXISTS idx_climate_reg_type           ON climate_finance_registrations(engagement_type);
CREATE INDEX IF NOT EXISTS idx_ghg_user                   ON ghg_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_ghg_session                ON ghg_calculations(session_id);
CREATE INDEX IF NOT EXISTS idx_services_vendor            ON services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_services_status            ON services(status);
CREATE INDEX IF NOT EXISTS idx_projects_vendor            ON projects(vendor_id);
CREATE INDEX IF NOT EXISTS idx_projects_status            ON projects(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user         ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sustainability_consultant  ON sustainability_reports(consultant_id);
CREATE INDEX IF NOT EXISTS idx_sustainability_status      ON sustainability_reports(status);
