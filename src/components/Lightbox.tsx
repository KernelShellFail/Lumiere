import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '../data/photos';
import { ResilientImage } from './ResilientImage';

interface LightboxProps {
  photo: PhotoItem;
  source: 'gallery' | 'series';
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}

export function Lightbox({
  photo,
  source,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const isPortrait =
    source === 'gallery' &&
    (photo.aspectClass.includes('4/5') ||
      photo.aspectClass.includes('3/4') ||
      photo.aspectClass.includes('2/3'));

  const layoutId = source === 'gallery' ? `image-${photo.id}` : `series-${photo.id}`;
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
      className="fixed inset-0 z-50 flex flex-col justify-between bg-neutral-950/88 backdrop-blur-2xl p-4 sm:p-8"
    >
      {/* Top Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-4 max-w-6xl w-full mx-auto z-10"
      >
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="font-mono tabular-nums text-neutral-200">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
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

      {/* Center Morphing Image */}
      <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
        {/* Previous Button */}
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
          className="hidden sm:flex absolute left-2 md:left-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>

        {/* Morphing wrapper shares exact layoutId with grid thumbnail (Rule #1 & #2) */}
        <motion.div
          layoutId={layoutId}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={`relative overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800/80 shadow-2xl ${frameAspect} ${
            isPortrait
              ? 'h-[58vh] sm:h-[68vh] max-w-[88vw]'
              : 'w-[90vw] sm:w-[78vw] max-w-4xl max-h-[68vh]'
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

        {/* Next Button */}
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
          className="hidden sm:flex absolute right-2 md:right-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Bottom Editorial Caption & EXIF */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.08 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl w-full mx-auto pt-4 border-t border-neutral-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10"
      >
        <div className="max-w-xl">
          <h3 className="font-serif text-xl sm:text-2xl text-neutral-100 font-normal tracking-tight">
            {photo.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {photo.caption}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-xs text-neutral-400 shrink-0">
          <div className="text-neutral-200">
            <span>{photo.location}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">·</span>
            <span>{photo.year}</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-400 tabular-nums">
            <span>{photo.camera}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">/</span>
            <span>{photo.lens}</span>
            <span aria-hidden="true" className="mx-1.5 text-neutral-600">/</span>
            <span>{photo.exif}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
