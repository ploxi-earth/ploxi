import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');
    const { portalAccessStatus, reason } = await req.json();

    if (!['active', 'paused'].includes(portalAccessStatus)) {
      return jsonError('Invalid portal access status.', 400);
    }

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', params.id).single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const manageable = ['approved', 'onboarding', 'onboarded'];
    if (!manageable.includes(vendor.status)) {
      return jsonError('Portal access can only be managed after vendor approval.', 400);
    }

    const { data: existingProfile } = await supabase
      .from('vendor_profiles')
      .select('id')
      .eq('vendor_id', vendor.id)
      .maybeSingle();

    const profileData: Record<string, unknown> = {
      vendor_id: vendor.id,
      portal_access_status: portalAccessStatus,
      updated_at: new Date().toISOString(),
    };

    if (portalAccessStatus === 'paused') {
      profileData.portal_access_paused_at = new Date().toISOString();
      profileData.portal_access_pause_reason = reason?.trim() || null;
    }

    if (existingProfile) {
      await supabase.from('vendor_profiles').update(profileData).eq('vendor_id', vendor.id);
    } else {
      await supabase.from('vendor_profiles').insert(profileData);
    }

    return jsonOk({
      success: true,
      data: vendor,
      message: portalAccessStatus === 'paused' ? 'Portal access paused.' : 'Portal access reactivated.',
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
