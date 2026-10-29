'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Play, Star, MapPin, Calendar, ArrowRight, ArrowLeft, X, ShieldCheck, CheckCircle2, Stethoscope, Building2 } from 'lucide-react';
import { getPatientName, PatientStory } from '@/data/stories';

export const PatientStoriesPreview: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { stories } = useData();
  const isRtl = direction === 'rtl';
  const [selectedStory, setSelectedStory] = useState<PatientStory | null>(null);

  return (
    <section id="stories" className="py-20 bg-white dark:bg-[#080E1A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.patientStories.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-4">
            {t.patientStories.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.patientStories.subtitle}
          </p>
        </div>

        {/* Stories Grid (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail / Video */}
              <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={story.image}
                  alt={getPatientName(story.patientName, language)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Treatment Pill */}
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {story.treatment[language]}
                </div>

                {/* Acoustic Pulse Wave Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedStory(story)}
                    aria-label="Play patient story video"
                    className="group/btn relative flex items-center justify-center cursor-pointer p-3"
                  >
                    {/* Acoustic wave ripple waves */}
                    <span className="absolute inset-0 rounded-full bg-sky-400/35 animate-ping opacity-75" />
                    <span className="absolute -inset-2 rounded-full bg-teal-400/30 animate-pulse" />
                    <div className="relative w-14 h-14 rounded-full bg-white/95 dark:bg-slate-950/90 text-[#0097FB] dark:text-sky-400 shadow-2xl flex items-center justify-center group-hover/btn:scale-115 group-hover/btn:bg-gradient-to-br group-hover/btn:from-sky-500 group-hover/btn:to-teal-500 group-hover/btn:text-white transition-all duration-300 border border-white/20">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Patient Country & Duration */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
                    {story.country[language]}
                  </span>
                  <span className="bg-black/50 px-2.5 py-0.5 rounded-full text-[11px] backdrop-blur-xs font-medium">
                    {story.duration[language]}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#032654] dark:text-white mb-2 leading-snug group-hover:text-[#0097FB] dark:group-hover:text-sky-400 transition-colors">
                    {story.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed line-clamp-3">
                    {story.shortStory[language]}
                  </p>
                </div>

                {/* Link to Detail Page or Lightbox */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedStory(story)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0097FB] hover:text-[#032654] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'مشاهدة تجربة التعافي' : language === 'fr' ? 'Voir le Témoignage' : 'Watch Story & Recovery'}</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>

                  <Link
                    href={`/patient-stories/${story.slug}`}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Stories CTA */}
        <div className="text-center">
          <Link
            href="/patient-stories"
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200 cursor-pointer"
          >
            <span>{t.patientStories.allStoriesCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>

      {/* Cinema Lightbox Video Player & Recovery Timeline Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-slate-900 text-white shadow-2xl z-10"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-5 bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-sky-400/30 bg-black">
                    <img
                      src={selectedStory.image}
                      alt={getPatientName(selectedStory.patientName, language)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold leading-snug">
                      {getPatientName(selectedStory.patientName, language)}
                    </h3>
                    <p className="text-xs text-sky-400">
                      {selectedStory.treatment[language]} • {selectedStory.country[language]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Player Presentation */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src="/videos/logo-reveal.mp4"
                  autoPlay
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Story Details & Recovery Timeline */}
              <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Stethoscope className="w-4 h-4 text-sky-400" />
                    <span>{selectedStory.doctorName[language]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>{selectedStory.hospital[language]}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0 / 5.0</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedStory.shortStory[language]}
                </p>

                {/* Timeline Checkpoints */}
                {selectedStory.timeline && selectedStory.timeline.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      {language === 'ar' ? 'مراحل رحلة التعافي' : 'Recovery Milestones'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedStory.timeline.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                          <div>
                            <span className="font-bold text-white block">{step.step[language]}</span>
                            <span className="text-[11px] text-slate-400">{step.detail[language]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-2 flex justify-end gap-3">
                  <Link
                    href="#consultation"
                    onClick={() => setSelectedStory(null)}
                    className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:scale-103 transition-transform"
                  >
                    {language === 'ar' ? 'احصل على خطة علاج مماثلة' : 'Get Similar Treatment Plan'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
