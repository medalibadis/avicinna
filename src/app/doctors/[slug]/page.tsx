'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
} from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction, t } = useLanguage();
  const { doctors } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    return (
      <div className="pt-32 pb-20 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ar'
            ? 'لم يتم العثور على الطبيب المطلوب'
            : language === 'fr'
            ? 'Médecin introuvable'
            : 'Physician Not Found'}
        </h1>
        <p className="text-slate-600 mb-6">
          {language === 'ar'
            ? 'قد يكون الرابط غير صحيح أو تم نقل الملف الشخصي.'
            : language === 'fr'
            ? 'Le lien est incorrect ou la page a été déplacée.'
            : 'The link may be invalid or the profile has moved.'}
        </p>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-full"
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
      experienceBadge: 'سنوات خبرة سريرية',
      verifiedSpecialist: 'استشاري معتمد في تركيا',
      bioHeading: 'السيرة الطبية والمهنية',
      expertiseHeading: 'مجالات التخصص الدقيق والعمليات',
      proceduresHeading: 'أبرز الإجراءات والتقنيات الجراحية',
      educationHeading: 'المؤهلات العلمية والزمالات الدولية',
      hospitalHeading: 'المستشفى الشريك والمرافق الجراحية',
      bookingTitle: 'احجز استشارة مجانية مع',
      bookingSubtitle: 'أرسل تقاريرك الطبية لمراجعتها مباشرة من قبل الطبيب ووضع خطة علاجية مخصصة.',
      whatsappBtn: 'استشارة واتساب مباشرة',
      requestConsultationBtn: 'طلب تقييم طبي رسمي',
      languagesSpoken: 'اللغات المتاحة:',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbDoctors: 'Doctors & Faculty',
      experienceBadge: 'Years Clinical Exp.',
      verifiedSpecialist: 'Board-Certified in Turkey',
      bioHeading: 'Professional Biography',
      expertiseHeading: 'Clinical Specialties & Focus Areas',
      proceduresHeading: 'Featured Procedures & Techniques',
      educationHeading: 'Education & International Fellowships',
      hospitalHeading: 'Partner Hospital & Surgical Facilities',
      bookingTitle: 'Book a Free Consultation with',
      bookingSubtitle: 'Submit your medical reports directly for physician review and an individualized care plan.',
      whatsappBtn: 'Direct WhatsApp Consultation',
      requestConsultationBtn: 'Request Official Medical Proposal',
      languagesSpoken: 'Languages:',
    },
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbDoctors: 'Médecins Spécialistes',
      experienceBadge: 'Ans d’expérience clinique',
      verifiedSpecialist: 'Chirurgien Agréé en Turquie',
      bioHeading: 'Biographie Médicale',
      expertiseHeading: 'Domaines d’Expertise & Chirurgie',
      proceduresHeading: 'Procédures & Techniques Maîtrisées',
      educationHeading: 'Diplômes & Sociétés Savantes',
      hospitalHeading: 'Hôpital Partenaire & Équipements',
      bookingTitle: 'Prendre Rendez-vous avec',
      bookingSubtitle: 'Transmettez vos examens pour une étude préalable directe et l’élaboration d’un devis sur mesure.',
      whatsappBtn: 'Consulter par WhatsApp',
      requestConsultationBtn: 'Demander une Étude de Dossier',
      languagesSpoken: 'Langues :',
    },
  }[language];

  // Schema.org Physician data
  const physicianSchema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name[language],
    description: doctor.title[language],
    image: doctor.image,
    medicalSpecialty: doctor.specialtyName[language],
    hospitalAffiliation: {
      '@type': 'Hospital',
      name: doctor.hospital[language],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: doctor.rating,
      reviewCount: doctor.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbHome}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/doctors" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbDoctors}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{doctor.name[language]}</span>
          </div>
        </div>

        {/* Doctor Header Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Column */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-md">
                <img
                  src={doctor.image}
                  alt={doctor.name[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{content.verifiedSpecialist}</span>
                </div>
              </div>
            </div>

            {/* Main Info Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{doctor.specialtyName[language]}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                {doctor.name[language]}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {doctor.title[language]}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-2">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Building2 className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-800">{doctor.hospital[language]}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-800">
                    {doctor.experienceYears} {content.experienceBadge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-800">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.reviewCount} تقييماً)</span>
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-600">
                <Languages className="w-4 h-4 text-sky-500" />
                <span className="font-semibold">{content.languagesSpoken}</span>
                <span>{doctor.languages.join(' • ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href={`/contact?doctor=${doctor.slug}`}
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md shadow-sky-500/20 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{content.requestConsultationBtn}</span>
                </Link>
                <a
                  href={`https://wa.me/905000000000?text=Consultation%20request%20for%20${doctor.name.en}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{content.whatsappBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Bio Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-500" />
                  <span>{content.bioHeading}</span>
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {doctor.biography[language]}
                </p>
              </div>

              {/* Areas of Expertise */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-500" />
                  <span>{content.expertiseHeading}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.areasOfExpertise[language].map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedures Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-500" />
                  <span>{content.proceduresHeading}</span>
                </h2>
                <div className="space-y-2.5">
                  {doctor.procedures[language].map((proc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-xs flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      <span>{proc}</span>
                      <span className="text-sky-600 font-bold text-[11px] bg-sky-50 px-2 py-0.5 rounded-md">
                        متاح في المستشفى
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Fellowships */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-sky-500" />
                  <span>{content.educationHeading}</span>
                </h2>
                <ul className="space-y-3">
                  {doctor.education[language].map((edu, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Consultation Quick Box */}
              <div className="bg-gradient-to-b from-slate-900 to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-bold mb-2">
                  {content.bookingTitle} {doctor.name[language]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  {content.bookingSubtitle}
                </p>

                <div className="space-y-3">
                  <Link
                    href={`/contact?doctor=${doctor.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{content.requestConsultationBtn}</span>
                  </Link>

                  <a
                    href={`https://wa.me/905000000000?text=I%20would%20like%20to%20consult%20Dr.%20${doctor.name.en}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{content.whatsappBtn}</span>
                  </a>
                </div>
              </div>

              {/* Hospital Affiliation Info */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  {content.hospitalHeading}
                </h3>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Building2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">{doctor.hospital[language]}</div>
                    <div className="text-slate-500 mt-0.5">معتمد من اللجنة الدولية المشتركة JCI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
