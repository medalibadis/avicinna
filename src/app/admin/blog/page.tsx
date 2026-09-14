'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';

export default function AdminBlogPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

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
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr) return;

    const matchedCategory = articleCategories.find((c) => c.slug === categorySlug);
    const categoryName = {
      ar: matchedCategory?.name.ar || 'مقال طبي',
      en: matchedCategory?.name.en || 'Medical Article',
      fr: matchedCategory?.name.fr || 'Article Médical',
    };

    const paragraphs = contentRaw.split('\n').map((p) => p.trim()).filter(Boolean);

    const payload: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      slug: editingArticle
        ? editingArticle.slug
        : `${(titleEn || titleAr).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
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

    if (editingArticle) {
      updateArticle(payload);
    } else {
      addArticle(payload);
    }

    setModalOpen(false);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>المدونة الطبية</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة المدونة والمقالات / Blog Management ({articles.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            كتابة مقالات طبية جديدة، مراجعة وتعديل المقالات المنشورة، وتصنيف المحتوى.
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
          <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl shadow-slate-900/20 text-slate-900 ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
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
                    {editingArticle ? 'تحديث بيانات المقال والمحتوى المنشور' : 'أدخل بيانات المقال الجديد لتضمينه في مدونة AVICINNA'}
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

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان المقال (بالعربية) *
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

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
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

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

              <ImageUploadField
                label="صورة غلاف المقال (Cover Image) *"
                value={imageUrl}
                onChange={setImageUrl}
                folder="articles"
                aspectRatio="video"
                helperText="يمكنك سحب صورة من جهازك، أو اختيارها مباشرة، أو لصق رابط مباشر"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحتوى الكامل للمقال (فقرة في كل سطر)
                </label>
                <textarea
                  rows={6}
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 leading-relaxed outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  إلغاء / Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm shadow-sky-600/20 cursor-pointer transition-all"
                >
                  {editingArticle ? 'حفظ التعديلات' : 'نشر المقال'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
