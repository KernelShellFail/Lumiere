import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  brandName?: string;
  subtitle?: string;
  onComplete?: () => void;
}

export function PageLoader({
  brandName = 'LUMIÈRE',
  subtitle = 'Editorial Archive',
  onComplete,
}: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showWordmark, setShowWordmark] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setShowWordmark(false);
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Fade out centered wordmark slightly before curtain begins sliding up
    const wordmarkTimer = window.setTimeout(() => {
      setShowWordmark(false);
    }, 320);

    // Trigger curtain exit slide
    const exitTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 480);

    return () => {
      window.clearTimeout(wordmarkTimer);
      window.clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="page-loader-curtain"
          initial={{ y: '0%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 1.5,
            ease: [0.76, 0, 0.24, 1],
          }}
          aria-hidden="true"
          className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center pointer-events-none select-none will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: showWordmark ? 1 : 0,
              y: showWordmark ? 0 : -8,
            }}
            transition={{
              type: 'spring',
              stiffness: 160,
              damping: 22,
            }}
            className="text-center px-6"
          >
            <span className="block font-serif text-3xl sm:text-4xl tracking-[0.22em] text-white font-normal">
              {brandName}
            </span>
            <span className="mt-3 block text-[11px] tracking-[0.28em] uppercase text-neutral-400">
              {subtitle}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageLoader;
