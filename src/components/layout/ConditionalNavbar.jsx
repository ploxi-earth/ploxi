'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const showNavbarRoutes = [
    // '/dashboard',
    // '/cleantech/dashboard',
    // '/climate-finance/dashboard',
  ];

  const shouldShowNavbar = showNavbarRoutes.some(route =>
    pathname.startsWith(route)
  );

  return shouldShowNavbar ? <Navbar /> : null;
}
