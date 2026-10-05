'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Article, articleCategories } from '@/data/articles';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Search,
  X,
  Sparkles,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Send,
  Loader2,
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';

export default function AdminBlogPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // WordPress bridge state
  const [wpStatus, setWpStatus] = useState<{ online: boolean; totalArticles?: number; url?: string }>({
    online: false,
  });
  const [syncingWp, setSyncingWp] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [publishToWordPress, setPublishToWordPress] = useState(true);

  // Form state
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [categorySlug, setCategorySlug] = useState('oncology');
  const [excerptAr, setExcerptAr] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [authorNameAr, setAuthorNameAr] = useState('أ. د. سردار تورهال');
  const [authorRoleAr, setAuthorRoleAr] = useState('استشاري طب الأورام السريري');
  const [hospitalAr, setHospitalAr] = useState('مستشفى أجيبادم للأورام والمركز المعتمد بتركيا');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop'
  );
  const [contentRaw, setContentRaw] = useState('');

  // SEO Rank Math / Yoast fields
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Check WordPress bridge status on load
  const verifyWpBridge = async () => {
    try {
      const res = await fetch('/api/wordpress/post');
      if (res.ok) {
        const data = await res.json();
        setWpStatus(data);
      }
    } catch {
      setWpStatus({ online: false });
    }
  };

  useEffect(() => {
    verifyWpBridge();
  }, []);

  const openAddModal = () => {
    setEditingArticle(null);
    setTitleAr('');
    setTitleEn('');
    setCategorySlug('oncology');
    setExcerptAr('دليل شامل يوضح أحدث خيارات العلاج في إسطنبول والفروق في التكلفة ونسب النجاح.');
    setReadingTime(5);
    setAuthorNameAr('أ. د. سردار تورهال');
    setAuthorRoleAr('استشاري طب الأورام');
    setHospitalAr('مستشفى أجيبادم للأورام التخصصي');
    setImageUrl('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop');
    setContentRaw(
      'أصبحت تركيا في السنوات الأخيرة إحدى الوجهات العالمية المفضلة للعلاج الطبي بفضل استثماراتها الكبرى في البنية التحتية والمستشفيات المعتمدة.\nتعتمد مشافينا على أحدث التقنيات الجراحية والمجالس الاستشارية متعددة التخصصات لضمان أعلى درجات الأمان والنجاح.\nتوفر المستشفيات التركية رعاية شمولية للمرضى الدوليين مع مرافقة لغوية كاملة وتوفير مالي كبير مقارنة بأوروبا وأمريكا.'
    );
    setFocusKeyword('علاج السرطان في تركيا');
    setSeoTitle('علاج السرطان في تركيا | التكلفة ونسب النجاح - AVICINNA');
    setSeoDescription('دليل شامل حول أفضل مستشفيات علاج الأورام في إسطنبول وأحدث بروتوكولات العلاج المناعي.');
    setPublishToWordPress(true);
    setSyncMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (art: Article) => {
    setEditingArticle(art);
    setTitleAr(art.title.ar);
    setTitleEn(art.title.en);
    setCategorySlug(art.categorySlug);
    setExcerptAr(art.excerpt.ar);
    setReadingTime(art.readingTimeMinutes);
    setAuthorNameAr(art.author.name.ar);
    setAuthorRoleAr(art.author.role.ar);
    setHospitalAr(art.sourceHospital.ar);
    setImageUrl(art.image);
    setContentRaw(art.content.ar.join('\n'));
    setFocusKeyword(art.title.ar);
    setSeoTitle(`${art.title.ar} - AVICINNA`);
    setSeoDescription(art.excerpt.ar);
    setPublishToWordPress(true);
    setSyncMessage(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr) return;

    setSyncingWp(true);
    setSyncMessage(null);

    const matchedCategory = articleCategories.find((c) => c.slug === categorySlug);
    const categoryName = {
      ar: matchedCategory?.name.ar || 'مقال طبي',
      en: matchedCategory?.name.en || 'Medical Article',
      fr: matchedCategory?.name.fr || 'Article Médical',
    };

    const paragraphs = contentRaw.split('\n').map((p) => p.trim()).filter(Boolean);
    const generatedSlug = editingArticle
      ? editingArticle.slug
      : `${(titleEn || titleAr).toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-')}-${Date.now()}`;

    const payload: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      slug: generatedSlug,
      categorySlug,
      categoryName,
      title: {
        ar: titleAr,
        en: titleEn || titleAr,
        fr: titleEn || titleAr,
      },
      excerpt: {
        ar: excerptAr,
        en: excerptAr,
        fr: excerptAr,
      },
      content: {
        ar: paragraphs,
        en: paragraphs,
        fr: paragraphs,
      },
      readingTimeMinutes: Number(readingTime),
      publishedDate: editingArticle
        ? editingArticle.publishedDate
        : new Date().toISOString().split('T')[0],
      sourceHospital: {
        ar: hospitalAr,
        en: hospitalAr,
        fr: hospitalAr,
      },
      image: imageUrl,
      author: {
        name: { ar: authorNameAr, en: authorNameAr, fr: authorNameAr },
        role: { ar: authorRoleAr, en: authorRoleAr, fr: authorRoleAr },
      },
    };

    // 1. Update in local Context
    if (editingArticle) {
      await updateArticle(payload);
    } else {
      await addArticle(payload);
    }

    // 2. Synchronize to WordPress Headless Bridge
    if (publishToWordPress) {
      try {
        const wpPayload = {
          id: editingArticle?.id,
          title: titleAr,
          content: paragraphs.map((p) => `<p>${p}</p>`).join(''),
          excerpt: excerptAr,
          slug: generatedSlug,
          image: imageUrl,
          readingTime: Number(readingTime),
          authorName: authorNameAr,
          authorRole: authorRoleAr,
          hospitalName: hospitalAr,
          categorySlug,
          categoryName: categoryName.ar,
          seoTitle: seoTitle || `${titleAr} - AVICINNA`,
          seoDescription: seoDescription || excerptAr,
          focusKeyword: focusKeyword || titleAr,
        };

        const res = await fetch('/api/wordpress/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wpPayload),
        });

        if (res.ok) {
          const resData = await res.json();
          setSyncMessage(`تم إنشاء المقال في ووردبريس بنجاح (Post ID: #${resData.data?.id || 'OK'}) وتم تفعيل التحديث اللحظي ISR!`);
          verifyWpBridge();
        } else {
          setSyncMessage('تم حفظ المقال محلياً (ووردبريس لم يستجب)');
        }
      } catch (err: any) {
        setSyncMessage('تم الحفظ محلياً مع تعذر الاتصال اللحظي بـ ووردبريس');
      }
    }

    setSyncingWp(false);
    setTimeout(() => {
      setModalOpen(false);
    }, 1200);
  };

  const handleDelete = (art: Article) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف المقال: ${art.title.ar}؟`)) {
      deleteArticle(art.id);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      art.title.ar.toLowerCase().includes(q) ||
      art.categoryName.ar.toLowerCase().includes(q) ||
      art.author.name.ar.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>المدونة الطبية وإدارة المحتوى</span>
            {wpStatus.online ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ووردبريس متصل ({wpStatus.totalArticles} مقال)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                جسر ووردبريس المحلي جاهز
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة المدونة والمقالات / Blog Management ({articles.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            إنشاء مقالات طبية جديدة ومزامنتها لحظياً مع منظومة Headless WordPress ومحركات البحث.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مقال جديد / Add Article</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بعنوان المقال، التصنيف، أو الطبيب الكاتب..."
          className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl py-3 px-12 text-sm text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs group transition-all duration-200"
          >
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src={art.image}
                alt={art.title.ar}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {art.categoryName.ar}
              </div>
              <div className="absolute bottom-3 left-3 text-slate-900 text-[11px] font-bold flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
                <Clock className="w-3 h-3 text-sky-600" />
                <span>{art.readingTimeMinutes} د</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                  {art.title.ar}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {art.excerpt.ar}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="truncate font-semibold text-slate-700">{art.author.name.ar}</span>
                  <span className="text-slate-400 font-mono">{art.publishedDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(art)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>تعديل / Edit</span>
                </button>
                <Link
                  href={`/blog/${art.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 transition-colors cursor-pointer"
                  title="معاينة المقال في الموقع"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(art)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                  title="حذف المقال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Article */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl shadow-slate-900/20 text-slate-900 ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center ring-4 ring-sky-500/10 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {editingArticle ? 'تعديل المقال الطبي' : 'إضافة مقال طبي جديد'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingArticle
                      ? 'تحديث بيانات المقال والمحتوى المنشور في ووردبريس وموقع AVICINNA'
                      : 'أدخل بيانات المقال الجديد لتضمينه ونشره عبر WordPress Headless CMS'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sync Feedback Alert */}
            {syncMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* WordPress Bridge Toggle Ribbon */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    WP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      التزامن التلقائي مع WordPress Headless CMS
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إنشاء المقال وتحديث الكاش اللحظي (On-Demand ISR Revalidation)
                    </span>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishToWordPress}
                    onChange={(e) => setPublishToWordPress(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded-md focus:ring-sky-500 accent-sky-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700">مزامنة ونشر</span>
                </label>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان المقال (بالعربية) *
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: أحدث بروتوكولات علاج الأورام في إسطنبول..."
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Category & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    label="تصنيف المقال / Category *"
                    value={categorySlug}
                    onChange={setCategorySlug}
                    options={articleCategories
                      .filter((c) => c.slug !== 'all')
                      .map((c) => ({
                        value: c.slug,
                        label: c.name.ar,
                        subLabel: c.name.en,
                      }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مدة القراءة (دقائق)
                  </label>
                  <input
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الموجز / المقتطف (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={excerptAr}
                  onChange={(e) => setExcerptAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 leading-relaxed outline-none transition-all"
                />
              </div>

              {/* Author & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الطبيب الكاتب
                  </label>
                  <input
                    type="text"
                    value={authorNameAr}
                    onChange={(e) => setAuthorNameAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المستشفى الشريك
                  </label>
                  <input
                    type="text"
                    value={hospitalAr}
                    onChange={(e) => setHospitalAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <ImageUploadField
                label="صورة غلاف المقال (Cover Image) *"
                value={imageUrl}
                onChange={setImageUrl}
                folder="articles"
                aspectRatio="video"
                helperText="يمكنك سحب صورة من جهازك، أو اختيارها مباشرة، أو لصق رابط مباشر"
              />

              {/* Article Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحتوى الكامل للمقال (فقرة في كل سطر أو كود Gutenberg HTML)
                </label>
                <textarea
                  rows={6}
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 leading-relaxed outline-none transition-all font-mono"
                />
              </div>

              {/* Rank Math / Yoast SEO Optimization Box */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>تهيئة محركات البحث ومعدل التحويل (Rank Math / Yoast SEO)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      الكلمة المفتاحية المستهدفة (Focus Keyword)
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="مثال: علاج السرطان في تركيا"
                      className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      عنوان السيو في جوجل (SEO Title)
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={titleAr ? `${titleAr} - AVICINNA` : 'عنوان السيو في نتائج البحث'}
                      className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الوصف التعريفي للسيو (Meta Description)
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="وصف جذاب ومختصر يظهر تحت رابط الموقع في نتائج البحث لجذب النقرات..."
                    className="w-full bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>

                {/* Google Search Snippet Preview */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1 text-right">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>https://avicinna.netlify.app/blog/{editingArticle?.slug || 'article-preview'}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-sky-700 hover:underline cursor-pointer truncate">
                    {seoTitle || titleAr || 'عنوان المقال الطبي في نتائج بحث جوجل'}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {seoDescription || excerptAr || 'وصف المقال الطبي وموجز الفوائد والنتائج لمرضى السياحة العلاجية في تركيا.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={syncingWp}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  إلغاء / Cancel
                </button>
                <button
                  type="submit"
                  disabled={syncingWp}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {syncingWp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري النشر والمزامنة مع ووردبريس...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{editingArticle ? 'حفظ التعديلات في ووردبريس' : 'نشر وتثبيت المقال'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
