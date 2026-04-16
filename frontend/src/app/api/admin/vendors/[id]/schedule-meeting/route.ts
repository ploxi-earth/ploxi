import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import { sendVendorMeetingScheduledEmail } from '@/lib/registrationEmails';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');
    const { date, time, link, note } = await req.json();

    if (!date || !time) return jsonError('Meeting date and time are required.', 400);
    if (!String(link || '').trim()) return jsonError('Meeting link is required.', 400);

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', params.id).single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const { data: pendingRequest } = await supabase
      .from('meetings')
      .select('id, notes')
      .eq('vendor_id', vendor.id)
      .or('meeting_link.is.null,meeting_link.eq.')
      .ilike('notes', 'Vendor meeting request:%')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingRequest?.id) {
      const existingNote = String(pendingRequest.notes || '').trim();
      const adminNote = String(note || '').trim();

      const mergedNote = [
        existingNote,
        'Admin update: Request approved and meeting scheduled.',
        adminNote ? `Admin note: ${adminNote}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      await supabase
        .from('meetings')
        .update({
          scheduled_date: date,
          scheduled_time: time,
          meeting_link: String(link).trim(),
          notes: mergedNote,
        })
        .eq('id', pendingRequest.id);
    } else {
      await supabase.from('meetings').insert({
        vendor_id: vendor.id,
        scheduled_date: date,
        scheduled_time: time,
        meeting_link: String(link).trim(),
        notes: note,
      });
    }

    // Lifecycle dependency rule:
    // - Before onboarding completion, meeting scheduling advances onboarding.
    // - After onboarding completion (status: onboarded), meetings are independent events.
    if (vendor.status !== 'onboarded') {
      await supabase.from('vendors').update({ status: 'onboarding' }).eq('id', vendor.id);

      await supabase
        .from('onboarding_stages')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('vendor_id', vendor.id)
        .eq('stage_name', 'company_details_submitted');

      await supabase
        .from('onboarding_stages')
        .update({ status: 'active' })
        .eq('vendor_id', vendor.id)
        .eq('stage_name', 'intro_meeting_scheduled');
    }

    const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();

    if (vendor.email) {
      await sendVendorMeetingScheduledEmail(
        vendor.email,
        vendor.contact_person || vendor.company_name || 'Vendor',
        date,
        time,
        String(link).trim()
      );
    }

    return jsonOk({ success: true, data: updated });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
