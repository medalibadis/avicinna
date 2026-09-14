'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Building2,
  Users,
  Globe2,
  PhoneCall,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  const { language, direction, t } = useLanguage();
  const { sections } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const cleanPhone = (sections?.finalCta?.phone || '+90 500 000 00 00').replace(/[\s\-\+\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    language === 'ar'
      ? 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة أفيسينا'
      : language === 'fr'
      ? 'Bonjour, je souhaite obtenir une consultation médicale via AVICINNA'
      : 'Hello, I would like to request a free medical consultation via AVICINNA'
  )}`;

  const content = {
    ar: {
      breadcrumb: 'الرئيسية / من نحن',
      heroEyebrow: 'منصة أفيسينا للرعاية الطبية الدولية',
      heroTitle: 'عقد من الريادة والتميز في السياحة العلاجية بتركيا',
      heroSubtitle:
        'مستلهمون من إرث الطبيب العالمي ابن سينا (Avicenna)، نربط المرضى من مختلف أنحاء العالم بنخبة المستشفيات وأشهر الأطباء الاستشاريين في إسطنبول مع مرافقة علاجية شاملة من الباب إلى الباب.',
      statsTitle: 'أرقام تتحدث عن ثقة مرضانا',
      pillarsTitle: 'ركائز العمل الطبي في أفيسينا',
      pillarsSubtitle: 'المعايير الصارمة التي نلتزم بها لضمان أعلى درجات الأمان والراحة لكل مريض',
      pillars: [
        {
          icon: ShieldCheck,
          title: 'شراكات مع مستشفيات معتمدة دولياً (JCI)',
          desc: 'نتعامل حصرياً مع كبرى المجموعات الطبية في تركيا (مثل مجموعة أجيبادم وميموريال) المعتمدة من اللجنة الدولية المشتركة، والمجهزة بأحدث غرف العمليات الهجينة والروبوتات الجراحية.',
        },
        {
          icon: Award,
          title: 'نخبة الأطباء البروفيسورات والاستشاريين',
          desc: 'يتم اختيار أطبائنا بعناية فائقة وفق سجلاتهم الجراحية وخبراتهم التي تتجاوز 15 إلى 25 عاماً، وعضوياتهم في كبرى الجمعيات الطبية الأمريكية والأوروبية.',
        },
        {
          icon: HeartHandshake,
          title: 'مرافقة كونسيرج 360° باللغة العربية',
          desc: 'من لحظة وصولكم مطار إسطنبول: استقبال VIP بسيارات خاصة، إقامة في فنادق 5 نجوم، ومترجم طبي خاص يرافقكم في كل موعد واستشارة لضمان راحة تامة.',
        },
        {
          icon: Globe2,
          title: 'شفافية مالية مطلقة بدون أي رسوم مخفية',
          desc: 'نقدم عروض أسعار شاملة ونهائية قبل سفركم تتضمن العمليات، الأدوية، الفحوصات، والإقامة، دون أي مفاجآت أو تكاليف غير معلنة.',
        },
      ],
      storyHeading: 'قصتنا: جسر الأمل بين العالم وأفضل رعاية صحية في تركيا',
      storyP1:
        'تأسست منصة AVICINNA في إسطنبول برؤية واضحة: إزالة كل الحواجز اللغوية واللوجستية التي قد يواجهها المريض الدولي الراغب في العلاج في تركيا. على مدار أكثر من 10 سنوات، قمنا ببناء شبكة طبية متكاملة تضم أفضل الجراحين والاستشاريين في تخصصات جراحة القلب، زراعة الأعضاء، جراحة الأعصاب، العظام، طب الأسنان، وزراعة الشعر.',
      storyP2:
        'نحن لا نكتفي بحجز موعد طبي، بل نقوم بمراجعة ملفك الطبي مسبقاً مع الأطباء عبر مجالس طبية استشارية متخصصة، ونضع خطة علاجية مخصصة ومفصلة تتناسب بدقة مع احتياجاتك الصحية.',
      accreditationTitle: 'الاعتمادات والتراخيص الرسمية',
      accreditations: [
        'مرخص رسمياً من وزارة الصحة التركية للسياحة العلاجية الدولية',
        'مستشفيات شريكة معتمدة من اللجنة الدولية المشتركة JCI (Joint Commission International)',
        'شهادات الجودة العالمية ISO 9001 لإدارة الخدمات الصحية',
        'عضوية جمعية وكالات السفر والسياحة التركية TÜRSAB',
      ],
      ctaTitle: 'هل تبحث عن استشارة طبية موثوقة في تركيا؟',
      ctaSubtitle:
        'أرسل تقاريرك الطبية الآن واحصل على رأي طبي ثانٍ مجاني من أفضل أطباء إسطنبول خلال 24 ساعة.',
      consultationBtn: 'طلب تقييم طبي مجاني',
      whatsappBtn: 'تواصل عبر واتساب مباشرة',
    },
    en: {
      breadcrumb: 'Home / About Us',
      heroEyebrow: 'AVICINNA International Healthcare Platform',
      heroTitle: 'A Decade of Leadership in Medical Tourism in Turkey',
      heroSubtitle:
        'Inspired by the legacy of Ibn Sina (Avicenna), the father of modern medicine, we connect international patients with premier accredited hospitals and world-class physicians in Istanbul with seamless 360° concierge care.',
      statsTitle: 'Numbers Reflecting Our Patients’ Trust',
      pillarsTitle: 'The Pillars of AVICINNA Care',
      pillarsSubtitle: 'Our rigorous standards ensuring maximum safety, clinical excellence, and absolute comfort',
      pillars: [
        {
          icon: ShieldCheck,
          title: 'JCI-Accredited Hospital Network',
          desc: 'We partner exclusively with top-tier hospital systems in Turkey (including Acibadem and Memorial) accredited by Joint Commission International and equipped with hybrid ORs and surgical robotics.',
        },
        {
          icon: Award,
          title: 'Top Professors & Clinical Leaders',
          desc: 'Our physicians are vetted for outstanding surgical outcomes, holding 15 to 25+ years of clinical experience and active fellowships in European and American medical associations.',
        },
        {
          icon: HeartHandshake,
          title: '360° Dedicated Concierge Care',
          desc: 'From VIP airport pickup to 5-star hotel lodging and personal multilingual medical bedside interpreters throughout your hospital consultations and recovery.',
        },
        {
          icon: Globe2,
          title: 'Absolute Financial Transparency',
          desc: 'Guaranteed all-inclusive package pricing received before you fly, covering diagnostics, surgical procedures, hotel stays, and transfers with zero hidden fees.',
        },
      ],
      storyHeading: 'Our Story: Bridging Global Patients with Turkey’s Medical Pinnacle',
      storyP1:
        'AVICINNA was founded in Istanbul with an unwavering mission: eliminating language and logistical barriers for international patients seeking cutting-edge medical treatments. Over a decade, we have established an elite network of specialists across Cardiovascular Surgery, Organ Transplantation, Neurosurgery, Orthopedics, Cosmetic Dentistry, and Hair Restoration.',
      storyP2:
        'We do not simply book appointments. We present your medical records directly to specialist tumor and clinical boards, delivering personalized treatment protocols tailored to your exact diagnosis.',
      accreditationTitle: 'Official Accreditations & Certifications',
      accreditations: [
        'Officially licensed by the Republic of Turkey Ministry of Health for International Medical Tourism',
        'Partner hospitals accredited by Joint Commission International (JCI)',
        'ISO 9001 certified healthcare facilitation and management standards',
        'Member of the Association of Turkish Travel Agencies (TÜRSAB)',
      ],
      ctaTitle: 'Looking for a Trusted Medical Consultation in Turkey?',
      ctaSubtitle:
        'Submit your medical reports today for a complimentary second opinion from Istanbul’s leading physicians within 24 hours.',
      consultationBtn: 'Request Free Medical Assessment',
      whatsappBtn: 'Chat with Coordinator on WhatsApp',
    },
    fr: {
      breadcrumb: 'Accueil / À Propos',
      heroEyebrow: 'Plateforme Médicale Internationale AVICINNA',
      heroTitle: 'Une Décennie d’Excellence Médicale en Turquie',
      heroSubtitle:
        'Inspirés par l’héritage d’Ibn Sina (Avicenne), père de la médecine moderne, nous relions les patients du monde entier aux hôpitaux accrédités et aux meilleurs chirurgiens d’Istanbul.',
      statsTitle: 'Des Chiffres qui Témoignent de la Confiance de nos Patients',
      pillarsTitle: 'Les Piliers de l’Excellence AVICINNA',
      pillarsSubtitle: 'Nos engagements stricts garantissant sécurité, qualité de soins et confort absolu',
      pillars: [
        {
          icon: ShieldCheck,
          title: 'Réseau d’Hôpitaux Accrédités JCI',
          desc: 'Partenariats exclusifs avec les plus grands groupes hospitaliers de Turquie (Acibadem, Memorial) dotés de blocs opératoires hybrides et de technologies robotiques.',
        },
        {
          icon: Award,
          title: 'Professeurs et Spécialistes Renommés',
          desc: 'Des chirurgiens chevronnés cumulant plus de 15 à 25 ans d’expérience, membres des sociétés savantes européennes et américaines.',
        },
        {
          icon: HeartHandshake,
          title: 'Conciergerie Médicale Dédiée 360°',
          desc: 'Accueil VIP à l’aéroport, hébergement en hôtel 5 étoiles et présence d’un interprète médical dédié à chaque étape de vos consultations.',
        },
        {
          icon: Globe2,
          title: 'Transparence Tarifaire Totale',
          desc: 'Devis complets tout compris avant votre départ, sans aucun frais caché ni mauvaise surprise.',
        },
      ],
      storyHeading: 'Notre Histoire : Rapprocher les Patients de l’Excellence Médicale',
      storyP1:
        'Fondée à Istanbul, la plateforme AVICINNA a pour vocation de simplifier l’accès aux soins de pointe en Turquie. Depuis plus de 10 ans, nous accompagnons les patients en chirurgie cardiaque, greffes d’organes, neurochirurgie, orthopédie, dentisterie et greffe capillaire.',
      storyP2:
        'Nous soumettons vos bilans à des collèges d’experts multidisciplinaires pour vous délivrer un protocole thérapeutique personnalisé et fiable.',
      accreditationTitle: 'Agréments et Certifications Officielles',
      accreditations: [
        'Agrément officiel du Ministère de la Santé de Turquie pour le Tourisme Médical International',
        'Hôpitaux partenaires accrédités par la Joint Commission International (JCI)',
        'Normes de gestion certifiées ISO 9001',
        'Membre certifié de l’Association des Agences de Voyage de Turquie (TÜRSAB)',
      ],
      ctaTitle: 'Besoin d’un Avis Médical Fiable en Turquie ?',
      ctaSubtitle:
        'Transmettez vos rapports médicaux pour obtenir un deuxième avis gratuit des meilleurs spécialistes d’Istanbul sous 24h.',
      consultationBtn: 'Demander une Évaluation Gratuite',
      whatsappBtn: 'Échanger sur WhatsApp Directement',
    },
  }[language];

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Breadcrumbs & Header */}
      <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.heroEyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
            {content.heroTitle}
          </h1>

          <p className="mt-4 text-lg text-slate-300 max-w-2xl leading-relaxed">
            {content.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#consultation-about"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              <span>{content.consultationBtn}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{content.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">{sections.stats.experienceCount}</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{sections.stats.experienceLabel[language]}</div>
          </div>
          <div className="border-r border-slate-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">{sections.stats.patientsCount}</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{sections.stats.patientsLabel[language]}</div>
          </div>
          <div className="border-r border-slate-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">{sections.stats.hospitalsCount}</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{sections.stats.hospitalsLabel[language]}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">{sections.stats.satisfactionRate}</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{sections.stats.satisfactionLabel[language]}</div>
          </div>
        </div>
      </div>

      {/* Story & Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-sky-600 text-sm font-bold tracking-wide uppercase">
              <Stethoscope className="w-4 h-4" />
              <span>إرث ابن سينا الطبي الحديث</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {content.storyHeading}
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {content.storyP1}
            </p>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {content.storyP2}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">{content.accreditationTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {content.accreditations.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
                alt="Istanbul Modern Hospital"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold text-sky-400">إسطنبول، تركيا</div>
                <div className="text-lg font-bold">بنية تحتية طبية تضاهي كبرى مستشفيات أوروبا وأمريكا</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
            معاييرنا الطبية
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.pillarsTitle}
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            {content.pillarsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consultation Anchor Form */}
      <div id="consultation-about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-[#021838] via-[#032654] to-[#021838] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {content.ctaTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              {content.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all"
              >
                <span>{content.consultationBtn}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{content.whatsappBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
