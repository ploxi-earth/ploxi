'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import ShellFrame from '@/components/ui/ShellFrame';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !['manager', 'platform_admin'].includes(user?.role || ''))
      router.push('/auth/login');
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <ShellFrame
      rootClassName="page-shell bg-gray-50"
      sidebarWidthClassName="w-56"
      sidebarPanelClassName="border-r border-gray-100 bg-white/95 text-gray-900 backdrop-blur"
      mainClassName="lg:pl-56"
      contentClassName="px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:p-8"
      mobileHeaderClassName="border-b border-gray-200/80 bg-white/90 backdrop-blur"
      mobileHeader={({ open }) => (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={34} height={34} className="rounded-full" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">Ploxi Earth</p>
              <p className="text-[11px] text-gray-500">Manager View</p>
            </div>
          </div>
          <button
            type="button"
            onClick={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}
      sidebar={({ close }) => (
        <>
          <div className="border-b border-gray-100 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={100} height={36} className="h-9 w-auto object-contain" />
                <p className="mt-1 text-xs text-gray-400">Manager View</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <Link
              href="/manager"
              onClick={close}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === '/manager' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              <span>📊</span>
              All Reports
            </Link>
          </nav>
          <div className="border-t border-gray-100 px-4 py-4">
            <p className="truncate text-xs text-gray-500">{user?.name || user?.email}</p>
            <button
              onClick={() => {
                close();
                useAuthStore.getState().clearAuth();
                router.push('/auth/login');
              }}
              className="mt-1.5 text-xs text-gray-400 transition-colors hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    >
      {children}
    </ShellFrame>
  );
}
