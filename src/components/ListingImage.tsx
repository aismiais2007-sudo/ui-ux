import { useState } from 'react';
import { Camera } from 'lucide-react';
import { DEFAULT_FALLBACK_IMAGE } from '../utils/listings';

interface ListingImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ListingImage({ src, alt, className = '' }: ListingImageProps) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_FALLBACK_IMAGE);
  const [failed, setFailed] = useState(false);

  // Sync when src prop changes
  if (src && src !== imgSrc && !failed) {
    setImgSrc(src);
  }

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFE8DC] text-[#6C5E52] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-8 h-8 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="text-xs font-medium line-clamp-2 max-w-[200px]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
          setImgSrc(DEFAULT_FALLBACK_IMAGE);
        } else {
          setFailed(true);
        }
      }}
      className={className}
    />
  );
}
