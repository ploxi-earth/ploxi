'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { consultantService } from '@/services/consultant.service';
import { useAuthStore } from '@/store/authStore';

interface Report {
  _id: string; title: string; reportingPeriod: string; status: string; createdAt: string;
  energyData?: Record<string, number>; waterData?: Record<string, number>;
  wasteData?: Record<string, number>; emissionsData?: Record<string, number>;
  socialData?: Record<string, number>; governanceData?: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700', submitted: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700',
  published: 'bg-primary-100 text-primary-700',
};

const DATA_SECTIONS = [
  { key: 'energyData', label: '⚡ Energy' }, { key: 'waterData', label: '💧 Water' },
  { key: 'wasteData', label: '♻️ Waste' }, { key: 'emissionsData', label: '🌫️ Emissions' },
  { key: 'socialData', label: '👥 Social' }, { key: 'governanceData', label: '⚖️ Governance' },
];

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const load = async () => {
    try { const r = await consultantService.getReport(id); setReport(r.data.data); }
    catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const act = async (fn: () => Promise<unknown>, key: string) => {
    setActionLoading(key);
    try { await fn(); await load(); } catch (e: unknown) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Action failed');
    } finally { setActionLoading(''); }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;
  if (!report) return <div className="p-10 text-center text-gray-400">Report not found.</div>;

  const isManager = user?.role === 'manager' || user?.role === 'platform_admin';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/consultant" className="text-sm text-gray-500 hover:text-gray-700">← Reports</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">{report.title}</h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[report.status] || ''}`}>{report.status.replace(/_/g, ' ')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-500">Reporting Period</dt><dd className="font-medium mt-0.5">{report.reportingPeriod || '—'}</dd></div>
              <div><dt className="text-gray-500">Created</dt><dd className="font-medium mt-0.5">{new Date(report.createdAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>

          {/* Data sections */}
          {DATA_SECTIONS.map(({ key, label }) => {
            const sectionData = report[key as keyof Report] as Record<string, number> | undefined;
            if (!sectionData || Object.keys(sectionData).length === 0) return null;
            return (
              <div key={key} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">{label}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(sectionData).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {report.status === 'draft' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Actions</h3>
              <button onClick={() => act(() => consultantService.submitReport(id), 'submit')} disabled={!!actionLoading} className="btn-primary w-full text-sm">
                {actionLoading === 'submit' ? 'Submitting…' : '📤 Submit for Review'}
              </button>
            </div>
          )}
          {isManager && report.status === 'submitted' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Manager Actions</h3>
              <button onClick={() => act(() => consultantService.approveReport(id), 'approve')} disabled={!!actionLoading} className="btn-primary w-full text-sm">
                {actionLoading === 'approve' ? 'Approving…' : '✅ Approve Report'}
              </button>
            </div>
          )}
          {isManager && report.status === 'approved' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Publish</h3>
              <button onClick={() => act(() => consultantService.publishReport(id), 'publish')} disabled={!!actionLoading} className="btn-primary w-full text-sm">
                {actionLoading === 'publish' ? 'Publishing…' : '🌐 Publish Report'}
              </button>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Report Lifecycle</p>
            {['draft', 'submitted', 'under_review', 'approved', 'published'].map((s) => (
              <div key={s} className={`flex items-center gap-2 py-1 capitalize ${report.status === s ? 'font-semibold text-primary-600' : ''}`}>
                <span>{report.status === s ? '→' : '·'}</span>{s.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
