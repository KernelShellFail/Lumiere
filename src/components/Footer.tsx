import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Twitter, Mail, Globe, ArrowUp } from 'lucide-react';

const FOOTER_BG_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80';

const HEADING_WORDS = ['YOUR', 'STORY,', 'CAPTURED'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const wordVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 110,
      damping: 20,
    },
  },
};

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
  },
  {
    label: 'Twitter',
    href: 'https://x.com',
    icon: Twitter,
  },
  {
    label: 'Email Studio',
    href: 'mailto:studio@lumiere-archive.example',
    icon: Mail,
  },
  {
    label: 'Journal & Press',
    href: '#gallery',
    icon: Globe,
  },
];

interface FooterProps {
  onScrollToTop?: () => void;
}

export function Footer({ onScrollToTop }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [bgError, setBgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '6%']);

  const handleBackToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black text-neutral-400 overflow-hidden border-t border-neutral-900"
    >
      {/* Parallax Background Image Wrapper (Rule #3: never animate <img> directly) */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY, scale: 1.1 }}
        className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      >
        {!bgError && (
          <img
            src={FOOTER_BG_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="w-full h-full object-cover blur-sm opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-neutral-950/90" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-12">
        {/* Closing Statement */}
        <div className="pb-20 border-b border-neutral-800/80">
          <p className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-6">
            Lumière Archive · Julian Vance
          </p>

          <motion.h2
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            aria-label="YOUR STORY, CAPTURED"
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-white leading-[0.95]"
          >
            {HEADING_WORDS.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className="inline-block overflow-hidden align-bottom mr-[0.24em] last:mr-0 pb-[0.06em]"
              >
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <p className="text-sm md:text-base text-neutral-400 max-w-md leading-relaxed font-sans">
              Medium-format commissions, editorial monographs, and signed museum pigment prints from Zurich and Kyoto.
            </p>

            {/* Social Icons with Spring Hover Scale */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                const isExternal = item.href.startsWith('http');
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={item.label}
                    whileHover={{ scale: 1.2, color: '#ffffff' }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="w-11 h-11 rounded-full border border-neutral-800 bg-neutral-950/70 flex items-center justify-center text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.6} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2025 Lumière Studio · Julian Vance. All rights reserved.</p>

          <motion.button
            type="button"
            onClick={handleBackToTop}
            whileHover={{ color: '#ffffff' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-neutral-300 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            <span>Back to Top</span>
            <motion.span
              aria-hidden="true"
              animate={{ y: [0, -5] }}
              transition={{
                type: 'spring',
                stiffness: 160,
                damping: 12,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="inline-flex"
            >
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
