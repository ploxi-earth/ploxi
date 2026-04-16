import { createClient } from '@supabase/supabase-js';

// Client-side (anon) Supabase client. Uses NEXT_PUBLIC_* env vars only.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // Fail early in development if env vars are missing.
  // Avoid throwing in production SSR contexts; exports remain undefined.
  // Consumers should handle missing client gracefully.
  // eslint-disable-next-line no-console
  console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY; Supabase client not initialized.');
}

export const supabaseClient = createClient(url ?? '', anon ?? '', {
  auth: { persistSession: true, autoRefreshToken: true },
});

export default supabaseClient;
