'use client';

import React, { useState, useRef } from 'react';
import { uploadImageFile } from '@/lib/supabase';
import { Upload, Link2, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  helperText?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'uploads',
  aspectRatio = 'auto',
  helperText,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP) / Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت) / Image too large, max 5MB');
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
      alert('حدث خطأ أثناء رفع الصورة / Failed to upload image');
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
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            رفع من الجهاز
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-sky-700 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            رابط مباشر
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
                ? 'border-sky-500 bg-sky-50/80 scale-[1.01]'
                : 'border-slate-200 hover:border-sky-400 bg-slate-50/60 hover:bg-sky-50/30'
            }`}
          >
            {isUploading ? (
              <div className="py-4 flex flex-col items-center gap-2 text-sky-600">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-xs font-bold">جاري معالجة ورفع الصورة...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    اضغط هنا لاختيار صورة من جهازك، أو اسحب الصورة وأفلتها
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    يدعم ملفات JPG, PNG, WebP (بحد أقصى 5MB)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: Direct URL Input */
        <div className="relative">
          <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto pr-3 rtl:pr-3 ltr:pl-3 flex items-center pointer-events-none text-slate-400">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... أو رابط الصورة المباشر"
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 rtl:pr-9 ltr:pl-9 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
          />
        </div>
      )}

      {/* Preview Box if image exists */}
      {value && (
        <div className="relative inline-flex items-center gap-3 p-2 bg-slate-100 rounded-xl border border-slate-200 mt-2">
          <div className={`relative overflow-hidden rounded-lg bg-white border border-slate-200 ${aspectClass}`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم اختيار الصورة بنجاح</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">
              {value.startsWith('data:') ? 'صورة مرفوعة من الجهاز (Base64)' : value}
            </p>
            <button
              type="button"
              onClick={() => onChange('')}
              className="mt-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>إزالة الصورة</span>
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
    </div>
  );
}
