import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import { jsonOk, jsonError } from '@/lib/auth';

const ONBOARDING_STAGES = [
  'registration', 'admin_review', 'company_details_submitted',
  'intro_meeting_scheduled', 'agreement_sent', 'agreement_signed', 'onboarded',
];

export async function POST(req: NextRequest) {
  try {
    const { companyName, contactPerson, email, phone, password } = await req.json();

    if (!companyName || !contactPerson || !email || !phone || !password) {
      return jsonError('All fields are required.', 400);
    }
    if (String(password).length < 8) {
      return jsonError('Password must be at least 8 characters.', 400);
    }

    const em = String(email).toLowerCase().trim();
    const { data: existing } = await supabase
      .from('vendors')
      .select('id, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (existing?.email_verified) {
      return jsonError('An account with this email already exists.', 400);
    }

    const password_hash = await bcrypt.hash(String(password), 12);

    const vendorPayload = {
      company_name: String(companyName).trim(),
      contact_person: String(contactPerson).trim(),
      email: em,
      phone: String(phone).trim(),
      password_hash,
      status: 'pending' as const,
      email_verified: false,
    };

    let vendorId: string;

    if (existing && !existing.email_verified) {
      const { error: upErr } = await supabase.from('vendors').update(vendorPayload).eq('id', existing.id);
      if (upErr) {
        console.error('vendor send-otp update', upErr);
        return jsonError('Failed to update registration.', 500);
      }
      vendorId = existing.id;
    } else {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert(vendorPayload)
        .select('id')
        .single();

      if (vendorError || !vendor) {
        console.error('vendor send-otp insert', vendorError);
        return jsonError('Failed to create vendor account.', 500);
      }
      vendorId = vendor.id;

      const stages = ONBOARDING_STAGES.map((stage_name, idx) => ({
        vendor_id: vendorId,
        stage_name,
        status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'pending',
        completed_at: idx === 0 ? new Date().toISOString() : null,
      }));
      const { error: stErr } = await supabase.from('onboarding_stages').insert(stages);
      if (stErr) {
        console.error('vendor onboarding_stages', stErr);
        await supabase.from('vendors').delete().eq('id', vendorId);
        return jsonError('Failed to initialize onboarding.', 500);
      }
    }

    const auth = createSupabaseAnonAuthClient();
    const { error: otpError } = await auth.auth.signInWithOtp({
      email: em,
      options: {
        shouldCreateUser: true,
        data: {
          company_name: String(companyName).trim(),
          full_name: String(contactPerson).trim(),
        },
      },
    });

    if (otpError) {
      console.error('vendor OTP send', otpError);
      if (otpError.message?.toLowerCase().includes('rate limit')) {
        return jsonError('Too many OTP requests. Please wait a few minutes and try again.', 429);
      }
      return jsonError('Failed to send OTP. Please try again.', 503);
    }

    return jsonOk({
      success: true,
      message: 'OTP sent to your email. Please check your inbox and spam folder.',
      vendorId,
    });
  } catch (e) {
    console.error('vendor send-otp', e);
    return jsonError('Failed to send OTP.', 500);
  }
}
