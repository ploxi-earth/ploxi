'use client';
import Image from 'next/image';
import Link from 'next/link';
import { HeroFadeDown } from '@/components/ui/Motion';

interface SubpageHeaderProps {
  subtitle: string;
  backHref?: string;
  backLabel?: string;
}

export default function SubpageHeader({
  subtitle,
  backHref = '/',
  backLabel = '← Back to Ploxi',
}: SubpageHeaderProps) {
  return (
    <HeroFadeDown>
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:min-w-[11rem]">
            <Link
              href={backHref}
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              {backLabel}
            </Link>
            <a
              href="https://www.ploxiconsult.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50 lg:hidden"
            >
              Website
            </a>
          </div>
          <div className="flex min-w-0 items-center gap-3 lg:flex-1 lg:justify-center">
            <Image
              src="/images/logo.jpeg"
              alt="Ploxi Earth"
              width={38}
              height={38}
              className="rounded-full ring-2 ring-primary-500/10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none text-gray-900">Ploxi Earth</p>
              <p className="truncate text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <a
            href="https://www.ploxiconsult.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 lg:inline-flex"
          >
            Go to Website
          </a>
        </div>
      </header>
    </HeroFadeDown>
  );
}
