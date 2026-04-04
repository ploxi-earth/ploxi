import { createClient } from '@supabase/supabase-js';

/**
 * Browser/client Supabase client (anon key).
 * Used for Realtime subscriptions only.
 *
 * IMPORTANT:
 * - Requires `NEXT_PUBLIC_SUPABASE_ANON_KEY` to be set.
 * - Keep all data reads/writes server-side via API routes (service role).
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

