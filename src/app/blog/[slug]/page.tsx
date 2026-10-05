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
import { fetchWordPressPostBySlug, fetchWordPressPosts, getPublicSiteUrl } from '@/lib/wordpress';
import { ArticleFaqAccordion, CopyArticleButton } from '@/components/blog/ArticleInteractive';

export const revalidate = 60; // ISR revalidation

type Props = {
  params: Promise<{ slug: string }>;
};

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

      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        {/* Breadcrumbs for SEO */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-sky-600 transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-sky-600 transition-colors">
              المدونة الطبية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.title.ar}
            </span>
          </nav>
        </div>

        {/* Article Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-100 space-y-8">
            {/* Header Meta */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-100">
                  {article.categoryName.ar}
                </span>

                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مراجعة وتدقيق طبي معتمد (JCI Verified)</span>
                </span>

                <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readingTimeMinutes} دقائق قراءة</span>
                </span>

                {article.isFromWordPress && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>WordPress Headless CMS</span>
                  </span>
                )}
              </div>

              {/* Exact H1 for Target Focus Keywords */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {article.title.ar}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {article.excerpt.ar}
              </p>

              {/* Author & Hospital Strip (E-E-A-T Signal) */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold ring-4 ring-sky-50">
                    <User className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {article.author.name.ar}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {article.author.role.ar} • {article.sourceHospital.ar}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="font-mono">
                    تاريخ النشر: {article.publishedDate}
                  </span>
                  <CopyArticleButton text="مشاركة المقال" copiedText="تم نسخ الرابط!" />
                </div>
              </div>
            </header>

            {/* Featured Image with eager loading for fast LCP */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-slate-100">
              <img
                src={article.image}
                alt={article.title.ar}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Featured Snippet Box (Zero-Click Answer for Google SERP Position #0) */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-900 font-black text-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>أبرز النقاط المستفادة (Key Clinical Takeaways)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>معلومات طبية موثقة وفق أحدث المعايير الدولية والاعتمادات الصحية (JCI).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>مقارنة شفافة للتكاليف ونسب النجاح المعتمدة في كبرى المستشفيات التركية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>إمكانية الحصول على رأي طبي ثانٍ مجاني من أطبائنا الاستشاريين في إسطنبول.</span>
                </li>
              </ul>
            </div>

            {/* Article Content: Handles Gutenberg HTML or Paragraphs */}
            <div className="prose prose-slate max-w-none space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline">
              {article.htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
              ) : (
                <div className="space-y-5">
                  {(article.paragraphs || []).map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Accordion Section with Rich Schema Matching */}
            <ArticleFaqAccordion
              faqs={faqs}
              title={`الأسئلة الشائعة حول ${article.categoryName.ar} (FAQ)`}
            />

            {/* High Conversion Consultation Banner */}
            <div className="bg-gradient-to-r from-[#021838] via-[#032654] to-[#021838] rounded-3xl p-6 sm:p-10 text-white space-y-4 shadow-xl border border-sky-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>استشارة أولية ورأي طبي ثانٍ مجاناً 100%</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black">
                  هل تحتاج استشارة طبية متخصصة حول هذه الحالة؟
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  أرسل تقاريرك الطبية الآن لمراجعتها مجاناً من قبل نفس الفريق الطبي في إسطنبول وتقديم خطة علاجية مخصصة وعرض أسعار شامل خلال 24 ساعة.
                </p>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>طلب دراسة الحالة مجاناً</span>
                  </Link>
                  <a
                    href={`https://wa.me/905000000000?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>استشارة فورية عبر واتساب</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Medical Disclaimer for Google Medic / YMYL guidelines */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>إخلاء مسؤولية طبي هام (Medical Disclaimer)</span>
              </div>
              <p className="leading-relaxed">
                المعلومات الواردة في هذا المقال مقدمة لأغراض تثقيفية وتوعوية عامة فقط، ولا تعتبر بديلاً عن الاستشارة أو التشخيص الطبي المتخصص من قبل طبيب مرخص. نوصي دائماً باستشارة طبيبك أو فريقنا الاستشاري قبل اتخاذ أي قرار علاجي.
              </p>
            </div>
          </article>

          {/* Related Articles Section for Internal Linking Juice */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  مقالات طبية ذات صلة وموصى بها
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1"
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
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={rel.image}
                          alt={rel.title.ar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                        {rel.categoryName.ar}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                        {rel.title.ar}
                      </h4>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{rel.readingTimeMinutes} د</span>
                      <span className="font-semibold text-sky-600 flex items-center gap-0.5">
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
