import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;
    const { data, error } = await supabase.from('services').select('*').eq('vendor_id', vendorId).order('created_at', { ascending: false });
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

    const { data, error } = await supabase.from('services').insert({
      vendor_id: vendorId, user_id: user.id, name: body.name, description: body.description,
      category: body.category, sector: body.sector, tags: body.tags || [],
      status: body.status || 'active', pricing: body.pricing,
      delivery_timeline: body.deliveryTimeline, cover_image: body.coverImage,
    }).select().single();

    if (error) throw error;
    return jsonOk({ success: true, data }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
