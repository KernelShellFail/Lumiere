import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import Lenis from 'lenis';
import { frame, cancelFrame } from 'framer-motion';
import { useDevice } from './DeviceProvider';

interface LenisContextValue {
  scrollTo: (target: string | number, options?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useLenisScroll() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const { isMobile, isTouch, prefersReducedMotion } = useDevice();

  useEffect(() => {
    if (isMobile || isTouch || prefersReducedMotion) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isMobile, isTouch, prefersReducedMotion]);

  const scrollTo = useCallback(
    (target: string | number, options?: { offset?: number; duration?: number }) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          offset: options?.offset ?? 0,
          duration: options?.duration ?? 1.2,
        });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          const top =
            el.getBoundingClientRect().top +
            window.scrollY +
            (options?.offset ?? -64);
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      }
    },
    []
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return (
    <LenisContext.Provider value={{ scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
