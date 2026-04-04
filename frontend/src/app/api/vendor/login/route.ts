import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { sendTokenResponse, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return jsonError('Email and password are required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, company_name, contact_person, email, status, password_hash')
      .eq('email', normalizedEmail)
      .single();

    if (!vendor) return jsonError('Invalid email or password.', 401);

    const valid = await bcrypt.compare(password, vendor.password_hash);
    if (!valid) return jsonError('Invalid email or password.', 401);

    if (vendor.status === 'pending') return jsonError('Your application is currently under review.', 403);
    if (vendor.status === 'rejected') return jsonError('Your application has been rejected.', 403);

    return sendTokenResponse({
      id: vendor.id,
      name: vendor.contact_person,
      email: vendor.email,
      role: 'vendor',
    });
  } catch (err: any) {
    console.error('Vendor login error:', err);
    return jsonError('Internal server error.', 500);
  }
}
