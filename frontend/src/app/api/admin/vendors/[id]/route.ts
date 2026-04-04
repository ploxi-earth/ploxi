import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import { buildAdminVendorDetail } from '@/lib/vendorLifecycle';

// GET /api/admin/vendors/[id] — single vendor (camelCase DTO matching Express admin.controller)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(req, 'platform_admin');

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', params.id).single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const [
      { data: stages },
      { data: profile },
      { data: meetings },
      { data: agreements },
    ] = await Promise.all([
      supabase.from('onboarding_stages').select('*').eq('vendor_id', vendor.id).order('created_at', { ascending: true }),
      supabase.from('vendor_profiles').select('*').eq('vendor_id', vendor.id).maybeSingle(),
      supabase.from('meetings').select('*').eq('vendor_id', vendor.id).order('created_at', { ascending: false }),
      supabase.from('agreements').select('*').eq('vendor_id', vendor.id).order('sent_at', { ascending: false }),
    ]);

    const { data: unreadNotifications } = await supabase
      .from('notifications')
      .select('id, title, message, created_at')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(200);

    const vendorEmail = String(vendor.email || '').toLowerCase();
    const vendorCompany = String(vendor.company_name || '').toLowerCase();

    const meetingRequestNotifications = (unreadNotifications || []).filter((notification) => {
      const combined = `${notification.title || ''} ${notification.message || ''}`.toLowerCase();
      if (!combined.includes('meeting request')) return false;

      const emailMatch = /email:\s*([^|\n]+)/i.exec(notification.message || '');
      const email = emailMatch?.[1]?.trim().toLowerCase();
      if (email && email === vendorEmail) return true;

      const title = String(notification.title || '').toLowerCase();
      return !!vendorCompany && title.includes(vendorCompany);
    });

    const latestMeetingRequest = meetingRequestNotifications[0] || null;

    const data = {
      ...buildAdminVendorDetail(vendor, stages || [], profile, meetings || [], agreements || []),
      meetingRequestAlert: {
        hasPending: meetingRequestNotifications.length > 0,
        message: latestMeetingRequest?.message || '',
        raisedAt: latestMeetingRequest?.created_at || null,
        notificationIds: meetingRequestNotifications.map((notification) => notification.id),
      },
    };

    return jsonOk({
      success: true,
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
