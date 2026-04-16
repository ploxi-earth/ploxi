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

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, name, email, password_hash, is_active')
      .eq('email', normalizedEmail)
      .single();

    console.debug('Admin login lookup', { email: normalizedEmail, found: !!admin, hashPrefix: admin?.password_hash?.slice?.(0,4) || null });

    if (!admin) return jsonError('Invalid email or password.', 401);

    let storedHash = admin.password_hash;
    if (typeof storedHash === 'string' && storedHash.startsWith('$2y$')) {
      storedHash = '$2a$' + storedHash.slice(4);
      console.debug('Normalized bcrypt hash prefix $2y -> $2a for admin login', normalizedEmail);
    }

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) return jsonError('Invalid email or password.', 401);

    if (admin.is_active === false) return jsonError('Your account has been deactivated.', 403);

    return sendTokenResponse({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'platform_admin',
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return jsonError('Internal server error.', 500);
  }
}
