import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client (service-role) — bypasses RLS.
 * Use ONLY in API route handlers (server-side).
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
