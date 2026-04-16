import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import { splitFullName } from '@/lib/splitFullName';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, formData } = body as {
      email?: string;
      formData?: Record<string, unknown>;
    };
    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em || !em.includes('@')) return jsonError('Valid email required.', 400);

    const fd = formData || {};
    const { data: existing } = await supabase
      .from('participant_registrations')
      .select('email, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (existing?.email_verified) return jsonError('This email is already registered.', 400);

    const { first_name, last_name } = splitFullName(String(fd.fullName || ''));
    const participationType = String(fd.participationType || '').trim();
    const intent_type = participationType ? [participationType] : [];

    const now = new Date().toISOString();
    const baseData = {
      email: em,
      first_name: first_name || '',
      last_name: last_name || '',
      organization: String(fd.organization || '').trim() || '',
      intent_type,
      email_verified: false,
      status: 'pending' as const,
      user_type: 'participant' as const,
    };

    if (existing) {
      const { error } = await supabase
        .from('participant_registrations')
        .update({ ...baseData, updated_at: now })
        .eq('email', em);
      if (error) {
        console.error('participant send-otp update', error);
        return jsonError('Could not save registration.', 500);
      }
    } else {
      const { error } = await supabase
        .from('participant_registrations')
        .insert({ ...baseData, created_at: now, updated_at: now });
      if (error) {
        console.error('participant send-otp insert', error);
        return jsonError('Could not save registration.', 500);
      }
    }

    const auth = createSupabaseAnonAuthClient();
    const { error: otpError } = await auth.auth.signInWithOtp({
      email: em,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      console.error('participant OTP', otpError);
      if (otpError.message?.toLowerCase().includes('rate limit')) {
        return jsonError('Too many OTP requests. Please wait a few minutes and try again.', 429);
      }
      return jsonError('Failed to send OTP.', 503);
    }

    return jsonOk({ success: true, message: 'OTP sent to your email.' });
  } catch (e) {
    console.error('participant send-otp', e);
    return jsonError('Failed to send OTP.', 500);
  }
}
