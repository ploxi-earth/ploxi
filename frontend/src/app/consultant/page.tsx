'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { consultantService } from '@/services/consultant.service';

interface Report {
  _id: string; title: string; reportingPeriod: string; status: string;
  createdAt: string; vendorId?: { companyName?: string };
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  published: 'bg-primary-100 text-primary-700',
};

export default function ConsultantReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultantService.getMyReports()
      .then((r: { data: { data: Report[] } }) => setReports(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Sustainability data collection & reporting</p>
        </div>
        <Link href="/consultant/reports/new" className="btn-primary text-sm">+ New Report</Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">📄</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No reports yet</h2>
          <p className="text-gray-500 text-sm mb-4">Create your first sustainability data report.</p>
          <Link href="/consultant/reports/new" className="btn-primary text-sm inline-block">Create Report</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r._id} href={`/consultant/reports/${r._id}`} className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {r.reportingPeriod}
                    {r.vendorId?.companyName && ` · ${r.vendorId.companyName}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status.replace(/_/g, ' ')}</span>
                  <span className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
