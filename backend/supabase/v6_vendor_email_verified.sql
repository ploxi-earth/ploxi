-- Email verification gate for vendor self-registration (OTP via Supabase Auth).
-- Existing vendors remain verified.
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT true;
UPDATE vendors SET email_verified = true WHERE email_verified IS NULL;
