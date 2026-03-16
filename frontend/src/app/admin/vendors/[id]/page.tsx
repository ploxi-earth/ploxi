'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { adminService } from '@/services/admin.service';

interface VendorDetail {
  _id: string; companyName: string; email: string; phone: string; contactPerson: string;
  status: string; onboardingStage: string; onboardingHistory: Array<{ stage: string; updatedAt: string; note?: string }>;
  website?: string; industry?: string; profileCompletion?: number;
  meetingScheduledAt?: string; agreementUrl?: string; agreementSignedAt?: string;
}

const STAGES = ['invited','profile_submitted','company_details_submitted','meeting_scheduled','agreement_sent','agreement_signed','onboarded'];

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border border-amber-200',
  approved:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected:   'bg-red-50 text-red-700 border border-red-200',
  onboarding: 'bg-blue-50 text-blue-700 border border-blue-200',
  onboarded:  'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const load = async () => {
    try { const r = await adminService.getVendor(id); setVendor(r.data.data); }
    catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const act = async (fn: () => Promise<unknown>, key: string) => {
    setActionLoading(key);
    try { await fn(); await load(); } catch (e: unknown) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Action failed');
    } finally { setActionLoading(''); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
  if (!vendor) return <div className="p-10 text-gray-400 text-center">Vendor not found.</div>;

  const stageIndex = STAGES.indexOf(vendor.onboardingStage);

  return (
    <div>
      {/* Breadcrumb + header */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/vendors" className="hover:text-gray-600 transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Vendors
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{vendor.companyName || vendor.email}</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {(vendor.companyName || vendor.email)[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-none">{vendor.companyName || vendor.email}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{vendor.email}</p>
        </div>
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[vendor.status] || STATUS_STYLES.pending}`}>
          {vendor.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – profile + timeline */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Vendor Profile
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ['Contact Person', vendor.contactPerson],
                ['Email', vendor.email],
                ['Phone', vendor.phone || '—'],
                ['Website', vendor.website || '—'],
                ['Industry', vendor.industry || '—'],
                ['Profile Completion', vendor.profileCompletion ? `${vendor.profileCompletion}%` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{k}</dt>
                  <dd className="font-semibold text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Onboarding timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
              Onboarding Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-100" />
              <div className="space-y-5">
                {STAGES.map((s, i) => {
                  const completed = i < stageIndex;
                  const current = i === stageIndex;
                  const histEntry = vendor.onboardingHistory?.find((h) => h.stage === s);
                  return (
                    <div key={s} className="flex items-start gap-4 relative">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold z-10 mt-0.5 ${completed ? 'bg-emerald-500 text-white' : current ? 'bg-white border-2 border-emerald-500 text-emerald-600' : 'bg-white border-2 border-gray-200 text-gray-300'}`}>
                        {completed ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : i + 1}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className={`text-sm font-semibold capitalize ${current ? 'text-emerald-600' : completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {s.replace(/_/g, ' ')}
                        </p>
                        {histEntry && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(histEntry.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {histEntry.note && <span className="ml-1">— {histEntry.note}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right – actions */}
        <div className="space-y-4">
          {vendor.status === 'pending' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</h3>
              <button
                onClick={() => act(() => adminService.approveVendor(id), 'approve')}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'approve' ? 'Approving…' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Approve Vendor
                  </>
                )}
              </button>
              <button
                onClick={() => { const n = prompt('Rejection reason?'); if (n) act(() => adminService.rejectVendor(id, n), 'reject'); }}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'reject' ? 'Rejecting…' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject Vendor
                  </>
                )}
              </button>
            </div>
          )}

          {vendor.status === 'approved' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Onboarding Actions</h3>
              {[
                { key: 'meeting', label: 'Schedule Meeting', icon: <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, loadingLabel: 'Scheduling…', action: () => { const d = prompt('Meeting date (YYYY-MM-DD)?'); const t = prompt('Time (HH:MM)?'); if (d && t) act(() => adminService.scheduleMeeting(id, { date: d, time: t }), 'meeting'); } },
                { key: 'agreement', label: 'Send Agreement', icon: <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, loadingLabel: 'Sending…', action: () => { const url = prompt('Agreement file URL?'); if (url) { const fd = new FormData(); fd.append('agreementUrl', url); act(() => adminService.sendAgreement(id, fd), 'agreement'); } } },
                { key: 'signed', label: 'Mark Agreement Signed', icon: <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, loadingLabel: 'Marking…', action: () => act(() => adminService.markAgreementSigned(id), 'signed') },
              ].map((a) => (
                <button key={a.key} onClick={a.action} disabled={!!actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {actionLoading === a.key ? a.loadingLabel : <>{a.icon}{a.label}</>}
                </button>
              ))}
              <button
                onClick={() => act(() => adminService.completeOnboarding(id), 'onboard')}
                disabled={!!actionLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === 'onboard' ? 'Completing…' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Complete Onboarding
                  </>
                )}
              </button>
            </div>
          )}

          {vendor.meetingScheduledAt && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Meeting Scheduled</p>
              <p className="text-sm font-medium text-blue-900">{new Date(vendor.meetingScheduledAt).toLocaleString()}</p>
            </div>
          )}

          {vendor.agreementUrl && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Agreement</p>
              <a href={vendor.agreementUrl} target="_blank" rel="noreferrer" className="text-sm text-amber-700 underline block truncate">{vendor.agreementUrl}</a>
              {vendor.agreementSignedAt && (
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Signed {new Date(vendor.agreementSignedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
