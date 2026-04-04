'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { vendorService } from '@/services/vendor.service';
import { Icons } from '@/components/vendor/Icons';

const ONBOARDING_NAV = [
  { href: '/vendor', label: 'Dashboard', icon: Icons.Dashboard },
  { href: '/vendor/profile', label: 'Company Profile', icon: Icons.Briefcase },
  { href: '/vendor/onboarding', label: 'Onboarding', icon: Icons.Rocket },
];

const PORTAL_NAV = [
  { href: '/vendor/portal', label: 'Dashboard', icon: Icons.Dashboard },
  { href: '/vendor/profile', label: 'Company Profile', icon: Icons.Briefcase },
  { href: '/vendor/portal/services', label: 'Services', icon: Icons.Zap },
  { href: '/vendor/portal/projects', label: 'Projects', icon: Icons.Briefcase },
  { href: '/vendor/portal/meetings', label: 'Meetings', icon: Icons.Calendar },
  { href: '/vendor/portal/documents', label: 'Documents', icon: Icons.File },
  { href: '/vendor/portal/notifications', label: 'Notifications', icon: Icons.Bell },
  { href: '/vendor/portal/settings', label: 'Settings', icon: Icons.Settings },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Allow register page without auth
  const isPublicPage = pathname === '/vendor/register';

  useEffect(() => {
    if (!hydrated || isPublicPage) return;
    if (!isAuthenticated || user?.role !== 'vendor') {
      router.push('/auth/login');
    }
  }, [hydrated, isAuthenticated, user, router, isPublicPage]);

  // Fetch vendor status to determine which phase to show (refetch on route change so admin-side updates apply without full reload)
  useEffect(() => {
    if (!hydrated || !isAuthenticated || user?.role !== 'vendor' || isPublicPage) return;
    setLoading(true);
    vendorService
      .getOnboardingStatus()
      .then((r: { data: { data: { status: string } } }) => {
        setVendorStatus(r.data.data.status);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hydrated, isAuthenticated, user, isPublicPage, pathname]);

  // Redirect logic: onboarded vendor on onboarding pages → portal, and vice versa
  useEffect(() => {
    if (!vendorStatus || loading) return;

    const isOnboarded = vendorStatus === 'onboarded';
    const isOnOnboardingPage = pathname === '/vendor' || pathname === '/vendor/onboarding';
    const isOnPortalPage = pathname.startsWith('/vendor/portal');

    if (isOnboarded && isOnOnboardingPage) {
      router.replace('/vendor/portal');
    } else if (!isOnboarded && isOnPortalPage) {
      router.replace('/vendor');
    }
  }, [vendorStatus, pathname, loading, router]);

  // Render registration page without layout
  if (isPublicPage) return <>{children}</>;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'vendor') return null;

  const isOnboarded = vendorStatus === 'onboarded';
  const nav = isOnboarded ? PORTAL_NAV : ONBOARDING_NAV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-20 shadow-sm">
        {/* Logo & Branding */}
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={32} height={32} className="rounded-full" />
            <div>
              <p className="text-sm font-bold text-slate-900">Ploxi Earth</p>
              <p className="text-xs text-slate-500">{isOnboarded ? 'Vendor Portal' : 'Onboarding'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-12 flex justify-center">
              <div className="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            nav.map((l) => {
              const active =
                l.href === '/vendor' || l.href === '/vendor/portal'
                  ? pathname === l.href
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm border border-emerald-200/50'
                      : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`}
                >
                  <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{l.icon}</span>
                  <span>{l.label}</span>
                  {active && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-600" />}
                </Link>
              );
            })
          )}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-slate-200 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-1">Signed in as</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || user?.email}</p>
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().clearAuth();
              router.push('/auth/login');
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition-colors"
          >
            <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{Icons.LogOut}</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
