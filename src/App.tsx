import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LenisProvider, useLenisScroll } from './components/LenisProvider';
import { DeviceProvider } from './components/DeviceProvider';
import { PageLoader } from './components/PageLoader';
import { ScrollProgress } from './components/ScrollProgress';
import { MobileCursor } from './components/MobileCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResponsiveMasonry } from './components/ResponsiveMasonry';
import { ResponsiveHorizontalScroll } from './components/ResponsiveHorizontalScroll';
import { AboutSection } from './components/AboutSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { InfiniteMarquee } from './components/InfiniteMarquee';
import { ServicesSection, ServicePackage } from './components/ServicesSection';
import { ArchiveIndexSection } from './components/ArchiveIndexSection';
import { ClientLogos } from './components/ClientLogos';
import { SplitTextReveal } from './components/SplitTextReveal';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { ResponsiveLightbox } from './components/ResponsiveLightbox';
import { GALLERY_PHOTOS, FEATURED_SERIES_PHOTOS, PhotoItem } from './data/photos';

interface ActiveSelection {
  photo: PhotoItem;
  source: 'gallery' | 'series';
}

function PortfolioShell() {
  const [selection, setSelection] = useState<ActiveSelection | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [prefilledProjectType, setPrefilledProjectType] = useState('');
  const [prefilledBrief, setPrefilledBrief] = useState('');
  const { stop, start, scrollTo } = useLenisScroll();

  useEffect(() => {
    if (selection || serviceModalOpen) {
      stop();
    } else {
      start();
    }
  }, [selection, serviceModalOpen, stop, start]);

  const handleSelectPhoto = useCallback((photo: PhotoItem, source: 'gallery' | 'series') => {
    setSelection({ photo, source });
  }, []);

  const handleClose = useCallback(() => {
    setSelection(null);
  }, []);

  const handleBookPackage = useCallback(
    (pkg: ServicePackage) => {
      setPrefilledProjectType(pkg.title);
      setPrefilledBrief(
        `Commission inquiry for ${pkg.title} (${pkg.price} — ${pkg.duration}). Preferred dates and location:`
      );
      setTimeout(() => {
        scrollTo('#contact', { offset: -24 });
      }, 180);
    },
    [scrollTo]
  );

  const activeList =
    selection?.source === 'series' ? FEATURED_SERIES_PHOTOS : GALLERY_PHOTOS;

  const currentIndex = selection
    ? activeList.findIndex((item) => item.id === selection.photo.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (!selection || currentIndex < 0) return;
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    setSelection({ photo: activeList[prevIndex], source: selection.source });
  }, [selection, currentIndex, activeList]);

  const handleNext = useCallback(() => {
    if (!selection || currentIndex < 0) return;
    const nextIndex = (currentIndex + 1) % activeList.length;
    setSelection({ photo: activeList[nextIndex], source: selection.source });
  }, [selection, currentIndex, activeList]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <PageLoader />
      <ScrollProgress />
      <MobileCursor />
      <Navbar />

      <main>
        <Hero />
        <ResponsiveMasonry
          onSelectPhoto={handleSelectPhoto}
          selectedId={selection?.source === 'gallery' ? selection.photo.id : null}
        />
        <ResponsiveHorizontalScroll
          onSelectPhoto={handleSelectPhoto}
          selectedId={selection?.source === 'series' ? selection.photo.id : null}
        />
        <AboutSection />
        <BeforeAfterSlider />
        <InfiniteMarquee />
        <ServicesSection
          onBookPackage={handleBookPackage}
          onModalChange={setServiceModalOpen}
        />
        <ArchiveIndexSection
          onInspectPhoto={(photo) => handleSelectPhoto(photo, 'gallery')}
          onInquire={() => scrollTo('#contact', { offset: -24 })}
        />
        <ClientLogos />

        <section className="bg-neutral-950 py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SplitTextReveal
              eyebrow="07. Worldwide Commissions"
              text="LET'S CREATE SOMETHING BEAUTIFUL"
            />
          </div>
        </section>

        <ContactForm
          prefilledProjectType={prefilledProjectType}
          prefilledMessage={prefilledBrief}
        />
      </main>

      <Footer onScrollToTop={() => scrollTo('#hero')} />
      <BackToTop onScrollToTop={() => scrollTo('#hero')} />

      <AnimatePresence>
        {selection && (
          <ResponsiveLightbox
            key="lightbox-modal"
            photo={selection.photo}
            source={selection.source}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
            currentIndex={currentIndex}
            totalCount={activeList.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <DeviceProvider>
      <LenisProvider>
        <PortfolioShell />
      </LenisProvider>
    </DeviceProvider>
  );
}
