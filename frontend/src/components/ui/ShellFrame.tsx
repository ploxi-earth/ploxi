'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SidebarControls = {
  close: () => void;
};

type MobileHeaderControls = SidebarControls & {
  open: () => void;
  isOpen: boolean;
};

interface ShellFrameProps {
  children: ReactNode;
  sidebar: (controls: SidebarControls) => ReactNode;
  mobileHeader: (controls: MobileHeaderControls) => ReactNode;
  rootClassName?: string;
  sidebarWidthClassName?: string;
  sidebarPanelClassName?: string;
  mainClassName?: string;
  contentClassName?: string;
  mobileHeaderClassName?: string;
}

export default function ShellFrame({
  children,
  sidebar,
  mobileHeader,
  rootClassName,
  sidebarWidthClassName = 'w-64',
  sidebarPanelClassName,
  mainClassName,
  contentClassName,
  mobileHeaderClassName,
}: ShellFrameProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className={cn('min-h-screen', rootClassName)}>
      <div className={cn('sticky top-0 z-30 lg:hidden', mobileHeaderClassName)}>
        {mobileHeader({ open, close, isOpen })}
      </div>

      <aside
        className={cn('fixed inset-y-0 left-0 z-30 hidden lg:flex', sidebarWidthClassName)}
      >
        <div className={cn('flex h-full w-full flex-col', sidebarPanelClassName)}>
          {sidebar({ close })}
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={cn(
                  'mobile-scroll flex h-full w-[min(21rem,86vw)] flex-col overflow-y-auto shadow-2xl',
                  sidebarPanelClassName
                )}
              >
                {sidebar({ close })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className={cn('min-h-screen', mainClassName)}>
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
