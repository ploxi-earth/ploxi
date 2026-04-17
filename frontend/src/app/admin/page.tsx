'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import {
  BoltIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  BuildingIcon,
  RefreshIcon,
  ShieldIcon,
  TrendingUpIcon,
  UsersIcon,
  XCircleIcon,
} from '@/components/vendor/VendorIcons';

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
        icon: <UsersIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'Pending Review', value: data.vendors.pending, accent: 'bg-amber-500',
        icon: <ClockIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'Approved', value: data.vendors.approved, accent: 'bg-emerald-600',
        icon: <CheckCircleIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'Rejected', value: data.vendors.rejected, accent: 'bg-red-500',
        icon: <XCircleIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'In Onboarding', value: data.vendors.onboarding, accent: 'bg-blue-500',
        icon: <RefreshIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'Onboarded', value: data.vendors.onboarded, accent: 'bg-emerald-500',
        icon: <ShieldIcon className="h-[18px] w-[18px] text-white" />,
      },
    ]
    : [];

  const registrationStats = data
    ? [
      {
        label: 'Corporate Registrations', value: data.registrations.corporate, accent: 'bg-indigo-500',
        icon: <BuildingIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'CleanTech Registrations', value: data.registrations.cleantech, accent: 'bg-teal-500',
        icon: <BoltIcon className="h-[18px] w-[18px] text-white" />,
      },
      {
        label: 'Climate Finance', value: data.registrations.climateFinance, accent: 'bg-cyan-600',
        icon: <TrendingUpIcon className="h-[18px] w-[18px] text-white" />,
      },
    ]
    : [];

  const quickLinks = [
    {
      href: '/admin/vendors', label: 'Manage Vendors', desc: 'Approve, reject and onboard vendors',
      accent: 'from-gray-800 to-gray-900',
      icon: <UsersIcon className="h-5 w-5 text-white" />,
    },
    {
      href: '/admin/registrations/corporate', label: 'Corporate', desc: 'Review corporate enquiries',
      accent: 'from-indigo-600 to-indigo-700',
      icon: <BuildingIcon className="h-5 w-5 text-white" />,
    },
    {
      href: '/admin/registrations/cleantech', label: 'CleanTech', desc: 'Review clean tech applications',
      accent: 'from-teal-600 to-emerald-700',
      icon: <BoltIcon className="h-5 w-5 text-white" />,
    },
    {
      href: '/admin/registrations/climate-finance', label: 'Climate Finance', desc: 'Review funding & investor enquiries',
      accent: 'from-cyan-600 to-blue-700',
      icon: <TrendingUpIcon className="h-5 w-5 text-white" />,
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
              className={`relative bg-gradient-to-br ${q.accent} text-white rounded-2xl p-5 flex flex-col gap-3 hover:opacity-90 transition-all shadow-sm hover:shadow-md group`}
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
                <ChevronRightIcon className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
