'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { vendorService } from '@/services/vendor.service';

const STAGES = ['invited','profile_submitted','company_details_submitted','meeting_scheduled','agreement_sent','agreement_signed','onboarded'];
const STAGE_LABELS: Record<string, string> = {
  invited: 'Invited', profile_submitted: 'Profile Submitted', company_details_submitted: 'Details Submitted',
  meeting_scheduled: 'Meeting Scheduled', agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed', onboarded: 'Onboarded',
};

interface OnboardingStatus { status: string; stage: string; profileCompletion: number }

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getOnboardingStatus().then((r: { data: { data: OnboardingStatus } }) => setOnboarding(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stageIndex = onboarding ? STAGES.indexOf(onboarding.stage) : -1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Vendor'} 👋</h1>
        <p className="text-gray-500 mt-1">Track your onboarding progress and manage your profile.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[1,2,3].map((i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-24 border border-gray-100" />)}
        </div>
      ) : onboarding && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500">Account Status</p>
              <p className={`text-lg font-bold mt-1 capitalize ${onboarding.status === 'onboarded' ? 'text-primary-600' : onboarding.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{onboarding.status}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500">Current Stage</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{STAGE_LABELS[onboarding.stage] || onboarding.stage}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500 mb-2">Profile Completion</p>
              <p className="text-lg font-bold text-gray-900">{onboarding.profileCompletion}%</p>
              <div className="h-2 bg-gray-100 rounded-full mt-2">
                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${onboarding.profileCompletion}%` }} />
              </div>
            </div>
          </div>

          {/* Onboarding progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-5">Onboarding Progress</h2>
            <div className="flex items-start gap-0">
              {STAGES.map((s, i) => {
                const done = i < stageIndex;
                const cur = i === stageIndex;
                return (
                  <div key={s} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 relative ${done ? 'bg-primary-500 text-white' : cur ? 'bg-white border-2 border-primary-500 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <p className={`text-xs mt-2 text-center leading-tight ${cur ? 'text-primary-600 font-medium' : done ? 'text-gray-700' : 'text-gray-400'}`}>{STAGE_LABELS[s]}</p>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < stageIndex ? 'bg-primary-400' : 'bg-gray-200'}`} style={{ zIndex: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/vendor/profile" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all">
          <p className="font-semibold text-gray-900">🏢 Update Profile</p>
          <p className="text-sm text-gray-500 mt-1">Add company details to advance your onboarding</p>
        </Link>
        <Link href="/vendor/onboarding" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all">
          <p className="font-semibold text-gray-900">🚀 View Onboarding Steps</p>
          <p className="text-sm text-gray-500 mt-1">See what&apos;s next in your onboarding journey</p>
        </Link>
      </div>
    </div>
  );
}
