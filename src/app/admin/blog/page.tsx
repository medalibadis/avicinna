'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
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
  ExternalLink,
  Send,
  Loader2,
  Target,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';
import { ModalPortal } from '@/components/admin/ModalPortal';
import { ArticleSeoStudio } from '@/components/admin/ArticleSeoStudio';
import { AdminSeoGuideModal } from '@/components/admin/AdminSeoGuideModal';
import { analyzeArticleSeo } from '@/lib/seoAnalyzer';

type Lang = 'ar' | 'en' | 'fr';

const blogDict = {
  ar: {
    badge: 'المدونة الطبية وإدارة المحتوى',
    wpOnline: (n: number) => `ووردبريس متصل (${n} مقال)`,
    wpLocalReady: 'جسر ووردبريس المحلي جاهز',
    pageTitle: 'إدارة المدونة والمقالات',
    pageSubtitle: 'إنشاء مقالات طبية جديدة ومزامنتها لحظياً مع منظومة Headless WordPress ومحركات البحث.',
    btnAddArticle: 'إضافة مقال جديد',
    searchPlaceholder: 'ابحث بعنوان المقال، التصنيف، أو الطبيب الكاتب...',
    readMin: 'د',
    btnEdit: 'تعديل',
    btnPreview: 'معاينة المقال في الموقع',
    btnDelete: 'حذف المقال',
    deleteConfirm: (t: string) => `هل أنت متأكد من رغبتك في حذف المقال: ${t}؟`,
    modalAddTitle: 'إضافة مقال طبي جديد',
    modalEditTitle: 'تعديل المقال الطبي',
    modalAddSubtitle: 'أدخل بيانات المقال الجديد لتضمينه ونشره عبر WordPress وموقع AVICINNA',
    modalEditSubtitle: 'تحديث بيانات المقال والمحتوى المنشور في ووردبريس وموقع AVICINNA',
    wpSyncTitle: 'التزامن التلقائي مع WordPress Headless CMS',
    wpSyncSubtitle: 'إنشاء المقال وتحديث الكاش اللحظي (On-Demand ISR Revalidation)',
    wpSyncCheck: 'مزامنة ونشر',
    autoTranslateBtn: 'ترجمة ذكية فورية لجميع اللغات (AR / FR / EN)',
    translating: 'جارٍ الترجمة الطبية بالذكاء الاصطناعي...',
    writeInOneTab: 'اكتب في أي لغة، وسيترجم النظام الطبي اللغات الأخرى تلقائياً',
    fieldTitle: 'عنوان المقال',
    fieldExcerpt: 'الملخص السريري / المقتطف',
    fieldBody: 'المحتوى الطبي الكامل (فقرة في كل سطر)',
    fieldCategory: 'تصنيف المقال *',
    fieldReadingTime: 'مدة القراءة التقديرية (دقائق) *',
    fieldAuthorName: 'اسم الطبيب الكاتب *',
    fieldAuthorRole: 'الصفة السريرية للكاتب *',
    fieldHospital: 'المستشفى الشريك المعتمد *',
    fieldImage: 'صورة غلاف المقال *',
    seoSectionTitle: 'تهيئة محركات البحث ومعدل التحويل (Rank Math / Yoast SEO)',
    focusKeyword: 'الكلمة المفتاحية المستهدفة (Focus Keyword)',
    seoTitle: 'عنوان السيو في جوجل (SEO Title)',
    seoDescription: 'الوصف الميتا لمحركات البحث (Meta Description)',
    btnSave: 'حفظ ونشر المقال',
    btnSaving: 'جاري النشر والمزامنة مع ووردبريس...',
    btnCancel: 'إلغاء',
    toastTranslated: 'تمت الترجمة الطبية بنجاح لجميع اللغات!',
  },
  en: {
    badge: 'Medical Blog & CMS Studio',
    wpOnline: (n: number) => `WordPress Connected (${n} posts)`,
    wpLocalReady: 'Local WordPress Bridge Ready',
    pageTitle: 'Blog & Clinical Articles Management',
    pageSubtitle: 'Publish medical articles synchronized with Headless WordPress and search engines.',
    btnAddArticle: 'Add New Article',
    searchPlaceholder: 'Search by article title, category, or authoring physician...',
    readMin: 'min',
    btnEdit: 'Edit',
    btnPreview: 'Preview Article Live',
    btnDelete: 'Delete Article',
    deleteConfirm: (t: string) => `Are you sure you want to permanently delete article: ${t}?`,
    modalAddTitle: 'Create New Medical Article',
    modalEditTitle: 'Edit Medical Article',
    modalAddSubtitle: 'Enter article details to publish across Headless WordPress and AVICINNA platform',
    modalEditSubtitle: 'Update article metadata and localized multilingual content across channels',
    wpSyncTitle: 'Automated Headless WordPress Sync',
    wpSyncSubtitle: 'Instant ISR revalidation and multi-channel publication',
    wpSyncCheck: 'Sync & Publish',
    autoTranslateBtn: 'Auto-Translate to All Languages (AR / FR / EN)',
    translating: 'Translating with Medical AI Pipeline...',
    writeInOneTab: 'Write in any language tab; AI accurately translates medical terminology across all 3 languages.',
    fieldTitle: 'Article Title',
    fieldExcerpt: 'Clinical Summary / Excerpt',
    fieldBody: 'Full Medical Article Body (One paragraph per line)',
    fieldCategory: 'Article Category *',
    fieldReadingTime: 'Estimated Reading Time (Minutes) *',
    fieldAuthorName: 'Author / Physician Name *',
    fieldAuthorRole: 'Author Clinical Specialty *',
    fieldHospital: 'Accredited Partner Hospital *',
    fieldImage: 'Official Feature Cover Image *',
    seoSectionTitle: 'SEO & Search Engine Optimization (Rank Math / Yoast)',
    focusKeyword: 'Focus Keyword',
    seoTitle: 'Custom Google SEO Title',
    seoDescription: 'Meta Description for Search Engines',
    btnSave: 'Save & Publish Article',
    btnSaving: 'Publishing & Syncing with WordPress...',
    btnCancel: 'Cancel',
    toastTranslated: 'AI Medical translation complete across AR, EN, and FR!',
  },
  fr: {
    badge: 'Blog Médical & Gestion de Contenu',
    wpOnline: (n: number) => `WordPress Connecté (${n} articles)`,
    wpLocalReady: 'Passerelle WordPress Locale Prête',
    pageTitle: 'Gestion du Blog & Articles Médicaux',
    pageSubtitle: 'Publiez des articles médicaux synchronisés en temps réel avec Headless WordPress et les moteurs de recherche.',
    btnAddArticle: 'Ajouter un Article',
    searchPlaceholder: 'Rechercher par titre, catégorie ou médecin praticien...',
    readMin: 'min',
    btnEdit: 'Modifier',
    btnPreview: 'Voir l’article en ligne',
    btnDelete: 'Supprimer l’article',
    deleteConfirm: (t: string) => `Voulez-vous vraiment supprimer définitivement l'article : ${t} ?`,
    modalAddTitle: 'Ajouter un Nouvel Article Médical',
    modalEditTitle: 'Modifier l’Article Médical',
    modalAddSubtitle: 'Renseignez les données pour diffuser sur Headless WordPress et la plateforme AVICINNA',
    modalEditSubtitle: 'Mettre à jour les métadonnées et le contenu clinique multilingue',
    wpSyncTitle: 'Synchronisation Automatique Headless WordPress',
    wpSyncSubtitle: 'Publication instantanée et revalidation ISR sur mesure',
    wpSyncCheck: 'Synchroniser & Publier',
    autoTranslateBtn: 'Traduire vers toutes les langues (AR / FR / EN)',
    translating: 'Traduction médicale IA en cours...',
    writeInOneTab: 'Rédigez dans la langue de votre choix, l’IA traduit fidèlement les autres langues.',
    fieldTitle: 'Titre de l’article',
    fieldExcerpt: 'Résumé clinique / Extrait',
    fieldBody: 'Corps complet de l’article médical (un paragraphe par ligne)',
    fieldCategory: 'Catégorie de l’article *',
    fieldReadingTime: 'Temps de lecture estimé (minutes) *',
    fieldAuthorName: 'Nom du médecin ou auteur *',
    fieldAuthorRole: 'Titre clinique de l’auteur *',
    fieldHospital: 'Hôpital partenaire accrédité *',
    fieldImage: 'Image de couverture officielle *',
    seoSectionTitle: 'Optimisation Référencement & SEO (Rank Math / Yoast)',
    focusKeyword: 'Mot-clé cible (Focus Keyword)',
    seoTitle: 'Titre SEO pour Google',
    seoDescription: 'Meta Description pour les résultats de recherche',
    btnSave: 'Enregistrer & Publier',
    btnSaving: 'Publication et synchronisation en cours...',
    btnCancel: 'Annuler',
    toastTranslated: 'Traduction médicale IA terminée avec succès en AR, FR et EN !',
  },
};

