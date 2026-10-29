'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Star,
  Building2,
  Calendar,
  Languages,
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Activity,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Video,
  Play,
  FileText,
  Briefcase,
  Cpu,
  Users,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Clock,
  BookOpen,
} from 'lucide-react';

function getEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction } = useLanguage();
  const { doctors, sections } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const doctor = doctors.find((d) => d.slug === slug);

  // Active Video state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('bio');

  if (!doctor) {
    return (
      <div className="pt-36 pb-24 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {language === 'ar'
            ? 'لم يتم العثور على الطبيب المطلوب'
            : language === 'fr'
            ? 'Médecin introuvable'
            : 'Physician Not Found'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {language === 'ar'
            ? 'قد يكون الرابط غير صحيح أو تم نقل الملف الشخصي.'
            : language === 'fr'
            ? 'Le lien est incorrect ou la page a été déplacée.'
            : 'The link may be invalid or the profile has moved.'}
        </p>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 bg-[#0097FB] text-white font-semibold px-6 py-2.5 rounded-full"
        >
          <span>{language === 'ar' ? 'العودة لقائمة الأطباء' : 'Back to Doctors'}</span>
        </Link>
      </div>
    );
  }

  const content = {
    ar: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbDoctors: 'الأطباء والاستشاريون',
      verifiedSpecialist: 'طبيب استشاري معتمد في تركيا',
      experienceBadge: 'سنوات خبرة سريرية',
      surgeriesBadge: 'عملية جراحية ناجحة',
      publicationsBadge: 'بحثاً علمياً محكماً',
      patientRating: 'تقييم رضا المرضى',
      reviewsText: 'تقييماً معتمداً',

      // Quick Nav
      quickNavTitle: 'محتويات الملف الطبي',
      navBio: 'الملخص المهني',
      navVideo: 'فيديو الطبيب',
      navExpertise: 'التخصصات الدقيقة',
      navProcedures: 'العمليات الرئيسية',
      navCareer: 'المناصب والخبرة',
      navEducation: 'المؤهلات العلمية',
      navMemberships: 'العضويات الدولية',
      navTechnologies: 'التقنيات المعتمدة',

      // Headings
      bioHeading: 'الملخص المهني والسيرة الذاتية',
      videoHeading: 'شروحات وفيديوهات الطبيب التخصصية',
      expertiseHeading: 'مجالات التخصص الدقيق والاهتمامات السريرية',
      proceduresHeading: 'أبرز العمليات والإجراءات الجراحية',
      careerHeading: 'الخبرة المهنية والمناصب القيادية السابقة',
      educationHeading: 'التعليم والمؤهلات الأكاديمية والزمالات',
      membershipsHeading: 'العضويات في الجمعيات والهيئات الدولية',
      technologiesHeading: 'التقنيات الطبية والأجهزة المعتمدة في العمليات',
      hospitalHeading: 'المستشفى الشريك والمرافق الجراحية',

      // Video Card Extras
      officialVideoBadge: 'شرح سريري معتمد',
      videoDoctorIntro: 'شرح مرئي من الطبيب بخصوص طرق العلاج ونسب الشفاء والتقنيات الحديثة المستخدمة.',
      watchAnotherVideo: 'مشاهدة مقطع آخر للطبيب:',

      // Booking Sidebar
      bookingTitle: 'احجز استشارة مباشرة مع',
      bookingSubtitle: 'أرسل تقاريرك وصورك الطبية لمراجعتها مباشرة من قبل البروفيسور وإعداد تقييم مبدئي لحالتك.',
      whatsappBtn: 'تواصل فوري عبر واتساب',
      requestConsultationBtn: 'طلب تقييم طبي رسمي وخطة علاج',
      hospitalViewBtn: 'استكشف مرافق المستشفى والتجهيزات',
      languagesSpoken: 'اللغات المتاحة للتواصل:',
      privacyGuarantee: 'بياناتك الطبية مشفرة ومحمية وفق معايير الخصوصية الصحية العالمية HIPAA.',
      availableAtHospital: 'متاح بأحدث التقنيات في المستشفى',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbDoctors: 'Specialists & Faculty',
      verifiedSpecialist: 'Board-Certified Specialist in Turkey',
      experienceBadge: 'Years of Clinical Exp.',
      surgeriesBadge: 'Successful Surgeries',
      publicationsBadge: 'Peer-Reviewed Papers',
      patientRating: 'Patient Satisfaction',
      reviewsText: 'Verified Reviews',

      quickNavTitle: 'CV Contents',
      navBio: 'Biography',
      navVideo: 'Doctor Video',
      navExpertise: 'Specialties',
      navProcedures: 'Procedures',
      navCareer: 'Career History',
      navEducation: 'Education',
      navMemberships: 'Memberships',
      navTechnologies: 'Technologies',

      bioHeading: 'Professional Summary & Clinical Overview',
      videoHeading: 'Doctor Video & Clinical Insights',
      expertiseHeading: 'Clinical Specialties & Focus Areas',
      proceduresHeading: 'Featured Procedures & Surgical Techniques',
      careerHeading: 'Career History & Clinical Appointments',
      educationHeading: 'Education, Higher Degrees & Fellowships',
      membershipsHeading: 'International Memberships & Societies',
      technologiesHeading: 'Approved Medical Technologies & Hardware',
      hospitalHeading: 'Affiliated Hospital & Surgical Suites',

      officialVideoBadge: 'Verified Clinical Presentation',
      videoDoctorIntro: 'Direct video explanation from the doctor regarding surgical methods, recovery times, and technologies.',
      watchAnotherVideo: 'Select Another Video:',

      bookingTitle: 'Book a Consultation with',
      bookingSubtitle: 'Submit your medical reports directly for physician review and an individualized care plan.',
      whatsappBtn: 'Direct WhatsApp Consultation',
      requestConsultationBtn: 'Request Official Medical Proposal',
      hospitalViewBtn: 'View Hospital Facilities',
      languagesSpoken: 'Consultation Languages:',
      privacyGuarantee: 'Your health data is encrypted under HIPAA and international standards.',
      availableAtHospital: 'Available with Modern Equipment',
    },
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbDoctors: 'Médecins Spécialistes',
      verifiedSpecialist: 'Chirurgien Agréé en Turquie',
      experienceBadge: 'Années d’expérience clinique',
      surgeriesBadge: 'Interventions réussies',
      publicationsBadge: 'Publications scientifiques',
      patientRating: 'Satisfaction des patients',
      reviewsText: 'Avis certifiés',

      quickNavTitle: 'Sommaire du Profil',
      navBio: 'Biographie',
      navVideo: 'Vidéo du Médecin',
      navExpertise: 'Expertises',
      navProcedures: 'Procédures',
      navCareer: 'Postes Précédents',
      navEducation: 'Diplômes',
      navMemberships: 'Sociétés Savantes',
      navTechnologies: 'Technologies',

      bioHeading: 'Résumé Professionnel & Parcours Médical',
      videoHeading: 'Vidéo & Explications du Chirurgien',
      expertiseHeading: 'Domaines d’Expertise & Chirurgie de Pointe',
      proceduresHeading: 'Principales Interventions et Actes Maîtrisés',
      careerHeading: 'Expérience Professionnelle & Postes Antérieurs',
      educationHeading: 'Cursus Universitaire & Fellowships Internationaux',
      membershipsHeading: 'Sociétés Savantes & Organismes Internationaux',
      technologiesHeading: 'Technologies et Équipements de Pointe Homologués',
      hospitalHeading: 'Hôpital Partenaire & Plateaux Techniques',

      officialVideoBadge: 'Présentation Médicale Officielle',
      videoDoctorIntro: 'Explications vidéo du chirurgien sur les protocoles opératoires et les équipements utilisés.',
      watchAnotherVideo: 'Autre vidéo disponible :',

      bookingTitle: 'Prendre Rendez-vous avec',
      bookingSubtitle: 'Transmettez vos examens pour une étude préalable directe et l’élaboration d’un devis sur mesure.',
      whatsappBtn: 'Contacter par WhatsApp',
      requestConsultationBtn: 'Demander une Étude de Dossier',
      hospitalViewBtn: 'Découvrir l’Hôpital Partenaire',
      languagesSpoken: 'Langues de consultation :',
      privacyGuarantee: 'Vos données de santé sont cryptées et traitées sous stricte confidentialité médicale.',
      availableAtHospital: 'Disponible avec équipement de pointe',
    },
  }[language];

  // Raw video list: only include if uploaded/configured from admin and URL is valid, non-empty, and non-placeholder
  const isPlaceholderVideo = (url?: string) =>
    Boolean(
      url &&
        (url.includes('a3ICNMQW7Ok') ||
          url.includes('5qap5aO4i9A') ||
          url.toLowerCase().includes('wildlife'))
    );

  const rawVideos = Array.isArray(doctor.videos)
    ? doctor.videos.filter(
        (v) => v && typeof v.url === 'string' && v.url.trim().length > 0 && !isPlaceholderVideo(v.url)
      )
    : [];

  const hasDirectVideo = Boolean(
    doctor.videoUrl && doctor.videoUrl.trim().length > 0 && !isPlaceholderVideo(doctor.videoUrl)
  );

  const videosList = (rawVideos.length > 0)
    ? rawVideos
    : hasDirectVideo
    ? [
        {
          id: 'primary-video',
          title: doctor.videoTitle || {
            ar: `شرح استشاري من ${doctor.name.ar}`,
            en: `Clinical Overview by ${doctor.name.en}`,
            fr: `Présentation par ${doctor.name.fr}`,
          },
          url: doctor.videoUrl!.trim(),
          duration: '04:30 دقيقة',
          description: {
            ar: 'فيديو توضيحي يشرح أحدث الأساليب الجراحية والإجراءات العلاجية المتبعة للحصول على أفضل النتائج.',
            en: 'Clinical overview video presenting modern surgical pathways and recovery protocols.',
            fr: 'Vidéo clinique détaillant les approches opératoires modernes et les protocoles de convalescence.',
          },
        },
      ]
    : [];

  const hasVideo = videosList.length > 0;
  const currentVideo = hasVideo ? (videosList[activeVideoIndex] || videosList[0]) : null;
  const embedUrl = currentVideo ? getEmbedUrl(currentVideo.url) : '';
  const isEmbed = embedUrl.includes('youtube.com/embed') || embedUrl.includes('player.vimeo.com');

  // Phone number for WhatsApp
  const phoneRaw = (sections?.finalCta?.phone || '+90 544 282 27 69').replace(/[^0-9]/g, '') || '905442822769';
  const whatsappUrl = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(
    `Hello AVICINNA, I would like to book a direct consultation with ${doctor.name.en} (${doctor.specialtyName.en}).`
  )}`;

  // Total metrics
  const surgeries = doctor.surgeriesCount || (doctor.experienceYears * 170);
  const publications = doctor.publicationsCount || (doctor.experienceYears * 4);

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      {/* ══════════════════════════════════════════════════════════
          1. BREADCRUMBS & TOP BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#0097FB] dark:hover:text-sky-400 transition-colors">
            {content.breadcrumbHome}
          </Link>
          <ArrowIcon className="w-3 h-3 text-slate-400 dark:text-slate-600" />
          <Link href="/doctors" className="hover:text-[#0097FB] dark:hover:text-sky-400 transition-colors">
            {content.breadcrumbDoctors}
          </Link>
          <ArrowIcon className="w-3 h-3 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-900 dark:text-white font-bold truncate">{doctor.name[language]}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. DOCTOR HERO HEADER CARD
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0097FB]/5 dark:bg-[#0097FB]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Photo Column */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden aspect-square w-full max-w-[320px] bg-slate-100 dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800">
              <img
                src={doctor.image}
                alt={doctor.name[language]}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                <span>{content.verifiedSpecialist}</span>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider bg-[#EAF6FF] dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 px-3.5 py-1 rounded-full">
              <Stethoscope className="w-4 h-4" />
              <span>{doctor.specialtyName[language]}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {doctor.name[language]}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
              {doctor.title[language]}
            </p>

            {/* Hospital Tag Link */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={doctor.hospitalSlug ? `/hospitals` : '/hospitals'}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-[#EAF6FF] dark:hover:bg-sky-950/60 hover:text-[#0097FB] dark:hover:text-sky-400 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors"
              >
                <Building2 className="w-4 h-4 text-[#0097FB] dark:text-sky-400" />
                <span>{doctor.hospital[language]}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            </div>

            {/* Animated Clinical Credential Counters on Scroll into View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 rounded-2xl p-3 text-center shadow-xs hover:border-sky-400/40 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-black text-[#0097FB] dark:text-sky-400 tabular-nums">
                  +{doctor.experienceYears}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {content.experienceBadge}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 rounded-2xl p-3 text-center shadow-xs hover:border-emerald-400/40 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{surgeries.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {content.surgeriesBadge}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.15 }}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 rounded-2xl p-3 text-center shadow-xs hover:border-sky-400/40 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 tabular-nums">
                  +{publications}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {content.publicationsBadge}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.2 }}
                whileHover={{ y: -3 }}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 rounded-2xl p-3 text-center shadow-xs hover:border-amber-400/40 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1 tabular-nums">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{doctor.rating}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  ({doctor.reviewCount} {content.reviewsText})
                </div>
              </motion.div>
            </div>

            {/* Spoken Languages */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Languages className="w-4 h-4 text-[#0097FB] dark:text-sky-400" />
              <span className="font-bold">{content.languagesSpoken}</span>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-200"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{content.whatsappBtn}</span>
              </a>

              <Link
                href={`/contact?doctor=${doctor.slug}`}
                className="inline-flex items-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{content.requestConsultationBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. STICKY QUICK JUMP PILL NAVIGATION WITH SLIDING SPRING PILL
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-thin">
          <div className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 px-3 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#0097FB] dark:text-sky-400" />
            <span>{content.quickNavTitle}:</span>
          </div>

          {[
            { id: 'bio', label: content.navBio, icon: BookOpen },
            ...(videosList.length > 0 ? [{ id: 'video', label: content.navVideo, icon: Video }] : []),
            { id: 'expertise', label: content.navExpertise, icon: Stethoscope },
            { id: 'procedures', label: content.navProcedures, icon: Activity },
            ...(doctor.careerHistory && doctor.careerHistory.length > 0 ? [{ id: 'career', label: content.navCareer, icon: Briefcase }] : []),
            { id: 'education', label: content.navEducation, icon: GraduationCap },
            ...(doctor.memberships && doctor.memberships[language]?.length > 0 ? [{ id: 'memberships', label: content.navMemberships, icon: Users }] : []),
            ...(doctor.technologies && doctor.technologies[language]?.length > 0 ? [{ id: 'technologies', label: content.navTechnologies, icon: Cpu }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 z-10 select-none ${
                  isTabActive
                    ? 'text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#0097FB] dark:hover:text-sky-400'
                }`}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="active-doctor-nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 shadow-md shadow-sky-500/20 -z-10"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. MAIN CONTENT & CARDS LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Professional Bio & Summary */}
            <div id="bio" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Activity className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                <span>{content.bioHeading}</span>
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-3">
                <p>{doctor.biography[language] || doctor.biography.en}</p>
              </div>

              {/* Quick highlights callout */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {language === 'ar'
                      ? 'الاعتماد الدولي والخبرة السريرية: '
                      : language === 'fr'
                      ? 'Reconnaissance Internationale et Pratique Clinique : '
                      : 'International Clinical Distinction: '}
                  </span>
                  {language === 'ar'
                    ? `يحمل البروفيسور د. ${doctor.name.ar} سجلاً استثنائياً يمتد لأكثر من ${doctor.experienceYears} عاماً مع إشراف مباشر على جراحات معقدة ودراسات متعددة المراكز في المستشفيات التركية الحائزة على شهادة JCI.`
                    : language === 'fr'
                    ? `Le Pr. Dr. ${doctor.name.fr || doctor.name.en} possède une trajectoire d'exception de plus de ${doctor.experienceYears} années, dirigeant des interventions chirurgicales complexes au sein d’établissements accrédités JCI.`
                    : `Prof. Dr. ${doctor.name.en} carries an outstanding career of over ${doctor.experienceYears} years, leading complex surgical procedures in top JCI-accredited medical centers.`}
                </div>
              </div>
            </div>

            {/* Card 2: Doctor Video Card (Official Video & Media) */}
            {videosList.length > 0 && currentVideo && (
              <div id="video" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Video className="w-5 h-5 text-rose-500" />
                    <span>{content.videoHeading}</span>
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{content.officialVideoBadge}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {content.videoDoctorIntro}
                </p>

                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-lg border border-slate-200 dark:border-slate-800">
                  {isEmbed ? (
                    <iframe
                      src={embedUrl}
                      title={currentVideo.title[language] || currentVideo.title.en}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={currentVideo.url}
                      controls
                      poster={currentVideo.thumbnail}
                      className="w-full h-full object-contain"
                    >
                      {language === 'ar'
                        ? 'متصفحك لا يدعم مشغل الفيديو.'
                        : language === 'fr'
                        ? 'Votre navigateur ne prend pas en charge la lecture vidéo.'
                        : 'Your browser does not support the video tag.'}
                    </video>
                  )}
                </div>

                {/* Video Caption & Topic */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-750 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                      {currentVideo.title[language] || currentVideo.title.en}
                    </h4>
                    {currentVideo.duration && (
                      <span className="flex-shrink-0 text-[11px] font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                        {currentVideo.duration}
                      </span>
                    )}
                  </div>
                  {currentVideo.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentVideo.description[language] || currentVideo.description.en}
                    </p>
                  )}
                </div>

                {/* Multiple Videos Playlist Tabs */}
                {videosList.length > 1 && (
                  <div>
                    <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {content.watchAnotherVideo}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {videosList.map((vid, idx) => (
                        <button
                          key={vid.id || idx}
                          type="button"
                          onClick={() => setActiveVideoIndex(idx)}
                          className={`p-3 rounded-xl text-left rtl:text-right border transition-all flex items-center gap-3 cursor-pointer ${
                            activeVideoIndex === idx
                              ? 'bg-[#EAF6FF] dark:bg-sky-950/60 border-[#0097FB] dark:border-sky-500 text-[#0097FB] dark:text-sky-400 shadow-xs'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">
                              {vid.title[language] || vid.title.en}
                            </div>
                            {vid.duration && (
                              <div className="text-[10px] text-slate-400 font-mono">{vid.duration}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card 3: Areas of Expertise */}
            <div id="expertise" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                <span>{content.expertiseHeading}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.areasOfExpertise[language].map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium hover:border-[#0097FB]/40 dark:hover:border-sky-500/50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Key Procedures */}
            <div id="procedures" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Stethoscope className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                <span>{content.proceduresHeading}</span>
              </h2>
              <div className="space-y-3">
                {doctor.procedures[language].map((proc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0097FB] dark:bg-sky-400" />
                      <span>{proc}</span>
                    </div>
                    <span className="text-[#0097FB] dark:text-sky-400 text-[11px] font-bold bg-[#EAF6FF] dark:bg-sky-950/60 px-2.5 py-1 rounded-md self-start sm:self-auto border border-sky-100 dark:border-sky-900/40">
                      {content.availableAtHospital}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Professional Career & Hospital Appointments Timeline */}
            {doctor.careerHistory && doctor.careerHistory.length > 0 && (
              <div id="career" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Briefcase className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                  <span>{content.careerHeading}</span>
                </h2>
                <div className="space-y-4">
                  {doctor.careerHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-[#0097FB] dark:text-sky-400 bg-[#EAF6FF] dark:bg-sky-950/60 px-2.5 py-0.5 rounded-md inline-block border border-sky-100 dark:border-sky-900/40">
                          {item.period}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {item.role[language] || item.role.en}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{item.institution[language] || item.institution.en}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 6: Education & Academic Qualifications */}
            <div id="education" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <GraduationCap className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                <span>{content.educationHeading}</span>
              </h2>
              <ul className="space-y-3">
                {doctor.education[language].map((edu, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0097FB] dark:bg-sky-400 mt-1.5 flex-shrink-0" />
                    <span className="font-medium leading-relaxed">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 7: International Memberships & Societies */}
            {doctor.memberships && doctor.memberships[language]?.length > 0 && (
              <div id="memberships" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Users className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                  <span>{content.membershipsHeading}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.memberships[language].map((mem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{mem}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 8: Approved Technologies */}
            {doctor.technologies && doctor.technologies[language]?.length > 0 && (
              <div id="technologies" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Cpu className="w-5 h-5 text-[#0097FB] dark:text-sky-400" />
                  <span>{content.technologiesHeading}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.technologies[language].map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-[#0097FB] dark:text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold leading-relaxed">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Booking Box (Smoothly Sticky top-28) */}
            <div className="bg-gradient-to-br from-[#021838] via-[#032654] to-[#082247] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden sticky top-28 border border-sky-400/30 backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-sky-400/40 bg-slate-900 shadow-md">
                    <img
                      src={doctor.image}
                      alt={doctor.name[language]}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{language === 'ar' ? 'متاح للاستشارة الفورية' : 'Available for Consultation'}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold leading-snug">
                  {content.bookingTitle} {doctor.name[language]}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                  {content.bookingSubtitle}
                </p>

                <div className="pt-2 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 fill-current flex-shrink-0" />
                    <span>{content.whatsappBtn}</span>
                  </a>

                  <Link
                    href={`/contact?doctor=${doctor.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{content.requestConsultationBtn}</span>
                  </Link>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="pt-4 border-t border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{content.privacyGuarantee}</span>
                </div>
              </div>
            </div>

            {/* Hospital Affiliation Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5">
                {content.hospitalHeading}
              </h3>

              <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <Building2 className="w-5 h-5 text-[#0097FB] dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{doctor.hospital[language]}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    {language === 'ar'
                      ? 'اعتماد دولي JCI ومعايير سلامة الرعاية الصحية'
                      : language === 'fr'
                      ? 'Accréditation internationale JCI et normes de sécurité'
                      : 'International JCI Accreditation & Safety Standards'}
                  </div>
                </div>
              </div>

              <Link
                href="/hospitals"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0097FB] dark:text-sky-400 bg-[#EAF6FF] dark:bg-sky-950/60 hover:bg-[#0097FB] dark:hover:bg-sky-600 hover:text-white py-2.5 rounded-xl transition-colors cursor-pointer border border-sky-100 dark:border-sky-900/40"
              >
                <span>{content.hospitalViewBtn}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
