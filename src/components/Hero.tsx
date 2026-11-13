import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { HERO_PHOTO } from '../data/photos';
import { ResilientImage } from './ResilientImage';
import { MagneticButton } from './MagneticButton';
import { useLenisScroll } from './LenisProvider';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollTo } = useLenisScroll();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Background scales from 1 to 1.2 and drifts slower than scroll
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  // Foreground typography moves up faster and fades out cleanly
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-48%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center"
    >
      {/* Parallax Background Wrapper (Rule #1: never animate <img> directly) */}
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
      >
        <ResilientImage
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          title={HERO_PHOTO.title}
          loading="eager"
          className="w-full h-full object-cover"
        />
        {/* Subtle tonal gradient for bottom legibility without dulling the alpine highlights */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-neutral-950/35 via-transparent to-neutral-950/80"
        />
      </motion.div>

      {/* Foreground Title with mix-blend-difference */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center mix-blend-difference text-white select-none will-change-transform"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 0.1 }}
          className="text-xs md:text-sm font-medium tracking-[0.28em] uppercase mb-5 text-neutral-200"
        >
          Basiturraza Taji · Monograph 2024—2025
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[1.02] sm:leading-[0.95] text-balance"
        >
          LUMIÈRE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.35 }}
          className="mt-6 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed tracking-wide text-neutral-200"
        >
          Quiet studies in high-altitude stillness, temperate forest light, and northern horizons.
        </motion.p>
      </motion.div>

      {/* Magnetic Primary CTA */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.45 }}
        className="relative z-10 mt-10"
      >
        <MagneticButton
          onClick={() => scrollTo('#gallery', { offset: -24 })}
          className="text-xs uppercase tracking-[0.18em] px-7 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
        >
          View Gallery
        </MagneticButton>
      </motion.div>

      {/* Bottom Scroll Trigger */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 inset-x-0 z-10 flex justify-center"
      >
        <motion.button
          type="button"
          onClick={() => scrollTo('#gallery', { offset: -24 })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: 3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.55 }}
          aria-label="Scroll to selected works"
          className="group flex flex-col items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm"
        >
          <span>Scroll</span>
          <ArrowDown className="w-4 h-4 text-neutral-400 group-hover:text-white" strokeWidth={1.5} />
        </motion.button>
      </motion.div>
    </section>
  );
}
