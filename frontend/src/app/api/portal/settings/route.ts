import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (body.contactPerson) updates.contact_person = body.contactPerson;
    if (body.phone) updates.phone = body.phone;
    if (body.email) updates.email = body.email.toLowerCase().trim();

    if (Object.keys(updates).length > 0) {
      await supabase.from('vendors').update(updates).eq('id', vendorId);
    }

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
    return jsonOk({ success: true, data: vendor });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
