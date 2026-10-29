import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import { fetchWordPressPostBySlug, fetchWordPressPosts, getPublicSiteUrl } from '@/lib/wordpress';
import { ArticleFaqAccordion, CopyArticleButton } from '@/components/blog/ArticleInteractive';
import { ArticleReaderClient } from '@/components/blog/ArticleReaderClient';

export const revalidate = 60; // ISR revalidation

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchWordPressPostBySlug(slug);

  if (!article) {
    return {
      title: 'المقال الطبي غير موجود | AVICINNA Healthcare',
      description: 'المقال الطبي المطلوب غير متوفر حالياً.',
    };
  }

  const publicBaseUrl = getPublicSiteUrl();
  const canonicalUrl = `${publicBaseUrl}/blog/${article.slug}`;
  const title = article.seo?.title || `${article.title.ar} | AVICINNA Healthcare`;
  const description = article.seo?.description || article.excerpt.ar;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'AVICINNA Healthcare Turkey',
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title.ar,
        },
      ],
      type: 'article',
      publishedTime: article.publishedDate,
      authors: [article.author.name.ar],
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
  const { slug } = await params;
  const article = await fetchWordPressPostBySlug(slug);

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center max-w-xl mx-auto px-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          لم يتم العثور على المقال الطبي المطلوب
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          ربما تم نقل المقال أو حذفه، يمكنك استعراض باقي مقالات المدونة الطبية.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-md shadow-sky-500/20"
        >
          <span>العودة للمدونة الطبية</span>
        </Link>
      </div>
    );
  }

  // Fetch other articles for internal linking recommendations
  const allPostsRes = await fetchWordPressPosts({ perPage: 10 });
  const relatedArticles = allPostsRes.posts
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const publicBaseUrl = getPublicSiteUrl();
  const canonicalUrl = `${publicBaseUrl}/blog/${article.slug}`;

  // Medical FAQs optimized for Google FAQ Rich Snippets in SERPs
  const faqs = [
    {
      q: `كم تبلغ تكلفة ${article.title.ar} في تركيا مقارنة بالدول الأوروبية؟`,
      a: 'توفر المستشفيات التركية المعتمدة دولياً توفيراً يتراوح بين 40% إلى 65% مقارنة بأوروبا وأمريكا، مع الحفاظ على نفس جودة التقنيات والأدوية الحيوية المعتمدة من FDA وEMA.',
    },
    {
      q: `ما هي مدة الإقامة المطلوبة في إسطنبول لـ ${article.categoryName.ar}؟`,
      a: 'تتراوح المدة النموذجية بين 5 إلى 10 أيام بحسب طبيعة الحالة وفترة المتابعة السريرية، مع توفير مرافقة لوجستية ومترجم طبي معتمد طوال فترة الإقامة.',
    },
    {
      q: 'كيف يمكنني الحصول على دراسة مجانية لتقاريري الطبية ورأي ثانٍ؟',
      a: 'يمكنك إرسال التقارير الطبية وصور الأشعة عبر الواتساب أو نموذج الاستشارة، ليقوم المجلس الطبي بمراجعتها وتقديم تقرير استشاري مبدئي مجاني خلال 24 ساعة.',
    },
  ];

  // Elite Schema.org Structured Data
  const fullSeoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: article.seo.title || `${article.title.ar} - AVICINNA`,
        description: article.seo.description || article.excerpt.ar,
        inLanguage: 'ar',
        medicalAudience: 'Patient',
        about: {
          '@type': 'MedicalCondition',
          name: article.categoryName.ar,
        },
        author: {
          '@type': 'Person',
          name: article.author.name.ar,
          jobTitle: article.author.role.ar,
          worksFor: {
            '@type': 'MedicalOrganization',
            name: article.sourceHospital.ar,
          },
        },
        reviewedBy: {
          '@type': 'Person',
          name: 'Prof. Dr. Serdar Turhal',
          jobTitle: 'Senior Oncology & Medical Board Chair',
          worksFor: {
            '@type': 'MedicalOrganization',
            name: 'AVICINNA Healthcare Turkey',
          },
        },
        publisher: {
          '@type': 'MedicalOrganization',
          '@id': 'https://avicinna.netlify.app/#organization',
          name: 'AVICINNA Medical Tourism Turkey',
          url: 'https://avicinna.netlify.app',
          logo: {
            '@type': 'ImageObject',
            url: 'https://avicinna.netlify.app/favicon.ico',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://avicinna.netlify.app',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المدونة الطبية',
            item: 'https://avicinna.netlify.app/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title.ar,
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

  const whatsappText = encodeURIComponent(
    `السلام عليكم، أود الاستفسار والحصول على استشارة طبية متخصصة بخصوص: "${article.title.ar}"`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSeoSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
        {/* Breadcrumbs for SEO */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <Link href="/blog" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              المدونة الطبية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.title.ar}
            </span>
          </nav>
        </div>

        {/* Article Container with Instant Multilingual Reader */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 space-y-8">
          <ArticleReaderClient article={article} />

          {/* FAQ Accordion Section with Rich Schema Matching */}
          <ArticleFaqAccordion
            faqs={faqs}
            title={`الأسئلة الشائعة حول ${article.categoryName.ar} (FAQ)`}
          />

          {/* Medical Disclaimer for Google Medic / YMYL guidelines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-2 text-xs text-slate-500 dark:text-slate-400 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>إخلاء مسؤولية طبي هام (Medical Disclaimer)</span>
            </div>
            <p className="leading-relaxed">
              المعلومات الواردة في هذا المقال مقدمة لأغراض تثقيفية وتوعوية عامة فقط، ولا تعتبر بديلاً عن الاستشارة أو التشخيص الطبي المتخصص من قبل طبيب مرخص. نوصي دائماً باستشارة طبيبك أو فريقنا الاستشاري قبل اتخاذ أي قرار علاجي.
            </p>
          </div>

          {/* Related Articles Section for Internal Linking Juice */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  مقالات طبية ذات صلة وموصى بها
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
                >
                  <span>عرض كافة المقالات</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={rel.image}
                          alt={rel.title.ar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-100 dark:border-sky-900/40">
                        {rel.categoryName.ar}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                        {rel.title.ar}
                      </h4>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>{rel.readingTimeMinutes} د</span>
                      <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                        اقرأ المزيد
                        <ChevronLeft className="w-3 h-3" />
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
