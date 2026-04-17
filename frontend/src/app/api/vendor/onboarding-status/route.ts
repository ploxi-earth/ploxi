import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import {
  calculateProfileCompletion,
  buildOnboardingHistory,
  computeOnboardingStage,
  normalizeAgreementStatus,
  normalizeMeetingStatus,
} from '@/lib/vendorLifecycle';
import { fetchEnvelopeRecipientDiagnostics } from '@/lib/docusign';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, status, company_name, contact_person, email, phone, created_at, logo_url, vendor_type')
      .eq('id', vendorId)
      .single();
    if (!vendor) return jsonError('Vendor not found.', 404);

    const { data: stages } = await supabase
      .from('onboarding_stages')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: true });

    const { data: meetings } = await supabase
      .from('meetings')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .limit(1);

    const { data: agreements } = await supabase
      .from('agreements')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('sent_at', { ascending: false })
      .limit(1);

    const { data: profile } = await supabase
      .from('vendor_profiles')
      .select('services, sector, location, website, description, profile_completed, locations_served, industry_focus, corporate_profile, legal_entity_name, gst_number, registered_address')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    const onboardingStage = computeOnboardingStage(vendor.status, stages || []);
    const onboardingHistory = buildOnboardingHistory(stages || []);
    const latestMeeting = meetings?.[0] || null;
    const latestAgreement = agreements?.[0] || null;
    const agreementStatus = normalizeAgreementStatus(latestAgreement);
    const meetingStatus = normalizeMeetingStatus(latestMeeting);
    const profileCompletion = profile?.profile_completed
      ? 100
      : calculateProfileCompletion(vendor, profile);
    const agreementRecipientDiagnostics = latestAgreement?.docusign_envelope_id
      ? await fetchEnvelopeRecipientDiagnostics({
          vendorId,
          envelopeId: latestAgreement.docusign_envelope_id,
          recipientEmail:
            latestAgreement?.recipient_email ||
            latestAgreement?.sent_to_email ||
            latestAgreement?.to_email ||
            vendor.email,
        }).catch(() => null)
      : null;

    return jsonOk({
      success: true,
      data: {
        status: vendor.status,
        vendorType: vendor.vendor_type || 'service',
        onboardingStage,
        onboardingHistory,
        onboardingStages: stages || [],
        meeting: latestMeeting || null,
        agreement: latestAgreement || null,
        meetingDate: latestMeeting?.scheduled_date || null,
        meetingTime: latestMeeting?.scheduled_time || null,
        meetingLink: latestMeeting?.meeting_link || null,
        meetingStatus,
        meetingTimezone: latestMeeting?.vendor_timezone || null,
        agreementStatus,
        agreementSentAt: latestAgreement?.sent_at || null,
        agreementViewedAt: latestAgreement?.viewed_at || null,
        agreementSignedAt: latestAgreement?.signed_at || null,
        agreementEnvelopeId: latestAgreement?.docusign_envelope_id || null,
        agreementDeliveryStatus:
          latestAgreement?.docusign_status ||
          (latestAgreement?.docusign_envelope_id ? 'sent' : null),
        agreementSentToEmail:
          latestAgreement?.recipient_email ||
          latestAgreement?.sent_to_email ||
          latestAgreement?.to_email ||
          vendor.email,
        agreementRecipientStatus: agreementRecipientDiagnostics?.recipientStatus || null,
        agreementRecipientDeliveredAt: agreementRecipientDiagnostics?.recipientDeliveredAt || null,
        agreementRecipientSentAt: agreementRecipientDiagnostics?.recipientSentAt || null,
        agreementRecipientName: agreementRecipientDiagnostics?.recipientName || null,
        agreementRecipientEmail: agreementRecipientDiagnostics?.recipientEmail || null,
        profileCompletion: profile?.profile_completed ? 100 : profileCompletion,
        logoUrl: vendor.logo_url ?? null,
        companyName: vendor.company_name ?? null,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
