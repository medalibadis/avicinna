'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BlurHashImageProps extends Omit<ImageProps, 'onLoad'> {
  fallbackSrc?: string;
}

export function BlurHashImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder-medical.jpg',
  ...props
}: BlurHashImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative overflow-hidden bg-slate-100/80">
      {/* Laser LQIP shimmer background while loading */}
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-200/50 via-slate-100/70 to-slate-200/50" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt || 'Avicinna Medical'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
        className={`transition-all duration-700 ease-out ${
          isLoading
            ? 'scale-105 blur-md grayscale-30'
            : 'scale-100 blur-0 grayscale-0'
        } ${className}`}
      />
    </div>
  );
}
