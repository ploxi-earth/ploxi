'use client';
import { useEffect, useMemo, useState } from 'react';
import { portalService } from '@/services/portal.service';

type ProjectStatus = 'opportunity' | 'proposal' | 'in_progress' | 'completed' | 'cancelled';

type ProjectRow = {
  id: string;
  title?: string | null;
  client?: string | null;
  status?: ProjectStatus | string | null;
  progress?: number | null;
  end_date?: string | null;
  value?: number | null;
};

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
    opportunity: { label: 'Opportunity', classes: 'bg-gray-100 text-gray-700' },
    proposal: { label: 'Proposal', classes: 'bg-amber-100 text-amber-700' },
    in_progress: { label: 'In Progress', classes: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', classes: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-600' },
};

export default function VendorProjectsPage() {
    const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState<ProjectRow[]>([]);

    const load = async (status?: string) => {
      setLoading(true);
      setError('');
      try {
        const r = await portalService.getProjects(status);
        setProjects(r.data?.data || []);
      } catch (e: unknown) {
        setProjects([]);
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    useEffect(() => {
      load(filter === 'all' ? undefined : filter);
    }, [filter]);

    const filtered = projects;

    const counts = useMemo(() => {
      const all = projects.length;
      const by = (s: ProjectStatus) => projects.filter((p) => p.status === s).length;
      return {
        all,
        opportunity: by('opportunity'),
        proposal: by('proposal'),
        in_progress: by('in_progress'),
        completed: by('completed'),
        cancelled: by('cancelled'),
      };
    }, [projects]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Projects & Opportunities</h1>
                <p className="text-gray-500 text-sm mt-0.5">Track your project pipeline and submitted proposals</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'opportunity', 'proposal', 'in_progress', 'completed', 'cancelled'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {f === 'all' ? 'All' : (STATUS_CONFIG[f]?.label || f)} ({(counts as any)[f]})
                    </button>
                ))}
            </div>

            {/* Project table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="space-y-3 p-4 md:hidden">
                    {loading ? (
                      <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">Loading projects…</div>
                    ) : filtered.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">No projects match this filter.</div>
                    ) : filtered.map((p) => (
                      <div key={p.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{p.title || 'Untitled project'}</p>
                            <p className="mt-1 text-sm text-gray-500">{p.client || '—'}</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${(STATUS_CONFIG[p.status || ''] || STATUS_CONFIG.opportunity).classes}`}>
                            {(STATUS_CONFIG[p.status || ''] || STATUS_CONFIG.opportunity).label}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">Value</p>
                            <p className="mt-1 font-semibold text-gray-800">₹{Number(p.value || 0).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">Deadline</p>
                            <p className="mt-1 text-gray-600">
                              {p.end_date ? new Date(p.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                            <span>Progress</span>
                            <span>{Number(p.progress || 0)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full transition-all ${p.status === 'completed' ? 'bg-emerald-500' : p.status === 'cancelled' ? 'bg-red-300' : 'bg-primary-500'}`}
                              style={{ width: `${Number(p.progress || 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-left">
                                <th className="px-5 py-3.5 font-medium text-gray-500">Project</th>
                                <th className="px-5 py-3.5 font-medium text-gray-500">Client</th>
                                <th className="px-5 py-3.5 font-medium text-gray-500">Value</th>
                                <th className="px-5 py-3.5 font-medium text-gray-500">Progress</th>
                                <th className="px-5 py-3.5 font-medium text-gray-500">Deadline</th>
                                <th className="px-5 py-3.5 font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                              <tr><td className="px-5 py-6 text-gray-400 text-sm" colSpan={6}>Loading projects…</td></tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-gray-800">{p.title || 'Untitled project'}</td>
                                    <td className="px-5 py-4 text-gray-600">{p.client || '—'}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-800">₹{Number(p.value || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-100 rounded-full">
                                                <div
                                                    className={`h-full rounded-full transition-all ${p.status === 'completed' ? 'bg-emerald-500' : p.status === 'cancelled' ? 'bg-red-300' : 'bg-primary-500'}`}
                                                    style={{ width: `${Number(p.progress || 0)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">{Number(p.progress || 0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                      {p.end_date ? new Date(p.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${(STATUS_CONFIG[p.status || ''] || STATUS_CONFIG.opportunity).classes}`}>
                                            {(STATUS_CONFIG[p.status || ''] || STATUS_CONFIG.opportunity).label}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filtered.length === 0 && (
                    <div className="hidden py-12 text-center md:block">
                        <p className="text-gray-400 text-sm">No projects match this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
