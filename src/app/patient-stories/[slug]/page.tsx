'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { getPatientName } from '@/data/stories';
import {
  Star,
  Calendar,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Quote,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientStoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, setLanguage, direction, t } = useLanguage();
  const { stories: patientStoriesData } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const story = patientStoriesData.find((s) => s.slug === slug);

  if (!story) {
    return (
      <div className="pt-32 pb-20 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ar'
            ? 'لم يتم العثور على القصة المطلوبة'
            : language === 'fr'
            ? 'Témoignage introuvable'
            : 'Story Not Found'}
        </h1>
        <Link
          href="/patient-stories"
          className="inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-full"
        >
          <span>
            {language === 'ar'
              ? 'العودة لقصص المرضى'
              : language === 'fr'
              ? 'Retour aux Témoignages'
              : 'Back to Patient Stories'}
          </span>
        </Link>
      </div>
    );
  }

  const content = {
    ar: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbStories: 'تجارب المرضى',
      verifiedStory: 'تجربة مريض موثقة ومعتمدة',
      timelineHeading: 'الجدول الزمني للرحلة العلاجية في إسطنبول',
      experienceHeading: 'تفاصيل الرحلة والتعافي',
      hospitalLabel: 'المستشفى الشريك:',
      doctorLabel: 'الطبيب المعالج:',
      stayLabel: 'مدة الإقامة في تركيا:',
      bookSimilarCta: 'هل تعاني من حالة مشابهة وترغب في استشارة الطبيب؟',
      bookSimilarSubtitle:
        'يمكنك إرسال تقاريرك الطبية لعرضها على نفس الفريق الجراحي والحصول على خطة علاجية مخصصة.',
      consultationBtn: 'طلب استشارة لحالتي',
      whatsappBtn: 'تواصل عبر واتساب',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbStories: 'Patient Stories',
      verifiedStory: 'Verified Patient Journey',
      timelineHeading: 'Step-by-Step Clinical Timeline in Istanbul',
      experienceHeading: 'The Treatment Experience & Recovery',
      hospitalLabel: 'Partner Hospital:',
      doctorLabel: 'Treating Physician:',
      stayLabel: 'Duration of Stay in Turkey:',
      bookSimilarCta: 'Suffering From a Similar Condition?',
      bookSimilarSubtitle:
        'Submit your medical reports to have them reviewed by this surgical team for an individualized assessment.',
      consultationBtn: 'Request Case Consultation',
      whatsappBtn: 'Chat on WhatsApp',
    },
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbStories: 'Témoignages de Patients',
      verifiedStory: 'Témoignage Vérifié et Conforme',
      timelineHeading: 'Chronologie du Séjour Médical à Istanbul',
      experienceHeading: 'Déroulement de l’Intervention & Rétablissement',
      hospitalLabel: 'Hôpital Partenaire :',
      doctorLabel: 'Chirurgien :',
      stayLabel: 'Durée du Séjour en Turquie :',
      bookSimilarCta: 'Vous Souffrez d’une Pathologie Similaire ?',
      bookSimilarSubtitle:
        'Transmettez vos examens pour une étude personnalisée par la même équipe chirurgicale.',
      consultationBtn: 'Demander un Avis Médical',
      whatsappBtn: 'Échanger sur WhatsApp',
    },
  }[language];

  // Schema.org Review
  const storySchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: story.title[language],
    reviewBody: story.shortStory[language],
    itemReviewed: {
      '@type': 'MedicalBusiness',
      name: 'AVICINNA Medical Tourism Istanbul',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200',
    },
    author: {
      '@type': 'Person',
      name: getPatientName(story.patientName, language),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: story.rating,
      bestRating: 5,
    },
  };

  const patientDisplayName = getPatientName(story.patientName, language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storySchema) }}
      />
      <div className="pt-24 pb-16 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            {content.breadcrumbHome}
          </Link>
          <ArrowIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <Link href="/patient-stories" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            {content.breadcrumbStories}
          </Link>
          <ArrowIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-900 dark:text-white font-semibold">{patientDisplayName}</span>
        </div>
      </div>

      {/* Story Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 shadow-md">
              <img
                src={story.image}
                alt={patientDisplayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{content.verifiedStory}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-sky-900/50">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{story.treatment[language] || story.treatment.ar}</span>
              </div>

              {/* Inline Language Switcher Pill */}
              <div dir="ltr" className="relative inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 p-1 shadow-2xs">
                {(['fr', 'ar', 'en'] as const).map((lang) => {
                  const isSelected = language === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`relative px-3 py-0.5 rounded-full text-xs font-black uppercase transition-all duration-200 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#0097FB] text-white shadow-md shadow-[#0097FB]/40 ring-1 ring-[#0097FB]/60'
                          : 'text-slate-700 dark:text-slate-300 hover:text-[#0097FB] dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="story-active-lang-pill"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0097FB] to-[#0082d6] shadow-md shadow-[#0097FB]/40 -z-0 pointer-events-none"
                        />
                      )}
                      <span className="relative z-10">{lang}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {story.title[language] || story.title.ar}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <User className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{patientDisplayName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                    <span>{story.country[language] || story.country.ar}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <Clock className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                    <span>{story.duration[language] || story.duration.ar}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/40 text-amber-500">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-sky-950/40 border border-blue-100 dark:border-sky-900/50 flex items-start gap-3">
                  <Quote className="w-6 h-6 text-blue-400 dark:text-sky-400 shrink-0 mt-1" />
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-sky-200 italic leading-relaxed">
                    {story.shortStory[language] || story.shortStory.ar}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Story Narrative & Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Story Paragraphs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
                <span>{content.experienceHeading}</span>
              </h2>
              {(story.fullExperience[language] || story.fullExperience.ar || []).map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Step-by-Step Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span>{content.timelineHeading}</span>
              </h2>

              <div className="relative border-r rtl:border-r ltr:border-l border-sky-200/80 dark:border-sky-800 mr-4 rtl:mr-4 rtl:ml-0 ltr:ml-4 ltr:mr-0 space-y-6">
                {(story.timeline || []).map((item, idx) => (
                  <div key={idx} className="relative pr-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
                    <div className="absolute -right-2 rtl:-right-2 rtl:left-auto ltr:-left-2 ltr:right-auto top-1 w-4 h-4 rounded-full bg-sky-500 border-4 border-white dark:border-slate-900 shadow" />
                    <div className="font-bold text-sky-600 dark:text-sky-400 text-xs sm:text-sm">
                      {item.step[language] || item.step.ar}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                      {item.detail[language] || item.detail.ar}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Clinical Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                {language === 'ar'
                  ? 'بيانات الإجراء الطبي'
                  : language === 'fr'
                  ? 'Détails de l’Intervention'
                  : 'Procedure Details'}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <div className="text-slate-400 dark:text-slate-500 font-medium">{content.doctorLabel}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{story.doctorName[language]}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 font-medium">{content.hospitalLabel}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{story.hospital[language]}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 font-medium">{content.stayLabel}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{story.duration[language]}</div>
                </div>
              </div>
            </div>

            {/* Similar Case CTA */}
            <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-950">
              <h3 className="text-lg font-bold mb-2">{content.bookSimilarCta}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {content.bookSimilarSubtitle}
              </p>
              <div className="space-y-3">
                <Link
                  href={`/contact?specialty=${story.treatmentSlug}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{content.consultationBtn}</span>
                </Link>
                <a
                  href={`https://wa.me/905000000000?text=I%20read%20${story.patientName}'s%20story%20and%20want%20to%20consult`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{content.whatsappBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
