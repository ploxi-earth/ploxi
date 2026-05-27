'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const all = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-sm ${className}`}
    >
      <ol
        className="flex flex-wrap items-center gap-1.5"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {all.map((item, idx) => {
          const isLast = idx === all.length - 1;
          return (
            <li
              key={idx}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {idx === 0 ? (
                <Home className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
              )}
              {isLast || !item.href ? (
                <span
                  itemProp="name"
                  className="font-medium text-slate-700"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-500 transition-colors hover:text-primary-600"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(idx + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
