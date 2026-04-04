'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { vendorService } from '@/services/vendor.service';
import { Icons } from '@/components/vendor/Icons';
import ShellFrame from '@/components/ui/ShellFrame';

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
    <ShellFrame
      rootClassName="page-shell bg-gradient-to-br from-slate-50 via-white to-slate-50"
      sidebarWidthClassName="w-64"
      sidebarPanelClassName="border-r border-slate-200 bg-white/95 text-slate-900 backdrop-blur"
      mainClassName="lg:pl-64"
      contentClassName="px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:p-8"
      mobileHeaderClassName="border-b border-slate-200/80 bg-white/90 backdrop-blur"
      mobileHeader={({ open }) => (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={36} height={36} className="rounded-full ring-2 ring-emerald-500/10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">Ploxi Earth</p>
              <p className="text-[11px] text-slate-500">{isOnboarded ? 'Vendor Portal' : 'Vendor Onboarding'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}
      sidebar={({ close }) => (
        <>
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={34} height={34} className="rounded-full" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">Ploxi Earth</p>
                  <p className="text-xs text-slate-500">{isOnboarded ? 'Vendor Portal' : 'Onboarding'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="mobile-scroll flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {loading ? (
              <div className="flex justify-center px-3 py-12">
                <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
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
                    onClick={close}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? 'border border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-[0_24px_50px_-30px_rgba(16,185,129,0.6)]'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">{l.icon}</span>
                    <span className="truncate">{l.label}</span>
                    {active && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-600" />}
                  </Link>
                );
              })
            )}
          </nav>

          <div className="space-y-3 border-t border-slate-200 px-4 py-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="mb-1 text-xs font-medium text-slate-600">Signed in as</p>
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name || user?.email}</p>
            </div>
            <button
              onClick={() => {
                close();
                useAuthStore.getState().clearAuth();
                router.push('/auth/login');
              }}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50/60 hover:text-red-600"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">{Icons.LogOut}</span>
              <span>Sign out</span>
            </button>
          </div>
        </>
      )}
    >
      {children}
    </ShellFrame>
  );
}
