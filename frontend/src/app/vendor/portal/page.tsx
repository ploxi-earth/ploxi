'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  EyeIcon,
  MessageIcon,
  HandshakeIcon,
  CurrencyIcon,
  BoltIcon,
  BriefcaseIcon,
  CalendarIcon,
  FileIcon,
  SettingsIcon,
  ChevronRightIcon,
  TrendingUpIcon,
} from '@/components/vendor/VendorIcons';

const STATS = [
    { label: 'Total Views', value: '2,847', change: '+12%', up: true, icon: <EyeIcon className="w-6 h-6 text-blue-600" /> },
    { label: 'Enquiries', value: '34', change: '+8%', up: true, icon: <MessageIcon className="w-6 h-6 text-emerald-600" /> },
    { label: 'Active Deals', value: '7', change: '+2', up: true, icon: <HandshakeIcon className="w-6 h-6 text-violet-600" /> },
    { label: 'Revenue', value: '₹4.2L', change: '+18%', up: true, icon: <CurrencyIcon className="w-6 h-6 text-amber-600" /> },
];

const RECENT_ENQUIRIES = [
    { id: 1, company: 'GreenTech Solutions', subject: 'Solar Panel Installation', date: '15 Mar 2026', status: 'New' },
    { id: 2, company: 'EcoVentures India', subject: 'Carbon Offset Consultation', date: '14 Mar 2026', status: 'Replied' },
    { id: 3, company: 'CleanAir Corp', subject: 'Energy Audit Services', date: '13 Mar 2026', status: 'New' },
    { id: 4, company: 'Sustainable Infra Ltd', subject: 'Waste Management Setup', date: '12 Mar 2026', status: 'Closed' },
];

const ACTIVE_PROJECTS = [
    { id: 1, name: 'Solar Rooftop – Pune Campus', client: 'GreenTech Solutions', progress: 72, deadline: '30 Apr 2026' },
    { id: 2, name: 'Carbon Audit Q1', client: 'EcoVentures India', progress: 45, deadline: '15 May 2026' },
    { id: 3, name: 'EV Charging Stations', client: 'CleanAir Corp', progress: 20, deadline: '30 Jun 2026' },
];

const STATUS_COLORS: Record<string, string> = {
    New: 'bg-blue-100 text-blue-700',
    Replied: 'bg-emerald-100 text-emerald-700',
    Closed: 'bg-gray-100 text-gray-500',
};

export default function VendorPortalDashboard() {
    const { user } = useAuthStore();

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Vendor'}</h1>
                <p className="text-gray-500 mt-1">Here&apos;s a summary of your vendor portal activity.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{s.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                            <p className={`text-xs font-medium mt-1 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                {s.up ? '↑' : '↓'} {s.change} this month
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Enquiries */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
                        <Link href="/vendor/portal/projects" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="pb-3 font-medium text-gray-500">Company</th>
                                    <th className="pb-3 font-medium text-gray-500">Subject</th>
                                    <th className="pb-3 font-medium text-gray-500">Date</th>
                                    <th className="pb-3 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_ENQUIRIES.map((e) => (
                                    <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 font-medium text-gray-800">{e.company}</td>
                                        <td className="py-3 text-gray-600">{e.subject}</td>
                                        <td className="py-3 text-gray-500">{e.date}</td>
                                        <td className="py-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[e.status] || 'bg-gray-100 text-gray-500'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="font-semibold text-gray-900 mb-5">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { href: '/vendor/portal/services', label: 'Manage Services', icon: <BoltIcon className="w-5 h-5 text-emerald-600" />, desc: 'Add or edit your offerings' },
                            { href: '/vendor/portal/projects', label: 'View Projects', icon: <BriefcaseIcon className="w-5 h-5 text-blue-600" />, desc: 'Track active opportunities' },
                            { href: '/vendor/portal/meetings', label: 'Meetings', icon: <CalendarIcon className="w-5 h-5 text-purple-600" />, desc: 'Check upcoming schedules' },
                            { href: '/vendor/portal/documents', label: 'Documents', icon: <FileIcon className="w-5 h-5 text-orange-600" />, desc: 'View agreements & files' },
                            { href: '/vendor/portal/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5 text-slate-600" />, desc: 'Update your preferences' },
                        ].map((a) => (
                            <Link
                                key={a.href}
                                href={a.href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                            >
                                {a.icon}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-primary-700 transition-colors">{a.label}</p>
                                    <p className="text-xs text-gray-400">{a.desc}</p>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-gray-900">Active Projects</h2>
                    <Link href="/vendor/portal/projects" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View all →
                    </Link>
                </div>
                <div className="space-y-4">
                    {ACTIVE_PROJECTS.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-100 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                                {p.progress}%
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{p.client} · Due {p.deadline}</p>
                            </div>
                            <div className="w-32 hidden sm:block">
                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div
                                        className="h-full rounded-full bg-primary-500 transition-all"
                                        style={{ width: `${p.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
