import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 26,
    restDelta: 0.001,
  });

  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1]);
  const thumbLeft = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const thumbOpacity = useTransform(smoothProgress, [0, 0.02, 0.99, 1], [0, 1, 1, 0.85]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none bg-neutral-900/40"
    >
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-full w-full bg-gradient-to-r from-neutral-400 to-white shadow-lg shadow-white/20 will-change-transform"
      />

      <motion.div
        style={{ left: thumbLeft, opacity: thumbOpacity }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        <motion.span
          animate={{ scale: [1, 1.35], opacity: [0.75, 1] }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 12,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="block w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"
        />
      </motion.div>
    </div>
  );
}

export default ScrollProgress;
