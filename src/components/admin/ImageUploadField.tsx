'use client';

import React, { useState, useRef } from 'react';
import { uploadImageFile } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, Link2, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  helperText?: string;
}

const uploadDict = {
  ar: {
    uploadFromDevice: 'رفع من الجهاز',
    directUrl: 'رابط مباشر',
    processing: 'جاري معالجة ورفع الصورة...',
    dropPrompt: 'اضغط هنا لاختيار صورة من جهازك، أو اسحب الصورة وأفلتها',
    supportedFormats: 'يدعم ملفات JPG, PNG, WebP (بحد أقصى 5MB)',
    urlPlaceholder: 'https://images.unsplash.com/... أو رابط الصورة المباشر',
    success: 'تم اختيار الصورة بنجاح',
    localImage: 'صورة مرفوعة من الجهاز',
    remove: 'إزالة الصورة',
    invalidFile: 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)',
    tooLarge: 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)',
    failed: 'حدث خطأ أثناء رفع الصورة',
  },
  en: {
    uploadFromDevice: 'Upload File',
    directUrl: 'Direct URL',
    processing: 'Processing and uploading image...',
    dropPrompt: 'Click to select an image from your device or drag & drop',
    supportedFormats: 'Supports JPG, PNG, WebP (max 5MB)',
    urlPlaceholder: 'https://images.unsplash.com/... or verified image URL',
    success: 'Image attached successfully',
    localImage: 'Uploaded local file',
    remove: 'Remove image',
    invalidFile: 'Please select a valid image file (JPG, PNG, WebP)',
    tooLarge: 'Image is too large (maximum 5MB)',
    failed: 'Failed to upload image',
  },
  fr: {
    uploadFromDevice: 'Importer',
    directUrl: 'Lien direct',
    processing: 'Traitement et téléversement de l’image...',
    dropPrompt: 'Cliquez pour sélectionner une image ou glissez-déposez',
    supportedFormats: 'Prend en charge JPG, PNG, WebP (max 5 Mo)',
    urlPlaceholder: 'https://images.unsplash.com/... ou URL directe',
    success: 'Image sélectionnée avec succès',
    localImage: 'Fichier local téléversé',
    remove: 'Supprimer l’image',
    invalidFile: 'Veuillez sélectionner un fichier image valide (JPG, PNG, WebP)',
    tooLarge: 'L’image est trop volumineuse (maximum 5 Mo)',
    failed: 'Échec du téléversement de l’image',
  },
};

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'uploads',
  aspectRatio = 'auto',
  helperText,
}: ImageUploadFieldProps) {
  const { language } = useLanguage();
  const langKey = language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar';
  const t = uploadDict[langKey];

  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t.invalidFile);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t.tooLarge);
      return;
    }

    setIsUploading(true);
    try {
      const resultUrl = await uploadImageFile(file, folder);
      if (resultUrl) {
        onChange(resultUrl);
      }
    } catch (err) {
      console.error('Failed to process image:', err);
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

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[180px]'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4] max-w-[180px]'
      : aspectRatio === 'video'
      ? 'aspect-video max-w-[280px]'
      : 'max-h-48 w-auto';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-semibold border border-transparent dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-sky-700 shadow-xs font-bold dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.uploadFromDevice}
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-sky-700 shadow-xs font-bold dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.directUrl}
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload / Drag & Drop */}
      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-sky-50/30 dark:hover:bg-slate-800/70'
            }`}
          >
            {isUploading ? (
              <div className="py-4 flex flex-col items-center gap-2 text-sky-600 dark:text-sky-400">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-xs font-bold">{t.processing}</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.dropPrompt}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                    {t.supportedFormats}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: Direct URL Input */
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.urlPlaceholder}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2 ps-9 pe-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      )}

      {/* High-Fidelity Responsive Preview Card */}
      {value && (
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/50 p-3 sm:p-4 mt-2 shadow-2xs">
          {aspectRatio === 'square' || aspectRatio === 'portrait' ? (
            /* Compact side-by-side layout for portraits and avatars */
            <div className="flex items-center gap-4">
              <div
                className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 ${
                  aspectRatio === 'square' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-24 h-32 sm:w-28 sm:h-36'
                }`}
              >
                <img
                  src={value}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.success}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-xs font-mono">
                  {value.startsWith('data:') ? t.localImage : value}
                </p>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/80 dark:bg-rose-950/30 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.remove}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Full-width panoramic / landscape layout for hospitals, clinics, treatments */
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {t.success}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-sm font-mono">
                      {value.startsWith('data:') ? t.localImage : value}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/80 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.remove}</span>
                </button>
              </div>

              <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex items-center justify-center">
                <img
                  src={value}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 start-2.5 end-2.5 flex items-center justify-between text-[11px] text-white/90">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <ImageIcon className="w-3 h-3 text-sky-400" />
                    <span>{aspectRatio === 'video' ? '16:9' : 'Panoramic View'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}
