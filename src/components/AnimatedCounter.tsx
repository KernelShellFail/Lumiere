import React, { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      count.set(target);
      return;
    }

    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [isInView, target, duration, count]);

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline font-mono tabular-nums text-6xl md:text-8xl font-bold tracking-tight text-white ${className}`}
    >
      {prefix && <span>{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default AnimatedCounter;
