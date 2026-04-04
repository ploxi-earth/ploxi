'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import ShellFrame from '@/components/ui/ShellFrame';

const NAV_LINKS = [
  {
    href: '/admin', label: 'Dashboard', exact: true,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    href: '/admin/vendors', label: 'Vendors', exact: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    href: '/admin/registrations/corporate', label: 'Corporate', exact: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    href: '/admin/registrations/cleantech', label: 'CleanTech', exact: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    href: '/admin/registrations/climate-finance', label: 'Climate Finance', exact: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const pathname = usePathname();

  // Allow login page to render without auth
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!hydrated || isLoginPage) return;
    if (!isAuthenticated || user?.role !== 'platform_admin') {
      router.push('/admin/login');
    }
  }, [hydrated, isAuthenticated, user, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'platform_admin') return null;

  return (
    <ShellFrame
      rootClassName="page-shell bg-[#f5f6f8]"
      sidebarWidthClassName="w-60"
      sidebarPanelClassName="border-r border-gray-800 bg-gray-950 text-white"
      mainClassName="lg:pl-60"
      contentClassName="px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 lg:py-8"
      mobileHeaderClassName="border-b border-slate-200/80 bg-white/85 backdrop-blur"
      mobileHeader={({ open }) => (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/images/logo.jpeg"
              alt="Ploxi Earth"
              width={34}
              height={34}
              className="rounded-full ring-2 ring-emerald-500/10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">Ploxi Earth</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Admin Console</p>
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
          <div className="border-b border-gray-800 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Image
                  src="/images/logo.jpeg"
                  alt="Ploxi Earth"
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-white/10 brightness-0 invert"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-none text-white">Ploxi Earth</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-500">Admin Console</p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 text-gray-400 transition-colors hover:bg-gray-900 hover:text-white lg:hidden"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="mobile-scroll flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {NAV_LINKS.map((l) => {
              const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-[0_20px_40px_-28px_rgba(16,185,129,0.9)]'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-gray-500'}>{l.icon}</span>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-800 px-4 py-4">
            <div className="mb-3 flex items-center gap-2.5 rounded-2xl border border-gray-800 bg-white/[0.03] px-3 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {user?.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                close();
                useAuthStore.getState().clearAuth();
                router.push('/admin/login');
              }}
              className="flex w-full items-center gap-2 text-xs text-gray-500 transition-colors hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </>
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </ShellFrame>
  );
}
