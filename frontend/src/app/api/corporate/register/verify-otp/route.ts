import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySupabaseEmailOtp } from '@/lib/otpVerification';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';

    const result = await verifySupabaseEmailOtp(em, otp);
    if (!result.ok) {
      return jsonError(result.message, result.status);
    }

    const { error: updateError } = await supabase
      .from('corporate_registrations')
      .update({
        email_verified: true,
        registration_step: 2,
      })
      .eq('email', em);

    if (updateError) {
      console.error('corporate verify-otp update', updateError);
      return jsonError('Verification succeeded but could not update registration.', 500);
    }

    return jsonOk({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (e) {
    console.error('corporate verify-otp', e);
    return jsonError('Verification failed.', 500);
  }
}
