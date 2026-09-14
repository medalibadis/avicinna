'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Play, Star, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export const PatientStoriesPreview: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { stories } = useData();
  const isRtl = direction === 'rtl';

  return (
    <section id="stories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20">
            {t.patientStories.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight mb-4">
            {t.patientStories.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {t.patientStories.subtitle}
          </p>
        </div>

        {/* Stories Grid (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.slice(0, 3).map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail / Video */}
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={story.image}
                  alt={story.patientName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Treatment Pill */}
                <div className="absolute top-3 right-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {story.treatment[language]}
                </div>

                {/* Video Indicator */}
                {story.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#0097FB] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#0097FB] group-hover:text-white transition-all">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Patient Country & Duration */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
                    {story.country[language]}
                  </span>
                  <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
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

                  <h3 className="text-base sm:text-lg font-bold text-[#032654] mb-2 leading-snug group-hover:text-[#0097FB] transition-colors">
                    {story.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                    {story.shortStory[language]}
                  </p>
                </div>

                {/* Link to Detail Page */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/patient-stories/${story.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0097FB] hover:text-[#032654] transition-colors"
                  >
                    <span>{t.patientStories.readStory}</span>
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
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200"
          >
            <span>{t.patientStories.allStoriesCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
