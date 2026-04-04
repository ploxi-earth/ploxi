# Ploxi V2 – MongoDB → Supabase Migration Documentation

## Overview

V2 backend has been fully migrated from MongoDB/Mongoose to Supabase (PostgreSQL). The same Supabase project used by V1 (`psqycsqmkgoeowddljdk.supabase.co`) is reused.

## Setup Steps

### 1. Install Dependencies
```bash
cd "C:\Projects\Ploxi\Versions\Abdul's Version\Ploxi\backend"
npm install
```

### 2. Run Schema Migration
Copy the contents of `supabase/v2_schema_migration.sql` and execute it in the **Supabase SQL Editor** at:
https://supabase.com/dashboard/project/psqycsqmkgoeowddljdk/sql

### 3. Seed Admin User
Run this SQL after setting a bcrypt hash (use `node -e "require('bcryptjs').hash('YourPassword',12).then(console.log)"`):
```sql
INSERT INTO admin_users (name, email, password_hash)
VALUES ('Ploxi Admin', 'admin@ploxi.earth', '<bcrypt_hash>');

INSERT INTO users (name, email, password_hash, role, is_active)
VALUES ('Ploxi Admin', 'admin@ploxi.earth', '<bcrypt_hash>', 'platform_admin', true);
```

### 4. Start the Server
```bash
npm run dev
```

## Schema Design

### Existing Tables (from V1)
| Table | Purpose |
|-------|---------|
| `admin_users` | Admin login credentials |
| `vendors` | Vendor registration + credentials |
| `vendor_profiles` | Vendor company details |
| `onboarding_stages` | Vendor onboarding pipeline |
| `meetings` | Vendor meeting scheduling |
| `agreements` | Vendor agreements |

### New Tables (added for V2)
| Table | Purpose |
|-------|---------|
| `users` | Platform users (admin, vendor, consultant, manager) |
| `corporate_registrations` | Corporate registration form submissions |
| `cleantech_registrations` | CleanTech registration form submissions |
| `climate_finance_registrations` | Climate finance registration submissions |
| `ghg_calculations` | GHG emission calculator results |
| `services` | Vendor portal services |
| `projects` | Vendor portal projects |
| `documents` | Vendor portal documents |
| `notifications` | User notifications |
| `sustainability_reports` | Consultant sustainability reports |

## Backup & Restore

### Create Backup
```bash
npm run backup
```
Creates timestamped JSON exports in `backups/` directory.

### Restore from Backup
1. Open Supabase SQL Editor
2. Clear the target table: `TRUNCATE TABLE <table_name> CASCADE;`
3. Use the Supabase dashboard Table Editor to import the JSON backup, or write a restore script

## Authentication

- **Admin login**: Custom JWT via `admin_users` + `users` tables
- **Vendor login**: Custom JWT via `vendors` + `users` tables
- **Supabase Auth**: NOT used for admin/vendor (avoids `auth.users` conflicts)
- **JWT secrets**: Configured in `.env` (`JWT_SECRET`, `JWT_REFRESH_SECRET`)

## API Endpoints (unchanged)

All existing API endpoints remain the same. No frontend changes required.
