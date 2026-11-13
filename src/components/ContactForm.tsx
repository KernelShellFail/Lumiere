import React, { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from 'framer-motion';
import { Loader2, Check, ChevronDown, AlertCircle } from 'lucide-react';

export interface ContactFormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success';

const PROJECT_TYPES = [
  'Weddings',
  'Portraits',
  'Commercial',
  'Editorial Monograph',
  'Archival Print Acquisition',
];

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  shakeTrigger: number;
  children: (props: {
    onFocus: () => void;
    onBlur: () => void;
    isFocused: boolean;
  }) => React.ReactNode;
}

function FloatingField({
  id,
  label,
  value,
  error,
  shakeTrigger,
  children,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusValue = useMotionValue(0);
  const shakeX = useMotionValue(0);

  const isFloating = isFocused || value.trim().length > 0;

  useEffect(() => {
    focusValue.set(isFocused ? 1 : 0);
  }, [isFocused, focusValue]);

  useEffect(() => {
    if (shakeTrigger === 0 || !error) return;
    // Real damped spring oscillation for shake feedback (2-endpoint spring, no multi-keyframe crash)
    shakeX.set(-9);
    const controls = animate(shakeX, 0, {
      type: 'spring',
      stiffness: 300,
      damping: 10,
      velocity: 380,
    });
    return () => controls.stop();
  }, [shakeTrigger, error, shakeX]);

  return (
    <motion.div style={{ x: shakeX }} className="relative">
      <div className="relative">
        <motion.label
          layout
          htmlFor={id}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className={`pointer-events-none absolute left-4 z-10 origin-left transition-colors ${
            isFloating
              ? 'top-2.5 text-[11px] tracking-[0.14em] uppercase'
              : 'top-4 text-sm'
          } ${isFocused ? 'text-white' : 'text-neutral-400'}`}
        >
          {label}
        </motion.label>

        <motion.div
          animate={{
            boxShadow: error
              ? '0 0 0 1px rgba(248, 113, 113, 0.8)'
              : isFocused
              ? '0 0 0 1px rgba(255, 255, 255, 0.9), 0 8px 24px rgba(255, 255, 255, 0.06)'
              : '0 0 0 1px rgba(255, 255, 255, 0.22)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="rounded-sm bg-transparent"
        >
          {children({
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            isFocused,
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ContactFormProps {
  prefilledProjectType?: string;
  prefilledMessage?: string;
}

export function ContactForm({
  prefilledProjectType,
  prefilledMessage,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormValues>({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeCount, setShakeCount] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  useEffect(() => {
    if (prefilledProjectType || prefilledMessage) {
      setFormData((prev) => ({
        ...prev,
        projectType: prefilledProjectType || prev.projectType,
        message: prefilledMessage || prev.message,
      }));
      setErrors({});
      setStatus('idle');
    }
  }, [prefilledProjectType, prefilledMessage]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.projectType) {
      nextErrors.projectType = 'Please select a project type.';
    }
    if (formData.message.trim().length < 10) {
      nextErrors.message = 'Please share a brief note (at least 10 characters).';
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShakeCount((c) => c + 1);
      return;
    }

    setErrors({});
    setStatus('submitting');

    // Mock async submission
    window.setTimeout(() => {
      console.log('Lumière Commission Inquiry Submitted:', formData);
      setStatus('success');
    }, 1100);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', projectType: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  return (
    <section
      id="contact"
      className="relative bg-neutral-900 border-t border-neutral-800/80 py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.22em] uppercase text-neutral-400 mb-3">
            08. Commissions & Editions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-white text-balance">
            Let&apos;s Create Together
          </h2>
          <p className="mt-4 text-sm md:text-base text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Share your dates, location, or archival print inquiry. All messages receive a personal studio response within 48 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-2">
          {/* Field 1: Name */}
          <FloatingField
            id="contact-name"
            label="Full Name"
            value={formData.name}
            error={errors.name}
            shakeTrigger={shakeCount}
          >
            {({ onFocus, onBlur }) => (
              <input
                id="contact-name"
                type="text"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                value={formData.name}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className="w-full bg-transparent px-4 pt-7 pb-3 text-sm text-white focus:outline-none"
              />
            )}
          </FloatingField>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
            style={{ transformOrigin: 'left center' }}
            className="h-px bg-neutral-800/80 my-4"
          />

          {/* Field 2: Email */}
          <FloatingField
            id="contact-email"
            label="Email Address"
            value={formData.email}
            error={errors.email}
            shakeTrigger={shakeCount}
          >
            {({ onFocus, onBlur }) => (
              <input
                id="contact-email"
                type="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                value={formData.email}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="w-full bg-transparent px-4 pt-7 pb-3 text-sm text-white focus:outline-none"
              />
            )}
          </FloatingField>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
            style={{ transformOrigin: 'left center' }}
            className="h-px bg-neutral-800/80 my-4"
          />

          {/* Field 3: Project Type Dropdown */}
          <FloatingField
            id="contact-project-type"
            label="Project Type"
            value={formData.projectType}
            error={errors.projectType}
            shakeTrigger={shakeCount}
          >
            {({ onFocus, onBlur }) => (
              <div className="relative">
                <select
                  id="contact-project-type"
                  required
                  aria-invalid={Boolean(errors.projectType)}
                  aria-describedby={
                    errors.projectType ? 'contact-project-type-error' : undefined
                  }
                  value={formData.projectType}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, projectType: e.target.value }));
                    if (errors.projectType) {
                      setErrors((prev) => ({ ...prev, projectType: undefined }));
                    }
                  }}
                  className="w-full appearance-none bg-transparent px-4 pt-7 pb-3 pr-10 text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="" disabled className="bg-neutral-900 text-neutral-400">
                    {''}
                  </option>
                  {PROJECT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-neutral-900 text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </FloatingField>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
            style={{ transformOrigin: 'left center' }}
            className="h-px bg-neutral-800/80 my-4"
          />

          {/* Field 4: Message */}
          <FloatingField
            id="contact-message"
            label="Project Brief or Print Inquiry"
            value={formData.message}
            error={errors.message}
            shakeTrigger={shakeCount}
          >
            {({ onFocus, onBlur }) => (
              <textarea
                id="contact-message"
                required
                rows={4}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'contact-message-error' : undefined
                }
                value={formData.message}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, message: e.target.value }));
                  if (errors.message) {
                    setErrors((prev) => ({ ...prev, message: undefined }));
                  }
                }}
                className="w-full bg-transparent px-4 pt-7 pb-3 text-sm text-white focus:outline-none resize-none"
              />
            )}
          </FloatingField>

          {/* Tactile Submit Button with AnimatePresence State Morph */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              Zurich & Kyoto Studio · studio@lumiere-archive.example
            </p>

            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative min-w-[190px] h-12 px-8 rounded-full bg-white text-black text-xs font-medium uppercase tracking-[0.16em] shadow-lg hover:bg-neutral-100 disabled:opacity-80 flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  >
                    Send Inquiry
                  </motion.span>
                )}

                {status === 'submitting' && (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    <span>Sending</span>
                  </motion.span>
                )}

                {status === 'success' && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" strokeWidth={2.2} />
                    <span>Sent</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Thank You Confirmation Message */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="mt-6 p-6 bg-neutral-950/80 border border-neutral-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif text-lg text-white font-normal">
                    Thank you, {formData.name}.
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                    Your {formData.projectType.toLowerCase()} inquiry has been logged. Our studio will respond to {formData.email} shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm"
                >
                  New Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
