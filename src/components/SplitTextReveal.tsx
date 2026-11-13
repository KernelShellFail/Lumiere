import React from 'react';
import { motion } from 'framer-motion';

interface SplitTextRevealProps {
  text?: string;
  className?: string;
  eyebrow?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 20,
    },
  },
};

export function SplitTextReveal({
  text = "LET'S CREATE SOMETHING BEAUTIFUL",
  className = '',
  eyebrow,
}: SplitTextRevealProps) {
  const words = text.trim().split(/\s+/);

  return (
    <div className={`w-full ${className}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-5"
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        aria-label={text}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.98] sm:leading-[0.94] text-balance"
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom mr-[0.24em] last:mr-0 pb-[0.06em]"
          >
            <motion.span
              variants={wordVariants}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  );
}

export default SplitTextReveal;
