'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
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

export default function TreatmentsPage() {
  const { language, direction, t } = useLanguage();
  const { treatments } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const [searchQuery, setSearchQuery] = useState('');

  const content = {
    ar: {
      badge: 'التخصصات الطبية المعتمدة',
      title: 'أفضل العمليات والعلاجات الطبية في إسطنبول',
      subtitle:
        'نربطكم بأقسام الجراحة المتقدمة في كبرى المشافي التركية المعتمدة دولياً (JCI)، المجهزة بأحدث الروبوتات الجراحية والمجالس الطبية الاستشارية.',
      searchPlaceholder: 'ابحث عن تخصص طبي أو عملية معينة (زراعة شعر، قلب، أسنان...)...',
      viewDetails: 'تفاصيل التخصص والإجراءات',
      bookConsultation: 'طلب تقييم مجاني',
      keyProcedures: 'أبرز الإجراءات:',
      whyTurkeyTitle: 'لماذا يختار المرضى تركيا للعلاج الطبي؟',
      whyTurkeyItems: [
        'أحدث غرف العمليات الهجينة والروبوتات الجراحية دافنشي وماكو',
        'أطباء بروفيسورات ذوو كفاءة عالمية وزمالات أمريكية وأوروبية',
        'توفير مالي يصل إلى 50-70% مقارنة بأوروبا وأمريكا مع نفس الجودة',
        'مرافقة لغوية ولوجستية متكاملة وإقامة فندقية فاخرة 5 نجوم',
      ],
      noResults: 'لم يتم العثور على تخصصات تطابق بحثك.',
    },
    en: {
      badge: 'Accredited Medical Specialties',
      title: 'Premier Medical Treatments & Surgeries in Istanbul',
      subtitle:
        'Connecting international patients with cutting-edge surgical departments at JCI-accredited Turkish hospitals featuring advanced robotics and multidisciplinary boards.',
      searchPlaceholder: 'Search by medical specialty or procedure (Hair, Heart, Dental...)...',
      viewDetails: 'Specialty Details & Procedures',
      bookConsultation: 'Request Free Assessment',
      keyProcedures: 'Featured Procedures:',
      whyTurkeyTitle: 'Why International Patients Choose Turkey',
      whyTurkeyItems: [
        'State-of-the-art hybrid ORs, Da Vinci and MAKO surgical robots',
        'Internationally renowned professors with prestigious US/European fellowships',
        'Cost savings of 50-70% compared to Western Europe or the US',
        'Seamless multilingual concierge care with 5-star hotel lodging',
      ],
      noResults: 'No specialties matched your search.',
    },
    fr: {
      badge: 'Spécialités Médicales Agréées',
      title: 'Les Meilleurs Traitements et Chirurgies à Istanbul',
      subtitle:
        'Accédez aux départements chirurgicaux de pointe des hôpitaux accrédités JCI en Turquie, équipés de blocs opératoires hybrides et de robots chirurgicaux.',
      searchPlaceholder: 'Rechercher une spécialité (Greffe capillaire, Cardiologie, Dentaire...)...',
      viewDetails: 'Détails & Procédures',
      bookConsultation: 'Demander une Évaluation',
      keyProcedures: 'Principales Interventions :',
      whyTurkeyTitle: 'Pourquoi Choisir la Turquie pour se Soigner ?',
      whyTurkeyItems: [
        'Salles d’opération hybrides et robots chirurgicaux Da Vinci et MAKO',
        'Chirurgiens de renommée mondiale diplômés d’Europe et des États-Unis',
        'Tarifs de 50 à 70% plus abordables qu’en Europe avec une qualité équivalente',
        'Prise en charge linguistique intégrale et hébergement en hôtel 5 étoiles',
      ],
      noResults: 'Aucune spécialité ne correspond à votre recherche.',
    },
  }[language];

  const filteredTreatments = treatments.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title[language].toLowerCase().includes(q) ||
      item.shortDescription[language].toLowerCase().includes(q) ||
      item.procedures[language].some((p) => p.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 to-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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

      {/* Search Ribbon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full py-3.5 px-12 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Treatments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-base">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((item) => {
              const IconComponent = iconMap[item.iconName] || Stethoscope;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
                >
                  {/* Visual Header */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-4 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm text-sky-600 flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold leading-snug">
                        {item.title[language]}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {item.shortDescription[language]}
                      </p>

                      {/* Featured Procedures Pills */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {content.keyProcedures}
                        </div>
                        <div className="space-y-1.5">
                          {item.procedures[language].slice(0, 2).map((proc, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-700 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                              <span className="truncate">{proc.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <Link
                        href={`/treatments/${item.slug}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <span>{content.viewDetails}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/contact?specialty=${item.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center"
                        title={content.bookConsultation}
                      >
                        <Calendar className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Why Turkey Feature Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">
            {content.whyTurkeyTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.whyTurkeyItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
