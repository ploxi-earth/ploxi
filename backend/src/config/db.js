const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

// Service-role client — bypasses RLS, use for all server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Log connection status
logger.info(`Supabase client initialized for: ${process.env.SUPABASE_URL}`);

module.exports = supabase;
