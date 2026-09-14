'use client';

import React from 'react';
import Link from 'next/link';
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

  const isLight = variant === 'dark' || variant === 'footer';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus:outline-none group ${className}`}
      aria-label="AVICINNA - International Healthcare Platform"
    >
      {/* Premium Minimalist AVICINNA Medical Icon */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle Outer Glow / Hex Shield */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            className={isLight ? 'fill-white/10 stroke-sky-400/40' : 'fill-sky-50 stroke-sky-200'}
            strokeWidth="1.5"
          />
          {/* Stylized Modern "A" & Cross & Healing Wings */}
          <path
            d="M24 10L14 34H19.5L21.5 29H26.5L28.5 34H34L24 10Z"
            fill={isLight ? '#FFFFFF' : '#0A192F'}
          />
          <path
            d="M24 18L22.2 24.5H25.8L24 18Z"
            fill={isLight ? '#0EA5E9' : '#0EA5E9'}
          />
          {/* Medical Pulse / Cyan Crescent Accent */}
          <circle cx="24" cy="11" r="2.5" fill="#38BDF8" />
          <path
            d="M12 26C14.5 24.5 17 25 18 26.5"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M36 26C33.5 24.5 31 25 30 26.5"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {variant !== 'iconOnly' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase font-sans ${textSizes[size]} ${
                isLight ? 'text-white' : 'text-[#0A192F]'
              }`}
            >
              AVICINNA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block mb-1"></span>
          </div>

          <span
            className={`font-medium tracking-wide ${subTextSizes[size]} ${
              isLight ? 'text-sky-300/90' : 'text-slate-500'
            }`}
          >
            {language === 'ar'
              ? 'أفيسينا للرعاية الطبية'
              : language === 'fr'
              ? 'Soins Médicaux Turquie'
              : 'Medical Care Turkey'}
          </span>
        </div>
      )}
    </Link>
  );
};
