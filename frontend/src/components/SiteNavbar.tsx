'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Calendar, ChevronDown, ArrowRight, ExternalLink } from 'lucide-react';
import {
  PARTNERS_MENU,
  TOOLS_MENU,
  EVENTS_MENU,
  SERVICES_MENU,
  type MegaMenuItem,
  type MegaMenuColumn,
  type ServiceCard,
  type ServiceCategory,
} from '@/lib/navData';

// ─── Animation Variants ────────────────────────────────────────────────────────
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15, ease: 'easeIn' } },
};

const mobileVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.18, ease: 'easeIn' } },
};

// ─── Dropdown Trigger ─────────────────────────────────────────────────────────
interface NavDropdownProps {
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
  /** 'center' (default), 'right', or 'left' — aligns panel relative to trigger */
  side?: 'center' | 'right' | 'left';
}

function NavDropdown({ label, isOpen, onOpen, onClose, children, side = 'center' }: NavDropdownProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(onClose, 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
          isOpen
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`absolute top-full z-[200] ${
              side === 'right'
                ? 'right-0'
                : side === 'left'
                ? 'left-0'
                : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {/* Invisible hover bridge — fills the gap so mouse travel doesn't close menu */}
            <div className="h-2 w-full" />
            {/* Arrow */}
            <div className="mx-auto mb-1 flex justify-center">
              <div className="h-3 w-3 rotate-45 bg-white border-l border-t border-gray-100 shadow-sm" />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Partners Mega Menu ────────────────────────────────────────────────────────
function PartnersMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-72 rounded-[1.5rem] border border-gray-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Partners</p>
      </div>
      <div className="px-3 pb-4 space-y-0.5">
        {PARTNERS_MENU.map((item) => (
          <MegaMenuItemRow key={item.title} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

// ─── Tools Mega Menu ──────────────────────────────────────────────────────────
function ToolsMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[580px] max-w-[90vw] rounded-[1.5rem] border border-gray-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
      {/* Header strip */}
      <div className="border-b border-slate-800 bg-slate-950 px-5 py-3 rounded-t-[1.5rem]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Tools & Platform</p>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-4 divide-x divide-gray-50">
        {TOOLS_MENU.map((col) => (
          <ToolsColumn key={col.heading} col={col} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

function ToolsColumn({ col, onClose }: { col: MegaMenuColumn; onClose: () => void }) {
  return (
    <div className="px-3 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-600 mb-2 px-1 leading-tight">{col.heading}</p>
      <div className="space-y-0">
        {col.items.map((item) => (
          <MegaMenuItemRow key={item.title} item={item} onClose={onClose} compact />
        ))}
      </div>
    </div>
  );
}

// ─── Events Mega Menu ─────────────────────────────────────────────────────────
function EventsMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-72 rounded-[1.5rem] border border-gray-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Events</p>
      </div>
      <div className="px-3 pb-4 space-y-0.5">
        {EVENTS_MENU.map((item) => (
          <MegaMenuItemRow key={item.title} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

// ─── Services Mega Menu ───────────────────────────────────────────────────────
// 12 service cards laid out in a 3-column grid, grouped by category.
// CTA labels live exclusively in navData.ts — no code change needed to update them.

const SERVICE_CATEGORY_ORDER: ServiceCategory[] = [
  'ESG & Reporting',
  'Carbon & Compliance',
  'Markets & Financing',
  'Green Assets',
  'Platform',
];

const CATEGORY_ACCENT: Record<ServiceCategory, { dot: string; badge: string; cta: string }> = {
  'ESG & Reporting':      { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700',   cta: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' },
  'Carbon & Compliance':  { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700',         cta: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600' },
  'Markets & Financing':  { dot: 'bg-purple-500',  badge: 'bg-purple-50 text-purple-700',     cta: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600' },
  'Green Assets':         { dot: 'bg-teal-500',    badge: 'bg-teal-50 text-teal-700',         cta: 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600' },
  'Platform':             { dot: 'bg-slate-600',   badge: 'bg-slate-100 text-slate-600',      cta: 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-700' },
};

function ServiceCardItem({ card, onClose }: { card: ServiceCard; onClose: () => void }) {
  const accent = CATEGORY_ACCENT[card.category];
  const ctaContent = (
    <>
      {card.ctaExternal ? (
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      ) : (
        <ArrowRight className="h-3 w-3 flex-shrink-0" />
      )}
      <span className="truncate">{card.ctaText}</span>
    </>
  );

  return (
    <div className="group flex flex-col gap-2.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200">
      {/* Category badge */}
      <span className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${accent.badge}`}>
        {card.category}
      </span>

      {/* Service name */}
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-snug">{card.name}</p>
        {card.subtitle && (
          <p className="mt-0.5 text-[11px] text-gray-400 leading-tight">{card.subtitle}</p>
        )}
      </div>

      {/* CTA */}
      {card.ctaExternal ? (
        <a
          href={card.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`mt-auto flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${accent.cta}`}
        >
          {ctaContent}
        </a>
      ) : (
        <Link
          href={card.ctaHref}
          onClick={onClose}
          className={`mt-auto flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${accent.cta}`}
        >
          {ctaContent}
        </Link>
      )}
    </div>
  );
}

