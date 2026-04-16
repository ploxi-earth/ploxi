import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySupabaseEmailOtp } from '@/lib/otpVerification';
import { notifyAdminsNewVendor } from '@/lib/registrationEmails';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const em = typeof email === 'string' ? email.toLowerCase().trim() : '';

    const result = await verifySupabaseEmailOtp(em, otp);
    if (!result.ok) {
      return jsonError(result.message, result.status);
    }

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, company_name, contact_person, email, email_verified')
      .eq('email', em)
      .maybeSingle();

    if (!vendor) {
      return jsonError('Vendor registration not found. Please start again.', 404);
    }

    if (vendor.email_verified) {
      return jsonOk({ success: true, message: 'Email already verified.' });
    }

    const { error: upErr } = await supabase
      .from('vendors')
      .update({ email_verified: true })
      .eq('id', vendor.id);

    if (upErr) {
      console.error('vendor verify-otp update', upErr);
      return jsonError('Verification succeeded but could not update your account.', 500);
    }

    await notifyAdminsNewVendor(vendor.company_name, vendor.contact_person, vendor.email);

    return jsonOk({
      success: true,
      message: 'Email verified. Your application is under review.',
    });
  } catch (e) {
    console.error('vendor verify-otp', e);
    return jsonError('Verification failed.', 500);
  }
}
