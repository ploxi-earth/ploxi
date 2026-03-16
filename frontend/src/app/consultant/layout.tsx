'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/consultant', label: 'My Reports', icon: '📄' },
  { href: '/consultant/reports/new', label: 'New Report', icon: '➕' },
];

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || !['consultant', 'manager', 'platform_admin'].includes(user?.role || ''))
      router.push('/auth/login');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-20">
        <div className="px-5 py-5 border-b border-gray-100">
          <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={100} height={36} className="h-9 w-auto object-contain" />
          <p className="text-xs text-gray-400 mt-1">Reporting Module</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV.map((l) => {
            const active = l.href === '/consultant' ? pathname === '/consultant' : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                <span>{l.icon}</span>{l.label}
              </Link>
            );
          })}
          {(user?.role === 'manager' || user?.role === 'platform_admin') && (
            <Link href="/manager" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/manager') ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              <span>👔</span>Manager View
            </Link>
          )}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 truncate">{user?.name || user?.email}</p>
          <button onClick={() => { useAuthStore.getState().clearAuth(); router.push('/auth/login'); }} className="mt-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">Sign out</button>
        </div>
      </aside>
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  );
}
