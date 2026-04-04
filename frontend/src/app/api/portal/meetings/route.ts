import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: meetings } = await supabase
      .from('meetings').select('*').eq('vendor_id', vendorId).order('created_at', { ascending: false });

    const formatted = (meetings || []).map(m => ({
      _id: m.id, type: 'Onboarding Meeting', date: m.scheduled_date,
      time: m.scheduled_time, link: m.meeting_link, note: m.notes,
      status: m.scheduled_date && new Date(m.scheduled_date) > new Date() ? 'upcoming' : 'completed',
      scheduledAt: m.created_at,
    }));

    return jsonOk({ success: true, data: formatted });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
