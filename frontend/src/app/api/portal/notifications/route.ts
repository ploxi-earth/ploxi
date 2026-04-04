import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const { data } = await supabase
      .from('notifications').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(50);

    const { count: unreadCount } = await supabase
      .from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false);

    return jsonOk({ success: true, data: data || [], unreadCount: unreadCount || 0 });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
