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
  const [vendorType, setVendorType] = useState<'product' | 'service'>('service');
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
      .then((r: { data: { data: { status: string; vendorType?: 'product' | 'service' } } }) => {
        setVendorStatus(r.data.data.status);
        setVendorType(r.data.data.vendorType || 'service');
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
  const sharedPortalNav = PORTAL_NAV.filter(
    (item) =>
      item.href !== '/vendor/portal/services' &&
      item.href !== '/vendor/portal/projects'
  );
  const portalNav =
    vendorType === 'product'
      ? [
          PORTAL_NAV.find((item) => item.href === '/vendor/portal/projects')!,
          PORTAL_NAV.find((item) => item.href === '/vendor/portal/services')!,
          ...sharedPortalNav,
        ]
      : [
          PORTAL_NAV.find((item) => item.href === '/vendor/portal/services')!,
          PORTAL_NAV.find((item) => item.href === '/vendor/portal/projects')!,
          ...sharedPortalNav,
        ];
  const nav = isOnboarded ? portalNav : ONBOARDING_NAV;

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

          {/* Ploxi branding footer — shown in sidebar across all vendor pages */}
          <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-5">
              {/* Logo + brand */}
              <div className="mb-3 flex items-center gap-2.5">
                <Image
                  src="/images/logo.jpeg"
                  alt="Ploxi Earth"
                  width={30}
                  height={30}
                  className="rounded-full ring-1 ring-emerald-500/20"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none">Ploxi Earth</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">Sustainability Platform</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Empowering sustainable business growth through connected tools and climate-forward collaboration.
              </p>
              {/* Social links */}
              <div className="mb-3 flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/company/ploxi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ploxi on LinkedIn"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-400 hover:text-emerald-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ploxi.earth/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ploxi on Instagram"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-400 hover:text-emerald-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
              {/* Legal links */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 pt-3 text-[10px] text-slate-400">
                <a href="#" className="transition-colors hover:text-slate-700">Terms</a>
                <a href="#" className="transition-colors hover:text-slate-700">Data Policy</a>
                <a href="#" className="transition-colors hover:text-slate-700">Legal</a>
              </div>
              <p className="mt-2 text-[10px] text-slate-400">Bangalore, India · © 2025 Ploxi</p>
            </div>
        </>
      )}
    >
      <div className="min-h-[calc(100vh-6rem)]">{children}</div>
    </ShellFrame>
  );
}
