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
  return activeStage?.stage_name || 'registration';
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
  profile_completed?: boolean | null;
  portal_access_status?: string | null;
  portal_access_paused_at?: string | null;
  portal_access_pause_reason?: string | null;
  portal_access_resumed_at?: string | null;
} | null;

type MeetingRow = {
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  meeting_link?: string | null;
  notes?: string | null;
} | null;

type AgreementRow = {
  signed?: boolean | null;
  sent_at?: string | null;
  signed_at?: string | null;
} | null;

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

  let agreementStatus: 'not_sent' | 'sent' | 'signed' = 'not_sent';
  if (latestAgreement) {
    agreementStatus = latestAgreement.signed ? 'signed' : 'sent';
  }

  let profileCompletion = 0;
  if (profile) {
    const fields = [profile.services, profile.sector, profile.location, profile.website];
    const filled = fields.filter(f => f && String(f).trim()).length;
    profileCompletion = Math.round((filled / fields.length) * 100);
    if (profile.profile_completed) profileCompletion = 100;
  }

  return {
    _id: vendor.id,
    companyName: vendor.company_name,
    email: vendor.email,
    phone: vendor.phone,
    contactPerson: vendor.contact_person,
    status: vendor.status,
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
    profileCompletion,

    meetingDate: latestMeeting?.scheduled_date || null,
    meetingTime: latestMeeting?.scheduled_time || null,
    meetingLink: latestMeeting?.meeting_link || null,
    meetingNote: latestMeeting?.notes || null,

    agreementStatus,
    agreementSentAt: latestAgreement?.sent_at || null,
    agreementSignedAt: latestAgreement?.signed_at || null,

    approvedAt: vendor.approved_at || null,
    rejectedAt: vendor.rejected_at || null,
    onboardedAt: vendor.onboarded_at || null,
    reviewNote: vendor.review_note || null,
    createdAt: vendor.created_at,
  };
}
