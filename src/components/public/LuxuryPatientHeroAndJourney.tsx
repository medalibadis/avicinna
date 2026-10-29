// ============================================================================
// FILE: src/components/public/LuxuryPatientHeroAndJourney.tsx
// Purpose:
// 1. Replaces static blue Hero (image_77bf06) with Ambient Auto-Playing Video +
//    Interactive Live Autocomplete Search Dock + Staggered Glass Trust Pills
// 2. Replaces cramped 8-step cards (image_77bba3) with an Interactive
//    Scroll-Linked & Clickable Patient Journey Showcase
// ============================================================================
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  FileText,
  Stethoscope,
  CreditCard,
  Plane,
  HeartHandshake,
  Activity,
  CheckCircle2,
  Clock,
  Building2,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export function LuxuryCinemaHero({ locale = 'ar' }: { locale?: 'ar' | 'fr' | 'en' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const isRTL = locale === 'ar';

  const quickSpecialties =
    locale === 'ar'
      ? ['جراحة الأورام والسرطان', 'جراحة القلب والأوعية', 'جراحة المخ والأعصاب', 'زراعة الأعضاء', 'الروبوت الجراحي Da Vinci']
      : locale === 'fr'
      ? ['Oncologie & Cancer', 'Chirurgie Cardiaque', 'Neurochirurgie', 'Greffe d’Organes', 'Chirurgie Robotique']
      : ['Medical Oncology', 'Cardiovascular Surgery', 'Neurosurgery', 'Organ Transplant', 'Robotic Surgery'];

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex min-h-[92dvh] w-full items-center justify-center overflow-hidden bg-[#050C18] pt-28 pb-20 text-white"
    >
      {/* 1. AUTO-PLAYING AMBIENT MEDICAL VIDEO BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-105 object-cover opacity-35 filter saturate-125"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-doctors-walking-in-a-modern-hospital-corridor-41446-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Multi-layer Cinema Vignette Scrim & Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050C18]/90 via-[#07162C]/75 to-[#050C18]" />
        <div className="absolute -top-32 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      {/* 2. FOREGROUND CONTENT WITH STAGGERED SPRING CHOREOGRAPHY */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Animated Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold text-sky-300 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            {locale === 'ar'
              ? 'وجهتكم الأولى للرعاية الصحية المتقدمة في إسطنبول'
              : locale === 'fr'
              ? 'Votre Destination d’Excellence Médicale à Istanbul'
              : 'Your Premier Destination for JCI Healthcare in Istanbul'}
          </span>
        </motion.div>

        {/* Balanced Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.06 }}
          className="mx-auto max-w-4xl text-4xl font-black leading-[1.18] tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {locale === 'ar' ? (
            <>
              أفضل المستشفيات وأشهر الأطباء في تركيا{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                لرعايتكم الصحية
              </span>{' '}
              بأحدث الاعتمادات العالمية
            </>
          ) : locale === 'fr' ? (
            <>
              Les Meilleurs Hôpitaux & Chirurgiens de Turquie{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                Pour Votre Santé
              </span>
            </>
          ) : (
            <>
              Turkey’s Premier JCI Hospitals & World-Renowned Surgeons{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                For Your Recovery
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base text-pretty"
        >
          {locale === 'ar'
            ? 'نربطكم بأعلى المستشفيات المعتمدة دولياً (JCI) ونخبة الجراحين الاستشاريين في تركيا، مع مرافقة علاجية ولوجستية شاملة واستشارة مجانية فورية.'
            : locale === 'fr'
            ? 'Accédez aux centres hospitaliers accrédités JCI et aux professeurs les plus réputés d’Istanbul avec un accompagnement VIP 24/7.'
            : 'Direct access to JCI-accredited hospitals and board-certified professors in Istanbul with full VIP logistics and free 24h medical evaluation.'}
        </motion.p>

        {/* INTERACTIVE GLASSMORPHIC SEARCH DOCK WITH SPECIALTY PILLS */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28, delay: 0.18 }}
          className="relative mx-auto mt-9 max-w-2xl"
        >
          <div
            className={`flex items-center gap-2 rounded-full border bg-white/95 dark:bg-slate-900/95 p-2 text-slate-900 dark:text-white shadow-2xl transition-all duration-300 backdrop-blur-xl ${
              searchFocused
                ? 'border-sky-400 ring-4 ring-sky-500/25'
                : 'border-white/20 shadow-black/40'
            }`}
          >
            <Search className="ms-3 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === 'ar'
                  ? 'ابحث عن طبيب، مستشفى، أو تخصص طبي (مثال: أجيبادم، أورام)...'
                  : locale === 'fr'
                  ? 'Rechercher un chirurgien, un hôpital ou une spécialité...'
                  : 'Search by surgeon, hospital, or procedure (e.g. CyberKnife, Acıbadem)...'
              }
              className="w-full bg-transparent px-2 py-2 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <Link
              href={searchQuery ? `/treatments?search=${encodeURIComponent(searchQuery)}` : '/treatments'}
              className="shrink-0 rounded-full bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/25 active:scale-95 transition-all"
            >
              {locale === 'ar' ? 'بحث سريع' : locale === 'fr' ? 'Rechercher' : 'Quick Search'}
            </Link>
          </div>

          {/* Interactive Quick-Filter Specialty Chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
            {quickSpecialties.map((chip) => (
              <motion.button
                key={chip}
                type="button"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSearchQuery(chip)}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white cursor-pointer"
              >
                {chip}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Primary Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#consultation-form"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25"
          >
            <Calendar className="h-4 w-4" />
            <span>
              {locale === 'ar'
                ? 'احصل على استشارة مجانية'
                : locale === 'fr'
                ? 'Consultation Gratuite'
                : 'Get Free Medical Evaluation'}
            </span>
          </motion.a>

          <motion.a
            href="#specialties"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md hover:bg-white/10"
          >
            <span>
              {locale === 'ar'
                ? 'اكتشف تخصصاتنا'
                : locale === 'fr'
                ? 'Découvrir nos Spécialités'
                : 'Explore Specialties'}
            </span>
            {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </motion.a>
        </motion.div>

        {/* Luxury Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-white/10 pt-8 text-xs text-slate-300"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{locale === 'ar' ? 'مستشفيات معتمدة دولياً JCI' : 'JCI Accredited Hospitals'}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-sky-400" />
            <span>{locale === 'ar' ? 'كبار الجراحين الاستشاريين' : 'Board-Certified Surgeons'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-400" />
            <span>{locale === 'ar' ? 'مرافقة VIP وإقامة 5 نجوم' : 'VIP Coordination & 5★ Stay'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>{locale === 'ar' ? 'رد طبي خلال 24 ساعة' : '24h Medical Response'}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * INTERACTIVE 8-STEP PATIENT JOURNEY SHOWCASE (Fixes cramped row in image_77bba3)
 */
const JOURNEY_STEPS = [
  {
    num: '01',
    icon: MessageCircle,
    title: { ar: 'تواصل معنا', fr: 'Contact Initial', en: 'Initial Contact' },
    desc: {
      ar: 'تواصل فوري مع منسق طبي يتحدث لغتك عبر واتساب أو الموقع على مدار الساعة.',
      fr: 'Échange immédiat avec un coordinateur médical dédié dans votre langue 24/7.',
      en: 'Instant connection with a dedicated native-speaking medical coordinator 24/7.',
    },
    badge: { ar: 'استجابة خلال 10 دقائق', fr: 'Réponse en 10 min', en: '10-Min Response' },
  },
  {
    num: '02',
    icon: FileText,
    title: { ar: 'إرسال الملف الطبي', fr: 'Dossier Médical', en: 'Medical Records' },
    desc: {
      ar: 'إرسال التقارير وصور الأشعة بشكل مشفر وسري بالكامل لمراجعتها.',
      fr: 'Transmission sécurisée de vos examens et imageries médicales.',
      en: 'Encrypted, confidential upload of your scans and diagnostic reports.',
    },
    badge: { ar: 'تشفير آمن 100%', fr: 'Chiffrement Sécurisé', en: '100% Encrypted' },
  },
  {
    num: '03',
    icon: Stethoscope,
    title: { ar: 'تقييم الحالة مجاناً', fr: 'Avis Médical Gratuit', en: 'Free Board Evaluation' },
    desc: {
      ar: 'دراسة ملفك من قبل كبار البروفيسورات وتقديم خطة علاجية أولية مجانية خلال 24 ساعة.',
      fr: 'Analyse par nos professeurs et plan de traitement sous 24h sans engagement.',
      en: 'Comprehensive review by chief surgeons with a tailored treatment plan within 24h.',
    },
    badge: { ar: 'بدون أي التزام مالي', fr: 'Sans Engagement', en: 'No Obligation' },
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: { ar: 'اختيار الطبيب والمستشفى', fr: 'Choix Hôpital & Chirurgien', en: 'Surgeon & Hospital Match' },
    desc: {
      ar: 'ترشيح أفضل مستشفى معتمد من JCI والجراح الأكثر خبرة في حالتك الدقيقة.',
      fr: 'Sélection de l’établissement JCI et du spécialiste le plus qualifié.',
      en: 'Matching you with the highest-rated JCI hospital and specialist for your case.',
    },
    badge: { ar: 'أعلى نسب نجاح', fr: 'Taux de Réussite Élevé', en: 'Top Success Rates' },
  },
  {
    num: '05',
    icon: CreditCard,
    title: { ar: 'خطة وتكلفة السفر', fr: 'Devis Transparent', en: 'Transparent Quote' },
    desc: {
      ar: 'عرض سعر رسمي شامل وواضح بنسبة 100% بدون أي رسوم مخفية.',
      fr: 'Estimation officielle tout compris, transparente et sans frais cachés.',
      en: '100% transparent, itemized package pricing with zero hidden fees.',
    },
    badge: { ar: 'توفير حتى 60%', fr: 'Économie jusqu’à 60%', en: 'Save up to 60%' },
  },
  {
    num: '06',
    icon: Plane,
    title: { ar: 'ترتيب السفر والإقامة', fr: 'Vols, Visa & Hôtel 5★', en: 'VIP Travel & 5★ Stay' },
    desc: {
      ar: 'إصدار الدعوة الطبية للفيزا وحجز الفنادق الفاخرة القريبة من المستشفى.',
      fr: 'Assistance visa médical et réservation d’hôtels 5 étoiles adaptés.',
      en: 'Medical visa support and 5-star recovery hotel arrangements near your clinic.',
    },
    badge: { ar: 'خدمة فندقية VIP', fr: 'Service Hôtelier 5★', en: '5-Star Comfort' },
  },
  {
    num: '07',
    icon: HeartHandshake,
    title: { ar: 'الاستقبال والمرافقة VIP', fr: 'Accueil VIP & Interprète', en: 'VIP Airport & Interpreter' },
    desc: {
      ar: 'استقبال خاص في المطار بسيارة VIP ومرافق ومترجم طبي شخصي طوال رحلتك.',
      fr: 'Transfert privé depuis l’aéroport et interprète médical personnel à chaque étape.',
      en: 'Chauffeured VIP airport pickup and a personal medical interpreter at your side.',
    },
    badge: { ar: 'مترجم مرافق 24/7', fr: 'Interprète Dédié 24/7', en: 'Dedicated Interpreter' },
  },
  {
    num: '08',
    icon: Activity,
    title: { ar: 'المتابعة المستمرة بعد العودة', fr: 'Suivi Post-Opératoire', en: 'Lifetime Aftercare' },
    desc: {
      ar: 'متابعة طبية دورية عن بُعد مع طبيبك الجراح بعد عودتك سالماً إلى وطنك.',
      fr: 'Consultations de suivi à distance après votre retour à domicile.',
      en: 'Continuous remote follow-ups with your surgeon after you return home safely.',
    },
    badge: { ar: 'رعاية ممتدة مدى الحياة', fr: 'Suivi Continu', en: 'Lifetime Support' },
  },
];

export function InteractivePatientJourney({ locale = 'ar' }: { locale?: 'ar' | 'fr' | 'en' }) {
  const [activeStep, setActiveStep] = useState(0);
  const isRTL = locale === 'ar';

  return (
    <section
      id="patient-journey"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-slate-50 py-24 dark:bg-[#070E1C] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-sky-500/10 px-4 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20">
            {locale === 'ar'
              ? 'بروتوكول الرعاية الشامل والمدروس'
              : locale === 'fr'
              ? 'Parcours Patient Accompagné'
              : 'Seamless Recovery Protocol'}
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white text-balance">
            {locale === 'ar'
              ? 'رحلتك العلاجية معنا من الاستفسار إلى تمام الشفاء'
              : locale === 'fr'
              ? 'Votre Parcours de Soins en 8 Étapes Claires'
              : 'Your 8-Step Medical Journey from Inquiry to Recovery'}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {locale === 'ar'
              ? 'نضمن لك تجربة علاجية سلسة وآمنة وفق أرقى المعايير العالمية مع مرافقة شخصية على مدار الساعة.'
              : locale === 'fr'
              ? 'Une expérience médicale fluide, sécurisée et d’excellence internationale.'
              : 'A seamless, internationally accredited medical journey with dedicated 24/7 personal care.'}
          </p>
        </div>

        {/* Interactive 8-Step Bento Stepper with Connected Visual Beam */}
        <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8 relative">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                whileHover={{ y: -5 }}
                className={`group relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-white text-slate-950 shadow-xl shadow-sky-500/15 dark:bg-slate-900 dark:text-white scale-[1.03]'
                    : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 hover:dark:bg-slate-900/80'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-journey-ring"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-sky-500 dark:ring-sky-400"
                  />
                )}
                <span className="font-mono text-xs font-black text-sky-600 dark:text-sky-400 tabular-nums">
                  {step.num}
                </span>
                <div
                  className={`my-3 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md shadow-sky-500/25'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-sky-500/10 group-hover:text-sky-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold leading-snug">
                  {step.title[locale]}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Expanded Step Spotlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-between gap-5 rounded-3xl border border-sky-500/30 bg-white p-6 shadow-xl sm:flex-row dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-xl font-black text-white tabular-nums shadow-lg shadow-sky-500/20">
                {JOURNEY_STEPS[activeStep].num}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {JOURNEY_STEPS[activeStep].title[locale]}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    {JOURNEY_STEPS[activeStep].badge[locale]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {JOURNEY_STEPS[activeStep].desc[locale]}
                </p>
              </div>
            </div>

            <a
              href="#consultation"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              <span>{locale === 'ar' ? 'ابدأ خطوتك الآن' : 'Start Step Now'}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
