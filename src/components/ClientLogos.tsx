import React from 'react';
import { motion } from 'framer-motion';

interface ClientLogoItem {
  name: string;
  styleClass: string;
}

const CLIENT_LOGOS: ClientLogoItem[] = [
  { name: 'VOGUE', styleClass: 'font-serif tracking-[0.22em] text-xl md:text-2xl' },
  {
    name: 'NATIONAL GEOGRAPHIC',
    styleClass: 'font-sans font-bold tracking-[0.18em] text-sm md:text-base',
  },
  { name: 'TIME', styleClass: 'font-serif font-bold tracking-[0.14em] text-xl md:text-2xl' },
  {
    name: 'WALLPAPER*',
    styleClass: 'font-sans font-semibold tracking-[0.2em] text-base md:text-lg',
  },
  { name: 'KINFOLK', styleClass: 'font-serif tracking-[0.28em] text-lg md:text-xl' },
  { name: 'MONOCLE', styleClass: 'font-sans font-bold tracking-[0.22em] text-base md:text-lg' },
  { name: 'APERTURE', styleClass: 'font-serif italic tracking-[0.12em] text-xl md:text-2xl' },
];

export function ClientLogos() {
  const duplicatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      aria-label="Featured publications and partners"
      className="relative w-full bg-neutral-950 border-t border-b border-neutral-800 py-14 md:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="font-sans text-xs font-medium tracking-[0.26em] uppercase text-neutral-400"
        >
          Featured In
        </motion.h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex w-max items-center will-change-transform"
        >
          {duplicatedLogos.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="flex items-center gap-16 pr-16 flex-shrink-0"
            >
              <div
                tabIndex={0}
                className="h-9 flex items-center justify-center text-neutral-200 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 select-none cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm px-2"
              >
                <span className={`whitespace-nowrap ${logo.styleClass}`}>
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ClientLogos;
