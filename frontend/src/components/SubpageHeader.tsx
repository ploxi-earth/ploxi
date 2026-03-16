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
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-700">
            {backLabel}
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.jpeg"
              alt="Ploxi Earth"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Ploxi Earth</p>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <a
            href="https://www.ploxiconsult.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Go to Website
          </a>
        </div>
      </header>
    </HeroFadeDown>
  );
}
