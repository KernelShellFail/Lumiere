import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Camera } from 'lucide-react';

interface HoverRevealImageProps {
  src: string;
  alt: string;
  title: string;
  location: string;
  aspectClass?: string;
  layoutId?: string;
  onClick?: () => void;
  className?: string;
}

const imageZoomVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

const overlayVariants = {
  rest: { y: '100%' },
  hover: { y: '0%' },
};

export function HoverRevealImage({
  src,
  alt,
  title,
  location,
  aspectClass = 'aspect-[4/3]',
  layoutId,
  onClick,
  className = '',
}: HoverRevealImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-cursor="image"
      aria-label={onClick ? `Inspect ${title}, ${location}` : undefined}
      className={`group relative w-full ${aspectClass} overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800/80 ${
        onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200' : ''
      } ${className}`}
    >
      {/* Rule #2: NEVER animate <img> directly; wrap inside <motion.div> with overflow-hidden */}
      <motion.div
        layoutId={layoutId}
        variants={imageZoomVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="w-full h-full overflow-hidden will-change-transform"
      >
        {hasError ? (
          <div
            role="img"
            aria-label={alt}
            className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center"
          >
            <Camera className="w-6 h-6 text-neutral-600 mb-2" strokeWidth={1.25} />
            <span className="font-serif text-sm text-neutral-300">{title}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Sliding Text Overlay */}
      <motion.div
        variants={overlayVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pt-14 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-end justify-between gap-4 will-change-transform"
      >
        <div className="min-w-0">
          <h3 className="font-serif text-lg sm:text-xl text-white font-normal tracking-tight truncate">
            {title}
          </h3>
          <p className="mt-1 text-xs font-sans text-neutral-300 truncate">
            {location}
          </p>
        </div>

        <span className="w-8 h-8 rounded-full border border-white/30 bg-white/10 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
        </span>
      </motion.div>
    </motion.div>
  );
}

export default HoverRevealImage;