function ServicesMegaMenu({ onClose }: { onClose: () => void }) {
  // Group cards by category preserving the declared order
  const grouped = SERVICE_CATEGORY_ORDER.reduce<Record<string, ServiceCard[]>>((acc, cat) => {
    const cards = SERVICES_MENU.filter((c) => c.category === cat);
    if (cards.length) acc[cat] = cards;
    return acc;
  }, {});

  return (
    <div className="w-[860px] max-w-[94vw] rounded-[1.75rem] border border-gray-100 bg-gray-50 shadow-2xl shadow-slate-900/12 overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3.5 rounded-t-[1.75rem]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Services</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lead-generation pathways — click any CTA to connect</p>
        </div>
        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-400">
          {SERVICES_MENU.length} Services
        </span>
      </div>

      {/* Category sections */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {Object.entries(grouped).map(([cat, cards]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`block h-1.5 w-1.5 rounded-full flex-shrink-0 ${CATEGORY_ACCENT[cat as ServiceCategory].dot}`} />
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500">{cat}</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {cards.map((card) => (
                <ServiceCardItem key={card.name} card={card} onClose={onClose} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Menu Item Row ────────────────────────────────────────────────────
function MegaMenuItemRow({
  item,
  onClose,
  compact = false,
}: {
  item: MegaMenuItem;
  onClose: () => void;
  compact?: boolean;
}) {
  const isClickable = Boolean(item.href);

  const inner = (
    <span className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 group/item ${
      isClickable
        ? 'hover:bg-gray-50 cursor-pointer'
        : 'cursor-default opacity-70'
    }`}>
      <span className="mt-0.5 flex-shrink-0">
        {item.external ? (
          <ExternalLink className="h-3.5 w-3.5 text-gray-300" />
        ) : isClickable ? (
          <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-primary-500 transition-colors" />
        ) : (
          <span className="block h-3.5 w-3.5" />
        )}
      </span>
      <span>
        <span className={`block text-sm font-medium leading-tight ${
          isClickable ? 'text-gray-800 group-hover/item:text-primary-700' : 'text-gray-500'
        }`}>
          {item.title}
        </span>
        {!compact && item.description && (
          <span className="block text-xs text-gray-400 mt-0.5 leading-relaxed">{item.description}</span>
        )}
      </span>
    </span>
  );

  if (!isClickable) return <div key={item.title}>{inner}</div>;

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href!} onClick={onClose}>
      {inner}
    </Link>
  );
}

// ─── Mobile Accordion ─────────────────────────────────────────────────────────
function MobileAccordion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 transition"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white"
          >
            <div className="px-3 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main SiteNavbar ──────────────────────────────────────────────────────────
export default function SiteNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'partners' | 'tools' | 'events' | 'services' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close everything on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Click-outside to close desktop dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openFor = useCallback((menu: 'partners' | 'tools' | 'events' | 'services') => setOpenMenu(menu), []);
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  return (
    <>
      {/* ── Desktop Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-[100] border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center justify-start min-w-0 flex-shrink-0">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src="/images/logo.jpeg"
                alt="Ploxi Earth"
                width={40}
                height={40}
                className="flex-shrink-0 rounded-full ring-2 ring-primary-500/10"
              />
              <div className="min-w-0">
                <span className="block truncate text-base font-bold text-gray-900 leading-tight">Ploxi Earth</span>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-gray-400 xl:block leading-tight">
                  Enterprise Sustainability &amp; Decarbonisation
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav
            ref={navRef}
            className="hidden lg:flex flex-shrink-0 items-center justify-center gap-0.5 xl:gap-1 relative"
            aria-label="Main navigation"
          >
            {/* Corporates */}
            <Link
              href="/corporate"
              className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                pathname === '/corporate'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
              }`}
            >
              Corporates
            </Link>

            {/* Services — lead-gen mega panel */}
            <NavDropdown
              label="Services"
              isOpen={openMenu === 'services'}
              onOpen={() => openFor('services')}
              onClose={closeMenu}
              side="left"
            >
              <ServicesMegaMenu onClose={closeMenu} />
            </NavDropdown>

            {/* Partners */}
            <NavDropdown
              label="Partners"
              isOpen={openMenu === 'partners'}
              onOpen={() => openFor('partners')}
              onClose={closeMenu}
            >
              <PartnersMegaMenu onClose={closeMenu} />
            </NavDropdown>

            {/* Tools */}
            <NavDropdown
              label="Tools"
              isOpen={openMenu === 'tools'}
              onOpen={() => openFor('tools')}
              onClose={closeMenu}
              side="right"
            >
              <ToolsMegaMenu onClose={closeMenu} />
            </NavDropdown>

            {/* Events */}
            <NavDropdown
              label="Events"
              isOpen={openMenu === 'events'}
              onOpen={() => openFor('events')}
              onClose={closeMenu}
            >
              <EventsMegaMenu onClose={closeMenu} />
            </NavDropdown>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex flex-shrink-0 items-center gap-2 xl:gap-3">
            {/* Book a Demo */}
            <a
              href="https://calendly.com/dhwani-sg/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex whitespace-nowrap items-center gap-2 px-3 py-2 text-sm xl:px-4"
            >
              <Calendar className="h-4 w-4" />
              Book a Demo
            </a>

            {/* Visit Ploxi Consult */}
            <a
              href="https://www.ploxiconsult.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap flex items-center gap-2 px-3 py-2 text-sm xl:px-4"
            >
              <Image
                src="/images/ploxiconsultlogo.webp"
                alt="Ploxi Consult"
                width={18}
                height={18}
                className="flex-shrink-0 rounded-sm object-contain"
              />
              Visit Ploxi Consult
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile Overlay ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[150] bg-slate-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-x-3 top-3 z-[160] max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[1.75rem] border border-white/60 bg-white/98 shadow-2xl backdrop-blur-xl lg:hidden"
              variants={mobileVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={34} height={34} className="rounded-full flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-tight">Ploxi Earth</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Enterprise Sustainability &amp; Decarbonisation</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-5 space-y-3">
                {/* Corporates — simple link */}
                <Link
                  href="/corporate"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 text-sm font-medium text-slate-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition"
                >
                  Corporates
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                {/* Services accordion — lead-gen cards */}
                <MobileAccordion label="Services">
                  <div className="space-y-2">
                    {SERVICE_CATEGORY_ORDER.map((cat) => {
                      const cards = SERVICES_MENU.filter((c) => c.category === cat);
                      if (!cards.length) return null;
                      return (
                        <div key={cat}>
                          <p className="px-1 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">{cat}</p>
                          <div className="space-y-1.5">
                            {cards.map((card) => {
                              const accent = CATEGORY_ACCENT[card.category];
                              const ctaEl = (
                                <>
                                  {card.ctaExternal ? (
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                  ) : (
                                    <ArrowRight className="h-3 w-3 flex-shrink-0" />
                                  )}
                                  <span className="truncate">{card.ctaText}</span>
                                </>
                              );
                              return (
                                <div key={card.name} className="rounded-xl border border-gray-100 bg-white p-3">
                                  <p className="text-xs font-semibold text-slate-800 leading-snug">{card.name}</p>
                                  {card.subtitle && (
                                    <p className="text-[10px] text-slate-400 mt-0.5">{card.subtitle}</p>
                                  )}
                                  {card.ctaExternal ? (
                                    <a
                                      href={card.ctaHref}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setMobileOpen(false)}
                                      className={`mt-2 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all ${accent.cta}`}
                                    >
                                      {ctaEl}
                                    </a>
                                  ) : (
                                    <Link
                                      href={card.ctaHref}
                                      onClick={() => setMobileOpen(false)}
                                      className={`mt-2 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all ${accent.cta}`}
                                    >
                                      {ctaEl}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </MobileAccordion>

                {/* Partners accordion */}
                <MobileAccordion label="Partners">
                  <div className="space-y-0.5">
                    {PARTNERS_MENU.map((item) => (
                      <MobileMenuItemRow key={item.title} item={item} onClose={() => setMobileOpen(false)} />
                    ))}
                  </div>
                </MobileAccordion>

                {/* Tools accordion */}
                <MobileAccordion label="Tools">
                  {TOOLS_MENU.map((col) => (
                    <div key={col.heading} className="mb-3 last:mb-0">
                      <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">{col.heading}</p>
                      <div className="space-y-0.5">
                        {col.items.map((item) => (
                          <MobileMenuItemRow key={item.title} item={item} onClose={() => setMobileOpen(false)} compact />
                        ))}
                      </div>
                    </div>
                  ))}
                </MobileAccordion>

                {/* Events accordion */}
                <MobileAccordion label="Events">
                  <div className="space-y-0.5">
                    {EVENTS_MENU.map((item) => (
                      <MobileMenuItemRow key={item.title} item={item} onClose={() => setMobileOpen(false)} />
                    ))}
                  </div>
                </MobileAccordion>

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-3 mt-1 border-t border-slate-100">
                  <a
                    href="https://calendly.com/dhwani-sg/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex w-full items-center justify-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    Book a Demo
                  </a>
                  <a
                    href="https://www.ploxiconsult.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex w-full items-center justify-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Image
                      src="/images/ploxiconsultlogo.webp"
                      alt="Ploxi Consult"
                      width={16}
                      height={16}
                      className="flex-shrink-0 rounded-sm object-contain"
                    />
                    Visit Ploxi Consult
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Mobile Menu Item Row ─────────────────────────────────────────────────────
function MobileMenuItemRow({
  item,
  onClose,
  compact = false,
}: {
  item: MegaMenuItem;
  onClose: () => void;
  compact?: boolean;
}) {
  const isClickable = Boolean(item.href);

  const inner = (
    <span className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
      isClickable
        ? 'font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-700 cursor-pointer'
        : 'text-slate-400 cursor-default'
    }`}>
      {isClickable ? (
        item.external ? (
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
        ) : (
          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
        )
      ) : (
        <span className="h-3.5 w-3.5 flex-shrink-0 flex items-center justify-center">
          <span className="block w-1 h-1 rounded-full bg-slate-300" />
        </span>
      )}
      <span>
        {item.title}
        {!compact && !isClickable && (
          <span className="ml-2 text-[10px] text-slate-300 font-normal">—</span>
        )}
      </span>
    </span>
  );

  if (!isClickable) return <div>{inner}</div>;

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href!} onClick={onClose}>
      {inner}
    </Link>
  );
}



