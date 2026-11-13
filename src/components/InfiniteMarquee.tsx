import React from 'react';
import { motion } from 'framer-motion';

const DEFAULT_MARQUEE_ITEMS = [
  'AVAILABLE FOR WORLDWIDE TRAVEL',
  'WEDDINGS',
  'PORTRAITS',
  'EDITORIAL',
  'COMMERCIAL',
];

interface InfiniteMarqueeProps {
  items?: string[];
  separator?: string;
}

export function InfiniteMarquee({
  items = DEFAULT_MARQUEE_ITEMS,
  separator = '✦',
}: InfiniteMarqueeProps) {
  // Render items twice inside the moving flex track for a seamless -50% loop
  const duplicatedItems = [...items, ...items];

  return (
    <section
      aria-label="Studio availability and disciplines"
      className="relative w-full bg-neutral-900 border-y border-neutral-800/80 py-6 md:py-8 overflow-hidden select-none"
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex w-max items-center will-change-transform"
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center shrink-0"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-neutral-500 whitespace-nowrap px-5 md:px-7">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="text-xl sm:text-2xl md:text-3xl text-white shrink-0"
            >
              {separator}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default InfiniteMarquee;
