'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { consultantService } from '@/services/consultant.service';

interface Report {
  _id: string; title: string; reportingPeriod: string; status: string;
  createdAt: string; createdBy?: { name?: string; email?: string };
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700', submitted: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700',
  published: 'bg-primary-100 text-primary-700',
};

export default function ManagerDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('submitted');
  const [actionLoading, setActionLoading] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await consultantService.getAllReports({ status: status || undefined });
      setReports(r.data.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const act = async (fn: () => Promise<unknown>, key: string) => {
    setActionLoading(key);
    try { await fn(); await load(); } catch (e: unknown) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Action failed');
    } finally { setActionLoading(''); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review, approve and publish sustainability reports</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex gap-2 flex-wrap">
        {['', 'draft', 'submitted', 'under_review', 'approved', 'published'].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s ? s.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">No reports found.</div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/consultant/reports/${r._id}`} className="font-semibold text-gray-900 hover:text-primary-600 truncate block">{r.title}</Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {r.reportingPeriod || '—'}
                    {r.createdBy?.name && ` · ${r.createdBy.name}`}
                    {' · '}{new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[r.status] || ''}`}>{r.status.replace(/_/g, ' ')}</span>
                  {r.status === 'submitted' && (
                    <button onClick={() => act(() => consultantService.approveReport(r._id), `approve-${r._id}`)} disabled={!!actionLoading} className="btn-primary text-xs py-1 px-3">
                      {actionLoading === `approve-${r._id}` ? '…' : 'Approve'}
                    </button>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => act(() => consultantService.publishReport(r._id), `publish-${r._id}`)} disabled={!!actionLoading} className="btn-primary text-xs py-1 px-3">
                      {actionLoading === `publish-${r._id}` ? '…' : 'Publish'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
