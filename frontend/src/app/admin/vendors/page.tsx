'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin.service';

interface Vendor {
  id: string;
  company_name: string;
  email: string;
  status: string;
  portal_access_status?: 'active' | 'paused';
  onboarding_stage: string;
  created_at: string;
  contact_person: string;
  hasPendingMeetingRequest?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  onboarding: 'bg-blue-50 text-blue-700 border border-blue-200',
  onboarded: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const ACCESS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  paused: 'bg-red-50 text-red-700 border border-red-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  blocked: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const getPortalAccessMeta = (vendor: Vendor) => {
  if (vendor.status === 'pending') {
    return { label: 'Awaiting approval', style: ACCESS_STYLES.pending };
  }

  if (vendor.status === 'rejected') {
    return { label: 'Blocked', style: ACCESS_STYLES.blocked };
  }

  return vendor.portal_access_status === 'paused'
    ? { label: 'Paused', style: ACCESS_STYLES.paused }
    : { label: 'Active', style: ACCESS_STYLES.active };
};

export default function AdminVendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pendingRequestsOnly, setPendingRequestsOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    companyName: '',
    contactPerson: '',
    phone: '',
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVendors({
        search,
        status: status || undefined,
        pendingRequests: pendingRequestsOnly || undefined,
        page,
        limit: 20,
      });
      setVendors(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search, status, pendingRequestsOnly, page]);

  const closeInviteDialog = () => {
    setShowInviteDialog(false);
    setInviteSubmitting(false);
    setInviteError('');
    setInviteForm({ email: '', companyName: '', contactPerson: '', phone: '' });
  };

  const handleAddVendor = async () => {
    if (!inviteForm.email.trim() || !inviteForm.companyName.trim() || !inviteForm.contactPerson.trim()) {
      setInviteError('Email, company name, and contact person are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inviteForm.email.trim())) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    setInviteSubmitting(true);
    setInviteError('');
    try {
      await adminService.addVendor({
        email: inviteForm.email.trim(),
        companyName: inviteForm.companyName.trim(),
        contactPerson: inviteForm.contactPerson.trim(),
        phone: inviteForm.phone.trim(),
      });
      closeInviteDialog();
      await fetchVendors();
    } catch (e: unknown) {
      setInviteError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to invite vendor.');
      setInviteSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Console</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Vendors</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} vendor{total !== 1 ? 's' : ''} registered on the platform
          </p>
        </div>
        <button
          onClick={() => setShowInviteDialog(true)}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Invite Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            placeholder="Search company or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="onboarding">Onboarding</option>
          <option value="onboarded">Completed</option>
        </select>
        <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
          <input
            type="checkbox"
            checked={pendingRequestsOnly}
            onChange={(e) => {
              setPendingRequestsOnly(e.target.checked);
              setPage(1);
            }}
            className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 focus:ring-red-200"
          />
          Notifications only
        </label>
        {(search || status || pendingRequestsOnly) && (
          <button
            onClick={() => {
              setSearch('');
              setStatus('');
              setPendingRequestsOnly(false);
              setPage(1);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Loading vendors…</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
            <p className="text-sm text-gray-400">No vendors found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {vendors.map((v) => {
                const portalAccess = getPortalAccessMeta(v);

                return (
                  <Link key={v.id} href={`/admin/vendors/${v.id}`} className="block rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <span>{v.company_name || '—'}</span>
                          {v.hasPendingMeetingRequest && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500" aria-label="Pending meeting request" title="Pending meeting request" />
                          )}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{v.contact_person || '—'}</p>
                      </div>
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[v.status] || STATUS_STYLES.pending}`}>
                        {v.status === 'onboarded' ? 'completed' : v.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
                        <p className="mt-1 break-all text-gray-600">{v.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${portalAccess.style}`}>
                          {portalAccess.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Company', 'Contact', 'Email', 'Status', 'Portal Access', 'Joined', ''].map((h) => (
                      <th key={h} className="bg-gray-50/60 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vendors.map((v) => {
                    const portalAccess = getPortalAccessMeta(v);

                    return (
                      <tr
                        key={v.id}
                        onClick={() => router.push(`/admin/vendors/${v.id}`)}
                        className="group cursor-pointer transition-colors hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-3.5 font-semibold text-gray-900">
                          <div className="inline-flex items-center gap-2">
                            <span>{v.company_name || '—'}</span>
                            {v.hasPendingMeetingRequest && (
                              <span className="inline-block w-2 h-2 rounded-full bg-red-500" aria-label="Pending meeting request" title="Pending meeting request" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{v.contact_person || '—'}</td>
                        <td className="px-5 py-3.5 text-gray-500">{v.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[v.status] || STATUS_STYLES.pending}`}>
                            {v.status === 'onboarded' ? 'completed' : v.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${portalAccess.style}`}>
                            {portalAccess.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/admin/vendors/${v.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 transition-colors group-hover:text-emerald-600"
                          >
                            View
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-400">Showing page {page}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
              ← Prev
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={vendors.length < 20} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}

      {showInviteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={closeInviteDialog}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-vendor-title"
            className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="invite-vendor-title" className="text-lg font-bold text-gray-900">Invite Vendor</h2>
                <p className="text-sm text-gray-500 mt-1">Add a vendor account to start onboarding.</p>
              </div>
              <button
                type="button"
                onClick={closeInviteDialog}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close invite vendor dialog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {inviteError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {inviteError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="vendor@company.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Company Name</label>
                <input
                  value={inviteForm.companyName}
                  onChange={(e) => setInviteForm((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Person</label>
                <input
                  value={inviteForm.contactPerson}
                  onChange={(e) => setInviteForm((p) => ({ ...p, contactPerson: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Primary contact name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Phone (Optional)</label>
                <input
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeInviteDialog}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={inviteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVendor}
                disabled={inviteSubmitting}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {inviteSubmitting ? 'Sending…' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
