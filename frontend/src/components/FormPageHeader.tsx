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
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-700">
          {backLabel}
        </Link>
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.jpeg"
            alt="Ploxi Earth"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-bold leading-none">Ploxi Earth</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div />
      </div>
    </header>
  );
}
