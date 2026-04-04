import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const map: Record<string, string> = {
      title: 'title', description: 'description', client: 'client',
      value: 'value', status: 'status', startDate: 'start_date',
      endDate: 'end_date', progress: 'progress', sector: 'sector', notes: 'notes',
    };
    for (const [k, v] of Object.entries(map)) if (body[k] !== undefined) updates[v] = body[k];

    const { data, error } = await supabase.from('projects').update(updates).eq('id', params.id).eq('vendor_id', vendorId).select().single();
    if (error || !data) return jsonError('Project not found.', 404);
    return jsonOk({ success: true, data });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    await supabase.from('projects').delete().eq('id', params.id).eq('vendor_id', vendorId);
    return jsonOk({ success: true, message: 'Project deleted.' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
