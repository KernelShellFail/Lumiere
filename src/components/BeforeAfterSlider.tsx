import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate,
} from 'framer-motion';
import { GripVertical, Camera } from 'lucide-react';

const BEFORE_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=60';
const AFTER_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=100';

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activePreset, setActivePreset] = useState<'raw' | 'split' | 'graded' | null>('split');
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  // MotionValue representing the handle's horizontal pixel offset inside the container
  const handleX = useMotionValue(0);

  // Measure container width dynamically so drag constraints and clipPath remain accurate on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = (nextWidth: number) => {
      setContainerWidth((prevWidth) => {
        if (nextWidth <= 0) return prevWidth;
        if (prevWidth === 0) {
          handleX.set(nextWidth / 2);
        } else {
          const ratio = handleX.get() / prevWidth;
          handleX.set(Math.min(nextWidth, Math.max(0, ratio * nextWidth)));
        }
        return nextWidth;
      });
    };

    updateWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleX]);

  // Map handleX to right inset for the "After" image clipPath
  const rightInset = useTransform(handleX, (latest) =>
    Math.max(0, containerWidth - latest)
  );
  const afterClipPath = useMotionTemplate`inset(0px ${rightInset}px 0px 0px)`;

  const jumpToRatio = (
    ratio: number,
    preset: 'raw' | 'split' | 'graded'
  ) => {
    if (containerWidth <= 0) return;
    setActivePreset(preset);
    const target = Math.min(containerWidth, Math.max(0, containerWidth * ratio));
    animate(handleX, target, {
      type: 'spring',
      stiffness: 280,
      damping: 28,
    });
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setActivePreset(null);
    const rect = containerRef.current.getBoundingClientRect();
    const targetX = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    animate(handleX, targetX, {
      type: 'spring',
      stiffness: 320,
      damping: 30,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (containerWidth <= 0) return;
    const step = containerWidth * 0.05;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActivePreset(null);
      animate(handleX, Math.max(0, handleX.get() - step), {
        type: 'spring',
        stiffness: 320,
        damping: 28,
      });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActivePreset(null);
      animate(handleX, Math.min(containerWidth, handleX.get() + step), {
        type: 'spring',
        stiffness: 320,
        damping: 28,
      });
    }
  };

  return (
    <section
      id="retouching"
      className="relative bg-neutral-950 border-t border-neutral-800/80 py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
              04. Darkroom & Post-Production
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white text-balance">
              Tonal Grading Study
            </h2>
            <p className="mt-3 text-sm md:text-base text-neutral-400 leading-relaxed">
              Drag the divider across the frame to compare the flat 16-bit camera raw capture against the final archival print grade.
            </p>
          </div>

          {/* Preset Inspection Controls (full-width 3-column grid on mobile to prevent overlap) */}
          <div className="grid grid-cols-3 w-full sm:w-auto sm:inline-flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-sm">
            <button
              type="button"
              onClick={() => jumpToRatio(0.08, 'raw')}
              className={`px-2 sm:px-3.5 py-2 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-sm whitespace-nowrap text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 ${
                activePreset === 'raw'
                  ? 'bg-neutral-100 text-neutral-950'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Raw Capture
            </button>
            <button
              type="button"
              onClick={() => jumpToRatio(0.5, 'split')}
              className={`px-2 sm:px-3.5 py-2 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-sm whitespace-nowrap text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 ${
                activePreset === 'split'
                  ? 'bg-neutral-100 text-neutral-950'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              50 / 50 Split
            </button>
            <button
              type="button"
              onClick={() => jumpToRatio(0.92, 'graded')}
              className={`px-2 sm:px-3.5 py-2 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-sm whitespace-nowrap text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 ${
                activePreset === 'graded'
                  ? 'bg-neutral-100 text-neutral-950'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Final Grade
            </button>
          </div>
        </div>

        {/* Interactive Comparison Frame */}
        <div
          ref={containerRef}
          onPointerDown={handleTrackPointerDown}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[72vh] overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800 select-none touch-none cursor-ew-resize"
        >
          {/* Base Layer: Before (Unedited, desaturated & flat) */}
          <motion.div className="absolute inset-0 w-full h-full overflow-hidden">
            {beforeError ? (
              <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <Camera className="w-6 h-6 text-neutral-600 mb-2" strokeWidth={1.25} />
                <span className="font-serif text-sm text-neutral-400">Before · Unedited Raw</span>
              </div>
            ) : (
              <img
                src={BEFORE_IMAGE_URL}
                alt="Unedited flat raw photograph of alpine mountain peaks before color grading"
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setBeforeError(true)}
                className="w-full h-full object-cover saturate-[0.55] contrast-[0.82] brightness-[0.94] pointer-events-none"
              />
            )}

            {/* Label lives inside the Before layer so it never overlaps the After label */}
            <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-[10px] sm:text-[11px] font-mono tracking-[0.12em] sm:tracking-[0.18em] uppercase text-neutral-300 bg-neutral-950/70 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-sm whitespace-nowrap">
              Before · Raw
            </div>
          </motion.div>

          {/* Overlay Layer: After (Vibrant & sharp), clipped dynamically via clipPath */}
          <motion.div
            style={{ clipPath: afterClipPath }}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-[clip-path]"
          >
            {afterError ? (
              <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                <Camera className="w-6 h-6 text-neutral-400 mb-2" strokeWidth={1.25} />
                <span className="font-serif text-sm text-neutral-200">After · Archival Grade</span>
              </div>
            ) : (
              <img
                src={AFTER_IMAGE_URL}
                alt="Retouched and color-graded alpine mountain photograph with rich tonal contrast"
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setAfterError(true)}
                className="w-full h-full object-cover contrast-[1.08] saturate-[1.15] pointer-events-none"
              />
            )}

            {/* Label lives inside the clipped After layer so dragging clips it cleanly without collision */}
            <div className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 z-10 text-[10px] sm:text-[11px] font-mono tracking-[0.12em] sm:tracking-[0.18em] uppercase text-white/95 bg-neutral-950/70 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-sm whitespace-nowrap">
              After · Graded
            </div>
          </motion.div>

          {/* Draggable Divider Line & Circular Handle */}
          <motion.div
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            style={{ x: handleX }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setActivePreset(null);
            }}
            onKeyDown={handleKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison divider"
            aria-valuemin={0}
            aria-valuemax={100}
            className="absolute top-0 bottom-0 left-0 z-30 -ml-5 w-10 flex items-center justify-center cursor-ew-resize focus-visible:outline-none"
          >
            {/* Vertical White Hairline */}
            <div
              aria-hidden="true"
              className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]"
            />

            {/* Circular Drag Handle with Subtle Drop Shadow */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="absolute w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.65)] ring-1 ring-black/15"
            >
              <GripVertical className="w-4 h-4" strokeWidth={2} />
            </motion.div>
          </motion.div>
        </div>

        {/* Unboxed Comparison Technical Notes */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
          <span>Plate 00 · Valais Alps, Switzerland</span>
          <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
            16-bit Hasselblad Raw · Highlight Recovery +1.4 EV · Split-Tone Cobalt / Warm Stone
          </span>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfterSlider;
