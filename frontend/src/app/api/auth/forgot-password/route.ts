import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { jsonOk, jsonError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return jsonError('Email is required.', 400);

    const normalizedEmail = email.toLowerCase().trim();

    // Vendor-only forgot password
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, email')
      .eq('email', normalizedEmail)
      .single();

    // Don't reveal if email exists
    if (!vendor) return jsonOk({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await supabase
      .from('vendors')
      .update({
        password_reset_token: hashedToken,
        password_reset_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
      .eq('id', vendor.id);

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${resetToken}`;

    return jsonOk({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return jsonError('Internal server error.', 500);
  }
}
