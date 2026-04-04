import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'platform_admin');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = supabase.from('cleantech_registrations').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);

    const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    return jsonOk({ success: true, data: data || [], pagination: { total: count || 0, page, limit } });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
