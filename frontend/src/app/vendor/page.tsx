'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { vendorService } from '@/services/vendor.service';
import { getLifecycleStageIndex } from '@/lib/vendorLifecycle';
import {
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  CalendarIcon,
  FileIcon,
  BriefcaseIcon,
  RocketIcon,
  ChevronRightIcon,
} from '@/components/vendor/VendorIcons';
import { VendorLogoAvatar } from '@/components/vendor/VendorLogoAvatar';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

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

interface OnboardingData {
  status: string;
  onboardingStage: string;
  profileCompletion: number;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementViewedAt?: string;
  agreementSentToEmail?: string;
  logoUrl?: string | null;
  companyName?: string | null;
  vendorType?: 'product' | 'service';
}

export default function VendorDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const r: { data: { data: OnboardingData } } = await vendorService.getOnboardingStatus();
        if (alive) setData(r.data.data);
      } catch {
        /* ignore */
      } finally {
        if (alive) setLoading(false);
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };

    load();
    const poll = window.setInterval(load, 30000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', load);

    return () => {
      alive = false;
      window.clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', load);
    };
  }, []);

  useEffect(() => {
    const sb = getSupabaseBrowserClient();
    const vid = user?._id;
    if (!sb || !vid) return;

    const channel = sb
      .channel(`vendor-onboarding-dash-logo-${vid}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'vendors', filter: `id=eq.${vid}` },
        async () => {
          try {
            const r: { data: { data: OnboardingData } } = await vendorService.getOnboardingStatus();
            setData(r.data.data);
          } catch {
            /* ignore */
          }
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [user?._id]);

  const stageIndex = data
    ? getLifecycleStageIndex(STAGES, data.onboardingStage, data.status)
    : 0;
  const progressPct =
    stageIndex >= STAGES.length ? 100 : Math.round(((stageIndex + 1) / STAGES.length) * 100);

  // Determine pending actions
  const pendingActions: Array<{ label: string; href: string; icon: React.ReactNode }> = [];
  if (data) {
    if (data.profileCompletion < 100) {
      pendingActions.push({ label: 'Complete your company profile', href: '/vendor/profile', icon: <EditIcon className="w-5 h-5" /> });
    }
    if (data.onboardingStage === 'intro_meeting_scheduled' && !data.meetingDate) {
      pendingActions.push({
        label: 'Schedule your technical meeting',
        href: '/vendor/onboarding',
        icon: <CalendarIcon className="w-5 h-5" />,
      });
    }
    if (data.meetingDate) {
      pendingActions.push({ label: `Technical meeting scheduled: ${data.meetingDate} at ${data.meetingTime}`, href: data.meetingLink || '/vendor/onboarding', icon: <CalendarIcon className="w-5 h-5" /> });
    }
    if (
      (data.agreementStatus === 'sent' || data.agreementStatus === 'viewed') &&
      data.onboardingStage !== 'agreement_signed' &&
      data.onboardingStage !== 'onboarded'
    ) {
      pendingActions.push({
        label:
          data.agreementStatus === 'viewed'
            ? 'Agreement viewed - Pending your signature'
            : data.agreementSentToEmail
              ? `Agreement sent to ${data.agreementSentToEmail} - Pending your signature`
              : 'Agreement sent - Pending your signature',
        href: '/vendor/onboarding',
        icon: <FileIcon className="w-5 h-5" />,
      });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        {loading ? (
          <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-2xl bg-slate-200 animate-pulse" aria-hidden />
        ) : data ? (
          <VendorLogoAvatar
            logoUrl={data.logoUrl}
            label={data.companyName || user?.name || 'Vendor'}
            sizeClass="h-20 w-20 sm:h-24 sm:w-24"
          />
        ) : null}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Welcome, {user?.name || 'Vendor'}</h1>
          <p className="mt-2 text-base text-slate-600 sm:text-lg">Track your onboarding progress and complete your profile to get started.</p>
        </div>
      </div>

      {/* Status Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32 border border-slate-200 shadow-sm" />
          ))}
        </div>
      ) : data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Account Status */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Account Status</p>
                  <p
                    className={`text-2xl font-bold ${
                      data.status === 'onboarded'
                        ? 'text-green-600'
                        : data.status === 'approved' || data.status === 'onboarding'
                        ? 'text-blue-700'
                        : 'text-amber-600'
                    }`}
                  >
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  {data.status === 'onboarded' ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Current Stage */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">Current Stage</p>
                  <p className="text-2xl font-bold text-emerald-700">{STAGE_LABELS[data.onboardingStage]?.split(' ')[0] || 'Stage'}</p>
                  <p className="text-xs text-emerald-600 mt-1">{STAGE_LABELS[data.onboardingStage]}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
                  {stageIndex >= STAGES.length ? (
                    <CheckCircleIcon className="w-7 h-7 text-emerald-600" />
                  ) : (
                    stageIndex + 1
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-600 mb-2">Profile Completion</p>
                  <p className="text-2xl font-bold text-purple-700">{data.profileCompletion}%</p>
                  <div className="h-2 bg-white rounded-full mt-3 border border-purple-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        data.profileCompletion === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${data.profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Progress Stepper */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sm:p-8 mb-10">
            <h2 className="font-bold text-slate-900 mb-8 text-lg">Onboarding Progress</h2>
            <div className="grid gap-4 md:grid-cols-7 md:gap-0">
              {STAGES.map((s, i) => {
                const done = i < stageIndex;
                const cur = i === stageIndex;
                return (
                  <div key={s} className="relative md:px-2">
                    <div className="flex items-start gap-4 md:flex-col md:items-center">
                      <div
                        className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                          done
                            ? 'bg-green-500 text-white shadow-md'
                            : cur
                            ? 'bg-white border-2 border-emerald-500 text-emerald-700 shadow-md'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {done ? <CheckCircleIcon className="w-5 h-5" /> : cur ? <ClockIcon className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="min-w-0 md:text-center">
                        <p
                          className={`text-xs font-medium leading-tight transition-colors md:mt-3 ${
                            cur
                              ? 'text-emerald-700'
                              : done
                              ? 'text-slate-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {STAGE_LABELS[s]}
                        </p>
                      </div>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div
                        className={`ml-5 mt-2 h-6 w-px md:hidden ${i < stageIndex ? 'bg-green-500' : 'bg-slate-300'}`}
                      />
                    )}
                    {i < STAGES.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-5 hidden h-1 w-full transition-colors md:block ${
                          i < stageIndex ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                        style={{ zIndex: 0 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending actions */}
          {pendingActions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sm:p-8 mb-10">
              <h2 className="font-bold text-slate-900 mb-6">Pending Actions</h2>
              <div className="space-y-3">
                {pendingActions.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex flex-col gap-3 rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-all hover:from-amber-100 hover:to-orange-100 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 group"
                  >
                    <div className="flex-shrink-0 text-amber-600">{a.icon}</div>
                    <span className="text-sm font-medium text-amber-900 flex-1">{a.label}</span>
                    <ChevronRightIcon className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/vendor/profile" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <BriefcaseIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="font-semibold text-slate-900">Update Profile</p>
          <p className="text-sm text-slate-600 mt-1">Add company details to advance your onboarding</p>
        </Link>
        <Link href="/vendor/onboarding" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <RocketIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="font-semibold text-slate-900">View Onboarding Steps</p>
          <p className="text-sm text-slate-600 mt-1">See what&apos;s next in your onboarding journey</p>
        </Link>
      </div>
    </div>
  );
}
