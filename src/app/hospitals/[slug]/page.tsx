import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { hospitalsData } from '@/data/hospitals';
import { doctorsData } from '@/data/doctors';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Star,
  Bed,
  Stethoscope,
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  hospitalsData.forEach((h) => {
    params.push({ slug: h.id });
    if (h.slug && h.slug !== h.id) {
      params.push({ slug: h.slug });
    }
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hospital = hospitalsData.find((h) => h.id === slug || h.slug === slug);

  if (!hospital) {
    return {
      title: 'المستشفى غير موجود | أفيسينا',
      description: 'المستشفى المطلوب غير متوفر حالياً.',
    };
  }

  const title = `${hospital.name.ar} | مستشفيات تركيا JCI - أفيسينا`;
  const description = `${hospital.name.ar} في ${hospital.city.ar}. اعتماد ${hospital.accreditation}. سعة ${hospital.bedsCount} سرير و${hospital.operatingRoomsCount} غرف عمليات. استشارة مجانية عبر أفيسينا.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://avicinna.com/hospitals/${hospital.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://avicinna.com/hospitals/${hospital.id}`,
      siteName: 'AVICINNA',
      images: [
        {
          url: hospital.image.startsWith('http') ? hospital.image : `https://avicinna.com${hospital.image}`,
          width: 1200,
          height: 630,
          alt: hospital.name.ar,
        },
      ],
      locale: 'ar_SA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [hospital.image.startsWith('http') ? hospital.image : `https://avicinna.com${hospital.image}`],
    },
  };
}

export default async function HospitalDetailPage({ params }: Props) {
  const { slug } = await params;
  const hospital = hospitalsData.find((h) => h.id === slug || h.slug === slug);

  if (!hospital) {
    notFound();
  }

  // Find doctors affiliated with this hospital
  const affiliatedDoctors = doctorsData.filter(
    (d) =>
      d.hospitalId === hospital.id ||
      d.hospitalSlug === hospital.slug ||
      d.hospital.ar.includes(hospital.name.ar.split(' ')[1] || 'XYZ')
  );

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Hospital',
        '@id': `https://avicinna.com/hospitals/${hospital.id}#hospital`,
        name: hospital.name.ar,
        alternateName: [hospital.name.en, hospital.name.fr],
        description: hospital.description.ar,
        image: hospital.image.startsWith('http') ? hospital.image : `https://avicinna.com${hospital.image}`,
        url: `https://avicinna.com/hospitals/${hospital.id}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: hospital.address.ar,
          addressLocality: hospital.city.ar,
          addressCountry: 'TR',
        },
        medicalSpecialty: hospital.specialties,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: hospital.rating,
          reviewCount: hospital.reviewsCount,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://avicinna.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المستشفيات الشريكة',
            item: 'https://avicinna.com/hospitals',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: hospital.name.ar,
            item: `https://avicinna.com/hospitals/${hospital.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#080E1A] min-h-screen text-slate-900 dark:text-slate-100">
        {/* Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-sky-600 transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            <Link href="/hospitals" className="hover:text-sky-600 transition-colors">
              المستشفيات الشريكة
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
            <span className="text-slate-800 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
              {hospital.name.ar}
            </span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 min-h-[420px] flex flex-col justify-end p-6 sm:p-10 lg:p-12">
            <img
              src={hospital.image}
              alt={hospital.name.ar}
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  {hospital.accreditationBadge} معتمد دولياً
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {hospital.city.ar}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {hospital.rating} ({hospital.reviewsCount} تقييم)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {hospital.name.ar}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed line-clamp-3">
                {hospital.description.ar}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/905300000000?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن العلاج في ${hospital.name.ar}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0097FB] hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-sky-500/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>طلب استشارة وعرض سعر مجاني</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>حجز موعد طبي</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">السعة السريرية</div>
              <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
                {hospital.bedsCount}+
              </div>
              <div className="text-[11px] text-slate-400">سرير طبي حديث</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">العناية المركزة</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {hospital.icuBedsCount}
              </div>
              <div className="text-[11px] text-slate-400">سرير ICU مجهز</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">غرف العمليات</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {hospital.operatingRoomsCount}
              </div>
              <div className="text-[11px] text-slate-400">غرفة عمليات هجينة</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">سنة التأسيس</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {hospital.establishedYear}
              </div>
              <div className="text-[11px] text-slate-400">ريادة وخبرة طبية</div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Columns: Description, Tech, Specialties, Doctors */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-sky-500" />
                <span>عن المستشفى والاعتمادات الطبية</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                {hospital.description.ar}
              </p>
              <div className="pt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>{hospital.address.ar}</span>
              </div>
            </div>

            {/* Advanced Technologies */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-sky-500" />
                <span>أحدث التقنيات والتجهيزات الطبية</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {hospital.technologies.ar.map((tech, idx) => (
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

            {/* Doctors affiliated */}
            {affiliatedDoctors.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-6 h-6 text-sky-500" />
                    <span>نخبة الأطباء والاستشاريين في المستشفى</span>
                  </h2>
                  <Link
                    href={`/doctors?hospital=${hospital.id}`}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    عرض جميع الأطباء ←
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
                        alt={doc.name.ar}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                          {doc.specialtyName.ar}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {doc.name.ar}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {doc.title.ar}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href={`/doctors/${doc.slug}`}
                            className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 inline-flex items-center gap-1"
                          >
                            <span>الملف الطبي</span>
                            <ChevronLeft className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: CTA card & Quick Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#021838] to-[#04336c] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-sky-500/20 sticky top-28">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  استشارة علاجية دولية
                </span>
                <h3 className="text-2xl font-extrabold leading-snug">
                  هل ترغب بالعلاج في {hospital.name.ar}؟
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  فريقنا الطبي يزودك بخطة علاجية متكاملة وعرض سعر رسمي خلال 24 ساعة بدون أي التزام مالي مسبق.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/905300000000?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن العلاج والعمليات الجراحية في ${hospital.name.ar}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-emerald-600/30 text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تواصل عبر واتساب مباشرة</span>
                </a>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl backdrop-blur-md border border-white/20 transition-all text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>إرسال تقرير طبي للتقييم</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>استقبال واستشارة مجانية 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>مترجم فوري وسائق خاص مشمول</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>أسعار مستشفيات رسمية بدون وسيط</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
