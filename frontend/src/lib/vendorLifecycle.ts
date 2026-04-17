/**
 * Shared onboarding lifecycle logic — keep in sync with backend vendor/admin controllers.
 */

export type OnboardingStageRow = {
  stage_name: string;
  status: string;
  completed_at?: string | null;
  updated_at?: string | null;
  created_at?: string;
  notes?: string | null;
};

export type VendorRow = {
  id: string;
  status: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  vendor_type?: 'product' | 'service' | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  onboarded_at?: string | null;
  review_note?: string | null;
  created_at?: string;
};

export function computeOnboardingStage(
  vendorStatus: string,
  stages: OnboardingStageRow[] | null | undefined
): string {
  const stageRecords = stages || [];
  const activeStage = stageRecords.find(s => s.status === 'active');
  const allCompleted =
    stageRecords.length > 0 && stageRecords.every(s => s.status === 'completed');
  if (vendorStatus === 'onboarded' || allCompleted) return 'onboarded';

  if (activeStage?.stage_name) return activeStage.stage_name;

  // Defensive fallback keeps vendor UI aligned with admin actions even when
  // historical stage rows are missing/partially updated.
  if (vendorStatus === 'approved') return 'company_details_submitted';
  if (vendorStatus === 'onboarding') return 'intro_meeting_scheduled';
  if (vendorStatus === 'pending') return 'admin_review';

  return 'registration';
}

/** Stage index for progress/timeline UIs: when fully onboarded, all circles are complete (use length, not last index). */
export function getLifecycleStageIndex(
  stageOrder: string[],
  onboardingStage: string | undefined,
  vendorStatus: string | undefined
): number {
  const finished = vendorStatus === 'onboarded' || onboardingStage === 'onboarded';
  if (finished) return stageOrder.length;
  const raw = stageOrder.indexOf(onboardingStage || 'registration');
  return raw >= 0 ? raw : 0;
}

export function buildOnboardingHistory(stages: OnboardingStageRow[] | null | undefined) {
  const stageRecords = stages || [];
  return stageRecords
    .filter(s => s.completed_at || s.status === 'active')
    .map(s => ({
      stage: s.stage_name,
      updatedAt: s.completed_at || s.updated_at || s.created_at,
      note: s.notes || undefined,
    }));
}

type ProfileRow = {
  services?: string | null;
  sector?: string | null;
  location?: string | null;
  website?: string | null;
  description?: string | null;
  locations_served?: string[] | null;
  industry_focus?: string[] | null;
  corporate_profile?: string | null;
  legal_entity_name?: string | null;
  gst_number?: string | null;
  registered_address?: string | null;
  profile_completed?: boolean | null;
  notification_preferences?: Record<string, boolean> | null;
  portal_access_status?: string | null;
  portal_access_paused_at?: string | null;
  portal_access_pause_reason?: string | null;
  portal_access_resumed_at?: string | null;
} | null;

type MeetingRow = {
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  meeting_link?: string | null;
  status?: string | null;
  vendor_timezone?: string | null;
  notes?: string | null;
} | null;

type AgreementRow = {
  viewed?: boolean | null;
  viewed_at?: string | null;
  signed?: boolean | null;
  sent_at?: string | null;
  signed_at?: string | null;
  docusign_provider?: string | null;
  docusign_envelope_id?: string | null;
  docusign_status?: string | null;
  recipient_email?: string | null;
  sent_to_email?: string | null;
  to_email?: string | null;
} | null;

function isFilled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

export function normalizeAgreementStatus(
  agreement: AgreementRow
): 'not_sent' | 'sent' | 'viewed' | 'signed' {
  if (!agreement) return 'not_sent';
  if (agreement.signed || agreement.signed_at) return 'signed';
  if (agreement.viewed || agreement.viewed_at) return 'viewed';
  return 'sent';
}

