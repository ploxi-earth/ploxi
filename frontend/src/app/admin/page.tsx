'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';

interface DashboardData {
  vendors: { total: number; pending: number; approved: number; rejected: number; onboarding: number; onboarded: number };
  registrations: { corporate: number; cleantech: number; climateFinance: number };
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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((r: { data: { data: DashboardData } }) => {
        setData(r.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const vendorStats = data
    ? [
      {
        label: 'Total Vendors', value: data.vendors.total, accent: 'bg-gray-900',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      },
      {
        label: 'Pending Review', value: data.vendors.pending, accent: 'bg-amber-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
      },
      {
        label: 'Approved', value: data.vendors.approved, accent: 'bg-emerald-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
      },
      {
        label: 'Rejected', value: data.vendors.rejected, accent: 'bg-red-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
      },
      {
        label: 'In Onboarding', value: data.vendors.onboarding, accent: 'bg-blue-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
      },
      {
        label: 'Onboarded', value: data.vendors.onboarded, accent: 'bg-emerald-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
      },
    ]
    : [];

  const registrationStats = data
    ? [
      {
        label: 'Corporate Registrations', value: data.registrations.corporate, accent: 'bg-indigo-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
      },
      {
        label: 'CleanTech Registrations', value: data.registrations.cleantech, accent: 'bg-teal-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
      },
      {
        label: 'Climate Finance', value: data.registrations.climateFinance, accent: 'bg-cyan-600',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
      },
    ]
    : [];

  const quickLinks = [
    {
      href: '/admin/vendors', label: 'Manage Vendors', desc: 'Approve, reject and onboard vendors',
      accent: 'from-gray-800 to-gray-900',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
      href: '/admin/registrations/corporate', label: 'Corporate', desc: 'Review corporate enquiries',
      accent: 'from-indigo-600 to-indigo-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    },
    {
      href: '/admin/registrations/cleantech', label: 'CleanTech', desc: 'Review clean tech applications',
      accent: 'from-teal-600 to-emerald-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    },
    {
      href: '/admin/registrations/climate-finance', label: 'Climate Finance', desc: 'Review funding & investor enquiries',
      accent: 'from-cyan-600 to-blue-700',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Console</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time summary of all registrations and vendor activity</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Vendor stats */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Vendors</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {vendorStats.map((c) => (
              <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />
            ))}
          </div>

          {/* Registration stats */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Registrations</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrationStats.map((c) => (
              <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} accent={c.accent} />
            ))}
          </div>
        </>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
