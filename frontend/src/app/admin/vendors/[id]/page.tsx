'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminService } from '@/services/admin.service';
import { getLifecycleStageIndex } from '@/lib/vendorLifecycle';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertIcon,
  EditIcon,
  FileIcon,
  ShieldIcon,
  UserIcon,
  XCircleIcon,
} from '@/components/vendor/VendorIcons';
import ConfirmModal from '@/components/ConfirmModal';
import OnboardingLifecycleTracker from '@/components/vendor/OnboardingLifecycleTracker';

interface VendorDetail {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: string;
  vendorType?: 'product' | 'service';
  portalAccessStatus?: 'active' | 'paused';
  portalAccessPausedAt?: string;
  portalAccessPauseReason?: string;
  portalAccessResumedAt?: string;
  onboardingStage: string;
  onboardingHistory: Array<{ stage: string; updatedAt: string; note?: string }>;
  website?: string;
  companyDescription?: string;
  corporateProfile?: string;
  servicesOffered?: string;
  sector?: string;
  location?: string;
  locationsServed?: string[];
  industryFocus?: string[];
  legalEntityName?: string;
  gstNumber?: string;
  registeredAddress?: string;
  logoUrl?: string | null;
  profileCompletion?: number;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingNote?: string;
  agreementStatus?: string;
  agreementSentAt?: string;
  agreementViewedAt?: string;
  agreementSignedAt?: string;
  agreementEnvelopeId?: string;
  agreementDeliveryStatus?: string;
  approvedAt?: string;
  rejectedAt?: string;
  onboardedAt?: string;
  reviewNote?: string;
  createdAt?: string;
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
  intro_meeting_scheduled: 'Technical Meeting Scheduled',
  agreement_sent: 'Agreement Sent',
  agreement_signed: 'Agreement Signed',
  onboarded: 'Vendor Onboarded',
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  registration: 'Vendor registration has been submitted and is under review.',
  admin_review: 'Admin team is reviewing the vendor application.',
  company_details_submitted: 'Vendor should complete profile details to proceed.',
  intro_meeting_scheduled: 'Technical meeting is scheduled via Calendly and details are shared by email.',
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

const AGREEMENT_FLOW_STEPS = [
  {
    key: 'not_sent',
    label: 'Not Sent',
    detail: 'Agreement has not been dispatched to the vendor yet.',
  },
  {
    key: 'sent',
    label: 'Sent',
    detail: 'Agreement email has been delivered to the vendor inbox.',
  },
  {
    key: 'viewed',
    label: 'Viewed',
    detail: 'Vendor opened the agreement and is expected to sign next.',
  },
  {
    key: 'signed',
    label: 'Signed',
    detail: 'Vendor has completed the signing step successfully.',
  },
] as const;

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  // Reject note
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Agreement
  const [agreementNote, setAgreementNote] = useState('');
  const [pauseReason, setPauseReason] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showOnboardedTimeline, setShowOnboardedTimeline] = useState(false);
  const [showAgreementTrackerDetails, setShowAgreementTrackerDetails] = useState(true);

  const load = async () => {
    try {
      const r = await adminService.getVendor(id);
      const vendorData = r.data.data;

      setVendor(vendorData);
      setPauseReason(vendorData.portalAccessPauseReason || '');

    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowOnboardedTimeline(false);
    load();
  }, [id]);

  useEffect(() => {
    if (!vendor) return;
    // Keep the tracker compact when signing is complete.
    setShowAgreementTrackerDetails(vendor.agreementStatus !== 'signed');
  }, [vendor?.agreementStatus]);

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  if (!vendor) return <div className="p-10 text-gray-400 text-center">Vendor not found.</div>;

  const stageIndex = getLifecycleStageIndex(STAGES, vendor.onboardingStage, vendor.status);
  const agreementStatusOrder = ['not_sent', 'sent', 'viewed', 'signed'];
  const agreementActiveIndex = agreementStatusOrder.indexOf(vendor.agreementStatus || 'not_sent');
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

  const renderTagList = (items?: string[]) => {
    if (!items || items.length === 0) {
      return <span className="text-sm font-semibold text-gray-900">—</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/vendors" className="hover:text-gray-600 transition-colors flex items-center gap-1">
          <ArrowLeftIcon className="h-3.5 w-3.5" />
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


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – profile + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              Vendor Profile
            </h2>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              {[
                ['Contact Person', vendor.contactPerson],
                ['Email', vendor.email],
                ['Phone', vendor.phone || '—'],
                ['Vendor Type', vendor.vendorType ? `${vendor.vendorType[0].toUpperCase()}${vendor.vendorType.slice(1)}` : '—'],
                ['Website', vendor.website || '—'],
                ['Sector', vendor.sector || '—'],
                ['Location', vendor.location || '—'],
                ['Services Offered', vendor.servicesOffered || '—'],
                ['Profile Completion', vendor.profileCompletion ? `${vendor.profileCompletion}%` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{k}</dt>
                  <dd className="font-semibold text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Locations Served</dt>
                <dd>{renderTagList(vendor.locationsServed)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Industry Focus</dt>
                <dd>{renderTagList(vendor.industryFocus)}</dd>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
              {[
                ['Legal Entity Name', vendor.legalEntityName || '—'],
                ['GST Number', vendor.gstNumber || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{k}</dt>
                  <dd className="font-semibold text-gray-900">{v}</dd>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Registered Address</dt>
              <dd className="text-sm text-gray-700 whitespace-pre-wrap">{vendor.registeredAddress || '—'}</dd>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Description</dt>
              <dd className="text-sm text-gray-700 whitespace-pre-wrap">{vendor.companyDescription || '—'}</dd>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Corporate Profile</dt>
              <dd className="text-sm text-gray-700 whitespace-pre-wrap">{vendor.corporateProfile || '—'}</dd>
            </div>
          </div>

          {/* Lifecycle visualization */}
          {!isOnboardedVendor ? (
            <OnboardingLifecycleTracker
              stages={STAGES}
              stageLabels={STAGE_LABELS}
              stageDescriptions={STAGE_DESCRIPTIONS}
              stageIndex={stageIndex}
              history={vendor.onboardingHistory}
              agreementStatus={vendor.agreementStatus}
              agreementSentAt={vendor.agreementSentAt}
              agreementViewedAt={vendor.agreementViewedAt}
              agreementSignedAt={vendor.agreementSignedAt}
              agreementEnvelopeId={vendor.agreementEnvelopeId}
              agreementDeliveryStatus={vendor.agreementDeliveryStatus}
              meetingDate={vendor.meetingDate}
              meetingTime={vendor.meetingTime}
              meetingLink={vendor.meetingLink}
              meetingInfoNote="Meeting scheduled via Calendly. Meeting details have been sent to the vendor email."
              locale="en-IN"
              wrapperClassName="max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-gray-500" />
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
                  <OnboardingLifecycleTracker
                    stages={STAGES}
                    stageLabels={STAGE_LABELS}
                    stageDescriptions={STAGE_DESCRIPTIONS}
                    stageIndex={stageIndex}
                    history={vendor.onboardingHistory}
                    agreementStatus={vendor.agreementStatus}
                    agreementSentAt={vendor.agreementSentAt}
                    agreementViewedAt={vendor.agreementViewedAt}
                    agreementSignedAt={vendor.agreementSignedAt}
                    agreementEnvelopeId={vendor.agreementEnvelopeId}
                    agreementDeliveryStatus={vendor.agreementDeliveryStatus}
                    meetingDate={vendor.meetingDate}
                    meetingTime={vendor.meetingTime}
                    meetingLink={vendor.meetingLink}
                    meetingInfoNote="Meeting scheduled via Calendly. Meeting details have been sent to the vendor email."
                    locale="en-IN"
                    wrapperClassName="max-w-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right – action cards */}
        <div className="space-y-4">
          {/* Approve/Reject for pending (Top-right primary actions) */}
          {vendor.status === 'pending' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Actions</h3>
              <button
                onClick={() => act(() => adminService.approveVendor(id), 'approve')}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'approve' ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Approving…</>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
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
                  <XCircleIcon className="h-4 w-4" />
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

          {/* Onboarding actions only while not finished (Top-right primary actions) */}
          {(vendor.status === 'approved' || vendor.status === 'onboarding') && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin Actions
              </h3>
              <>
                <hr className="border-gray-100" />

                  {/* Send Agreement */}
		                  <div className="space-y-2">
		                    <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
	                      <FileIcon className="h-3 w-3" />
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
	                      {actionLoading === 'agreement' ? 'Sending…' : 'Send Agreement'}
	                    </button>
	                  </div>

                  <hr className="border-gray-100" />

                  {/* Mark Viewed / Signed / Complete */}
	                  <button
	                    onClick={() => act(() => adminService.markAgreementViewed(id), 'viewed')}
	                    disabled={!!actionLoading || vendor.agreementStatus === 'not_sent'}
	                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
	                  >
	                    {actionLoading === 'viewed' ? 'Marking…' : 'Mark Agreement Viewed'}
                  </button>
	                  <button
	                    onClick={() => act(() => adminService.markAgreementSigned(id), 'signed')}
	                    disabled={!!actionLoading || vendor.agreementStatus === 'not_sent'}
	                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
		                  >
		                    {actionLoading === 'signed' ? 'Marking…' : (
		                      <>
	                        <EditIcon className="h-[13px] w-[13px]" />
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
	                        <ShieldIcon className="h-4 w-4" />
	                        Complete Onboarding
	                      </>
	                    )}
                  </button>
              </>
            </div>
          )}

          {/* Status info cards */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Agreement Signing Tracker</p>
              {vendor.agreementStatus === 'signed' && (
                <button
                  type="button"
                  onClick={() => setShowAgreementTrackerDetails((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  {showAgreementTrackerDetails ? 'Minimize' : 'Expand'}
                </button>
              )}
            </div>
            {vendor.agreementStatus === 'signed' && !showAgreementTrackerDetails ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
                <p className="text-xs font-semibold text-emerald-800">Agreement lifecycle completed.</p>
                <p className="mt-1 text-xs text-emerald-700">Vendor has signed the agreement successfully.</p>
                {vendor.agreementSignedAt && (
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    Signed on {new Date(vendor.agreementSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
              {AGREEMENT_FLOW_STEPS.map((step, index) => {
                const stepIndex = agreementStatusOrder.indexOf(step.key);
                const complete = agreementActiveIndex > stepIndex;
                const current = agreementActiveIndex === stepIndex;

                return (
                  <div key={step.key} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                    <div
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        complete
                          ? 'bg-primary-500 text-white'
                          : current
                          ? 'border-2 border-primary-500 bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {complete ? <CheckCircleIcon className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${current ? 'text-primary-700' : complete ? 'text-gray-700' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">{step.detail}</p>
                    </div>
                    {current && (
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                        Current
                      </span>
                    )}
                    {complete && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm font-medium capitalize text-gray-800">
              Current status: {(vendor.agreementStatus || 'not_sent').replace('_', ' ')}
            </p>
            {vendor.agreementSentAt && (
              <p className="mt-1 text-xs text-amber-700">
                Sent: {new Date(vendor.agreementSentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
            {vendor.agreementEnvelopeId && (
              <p className="mt-1 break-all text-xs text-gray-500">
                Envelope ID: {vendor.agreementEnvelopeId}
              </p>
            )}
            {vendor.agreementDeliveryStatus && (
              <p className="mt-1 text-xs font-medium text-indigo-700">
                DocuSign status: {vendor.agreementDeliveryStatus.replace(/_/g, ' ')}
              </p>
            )}
            {vendor.agreementViewedAt && (
              <p className="mt-1 text-xs text-sky-700">
                Viewed: {new Date(vendor.agreementViewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
            {vendor.agreementSignedAt && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                Signed: {new Date(vendor.agreementSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
              </>
            )}
          </div>

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
                  onClick={() => {
                    if (!isPortalPaused) {
                      setShowDeactivateConfirm(true);
                      return;
                    }
                    act(
                      () =>
                        adminService.setVendorPortalAccess(id, {
                          portalAccessStatus: 'active',
                          reason: undefined,
                        }),
                      'resume-portal'
                    );
                  }}
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
                <ConfirmModal
                  open={showDeactivateConfirm}
                  title="Deactivate vendor account"
                  message="Are you sure you want to deactivate this vendor?"
                  confirmLabel="Confirm"
                  cancelLabel="Cancel"
                  variant="danger"
                  onCancel={() => setShowDeactivateConfirm(false)}
                  onConfirm={() => {
                    setShowDeactivateConfirm(false);
                    act(
                      () =>
                        adminService.setVendorPortalAccess(id, {
                          portalAccessStatus: 'paused',
                          reason: pauseReason,
                        }),
                      'pause-portal'
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
