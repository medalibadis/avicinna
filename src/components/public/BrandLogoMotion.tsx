// ============================================================================
// FILE: src/components/public/BrandLogoMotion.tsx
// Purpose:
// Places Vector_logo_reveal_animation_ce781b6e_1080p.mp4 (/videos/logo-reveal.mp4)
// in 4 signature high-impact brand moments:
// 1. First-visit Cinematic Curtain Preloader (<BrandLogoRevealIntro />)
// 2. Interactive Navbar Hover Video Logo (<AnimatedNavbarLogo />)
// 3. "About Us / 10+ Years Excellence" Floating Glass Video Medallion (<AboutVideoMedallion />)
// 4. Footer Signature Watermark Trust Seal (<FooterVideoTrustSeal />)
// ============================================================================
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Award } from 'lucide-react';

/**
 * PLACEMENT A: First-Visit Cinematic Curtain Preloader
 */
export function BrandLogoRevealIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Only show once per session
    try {
      const alreadySeen = sessionStorage.getItem('avicinna_luxury_intro_v1');
      if (!alreadySeen) {
        setShowIntro(true);
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 65);

        const timer = setTimeout(() => {
          completeIntro();
        }, 2500);

        return () => {
          clearInterval(interval);
          clearTimeout(timer);
        };
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const completeIntro = () => {
    try {
      sessionStorage.setItem('avicinna_luxury_intro_v1', 'true');
    } catch {}
    setShowIntro(false);
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="avicinna-curtain"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            borderBottomLeftRadius: '50% 15%',
            borderBottomRightRadius: '50% 15%',
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050B14] text-white overflow-hidden shadow-2xl"
        >
          {/* Ambient Medical Radial Glow */}
          <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-sky-500/20 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-teal-500/15 blur-[100px]" />

          {/* Vector Logo Reveal MP4 Container */}
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative h-60 w-60 overflow-hidden rounded-3xl border border-sky-400/20 bg-slate-950/70 p-2.5 shadow-2xl shadow-sky-500/20 sm:h-72 sm:w-72 backdrop-blur-xl"
          >
            <video
              ref={videoRef}
              src="/videos/logo-reveal.mp4"
              autoPlay
              muted
              playsInline
              onEnded={completeIntro}
              className="h-full w-full rounded-2xl object-cover mix-blend-screen scale-110"
            />
          </motion.div>

          {/* Progress Bar & Skip Button */}
          <div className="mt-8 flex w-72 flex-col items-center gap-3 relative z-10">
            <div className="flex w-full items-center justify-between text-xs font-bold tracking-widest text-sky-300 uppercase tabular-nums">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
                AVICINNA HEALTHCARE
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 shadow-sm shadow-teal-400/50"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              type="button"
              onClick={completeIntro}
              className="mt-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Skip Intro ↵
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * PLACEMENT B: Interactive Navbar Brand Logo (Replays Vector Reveal on Hover)
 */
export function AnimatedNavbarLogo({
  locale = 'ar',
}: {
  locale?: 'ar' | 'fr' | 'en';
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const subtitle =
    locale === 'ar'
      ? 'أفيسينا للرعاية الطبية في تركيا'
      : locale === 'fr'
      ? 'Soins Médicaux Turquie'
      : 'Medical Care in Turkey';

  return (
    <a
      href="/"
      onMouseEnter={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }}
      className="group inline-flex items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer"
    >
      <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-sky-400/30 bg-slate-950 shadow-md shadow-sky-500/20 transition-transform duration-300 group-hover:scale-108 group-hover:border-teal-400/60 ring-2 ring-sky-500/10">
        <video
          ref={videoRef}
          src="/videos/logo-reveal.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full scale-125 object-cover mix-blend-screen"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          AVICINNA
        </span>
        <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-semibold text-sky-600 dark:text-sky-400 line-clamp-1">
          {subtitle}
        </span>
      </div>
    </a>
  );
}

/**
 * PLACEMENT C: Floating Glass Video Medallion for the "About / 10+ Years Excellence" Section
 */
export function AboutVideoMedallion({
  locale = 'ar',
}: {
  locale?: 'ar' | 'fr' | 'en';
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
      className="flex items-center gap-3.5 rounded-3xl border border-white/20 bg-slate-950/90 p-3.5 text-white shadow-2xl backdrop-blur-2xl ring-1 ring-sky-500/20"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-sky-400/30 bg-black shadow-inner">
        <video
          src="/videos/logo-reveal.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-125 object-cover mix-blend-screen"
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
    </motion.div>
  );
}

/**
 * PLACEMENT D: Footer Signature Watermark Trust Seal
 */
export function FooterVideoTrustSeal({
  locale = 'ar',
}: {
  locale?: 'ar' | 'fr' | 'en';
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
      <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-white/15 bg-slate-950/80 p-2 shadow-2xl shadow-sky-500/15 backdrop-blur-xl group hover:border-teal-400/50 transition-all duration-300">
        <video
          src="/videos/logo-reveal.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-125 object-cover mix-blend-screen opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-sky-400/20 pointer-events-none" />
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
