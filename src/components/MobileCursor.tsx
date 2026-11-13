import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDevice } from './DeviceProvider';
import { CustomCursor } from './CustomCursor';

export function MobileCursor() {
  const { isMobile, isTouch, prefersReducedMotion } = useDevice();

  useEffect(() => {
    const body = document.body;

    if (isMobile || isTouch || prefersReducedMotion) {
      body.classList.remove('has-custom-cursor');
      body.classList.add('is-touch-device');
    } else {
      body.classList.remove('is-touch-device');
      body.classList.add('has-custom-cursor');
    }

    return () => {
      body.classList.remove('has-custom-cursor');
      body.classList.remove('is-touch-device');
    };
  }, [isMobile, isTouch, prefersReducedMotion]);

  // Subtle haptic pulse on touch taps for interactive elements on mobile
  useEffect(() => {
    if (!isMobile && !isTouch) return;

    const handleTouchTap = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], input, select, textarea'
      );
      if (interactive && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(10);
        } catch {
          // Ignore browsers blocking vibrate before gesture unlock
        }
      }
    };

    window.addEventListener('pointerdown', handleTouchTap, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleTouchTap);
    };
  }, [isMobile, isTouch]);

  if (isMobile || isTouch || prefersReducedMotion) {
    return null;
  }

  return <CustomCursor />;
}

interface MobileTapFeedbackProps {
  children: React.ReactNode;
  className?: string;
}

/** Optional wrapper adding subtle tap scale feedback for touch targets */
export function MobileTapFeedback({
  children,
  className = '',
}: MobileTapFeedbackProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MobileCursor;
