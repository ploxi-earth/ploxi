import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', params.id)
      .single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const viewedAt = new Date().toISOString();

    await supabase
      .from('agreements')
      .update({ viewed: true, viewed_at: viewedAt })
      .eq('vendor_id', vendor.id)
      .is('viewed_at', null);

    const { data: updated } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendor.id)
      .single();

    return jsonOk({
      success: true,
      data: updated,
      message: 'Agreement marked as viewed.',
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
