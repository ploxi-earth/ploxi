import { NextRequest } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { sendTokenResponse, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { password } = await req.json();
    if (!password || password.length < 8) return jsonError('Password must be at least 8 characters.', 400);

    const hashedToken = crypto.createHash('sha256').update(params.token).digest('hex');

    // Vendor-only password reset
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('password_reset_token', hashedToken)
      .gt('password_reset_expires', new Date().toISOString())
      .single();

    if (!vendor) return jsonError('Token is invalid or has expired.', 400);

    const password_hash = await bcrypt.hash(password, 12);

    await supabase
      .from('vendors')
      .update({
        password_hash,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq('id', vendor.id);

    const { data: updatedVendor } = await supabase
      .from('vendors')
      .select('id, contact_person, email')
      .eq('id', vendor.id)
      .single();

    if (!updatedVendor) return jsonError('Vendor not found.', 404);
    return sendTokenResponse({
      id: updatedVendor.id,
      name: updatedVendor.contact_person,
      email: updatedVendor.email,
      role: 'vendor',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return jsonError('Internal server error.', 500);
  }
}
