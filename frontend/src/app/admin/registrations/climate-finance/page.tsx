'use client';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';

interface Reg { _id: string; fullName?: string; email: string; organization?: string; engagementType: string; status: string; createdAt: string }

const TYPE_LABELS: Record<string, string> = {
  raise_funding: 'Raise Funding',
  investor:      'Investor',
  participate:   'Participate',
};
const TYPE_STYLES: Record<string, string> = {
  raise_funding: 'bg-purple-50 text-purple-700 border border-purple-200',
  investor:      'bg-blue-50 text-blue-700 border border-blue-200',
  participate:   'bg-teal-50 text-teal-700 border border-teal-200',
};
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  approved:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected:  'bg-red-50 text-red-700 border border-red-200',
};

export default function ClimateFinanceRegistrationsPage() {
  const [items, setItems] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    adminService.getClimateFinanceRegistrations({ engagementType: typeFilter || undefined }).then((r: { data: { data: { registrations: Reg[] } } }) => {
      setItems(r.data.data.registrations || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [typeFilter]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Registrations</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Climate Finance</h1>
        <p className="text-gray-500 text-sm mt-1">Funding, investor and participation enquiries</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
        <select
          className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All engagement types</option>
          <option value="raise_funding">Raise Funding</option>
          <option value="investor">Investor</option>
          <option value="participate">Participate</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{items.length} result{items.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <p className="text-sm text-gray-400">No registrations yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Email', 'Organisation', 'Type', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{r.fullName || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500">{r.email}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{r.organization || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_STYLES[r.engagementType] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                      {TYPE_LABELS[r.engagementType] || r.engagementType}
                    </span>
                  </td>
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
