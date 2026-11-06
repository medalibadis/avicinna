'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award } from 'lucide-react';

/**
 * PLACEMENT A: First-Visit Cinematic Curtain Preloader (Disabled - renders null)
 */
export function BrandLogoRevealIntro() {
  return null;
}

/**
 * PLACEMENT B: Static Navbar Brand Logo (Clean, Crisp, Zero Animation)
 */
export function AnimatedNavbarLogo({
  locale = 'ar',
  isDark = false,
}: {
  locale?: 'ar' | 'fr' | 'en';
  isDark?: boolean;
}) {
  const subtitle =
    locale === 'ar'
      ? 'أفيسينا للرعاية الطبية في تركيا'
      : locale === 'fr'
      ? 'Soins Médicaux Turquie'
      : 'Medical Care in Turkey';

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 sm:gap-3 focus:outline-none select-none"
      aria-label="AVICINNA Healthcare Turkey"
    >
      <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-xl border border-sky-400/25 bg-[#032654] p-1">
        <Image
          src="/images/logo-icon-white.png"
          alt="AVICINNA Logo"
          width={40}
          height={40}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`text-base sm:text-lg font-black tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          AVICINNA
        </span>
        <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-semibold text-sky-600 dark:text-sky-400 line-clamp-1 leading-tight">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}

/**
 * PLACEMENT C: Static Trust Medallion for "About / 10+ Years Excellence" Section
 */
export function AboutVideoMedallion({
  locale = 'ar',
}: {
  locale?: 'ar' | 'fr' | 'en';
}) {
  return (
    <div
      className="flex items-center gap-2.5 sm:gap-3.5 rounded-2xl sm:rounded-3xl border border-white/20 bg-slate-950/90 p-2.5 sm:p-3.5 text-white shadow-xl backdrop-blur-2xl max-w-[calc(100vw-2.5rem)] sm:max-w-none"
    >
      <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-2xl border border-sky-400/30 bg-black p-2 flex items-center justify-center">
        <Image
          src="/images/logo-icon-white.png"
          alt="AVICINNA"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="pe-2">
        <div className="flex items-center gap-1.5 text-xl font-black text-sky-400 tabular-nums">
          <span>+10</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <p className="text-xs font-bold leading-snug text-slate-200">
          {locale === 'ar'
            ? 'سنوات من الخبرة والرعاية الدولية المعتمدة JCI'
            : locale === 'fr'
            ? 'Années d’Excellence Médicale Certifiée JCI'
            : 'Years of JCI-Accredited International Care'}
        </p>
      </div>
    </div>
  );
}

/**
 * PLACEMENT D: Static Footer Signature Trust Seal
 */
export function FooterVideoTrustSeal({
  locale = 'ar',
}: {
  locale?: 'ar' | 'fr' | 'en';
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 p-2.5 shadow-xl backdrop-blur-xl flex items-center justify-center">
        <Image
          src="/images/logo-icon-white.png"
          alt="AVICINNA"
          width={48}
          height={48}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Award className="w-3.5 h-3.5 text-teal-400" />
        <span>
          {locale === 'ar'
            ? 'الختم الرسمي لرعاية المرضى الدوليين في تركيا'
            : locale === 'fr'
            ? 'Sceau Officiel de Santé Internationale en Turquie'
            : 'Official International Healthcare Seal of Turkey'}
        </span>
      </div>
    </div>
  );
}
