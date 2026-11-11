import React from 'react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { fetchWordPressPostBySlug, fetchWordPressPosts } from '@/lib/wordpress';
import { readCmsStore } from '@/lib/cmsStore';
import { ArticleFaqAccordion } from '@/components/blog/ArticleInteractive';
import { ArticleReaderClient } from '@/components/blog/ArticleReaderClient';
import {
  buildLanguageAlternates,
  getEntitySlug,
  getLocalizedEntityPath,
  getLocalizedPath,
  getPublicBaseUrl,
  isValidLocale,
} from '@/lib/i18nRoutes';
import { RegisterLocaleAlternates } from '@/context/LocaleAlternatesContext';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const article = await fetchWordPressPostBySlug(slug);
  if (!article) {
    return {
      title: 'Article Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const localizedSeo = article.localizedSeo?.[lang];
  const title =
    localizedSeo?.title?.trim() ||
    (lang === 'ar' ? article.seo?.title : undefined) ||
    `${article.title[lang] || article.title.ar} | AVICINNA Healthcare`;
  const description =
    localizedSeo?.description?.trim() ||
    (lang === 'ar' ? article.seo?.description : undefined) ||
    article.excerpt[lang] ||
    article.excerpt.ar;

  const alternates = buildLanguageAlternates({
    section: 'blog',
    entity: article,
    currentLang: lang,
  });

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical as string,
      siteName: 'AVICINNA Healthcare Turkey',
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title[lang] }],
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate || article.updatedAt || article.publishedDate,
      authors: [article.author.name[lang] || article.author.name.ar],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.image],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const article = await fetchWordPressPostBySlug(slug);
  if (!article) {
    notFound();
  }

  const expectedSlug = getEntitySlug(article, lang);
  if (decodeURIComponent(slug) !== expectedSlug) {
    permanentRedirect(getLocalizedEntityPath('blog', article, lang));
  }

  const store = readCmsStore();
  const linkedDoctor = article.authorDoctorId
    ? store.doctors.find((d) => d.id === article.authorDoctorId)
    : undefined;
  const reviewerDoctor = article.medicalReviewer?.doctorId
    ? store.doctors.find((d) => d.id === article.medicalReviewer?.doctorId)
    : undefined;

  const allPostsRes = await fetchWordPressPosts({ perPage: 10 });
  const relatedArticles = allPostsRes.posts.filter((a) => a.slug !== article.slug).slice(0, 3);

  const baseUrl = getPublicBaseUrl();
  const canonicalUrl = `${baseUrl}${getLocalizedEntityPath('blog', article, lang)}`;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  // Custom article FAQs OR localized default clinical FAQs
  const faqs =
    article.faqs && article.faqs.length > 0
      ? article.faqs.map((f) => ({
          q: f.question[lang] || f.question.ar || f.question.en,
          a: f.answer[lang] || f.answer.ar || f.answer.en,
        }))
      : lang === 'fr'
      ? [
          {
            q: `Quel est le coût estimatif pour « ${article.title.fr || article.title.en} » en Turquie ?`,
            a: 'Les hôpitaux accrédités JCI en Turquie proposent des tarifs inférieurs de 40% à 65% par rapport à l’Europe de l’Ouest tout en utilisant des protocoles et dispositifs certifiés FDA et EMA.',
          },
          {
            q: `Quelle est la durée de séjour moyenne à Istanbul pour ${article.categoryName.fr || article.categoryName.en} ?`,
            a: 'La durée typique varie entre 5 et 10 jours selon le protocole opératoire, avec accompagnement complet et interprète médical francophone inclus.',
          },
          {
            q: 'Comment obtenir un deuxième avis médical gratuit de vos spécialistes ?',
            a: 'Transmettez vos comptes-rendus et examens via notre formulaire de contact ou WhatsApp : notre comité médical répond sous 24 heures sans engagement.',
          },
        ]
      : lang === 'en'
      ? [
          {
            q: `How much does ${article.title.en} cost in Turkey compared to Europe or the US?`,
            a: 'Turkey’s JCI-accredited hospitals typically offer 40%–65% savings while utilizing the exact same FDA/EMA-approved surgical robotics and clinical protocols.',
          },
          {
            q: `How long should I stay in Istanbul for ${article.categoryName.en}?`,
            a: 'Most care plans require a 5 to 10 day stay depending on inpatient recovery, with VIP airport pickup and dedicated interpreters included.',
          },
          {
            q: 'How can I receive a complimentary second medical opinion?',
            a: 'Upload your medical scans or reports using our consultation form; our board-certified physicians return an individualized evaluation within 24 hours.',
          },
        ]
      : [
          {
            q: `كم تبلغ تكلفة ${article.title.ar} في تركيا مقارنة بالدول الأوروبية؟`,
            a: 'توفر المستشفيات التركية المعتمدة دولياً توفيراً يتراوح بين 40% إلى 65% مقارنة بأوروبا وأمريكا مع الحفاظ على نفس التقنيات المعتمدة من FDA وEMA.',
          },
          {
            q: `ما هي مدة الإقامة المطلوبة في إسطنبول لـ ${article.categoryName.ar}؟`,
            a: 'تتراوح المدة النموذجية بين 5 إلى 10 أيام بحسب طبيعة الحالة وفترة المتابعة السريرية، مع توفير مرافقة ومترجم طبي طوال فترة الإقامة.',
          },
          {
            q: 'كيف يمكنني الحصول على دراسة مجانية لتقاريري الطبية ورأي ثانٍ؟',
            a: 'يمكنك إرسال التقارير الطبية وصور الأشعة عبر نموذج الاستشارة أو واتساب، ليقوم المجلس الطبي بمراجعتها وتقديم تقرير استشاري مجاني خلال 24 ساعة.',
          },
        ];

  const authorName =
    linkedDoctor?.name[lang] || article.author.name[lang] || article.author.name.ar;
  const authorRole =
    linkedDoctor?.title[lang] || article.author.role[lang] || article.author.role.ar;
  const authorProfileUrl = linkedDoctor
    ? `${baseUrl}${getLocalizedEntityPath('doctors', linkedDoctor, lang)}`
    : undefined;

  const reviewerName =
    reviewerDoctor?.name[lang] ||
    article.medicalReviewer?.name[lang] ||
    article.medicalReviewer?.name.en ||
    'Prof. Dr. Serdar Turhal';
  const reviewerRole =
    reviewerDoctor?.title[lang] ||
    article.medicalReviewer?.role[lang] ||
    article.medicalReviewer?.role.en ||
    'Senior Oncology & Medical Board Chair';
  const reviewerProfileUrl = reviewerDoctor
    ? `${baseUrl}${getLocalizedEntityPath('doctors', reviewerDoctor, lang)}`
    : undefined;

  const fullSeoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: article.localizedSeo?.[lang]?.title || article.title[lang] || article.title.ar,
        description: article.localizedSeo?.[lang]?.description || article.excerpt[lang] || article.excerpt.ar,
        inLanguage: lang,
        datePublished: article.publishedDate,
        dateModified: article.updatedDate || article.publishedDate,
        medicalAudience: 'Patient',
        about: {
          '@type': 'MedicalCondition',
          name: article.categoryName[lang] || article.categoryName.ar,
        },
        author: {
          '@type': 'Person',
          name: authorName,
          jobTitle: authorRole,
          ...(authorProfileUrl ? { url: authorProfileUrl } : {}),
          worksFor: {
            '@type': 'MedicalOrganization',
            name: article.sourceHospital[lang] || article.sourceHospital.ar,
          },
        },
        reviewedBy: {
          '@type': 'Person',
          name: reviewerName,
          jobTitle: reviewerRole,
          ...(reviewerProfileUrl ? { url: reviewerProfileUrl } : {}),
          worksFor: {
            '@type': 'MedicalOrganization',
            name: 'AVICINNA Medical Board',
          },
        },
        publisher: {
          '@id': 'https://avicinna.com/#organization',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home',
            item: `${baseUrl}${getLocalizedPath('/', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'ar' ? 'المدونة الطبية' : lang === 'fr' ? 'Blog Médical' : 'Medical Blog',
            item: `${baseUrl}${getLocalizedPath('/blog', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title[lang] || article.title.ar,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <RegisterLocaleAlternates
        paths={{
          ar: getLocalizedEntityPath('blog', article, 'ar'),
          fr: getLocalizedEntityPath('blog', article, 'fr'),
          en: getLocalizedEntityPath('blog', article, 'en'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSeoSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <Link href={getLocalizedPath('/', lang)} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <Link href={getLocalizedPath('/blog', lang)} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              {lang === 'ar' ? 'المدونة الطبية' : lang === 'fr' ? 'Blog Médical' : 'Medical Blog'}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.title[lang] || article.title.ar}
            </span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 space-y-8">
          <ArticleReaderClient article={article} forcedLang={lang} />

          <ArticleFaqAccordion
            faqs={faqs}
            title={
              lang === 'ar'
                ? `الأسئلة الشائعة حول ${article.categoryName.ar}`
                : lang === 'fr'
                ? `Foire Aux Questions : ${article.categoryName.fr || article.categoryName.en}`
                : `Frequently Asked Questions: ${article.categoryName.en}`
            }
          />

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-2 text-xs text-slate-500 dark:text-slate-400 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>
                {lang === 'ar'
                  ? 'إخلاء مسؤولية طبي هام (Medical Disclaimer)'
                  : lang === 'fr'
                  ? 'Avertissement Médical'
                  : 'Medical Disclaimer'}
              </span>
            </div>
            <p className="leading-relaxed">
              {lang === 'ar'
                ? 'المعلومات الواردة في هذا المقال مقدمة لأغراض تثقيفية عامة فقط ولا تعتبر بديلاً عن الاستشارة الطبية المباشرة.'
                : lang === 'fr'
                ? 'Les informations contenues dans cet article sont fournies à titre éducatif uniquement et ne remplacent pas un avis médical spécialisé.'
                : 'Information published in this medical article is intended for educational purposes only and does not replace individualized clinical advice from a qualified physician.'}
            </p>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'مقالات طبية ذات صلة وموصى بها'
                    : lang === 'fr'
                    ? 'Articles Médicaux Recommandés'
                    : 'Recommended Medical Articles'}
                </h3>
                <Link
                  href={getLocalizedPath('/blog', lang)}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>
                    {lang === 'ar' ? 'عرض كافة المقالات' : lang === 'fr' ? 'Tous les articles' : 'View All Articles'}
                  </span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={getLocalizedEntityPath('blog', rel, lang)}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-sky-300 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={rel.image}
                          alt={rel.title[lang] || rel.title.ar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md">
                        {rel.categoryName[lang] || rel.categoryName.ar}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {rel.title[lang] || rel.title.ar}
                      </h4>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{rel.readingTimeMinutes} min</span>
                      <span className="font-semibold text-sky-600 flex items-center gap-0.5">
                        <span>{lang === 'ar' ? 'اقرأ المزيد' : lang === 'fr' ? 'Lire' : 'Read'}</span>
                        <ArrowIcon className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

