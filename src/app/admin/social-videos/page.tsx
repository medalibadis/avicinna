'use client';

import React, { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { SocialVideo } from '@/data/socialVideos';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Play,
  Upload,
  Link2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Loader2,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ModalPortal } from '@/components/admin/ModalPortal';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { toast } from 'sonner';

type Lang = 'ar' | 'en' | 'fr';

const adminDict = {
  ar: {
    badge: 'مقاطع وفيديوهات السوشيال ميديا (Reels)',
    title: 'إدارة مقاطع وتجارب الفيديو',
    subtitle: 'إضافة وتخصيص فيديوهات إنستغرام، يوتيوب، أو رفع ملفات فيديو مباشرة لتظهر في الصفحة الرئيسية.',
    btnAdd: 'إضافة فيديو جديد',
    searchPlaceholder: 'ابحث بعنوان الفيديو، المنصة، أو التصنيف...',
    totalVideos: 'إجمالي المقاطع',
    activeVideos: 'المقاطع النشطة بالواجهة',
    instagramChannel: 'حساب إنستغرام الرسمي',
    filterAll: 'جميع المنصات',
    filterInstagram: 'إنستغرام (Reels)',
    filterYouTube: 'يوتيوب (Shorts)',
    filterUpload: 'ملفات مرفوعة',
    btnEdit: 'تعديل',
    btnDelete: 'حذف',
    deleteConfirm: (title: string) => `هل أنت متأكد من حذف مقطع الفيديو: "${title}"؟`,
    modalAddTitle: 'إضافة مقطع فيديو جديد للواجهة',
    modalEditTitle: 'تعديل مقطع الفيديو',
    modalSubtitle: 'اختر بين إضافة رابط خارجي (إنستغرام / يوتيوب) أو رفع ملف فيديو مباشر من جهازك.',
    sourceTypeTabLink: 'رابط خارجي (Instagram / YouTube / Facebook)',
    sourceTypeTabUpload: 'رفع ملف فيديو مباشر (MP4 / WebM)',
    urlLabel: 'رابط مقطع الفيديو *',
    urlPlaceholder: 'مثال: https://www.instagram.com/reel/DfVJRI2uM34/ أو رابط يوتيوب',
    urlHelper: 'يدعم روابط إنستغرام ريلز، يوتيوب شورتس، فيسبوك، أو روابط MP4 المباشرة.',
    uploadLabel: 'رفع ملف الفيديو من جهازك *',
    uploadPrompt: 'انقر لاختيار ملف فيديو أو اسحبه هنا',
    uploadFormats: 'صيغ MP4, WebM, MOV (الحد الأقصى 50 ميجابايت)',
    uploadingFile: 'جارٍ معالجة وتجهيز ملف الفيديو...',
    thumbnailLabel: 'صورة الغلاف / المعاينة (Poster Thumbnail)',
    titleArLabel: 'عنوان الفيديو (بالعربية) *',
    titleEnLabel: 'عنوان الفيديو (بالإنجليزية)',
    titleFrLabel: 'عنوان الفيديو (بالفرنسية)',
    subtitleArLabel: 'وصف قصير / اقتباس (بالعربية)',
    subtitleEnLabel: 'وصف قصير / اقتباس (بالإنجليزية)',
    categoryArLabel: 'التصنيف الطبي (مثال: تجارب المرضى، زراعة الشعر)',
    categoryEnLabel: 'التصنيف (بالإنجليزية)',
    platformLabel: 'المنصة',
    handleLabel: 'معرّف الحساب (مثال: @avicinna_medical)',
    authorUrlLabel: 'رابط الحساب على المنصة',
    viewsLabel: 'عدد المشاهدات التقريبي (مثال: 45.2K)',
    durationLabel: 'مدة المقطع (مثال: 0:58)',
    statusActiveLabel: 'عرض ونشر المقطع في الواجهة الرئيسية فوراً',
    btnSave: 'حفظ واعتماد الفيديو',
    btnCancel: 'إلغاء',
    previewTitle: 'معاينة مشغل الفيديو:',
  },
  en: {
    badge: 'Social Media Video Reels',
    title: 'Social Media Videos & Reels Management',
    subtitle: 'Add and customize Instagram reels, YouTube shorts, or direct uploaded video files on the homepage.',
    btnAdd: 'Add New Video',
    searchPlaceholder: 'Search by video title, platform, or category...',
    totalVideos: 'Total Videos',
    activeVideos: 'Active on Homepage',
    instagramChannel: 'Official Instagram Channel',
    filterAll: 'All Platforms',
    filterInstagram: 'Instagram (Reels)',
    filterYouTube: 'YouTube (Shorts)',
    filterUpload: 'Uploaded Files',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    deleteConfirm: (title: string) => `Are you sure you want to delete video: "${title}"?`,
    modalAddTitle: 'Add New Social Reel Video',
    modalEditTitle: 'Edit Video Details',
    modalSubtitle: 'Choose between adding an external link (Instagram / YouTube) or uploading a video file directly.',
    sourceTypeTabLink: 'External Link (Instagram / YouTube / Facebook)',
    sourceTypeTabUpload: 'Direct Video File Upload (MP4 / WebM)',
    urlLabel: 'Video URL *',
    urlPlaceholder: 'e.g. https://www.instagram.com/reel/DfVJRI2uM34/ or YouTube link',
    urlHelper: 'Supports Instagram Reels, YouTube Shorts, Facebook, or direct MP4 URLs.',
    uploadLabel: 'Upload Video File from Computer *',
    uploadPrompt: 'Click to select a video file or drag and drop here',
    uploadFormats: 'MP4, WebM, MOV formats (Max 50MB)',
    uploadingFile: 'Processing and uploading video file...',
    thumbnailLabel: 'Cover Poster / Thumbnail Image',
    titleArLabel: 'Video Title (Arabic) *',
    titleEnLabel: 'Video Title (English)',
    titleFrLabel: 'Video Title (French)',
    subtitleArLabel: 'Short Subtitle / Quote (Arabic)',
    subtitleEnLabel: 'Short Subtitle / Quote (English)',
    categoryArLabel: 'Category (e.g., Patient Stories, Hair Transplant)',
    categoryEnLabel: 'Category (English)',
    platformLabel: 'Platform',
    handleLabel: 'Account Handle (e.g. @avicinna_medical)',
    authorUrlLabel: 'Account Profile URL',
    viewsLabel: 'Estimated Views (e.g. 45.2K)',
    durationLabel: 'Duration (e.g. 0:58)',
    statusActiveLabel: 'Display and publish on homepage immediately',
    btnSave: 'Save & Publish Video',
    btnCancel: 'Cancel',
    previewTitle: 'Video Player Preview:',
  },
  fr: {
    badge: 'Reels & Vidéos Réseaux Sociaux',
    title: 'Gestion des Vidéos Réseaux Sociaux',
    subtitle: 'Ajoutez et personnalisez les reels Instagram, vidéos YouTube ou importations directes pour la page d’accueil.',
    btnAdd: 'Ajouter une Vidéo',
    searchPlaceholder: 'Rechercher par titre, plateforme ou catégorie...',
    totalVideos: 'Total Vidéos',
    activeVideos: 'Actives en Page d’Accueil',
    instagramChannel: 'Compte Instagram Officiel',
    filterAll: 'Toutes Plateformes',
    filterInstagram: 'Instagram (Reels)',
    filterYouTube: 'YouTube (Shorts)',
    filterUpload: 'Fichiers Importés',
    btnEdit: 'Modifier',
    btnDelete: 'Supprimer',
    deleteConfirm: (title: string) => `Êtes-vous sûr de vouloir supprimer la vidéo : "${title}" ?`,
    modalAddTitle: 'Ajouter une Nouvelle Vidéo Reel',
    modalEditTitle: 'Modifier la Vidéo',
    modalSubtitle: 'Choisissez entre un lien externe (Instagram / YouTube) ou l’importation directe d’un fichier vidéo.',
    sourceTypeTabLink: 'Lien Externe (Instagram / YouTube / Facebook)',
    sourceTypeTabUpload: 'Importer un Fichier Vidéo (MP4 / WebM)',
    urlLabel: 'Lien de la Vidéo *',
    urlPlaceholder: 'Ex: https://www.instagram.com/reel/DfVJRI2uM34/ ou lien YouTube',
    urlHelper: 'Prend en charge Instagram Reels, YouTube Shorts, Facebook ou liens MP4 directs.',
    uploadLabel: 'Importer une Vidéo depuis votre appareil *',
    uploadPrompt: 'Cliquez pour sélectionner un fichier vidéo ou glissez-le ici',
    uploadFormats: 'Formats MP4, WebM, MOV (Max 50 Mo)',
    uploadingFile: 'Traitement du fichier vidéo...',
    thumbnailLabel: 'Image de Couverture / Miniature',
    titleArLabel: 'Titre de la Vidéo (Arabe) *',
    titleEnLabel: 'Titre de la Vidéo (Anglais)',
    titleFrLabel: 'Titre de la Vidéo (Français)',
    subtitleArLabel: 'Court Sous-titre / Citation (Arabe)',
    subtitleEnLabel: 'Court Sous-titre / Citation (Anglais)',
    categoryArLabel: 'Catégorie Médicale',
    categoryEnLabel: 'Catégorie (Anglais)',
    platformLabel: 'Plateforme',
    handleLabel: 'Nom du Compte (Ex: @avicinna_medical)',
    authorUrlLabel: 'Lien vers le Profil',
    viewsLabel: 'Nombre de Vues (Ex: 45.2K)',
    durationLabel: 'Durée (Ex: 0:58)',
    statusActiveLabel: 'Publier immédiatement sur la page d’accueil',
    btnSave: 'Enregistrer la Vidéo',
    btnCancel: 'Annuler',
    previewTitle: 'Aperçu du Lecteur Vidéo :',
  },
};

