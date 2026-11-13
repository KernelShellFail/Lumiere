import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { CursorImagePreview } from './CursorImagePreview';
import { TextScramble } from './TextScramble';
import { TactileButton } from './TactileButton';
import { GALLERY_PHOTOS, PhotoItem } from '../data/photos';

interface ArchiveIndexSectionProps {
  onInspectPhoto: (photo: PhotoItem) => void;
  onInquire: () => void;
}

const ARCHIVE_METRICS = [
  {
    target: 50,
    suffix: '+',
    label: 'Global Commissions',
    detail: 'Editorial monographs & architectural studies',
  },
  {
    target: 12,
    suffix: '',
    label: 'Years in Field',
    detail: 'Alps, Nordic archipelago & Pacific Northwest',
  },
  {
    target: 100,
    suffix: '%',
    label: 'Archival Cotton Rag',
    detail: 'Signed museum-grade Hahnemühle editions',
  },
];

const EXHIBITION_INDEX = [
  {
    code: 'MON-2025-01',
    title: 'Highland Silence — Kunsthalle Basel',
    location: 'Basel, Switzerland',
    year: '2025',
    photo: GALLERY_PHOTOS[0],
  },
  {
    code: 'MON-2025-02',
    title: 'Nordic Nocturne — Fotografiska Tallin',
    location: 'Lofoten / Tallinn',
    year: '2025',
    photo: GALLERY_PHOTOS[3],
  },
  {
    code: 'MON-2024-03',
    title: 'Sylvan Studies — Kyoto Design Lab',
    location: 'Kyoto, Japan',
    year: '2024',
    photo: GALLERY_PHOTOS[1],
  },
  {
    code: 'MON-2024-04',
    title: 'Drift & Topographies — Venice Pavilion',
    location: 'Venice, Italy',
    year: '2024',
    photo: GALLERY_PHOTOS[4],
  },
];

export function ArchiveIndexSection({
  onInspectPhoto,
  onInquire,
}: ArchiveIndexSectionProps) {
  return (
    <section
      id="archive-index"
      className="relative bg-neutral-950 border-t border-neutral-800/80 py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Scroll-Triggered Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-20 border-b border-neutral-800/80">
          {ARCHIVE_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-3">
              <AnimatedCounter target={metric.target} suffix={metric.suffix} />
              <div>
                <h3 className="text-sm font-medium text-neutral-100 tracking-wide">
                  {metric.label}
                </h3>
                <p className="mt-1 text-xs text-neutral-400">{metric.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Monograph Index with CursorImagePreview & TextScramble */}
        <div className="pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
                06. Exhibition Index
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-white text-balance">
                Selected Monographs
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <TactileButton
                variant="secondary"
                onClick={onInquire}
                className="text-xs uppercase tracking-[0.16em] px-6 py-3"
              >
                Request Catalogue
              </TactileButton>
              <TactileButton
                variant="ghost"
                onClick={() => onInspectPhoto(GALLERY_PHOTOS[0])}
                className="text-xs uppercase tracking-[0.16em]"
              >
                <span>Open First Plate</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </TactileButton>
            </div>
          </div>

          <div className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
            {EXHIBITION_INDEX.map((entry) => (
              <CursorImagePreview
                key={entry.code}
                imageUrl={entry.photo.src}
                alt={entry.photo.alt}
              >
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  onClick={() => onInspectPhoto(entry.photo)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onInspectPhoto(entry.photo);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group py-6 md:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <TextScramble
                      text={entry.code}
                      className="text-xs text-neutral-400 group-hover:text-white shrink-0"
                    />
                    <h3 className="font-serif text-xl md:text-2xl text-neutral-100 font-normal tracking-tight group-hover:text-white">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-neutral-400 shrink-0">
                    <span>{entry.location}</span>
                    <span className="font-mono tabular-nums text-neutral-500">
                      {entry.year}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-neutral-500 group-hover:text-white shrink-0"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>
              </CursorImagePreview>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchiveIndexSection;
