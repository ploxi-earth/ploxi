'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';

interface Vendor {
  _id: string; companyName: string; email: string; status: string;
  onboardingStage: string; createdAt: string; contactPerson: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border border-amber-200',
  approved:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected:   'bg-red-50 text-red-700 border border-red-200',
  onboarding: 'bg-blue-50 text-blue-700 border border-blue-200',
  onboarded:  'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVendors({ search, status: status || undefined, page, limit: 20 });
      setVendors(res.data.data.vendors || []);
      setTotal(res.data.data.total || 0);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, [search, status, page]);

  const handleAddVendor = () => {
    const email = prompt('Vendor email?'); if (!email) return;
    const companyName = prompt('Company name?'); if (!companyName) return;
    const contactPerson = prompt('Contact person name?'); if (!contactPerson) return;
    const phone = prompt('Phone number?') || '';
    adminService.addVendor({ email, companyName, contactPerson, phone }).then(fetchVendors).catch((e: unknown) => alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error'));
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Console</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Vendors</h1>
          <p className="text-gray-500 text-sm mt-1">{total} vendor{total !== 1 ? 's' : ''} registered on the platform</p>
        </div>
        <button
          onClick={handleAddVendor}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            placeholder="Search company or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="onboarding">Onboarding</option>
          <option value="onboarded">Onboarded</option>
        </select>
        {(search || status) && (
          <button onClick={() => { setSearch(''); setStatus(''); setPage(1); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
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
            <svg className="mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <p className="text-sm text-gray-400">No vendors found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Company', 'Contact', 'Email', 'Status', 'Stage', 'Joined', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{v.companyName || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{v.contactPerson || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{v.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[v.status] || STATUS_STYLES.pending}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 capitalize text-xs">{v.onboardingStage?.replace(/_/g, ' ') || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/vendors/${v._id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">
                      View
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between mt-5 text-sm">
          <p className="text-gray-400">Showing page {page}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={vendors.length < 20} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
