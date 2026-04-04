import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');

    const vendorId = params.id;
    if (!vendorId) return jsonError('Vendor id is required.', 400);

    const { data: vendor, error: fetchErr } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
    if (fetchErr || !vendor) return jsonError('Vendor not found.', 404);

    const now = new Date().toISOString();

    const { data: updated, error: updateErr } = await supabase
      .from('vendors')
      .update({ status: 'onboarded', onboarded_at: now })
      .eq('id', vendor.id)
      .select('*')
      .single();

    if (updateErr) {
      console.error('[complete-onboarding] vendors update:', updateErr);
      return jsonError(updateErr.message || 'Failed to update vendor status.', 500);
    }
    if (!updated || updated.status !== 'onboarded') {
      return jsonError('Vendor status was not updated. Check database permissions and schema.', 500);
    }

    const { error: stagesErr } = await supabase
      .from('onboarding_stages')
      .update({ status: 'completed', completed_at: now })
      .eq('vendor_id', vendor.id);

    if (stagesErr) {
      console.error('[complete-onboarding] onboarding_stages update:', stagesErr);
      return jsonError(stagesErr.message || 'Failed to update onboarding stages.', 500);
    }

    return jsonOk({ success: true, data: updated, message: 'Vendor onboarding completed.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    console.error('[complete-onboarding]', err);
    return jsonError('Internal server error.', 500);
  }
}
