'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  HeartPulse,
  Brain,
  Activity,
  ShieldPlus,
  Sparkles,
  Smile,
  Microscope,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
  Building2,
  HelpCircle,
  ChevronDown,
  Star,
  Award,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  HeartPulse,
  Brain,
  Activity,
  ShieldPlus,
  Sparkles,
  Smile,
  Microscope,
  FileCheck2,
};

export default function TreatmentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction, t } = useLanguage();
  const { treatments: treatmentsData, doctors: doctorsData } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const treatment = treatmentsData.find((item) => item.slug === slug);

  if (!treatment) {
    return (
      <div className="pt-32 pb-20 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ar'
            ? 'لم يتم العثور على التخصص الطبي المطلوب'
            : language === 'fr'
            ? 'Spécialité introuvable'
            : 'Specialty Not Found'}
        </h1>
        <Link
          href="/treatments"
          className="inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-full"
        >
          <span>{language === 'ar' ? 'العودة لقائمة التخصصات' : 'Back to Treatments'}</span>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[treatment.iconName] || Stethoscope;
  const relatedDoctors = doctorsData.filter((doc) =>
    treatment.doctorIds.includes(doc.id)
  );

  const content = {
    ar: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbTreatments: 'التخصصات الطبية',
      overviewHeading: 'نظرة طبية شاملة',
      conditionsHeading: 'الحالات التي يتم علاجها بنجاح',
      proceduresHeading: 'أبرز الإجراءات والتقنيات الجراحية المتاحة',
      whyTurkeyHeading: 'لماذا تختار تركيا وأفيسينا لهذا التخصص؟',
      doctorsHeading: 'الأطباء الاستشاريون المتخصصون',
      faqHeading: 'أسئلة شائعة حول هذا العلاج',
      requestConsultation: 'طلب تقييم وعرض سعر',
      whatsappBtn: 'استشارة واتساب فورة',
      viewDoctorProfile: 'الملف الطبي للطبيب',
      experienceYears: 'سنة خبرة',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbTreatments: 'Medical Specialties',
      overviewHeading: 'Clinical Overview',
      conditionsHeading: 'Conditions Successfully Treated',
      proceduresHeading: 'Featured Procedures & Surgical Techniques',
      whyTurkeyHeading: 'Why Choose Turkey & AVICINNA for This Treatment?',
      doctorsHeading: 'Specialist Consultant Physicians',
      faqHeading: 'Frequently Asked Questions',
      requestConsultation: 'Request Quote & Assessment',
      whatsappBtn: 'Direct WhatsApp Chat',
      viewDoctorProfile: 'View Medical Profile',
      experienceYears: 'Years Exp.',
    },
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbTreatments: 'Spécialités Médicales',
      overviewHeading: 'Présentation Clinique',
      conditionsHeading: 'Pathologies Prises en Charge',
      proceduresHeading: 'Procédures & Interventions Disponibles',
      whyTurkeyHeading: 'Pourquoi Choisir la Turquie et AVICINNA ?',
      doctorsHeading: 'Chirurgiens & Spécialistes Référents',
      faqHeading: 'Questions Fréquentes',
      requestConsultation: 'Demander un Devis & Évaluation',
      whatsappBtn: 'Échanger par WhatsApp',
      viewDoctorProfile: 'Voir le Profil Médical',
      experienceYears: 'ans d’expérience',
    },
  }[language];

  // Schema.org MedicalProcedure / FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: treatment.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[language],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[language],
      },
    })),
  };

  const procedureSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.title[language],
    description: treatment.shortDescription[language],
    image: treatment.image,
    procedureType: 'https://schema.org/SurgicalProcedure',
    followup: 'Comprehensive postoperative care and follow-up in Istanbul',
    howPerformed: treatment.fullOverview[language],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbHome}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/treatments" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbTreatments}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{treatment.title[language]}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] flex items-center p-8 sm:p-12 shadow-xl">
            <img
              src={treatment.image}
              alt={treatment.title[language]}
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent rtl:from-slate-950 rtl:via-slate-900/90 rtl:to-transparent" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
                <IconComponent className="w-6 h-6" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {treatment.title[language]}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {treatment.shortDescription[language]}
              </p>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href={`/contact?specialty=${treatment.slug}`}
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-sky-500/20 transition-all text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{content.requestConsultation}</span>
                </Link>
                <a
                  href={`https://wa.me/905000000000?text=Information%20about%20${treatment.title.en}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{content.whatsappBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Clinical Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-500" />
                  <span>{content.overviewHeading}</span>
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {treatment.fullOverview[language]}
                </p>
              </div>

              {/* Conditions Treated */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{content.conditionsHeading}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {treatment.conditionsTreated[language].map((cond, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedures List */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-500" />
                  <span>{content.proceduresHeading}</span>
                </h2>
                <div className="space-y-4">
                  {treatment.procedures[language].map((proc, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-1.5"
                    >
                      <div className="font-bold text-slate-900 text-base flex items-center justify-between">
                        <span>{proc.name}</span>
                        <span className="text-xs text-sky-600 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full">
                          إجراء متاح
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {proc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Turkey Points */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-500" />
                  <span>{content.whyTurkeyHeading}</span>
                </h2>
                <div className="space-y-3">
                  {treatment.whyTurkey[language].map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion */}
              {treatment.faqs.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sky-500" />
                    <span>{content.faqHeading}</span>
                  </h2>
                  <div className="space-y-3">
                    {treatment.faqs.map((faq, idx) => {
                      const isOpen = activeFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="border border-slate-100 rounded-2xl overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveFaq(isOpen ? null : idx)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-sky-600 text-sm cursor-pointer"
                          >
                            <span>{faq.question[language]}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-sky-500' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                              {faq.answer[language]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Consultation Box */}
              <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-2">{content.requestConsultation}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  احصل على دراسة مجانية لتقاريرك الطبية وعرض سعر تفصيلي شامل الفندق والمواصلات في إسطنبول.
                </p>

                <div className="space-y-3">
                  <Link
                    href={`/contact?specialty=${treatment.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{content.requestConsultation}</span>
                  </Link>

                  <a
                    href={`https://wa.me/905000000000?text=I%20am%20interested%20in%20${treatment.title.en}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{content.whatsappBtn}</span>
                  </a>
                </div>
              </div>

              {/* Related Specialist Doctors */}
              {relatedDoctors.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                  <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                    {content.doctorsHeading}
                  </h3>

                  <div className="space-y-4">
                    {relatedDoctors.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3">
                        <img
                          src={doc.image}
                          alt={doc.name[language]}
                          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {doc.name[language]}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {doc.hospital[language]}
                          </p>
                          <Link
                            href={`/doctors/${doc.slug}`}
                            className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1 mt-1"
                          >
                            <span>{content.viewDoctorProfile}</span>
                            <ArrowIcon className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
