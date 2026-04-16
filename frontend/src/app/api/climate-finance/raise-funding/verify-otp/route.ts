import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySupabaseEmailOtp } from '@/lib/otpVerification';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';

    const result = await verifySupabaseEmailOtp(em, otp);
    if (!result.ok) return jsonError(result.message, result.status);

    const { error } = await supabase
      .from('raise_funding_registrations')
      .update({
        email_verified: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('email', em);

    if (error) {
      console.error('raise-funding verify-otp', error);
      return jsonError('Could not update registration.', 500);
    }

    return jsonOk({ success: true, message: 'Registration completed successfully.' });
  } catch (e) {
    console.error('raise-funding verify-otp', e);
    return jsonError('Verification failed.', 500);
  }
}
