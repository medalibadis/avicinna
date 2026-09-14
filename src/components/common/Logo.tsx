'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface LogoProps {
  variant?: 'header' | 'footer' | 'dark' | 'light' | 'iconOnly';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  className = '',
  size = 'md',
}) => {
  const { language } = useLanguage();
  const isDark = variant === 'dark' || variant === 'footer';

  const dimensions = {
    sm: { height: 36, width: 48, iconSize: 'w-8 h-8' },
    md: { height: 44, width: 59, iconSize: 'w-10 h-10' },
    lg: { height: 56, width: 75, iconSize: 'w-14 h-14' },
  };

  const currentDim = dimensions[size];

  if (variant === 'iconOnly') {
    return (
      <Link
        href="/"
        className={`inline-flex items-center justify-center transition-transform duration-200 hover:scale-105 focus:outline-none ${className}`}
        aria-label="AVICINNA - International Healthcare Platform"
      >
        <div className={`relative ${currentDim.iconSize} flex-shrink-0`}>
          <Image
            src={isDark ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
            alt="AVICINNA"
            fill
            sizes="56px"
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus:outline-none group ${className}`}
      aria-label="AVICINNA - International Healthcare Platform"
    >
      {/* Official AVICINNA Icon */}
      <div className={`relative ${currentDim.iconSize} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <Image
          src={isDark ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
          alt="AVICINNA"
          fill
          sizes="56px"
          className="object-contain drop-shadow-xs"
          priority
        />
      </div>

      {/* Official Typography & Subtitle aligned with Brand Identity */}
      <div className="flex flex-col text-start">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-wider uppercase font-sans ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
            } ${isDark ? 'text-white' : 'text-[#032654]'}`}
          >
            AVICINNA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0097FB] inline-block mb-0.5"></span>
        </div>

        <span
          className={`font-semibold tracking-wide mt-1 leading-none ${
            size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[11px]'
          } ${isDark ? 'text-[#00BFFF]' : 'text-[#0097FB]'}`}
        >
          {language === 'ar'
            ? 'أفيسينا للرعاية الطبية'
            : language === 'fr'
            ? 'Soins Médicaux Turquie'
            : 'Medical Care Turkey'}
        </span>
      </div>
    </Link>
  );
};
