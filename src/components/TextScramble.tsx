import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
}

export function TextScramble({
  text,
  duration = 0.65,
  className = '',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    return () => {
      animRef.current?.stop();
    };
  }, []);

  const triggerScramble = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    animRef.current?.stop();

    animRef.current = animate(0, text.length, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latestProgress) => {
        const settledCount = Math.floor(latestProgress);
        let next = '';

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === ' ') {
            next += ' ';
          } else if (i < settledCount) {
            next += char;
          } else {
            const randomIndex = Math.floor(Math.random() * SCRAMBLE_CHARS.length);
            next += SCRAMBLE_CHARS[randomIndex];
          }
        }

        setDisplayText(next);
      },
      onComplete: () => {
        setDisplayText(text);
      },
    });
  };

  return (
    <span
      onMouseEnter={triggerScramble}
      onFocus={triggerScramble}
      aria-label={text}
      className={`inline-block font-mono text-white tracking-wide cursor-default select-none ${className}`}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}

export default TextScramble;
