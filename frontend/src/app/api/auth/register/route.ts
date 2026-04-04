import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
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

    if (password.length < 8) {
      return jsonError('Password must be at least 8 characters.', 400);
    }

    // Check if vendor email already exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return jsonError('An account with this email already exists.', 400);
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Insert vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        company_name: companyName,
        contact_person: contactPerson,
        email: email.toLowerCase().trim(),
        phone,
        password_hash,
        status: 'pending',
      })
      .select('id, company_name, contact_person, email, phone, status, created_at')
      .single();

    if (vendorError) {
      console.error('Vendor insert error:', vendorError);
      return jsonError('Failed to create vendor account.', 500);
    }

    // Seed onboarding stages
    const stages = ONBOARDING_STAGES.map((stage_name, idx) => ({
      vendor_id: vendor.id,
      stage_name,
      status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'pending',
      completed_at: idx === 0 ? new Date().toISOString() : null,
    }));
    await supabase.from('onboarding_stages').insert(stages);

    return jsonOk({
      success: true,
      message: 'Registration submitted! Your application is under review.',
    }, 201);
  } catch (err: any) {
    console.error('Register error:', err);
    return jsonError('Internal server error.', 500);
  }
}
