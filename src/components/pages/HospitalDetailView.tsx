'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import type { HospitalPartner } from '@/data/hospitals';
import type { Doctor } from '@/data/doctors';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Bed,
  Stethoscope,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export function HospitalDetailView({
  initialHospital,
  initialDoctors,
}: {
  initialHospital: HospitalPartner;
  initialDoctors: Doctor[];
}) {
  const { language, direction } = useLanguage();
  const { hospitals, doctors: contextDoctors, sections, settings } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const hospital = hospitals.find((h) => h.id === initialHospital.id) || initialHospital;
  const allDoctors = contextDoctors?.length ? contextDoctors : initialDoctors;

  const affiliatedDoctors = allDoctors.filter(
    (d) =>
      d.hospitalId === hospital.id ||
      d.hospitalSlug === hospital.slug ||
      (d.hospital?.en && hospital.name?.en && d.hospital.en.includes(hospital.name.en.split(' ')[0]))
  );

  const phoneClean =
    (settings?.contact?.whatsapp || sections?.finalCta?.phone || '+90 544 282 27 69').replace(
      /[^0-9]/g,
      ''
    ) || '905442822769';

  const content = {
    ar: {
      home: 'الرئيسية',
      hospitals: 'المستشفيات الشريكة',
      accreditationTag: 'معتمد دولياً',
      bedsLabel: 'سعة الأسرّة',
      bedsSub: 'سرير مجهز بالكامل',
      icuLabel: 'العناية المركزة ICU',
      icuSub: 'سرير عناية مركزة',
      orLabel: 'غرف العمليات',
      orSub: 'غرفة عمليات هجينة',
      estLabel: 'سنة التأسيس',
      estSub: 'ريادة وخبرة طبية',
      aboutHeading: 'عن المستشفى والاعتمادات الطبية',
      techHeading: 'أحدث التقنيات والتجهيزات الطبية',
      doctorsHeading: 'نخبة الأطباء والاستشاريين في المستشفى',
      viewAllDoctors: 'عرض جميع الأطباء',
      viewProfile: 'الملف الطبي',
      ctaBadge: 'استشارة علاجية دولية',
      ctaTitle: `هل ترغب بالعلاج في ${hospital.name.ar}؟`,
      ctaDesc: 'فريقنا الطبي يزودك بخطة علاجية متكاملة وعرض سعر رسمي خلال 24 ساعة بدون أي التزام مالي مسبق.',
      whatsappBtn: 'تواصل عبر واتساب مباشرة',
      formBtn: 'إرسال تقرير طبي للتقييم',
      p1: 'استقبال واستشارة مجانية 100%',
      p2: 'مترجم فوري وسائق خاص مشمول',
      p3: 'أسعار مستشفيات رسمية بدون وسيط',
      waMsg: `مرحباً، أود الاستفسار عن العلاج والعمليات الجراحية في ${hospital.name.ar}`,
    },
    fr: {
      home: 'Accueil',
      hospitals: 'Hôpitaux Partenaires',
      accreditationTag: 'Accréditation Internationale',
      bedsLabel: 'Capacité Lits',
      bedsSub: 'Lits médicalisés',
      icuLabel: 'Soins Intensifs ICU',
      icuSub: 'Lits de réanimation',
      orLabel: 'Blocs Opératoires',
      orSub: 'Salles hybrides de pointe',
      estLabel: 'Année de Fondation',
      estSub: 'Excellence clinique éprouvée',
      aboutHeading: 'À Propos de l’Hôpital & Accréditations',
      techHeading: 'Équipements & Technologies de Pointe',
      doctorsHeading: 'Spécialistes & Chirurgiens de l’Établissement',
      viewAllDoctors: 'Voir tous les médecins',
      viewProfile: 'Profil Médical',
      ctaBadge: 'Coordination Médicale Internationale',
      ctaTitle: `Souhaitez-vous être soigné à ${hospital.name.fr || hospital.name.en} ?`,
      ctaDesc: 'Notre équipe prépare votre protocole complet et devis officiel sous 24h sans engagement.',
      whatsappBtn: 'Contacter sur WhatsApp Directement',
      formBtn: 'Envoyer un Dossier Médical',
      p1: 'Évaluation & deuxième avis 100% gratuits',
      p2: 'Interprète médical francophone & transfert VIP inclus',
      p3: 'Tarifs directs hôpital sans intermédiaire',
      waMsg: `Bonjour AVICINNA, je souhaite des informations sur les soins à ${hospital.name.fr || hospital.name.en}.`,
    },
    en: {
      home: 'Home',
      hospitals: 'Partner Hospitals',
      accreditationTag: 'Internationally Accredited',
      bedsLabel: 'Bed Capacity',
      bedsSub: 'Equipped Inpatient Beds',
      icuLabel: 'Intensive Care ICU',
      icuSub: 'Critical Care Units',
      orLabel: 'Operating Suites',
      orSub: 'Hybrid Surgical Theatres',
      estLabel: 'Established',
      estSub: 'Decades of Clinical Heritage',
      aboutHeading: 'About the Hospital & Accreditations',
      techHeading: 'Medical Technologies & Surgical Systems',
      doctorsHeading: 'Affiliated Professors & Surgeons',
      viewAllDoctors: 'View All Physicians',
      viewProfile: 'Medical Profile',
      ctaBadge: 'International Care Desk',
      ctaTitle: `Considering Treatment at ${hospital.name.en}?`,
      ctaDesc: 'Our medical board provides an all-inclusive clinical quote and plan within 24 hours.',
      whatsappBtn: 'Direct WhatsApp Consultation',
      formBtn: 'Send Medical Report for Review',
      p1: '100% Free clinical case review',
      p2: 'Medical interpreter & VIP transfers included',
      p3: 'Direct official hospital pricing',
      waMsg: `Hello AVICINNA, I would like information about treatment at ${hospital.name.en}.`,
    },
  }[language];

  const technologies = hospital.technologies?.[language] || hospital.technologies?.en || [];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#080E1A] min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href={getLocalizedPath('/', language)} className="hover:text-sky-600 transition-colors">
            {content.home}
          </Link>
          <ArrowIcon className="w-3.5 h-3.5" />
          <Link href={getLocalizedPath('/hospitals', language)} className="hover:text-sky-600 transition-colors">
            {content.hospitals}
          </Link>
          <ArrowIcon className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
            {hospital.name[language] || hospital.name.en}
          </span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 min-h-[400px] flex flex-col justify-end p-6 sm:p-10 lg:p-12">
          <img
            src={hospital.image}
            alt={hospital.name[language] || hospital.name.en}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                {hospital.accreditationBadge} {content.accreditationTag}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {hospital.city[language] || hospital.city.en}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {hospital.name[language] || hospital.name.en}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {hospital.description[language] || hospital.description.en || hospital.type?.[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.bedsLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-[#0097FB] flex items-center justify-center gap-1.5">
              <Bed className="w-5 h-5" />
              <span>{hospital.bedsCount}</span>
            </div>
            <div className="text-[11px] text-slate-400">{content.bedsSub}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.icuLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 flex items-center justify-center gap-1.5">
              <Activity className="w-5 h-5" />
              <span>{hospital.icuBedsCount}</span>
            </div>
            <div className="text-[11px] text-slate-400">{content.icuSub}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.orLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {hospital.operatingRoomsCount}
            </div>
            <div className="text-[11px] text-slate-400">{content.orSub}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.estLabel}</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {hospital.establishedYear}
            </div>
            <div className="text-[11px] text-slate-400">{content.estSub}</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-500" />
              <span>{content.aboutHeading}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              {hospital.description[language] || hospital.description.en}
            </p>
            <div className="pt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>{hospital.address[language] || hospital.address.en}</span>
            </div>
          </div>

          {technologies.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-sky-500" />
                <span>{content.techHeading}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {technologies.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {affiliatedDoctors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-sky-500" />
                  <span>{content.doctorsHeading}</span>
                </h2>
                <Link
                  href={getLocalizedPath('/doctors', language)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{content.viewAllDoctors}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {affiliatedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name[language] || doc.name.en}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                        {doc.specialtyName[language] || doc.specialtyName.en}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {doc.name[language] || doc.name.en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {doc.title[language] || doc.title.en}
                      </p>
                      <div className="mt-2">
                        <Link
                          href={getLocalizedEntityPath('doctors', doc, language)}
                          className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 inline-flex items-center gap-1"
                        >
                          <span>{content.viewProfile}</span>
                          <ArrowIcon className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#021838] to-[#04336c] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-sky-500/20 sticky top-28">
            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">{content.ctaBadge}</span>
              <h3 className="text-2xl font-extrabold leading-snug">{content.ctaTitle}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{content.ctaDesc}</p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(content.waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source={`hospital-${hospital.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{content.whatsappBtn}</span>
              </a>
              <Link
                href={getLocalizedPath('/contact', language)}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl border border-white/20 transition-all text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>{content.formBtn}</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{content.p1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{content.p2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{content.p3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

