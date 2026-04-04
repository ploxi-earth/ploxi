import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase.from('projects').select('*').eq('vendor_id', vendorId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;
    return jsonOk({ success: true, data: data || [] });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();

    const { data, error } = await supabase.from('projects').insert({
      vendor_id: vendorId, user_id: user.id, title: body.title, description: body.description,
      client: body.client, value: body.value || 0, status: body.status || 'opportunity',
      start_date: body.startDate || null, end_date: body.endDate || null,
      progress: body.progress || 0, sector: body.sector, notes: body.notes,
    }).select().single();

    if (error) throw error;
    return jsonOk({ success: true, data }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
