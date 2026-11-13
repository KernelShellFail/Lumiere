import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FEATURED_SERIES_PHOTOS, PhotoItem } from '../data/photos';
import { HoverRevealImage } from './HoverRevealImage';
import { ResilientImage } from './ResilientImage';
import { useDevice } from './DeviceProvider';

interface ResponsiveHorizontalScrollProps {
  onSelectPhoto: (photo: PhotoItem, source: 'series') => void;
  selectedId: string | null;
}

function DesktopHorizontalScroll({
  onSelectPhoto,
  selectedId,
}: ResponsiveHorizontalScrollProps) {
  const targetRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
  });

  return (
    <section
      id="featured-series"
      ref={targetRef}
      className="relative h-[300vh] bg-neutral-950 border-t border-neutral-900"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
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

        <motion.div
          style={{ x }}
          className="flex items-center gap-8 pl-6 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] pr-[20vw] will-change-transform"
        >
          {FEATURED_SERIES_PHOTOS.map((photo, index) => (
            <motion.article
              key={photo.id}
              className={`shrink-0 w-[44vw] lg:w-[34vw] ${
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
                  <span aria-hidden="true" className="mx-1.5 text-neutral-600">
                    ·
                  </span>
                  <span className="font-mono tabular-nums">{photo.exif}</span>
                </p>
                <span className="font-mono text-xs text-neutral-500 tabular-nums shrink-0">
                  0{index + 1} / 0{FEATURED_SERIES_PHOTOS.length}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

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

function MobileHorizontalGallery({
  onSelectPhoto,
}: Pick<ResponsiveHorizontalScrollProps, 'onSelectPhoto'>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = FEATURED_SERIES_PHOTOS.length;

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const viewportCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    Array.from(el.children).forEach((child, idx) => {
      const node = child as HTMLElement;
      const childCenter = node.offsetLeft + node.offsetWidth / 2;
      const dist = Math.abs(viewportCenter - childCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  };

  const scrollToSlide = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clampedIndex = Math.max(0, Math.min(totalSlides - 1, index));
    const targetNode = el.children[clampedIndex] as HTMLElement | undefined;
    if (!targetNode) return;

    const targetLeft =
      targetNode.offsetLeft - (el.clientWidth - targetNode.clientWidth) / 2;

    el.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
    setActiveIndex(clampedIndex);
  };

  const progressRatio = (activeIndex + 1) / totalSlides;

  return (
    <section
      id="featured-series"
      className="relative bg-neutral-950 border-t border-neutral-900 py-16"
    >
      <div className="px-4 sm:px-6 mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-2">
            02. Exhibition Monograph
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-100">
            Featured Series
          </h2>
          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
            Swipe or use controls below to step through each plate.
          </p>
        </div>
      </div>

      {/* Native Touch Scroll-Snap Track */}
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-2"
        >
          {FEATURED_SERIES_PHOTOS.map((photo, index) => (
            <motion.article
              key={photo.id}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              onClick={() => onSelectPhoto(photo, 'series')}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${photo.title}`}
              className="w-[82vw] flex-shrink-0 snap-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
            >
              <motion.div className="w-full aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800/80">
                <ResilientImage
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="mt-3 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-neutral-100 font-normal truncate">
                    {photo.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-400 truncate">
                    {photo.location}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 tabular-nums shrink-0">
                  0{index + 1} / 0{totalSlides}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Bar: Prev / Progress / Next */}
      <div className="mt-6 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            onClick={() => scrollToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            aria-label="Previous series photograph"
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-100 flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.6} />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => scrollToSlide(activeIndex + 1)}
            disabled={activeIndex === totalSlides - 1}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            aria-label="Next series photograph"
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-100 flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.6} />
          </motion.button>
        </div>

        {/* Continuous Progress Bar + Counter */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative h-0.5 flex-1 bg-neutral-800 overflow-hidden rounded-full">
            <motion.div
              animate={{ scaleX: progressRatio }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              style={{ transformOrigin: 'left center' }}
              className="absolute inset-0 bg-neutral-100"
            />
          </div>
          <span className="font-mono text-xs text-neutral-300 tabular-nums shrink-0">
            0{activeIndex + 1} / 0{totalSlides}
          </span>
        </div>
      </div>
    </section>
  );
}

export function ResponsiveHorizontalScroll({
  onSelectPhoto,
  selectedId,
}: ResponsiveHorizontalScrollProps) {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <MobileHorizontalGallery onSelectPhoto={onSelectPhoto} />;
  }

  return (
    <DesktopHorizontalScroll
      onSelectPhoto={onSelectPhoto}
      selectedId={selectedId}
    />
  );
}

export default ResponsiveHorizontalScroll;
