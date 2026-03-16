'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';

interface Stats {
  totalVendors: number; pendingVendors: number; approvedVendors: number; rejectedVendors: number;
  onboardingVendors: number; onboardedVendors: number;
  corporateRegistrations: number; cleantechRegistrations: number; climateFinanceRegistrations: number;
}

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then((r: { data: { data: Stats } }) => { setStats(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Vendors', value: stats.totalVendors, accent: 'bg-gray-900',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      label: 'Pending Review', value: stats.pendingVendors, accent: 'bg-amber-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
    {
      label: 'Approved', value: stats.approvedVendors, accent: 'bg-emerald-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    },
    {
      label: 'Rejected', value: stats.rejectedVendors, accent: 'bg-red-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    },
    {
      label: 'In Onboarding', value: stats.onboardingVendors, accent: 'bg-blue-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    },
    {
      label: 'Onboarded', value: stats.onboardedVendors, accent: 'bg-emerald-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    },
    {
      label: 'Corporate Registrations', value: stats.corporateRegistrations, accent: 'bg-indigo-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    },
    {
      label: 'CleanTech Registrations', value: stats.cleantechRegistrations, accent: 'bg-teal-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
    {
      label: 'Climate Finance Registrations', value: stats.climateFinanceRegistrations, accent: 'bg-cyan-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    },
  ] : [];

  const quickLinks = [
    {
      href: '/admin/vendors', label: 'Manage Vendors', desc: 'Approve, reject and onboard vendors',
      accent: 'from-gray-800 to-gray-900',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      href: '/admin/registrations/corporate', label: 'Corporate', desc: 'Review corporate enquiries',
      accent: 'from-indigo-600 to-indigo-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    },
    {
      href: '/admin/registrations/cleantech', label: 'CleanTech', desc: 'Review clean tech applications',
      accent: 'from-teal-600 to-emerald-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
    {
      href: '/admin/registrations/climate-finance', label: 'Climate Finance', desc: 'Review funding & investor enquiries',
      accent: 'from-cyan-600 to-blue-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Console</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time summary of all registrations and vendor activity</p>
      </div>

      {/* Stat grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((c) => (
            <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`bg-gradient-to-br ${q.accent} text-white rounded-2xl p-5 flex flex-col gap-3 hover:opacity-90 transition-all shadow-sm hover:shadow-md group`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                {q.icon}
              </div>
              <div>
                <p className="font-semibold text-sm leading-none mb-1">{q.label}</p>
                <p className="text-xs opacity-70 leading-tight">{q.desc}</p>
              </div>
              <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Open
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
