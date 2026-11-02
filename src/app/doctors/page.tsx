import React from 'react';
import { doctorsData } from '@/data/doctors';
import { treatmentsData } from '@/data/treatments';
import { DoctorsDirectoryClient } from '@/components/doctors/DoctorsDirectoryClient';
import { Sparkles } from 'lucide-react';

export const revalidate = 300;

export default function DoctorsPage() {
  const doctorsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://avicinna.com/doctors#webpage',
        url: 'https://avicinna.com/doctors',
        name: 'أفضل أطباء وجراحين في تركيا | نخبة استشاريي إسطنبول',
        description: 'تعرف على نخبة الأطباء والجراحين الاستشاريين في أفضل مستشفيات إسطنبول المعتمدة دولياً JCI.',
        inLanguage: 'ar',
        publisher: {
          '@type': 'MedicalOrganization',
          '@id': 'https://avicinna.com/#organization',
          name: 'AVICINNA Healthcare Turkey',
          url: 'https://avicinna.com',
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
            name: 'الأطباء والجراحون',
            item: 'https://avicinna.com/doctors',
          },
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: doctorsData.map((doc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Physician',
            name: doc.name.ar,
            url: `https://avicinna.com/doctors/${doc.slug}`,
            image: doc.image,
            jobTitle: doc.title.ar,
            medicalSpecialty: doc.specialtyName.ar,
            hospitalAffiliation: {
              '@type': 'Hospital',
              name: doc.hospital.ar,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: doc.rating,
              reviewCount: doc.reviewCount,
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
      />
      <div className="pt-24 pb-16 bg-slate-50 dark:bg-[#080E1A] min-h-screen transition-colors">
        {/* Server-Rendered Hero Header with H1 */}
        <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الكادر الطبي الاستشاري</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              نخبة أطباء وجراحي تركيا المعتمدين
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              تعرف على الأطباء والبروفيسورات الأكثر خبرة في إسطنبول، الحاصلين على أعلى الاعتمادات الطبية الأوروبية والأمريكية وسجل حافل بآلاف العمليات الجراحية الناجحة.
            </p>
          </div>
        </div>

        {/* Client Directory with Real-time Filters & Interactive Cards */}
        <DoctorsDirectoryClient
          initialDoctors={doctorsData}
          initialTreatments={treatmentsData}
        />
      </div>
    </>
  );
}
