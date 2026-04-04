import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const body = await req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.pricing !== undefined) {
      const pricing = Number(body.pricing);
      if (Number.isNaN(pricing) || pricing < 0) {
        return jsonError('Service pricing must be a valid non-negative number.', 400);
      }
    }

    const map: Record<string, string> = {
      name: 'name', description: 'description', category: 'category',
      sector: 'sector', tags: 'tags', status: 'status', pricing: 'pricing',
      deliveryTimeline: 'delivery_timeline', coverImage: 'cover_image',
    };
    for (const [k, v] of Object.entries(map)) if (body[k] !== undefined) updates[v] = body[k];

    const { data, error } = await supabase.from('services').update(updates).eq('id', params.id).eq('vendor_id', vendorId).select().single();
    if (error || !data) return jsonError('Service not found.', 404);
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
    await supabase.from('services').delete().eq('id', params.id).eq('vendor_id', vendorId);
    return jsonOk({ success: true, message: 'Service deleted.' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
