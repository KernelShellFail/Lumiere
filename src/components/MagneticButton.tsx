import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'style' | 'ref'> {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  maxOffset?: number;
  className?: string;
}

export function MagneticButton({
  children,
  radius = 110,
  strength = 0.3,
  maxOffset = 26,
  className = '',
  type = 'button',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = buttonRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const effectiveRadius = Math.max(radius, rect.width / 2 + 44);

      if (distance < effectiveRadius) {
        const pullX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength));
        const pullY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength));
        x.set(pullX);
        y.set(pullY);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeaveWindow = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [radius, strength, maxOffset, x, y]);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-medium tracking-wide whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default MagneticButton;
