import React, { useEffect } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '../data/photos';
import { ResilientImage } from './ResilientImage';
import { useDevice } from './DeviceProvider';

interface ResponsiveLightboxProps {
  photo: PhotoItem;
  source: 'gallery' | 'series';
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}

function MobileLightboxView({
  photo,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: Omit<ResponsiveLightboxProps, 'source'>) {
  const dragY = useMotionValue(0);

  const handleVerticalDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleHorizontalDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -55 || info.velocity.x < -400) {
      onNext();
    } else if (info.offset.x > 55 || info.velocity.x > 400) {
      onPrev();
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} full-screen plate`}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.5}
      style={{ y: dragY }}
      onDragEnd={handleVerticalDragEnd}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="fixed inset-0 z-[120] bg-black pt-safe-top pb-safe-bottom px-4 flex flex-col justify-between overflow-hidden touch-none"
    >
      {/* Top Drag Indicator & Header */}
      <div className="flex flex-col items-center pt-1 pb-3">
        {/* Three-line / bar drag handle */}
        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-1 py-2 cursor-grab active:cursor-grabbing"
        >
          <span className="w-12 h-1 bg-white/50 rounded-full" />
          <span className="w-8 h-[2px] bg-white/25 rounded-full" />
          <span className="w-5 h-[2px] bg-white/15 rounded-full" />
        </div>

        <div className="w-full flex items-center justify-between pt-1">
          <span className="font-mono text-xs text-neutral-400 tabular-nums">
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(totalCount).padStart(2, '0')}
          </span>

          <motion.button
            type="button"
            onClick={onClose}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            aria-label="Close lightbox"
            className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </motion.button>
        </div>
      </div>

      {/* Swipeable Image Stage */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 my-2">
        <motion.div
          key={photo.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          onDragEnd={handleHorizontalDragEnd}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={`relative w-full ${photo.aspectClass} max-h-[60vh] overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800`}
        >
          <ResilientImage
            src={photo.src}
            alt={photo.alt}
            title={photo.title}
            loading="eager"
            className="w-full h-full object-cover pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Mobile Controls & Caption */}
      <div className="pt-3 pb-2 border-t border-neutral-800/80 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl text-white font-normal truncate">
              {photo.title}
            </h3>
            <p className="mt-0.5 text-xs text-neutral-400">
              {photo.location} · {photo.year}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              onClick={onPrev}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous photograph"
              className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <motion.button
              type="button"
              onClick={onNext}
              whileTap={{ scale: 0.9 }}
              aria-label="Next photograph"
              className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>

        <p className="font-mono text-[11px] text-neutral-500 tabular-nums">
          {photo.camera} / {photo.lens} / {photo.exif}
        </p>
      </div>
    </motion.div>
  );
}

function DesktopLightboxView({
  photo,
  source,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: ResponsiveLightboxProps) {
  const isPortrait =
    source === 'gallery' &&
    (photo.aspectClass.includes('4/5') ||
      photo.aspectClass.includes('3/4') ||
      photo.aspectClass.includes('2/3'));

  const layoutId =
    source === 'gallery' ? `image-${photo.id}` : `series-${photo.id}`;
  const frameAspect = source === 'series' ? 'aspect-[4/3]' : photo.aspectClass;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} full-screen plate`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-neutral-950/88 backdrop-blur-2xl p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-4 max-w-6xl w-full mx-auto z-10"
      >
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="font-mono tabular-nums text-neutral-200">
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(totalCount).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="text-neutral-600">
            ·
          </span>
          <span>{photo.series}</span>
        </div>

        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          aria-label="Close lightbox (Escape)"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
        >
          <span>Close</span>
          <X className="w-4 h-4" strokeWidth={1.5} />
        </motion.button>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          aria-label="Previous photograph"
          className="flex absolute left-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>

        <motion.div
          layoutId={layoutId}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={`relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 shadow-2xl ${frameAspect} ${
            isPortrait
              ? 'h-[68vh] max-w-[88vw]'
              : 'w-[78vw] max-w-4xl max-h-[68vh]'
          }`}
        >
          <ResilientImage
            src={photo.src}
            alt={photo.alt}
            title={photo.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          aria-label="Next photograph"
          className="flex absolute right-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.08 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl w-full mx-auto pt-4 border-t border-neutral-800/80 flex flex-row items-end justify-between gap-4 z-10"
      >
        <div className="max-w-xl">
          <h3 className="font-serif text-2xl text-neutral-100 font-normal tracking-tight">
            {photo.title}
          </h3>
          <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
            {photo.caption}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-neutral-400 shrink-0">
          <div className="text-neutral-200">
            <span>{photo.location}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">
              ·
            </span>
            <span>{photo.year}</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-400 tabular-nums">
            <span>{photo.camera}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">
              /
            </span>
            <span>{photo.lens}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">
              /
            </span>
            <span>{photo.exif}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ResponsiveLightbox(props: ResponsiveLightboxProps) {
  const { isMobile } = useDevice();
  const { onClose, onPrev, onNext } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (isMobile) {
    return (
      <MobileLightboxView
        photo={props.photo}
        onClose={props.onClose}
        onPrev={props.onPrev}
        onNext={props.onNext}
        currentIndex={props.currentIndex}
        totalCount={props.totalCount}
      />
    );
  }

  return <DesktopLightboxView {...props} />;
}

export default ResponsiveLightbox;
