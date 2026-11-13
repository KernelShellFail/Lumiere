import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FEATURED_SERIES_PHOTOS, PhotoItem } from '../data/photos';
import { HoverRevealImage } from './HoverRevealImage';

interface HorizontalScrollProps {
  onSelectPhoto: (photo: PhotoItem, source: 'series') => void;
  selectedId: string | null;
}

export function HorizontalScroll({ onSelectPhoto, selectedId }: HorizontalScrollProps) {
  const targetRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Map vertical scroll progress across the 300vh section to horizontal track translation
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  return (
    <section
      id="featured-series"
      ref={targetRef}
      className="relative h-[300vh] bg-neutral-950 border-t border-neutral-900"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Section Title Header */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-10 mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-2">
              02. Exhibition Monograph
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-neutral-100">
              Featured Series
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 max-w-sm leading-relaxed">
            A continuous visual sequence tracing atmospheric light across six northern latitudes.
          </p>
        </div>

        {/* Horizontally Panning Track */}
        <motion.div
          style={{ x }}
          className="flex items-center gap-6 md:gap-10 pl-6 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] pr-[20vw] will-change-transform"
        >
          {FEATURED_SERIES_PHOTOS.map((photo, index) => (
            <motion.article
              key={photo.id}
              className={`shrink-0 w-[78vw] sm:w-[54vw] md:w-[40vw] lg:w-[34vw] ${
                selectedId === photo.id ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <HoverRevealImage
                src={photo.src}
                alt={photo.alt}
                title={photo.title}
                location={photo.location}
                aspectClass="aspect-[4/3]"
                layoutId={`series-${photo.id}`}
                onClick={() => onSelectPhoto(photo, 'series')}
              />

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="text-xs text-neutral-400">
                  <span>{photo.series}</span>
                  <span aria-hidden="true" className="mx-1.5 text-neutral-600">·</span>
                  <span className="font-mono tabular-nums">{photo.exif}</span>
                </p>
                <span className="font-mono text-xs text-neutral-500 tabular-nums shrink-0">
                  0{index + 1} / 0{FEATURED_SERIES_PHOTOS.length}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Scroll Progress Track */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-10 mt-10 flex items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 whitespace-nowrap shrink-0">
            Sequence Progress
          </span>
          <div className="relative h-px flex-1 bg-neutral-800 overflow-hidden">
            <motion.div
              style={{ scaleX: smoothProgress, transformOrigin: 'left center' }}
              className="absolute inset-0 bg-neutral-200"
            />
          </div>
          <span className="font-mono text-[11px] text-neutral-500 tabular-nums whitespace-nowrap shrink-0">
            Scroll to pan
          </span>
        </div>
      </div>
    </section>
  );
}
