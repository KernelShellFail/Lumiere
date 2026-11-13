import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';

const PORTRAIT_IMAGE_URL =
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1000&q=85';

const EDITORIAL_PARAGRAPHS = [
  'Working predominantly in high-altitude basins and coastal archipelagos, Julian Vance approaches landscape photography as an exercise in patience rather than spectacle. Each frame begins days before a shutter is released—studying topographic light angles, barometric shifts, and the brief threshold when atmospheric haze softens horizon lines.',
  'Trained originally in architectural drafting in Zurich, his compositions favor disciplined geometry: ridged silhouettes, vertical stands of old-growth cedar, and the quiet tension between shadow density and specular mist. Rather than chasing dramatic storm fronts, the archive concentrates on the suspended stillness that follows weather.',
  'Every plate in this monograph was exposed on medium-format digital backs paired with manual-focus primes. Long tripod exposures allow water, drifting cloud strata, and alpine snowfields to register as unbroken tonal planes without artificial saturation.',
  'Selected editions are archived and hand-printed in Zurich on heavy Hahnemühle cotton rag, preserving subtle shadow transitions for museum collections and private architectural commissions worldwide.',
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [imageError, setImageError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Slowly scale up (1 -> 1.15) and drift slightly on Y as the user scrolls past
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '6%']);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-neutral-950 border-t border-neutral-800/80 py-24 md:py-36 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Side: Sticky Portrait Image */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div
            data-cursor="image"
            className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800/80"
          >
            {/* Rule #2: NEVER animate <img> directly; wrap inside <motion.div> with overflow-hidden */}
            <motion.div
              style={{ scale: imageScale, y: imageY }}
              className="w-full h-full overflow-hidden will-change-transform"
            >
              {imageError ? (
                <div
                  role="img"
                  aria-label="Portrait of photographer Julian Vance"
                  className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-8 text-center"
                >
                  <Camera className="w-7 h-7 text-neutral-600 mb-3" strokeWidth={1.25} />
                  <span className="font-serif text-base text-neutral-200">Julian Vance</span>
                  <span className="text-xs text-neutral-500 mt-1">Zurich Studio Portrait</span>
                </div>
              ) : (
                <img
                  src={PORTRAIT_IMAGE_URL}
                  alt="Photographer Julian Vance working with a camera in natural studio light"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-4 text-xs text-neutral-400">
            <span>Julian Vance · Zurich & Kyoto</span>
            <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
              Medium Format Practice
            </span>
          </div>
        </div>

        {/* Right Side: Scroll-Revealed Editorial Text Column */}
        <div className="lg:col-span-7 lg:pl-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 110, damping: 18 }}
            className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-4"
          >
            03. Biography & Approach
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white text-balance leading-[1.08] mb-12"
          >
            The Photographer
          </motion.h2>

          <div className="space-y-10 max-w-2xl">
            {EDITORIAL_PARAGRAPHS.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  type: 'spring',
                  stiffness: 95,
                  damping: 18,
                }}
                className="text-base md:text-lg leading-[1.75] text-neutral-300 font-normal"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Primary System</p>
              <p className="mt-1.5 text-sm text-neutral-200">Hasselblad X2D 100C</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Selected Exhibitions</p>
              <p className="mt-1.5 text-sm text-neutral-200">Basel · Venice · Kyoto</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Print Editions</p>
              <p className="mt-1.5 text-sm text-neutral-200 font-mono tabular-nums">
                Signed Ed. of 12
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
