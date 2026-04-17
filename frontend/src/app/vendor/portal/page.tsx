'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { portalService } from '@/services/portal.service';
import { vendorService } from '@/services/vendor.service';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import {
  MessageIcon,
  HandshakeIcon,
  BoltIcon,
  BriefcaseIcon,
  CalendarIcon,
  SettingsIcon,
  ChevronRightIcon,
} from '@/components/vendor/VendorIcons';
import { VendorLogoAvatar } from '@/components/vendor/VendorLogoAvatar';

const STATUS_COLORS: Record<string, string> = {
    New: 'bg-blue-100 text-blue-700',
    Replied: 'bg-emerald-100 text-emerald-700',
    Closed: 'bg-gray-100 text-gray-500',
};

const PORTAL_WELCOME_KEY = 'ploxi_vendor_portal_explored';

type DashboardStats = {
  totalServices: number;
  activeServices: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  unreadNotifications: number;
};

type ProjectRow = {
  id: string;
  title?: string | null;
  client?: string | null;
  progress?: number | null;
  end_date?: string | null;
};

type NotificationRow = {
  id: string;
  title?: string | null;
  message?: string | null;
  created_at?: string | null;
  is_read?: boolean | null;
};

export default function VendorPortalDashboard() {
    const { user } = useAuthStore();
    const [showWelcome, setShowWelcome] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentProjects, setRecentProjects] = useState<ProjectRow[]>([]);
    const [recentNotifications, setRecentNotifications] = useState<NotificationRow[]>([]);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [vendorType, setVendorType] = useState<'product' | 'service'>('service');

    useEffect(() => {
        const id = user?._id || user?.email;
        if (!id) return;
        try {
            setShowWelcome(!localStorage.getItem(`${PORTAL_WELCOME_KEY}_${id}`));
        } catch {
            setShowWelcome(true);
        }
    }, [user?._id, user?.email]);

    const dismissWelcome = () => {
        const id = user?._id || user?.email;
        if (id) {
            try {
                localStorage.setItem(`${PORTAL_WELCOME_KEY}_${id}`, '1');
            } catch {
                /* ignore */
            }
        }
        setShowWelcome(false);
    };

    const load = async () => {
      setLoading(true);
      try {
        const r = await portalService.getDashboard();
        const payload = r.data?.data;
        setLogoUrl((payload as { logoUrl?: string | null } | undefined)?.logoUrl ?? null);
        setStats(payload?.stats || null);
        setRecentProjects(payload?.recentProjects || []);
        setRecentNotifications(payload?.recentNotifications || []);
      } catch {
        setStats(null);
        setRecentProjects([]);
        setRecentNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
      vendorService
        .getOnboardingStatus()
        .then((r: { data: { data: { vendorType?: 'product' | 'service' } } }) =>
          setVendorType(r.data.data.vendorType || 'service')
        )
        .catch(() => {});
    }, []);

    // Realtime updates: services + notifications affect dashboard stats/cards.
    useEffect(() => {
      const sb = getSupabaseBrowserClient();
      if (!sb) return;

      const servicesChannel = sb
        .channel('vendor-portal-services')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'services' },
          () => load()
        )
        .subscribe();

      const notificationsChannel = sb
        .channel('vendor-portal-notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          () => load()
        )
        .subscribe();

      const vendorId = user?._id;
      const vendorsChannel = vendorId
        ? sb
            .channel(`vendor-portal-logo-${vendorId}`)
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'vendors', filter: `id=eq.${vendorId}` },
              () => load()
            )
            .subscribe()
        : null;

      return () => {
        sb.removeChannel(servicesChannel);
        sb.removeChannel(notificationsChannel);
        if (vendorsChannel) sb.removeChannel(vendorsChannel);
      };
    }, [user?._id]);

    const statCards = [
      {
        label: vendorType === 'product' ? 'Active Projects' : 'Total Services',
        value: stats ? String(vendorType === 'product' ? stats.activeProjects : stats.totalServices) : '—',
        icon: vendorType === 'product' ? <HandshakeIcon className="w-6 h-6 text-violet-600" /> : <BoltIcon className="w-6 h-6 text-emerald-600" />,
      },
      {
        label: 'Enquiries',
        value: stats ? String(stats.unreadNotifications) : '—',
        icon: <MessageIcon className="w-6 h-6 text-blue-600" />,
      },
      {
        label: vendorType === 'product' ? 'Total Services' : 'Active Projects',
        value: stats ? String(vendorType === 'product' ? stats.totalServices : stats.activeProjects) : '—',
        icon: vendorType === 'product' ? <BoltIcon className="w-6 h-6 text-emerald-600" /> : <HandshakeIcon className="w-6 h-6 text-violet-600" />,
      },
    ];

    return (
        <div>
            {showWelcome && (
                <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-bold text-emerald-900">Welcome to your vendor portal</h2>
                    <p className="text-sm text-emerald-800/90 mt-1 max-w-2xl">
                        Your onboarding is complete. Use the dashboard below to manage services, projects, meetings, and notifications.
                    </p>
                    <button
                        type="button"
                        onClick={dismissWelcome}
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                        Explore Dashboard
                    </button>
                </div>
            )}
            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                {loading ? (
                    <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-gray-200 animate-pulse" aria-hidden />
                ) : (
                    <VendorLogoAvatar
                        logoUrl={logoUrl}
                        label={user?.name || 'Vendor'}
                        sizeClass="h-16 w-16 sm:h-20 sm:w-20"
                    />
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, {user?.name || 'Vendor'}</h1>
                    <p className="text-gray-500 mt-1">Here&apos;s a summary of your vendor portal activity.</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{s.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                            {loading && <p className="text-xs text-gray-400 mt-1">Loading…</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Enquiries */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
                        <Link href="/vendor/portal/notifications" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3 md:hidden">
                        {loading ? (
                          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">Loading enquiries…</div>
                        ) : recentNotifications.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">No enquiries yet.</div>
                        ) : recentNotifications.map((n) => (
                          <div key={n.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">{n.title || 'Enquiry'}</p>
                                <p className="mt-1 text-sm leading-6 text-gray-600">{n.message || '—'}</p>
                              </div>
                              <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${n.is_read ? STATUS_COLORS.Closed : STATUS_COLORS.New}`}>
                                {n.is_read ? 'Closed' : 'New'}
                              </span>
                            </div>
                            <p className="mt-3 text-xs text-gray-400">
                              {n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
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
                                {loading ? (
                                  <tr><td className="py-6 text-gray-400 text-sm" colSpan={4}>Loading enquiries…</td></tr>
                                ) : recentNotifications.length === 0 ? (
                                  <tr><td className="py-6 text-gray-400 text-sm" colSpan={4}>No enquiries yet.</td></tr>
                                ) : recentNotifications.map((n) => (
                                  <tr key={n.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 font-medium text-gray-800">{n.title || 'Enquiry'}</td>
                                    <td className="py-3 text-gray-600">{n.message || '—'}</td>
                                    <td className="py-3 text-gray-500">
                                      {n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="py-3">
                                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${n.is_read ? STATUS_COLORS.Closed : STATUS_COLORS.New}`}>
                                        {n.is_read ? 'Closed' : 'New'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                    <h2 className="font-semibold text-gray-900 mb-5">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            ...(vendorType === 'service'
                              ? [{ href: '/vendor/portal/services', label: 'Manage Services', icon: <BoltIcon className="w-5 h-5 text-emerald-600" />, desc: 'Add or edit your offerings' }]
                              : [{ href: '/vendor/portal/projects', label: 'View Projects', icon: <BriefcaseIcon className="w-5 h-5 text-blue-600" />, desc: 'Track active opportunities' }]),
                            ...(vendorType === 'service'
                              ? [{ href: '/vendor/portal/projects', label: 'View Projects', icon: <BriefcaseIcon className="w-5 h-5 text-blue-600" />, desc: 'Track active opportunities' }]
                              : [{ href: '/vendor/portal/services', label: 'Manage Services', icon: <BoltIcon className="w-5 h-5 text-emerald-600" />, desc: 'Add or edit your offerings' }]),
                            { href: '/vendor/portal/meetings', label: 'Meetings', icon: <CalendarIcon className="w-5 h-5 text-purple-600" />, desc: 'Check upcoming schedules' },
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
            <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold text-gray-900">Active Projects</h2>
                    <Link href="/vendor/portal/projects" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View all →
                    </Link>
                </div>
                <div className="space-y-4">
                    {loading ? (
                      <div className="text-gray-400 text-sm py-6">Loading projects…</div>
                    ) : recentProjects.length === 0 ? (
                      <div className="text-gray-400 text-sm py-6">No projects yet.</div>
                    ) : recentProjects.map((p) => (
                        <div key={p.id} className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:border-primary-100 sm:flex-row sm:items-center">
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
                                {Number(p.progress || 0)}%
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">{p.title || 'Untitled project'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {p.client || '—'}
                                  {p.end_date ? ` · Due ${new Date(p.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                                </p>
                            </div>
                            <div className="w-full sm:w-32">
                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div
                                        className="h-full rounded-full bg-primary-500 transition-all"
                                        style={{ width: `${Number(p.progress || 0)}%` }}
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
