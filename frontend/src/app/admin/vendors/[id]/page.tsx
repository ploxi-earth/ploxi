'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminService } from '@/services/admin.service';
import { getLifecycleStageIndex } from '@/lib/vendorLifecycle';
import {
  CheckCircleIcon,
  ClockIcon,
  AlertIcon,
  CalendarIcon,
  FileIcon,
} from '@/components/vendor/VendorIcons';

interface VendorDetail {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: string;
  portalAccessStatus?: 'active' | 'paused';
  portalAccessPausedAt?: string;
  portalAccessPauseReason?: string;
  portalAccessResumedAt?: string;
  onboardingStage: string;
  onboardingHistory: Array<{ stage: string; updatedAt: string; note?: string }>;
  website?: string;
  companyDescription?: string;
  servicesOffered?: string;
  sector?: string;
  location?: string;
  profileCompletion?: number;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingNote?: string;
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementSignedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  onboardedAt?: string;
  reviewNote?: string;
  createdAt?: string;
  meetingRequestAlert?: {
    hasPending?: boolean;
    message?: string;
    raisedAt?: string | null;
    notificationIds?: string[];
  };
}

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
  intro_meeting_scheduled: 'Intro Meeting Scheduled',
  agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed',
  onboarded: 'Vendor Onboarded',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  registration: 'Vendor registration has been submitted and is under review.',
  admin_review: 'Admin team is reviewing the vendor application.',
  company_details_submitted: 'Vendor should complete profile details to proceed.',
  intro_meeting_scheduled: 'Introductory meeting is scheduled with the Ploxi team.',
  agreement_sent: 'Partnership agreement has been sent for review and signature.',
  agreement_signed: 'Agreement is signed. Final onboarding steps are in progress.',
  onboarded: 'Vendor is fully onboarded and active on the platform.',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  onboarding: 'bg-blue-50 text-blue-700 border border-blue-200',
  onboarded: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const PORTAL_ACCESS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  paused: 'bg-red-50 text-red-700 border border-red-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  blocked: 'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  // Meeting form state
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingNote, setMeetingNote] = useState('');

  // Reject note
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Agreement
  const [agreementNote, setAgreementNote] = useState('');
  const [pauseReason, setPauseReason] = useState('');
  const [meetingAlert, setMeetingAlert] = useState<{ message?: string; raisedAt?: string | null; notificationIds: string[] } | null>(null);
  const [meetingAlertDismissed, setMeetingAlertDismissed] = useState(false);
  const [showOnboardedTimeline, setShowOnboardedTimeline] = useState(false);

  const load = async () => {
    try {
      const r = await adminService.getVendor(id);
      const vendorData = r.data.data;

      setVendor(vendorData);
      setPauseReason(vendorData.portalAccessPauseReason || '');

      if (vendorData.meetingRequestAlert?.hasPending) {
        setMeetingAlert({
          message: vendorData.meetingRequestAlert.message,
          raisedAt: vendorData.meetingRequestAlert.raisedAt,
          notificationIds: vendorData.meetingRequestAlert.notificationIds || [],
        });
        setMeetingAlertDismissed(false);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMeetingAlert(null);
    setMeetingAlertDismissed(false);
    setShowOnboardedTimeline(false);
    load();
  }, [id]);

  const act = async (fn: () => Promise<unknown>, key: string) => {
    setActionLoading(key);
    try {
      await fn();
      await load();
    } catch (e: unknown) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  const parseMeetingRequest = (message?: string) => {
    const text = String(message || '');
    const date = /Preferred Date:\s*([^|\n]+)/i.exec(text)?.[1]?.trim() || '';
    const time = /Preferred Time:\s*([^|\n]+)/i.exec(text)?.[1]?.trim() || '';
    const note = /Note:\s*([^|\n]+)/i.exec(text)?.[1]?.trim() || '';
    return { date, time, note };
  };

  const dismissMeetingRequest = async () => {
    if (!meetingAlert || meetingAlert.notificationIds.length === 0) {
      setMeetingAlertDismissed(true);
      return;
    }

    setActionLoading('dismiss-request');
    try {
      await adminService.dismissMeetingRequest(id, meetingAlert.notificationIds);
      setMeetingAlertDismissed(true);
      setMeetingAlert(null);
    } catch (e: unknown) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Could not dismiss request');
    } finally {
      setActionLoading('');
    }
  };

  const prepareScheduleFromRequest = async () => {
    if (!meetingAlert) return;

    const parsed = parseMeetingRequest(meetingAlert.message);
    setMeetingDate(parsed.date);
    setMeetingTime(parsed.time);
    setMeetingNote(parsed.note);
    setMeetingLink('');

    await dismissMeetingRequest();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  if (!vendor) return <div className="p-10 text-gray-400 text-center">Vendor not found.</div>;

  const stageIndex = getLifecycleStageIndex(STAGES, vendor.onboardingStage, vendor.status);
  const isOnboardedVendor = vendor.status === 'onboarded';
  const portalAccessStatus = vendor.portalAccessStatus || 'active';
  const canManagePortalAccess = ['approved', 'onboarding', 'onboarded'].includes(vendor.status);
  const isPortalPaused = portalAccessStatus === 'paused';
  const portalAccessMeta = !canManagePortalAccess
    ? vendor.status === 'pending'
      ? { label: 'Awaiting approval', style: PORTAL_ACCESS_STYLES.pending }
      : { label: 'Blocked', style: PORTAL_ACCESS_STYLES.blocked }
    : {
      label: portalAccessStatus,
      style: PORTAL_ACCESS_STYLES[portalAccessStatus] || PORTAL_ACCESS_STYLES.active,
    };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/vendors" className="hover:text-gray-600 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          Vendors
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{vendor.companyName || vendor.email}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {(vendor.companyName || vendor.email)[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-none">{vendor.companyName || vendor.email}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{vendor.email}</p>
        </div>
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[vendor.status] || STATUS_STYLES.pending}`}>
          {vendor.status}
        </span>
      </div>

      {meetingAlert && !meetingAlertDismissed && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Meeting Request Raised</p>
              <p className="mt-1 text-sm font-medium text-red-900">
                This vendor has requested a meeting and needs admin attention.
              </p>
            </div>
          </div>
          {meetingAlert.message && (
            <p className="mt-2 text-sm text-red-800">{meetingAlert.message}</p>
          )}
          {meetingAlert.raisedAt && (
            <p className="mt-2 text-xs text-red-700">
              Raised on {new Date(meetingAlert.raisedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={prepareScheduleFromRequest}
              disabled={!!actionLoading}
              className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {actionLoading === 'dismiss-request' ? 'Preparing...' : 'Schedule Meeting'}
            </button>
            <button
              type="button"
              onClick={dismissMeetingRequest}
              disabled={!!actionLoading}
              className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {actionLoading === 'dismiss-request' ? 'Dismissing...' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – profile + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Vendor Profile
            </h2>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              {[
                ['Contact Person', vendor.contactPerson],
                ['Email', vendor.email],
                ['Phone', vendor.phone || '—'],
                ['Website', vendor.website || '—'],
                ['Sector', vendor.sector || '—'],
                ['Location', vendor.location || '—'],
                ['Services', vendor.servicesOffered || '—'],
                ['Profile Completion', vendor.profileCompletion ? `${vendor.profileCompletion}%` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{k}</dt>
                  <dd className="font-semibold text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
            {vendor.companyDescription && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Description</dt>
                <dd className="text-sm text-gray-700">{vendor.companyDescription}</dd>
              </div>
            )}
          </div>

          {/* Meetings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Meetings
              </h2>
              {vendor.meetingLink && (
                <a
                  href={vendor.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                  Join Meeting
                </a>
              )}
            </div>

            {vendor.meetingDate ? (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">{vendor.meetingDate} at {vendor.meetingTime || '—'}</p>
                {vendor.meetingNote && <p className="text-xs text-blue-700 mt-2">{vendor.meetingNote}</p>}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                No meeting has been scheduled yet.
              </div>
            )}
          </div>

          {/* Lifecycle visualization */}
          {!isOnboardedVendor ? (
            <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 rounded-xl border border-gray-100 bg-white p-5">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-gray-700">Overall Progress</p>
                  <p className="text-sm font-bold text-primary-600">
                    {stageIndex >= STAGES.length ? 100 : Math.round(((stageIndex + 1) / STAGES.length) * 100)}%
                  </p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${stageIndex >= STAGES.length ? 'bg-green-500' : 'bg-primary-500'}`}
                    style={{ width: `${stageIndex >= STAGES.length ? 100 : Math.round(((stageIndex + 1) / STAGES.length) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {STAGES.map((s, i) => {
                  const completed = i < stageIndex;
                  const current = i === stageIndex;
                  const pending = i > stageIndex;
                  const histEntry = vendor.onboardingHistory?.find((h) => h.stage === s);

                  return (
                    <div
                      key={s}
                      className={`flex gap-4 rounded-xl border bg-white p-5 transition-all ${current
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
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

                        {s === 'intro_meeting_scheduled' && vendor.meetingDate && (current || completed) && (
                          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
                            <p className="text-xs font-medium text-blue-800 flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" /> {vendor.meetingDate} at {vendor.meetingTime}
                            </p>
                            {vendor.meetingLink && (
                              <a
                                href={vendor.meetingLink}
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

                        {(s === 'agreement_sent' || s === 'agreement_signed') && vendor.agreementStatus && vendor.agreementStatus !== 'not_sent' && (current || completed) && (
                          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                            <p className="text-xs font-medium text-amber-800 flex items-center gap-2">
                              {vendor.agreementStatus === 'signed' ? (
                                <>
                                  <CheckCircleIcon className="w-4 h-4" /> Agreement Signed
                                </>
                              ) : (
                                <>
                                  <FileIcon className="w-4 h-4" /> Agreement Sent – Pending Signature
                                </>
                              )}
                            </p>
                            {vendor.agreementSentAt && (
                              <p className="text-xs text-amber-600 mt-1">
                                Sent: {new Date(vendor.agreementSentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            )}
                            {vendor.agreementSignedAt && (
                              <p className="text-xs text-emerald-600 font-semibold mt-1">
                                Signed: {new Date(vendor.agreementSignedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Onboarded Vendor
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Lifecycle completed. Expand to review historical timeline.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnboardedTimeline((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {showOnboardedTimeline ? 'Hide Timeline' : 'View Timeline'}
                </button>
              </div>

              {showOnboardedTimeline && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="space-y-4">
                    {STAGES.map((s, i) => {
                      const completed = i < stageIndex;
                      const current = i === stageIndex;
                      const pending = i > stageIndex;
                      const histEntry = vendor.onboardingHistory?.find((h) => h.stage === s);

                      return (
                        <div
                          key={s}
                          className={`flex gap-4 rounded-xl border bg-white p-5 transition-all ${current
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
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right – action cards */}
        <div className="space-y-4">
          {(vendor.status === 'approved' || vendor.status === 'onboarding' || vendor.status === 'onboarded') && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule Meeting</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input type="date" className="input-field text-xs" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
                <input type="time" className="input-field text-xs" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
              </div>
              <input
                className="input-field text-xs"
                placeholder="Meeting link (Google Meet / Zoom / Teams)"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <input
                className="input-field text-xs"
                placeholder="Note (optional)"
                value={meetingNote}
                onChange={(e) => setMeetingNote(e.target.value)}
              />
              <button
                onClick={() => {
                  if (!meetingDate || !meetingTime) { alert('Please select date and time.'); return; }
                  if (!meetingLink.trim()) { alert('Please add a meeting link.'); return; }
                  act(() => adminService.scheduleMeeting(id, { date: meetingDate, time: meetingTime, link: meetingLink, note: meetingNote }), 'meeting');
                }}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'meeting' ? 'Scheduling…' : 'Schedule Meeting'}
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deactivate Vendor</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Control whether this vendor can sign in and use portal pages.
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${portalAccessMeta.style}`}>
                {portalAccessMeta.label}
              </span>
            </div>

            {!canManagePortalAccess ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {vendor.status === 'pending'
                  ? 'Portal access becomes available after the vendor has been approved.'
                  : 'Rejected vendors already remain blocked from the portal.'}
              </div>
            ) : (
              <>
                {!isPortalPaused && (
                  <textarea
                    className="input-field min-h-[72px] resize-y text-sm"
                    placeholder="Reason for deactivation (optional)"
                    value={pauseReason}
                    onChange={(e) => setPauseReason(e.target.value)}
                  />
                )}

                <button
                  onClick={() =>
                    act(
                      () =>
                        adminService.setVendorPortalAccess(id, {
                          portalAccessStatus: isPortalPaused ? 'active' : 'paused',
                          reason: isPortalPaused ? undefined : pauseReason,
                        }),
                      isPortalPaused ? 'resume-portal' : 'pause-portal'
                    )
                  }
                  disabled={!!actionLoading}
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 ${isPortalPaused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                >
                  {actionLoading === 'pause-portal' ? (
                    'Deactivating…'
                  ) : actionLoading === 'resume-portal' ? (
                    'Reactivating…'
                  ) : isPortalPaused ? (
                    'Activate Vendor Account'
                  ) : (
                    'Deactivate Vendor Account'
                  )}
                </button>
              </>
            )}
          </div>

          {/* Approve/Reject for pending */}
          {vendor.status === 'pending' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Actions</h3>
              <button
                onClick={() => act(() => adminService.approveVendor(id), 'approve')}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'approve' ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Approving…</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Approve Vendor
                  </>
                )}
              </button>

              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={!!actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  Reject Vendor
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    className="input-field min-h-[60px] resize-y text-sm"
                    placeholder="Reason for rejection…"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!rejectNote.trim()) { alert('Please provide a reason.'); return; }
                        act(() => adminService.rejectVendor(id, rejectNote), 'reject');
                      }}
                      disabled={!!actionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'reject' ? 'Rejecting…' : 'Confirm Reject'}
                    </button>
                    <button
                      onClick={() => { setShowRejectForm(false); setRejectNote(''); }}
                      className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onboarding actions only while not finished */}
          {(vendor.status === 'approved' || vendor.status === 'onboarding') && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Onboarding Actions
              </h3>
              <>
                <hr className="border-gray-100" />

                  {/* Send Agreement */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      Send Agreement via Email
                    </p>
                    <textarea
                      className="input-field text-xs min-h-[60px] resize-y"
                      placeholder="Instructions or notes to include in the agreement email (optional)"
                      value={agreementNote}
                      onChange={(e) => setAgreementNote(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        act(() => adminService.sendAgreement(id, { note: agreementNote }), 'agreement');
                      }}
                      disabled={!!actionLoading}
                      className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'agreement' ? 'Sending…' : 'Send Agreement Email'}
                    </button>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Mark Signed & Complete */}
                  <button
                    onClick={() => act(() => adminService.markAgreementSigned(id), 'signed')}
                    disabled={!!actionLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'signed' ? 'Marking…' : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Mark Agreement Signed
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => act(() => adminService.completeOnboarding(id), 'onboard')}
                    disabled={!!actionLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'onboard' ? 'Completing…' : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        Complete Onboarding
                      </>
                    )}
                  </button>
              </>
            </div>
          )}

          {/* Status info cards */}
          {!isOnboardedVendor && vendor.agreementStatus && vendor.agreementStatus !== 'not_sent' && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Agreement</p>
              <p className="text-sm font-medium text-amber-900 capitalize">
                {vendor.agreementStatus === 'sent' ? 'Sent – Pending Signature' : vendor.agreementStatus === 'signed' ? 'Signed' : vendor.agreementStatus}
              </p>
              {vendor.agreementSentAt && (
                <p className="text-xs text-amber-700 mt-1">
                  Sent: {new Date(vendor.agreementSentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
              {vendor.agreementSignedAt && (
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Signed {new Date(vendor.agreementSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {vendor.status === 'rejected' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Rejected</p>
              {vendor.reviewNote && <p className="text-sm text-red-700">{vendor.reviewNote}</p>}
              {vendor.rejectedAt && (
                <p className="text-xs text-red-500 mt-1">
                  {new Date(vendor.rejectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
