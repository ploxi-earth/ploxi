'use client';
import { useEffect, useState } from 'react';
import { vendorService } from '@/services/vendor.service';
import { getLifecycleStageIndex } from '@/lib/vendorLifecycle';
import { CalendarIcon } from '@/components/vendor/VendorIcons';
import OnboardingLifecycleTracker from '@/components/vendor/OnboardingLifecycleTracker';

const STAGES = [
  'registration',
  'admin_review',
  'company_details_submitted',
  'intro_meeting_scheduled',
  'agreement_sent',
  'agreement_signed',
  'onboarded',
];

const STAGE_LABELS: Record<string, string> = {
  registration: 'Registration Submitted',
  admin_review: 'Admin Review',
  company_details_submitted: 'Complete Profile',
  intro_meeting_scheduled: 'Technical Meeting Scheduled',
  agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed',
  onboarded: 'Vendor Onboarded',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  registration: 'Your registration has been submitted and is under review by our team.',
  admin_review: 'Your application is being reviewed by our admin team.',
  company_details_submitted: 'Your application was approved. Complete your company profile to proceed.',
  intro_meeting_scheduled: 'Schedule your technical meeting with the Ploxi team.',
  agreement_sent: 'Partnership agreement has been sent for your review and signature.',
  agreement_signed: 'Agreement has been signed. Final onboarding steps in progress.',
  onboarded: 'Congratulations! You are fully onboarded as a Ploxi vendor.',
};

interface OnboardingStatus {
  status: string;
  onboardingStage: string;
  onboardingHistory: Array<{ stage: string; updatedAt: string; note?: string }>;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingStatus?: string | null;
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementViewedAt?: string;
  agreementSignedAt?: string;
  agreementSentToEmail?: string;
  agreementEnvelopeId?: string;
  agreementDeliveryStatus?: string;
  agreementRecipientStatus?: string | null;
  agreementRecipientDeliveredAt?: string | null;
  agreementRecipientSentAt?: string | null;
  agreementRecipientName?: string | null;
  agreementRecipientEmail?: string | null;
}

function buildCalendlyUrl(baseUrl: string, timezone: string) {
  if (!baseUrl) return '';

  try {
    const url = new URL(baseUrl);
    if (timezone) url.searchParams.set('timezone', timezone);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export default function VendorOnboardingPage() {
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendly, setShowCalendly] = useState(false);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const calendlyEmbedUrl = buildCalendlyUrl(calendlyUrl, timezone);

  useEffect(() => {
    let alive = true;

    const load = async (initial = false) => {
      if (initial) setLoading(true);
      try {
        const r: { data: { data: OnboardingStatus } } = await vendorService.getOnboardingStatus();
        if (alive) setOnboarding(r.data.data);
      } catch {
        /* ignore */
      } finally {
        if (initial && alive) setLoading(false);
      }
    };

    load(true);
    const timer = window.setInterval(() => load(false), 30000);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  if (loading)
    return (
      <div className="p-10 text-gray-400 text-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
        Loading…
      </div>
    );
  if (!onboarding)
    return <div className="p-10 text-gray-400 text-center">Unable to load onboarding status.</div>;

  const stageIndex = getLifecycleStageIndex(
    STAGES,
    onboarding.onboardingStage,
    onboarding.status
  );
  return (
    <div>
      {showCalendly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Schedule Technical Meeting</h3>
              <button type="button" className="text-sm text-gray-500" onClick={() => setShowCalendly(false)}>
                Close
              </button>
            </div>
            {calendlyEmbedUrl ? (
              <iframe title="Calendly Scheduler" src={calendlyEmbedUrl} className="h-[70vh] w-full rounded-xl border border-gray-200" />
            ) : (
              <p className="text-sm text-red-600">Calendly URL is not configured.</p>
            )}
          </div>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Onboarding Journey</h1>
        <p className="text-gray-500 text-sm mt-0.5">Follow these steps to complete your vendor onboarding</p>
      </div>
      <OnboardingLifecycleTracker
        stages={STAGES}
        stageLabels={STAGE_LABELS}
        stageDescriptions={STAGE_DESCRIPTIONS}
        stageIndex={stageIndex}
        history={onboarding.onboardingHistory}
        agreementStatus={onboarding.agreementStatus}
        agreementSentAt={onboarding.agreementSentAt}
        agreementViewedAt={onboarding.agreementViewedAt}
        agreementSignedAt={onboarding.agreementSignedAt}
        agreementSentToEmail={onboarding.agreementSentToEmail}
        agreementRecipientSentAt={onboarding.agreementRecipientSentAt || undefined}
        showAgreementDetails={false}
        meetingDate={onboarding.meetingDate}
        meetingTime={onboarding.meetingTime}
        meetingLink={onboarding.meetingLink}
        meetingStatus={onboarding.meetingStatus}
        locale="en-IN"
        introMeetingAction={
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCalendly(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <CalendarIcon className="h-4 w-4" />
              Schedule Technical Meeting
            </button>
            <p className="mt-2 text-xs text-gray-500">Detected timezone: {timezone}</p>
          </div>
        }
      />
    </div>
  );
}
