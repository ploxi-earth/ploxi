import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireRole, jsonOk, jsonError } from '@/lib/auth';
import {
  buildOnboardingHistory,
  computeOnboardingStage,
} from '@/lib/vendorLifecycle';

function isFilled(v: unknown): boolean {
  return typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, 'vendor');
    const vendorId = user.vendorId || user.id;

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, status, company_name, contact_person, email, phone, created_at')
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
      .select('services, sector, location, website, description, profile_completed')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    const onboardingStage = computeOnboardingStage(vendor.status, stages || []);
    const onboardingHistory = buildOnboardingHistory(stages || []);
    const latestMeeting = meetings?.[0] || null;
    const latestAgreement = agreements?.[0] || null;

    let agreementStatus: 'not_sent' | 'sent' | 'signed' = 'not_sent';
    if (latestAgreement) {
      agreementStatus = latestAgreement.signed ? 'signed' : 'sent';
    }

    // Profile completion: compute percent based on required fields.
    const required = [
      vendor.company_name,
      vendor.contact_person,
      vendor.phone,
      profile?.website,
      profile?.services,
      profile?.sector,
      profile?.location,
      profile?.description,
    ];
    const filled = required.filter(isFilled).length;
    const profileCompletion = Math.round((filled / required.length) * 100);

    return jsonOk({
      success: true,
      data: {
        status: vendor.status,
        onboardingStage,
        onboardingHistory,
        onboardingStages: stages || [],
        meeting: latestMeeting || null,
        agreement: latestAgreement || null,
        meetingDate: latestMeeting?.scheduled_date || null,
        meetingTime: latestMeeting?.scheduled_time || null,
        meetingLink: latestMeeting?.meeting_link || null,
        agreementStatus,
        agreementSentAt: latestAgreement?.sent_at || null,
        agreementSignedAt: latestAgreement?.signed_at || null,
        agreementSentToEmail:
          latestAgreement?.recipient_email ||
          latestAgreement?.sent_to_email ||
          latestAgreement?.to_email ||
          vendor.email,
        profileCompletion: profile?.profile_completed ? 100 : profileCompletion,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'UNAUTHORIZED') return jsonError('Authentication required.', 401);
    if (message === 'FORBIDDEN') return jsonError('Access denied.', 403);
    return jsonError('Internal server error.', 500);
  }
}
