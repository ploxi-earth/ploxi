import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: meetings } = await supabase
      .from('meetings').select('*').eq('vendor_id', vendorId).order('created_at', { ascending: false });

    const meetingRows = meetings || [];
    const hasApprovedMeeting = meetingRows.some((m) => String(m.meeting_link || '').trim());

    const normalizedRows = meetingRows.filter((m) => {
      const isRequestOnly =
        !String(m.meeting_link || '').trim() &&
        String(m.notes || '').toLowerCase().includes('vendor meeting request:');

      if (!isRequestOnly) return true;
      return !hasApprovedMeeting;
    });

    const formatted = normalizedRows.map((m) => {
      const now = new Date();

      let meetingDateTime: Date | null = null;
      if (m.scheduled_date && m.scheduled_time) {
        const candidate = new Date(`${m.scheduled_date}T${m.scheduled_time}`);
        if (!Number.isNaN(candidate.getTime())) {
          meetingDateTime = candidate;
        }
      }
      if (!meetingDateTime && m.scheduled_date) {
        const candidate = new Date(m.scheduled_date);
        if (!Number.isNaN(candidate.getTime())) {
          meetingDateTime = candidate;
        }
      }

      const noteText = String(m.notes || '').trim();
      const isApprovedRequest =
        noteText.toLowerCase().includes('vendor meeting request:') &&
        noteText.toLowerCase().includes('admin update: request approved') &&
        String(m.meeting_link || '').trim().length > 0;

      return {
        _id: m.id,
        type: 'Onboarding Meeting',
        date: m.scheduled_date,
        time: m.scheduled_time,
        link: m.meeting_link,
        note: isApprovedRequest
          ? `${noteText} | Status: Approved by admin`
          : noteText,
        status: meetingDateTime && meetingDateTime > now ? 'upcoming' : 'completed',
        scheduledAt: m.created_at,
      };
    });

    return jsonOk({ success: true, data: formatted });
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

    const preferredDate = body.preferredDate || null;
    const preferredTime = body.preferredTime || null;
    const note = String(body.note || '').trim();

    if (!note) {
      return jsonError('Please add a note for your meeting request.', 400);
    }

    await supabase.from('meetings').insert({
      vendor_id: vendorId,
      scheduled_date: preferredDate,
      scheduled_time: preferredTime,
      meeting_link: '',
      notes: `Vendor meeting request: ${note}`,
    });

    const { data: vendor } = await supabase
      .from('vendors')
      .select('company_name, contact_person, email')
      .eq('id', vendorId)
      .single();

    const { data: admins } = await supabase
      .from('admin_users')
      .select('id')
      .eq('role', 'platform_admin');

    if (admins && admins.length > 0) {
      const title = `Meeting request from ${vendor?.company_name || vendor?.contact_person || 'Vendor'}`;
      const details = [
        vendor?.email ? `Email: ${vendor.email}` : null,
        preferredDate ? `Preferred Date: ${preferredDate}` : null,
        preferredTime ? `Preferred Time: ${preferredTime}` : null,
        `Note: ${note}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const notifications = admins.map((a) => ({
        user_id: a.id,
        title,
        message: details,
        is_read: false,
      }));
      await supabase.from('notifications').insert(notifications);
    }

    return jsonOk({ success: true, message: 'Meeting request submitted.' }, 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
