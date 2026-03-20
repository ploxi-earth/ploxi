'use client';
import { useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string;
    sector: string;
    status: 'active' | 'draft';
}

const SAMPLE_SERVICES: Service[] = [
    { id: 1, name: 'Solar Panel Installation', description: 'End-to-end rooftop and ground-mounted solar panel installation services for commercial and industrial clients.', sector: 'Renewable Energy', status: 'active' },
    { id: 2, name: 'Carbon Offset Consulting', description: 'Help organizations measure, reduce and offset their carbon footprint with verified carbon credits.', sector: 'Carbon Management', status: 'active' },
    { id: 3, name: 'Energy Audit & Assessment', description: 'Comprehensive energy audits including HVAC, lighting, and building envelope analysis with actionable recommendations.', sector: 'Energy Efficiency', status: 'active' },
    { id: 4, name: 'EV Charging Infrastructure', description: 'Design, supply and install electric vehicle charging stations for corporate campuses and public spaces.', sector: 'E-Mobility', status: 'draft' },
    { id: 5, name: 'Waste-to-Energy Solutions', description: 'Convert organic and municipal waste into usable energy through anaerobic digestion and gasification.', sector: 'Waste Management', status: 'active' },
];

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

    const sectors = Array.from(new Set(SAMPLE_SERVICES.map((s) => s.sector)));

    const filtered = SAMPLE_SERVICES.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || s.sector === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services & Solutions</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Manage the services you offer to clients</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    Add Service
                </button>
            </div>

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
                {filtered.map((s) => (
                    <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm hover:border-primary-100 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{s.name}</h3>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                {s.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{s.description}</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SECTOR_COLORS[s.sector] || 'bg-gray-100 text-gray-500'}`}>
                                {s.sector}
                            </span>
                            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                                Edit →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-sm">No services match your search.</p>
                </div>
            )}
        </div>
    );
}
