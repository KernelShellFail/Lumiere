import { useEffect, useState } from 'react';

const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export interface DeviceDetectionState {
  isMobile: boolean;
  isTouch: boolean;
  prefersReducedMotion: boolean;
}

function evaluateDevice(breakpoint: number): DeviceDetectionState {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTouch: false,
      prefersReducedMotion: false,
    };
  }

  const matchesViewport = window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hasTouchEvent =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = MOBILE_UA_REGEX.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isTouch = hasTouchEvent && (hasCoarsePointer || isMobileUserAgent || matchesViewport);
  const isMobile = matchesViewport || isMobileUserAgent || (hasTouchEvent && hasCoarsePointer);

  return {
    isMobile,
    isTouch,
    prefersReducedMotion,
  };
}

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    evaluateDevice(breakpoint).isMobile
  );

  useEffect(() => {
    let debounceTimer: number | undefined;

    const updateState = () => {
      setIsMobile(evaluateDevice(breakpoint).isMobile);
    };

    const handleDebouncedResize = () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(updateState, 150);
    };

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    updateState();

    window.addEventListener('resize', handleDebouncedResize, { passive: true });
    window.addEventListener('orientationchange', handleDebouncedResize, {
      passive: true,
    });
    mediaQuery.addEventListener('change', updateState);

    return () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      window.removeEventListener('resize', handleDebouncedResize);
      window.removeEventListener('orientationchange', handleDebouncedResize);
      mediaQuery.removeEventListener('change', updateState);
    };
  }, [breakpoint]);

  return isMobile;
}

export function useDeviceDetection(breakpoint = 768): DeviceDetectionState {
  const [state, setState] = useState<DeviceDetectionState>(() =>
    evaluateDevice(breakpoint)
  );

  useEffect(() => {
    let debounceTimer: number | undefined;

    const updateState = () => {
      setState(evaluateDevice(breakpoint));
    };

    const handleDebouncedResize = () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(updateState, 150);
    };

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    updateState();

    window.addEventListener('resize', handleDebouncedResize, { passive: true });
    window.addEventListener('orientationchange', handleDebouncedResize, {
      passive: true,
    });
    mediaQuery.addEventListener('change', updateState);
    motionQuery.addEventListener('change', updateState);

    return () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }
      window.removeEventListener('resize', handleDebouncedResize);
      window.removeEventListener('orientationchange', handleDebouncedResize);
      mediaQuery.removeEventListener('change', updateState);
      motionQuery.removeEventListener('change', updateState);
    };
  }, [breakpoint]);

  return state;
}

export default useIsMobile;
