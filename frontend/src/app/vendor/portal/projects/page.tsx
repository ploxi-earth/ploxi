'use client';
import { useState } from 'react';

type ProjectStatus = 'active' | 'proposal_sent' | 'won' | 'lost';

interface Project {
    id: number;
    name: string;
    client: string;
    status: ProjectStatus;
    progress: number;
    deadline: string;
    value: string;
}

const SAMPLE_PROJECTS: Project[] = [
    { id: 1, name: 'Solar Rooftop – Pune Campus', client: 'GreenTech Solutions', status: 'active', progress: 72, deadline: '30 Apr 2026', value: '₹18.5L' },
    { id: 2, name: 'Carbon Audit Q1 2026', client: 'EcoVentures India', status: 'active', progress: 45, deadline: '15 May 2026', value: '₹3.2L' },
    { id: 3, name: 'EV Charging – Mumbai HQ', client: 'CleanAir Corp', status: 'proposal_sent', progress: 10, deadline: '30 Jun 2026', value: '₹12L' },
    { id: 4, name: 'Waste-to-Energy Pilot', client: 'Sustainable Infra Ltd', status: 'won', progress: 100, deadline: '28 Feb 2026', value: '₹8.7L' },
    { id: 5, name: 'LED Retrofit – Bangalore', client: 'BrightSpace Co', status: 'lost', progress: 0, deadline: '01 Mar 2026', value: '₹5.1L' },
    { id: 6, name: 'Solar Water Heater Installation', client: 'Horizon Realty', status: 'proposal_sent', progress: 5, deadline: '20 Jul 2026', value: '₹2.8L' },
];

const STATUS_CONFIG: Record<ProjectStatus, { label: string; classes: string }> = {
    active: { label: 'Active', classes: 'bg-blue-100 text-blue-700' },
    proposal_sent: { label: 'Proposal Sent', classes: 'bg-amber-100 text-amber-700' },
    won: { label: 'Won', classes: 'bg-emerald-100 text-emerald-700' },
    lost: { label: 'Lost', classes: 'bg-red-100 text-red-600' },
};

export default function VendorProjectsPage() {
    const [filter, setFilter] = useState<'all' | ProjectStatus>('all');

    const filtered = filter === 'all' ? SAMPLE_PROJECTS : SAMPLE_PROJECTS.filter((p) => p.status === filter);

    const counts = {
        all: SAMPLE_PROJECTS.length,
        active: SAMPLE_PROJECTS.filter((p) => p.status === 'active').length,
        proposal_sent: SAMPLE_PROJECTS.filter((p) => p.status === 'proposal_sent').length,
        won: SAMPLE_PROJECTS.filter((p) => p.status === 'won').length,
        lost: SAMPLE_PROJECTS.filter((p) => p.status === 'lost').length,
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Projects & Opportunities</h1>
                <p className="text-gray-500 text-sm mt-0.5">Track your project pipeline and submitted proposals</p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'active', 'proposal_sent', 'won', 'lost'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {f === 'all' ? 'All' : STATUS_CONFIG[f].label} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* Project table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
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
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-5 py-4 text-gray-600">{p.client}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-800">{p.value}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-100 rounded-full">
                                                <div
                                                    className={`h-full rounded-full transition-all ${p.status === 'won' ? 'bg-emerald-500' : p.status === 'lost' ? 'bg-red-300' : 'bg-primary-500'}`}
                                                    style={{ width: `${p.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">{p.deadline}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[p.status].classes}`}>
                                            {STATUS_CONFIG[p.status].label}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm">No projects match this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
