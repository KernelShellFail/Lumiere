import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { AnimatedUnderline } from './AnimatedUnderline';
import { MobileNav } from './MobileNav';
import { useLenisScroll } from './LenisProvider';

export function Navbar() {
  const { scrollTo } = useLenisScroll();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 48);
  });

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>,
    target: string
  ) => {
    e.preventDefault();
    scrollTo(target, { offset: -24 });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-neutral-950/90 backdrop-blur-md mobile-reduce-blur border-b border-neutral-800/70'
          : 'bg-gradient-to-b from-neutral-950/75 via-neutral-950/30 to-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="font-serif text-xl tracking-tight text-neutral-100 py-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm"
        >
          Lumière
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-normal text-neutral-300"
        >
          <AnimatedUnderline
            href="#gallery"
            onClick={(e) => handleNavClick(e, '#gallery')}
            className="hover:text-neutral-100"
          >
            Works
          </AnimatedUnderline>
          <AnimatedUnderline
            href="#featured-series"
            onClick={(e) => handleNavClick(e, '#featured-series')}
            className="hover:text-neutral-100"
          >
            Series
          </AnimatedUnderline>
          <AnimatedUnderline
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className="hover:text-neutral-100"
          >
            About
          </AnimatedUnderline>
          <AnimatedUnderline
            href="#services"
            onClick={(e) => handleNavClick(e, '#services')}
            className="hover:text-neutral-100"
          >
            Services
          </AnimatedUnderline>
          <AnimatedUnderline
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hover:text-neutral-100"
          >
            Inquiries
          </AnimatedUnderline>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => scrollTo('#contact', { offset: -24 })}
            className="hidden md:inline-flex px-4 py-2 text-xs font-medium tracking-wide text-neutral-950 bg-neutral-100 hover:bg-white rounded-sm whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Book Commission
          </motion.button>

          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
