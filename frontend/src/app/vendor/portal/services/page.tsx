'use client';
import { useEffect, useMemo, useState } from 'react';
import { portalService } from '@/services/portal.service';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

type ServiceRow = {
  id: string;
  name: string;
  description?: string | null;
  sector?: string | null;
  status?: 'active' | 'inactive' | 'draft' | null;
  pricing?: number | null;
  category?: string | null;
  created_at?: string | null;
};

const SECTOR_COLORS: Record<string, string> = {
    'Renewable Energy': 'bg-emerald-100 text-emerald-700',
    'Carbon Management': 'bg-violet-100 text-violet-700',
    'Energy Efficiency': 'bg-blue-100 text-blue-700',
    'E-Mobility': 'bg-amber-100 text-amber-700',
    'Waste Management': 'bg-orange-100 text-orange-700',
};

export default function VendorServicesPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [services, setServices] = useState<ServiceRow[]>([]);

    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState({
      name: '',
      description: '',
      sector: '',
      status: 'active' as 'active' | 'inactive' | 'draft',
      pricing: '',
    });

    const sectors = useMemo(
      () => Array.from(new Set(services.map((s) => s.sector).filter(Boolean))) as string[],
      [services]
    );

    const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return services.filter((s) => {
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q);
        const matchFilter = filter === 'all' || (s.sector || '') === filter;
        return matchSearch && matchFilter;
      });
    }, [services, search, filter]);

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const r = await portalService.getServices();
        setServices(r.data?.data || []);
      } catch (e: unknown) {
        setServices([]);
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load services.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    // Realtime updates for services.
    useEffect(() => {
      const sb = getSupabaseBrowserClient();
      if (!sb) return;
      const ch = sb
        .channel('vendor-portal-services-list')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'services' },
          () => load()
        )
        .subscribe();
      return () => {
        sb.removeChannel(ch);
      };
    }, []);

    const createService = async () => {
      const name = draft.name.trim();
      const pricing = Number(draft.pricing);
      if (!name) {
        setError('Service name is required.');
        return;
      }
      if (!draft.pricing || Number.isNaN(pricing) || pricing <= 0) {
        setError('Service pricing is required and must be greater than 0.');
        return;
      }
      setSaving(true);
      setError('');
      try {
        await portalService.createService({
          name,
          description: draft.description.trim(),
          sector: draft.sector.trim() || null,
          status: draft.status,
          pricing,
        });
        setShowAdd(false);
        setDraft({ name: '', description: '', sector: '', status: 'active', pricing: '' });
        await load();
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create service.');
      } finally {
        setSaving(false);
      }
    };

    const openEdit = (service: ServiceRow) => {
      setEditingId(service.id);
      setDraft({
        name: service.name || '',
        description: service.description || '',
        sector: service.sector || '',
        status: (service.status || 'active') as 'active' | 'inactive' | 'draft',
        pricing: service.pricing ? String(service.pricing) : '',
      });
      setError('');
    };

    const updateService = async () => {
      if (!editingId) return;
      const name = draft.name.trim();
      const pricing = Number(draft.pricing);

      if (!name) {
        setError('Service name is required.');
        return;
      }
      if (!draft.pricing || Number.isNaN(pricing) || pricing <= 0) {
        setError('Service pricing is required and must be greater than 0.');
        return;
      }

      setSaving(true);
      setError('');
      try {
        await portalService.updateService(editingId, {
          name,
          description: draft.description.trim(),
          sector: draft.sector.trim() || null,
          status: draft.status,
          pricing,
        });
        setEditingId(null);
        setDraft({ name: '', description: '', sector: '', status: 'active', pricing: '' });
        await load();
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update service.');
      } finally {
        setSaving(false);
      }
    };

    const removeService = async () => {
      if (!editingId) return;
      setSaving(true);
      setError('');
      try {
        await portalService.deleteService(editingId);
        setEditingId(null);
        setDraft({ name: '', description: '', sector: '', status: 'active', pricing: '' });
        await load();
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete service.');
      } finally {
        setSaving(false);
      }
    };

    const togglePause = async (service: ServiceRow) => {
      const nextStatus = service.status === 'inactive' ? 'active' : 'inactive';
      try {
        await portalService.updateService(service.id, { status: nextStatus });
        await load();
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update service status.');
      }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services & Solutions</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Manage the services you offer to clients</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowAdd(true); setError(''); }}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    Add Service
                </button>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Add/Edit Service Modal */}
            {(showAdd || editingId) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Service' : 'Add Service'}</h2>
                    <button
                      type="button"
                      onClick={() => { setShowAdd(false); setEditingId(null); }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                        value={draft.name}
                        onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                        placeholder="e.g. Solar panel installation"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all min-h-[96px]"
                        value={draft.description}
                        onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))}
                        placeholder="Describe what you offer…"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Sector</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                          value={draft.sector}
                          onChange={(e) => setDraft(d => ({ ...d, sector: e.target.value }))}
                          placeholder="e.g. Renewable Energy"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Pricing (INR)</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                          value={draft.pricing}
                          onChange={(e) => setDraft(d => ({ ...d, pricing: e.target.value }))}
                          placeholder="e.g. 150000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                          value={draft.status}
                          onChange={(e) => setDraft(d => ({ ...d, status: e.target.value as 'active' | 'inactive' | 'draft' }))}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={editingId ? updateService : createService}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {saving ? (editingId ? 'Saving…' : 'Creating…') : (editingId ? 'Save Changes' : 'Create Service')}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={removeService}
                          className="w-full inline-flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          Delete Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search services…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                >
                    <option value="all">All Sectors</option>
                    {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {loading ? (
                  <div className="text-gray-400 text-sm py-10">Loading services…</div>
                ) : filtered.map((s) => (
                    <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm hover:border-primary-100 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{s.name}</h3>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : s.status === 'inactive' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                {s.status === 'active' ? 'Active' : s.status === 'inactive' ? 'Paused' : 'Draft'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{s.description || '—'}</p>
                        <div className="flex items-center justify-between gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SECTOR_COLORS[s.sector || ''] || 'bg-gray-100 text-gray-500'}`}>
                                {s.sector || '—'}
                            </span>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-xs font-semibold text-gray-700">
                                  ₹{Number(s.pricing || 0).toLocaleString('en-IN')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePause(s)}
                                  className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${s.status === 'inactive' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                                >
                                  {s.status === 'inactive' ? 'Activate' : 'Pause'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEdit(s)}
                                  className="inline-flex items-center rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
                                >
                                  Edit →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-sm">No services found.</p>
                </div>
            )}
        </div>
    );
}
