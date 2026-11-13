import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { GALLERY_PHOTOS, PhotoCategory, PhotoItem } from '../data/photos';
import { ResilientImage } from './ResilientImage';
import { useDevice } from './DeviceProvider';

interface ResponsiveMasonryProps {
  onSelectPhoto: (photo: PhotoItem, source: 'gallery') => void;
  selectedId: string | null;
}

const CATEGORIES: PhotoCategory[] = ['All', 'Alpine', 'Woodland', 'Atmospheric'];

interface CardProps {
  photo: PhotoItem;
  onSelect: () => void;
  isHiddenByLightbox: boolean;
  itemYOffset: number;
}

function TiltPhotoCard({
  photo,
  onSelect,
  isHiddenByLightbox,
  itemYOffset,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spotPxX = useMotionValue(0);
  const spotPxY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 22 });
  const smoothSpotOpacity = useSpring(spotOpacity, { stiffness: 260, damping: 28 });

  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  const spotlightBackground = useMotionTemplate`radial-gradient(380px circle at ${spotPxX}px ${spotPxY}px, rgba(255, 255, 255, 0.16), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    mouseX.set(relX);
    mouseY.set(relY);
    spotPxX.set(e.clientX - rect.left);
    spotPxY.set(e.clientY - rect.top);
    spotOpacity.set(1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    spotOpacity.set(0);
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: itemYOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
      }}
      className="break-inside-avoid mb-4 lg:mb-6"
    >
      <div style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect();
            }
          }}
          role="button"
          tabIndex={0}
          data-cursor="view"
          aria-label={`Inspect ${photo.title}, ${photo.location}`}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-lg lg:rounded-xl"
        >
          {/* Wrapper handles layoutId & overflow (never animate <img> directly) */}
          <motion.div
            layoutId={`image-${photo.id}`}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={`relative w-full ${photo.aspectClass} overflow-hidden rounded-lg lg:rounded-xl bg-neutral-900 border border-neutral-800/70 ${
              isHiddenByLightbox ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <ResilientImage
              src={photo.src}
              alt={photo.alt}
              title={photo.title}
              className="w-full h-full object-cover"
            />

            <motion.div
              aria-hidden="true"
              style={{
                background: spotlightBackground,
                opacity: smoothSpotOpacity,
              }}
              className="pointer-events-none absolute inset-0 z-10"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-mono text-[11px] tracking-wider text-neutral-300 tabular-nums">
                {photo.exif}
              </span>
              <span className="text-[11px] tracking-[0.16em] uppercase text-neutral-200">
                {photo.year}
              </span>
            </div>
          </motion.div>

          <div className="mt-3.5 flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg text-neutral-100 font-normal tracking-tight leading-snug">
                {photo.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                <span>{photo.location}</span>
                <span aria-hidden="true" className="mx-1.5 text-neutral-600">
                  ·
                </span>
                <span>{photo.series}</span>
              </p>
            </div>
            <span className="font-mono text-[11px] text-neutral-500 tabular-nums shrink-0">
              {photo.plateNumber}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function MobilePhotoCard({
  photo,
  onSelect,
  isHiddenByLightbox,
  itemYOffset,
}: CardProps) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: itemYOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 130, damping: 18 },
        },
      }}
      className="break-inside-avoid mb-5"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Inspect ${photo.title}, ${photo.location}`}
        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-lg"
      >
        <motion.div
          className={`relative w-full ${photo.aspectClass} overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800/70 ${
            isHiddenByLightbox ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ResilientImage
            src={photo.src}
            alt={photo.alt}
            title={photo.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <div>
            <h3 className="font-serif text-base sm:text-lg text-neutral-100 font-normal leading-snug">
              {photo.title}
            </h3>
            <p className="mt-0.5 text-xs text-neutral-400">
              <span>{photo.location}</span>
              <span aria-hidden="true" className="mx-1.5 text-neutral-600">
                ·
              </span>
              <span>{photo.series}</span>
            </p>
          </div>
          <span className="font-mono text-[11px] text-neutral-500 tabular-nums shrink-0">
            {photo.plateNumber}
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function ResponsiveMasonry({
  onSelectPhoto,
  selectedId,
}: ResponsiveMasonryProps) {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('All');
  const { isMobile, isTouch } = useDevice();

  const useLightweightMobile = isMobile || isTouch;
  const staggerDelay = useLightweightMobile ? 0.05 : 0.1;
  const itemYOffset = useLightweightMobile ? 30 : 50;

  const filteredPhotos =
    activeCategory === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory);

  return (
    <section
      id="gallery"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Editorial Section Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 sm:pb-10 mb-10 sm:mb-14 border-b border-neutral-800/80">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
            01. Archive Plates
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-100 text-balance">
            Selected Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
            Medium-format studies photographed on location across alpine ridges, coastal twilight, and temperate woodland.
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter gallery by environment"
          className="inline-flex items-center gap-1 p-1 bg-neutral-900/90 border border-neutral-800 rounded-sm self-start md:self-auto overflow-x-auto max-w-full scrollbar-hide"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`relative px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 ${
                  isActive
                    ? 'text-neutral-950'
                    : 'text-neutral-400 hover:text-neutral-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeResponsiveGalleryFilter"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 bg-neutral-100 rounded-sm z-0"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Masonry Columns */}
      <motion.div
        key={`${activeCategory}-${useLightweightMobile ? 'm' : 'd'}`}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-6"
      >
        {filteredPhotos.map((photo) =>
          useLightweightMobile ? (
            <MobilePhotoCard
              key={photo.id}
              photo={photo}
              itemYOffset={itemYOffset}
              isHiddenByLightbox={selectedId === photo.id}
              onSelect={() => onSelectPhoto(photo, 'gallery')}
            />
          ) : (
            <TiltPhotoCard
              key={photo.id}
              photo={photo}
              itemYOffset={itemYOffset}
              isHiddenByLightbox={selectedId === photo.id}
              onSelect={() => onSelectPhoto(photo, 'gallery')}
            />
          )
        )}
      </motion.div>
    </section>
  );
}

export default ResponsiveMasonry;
