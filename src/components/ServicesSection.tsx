import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowUpRight, Camera } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export interface ServicePackage {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  image: string;
  alt: string;
  description: string;
  included: string[];
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'weddings',
    index: '01',
    title: 'Weddings',
    subtitle: 'Full-day documentary & architectural portraiture',
    price: '$4,800',
    duration: '10 Hours · Two Photographers',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    alt: 'Editorial wedding couple walking beneath soft natural light',
    description:
      'Unhurried, cinema-grade coverage crafted with medium-format digital and 35mm analog film. Designed for destination celebrations and intimate architectural venues.',
    included: [
      '10 hours continuous coverage across ceremony & reception',
      'Lead photographer Julian Vance plus second documentary shooter',
      'Curated online archival gallery of 600+ color-graded plates',
      'Hand-bound linen proof book & 40 medium-format film frames',
    ],
  },
  {
    id: 'portraits',
    index: '02',
    title: 'Portraits',
    subtitle: 'Editorial monograph & studio sittings',
    price: '$1,450',
    duration: '3 Hours · Studio or Location',
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80',
    alt: 'Minimalist studio portrait framed with sculptural directional lighting',
    description:
      'Quiet, sculptural portraiture tailored for artists, founders, and editorial features. Photographed exclusively with natural daylight or single-source strobe.',
    included: [
      '3-hour directed sitting in studio or architectural location',
      'Creative direction, wardrobe review & lighting study',
      '25 meticulously retouched high-resolution archival plates',
      'Two 11×14" signed Hahnemühle cotton rag museum prints',
    ],
  },
  {
    id: 'commercial',
    index: '03',
    title: 'Commercial',
    subtitle: 'Campaigns, hospitality & architectural commissions',
    price: '$3,600',
    duration: 'Full Day · Global Licensing',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    alt: 'Monumental architectural facade photographed in crisp geometric light',
    description:
      'Visual systems and architectural monographs for hospitality groups, luxury objects, and design studios seeking enduring tonal discipline.',
    included: [
      'Full-day on-location production & pre-shoot light scouting',
      'Tethered medium-format capture for live art director review',
      '35 master retouched deliverables formatted for print & web',
      'Worldwide editorial and commercial usage license included',
    ],
  },
];

interface ServiceImageProps {
  src: string;
  alt: string;
  title: string;
}

function ServiceImage({ src, alt, title }: ServiceImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center"
      >
        <Camera className="w-6 h-6 text-neutral-600 mb-2" strokeWidth={1.25} />
        <span className="font-serif text-sm text-neutral-300">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="w-full h-full object-cover"
    />
  );
}

interface ServicesSectionProps {
  onBookPackage?: (pkg: ServicePackage) => void;
  onModalChange?: (isOpen: boolean) => void;
}

export function ServicesSection({
  onBookPackage,
  onModalChange,
}: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);

  useEffect(() => {
    onModalChange?.(Boolean(selectedService));
  }, [selectedService, onModalChange]);

  useEffect(() => {
    if (!selectedService) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedService(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService]);

  const handleBookClick = (pkg: ServicePackage) => {
    setSelectedService(null);
    if (onBookPackage) {
      onBookPackage(pkg);
    } else {
      const contactEl = document.querySelector('#contact');
      contactEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      className="relative bg-neutral-950 border-t border-neutral-800/80 py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-14 border-b border-neutral-800/80">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
              05. Commissions & Offerings
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-white text-balance">
              Services & Packages
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
            Select any discipline below to inspect full deliverables, timelines, and archival licensing.
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICE_PACKAGES.map((service) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <motion.article
                key={service.id}
                layoutId={`service-${service.id}`}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                onClick={() => setSelectedService(service)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedService(service);
                  }
                }}
                role="button"
                tabIndex={0}
                data-cursor="image"
                aria-label={`View details for ${service.title} package`}
                className={`group cursor-pointer bg-neutral-900/50 border border-neutral-800/80 rounded-sm p-4 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 ${
                  isSelected ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Rule #2: NEVER animate <img> directly; wrap inside <motion.div> with overflow-hidden */}
                <motion.div className="w-full aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900">
                  <ServiceImage
                    src={service.image}
                    alt={service.alt}
                    title={service.title}
                  />
                </motion.div>

                <div className="pt-5 pb-2 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-neutral-500 tabular-nums shrink-0">
                    {service.index}
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-800/70 flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono tabular-nums text-neutral-200">
                    From {service.price}
                  </span>
                  <span className="inline-flex items-center gap-1 text-neutral-300 group-hover:text-white">
                    <span>Explore Scope</span>
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Morphing Modal Overlay */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            key="service-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            onClick={() => setSelectedService(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedService.title} package details`}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              layoutId={`service-${selectedService.id}`}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <motion.button
                type="button"
                onClick={() => setSelectedService(null)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                aria-label="Close package details"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-100 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </motion.button>

              {/* Left Modal Visual (Wrapped <img> inside <motion.div>) */}
              <motion.div className="md:col-span-5 h-64 md:h-auto min-h-[320px] overflow-hidden bg-neutral-900">
                <ServiceImage
                  src={selectedService.image}
                  alt={selectedService.alt}
                  title={selectedService.title}
                />
              </motion.div>

              {/* Right Modal Details */}
              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="font-mono tabular-nums text-neutral-300">
                      Package {selectedService.index}
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{selectedService.duration}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
                    {selectedService.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400">
                    {selectedService.subtitle}
                  </p>

                  <div className="mt-6 pt-6 border-t border-neutral-800/80 flex items-baseline gap-3">
                    <span className="font-serif text-3xl text-white font-normal tabular-nums">
                      {selectedService.price}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Starting archival commission fee
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-neutral-300 leading-relaxed">
                    {selectedService.description}
                  </p>

                  <div className="mt-7">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-3.5">
                      Included Deliverables
                    </p>
                    <ul className="space-y-2.5">
                      {selectedService.included.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-neutral-300 leading-snug"
                        >
                          <Check
                            className="w-4 h-4 text-neutral-200 mt-0.5 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-neutral-500">
                    Available for travel across Europe, North America & Japan.
                  </span>
                  <MagneticButton
                    onClick={() => handleBookClick(selectedService)}
                    className="px-6 py-3 text-xs tracking-wide"
                  >
                    Book Now
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ServicesSection;
