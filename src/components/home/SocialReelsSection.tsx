'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { SocialVideo } from '@/data/socialVideos';
import {
  Play,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';

const dict = {
  ar: {
    trustBadge: '★ ★ ★ ★ ★ +2000 مريض سعيد',
    headlinePart1: 'كما',
    headlineHighlight: 'ارتاحوا،',
    headlinePart2: 'سترتاح أنت أيضًا',
    subtitle:
      'مقاطع حية وتجارب موثقة واستشارات طبية مباشرة من حساباتنا الرسمية على وسائل التواصل الاجتماعي.',
    followInstagram: 'تابعنا على إنستغرام',
    handle: '@avicinna_medical',
    watchOnInstagram: 'مشاهدة الفيديو على إنستغرام',
    openPlatform: 'مشاهدة المقطع على المنصة الأصلية',
    nextReel: 'المقطع التالي',
    prevReel: 'المقطع السابق',
    closeModal: 'إغلاق المشغل',
    bookConsultation: 'طلب استشارة مجانية بخصوص هذا الإجراء',
    viewsLabel: 'مشاهدة',
    reelBadge: 'فيديو حصري',
    swipeHint: 'اسحب لمشاهدة المزيد من المقاطع',
  },
  en: {
    trustBadge: '★ ★ ★ ★ ★ 2,000+ Recovered Patients',
    headlinePart1: 'Just as they found',
    headlineHighlight: 'peace and recovery,',
    headlinePart2: 'you will too',
    subtitle:
      'Verified patient journeys, clinical insights, and live medical updates from our official social media channels.',
    followInstagram: 'Follow on Instagram',
    handle: '@avicinna_medical',
    watchOnInstagram: 'Watch on Instagram',
    openPlatform: 'Watch Original Video',
    nextReel: 'Next Video',
    prevReel: 'Previous Video',
    closeModal: 'Close Player',
    bookConsultation: 'Request Free Consultation for this Procedure',
    viewsLabel: 'views',
    reelBadge: 'Exclusive Reel',
    swipeHint: 'Swipe to explore more reels',
  },
  fr: {
    trustBadge: '★ ★ ★ ★ ★ +2000 Patients Rétablis',
    headlinePart1: 'Comme eux,',
    headlineHighlight: 'retrouvez votre sérénité',
    headlinePart2: 'et votre santé',
    subtitle:
      'Témoignages vérifiés, conseils chirurgicaux et vidéos en direct de nos comptes officiels.',
    followInstagram: 'Suivre sur Instagram',
    handle: '@avicinna_medical',
    watchOnInstagram: 'Voir sur Instagram',
    openPlatform: 'Ouvrir sur la Plateforme',
    nextReel: 'Vidéo Suivante',
    prevReel: 'Vidéo Précédente',
    closeModal: 'Fermer le Lecteur',
    bookConsultation: 'Demander une Consultation Gratuite',
    viewsLabel: 'vues',
    reelBadge: 'Reel Exclusif',
    swipeHint: 'Glissez pour découvrir plus de vidéos',
  },
};

function extractInstagramReelId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function SocialReelsSection() {
  const { language, direction } = useLanguage();
  const langKey = language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar';
  const t = dict[langKey];
  const isRtl = direction === 'rtl';

  const { socialVideos } = useData();
  const activeVideos = (socialVideos || []).filter((v) => v.isActive);

  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedVideo = selectedVideoIndex !== null ? activeVideos[selectedVideoIndex] : null;

  const handleOpenVideo = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedVideoIndex(null);
  };

  const handleNextVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex < activeVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    } else {
      setSelectedVideoIndex(0);
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    } else {
      setSelectedVideoIndex(activeVideos.length - 1);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowRight') isRtl ? handlePrevVideo() : handleNextVideo();
      if (e.key === 'ArrowLeft') isRtl ? handleNextVideo() : handlePrevVideo();
    };
    if (selectedVideoIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedVideoIndex, isRtl]);

  if (activeVideos.length === 0) {
    return null;
  }

  return (
    <section
      id="social-reels"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#080E1A] dark:via-[#0B1528] dark:to-[#080E1A] overflow-hidden transition-colors duration-300"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/10 dark:bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Trust Stars Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-black shadow-sm mb-4">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{t.trustBadge}</span>
          </div>

          {/* Headline inspired by client's image */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            <span>{t.headlinePart1} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 dark:from-amber-400 dark:via-rose-400 dark:to-sky-400">
              {t.headlineHighlight}{' '}
            </span>
            <span>{t.headlinePart2}</span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* Instagram Account Follow Link Pill */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/avicinna_medical?exln=MWRhbGJkZDdrcXNjYg=="
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.03] active:scale-95 transition-all"
            >
              {/* Instagram Camera Icon SVG */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{t.followInstagram}</span>
              <span className="opacity-80 font-mono text-[11px] ltr:ml-1 rtl:mr-1">
                {t.handle}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Video Cards Grid / Carousel */}
        {/* On Mobile: Horizontal snap scroll with 2 cards visible like Image 2 */}
        {/* On Desktop: 4-column balanced grid */}
        <div
          ref={scrollContainerRef}
          className="mt-12 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {activeVideos.map((video, idx) => {
            const ytId = extractYouTubeId(video.videoUrl);
            const igId = extractInstagramReelId(video.videoUrl);
            const poster =
              video.thumbnailUrl ||
              (ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80');

            return (
              <motion.div
                key={video.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group relative shrink-0 snap-start w-[240px] sm:w-auto aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:shadow-sky-500/15 cursor-pointer flex flex-col justify-between"
                onClick={() => handleOpenVideo(idx)}
              >
                {/* Poster Image */}
                <img
                  src={poster}
                  alt={video.title[langKey] || video.title.ar}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.92] group-hover:brightness-100"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40 pointer-events-none" />

                {/* Top Bar Badges */}
                <div className="relative z-10 p-3.5 flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {video.category?.[langKey] || video.category?.ar || t.reelBadge}
                  </span>

                  {/* Platform Icon Badge */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md text-white border border-white/10">
                    {video.platform === 'youtube' ? (
                      <span className="text-red-500 text-xs font-black">▶</span>
                    ) : (
                      <svg className="w-3.5 h-3.5 fill-pink-400" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Center Big Play Button (Matching Client's Reference Image) */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-red-600/30 scale-125 animate-ping pointer-events-none" />
                    {/* Solid play pill/button exactly matching YouTube / Reel preview */}
                    <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-2xl shadow-red-600/50 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white text-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Title & Details */}
                <div className="relative z-10 p-4 text-white text-right rtl:text-right ltr:text-left">
                  <h3 className="text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 text-white drop-shadow-md">
                    {video.title[langKey] || video.title.ar}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-medium opacity-90">{video.authorHandle || '@avicinna_medical'}</span>
                    {video.views && (
                      <span className="font-bold text-amber-400">
                        {video.views} {t.viewsLabel}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-3 flex sm:hidden items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>{t.swipeHint}</span>
          <span className="rtl:rotate-180">→</span>
        </div>
      </div>

      {/* Glassmorphic Reels Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={handleCloseModal} />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-md aspect-[9/16] max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between"
            >
              {/* Modal Top Bar */}
              <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950/90 to-transparent text-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-amber-400">{selectedVideo.authorHandle}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm">
                    {selectedVideo.category?.[langKey] || selectedVideo.category?.ar}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={t.openPlatform}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={t.closeModal}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Core */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                {(() => {
                  const ytId = extractYouTubeId(selectedVideo.videoUrl);
                  const igId = extractInstagramReelId(selectedVideo.videoUrl);

                  if (selectedVideo.videoType === 'upload' || selectedVideo.videoUrl.match(/\.(mp4|webm|mov)(\?|$)/i)) {
                    return (
                      <video
                        src={selectedVideo.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    );
                  }

                  if (ytId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                        title={selectedVideo.title[langKey] || selectedVideo.title.ar}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }

                  if (igId) {
                    return (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center text-white bg-slate-950">
                        <img
                          src={selectedVideo.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="relative z-10 max-w-xs space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-xl">
                            <Play className="w-8 h-8 fill-current translate-x-0.5" />
                          </div>
                          <h4 className="font-extrabold text-base leading-snug">
                            {selectedVideo.title[langKey] || selectedVideo.title.ar}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {selectedVideo.subtitle?.[langKey] || selectedVideo.subtitle?.ar || t.subtitle}
                          </p>
                          <a
                            href={selectedVideo.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-500/25 active:scale-95 transition-all"
                          >
                            <span>{t.watchOnInstagram}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  }

                  // Default Fallback
                  return (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                      <Play className="w-12 h-12 text-rose-500 mb-3" />
                      <p className="text-sm font-bold">{selectedVideo.title[langKey] || selectedVideo.title.ar}</p>
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold"
                      >
                        {t.openPlatform}
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Prev / Next Video Floating Arrows */}
              <button
                type="button"
                onClick={handlePrevVideo}
                className="absolute top-1/2 -left-3 sm:-left-12 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/90 sm:bg-slate-800 text-white border border-white/20 shadow-xl hover:bg-slate-700 transition-all"
                aria-label={t.prevReel}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextVideo}
                className="absolute top-1/2 -right-3 sm:-right-12 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/90 sm:bg-slate-800 text-white border border-white/20 shadow-xl hover:bg-slate-700 transition-all"
                aria-label={t.nextReel}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Modal Bottom CTA */}
              <div className="relative z-20 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                <a
                  href="#consultation"
                  onClick={handleCloseModal}
                  className="w-full text-center inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-sky-600/25 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.bookConsultation}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
