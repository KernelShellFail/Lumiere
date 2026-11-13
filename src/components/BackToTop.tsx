import React, { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  onScrollToTop?: () => void;
}

export function BackToTop({
  threshold = 500,
  onScrollToTop,
}: BackToTopProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > threshold);
  });

  const handleClick = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="back-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3"
        >
          <AnimatePresence>
            {isHovered && (
              <motion.span
                key="back-to-top-tooltip"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="pointer-events-none px-3 py-1.5 text-xs font-medium text-neutral-100 bg-neutral-900/95 border border-neutral-800 rounded-sm shadow-lg whitespace-nowrap"
              >
                Back to Top
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            title="Back to Top"
            aria-label="Back to Top"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="w-12 h-12 rounded-full bg-white text-black border border-neutral-200 shadow-lg shadow-black/20 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