export function normalizeMeetingStatus(
  meeting: MeetingRow
): 'scheduled' | 'rescheduled' | 'cancelled' | 'completed' | null {
  if (!meeting) return null;

  const rawStatus = String(meeting.status || '').trim().toLowerCase();
  if (
    rawStatus === 'scheduled' ||
    rawStatus === 'rescheduled' ||
    rawStatus === 'cancelled' ||
    rawStatus === 'completed'
  ) {
    return rawStatus;
  }

  if (meeting.scheduled_date) {
    const dateTimeValue = meeting.scheduled_time
      ? `${meeting.scheduled_date}T${meeting.scheduled_time}`
      : meeting.scheduled_date;
    const scheduledAt = new Date(dateTimeValue);

    if (!Number.isNaN(scheduledAt.getTime())) {
      return scheduledAt < new Date() ? 'completed' : 'scheduled';
    }
  }

  return 'scheduled';
}

export function calculateProfileCompletion(
  vendor: VendorRow,
  profile: ProfileRow
) {
  const fields = [
    vendor.company_name,
    vendor.contact_person,
    vendor.phone,
    profile?.website,
    profile?.description,
    profile?.services,
    profile?.sector,
    profile?.location,
    profile?.locations_served,
    profile?.industry_focus,
    profile?.corporate_profile,
    profile?.legal_entity_name,
    profile?.gst_number,
    profile?.registered_address,
  ];
  const filled = fields.filter(isFilled).length;
  return Math.round((filled / fields.length) * 100);
}

/** Single-vendor payload for admin UI — matches Express admin.controller getVendor. */
export function buildAdminVendorDetail(
  vendor: VendorRow,
  stages: OnboardingStageRow[] | null | undefined,
  profile: ProfileRow,
  meetings: MeetingRow[] | null | undefined,
  agreements: AgreementRow[] | null | undefined
) {
  const onboardingStage = computeOnboardingStage(vendor.status, stages);
  const onboardingHistory = buildOnboardingHistory(stages);
  const latestMeeting = meetings?.[0] || null;
  const latestAgreement = agreements?.[0] || null;
  const agreementStatus = normalizeAgreementStatus(latestAgreement);
  const meetingStatus = normalizeMeetingStatus(latestMeeting);
  const profileCompletion = profile?.profile_completed
    ? 100
    : calculateProfileCompletion(vendor, profile);

  return {
    _id: vendor.id,
    companyName: vendor.company_name,
    email: vendor.email,
    phone: vendor.phone,
    contactPerson: vendor.contact_person,
    status: vendor.status,
    vendorType: vendor.vendor_type || 'service',
    onboardingStage,
    onboardingHistory,

    portalAccessStatus: profile?.portal_access_status || 'active',
    portalAccessPausedAt: profile?.portal_access_paused_at || null,
    portalAccessPauseReason: profile?.portal_access_pause_reason || null,
    portalAccessResumedAt: profile?.portal_access_resumed_at || null,

    website: profile?.website || null,
    companyDescription: profile?.description || null,
    servicesOffered: profile?.services || null,
    sector: profile?.sector || null,
    location: profile?.location || null,
    locationsServed: profile?.locations_served || [],
    industryFocus: profile?.industry_focus || [],
    corporateProfile: profile?.corporate_profile || null,
    legalEntityName: profile?.legal_entity_name || null,
    gstNumber: profile?.gst_number || null,
    registeredAddress: profile?.registered_address || null,
    profileCompletion,

    meetingDate: latestMeeting?.scheduled_date || null,
    meetingTime: latestMeeting?.scheduled_time || null,
    meetingLink: latestMeeting?.meeting_link || null,
    meetingNote: latestMeeting?.notes || null,
    meetingStatus,
    meetingTimezone: latestMeeting?.vendor_timezone || null,

    agreementStatus,
    agreementSentAt: latestAgreement?.sent_at || null,
    agreementViewedAt: latestAgreement?.viewed_at || null,
    agreementSignedAt: latestAgreement?.signed_at || null,
    agreementProvider: latestAgreement?.docusign_provider || null,
    agreementEnvelopeId: latestAgreement?.docusign_envelope_id || null,
    agreementDeliveryStatus:
      latestAgreement?.docusign_status ||
      (latestAgreement?.docusign_envelope_id ? 'sent' : null),
    agreementSentToEmail:
      latestAgreement?.recipient_email ||
      latestAgreement?.sent_to_email ||
      latestAgreement?.to_email ||
      vendor.email,

    approvedAt: vendor.approved_at || null,
    rejectedAt: vendor.rejected_at || null,
    onboardedAt: vendor.onboarded_at || null,
    reviewNote: vendor.review_note || null,
    createdAt: vendor.created_at,
  };
}
