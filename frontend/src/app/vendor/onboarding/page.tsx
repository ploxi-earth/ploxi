'use client';
import { useEffect, useState } from 'react';
import { vendorService } from '@/services/vendor.service';

const STAGES = ['invited','profile_submitted','company_details_submitted','meeting_scheduled','agreement_sent','agreement_signed','onboarded'];
const STAGE_LABELS: Record<string, string> = {
  invited: 'Account Invited',
  profile_submitted: 'Profile Submitted',
  company_details_submitted: 'Company Details Submitted',
  meeting_scheduled: 'Intro Meeting Scheduled',
  agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed',
  onboarded: 'Onboarded ✨',
};
const STAGE_DESCRIPTIONS: Record<string, string> = {
  invited: 'Your account has been created. Log in to get started.',
  profile_submitted: 'Your profile has been submitted and is under review.',
  company_details_submitted: 'Company details reviewed. Awaiting meeting.',
  meeting_scheduled: 'An intro meeting has been scheduled.',
  agreement_sent: 'Partnership agreement has been sent for review.',
  agreement_signed: 'Agreement signed. Final onboarding in progress.',
  onboarded: 'Congratulations! You are fully onboarded.',
};

interface OnboardingStatus { status: string; stage: string; onboardingHistory: Array<{ stage: string; updatedAt: string; note?: string }> }

export default function VendorOnboardingPage() {
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getOnboardingStatus().then((r: { data: { data: OnboardingStatus } }) => setOnboarding(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-gray-400 text-center">Loading…</div>;
  if (!onboarding) return <div className="p-10 text-gray-400 text-center">Unable to load onboarding status.</div>;

  const stageIndex = STAGES.indexOf(onboarding.stage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Journey</h1>
        <p className="text-gray-500 text-sm mt-0.5">Follow these steps to complete your vendor onboarding</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {STAGES.map((s, i) => {
          const completed = i < stageIndex;
          const current = i === stageIndex;
          const pending = i > stageIndex;
          const histEntry = onboarding.onboardingHistory?.find((h) => h.stage === s);

          return (
            <div key={s} className={`bg-white rounded-xl border p-5 flex gap-4 transition-all ${current ? 'border-primary-300 shadow-sm ring-1 ring-primary-200' : completed ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${completed ? 'bg-primary-500 text-white' : current ? 'bg-primary-100 border-2 border-primary-500 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                {completed ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-semibold text-sm ${completed ? 'text-gray-700' : current ? 'text-primary-700' : 'text-gray-400'}`}>{STAGE_LABELS[s]}</p>
                  {current && <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">Current</span>}
                  {completed && <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Done</span>}
                  {pending && <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">Upcoming</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{STAGE_DESCRIPTIONS[s]}</p>
                {histEntry && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(histEntry.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {histEntry.note && ` — ${histEntry.note}`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
