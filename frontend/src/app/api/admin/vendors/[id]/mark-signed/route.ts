import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', params.id).single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    await supabase
      .from('agreements')
      .update({
        viewed: true,
        viewed_at: new Date().toISOString(),
        signed: true,
        signed_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendor.id)
      .is('signed_at', null);

    await supabase
      .from('onboarding_stages')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('vendor_id', vendor.id)
      .eq('stage_name', 'agreement_sent');

    await supabase
      .from('onboarding_stages')
      .update({ status: 'active' })
      .eq('vendor_id', vendor.id)
      .eq('stage_name', 'agreement_signed');

    const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
    return jsonOk({ success: true, data: updated });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
