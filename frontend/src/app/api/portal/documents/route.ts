import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: docs } = await supabase.from('documents').select('*').eq('vendor_id', vendorId).order('created_at', { ascending: false });
    const allDocs = [...(docs || [])];

    // Include agreement as a virtual document
    const { data: agreements } = await supabase.from('agreements').select('*').eq('vendor_id', vendorId).order('sent_at', { ascending: false }).limit(1);
    const latest = agreements?.[0];
    if (latest) {
      allDocs.unshift({
        id: 'partnership-agreement', name: 'Partnership Agreement', type: 'agreement',
        status: latest.signed ? 'signed' : 'shared', shared_by: 'admin',
        created_at: latest.sent_at, updated_at: latest.signed_at || latest.sent_at,
        notes: latest.signed ? 'Agreement signed' : 'Pending signature',
        vendor_id: vendorId, user_id: null, description: null, file_url: null,
      });
    }

    return jsonOk({ success: true, data: allDocs });
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

    const { data, error } = await supabase.from('documents').insert({
      vendor_id: vendorId, user_id: user.id, name: body.name, description: body.description,
      type: body.type || 'other', file_url: body.fileUrl, notes: body.notes, shared_by: 'vendor',
    }).select().single();

    if (error) throw error;
    return jsonOk({ success: true, data }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
