import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { requireAuth, sendTokenResponse, jsonError } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return jsonError('Current and new passwords are required.', 400);
    if (newPassword.length < 8) return jsonError('Password must be at least 8 characters.', 400);

    const newHash = await bcrypt.hash(newPassword, 12);

    if (user.role === 'vendor') {
      // Vendor: query and update vendors table
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, contact_person, email, password_hash')
        .eq('id', user.id)
        .single();

      if (!vendor) return jsonError('User not found.', 404);

      let storedHash = vendor.password_hash;
      if (typeof storedHash === 'string' && storedHash.startsWith('$2y$')) {
        storedHash = '$2a$' + storedHash.slice(4);
        console.debug('Normalized bcrypt hash prefix $2y -> $2a for change-password (vendor)');
      }
      const valid = await bcrypt.compare(currentPassword, storedHash);
      if (!valid) return jsonError('Current password is incorrect.', 401);

      await supabase
        .from('vendors')
        .update({ password_hash: newHash })
        .eq('id', vendor.id);

      return sendTokenResponse({ id: vendor.id, name: vendor.contact_person, email: vendor.email, role: 'vendor' });
    } else {
      // Admin / Consultant / Manager: query and update admin_users table
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id, name, email, password_hash')
        .eq('id', user.id)
        .single();

      if (!admin) return jsonError('User not found.', 404);

      let storedHashAdmin = admin.password_hash;
      if (typeof storedHashAdmin === 'string' && storedHashAdmin.startsWith('$2y$')) {
        storedHashAdmin = '$2a$' + storedHashAdmin.slice(4);
        console.debug('Normalized bcrypt hash prefix $2y -> $2a for change-password (admin)');
      }
      const valid = await bcrypt.compare(currentPassword, storedHashAdmin);
      if (!valid) return jsonError('Current password is incorrect.', 401);

      await supabase
        .from('admin_users')
        .update({ password_hash: newHash, password_changed_at: new Date().toISOString() })
        .eq('id', admin.id);

      return sendTokenResponse({ id: admin.id, name: admin.name, email: admin.email, role: user.role });
    }
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    console.error('Change password error:', err);
    return jsonError('Internal server error.', 500);
  }
}
