import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import type { AuthError, Session } from '@supabase/supabase-js';

export type OtpVerifyResult =
  | { ok: true; session: Session }
  | { ok: false; message: string; status: number };

export async function verifySupabaseEmailOtp(email: string, otp: unknown): Promise<OtpVerifyResult> {
  const otpString = String(otp ?? '').trim();
  if (!email?.includes('@') || otpString.length < 4) {
    return { ok: false, message: 'Email and OTP are required.', status: 400 };
  }

  const auth = createSupabaseAnonAuthClient();
  const { data, error } = await auth.auth.verifyOtp({
    email: email.trim(),
    token: otpString,
    type: 'email',
  });

  if (error || !data.session) {
    return { ok: false, message: mapAuthOtpError(error), status: 400 };
  }

  return { ok: true, session: data.session };
}

function mapAuthOtpError(err: AuthError | null): string {
  const msg = err?.message?.toLowerCase() || '';
  if (msg.includes('expired')) return 'OTP has expired. Please request a new one.';
  if (msg.includes('invalid')) return 'Invalid OTP. Please check the code and try again.';
  if (msg.includes('too many')) return 'Too many verification attempts. Please request a new OTP.';
  return 'Invalid or expired OTP. Please try again or request a new code.';
}
