import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Camera } from 'lucide-react';

interface CursorImagePreviewProps {
  imageUrl: string;
  alt?: string;
  children: React.ReactNode;
  className?: string;
}

export function CursorImagePreview({
  imageUrl,
  alt = 'Project preview',
  children,
  className = '',
}: CursorImagePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [hasError, setHasError] = useState(false);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsFinePointer(fine && !reducedMotion);
  }, []);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer) return;
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer) return;
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {children}

      <AnimatePresence>
        {isFinePointer && isHovered && (
          <motion.div
            key="cursor-image-preview"
            aria-hidden="true"
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="pointer-events-none fixed top-0 left-0 z-[90] w-40 h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-neutral-900 will-change-transform"
          >
            {/* Rule: Never animate <img> directly; parent <motion.div> handles scale/opacity */}
            {hasError ? (
              <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                <Camera className="w-6 h-6 text-neutral-500" strokeWidth={1.25} />
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={alt}
                referrerPolicy="no-referrer"
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CursorImagePreview;
