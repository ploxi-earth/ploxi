import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Ephemeral anon client for Auth OTP (signInWithOtp / verifyOtp) in Route Handlers.
 * Session is not persisted; DB writes use the service-role client separately.
 */
export function createSupabaseAnonAuthClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for OTP.');
  }
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
