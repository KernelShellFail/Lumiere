import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { AnimatedUnderline } from './AnimatedUnderline';
import { useLenisScroll } from './LenisProvider';

export interface MobileNavItem {
  label: string;
  href: string;
}

const DEFAULT_NAV_ITEMS: MobileNavItem[] = [
  { label: 'Selected Works', href: '#gallery' },
  { label: 'Featured Series', href: '#featured-series' },
  { label: 'The Photographer', href: '#about' },
  { label: 'Services & Packages', href: '#services' },
  { label: 'Monographs', href: '#archive-index' },
  { label: 'Inquiries', href: '#contact' },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
    },
  },
};

interface MobileNavProps {
  items?: MobileNavItem[];
}

export function MobileNav({ items = DEFAULT_NAV_ITEMS }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollTo, stop, start } = useLenisScroll();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      stop();
    } else {
      document.body.classList.remove('overflow-hidden');
      start();
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      start();
    };
  }, [isOpen, stop, start]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsOpen(false);
    document.body.classList.remove('overflow-hidden');
    window.setTimeout(() => {
      scrollTo(href, { offset: -72 });
    }, 220);
  };

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-lg pt-safe-top pb-safe-bottom px-5 sm:px-6 flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar Inside Overlay */}
          <div className="h-16 flex items-center justify-between border-b border-neutral-800/80 shrink-0">
            <span className="font-serif text-xl tracking-tight text-white">
              Lumière
            </span>

            <motion.button
              type="button"
              onClick={() => setIsOpen(false)}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              aria-label="Close navigation menu"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </motion.button>
          </div>

          {/* Staggered Navigation Links */}
          <motion.nav
            aria-label="Mobile sections"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="my-auto py-6 flex flex-col items-start gap-1 w-full"
          >
            {items.map((item) => (
              <motion.div key={item.href} variants={itemVariants} className="max-w-full">
                <AnimatedUnderline
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-2xl sm:text-3xl font-light text-white py-3 sm:py-4 block"
                >
                  {item.label}
                </AnimatedUnderline>
              </motion.div>
            ))}
          </motion.nav>

          {/* Footer Note */}
          <div className="pt-5 pb-2 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-neutral-400 shrink-0">
            <span>Zurich · Kyoto</span>
            <span className="truncate">studio@lumiere-archive.example</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden flex items-center">
      {/* Hamburger Trigger */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="w-11 h-11 flex items-center justify-center rounded-sm text-neutral-100 bg-neutral-950/40 border border-white/10 hover:bg-neutral-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </motion.button>

      {/* Portal outside <header> so backdrop-filter/transform never clips fixed inset-0 */}
      {isMounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}

export default MobileNav;
