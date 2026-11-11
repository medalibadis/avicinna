'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedPath } from '@/lib/i18nRoutes';

interface LogoProps {
  variant?: 'header' | 'footer' | 'dark' | 'light' | 'iconOnly' | 'full' | 'full-white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  className = '',
  size = 'md',
}) => {
  const { language } = useLanguage();
  const homeHref = getLocalizedPath('/', language);
  const isDark = variant === 'dark' || variant === 'footer' || variant === 'full-white';

  if (variant === 'iconOnly') {
    const dim = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
    return (
      <Link
        href={homeHref}
        className={`inline-flex items-center justify-center focus:outline-none ${className}`}
        aria-label="AVICINNA"
      >
        <Image
          src={isDark ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
          alt="AVICINNA"
          width={dim}
          height={dim}
          className="object-contain"
          priority
        />
      </Link>
    );
  }

  if (variant === 'full' || variant === 'full-white') {
    const w = size === 'sm' ? 140 : size === 'lg' ? 220 : 180;
    const h = Math.round(w * (469 / 638));
    return (
      <Link
        href={homeHref}
        className={`inline-flex items-center justify-center focus:outline-none ${className}`}
        aria-label="AVICINNA - International Healthcare Platform"
      >
        <Image
          src={isDark ? '/images/logo-white.png' : '/images/logo.png'}
          alt="AVICINNA - International Healthcare Platform"
          width={w}
          height={h}
          className="object-contain h-auto"
          priority
        />
      </Link>
    );
  }

  const heights = { sm: 34, md: 42, lg: 52 };
  const h = heights[size];
  const w = Math.round(h * (641 / 120));

  return (
    <Link
      href={homeHref}
      className={`inline-flex items-center focus:outline-none ${className}`}
      aria-label="AVICINNA - International Healthcare Platform"
    >
      <Image
        src={isDark ? '/images/logo-horizontal-white.png' : '/images/logo-horizontal.png'}
        alt="AVICINNA - International Healthcare Platform"
        width={w}
        height={h}
        className="object-contain h-auto max-h-12 w-auto"
        priority
      />
    </Link>
  );
};
