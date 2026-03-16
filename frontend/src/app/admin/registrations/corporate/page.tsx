'use client';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';

interface Reg { _id: string; fullName?: string; companyName?: string; email: string; industrySector?: string; status: string; createdAt: string }

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border border-amber-200',
  in_review:  'bg-blue-50 text-blue-700 border border-blue-200',
  contacted:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export default function CorporateRegistrationsPage() {
  const [items, setItems] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    adminService.getCorporateRegistrations({ status: status || undefined }).then((r: { data: { data: { registrations: Reg[] } } }) => {
      setItems(r.data.data.registrations || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Registrations</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Corporate</h1>
        <p className="text-gray-500 text-sm mt-1">Companies interested in ESG &amp; Sustainability services</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
        <select
          className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="contacted">Contacted</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{items.length} result{items.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <p className="text-sm text-gray-400">No registrations yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Company', 'Email', 'Sector', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{r.fullName || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.companyName || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{r.email}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{r.industrySector || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] || STATUS_STYLES.pending}`}>
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
