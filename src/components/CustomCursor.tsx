import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorContext = 'default' | 'button' | 'image';

const CURSOR_VARIANTS = {
  default: {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: 'rgba(255, 255, 255, 0)',
    borderWidth: '1px',
  },
  button: {
    scale: 2,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: 'rgba(255, 255, 255, 0)',
    borderWidth: '1px',
  },
  image: {
    scale: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: '1px',
  },
};

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorContext, setCursorContext] = useState<CursorContext>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lag effect with requested spring physics
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      setIsDesktop(false);
      return;
    }

    setIsDesktop(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setCursorContext('default');
        return;
      }

      if (
        target.closest('[data-cursor="image"]') ||
        target.closest('[data-cursor="view"]') ||
        target.tagName.toLowerCase() === 'img'
      ) {
        setCursorContext('image');
        return;
      }

      if (target.closest('button, a, [role="button"], input, textarea')) {
        setCursorContext('button');
        return;
      }

      setCursorContext('default');
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.15 }}
      className="custom-cursor-dot fixed top-0 left-0 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <motion.div
        variants={CURSOR_VARIANTS}
        animate={cursorContext}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-3 h-3 bg-white rounded-full border border-white/0"
      />
    </motion.div>
  );
}

interface CursorInteractiveProps {
  children: React.ReactNode;
  type: 'image' | 'button';
  className?: string;
}

/** Optional Framer Motion whileHover wrapper for explicit context tagging */
export function CursorTarget({ children, type, className = '' }: CursorInteractiveProps) {
  return (
    <motion.div
      data-cursor={type}
      whileHover={{ scale: type === 'image' ? 1.01 : 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default CustomCursor;
