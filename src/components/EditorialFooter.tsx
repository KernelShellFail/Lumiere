import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { AnimatedUnderline } from './AnimatedUnderline';
import { TactileButton } from './TactileButton';
import { useLenisScroll } from './LenisProvider';

interface EditorialFooterProps {
  prefilledBrief?: string;
}

export function EditorialFooter({ prefilledBrief }: EditorialFooterProps) {
  const { scrollTo } = useLenisScroll();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledBrief) {
      setBrief(prefilledBrief);
      setSubmitted(false);
    }
  }, [prefilledBrief]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !brief.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setBrief('');
    setSubmitted(false);
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80">
      {/* Commission Inquiries */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
      >
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
              08. Commissions & Prints
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-neutral-100 text-balance">
              Studio Inquiries
            </h2>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-md">
              Available for editorial assignments, architectural monographs, and museum print acquisitions worldwide.
            </p>
          </div>

          <div className="mt-10 space-y-2 text-sm text-neutral-300">
            <AnimatedUnderline
              href="mailto:studio@lumiere-archive.example"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>studio@lumiere-archive.example</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.5} />
              </span>
            </AnimatedUnderline>
            <p className="text-xs text-neutral-500">Talstrasse 82, 8001 Zurich, Switzerland</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-sm"
            >
              <div className="flex items-center gap-3 text-neutral-100">
                <span className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-950 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" strokeWidth={2} />
                </span>
                <h3 className="font-serif text-xl font-normal">Inquiry Received</h3>
              </div>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Thank you, {name}. Our studio archivist will respond to {email} within two business days with availability and edition details.
              </p>
              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                className="mt-6 px-4 py-2 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
              >
                Send Another Inquiry
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs text-neutral-400 mb-2">
                    Name
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Claire Beaumont"
                    className="w-full px-4 py-3 text-sm bg-neutral-900/70 border border-neutral-800 rounded-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-email" className="block text-xs text-neutral-400 mb-2">
                    Email
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="claire@publication.org"
                    className="w-full px-4 py-3 text-sm bg-neutral-900/70 border border-neutral-800 rounded-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-brief" className="block text-xs text-neutral-400 mb-2">
                  Project or Print Edition Inquiry
                </label>
                <textarea
                  id="inquiry-brief"
                  required
                  rows={4}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Share exhibition dates, editorial scope, or edition number..."
                  className="w-full px-4 py-3 text-sm bg-neutral-900/70 border border-neutral-800 rounded-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-neutral-500">
                  Direct response from Zurich studio.
                </p>
                <MagneticButton
                  type="submit"
                  className="px-7 py-3.5 text-xs tracking-wide"
                >
                  Request Availability
                </MagneticButton>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Quiet Footer Copyright */}
      <div className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2025 Lumière Studio · Basiturraza Taji. All rights reserved.</p>
          <TactileButton
            variant="ghost"
            onClick={() => scrollTo('#hero')}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Back to Top
          </TactileButton>
        </div>
      </div>
    </footer>
  );
}
