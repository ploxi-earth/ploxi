import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import {
  DocusignConfigError,
  DocusignRequestError,
  sendAgreementEnvelope,
} from '@/lib/docusign';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, 'platform_admin');
    const { note } = await req.json().catch(() => ({ note: '' }));

    const { data: vendor } = await supabase.from('vendors').select('*').eq('id', params.id).single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const envelope = await sendAgreementEnvelope({
      vendorId: vendor.id,
      vendorName: vendor.company_name || vendor.contact_person || 'Vendor',
      recipientEmail: vendor.email,
    });

    const deliveryStatus = envelope.status || 'sent';

    await supabase.from('agreements').insert({
      vendor_id: vendor.id,
      file_name: 'Partnership Agreement',
      sent_at: envelope.sentAt || new Date().toISOString(),
      recipient_email: vendor.email,
      docusign_envelope_id: envelope.envelopeId || null,
      docusign_provider: envelope.provider || 'docusign',
      docusign_status: deliveryStatus,
    });

    await supabase
      .from('onboarding_stages')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('vendor_id', vendor.id)
      .eq('stage_name', 'intro_meeting_scheduled');

    await supabase
      .from('onboarding_stages')
      .update({ status: 'active' })
      .eq('vendor_id', vendor.id)
      .eq('stage_name', 'agreement_sent');

    const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
    return jsonOk({
      success: true,
      data: updated,
      message: note
        ? 'Agreement sent with admin instructions.'
        : 'Agreement sent.',
      agreement: {
        ...envelope,
        deliveryStatus,
      },
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (err.message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    if (err instanceof DocusignConfigError) {
      console.error('[docusign] configuration error while sending agreement', {
        vendorId: params.id,
        recipientEmail: null,
        envelopeId: null,
        httpStatus: 503,
        responseBody: err.message,
      });
      return jsonError(err.message, err.statusCode);
    }
    if (err instanceof DocusignRequestError) {
      console.error('[docusign] agreement send failed', err.details);
      return jsonError(err.message, err.statusCode);
    }
    console.error('[docusign] unexpected agreement send failure', {
      vendorId: params.id,
      error: err instanceof Error ? err.message : err,
    });
    return jsonError('Internal server error.', 500);
  }
}
