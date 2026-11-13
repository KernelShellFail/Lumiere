import React, { useRef, useState } from 'react';
import { motion, useMotionValue, HTMLMotionProps } from 'framer-motion';
import { AnimatedUnderline } from './AnimatedUnderline';

export type TactileButtonVariant = 'primary' | 'secondary' | 'ghost';

interface TactileButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'ref'> {
  children: React.ReactNode;
  variant?: TactileButtonVariant;
  className?: string;
  enableRipple?: boolean;
}

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function TactileButton({
  children,
  variant = 'primary',
  className = '',
  enableRipple = true,
  type = 'button',
  onClick,
  ...props
}: TactileButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleInstance[]>([]);

  const clickX = useMotionValue(0);
  const clickY = useMotionValue(0);

  const variantClasses: Record<TactileButtonVariant, string> = {
    primary: 'bg-white text-black rounded-full px-8 py-4 hover:bg-neutral-100',
    secondary:
      'bg-transparent border border-white text-white rounded-full px-8 py-4 hover:bg-white/10',
    ghost: 'bg-transparent text-white px-2 py-1 rounded-sm',
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    if (!enableRipple || variant === 'ghost' || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;

    clickX.set(x);
    clickY.set(y);

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-2), { id, x, y, size }]);
  };

  const handlePointerUpOrLeave = () => {
    setIsPressed(false);
  };

  const rippleColorClass =
    variant === 'primary' ? 'bg-black/15' : 'bg-white/25';

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerCancel={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      whileTap={{ scale: 0.95 }}
      animate={
        variant === 'ghost'
          ? undefined
          : {
              boxShadow: isPressed
                ? '0 4px 10px rgba(0, 0, 0, 0.35)'
                : '0 12px 28px rgba(0, 0, 0, 0.55)',
            }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden inline-flex items-center justify-center font-medium tracking-wide whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Click Ripple Layer */}
      {enableRipple &&
        variant !== 'ghost' &&
        ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            onAnimationComplete={() =>
              setRipples((prev) => prev.filter((item) => item.id !== ripple.id))
            }
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
            className={`pointer-events-none absolute rounded-full ${rippleColorClass}`}
          />
        ))}

      <span className="relative z-10 inline-flex items-center gap-2">
        {variant === 'ghost' ? (
          <AnimatedUnderline>{children}</AnimatedUnderline>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

export default TactileButton;
