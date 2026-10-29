'use client';

import React, { useState, useRef } from 'react';
import { uploadImageFile } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Video, Upload, Link2, X, Play, Loader2, CheckCircle2 } from 'lucide-react';

interface VideoUploadFieldProps {
  label: string;
  videoUrl: string;
  videoTitle?: string;
  onVideoUrlChange: (url: string) => void;
  onVideoTitleChange?: (title: string) => void;
  helperText?: string;
}

const videoDict = {
  ar: {
    videoLinkBtn: 'رابط فيديو (YouTube / Vimeo)',
    videoUploadBtn: 'رفع فيديو من الجهاز',
    emptyNotice: '(فارغ - بدون فيديو)',
    videoTitleLabel: 'عنوان الفيديو أو الموضوع (اختياري):',
    videoTitlePlaceholder: 'مثال: شرح استئصال أورام الدماغ وجراحة قاع الجمجمة',
    urlPlaceholder: 'https://www.youtube.com/watch?v=... أو رابط مباشر',
    urlHelper: 'يدعم روابط يوتيوب، الشورتس، فيميو (Vimeo)، أو ملفات MP4.',
    uploadProcessing: 'جارٍ معالجة ورفع الفيديو...',
    uploadPrompt: 'انقر لرفع مقطع فيديو أو اسحبه هنا',
    supportedFormats: 'صيغ MP4, WebM (الحد الأقصى 50MB)',
    previewTitle: 'معاينة مشغل الفيديو:',
    clearVideo: 'إلغاء وحذف الفيديو',
    invalidFile: 'يرجى اختيار ملف فيديو صالح (MP4, WebM)',
    tooLarge: 'حجم الفيديو كبير جداً (الحد الأقصى 50 ميجابايت). يُفضل استخدام رابط يوتيوب.',
    failed: 'حدث خطأ أثناء رفع الفيديو',
  },
  en: {
    videoLinkBtn: 'Video Link (YouTube / Vimeo)',
    videoUploadBtn: 'Upload Video File',
    emptyNotice: '(Optional - No video)',
    videoTitleLabel: 'Video Title or Topic (Optional):',
    videoTitlePlaceholder: 'e.g., Explanation of Minimally Invasive Surgery',
    urlPlaceholder: 'https://www.youtube.com/watch?v=... or direct MP4 link',
    urlHelper: 'Supports YouTube, YouTube Shorts, Vimeo, or direct MP4 files.',
    uploadProcessing: 'Processing and uploading video...',
    uploadPrompt: 'Click to select a video file or drag & drop here',
    supportedFormats: 'MP4, WebM formats (Max 50MB)',
    previewTitle: 'Video Player Preview:',
    clearVideo: 'Remove video',
    invalidFile: 'Please select a valid video file (MP4, WebM)',
    tooLarge: 'Video file too large (Max 50MB). YouTube links recommended.',
    failed: 'Failed to upload video file',
  },
  fr: {
    videoLinkBtn: 'Lien vidéo (YouTube / Vimeo)',
    videoUploadBtn: 'Importer une vidéo',
    emptyNotice: '(Facultatif - Sans vidéo)',
    videoTitleLabel: 'Titre ou sujet de la vidéo (Optionnel) :',
    videoTitlePlaceholder: 'Ex: Présentation de la chirurgie mini-invasive',
    urlPlaceholder: 'https://www.youtube.com/watch?v=... ou lien MP4 direct',
    urlHelper: 'Prend en charge YouTube, Shorts, Vimeo ou liens directs MP4.',
    uploadProcessing: 'Traitement et téléversement de la vidéo...',
    uploadPrompt: 'Cliquez pour sélectionner une vidéo ou glissez-déposez',
    supportedFormats: 'Formats MP4, WebM (Max 50 Mo)',
    previewTitle: 'Aperçu du lecteur vidéo :',
    clearVideo: 'Supprimer la vidéo',
    invalidFile: 'Veuillez sélectionner un fichier vidéo valide (MP4, WebM)',
    tooLarge: 'Fichier trop volumineux (Max 50 Mo). Lien YouTube recommandé.',
    failed: 'Échec du téléversement de la vidéo',
  },
};

export function formatVideoEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export function VideoUploadField({
  label,
  videoUrl,
  videoTitle,
  onVideoUrlChange,
  onVideoTitleChange,
  helperText,
}: VideoUploadFieldProps) {
  const { language } = useLanguage();
  const langKey = language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar';
  const t = videoDict[langKey];

  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(t.invalidFile);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert(t.tooLarge);
      return;
    }

    setIsUploading(true);
    try {
      const resultUrl = await uploadImageFile(file, 'videos');
      if (resultUrl) {
        onVideoUrlChange(resultUrl);
      }
    } catch (err) {
      console.error('Failed to upload video:', err);
      alert(t.failed);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isPlaceholder =
    Boolean(videoUrl) &&
    (videoUrl.includes('a3ICNMQW7Ok') ||
      videoUrl.includes('5qap5aO4i9A') ||
      videoUrl.toLowerCase().includes('wildlife'));
  const effectiveVideoUrl = isPlaceholder ? '' : videoUrl;
  const embedUrl = formatVideoEmbedUrl(effectiveVideoUrl);
  const isEmbed = embedUrl.includes('youtube.com/embed') || embedUrl.includes('player.vimeo.com');

  return (
    <div className="space-y-3 bg-slate-50/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
          <Video className="w-4 h-4 text-sky-500" />
          <span>{label}</span>
          {!effectiveVideoUrl && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {t.emptyNotice}
            </span>
          )}
        </label>
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'url'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{t.videoLinkBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'upload'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.videoUploadBtn}</span>
          </button>
        </div>
      </div>

      {/* Video Title Input */}
      {onVideoTitleChange && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
            {t.videoTitleLabel}
          </label>
          <input
            type="text"
            value={videoTitle || ''}
            onChange={(e) => onVideoTitleChange(e.target.value)}
            placeholder={t.videoTitlePlaceholder}
            className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      )}

      {/* Mode 1: URL Input */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                placeholder={t.urlPlaceholder}
                className="w-full text-xs py-2.5 ps-9 pe-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono"
              />
            </div>
            {videoUrl && (
              <button
                type="button"
                onClick={() => onVideoUrlChange('')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.clearVideo}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {t.urlHelper}
          </p>
        </div>
      )}

      {/* Mode 2: Local Upload */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40'
                : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{t.uploadProcessing}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                    {t.uploadPrompt}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {t.supportedFormats}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Video Preview */}
      {effectiveVideoUrl && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.previewTitle}</span>
            </span>
            <button
              type="button"
              onClick={() => onVideoUrlChange('')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>{t.clearVideo}</span>
            </button>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
            {isEmbed ? (
              <iframe
                src={embedUrl}
                title="Video preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={effectiveVideoUrl}
                controls
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
}
