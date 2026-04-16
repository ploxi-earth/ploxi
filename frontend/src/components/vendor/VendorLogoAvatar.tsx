'use client';

import { useState } from 'react';

function initialsFromLabel(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'V';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = {
  logoUrl?: string | null;
  label: string;
  sizeClass?: string;
  className?: string;
};

/**
 * Shows vendor logo from Supabase public URL, or a neutral placeholder with initials.
 */
export function VendorLogoAvatar({ logoUrl, label, sizeClass = 'h-14 w-14', className = '' }: Props) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(logoUrl && !broken);

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${sizeClass} ${className}`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote Supabase Storage URL; avoids next.config remotePatterns
        <img
          src={logoUrl!}
          alt={`${label} logo`}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white">
          {initialsFromLabel(label || 'Vendor')}
        </div>
      )}
    </div>
  );
}
