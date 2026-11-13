import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  title,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center border border-neutral-800/70"
      >
        <Camera className="w-6 h-6 text-neutral-600 mb-3" strokeWidth={1.25} />
        <span className="font-serif text-sm text-neutral-300 tracking-wide">
          {title || 'Archival Plate'}
        </span>
        <span className="text-xs text-neutral-500 mt-1 max-w-[22ch] leading-relaxed">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
