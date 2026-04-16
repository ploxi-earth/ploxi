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
      .select('id, company_name, contact_person, email, status, password_hash, email_verified')
      .eq('email', normalizedEmail)
      .single();

    console.debug('Vendor login lookup', {
      email: normalizedEmail,
      found: !!vendor,
      hashPrefix: vendor?.password_hash?.slice?.(0, 4) || null,
      hashLen: vendor?.password_hash?.length || 0,
    });

    if (!vendor) return jsonError('Invalid email or password.', 401);

    let storedHash = vendor.password_hash;
    if (typeof storedHash === 'string' && storedHash.startsWith('$2y$')) {
      storedHash = '$2a$' + storedHash.slice(4);
      console.debug('Normalized bcrypt hash prefix $2y -> $2a for vendor login', normalizedEmail);
    }

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) {
      console.debug('Vendor login bcrypt.compare failed for', normalizedEmail, 'hashPrefix', storedHash?.slice?.(0,4));
      return jsonError('Invalid email or password.', 401);
    }

    if (vendor.email_verified === false) {
      return jsonError('Please complete email verification from the OTP sent when you registered.', 403);
    }

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