export default function SocialVideosAdminPage() {
  const { language, direction } = useLanguage();
  const langKey: Lang = language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar';
  const t = adminDict[langKey];
  const isRtl = direction === 'rtl';

  const { socialVideos, addSocialVideo, updateSocialVideo, deleteSocialVideo } = useData();
  const { confirm } = useConfirmDialog();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'youtube' | 'upload'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SocialVideo | null>(null);

  // Form Fields
  const [sourceType, setSourceType] = useState<'link' | 'upload'>('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState<SocialVideo['platform']>('instagram');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [categoryAr, setCategoryAr] = useState('تجارب المرضى');
  const [categoryEn, setCategoryEn] = useState('Patient Stories');
  const [authorHandle, setAuthorHandle] = useState('@avicinna_medical');
  const [authorUrl, setAuthorUrl] = useState('https://www.instagram.com/avicinna_medical');
  const [views, setViews] = useState('35.0K');
  const [duration, setDuration] = useState('0:50');
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect platform from URL input
  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    const lower = val.toLowerCase();
    if (lower.includes('instagram.com')) {
      setPlatform('instagram');
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      setPlatform('youtube');
    } else if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
      setPlatform('facebook');
    } else if (lower.includes('tiktok.com')) {
      setPlatform('tiktok');
    }
  };

  // Handle direct file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error(langKey === 'ar' ? 'حجم الفيديو كبير جداً (أقصى حد 50MB)' : 'File too large (max 50MB)');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVideoUrl(reader.result);
        setSourceType('upload');
        setPlatform('custom');
        setIsUploading(false);
        toast.success(langKey === 'ar' ? 'تم تجهيز ملف الفيديو بنجاح!' : 'Video file processed successfully!');
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error(langKey === 'ar' ? 'فشل قراءة ملف الفيديو' : 'Failed to read video file');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setSourceType('link');
    setVideoUrl('https://www.instagram.com/reel/DfVJRI2uM34/');
    setPlatform('instagram');
    setThumbnailUrl('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80');
    setTitleAr('');
    setTitleEn('');
    setTitleFr('');
    setSubtitleAr('');
    setSubtitleEn('');
    setCategoryAr('تجارب المرضى');
    setCategoryEn('Patient Stories');
    setAuthorHandle('@avicinna_medical');
    setAuthorUrl('https://www.instagram.com/avicinna_medical');
    setViews('42.0K');
    setDuration('0:55');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (video: SocialVideo) => {
    setEditingVideo(video);
    setSourceType(video.videoType || 'link');
    setVideoUrl(video.videoUrl || '');
    setPlatform(video.platform || 'instagram');
    setThumbnailUrl(video.thumbnailUrl || '');
    setTitleAr(video.title?.ar || '');
    setTitleEn(video.title?.en || '');
    setTitleFr(video.title?.fr || '');
    setSubtitleAr(video.subtitle?.ar || '');
    setSubtitleEn(video.subtitle?.en || '');
    setCategoryAr(video.category?.ar || 'تجارب المرضى');
    setCategoryEn(video.category?.en || 'Patient Stories');
    setAuthorHandle(video.authorHandle || '@avicinna_medical');
    setAuthorUrl(video.authorUrl || 'https://www.instagram.com/avicinna_medical');
    setViews(video.views || '35.0K');
    setDuration(video.duration || '0:50');
    setIsActive(video.isActive);
    setIsModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleAr.trim()) {
      toast.error(langKey === 'ar' ? 'يرجى إدخال عنوان الفيديو بالعربية' : 'Please provide Arabic title');
      return;
    }
    if (!videoUrl.trim()) {
      toast.error(langKey === 'ar' ? 'يرجى إدخال رابط الفيديو أو رفع ملف' : 'Please provide video URL or file');
      return;
    }

    const payload: SocialVideo = {
      id: editingVideo ? editingVideo.id : `reel-${Date.now()}`,
      title: {
        ar: titleAr.trim(),
        en: titleEn.trim() || titleAr.trim(),
        fr: titleFr.trim() || titleAr.trim(),
      },
      subtitle: {
        ar: subtitleAr.trim(),
        en: subtitleEn.trim() || subtitleAr.trim(),
        fr: subtitleAr.trim(),
      },
      platform,
      videoUrl: videoUrl.trim(),
      videoType: sourceType,
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      authorHandle: authorHandle.trim() || '@avicinna_medical',
      authorUrl: authorUrl.trim() || 'https://www.instagram.com/avicinna_medical',
      views: views.trim() || '25.0K',
      duration: duration.trim() || '0:45',
      category: {
        ar: categoryAr.trim() || 'تجارب المرضى',
        en: categoryEn.trim() || 'Patient Stories',
        fr: categoryEn.trim() || 'Témoignages',
      },
      rating: 5,
      isActive,
      order: editingVideo ? editingVideo.order : (socialVideos?.length || 0) + 1,
    };

    if (editingVideo) {
      await updateSocialVideo(payload);
      toast.success(langKey === 'ar' ? 'تم تحديث مقطع الفيديو بنجاح!' : 'Video updated successfully!');
    } else {
      await addSocialVideo(payload);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      toast.success(langKey === 'ar' ? 'تمت إضافة مقطع الفيديو ونشره بالواجهة بنجاح!' : 'Video added and published successfully!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteVideo = async (video: SocialVideo) => {
    const ok = await confirm({
      title: langKey === 'ar' ? 'تأكيد حذف الفيديو' : 'Confirm Video Deletion',
      message: t.deleteConfirm(video.title[langKey] || video.title.ar),
      confirmText: langKey === 'ar' ? 'حذف نهائي' : 'Delete',
      cancelText: langKey === 'ar' ? 'إلغاء' : 'Cancel',
      variant: 'danger',
    });

    if (ok) {
      await deleteSocialVideo(video.id);
      toast.success(langKey === 'ar' ? 'تم حذف مقطع الفيديو' : 'Video deleted successfully');
    }
  };

  const handleToggleActive = async (video: SocialVideo) => {
    const updated = { ...video, isActive: !video.isActive };
    await updateSocialVideo(updated);
    toast.success(
      updated.isActive
        ? (langKey === 'ar' ? 'تم تفعيل ظهور المقطع في الواجهة الرئيسية' : 'Video activated on homepage')
        : (langKey === 'ar' ? 'تم إخفاء المقطع من الواجهة الرئيسية' : 'Video hidden from homepage')
    );
  };

  // Filter videos
  const filteredVideos = (socialVideos || []).filter((v) => {
    const matchesQuery =
      (v.title.ar && v.title.ar.includes(searchQuery)) ||
      (v.title.en && v.title.en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.category?.ar && v.category.ar.includes(searchQuery)) ||
      (v.authorHandle && v.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (platformFilter === 'instagram') return v.platform === 'instagram';
    if (platformFilter === 'youtube') return v.platform === 'youtube';
    if (platformFilter === 'upload') return v.videoType === 'upload';
    return true;
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold mb-3">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/avicinna_medical?exln=MWRhbGJkZDdrcXNjYg=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold transition-all"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@avicinna_medical</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.btnAdd}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.totalVideos}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {socialVideos?.length || 0}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t.activeVideos}</span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 tabular-nums">
              {(socialVideos || []).filter((v) => v.isActive).length}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/20 border border-pink-500/20 flex flex-col justify-between">
            <span className="text-xs text-pink-600 dark:text-pink-400 font-medium">{t.instagramChannel}</span>
            <span className="text-sm font-extrabold text-pink-700 dark:text-pink-300 mt-1">@avicinna_medical</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Platform Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'instagram', label: t.filterInstagram },
            { id: 'youtube', label: t.filterYouTube },
            { id: 'upload', label: t.filterUpload },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlatformFilter(item.id as any)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                platformFilter === item.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between group"
          >
            {/* Poster Thumbnail */}
            <div className="relative aspect-[9/16] max-h-72 w-full overflow-hidden bg-slate-950">
              <img
                src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Status and Platform Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                  {video.category?.[langKey] || video.category?.ar || 'Reel'}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-bold text-pink-400 border border-white/10">
                    {video.platform === 'youtube' ? 'YouTube' : video.videoType === 'upload' ? 'MP4 File' : 'Instagram'}
                  </span>
                </div>
              </div>

              {/* Center Play Button icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom stats overlay */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-white">
                <span className="font-mono">{video.duration}</span>
                <span className="font-bold text-amber-300">{video.views}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {video.title[langKey] || video.title.ar}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {video.authorHandle}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {/* Active Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(video)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    video.isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {video.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{video.isActive ? (langKey === 'ar' ? 'منشور' : 'Live') : (langKey === 'ar' ? 'مخفي' : 'Hidden')}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(video)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={t.btnEdit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title={t.btnDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {editingVideo ? t.modalEditTitle : t.modalAddTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.modalSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="mt-6 space-y-5">
                {/* Source Type Toggle Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {langKey === 'ar' ? 'طريقة إضافة الفيديو:' : 'Video Source Mode:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setSourceType('link')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        sourceType === 'link'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Link2 className="w-4 h-4" />
                      <span>{t.sourceTypeTabLink}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceType('upload')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        sourceType === 'upload'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{t.sourceTypeTabUpload}</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Input based on Source Type */}
                {sourceType === 'link' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.urlLabel}
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder={t.urlPlaceholder}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                      required
                    />
                    <p className="mt-1 text-[11px] text-slate-400">{t.urlHelper}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.uploadLabel}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-sky-500">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-bold">{t.uploadingFile}</span>
                        </div>
                      ) : videoUrl && sourceType === 'upload' ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-8 h-8" />
                          <span className="text-xs font-bold">
                            {langKey === 'ar' ? 'تم اختيار الفيديو بنجاح (انقر للتغيير)' : 'Video file attached (click to change)'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <Upload className="w-8 h-8 text-sky-500" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.uploadPrompt}</span>
                          <span className="text-[11px] text-slate-400">{t.uploadFormats}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Poster / Thumbnail Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.thumbnailLabel}
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://... رابط صورة الغلاف أو بوستر المقطع"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                {/* Video Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.titleArLabel}
                    </label>
                    <input
                      type="text"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      placeholder="مثال: قصة نجاح واستعادة البسمة في إسطنبول"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.titleEnLabel}
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Patient Success Story & New Smile"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Subtitles / Quotes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.subtitleArLabel}
                    </label>
                    <input
                      type="text"
                      value={subtitleAr}
                      onChange={(e) => setSubtitleAr(e.target.value)}
                      placeholder="مرافقة طبية دقيقة من لحظة الوصول..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.categoryArLabel}
                    </label>
                    <input
                      type="text"
                      value={categoryAr}
                      onChange={(e) => setCategoryAr(e.target.value)}
                      placeholder="تجارب المرضى / زراعة الأسنان..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Platform, Handle, Views, Duration */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.platformLabel}
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                      <option value="custom">Direct Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.handleLabel}
                    </label>
                    <input
                      type="text"
                      value={authorHandle}
                      onChange={(e) => setAuthorHandle(e.target.value)}
                      placeholder="@avicinna_medical"
                      className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.viewsLabel}
                    </label>
                    <input
                      type="text"
                      value={views}
                      onChange={(e) => setViews(e.target.value)}
                      placeholder="45.2K"
                      className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.durationLabel}
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="0:55"
                      className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Active Switch */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    {t.statusActiveLabel}
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-sky-600/20 active:scale-95 transition-all"
                  >
                    {t.btnSave}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
