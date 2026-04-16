import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createSupabaseAnonAuthClient } from '@/lib/supabaseAnonAuth';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, formData } = body as { email?: string; formData?: Record<string, string> };
    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';
    if (!em || !em.includes('@')) return jsonError('Valid email required.', 400);

    const fd = formData || {};
    const { data: existing } = await supabase
      .from('raise_funding_registrations')
      .select('email, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (existing?.email_verified) return jsonError('This email is already registered.', 400);

    const companyName =
      String(fd.organization || '').trim() ||
      String(fd.projectName || '').trim() ||
      String(fd.fullName || '').trim() ||
      null;

    // const dataToSave = {
    //   email: em,
    //   company_name: companyName,
    //   full_name: String(fd.fullName || '').trim() || null,
    //   phone: String(fd.phone || '').trim() || null,
    //   organization: String(fd.organization || '').trim() || null,
    //   project_name: String(fd.projectName || '').trim() || null,
    //   project_description: String(fd.projectDescription || '').trim() || null,
    //   funding_required: String(fd.fundingRequired || '').trim() || null,
    //   project_stage: String(fd.projectStage || '').trim() || null,
    //   sector: String(fd.sector || '').trim() || null,
    //   funding_stage: String(fd.projectStage || '').trim() || null,
    //   funding_amount: String(fd.fundingRequired || '').trim() || null,
    //   funding_purpose: String(fd.projectDescription || '').trim() || null,
    //   email_verified: false,
    //   status: 'pending' as const,
    //   user_type: 'raise_funding' as const,
    // };
    const dataToSave = {
  email: em,
  company_name: companyName,

  // ✅ map form → DB columns
  funding_stage: String(fd.projectStage || '').trim() || null,
  funding_amount: String(fd.fundingRequired || '').trim() || null,
  funding_purpose: String(fd.projectDescription || '').trim() || null,

  // optional fields
  use_of_funds: String(fd.projectDescription || '').trim() || null,
  current_revenue: null, // or map if you collect it

  email_verified: false,
  status: 'pending',
  user_type: 'raise_funding',
};

    if (existing) {
      const { error } = await supabase.from('raise_funding_registrations').update(dataToSave).eq('email', em);
      if (error) {
        console.error('raise-funding send-otp update', error);
        return jsonError('Could not save registration.', 500);
      }
    } else {
      const { error } = await supabase.from('raise_funding_registrations').insert(dataToSave);
      if (error) {
        console.error('raise-funding send-otp insert', error);
        return jsonError('Could not save registration.', 500);
      }
    }

    const auth = createSupabaseAnonAuthClient();
    const { error: otpError } = await auth.auth.signInWithOtp({
      email: em,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      console.error('raise-funding OTP', otpError);
      if (otpError.message?.toLowerCase().includes('rate limit')) {
        return jsonError('Too many OTP requests. Please wait a few minutes and try again.', 429);
      }
      return jsonError('Failed to send OTP.', 503);
    }

    return jsonOk({ success: true, message: 'OTP sent to your email.' });
  } catch (e) {
    console.error('raise-funding send-otp', e);
    return jsonError('Failed to send OTP.', 500);
  }
}
