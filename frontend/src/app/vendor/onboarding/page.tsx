'use client';
import { useEffect, useState } from 'react';
import { vendorService } from '@/services/vendor.service';
import { getLifecycleStageIndex } from '@/lib/vendorLifecycle';
import {
  CheckCircleIcon,
  ClockIcon,
  AlertIcon,
  CalendarIcon,
  FileIcon,
} from '@/components/vendor/VendorIcons';

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
  company_details_submitted: 'Company Details Submitted',
  intro_meeting_scheduled: 'Intro Meeting Scheduled',
  agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed',
  onboarded: 'Vendor Onboarded',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  registration: 'Your registration has been submitted and is under review by our team.',
  admin_review: 'Your application has been approved. Complete your company profile to proceed.',
  company_details_submitted: 'Company details have been reviewed. Awaiting meeting scheduling.',
  intro_meeting_scheduled: 'An introductory meeting has been scheduled with the Ploxi team.',
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
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementSignedAt?: string;
}

export default function VendorOnboardingPage() {
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService
      .getOnboardingStatus()
      .then((r: { data: { data: OnboardingStatus } }) => setOnboarding(r.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
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
  const progressPct =
    stageIndex >= STAGES.length ? 100 : Math.round(((stageIndex + 1) / STAGES.length) * 100);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Journey</h1>
        <p className="text-gray-500 text-sm mt-0.5">Follow these steps to complete your vendor onboarding</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Overall Progress</p>
          <p className="text-sm font-bold text-primary-600">{progressPct}%</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className={`h-full rounded-full transition-all ${stageIndex >= STAGES.length ? 'bg-green-500' : 'bg-primary-500'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="max-w-2xl space-y-4">
        {STAGES.map((s, i) => {
          const completed = i < stageIndex;
          const current = i === stageIndex;
          const pending = i > stageIndex;
          const histEntry = onboarding.onboardingHistory?.find((h) => h.stage === s);

          return (
            <div
              key={s}
              className={`bg-white rounded-xl border p-5 flex gap-4 transition-all ${current
                ? 'border-primary-300 shadow-sm ring-1 ring-primary-200'
                : completed
                  ? 'border-gray-100'
                  : 'border-gray-100 opacity-60'
                }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${completed
                  ? 'bg-primary-500 text-white'
                  : current
                    ? 'bg-primary-100 border-2 border-primary-500 text-primary-600'
                    : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {completed ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : current ? (
                  <ClockIcon className="w-5 h-5" />
                ) : (
                  <AlertIcon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-semibold text-sm ${completed ? 'text-gray-700' : current ? 'text-primary-700' : 'text-gray-400'
                      }`}
                  >
                    {STAGE_LABELS[s]}
                  </p>
                  {current && (
                    <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                  {completed && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                  {pending && (
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{STAGE_DESCRIPTIONS[s]}</p>
                {histEntry && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(histEntry.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {histEntry.note && ` — ${histEntry.note}`}
                  </p>
                )}
                {/* Show meeting details inside intro_meeting_scheduled stage */}
                {s === 'intro_meeting_scheduled' && onboarding.meetingDate && (current || completed) && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-medium text-blue-800 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> {onboarding.meetingDate} at {onboarding.meetingTime}
                    </p>
                    {onboarding.meetingLink && (
                      <a
                        href={onboarding.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}
                {/* Show agreement status inside agreement stages */}
                {(s === 'agreement_sent' || s === 'agreement_signed') && onboarding.agreementStatus && onboarding.agreementStatus !== 'not_sent' && (current || completed) && (
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-800 flex items-center gap-2">
                      {onboarding.agreementStatus === 'signed' ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" /> Agreement Signed
                        </>
                      ) : (
                        <>
                          <FileIcon className="w-4 h-4" /> Agreement Sent – Pending Signature
                        </>
                      )}
                    </p>
                    {onboarding.agreementSentAt && (
                      <p className="text-xs text-amber-600 mt-1">
                        Sent: {new Date(onboarding.agreementSentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {onboarding.agreementSignedAt && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Signed: {new Date(onboarding.agreementSignedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
