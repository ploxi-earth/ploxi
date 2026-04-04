import Image from 'next/image';
import Link from 'next/link';

interface FormPageHeaderProps {
  backHref: string;
  subtitle: string;
  backLabel?: string;
}

export default function FormPageHeader({
  backHref,
  subtitle,
  backLabel = '← Back to Ploxi',
}: FormPageHeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href={backHref} className="text-sm text-gray-500 transition-colors hover:text-gray-700">
            {backLabel}
          </Link>
          <a
            href="https://www.ploxiconsult.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            Website
          </a>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/images/logo.jpeg"
            alt="Ploxi Earth"
            width={34}
            height={34}
            className="rounded-full ring-2 ring-primary-500/10"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-none">Ploxi Earth</p>
            <p className="truncate text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
