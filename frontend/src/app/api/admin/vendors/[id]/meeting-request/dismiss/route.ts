import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(req, 'platform_admin');
    const body = await req.json().catch(() => ({}));
    const notificationIds: string[] = Array.isArray(body.notificationIds) ? body.notificationIds : [];

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, email, company_name')
      .eq('id', params.id)
      .single();

    if (!vendor) return jsonError('Vendor not found.', 404);

    if (notificationIds.length === 0) {
      return jsonError('No meeting request notifications found to dismiss.', 400);
    }

    const query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .or('title.ilike.%meeting request%,message.ilike.%meeting request%')
      .in('id', notificationIds);

    await query;

    return jsonOk({ success: true, message: 'Meeting request dismissed.' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
