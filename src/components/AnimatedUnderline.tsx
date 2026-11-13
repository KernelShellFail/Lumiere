import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void;
  className?: string;
  underlineClassName?: string;
  target?: string;
  rel?: string;
}

export function AnimatedUnderline({
  children,
  href,
  onClick,
  className = '',
  underlineClassName = 'bg-white',
  target,
  rel,
}: AnimatedUnderlineProps) {
  const [isHovered, setIsHovered] = useState(false);

  const underline = (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0, originX: 0 }}
      animate={{
        scaleX: isHovered ? 1 : 0,
        originX: isHovered ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute left-0 right-0 bottom-0 h-[2px] will-change-transform ${underlineClassName}`}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`relative inline-block pb-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 rounded-sm ${className}`}
      >
        {children}
        {underline}
      </a>
    );
  }

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-block pb-1 whitespace-nowrap shrink-0 ${className}`}
    >
      {children}
      {underline}
    </span>
  );
}

export default AnimatedUnderline;
