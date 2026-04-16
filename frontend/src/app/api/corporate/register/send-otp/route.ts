import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import { jsonOk, jsonError } from '@/lib/auth';

/** Step 1: persist company details + send Supabase Auth OTP (Brevo SMTP in project settings). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, formData } = body as {
      email?: string;
      formData?: Record<string, unknown>;
    };

    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em || !em.includes('@')) {
      return jsonError('Valid email required.', 400);
    }

    const fd = formData || {};
    const fullName = String(fd.fullName || '').trim();
    const designation = String(fd.designation || '').trim();
    const companyName = String(fd.companyName || '').trim();
    const industrySector = String(fd.industrySector || '').trim();
    const phone = String(fd.phone || '').trim();
    const customIndustry = fd.customIndustry != null ? String(fd.customIndustry).trim() : '';

    if (!fullName || !designation || !companyName || !industrySector || !phone) {
      return jsonError('Please complete all required company detail fields.', 400);
    }

    const { data: existing } = await supabase
      .from('corporate_registrations')
      .select('email, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (existing?.email_verified) {
      return jsonError('This email is already registered.', 400);
    }

    const website = fd.website != null ? String(fd.website).trim() : '';
    const industry =
      industrySector === 'Other' && customIndustry ? customIndustry : industrySector;

    const dataToSave = {
      full_name: fullName,
      designation,
      company_name: companyName,
      website: website || null,
      industry_sector: industry,
      custom_industry: industrySector === 'Other' ? customIndustry || null : null,
      email: em,
      phone,
      email_verified: false,
      registration_step: 1,
      status: 'pending' as const,
    };

    if (existing) {
      const { error: upErr } = await supabase.from('corporate_registrations').update(dataToSave).eq('email', em);
      if (upErr) {
        console.error('corporate send-otp update', upErr);
        return jsonError('Could not save registration.', 500);
      }
    } else {
      const { error: insErr } = await supabase.from('corporate_registrations').insert(dataToSave);
      if (insErr) {
        console.error('corporate send-otp insert', insErr);
        return jsonError('Could not save registration.', 500);
      }
    }

    const auth = createSupabaseAnonAuthClient();
    const { error: otpError } = await auth.auth.signInWithOtp({
      email: em,
      options: {
        shouldCreateUser: true,
        data: {
          company_name: companyName,
          full_name: fullName,
        },
      },
    });

    if (otpError) {
      console.error('corporate OTP send', otpError);
      if (otpError.message?.toLowerCase().includes('rate limit')) {
        return jsonError('Too many OTP requests. Please wait a few minutes and try again.', 429);
      }
      return jsonError('Failed to send OTP. Please try again.', 503);
    }

    return jsonOk({
      success: true,
      message: 'OTP sent to your email. Please check your inbox and spam folder.',
    });
  } catch (e) {
    console.error('corporate send-otp', e);
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('NEXT_PUBLIC_SUPABASE')) {
      return jsonError('OTP is not configured (missing Supabase anon key).', 500);
    }
    return jsonError('Failed to send OTP.', 500);
  }
}
