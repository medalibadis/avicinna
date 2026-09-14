'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Star,
  Play,
  Calendar,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Quote,
  Sparkles,
} from 'lucide-react';

export default function PatientStoriesPage() {
  const { language, direction, t } = useLanguage();
  const { stories: patientStoriesData, treatments: treatmentsData } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const content = {
    ar: {
      badge: 'قصص نجاح واقعية',
      title: 'تجارب وقصص شفاء مرضانا في إسطنبول',
      subtitle:
        'استمع إلى تجارب حقيقية لمرضى من مختلف الدول العربية والأوروبية اختاروا منصة أفيسينا واستعادوا صحتهم وجودة حياتهم بفضل الله ثم كفاءة أطبائنا.',
      allSpecialties: 'جميع التخصصات',
      readStory: 'قراءة القصة وتفاصيل الرحلة',
      videoStory: 'قصة موثقة بالفيديو',
      daysInIstanbul: 'مدة الإقامة:',
      doctorLabel: 'الطبيب المعالج:',
      hospitalLabel: 'المستشفى:',
    },
    en: {
      badge: 'Authentic Patient Journeys',
      title: 'Patient Stories & Recovery in Istanbul',
      subtitle:
        'Discover real recovery testimonials from international patients who placed their trust in AVICINNA and restored their health through world-class surgical care.',
      allSpecialties: 'All Specialties',
      readStory: 'Read Full Journey & Timeline',
      videoStory: 'Video Testimonial',
      daysInIstanbul: 'Length of Stay:',
      doctorLabel: 'Treating Physician:',
      hospitalLabel: 'Hospital:',
    },
    fr: {
      badge: 'Témoignages de Guérison Réels',
      title: 'Histoires de Patients & Expériences à Istanbul',
      subtitle:
        'Retrouvez les témoignages émouvants de nos patients internationaux ayant retrouvé la santé et la mobilité grâce à l’excellence chirurgicale d’AVICINNA.',
      allSpecialties: 'Toutes les Spécialités',
      readStory: 'Lire le Témoignage Complet',
      videoStory: 'Témoignage Vidéo',
      daysInIstanbul: 'Durée du séjour :',
      doctorLabel: 'Chirurgien :',
      hospitalLabel: 'Hôpital :',
    },
  }[language];

  const filteredStories = patientStoriesData.filter((story) => {
    if (selectedSpecialty === 'all') return true;
    return story.treatmentSlug === selectedSpecialty;
  });

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Filter Tabs Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4 sm:p-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedSpecialty('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === 'all'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {content.allSpecialties}
            </button>
            {treatmentsData.slice(0, 5).map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSpecialty(item.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSpecialty === item.slug
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.title[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
            >
              {/* Image & Video Badge */}
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={story.image}
                  alt={story.patientName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Video Indicator */}
                {story.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-sky-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Country Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>{story.country[language]}</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{story.duration[language]}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-600 uppercase">
                      {story.treatment[language]}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {story.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    &ldquo;{story.shortStory[language]}&rdquo;
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-500" />
                      <span className="font-semibold text-slate-800">{story.patientName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>{story.hospital[language]}</span>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/patient-stories/${story.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{content.readStory}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