export default function AdminBlogPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();
  const { language, direction } = useLanguage();
  const langKey = (language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar') as Lang;
  const t = blogDict[langKey];

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

  // Write-Once Multi-Language Form State
  const [editorTab, setEditorTab] = useState<Lang>(langKey);
  const [isTranslating, setIsTranslating] = useState(false);

  const [titles, setTitles] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });
  const [excerpts, setExcerpts] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });
  const [bodies, setBodies] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });

  const [categorySlug, setCategorySlug] = useState('oncology');
  const [readingTime, setReadingTime] = useState(5);
  const [authorName, setAuthorName] = useState({
    ar: 'أ. د. سردار تورهال',
    en: 'Prof. Dr. Serdar Turhal',
    fr: 'Pr Dr Serdar Turhal',
  });
  const [authorRole, setAuthorRole] = useState({
    ar: 'استشاري طب الأورام السريري',
    en: 'Consultant Clinical Oncologist',
    fr: 'Professeur d’Oncologie Médicale',
  });
  const [hospitalName, setHospitalName] = useState({
    ar: 'مستشفى أجيبادم للأورام والمركز المعتمد بتركيا',
    en: 'Acibadem Oncology Hospital Istanbul',
    fr: 'Hôpital d’Oncologie Acibadem Istanbul',
  });
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop'
  );

  // SEO Rank Math / Yoast fields & Guide Modal State
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoGuideModalOpen, setSeoGuideModalOpen] = useState(false);

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
    setEditorTab(langKey);
    setTitles({
      ar: '',
      en: '',
      fr: '',
    });
    setExcerpts({
      ar: 'دليل شامل يوضح أحدث خيارات العلاج في إسطنبول والفروق في التكلفة ونسب النجاح.',
      en: 'A comprehensive clinical guide to the latest oncology therapies and outcomes in Istanbul.',
      fr: 'Guide médical complet sur les thérapies oncologiques de pointe et les résultats à Istanbul.',
    });
    setBodies({
      ar: 'أصبحت تركيا إحدى الوجهات العالمية المفضلة للعلاج الطبي بفضل استثماراتها الكبرى في البنية التحتية.\nتعتمد مشافينا على أحدث التقنيات الجراحية والمجالس الاستشارية متعددة التخصصات لضمان أعلى درجات الأمان.',
      en: 'Turkey has become a leading international destination for medical travel due to advanced infrastructure.\nOur accredited partner hospitals utilize state-of-the-art surgical robotics and multidisciplinary tumor boards.',
      fr: 'La Turquie est devenue une destination majeure du tourisme médical grâce à des investissements massifs.\nNos hôpitaux partenaires agréés s’appuient sur une robotique chirurgicale de pointe et des comités pluridisciplinaires.',
    });
    setCategorySlug('oncology');
    setReadingTime(5);
    setImageUrl('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop');
    setFocusKeyword('علاج السرطان في تركيا');
    setSeoTitle('علاج السرطان في تركيا | التكلفة ونسب النجاح - AVICINNA');
    setSeoDescription('دليل شامل حول أفضل مستشفيات علاج الأورام في إسطنبول وأحدث بروتوكولات العلاج المناعي.');
    setPublishToWordPress(true);
    setSyncMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (art: Article) => {
    setEditingArticle(art);
    setEditorTab(langKey);
    setTitles({
      ar: art.title.ar || '',
      en: art.title.en || art.title.ar || '',
      fr: art.title.fr || art.title.en || art.title.ar || '',
    });
    setExcerpts({
      ar: art.excerpt.ar || '',
      en: art.excerpt.en || art.excerpt.ar || '',
      fr: art.excerpt.fr || art.excerpt.en || art.excerpt.ar || '',
    });
    setBodies({
      ar: (art.content.ar || []).join('\n'),
      en: (art.content.en || art.content.ar || []).join('\n'),
      fr: (art.content.fr || art.content.en || art.content.ar || []).join('\n'),
    });
    setCategorySlug(art.categorySlug);
    setReadingTime(art.readingTimeMinutes);
    setAuthorName({
      ar: art.author.name.ar || 'أ. د. سردار تورهال',
      en: art.author.name.en || 'Prof. Dr. Serdar Turhal',
      fr: art.author.name.fr || 'Pr Dr Serdar Turhal',
    });
    setAuthorRole({
      ar: art.author.role.ar || 'استشاري طب الأورام',
      en: art.author.role.en || 'Consultant Oncologist',
      fr: art.author.role.fr || 'Oncologue Médical',
    });
    setHospitalName({
      ar: art.sourceHospital.ar || 'مستشفى أجيبادم',
      en: art.sourceHospital.en || 'Acibadem Hospital',
      fr: art.sourceHospital.fr || 'Hôpital Acibadem',
    });
    setImageUrl(art.image);
    setFocusKeyword(art.title[langKey] || art.title.ar);
    setSeoTitle(`${art.title[langKey] || art.title.ar} - AVICINNA`);
    setSeoDescription(art.excerpt[langKey] || art.excerpt.ar);
    setPublishToWordPress(true);
    setSyncMessage(null);
    setModalOpen(true);
  };

  // Write-Once Auto-Translate Handler with Confetti Burst
  const handleAutoTranslate = async () => {
    const currentTitle = titles[editorTab].trim();
    const currentExcerpt = excerpts[editorTab].trim();
    const currentBody = bodies[editorTab].trim();

    if (!currentTitle) {
      alert('Please enter at least a title before auto-translating.');
      return;
    }

    setIsTranslating(true);
    const targetLangs = (['ar', 'en', 'fr'] as Lang[]).filter((l) => l !== editorTab);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang: editorTab,
          targetLangs,
          payload: {
            title: currentTitle,
            excerpt: currentExcerpt,
            body: currentBody,
          },
          domainContext: 'medical_article',
        }),
      });

      const data = await res.json();
      if (data.success && data.translations) {
        setTitles((prev) => ({
          ...prev,
          ar: data.translations.ar?.title || prev.ar,
          en: data.translations.en?.title || prev.en,
          fr: data.translations.fr?.title || prev.fr,
        }));
        setExcerpts((prev) => ({
          ...prev,
          ar: data.translations.ar?.excerpt || prev.ar,
          en: data.translations.en?.excerpt || prev.en,
          fr: data.translations.fr?.excerpt || prev.fr,
        }));
        setBodies((prev) => ({
          ...prev,
          ar: data.translations.ar?.body || prev.ar,
          en: data.translations.en?.body || prev.en,
          fr: data.translations.fr?.body || prev.fr,
        }));

        // Celebratory dopamine feedback
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
        });
      }
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mainTitle = titles[editorTab] || titles.ar || titles.en || titles.fr;
    if (!mainTitle) return;

    setSyncingWp(true);
    setSyncMessage(null);

    const matchedCategory = articleCategories.find((c) => c.slug === categorySlug);
    const categoryName = {
      ar: matchedCategory?.name.ar || 'مقال طبي',
      en: matchedCategory?.name.en || 'Medical Article',
      fr: matchedCategory?.name.fr || 'Article Médical',
    };

    const paragraphsAr = (bodies.ar || bodies[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);
    const paragraphsEn = (bodies.en || bodies[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);
    const paragraphsFr = (bodies.fr || bodies[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);

    const safeTitleEn = titles.en || titles.fr || titles.ar;
    const generatedSlug = editingArticle
      ? editingArticle.slug
      : `${safeTitleEn.toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, '-')}-${Date.now()}`;

    const payload: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      slug: generatedSlug,
      categorySlug,
      categoryName,
      title: {
        ar: titles.ar || mainTitle,
        en: titles.en || titles.fr || mainTitle,
        fr: titles.fr || titles.en || mainTitle,
      },
      excerpt: {
        ar: excerpts.ar || excerpts[editorTab],
        en: excerpts.en || excerpts.fr || excerpts[editorTab],
        fr: excerpts.fr || excerpts.en || excerpts[editorTab],
      },
      content: {
        ar: paragraphsAr,
        en: paragraphsEn,
        fr: paragraphsFr,
      },
      readingTimeMinutes: Number(readingTime),
      publishedDate: editingArticle
        ? editingArticle.publishedDate
        : new Date().toISOString().split('T')[0],
      sourceHospital: hospitalName,
      image: imageUrl,
      author: {
        name: authorName,
        role: authorRole,
      },
    };

    if (editingArticle) {
      await updateArticle(payload);
    } else {
      await addArticle(payload);
    }

    if (publishToWordPress) {
      try {
        const wpPayload = {
          id: editingArticle?.id,
          title: payload.title[langKey] || payload.title.ar,
          content: (payload.content[langKey] || payload.content.ar).map((p) => `<p>${p}</p>`).join(''),
          excerpt: payload.excerpt[langKey] || payload.excerpt.ar,
          slug: generatedSlug,
          image: imageUrl,
          readingTime: Number(readingTime),
          authorName: authorName[langKey] || authorName.ar,
          authorRole: authorRole[langKey] || authorRole.ar,
          hospitalName: hospitalName[langKey] || hospitalName.ar,
          categorySlug,
          categoryName: categoryName[langKey] || categoryName.ar,
          seoTitle: seoTitle || `${payload.title[langKey]} - AVICINNA`,
          seoDescription: seoDescription || payload.excerpt[langKey],
          focusKeyword: focusKeyword || payload.title[langKey],
        };

        const res = await fetch('/api/wordpress/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wpPayload),
        });

        if (res.ok) {
          const resData = await res.json();
          setSyncMessage(
            langKey === 'fr'
              ? `Article synchronisé dans WordPress avec succès (ID: #${resData.data?.id || 'OK'}) !`
              : langKey === 'en'
              ? `Article published to WordPress successfully (ID: #${resData.data?.id || 'OK'})!`
              : `تم إنشاء المقال في ووردبريس بنجاح (Post ID: #${resData.data?.id || 'OK'})!`
          );
          verifyWpBridge();
        }
      } catch (err: any) {
        console.error('WordPress sync issue:', err);
      }
    }

    setSyncingWp(false);
    setTimeout(() => {
      setModalOpen(false);
    }, 1000);
  };

  const handleDelete = (art: Article) => {
    const artTitle = art.title[langKey] || art.title.ar;
    if (window.confirm(t.deleteConfirm(artTitle))) {
      deleteArticle(art.id);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const titleVal = (art.title[langKey] || art.title.ar || '').toLowerCase();
    const catVal = (art.categoryName[langKey] || art.categoryName.ar || '').toLowerCase();
    const authorVal = (art.author.name[langKey] || art.author.name.ar || '').toLowerCase();
    return titleVal.includes(q) || catVal.includes(q) || authorVal.includes(q);
  });

  return (
    <div dir={direction} className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{t.badge}</span>
            {wpStatus.online ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.wpOnline(wpStatus.totalArticles || 0)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                {t.wpLocalReady}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.pageTitle} ({articles.length})
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.pageSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnAddArticle}</span>
        </button>
      </div>

      {/* SEO Pro Masterclass Hero Banner */}
      <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-sky-950 via-teal-950 to-slate-950 text-white overflow-hidden shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-sky-800/60">
        <div className="absolute -top-24 -end-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-teal-500/25">
            <Target className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {langKey === 'ar'
                  ? 'محرك السيو الطبي المؤتمت (Rank Math & Yoast Studio)'
                  : langKey === 'fr'
                  ? 'Moteur SEO Médical Automatisé (Rank Math & Yoast)'
                  : 'Automated Medical SEO Studio (Rank Math & Yoast)'}
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200 border border-white/15">
                v2026 Pro
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {langKey === 'ar'
                ? 'نظام تصدر نتائج بحث جوجل وفهرسة المقالات الطبية بالذكاء الاصطناعي'
                : langKey === 'fr'
                ? 'Système d’Indexation & Positionnement Google #1 par IA'
                : 'Google #1 SERP Ranking & Automated Clinical SEO Engine'}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {langKey === 'ar'
                ? 'توليد تلقائي للكلمات المفتاحية، وعناوين النقر، والميتا ديسكريبشن، وسكيما الأسئلة الشائعة بنقرة واحدة لضمان سرعة الفهرسة وتصدر نتائج البحث الأولى.'
                : langKey === 'fr'
                ? 'Génération automatisée des mots-clés, titres à fort CTR, meta descriptions et données structurées pour une indexation ultra-rapide.'
                : 'Automated keyword extraction, high-CTR titles, meta descriptions, and rich Schema.org injection for rapid top SERP ranking.'}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0 self-end lg:self-center">
          <button
            type="button"
            onClick={() => setSeoGuideModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-teal-500/20 hover:from-sky-500/30 hover:to-teal-500/30 border border-teal-400/40 text-teal-200 hover:text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-teal-300" />
            <span>
              {langKey === 'ar'
                ? 'دليل استخدام السيو 🎯'
                : langKey === 'fr'
                ? 'Guide Pratique SEO 🎯'
                : 'Open SEO Guide 🎯'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
        />
      </div>

      {/* Articles Grid - Fluid Auto-Fit with Live Rank Math SEO Badges */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {filteredArticles.map((art) => {
          const displayTitle = art.title[langKey] || art.title.ar;
          const displayExcerpt = art.excerpt[langKey] || art.excerpt.ar;
          const displayCategory = art.categoryName[langKey] || art.categoryName.ar;
          const displayAuthor = art.author.name[langKey] || art.author.name.ar;
          const artBody = (art.content[langKey] || art.content.ar || []).join('\n');

          // Compute real-time Rank Math SEO Score for card
          const artSeo = analyzeArticleSeo({
            title: displayTitle,
            body: artBody,
            excerpt: displayExcerpt,
            focusKeyword: displayTitle.split(/[:؛\-\|]/)[0]?.trim() || displayTitle,
            seoTitle: `${displayTitle} | AVICINNA`,
            seoDescription: displayExcerpt,
            hasImage: Boolean(art.image),
          });

          return (
            <div
              key={art.id}
              className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-sky-500/5 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs group transition-all duration-200"
            >
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={art.image}
                  alt={displayTitle}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top-Start Live Rank Math SEO Score Badge */}
                <div className="absolute top-3 start-3 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md border border-white/10 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      artSeo.score >= 80
                        ? 'bg-emerald-400'
                        : artSeo.score >= 60
                        ? 'bg-teal-400'
                        : 'bg-amber-400'
                    } animate-pulse`}
                  />
                  <span className="font-mono text-[11px] font-black">{artSeo.score}/100</span>
                  <span className="text-[9px] text-teal-300 font-semibold uppercase">Rank Math</span>
                </div>

                {/* Top-End Category Pill */}
                <div className="absolute top-3 end-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {displayCategory}
                </div>

                {/* Bottom-Start Reading Time */}
                <div className="absolute bottom-3 start-3 text-slate-900 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs border border-transparent dark:border-slate-700/60">
                  <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>{art.readingTimeMinutes} {t.readMin}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {displayExcerpt}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{displayAuthor}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono">{art.publishedDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(art)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{t.btnEdit}</span>
                  </button>
                  <Link
                    href={`/blog/${art.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title={t.btnPreview}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(art)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title={t.btnDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Write-Once Auto-Translate Article Studio */}
      <ModalPortal isOpen={modalOpen}>
        <div dir={direction} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200 overflow-hidden">
          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[26px] sm:rounded-[30px] max-w-4xl w-full max-h-[86vh] flex flex-col shadow-2xl shadow-slate-900/15 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            {/* Shimmer Laser Overlay during AI Translation */}
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-sky-500/10 via-teal-500/20 to-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center"
                >
                  <div className="bg-white/95 px-6 py-4 rounded-2xl shadow-2xl border border-sky-200 flex items-center gap-3 text-sm font-bold text-sky-900 animate-pulse">
                    <Sparkles className="w-5 h-5 text-sky-600 animate-spin" />
                    <span>{t.translating}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center ring-4 ring-sky-500/10 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                    {editingArticle ? t.modalEditTitle : t.modalAddTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingArticle ? t.modalEditSubtitle : t.modalAddSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6 space-y-4">
                {/* Sync Feedback Alert */}
                {syncMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{syncMessage}</span>
                  </div>
                )}
              {/* WordPress Bridge Toggle */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    WP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {t.wpSyncTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.wpSyncSubtitle}
                    </span>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishToWordPress}
                    onChange={(e) => setPublishToWordPress(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.wpSyncCheck}</span>
                </label>
              </div>

              {/* Write-Once Language Tabs & Auto-Translate Action */}
              <div className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {(['fr', 'ar', 'en'] as Lang[]).map((tab) => {
                      const isSelected = editorTab === tab;
                      const hasContent = Boolean(titles[tab] && titles[tab].trim().length > 0);
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditorTab(tab)}
                          className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>{tab}</span>
                          {hasContent && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTranslating}
                    onClick={handleAutoTranslate}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>{t.translating}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t.autoTranslateBtn}</span>
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.writeInOneTab}
                </p>
              </div>

              {/* Title Input in Active Editor Tab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldTitle} ({editorTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={titles[editorTab]}
                  onChange={(e) => setTitles({ ...titles, [editorTab]: e.target.value })}
                  placeholder={
                    editorTab === 'ar'
                      ? 'مثال: أحدث بروتوكولات علاج الأورام والجراحة الروبوتية في إسطنبول'
                      : editorTab === 'fr'
                      ? 'Ex: Nouveaux protocoles en oncologie et chirurgie robotique à Istanbul'
                      : 'e.g., Breakthrough Robotic Surgery & Oncology Care in Istanbul'
                  }
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Category & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    label={t.fieldCategory}
                    value={categorySlug}
                    onChange={setCategorySlug}
                    options={articleCategories
                      .filter((c) => c.slug !== 'all')
                      .map((c) => ({
                        value: c.slug,
                        label: c.name[langKey] || c.name.ar,
                        subLabel: c.name.en,
                      }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldReadingTime}
                  </label>
                  <input
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Excerpt in Active Editor Tab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldExcerpt} ({editorTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={excerpts[editorTab]}
                  onChange={(e) => setExcerpts({ ...excerpts, [editorTab]: e.target.value })}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white leading-relaxed outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Author & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldAuthorName}
                  </label>
                  <input
                    type="text"
                    value={authorName[langKey] || authorName.ar}
                    onChange={(e) =>
                      setAuthorName({
                        ...authorName,
                        [langKey]: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldHospital}
                  </label>
                  <input
                    type="text"
                    value={hospitalName[langKey] || hospitalName.ar}
                    onChange={(e) =>
                      setHospitalName({
                        ...hospitalName,
                        [langKey]: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <ImageUploadField
                label={t.fieldImage}
                value={imageUrl}
                onChange={setImageUrl}
                folder="articles"
                aspectRatio="video"
              />

              {/* Article Content in Active Editor Tab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldBody} ({editorTab.toUpperCase()})
                </label>
                <textarea
                  rows={6}
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={bodies[editorTab]}
                  onChange={(e) => setBodies({ ...bodies, [editorTab]: e.target.value })}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white leading-relaxed outline-none transition-all font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Enterprise Rank Math / Yoast Medical SEO Studio */}
              <ArticleSeoStudio
                focusKeyword={focusKeyword}
                setFocusKeyword={setFocusKeyword}
                seoTitle={seoTitle}
                setSeoTitle={setSeoTitle}
                seoDescription={seoDescription}
                setSeoDescription={setSeoDescription}
                title={titles[editorTab]}
                body={bodies[editorTab]}
                excerpt={excerpts[editorTab]}
                setBody={(val) => setBodies((prev) => ({ ...prev, [editorTab]: val }))}
                setExcerpt={(val) => setExcerpts((prev) => ({ ...prev, [editorTab]: val }))}
                categorySlug={categorySlug}
                imageUrl={imageUrl}
                authorName={authorName[langKey] || authorName.ar}
                hospitalName={hospitalName[langKey] || hospitalName.ar}
                locale={langKey}
                onOpenGuide={() => setSeoGuideModalOpen(true)}
              />

              </div>

              {/* Action Buttons - Sticky & Always Visible */}
              <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={syncingWp}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  disabled={syncingWp}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {syncingWp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.btnSaving}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.btnSave}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>

      {/* Interactive SEO Masterclass Guide Modal */}
      <AdminSeoGuideModal
        isOpen={seoGuideModalOpen}
        onClose={() => setSeoGuideModalOpen(false)}
        locale={langKey}
      />
    </div>
  );
}
