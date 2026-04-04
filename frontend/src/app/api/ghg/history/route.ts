import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    let query = supabase.from('ghg_calculations').select('*');
    if (user) query = query.eq('user_id', user.id);
    else if (sessionId) query = query.eq('session_id', sessionId);

    const { data } = await query.order('created_at', { ascending: false }).limit(20);
    return jsonOk({ success: true, data: data || [] });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    return jsonError('Internal server error.', 500);
  }
}
