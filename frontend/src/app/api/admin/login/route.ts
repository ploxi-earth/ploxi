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

    if (!admin) return jsonError('Invalid email or password.', 401);

    const valid = await bcrypt.compare(password, admin.password_hash);
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
