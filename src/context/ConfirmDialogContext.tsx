'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, LogOut, RotateCcw, X } from 'lucide-react';
import { ModalPortal } from '@/components/admin/ModalPortal';
import { useLanguage } from '@/context/LanguageContext';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: 'trash' | 'alert' | 'logout' | 'refresh';
}

type ConfirmFunction = (options: string | ConfirmOptions) => Promise<boolean>;

interface ConfirmContextType {
  confirm: ConfirmFunction;
}

const ConfirmDialogContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm: ConfirmFunction = useCallback((opts) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      if (typeof opts === 'string') {
        // Parse raw string to check if it's a deletion or logout message
        let detectedItem = '';
        const match = opts.match(/[:\?]\s*([^?]+)/);
        if (match && match[1]) {
          detectedItem = match[1].trim();
        }

        const isDelete = opts.toLowerCase().includes('delete') || opts.includes('حذف') || opts.toLowerCase().includes('supprimer');
        const isLogout = opts.toLowerCase().includes('sign out') || opts.toLowerCase().includes('logout') || opts.includes('تسجيل الخروج');
        const isReset = opts.toLowerCase().includes('reset') || opts.includes('إعادة تعيين') || opts.includes('réinitialiser');

        setOptions({
          title: isDelete
            ? (language === 'ar' ? 'تأكيد الحذف النهائي' : language === 'fr' ? 'Confirmer la suppression' : 'Confirm Permanent Deletion')
            : isLogout
            ? (language === 'ar' ? 'تسجيل الخروج' : language === 'fr' ? 'Déconnexion' : 'Sign Out')
            : (language === 'ar' ? 'تأكيد الإجراء' : language === 'fr' ? 'Confirmer l’action' : 'Confirm Action'),
          message: opts,
          itemName: detectedItem || undefined,
          variant: isDelete ? 'danger' : isReset ? 'warning' : 'info',
          icon: isDelete ? 'trash' : isLogout ? 'logout' : isReset ? 'refresh' : 'alert',
        });
      } else {
        setOptions(opts);
      }
      setIsOpen(true);
    });
  }, [language]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  // Keyboard shortcut listener (ESC to cancel, Enter to confirm)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCancel, handleConfirm]);

  const variant = options.variant || 'danger';
  const iconType = options.icon || (variant === 'danger' ? 'trash' : 'alert');

  const defaultConfirmText = variant === 'danger'
    ? (language === 'ar' ? 'نعم، حذف نهائي' : language === 'fr' ? 'Supprimer définitivement' : 'Yes, Delete')
    : (language === 'ar' ? 'تأكيد' : language === 'fr' ? 'Confirmer' : 'Confirm');

  const defaultCancelText = language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel';

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      <ModalPortal isOpen={isOpen}>
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          onClick={handleCancel}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-slate-950/30 dark:shadow-black/70"
              >
                {/* Decorative Top Accent Glow */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    variant === 'danger'
                      ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600'
                      : variant === 'warning'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                      : 'bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500'
                  }`}
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon Container */}
                <div className="flex justify-center mb-4 pt-1">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner ${
                      variant === 'danger'
                        ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 ring-4 ring-rose-500/10'
                        : variant === 'warning'
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 ring-4 ring-amber-500/10'
                        : 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/25 ring-4 ring-sky-500/10'
                    }`}
                  >
                    {iconType === 'trash' && <Trash2 className="w-6 h-6 animate-pulse" />}
                    {iconType === 'alert' && <AlertTriangle className="w-6 h-6" />}
                    {iconType === 'logout' && <LogOut className="w-6 h-6 rtl:rotate-180" />}
                    {iconType === 'refresh' && <RotateCcw className="w-6 h-6" />}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 text-center tracking-tight">
                  {options.title || (language === 'ar' ? 'تأكيد الإجراء' : 'Confirm Action')}
                </h3>

                {/* Item Badge if provided */}
                {options.itemName && (
                  <div className="flex justify-center mt-3">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 max-w-full truncate shadow-2xs">
                      {options.itemName}
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                  {options.message}
                </p>

                {/* Warning note for danger */}
                {variant === 'danger' && (
                  <p className="mt-2 text-xs text-rose-500 dark:text-rose-400 text-center font-medium">
                    {language === 'ar'
                      ? '⚠️ تنبيه: لا يمكن التراجع عن هذا الإجراء وسيتم الحذف من النظام فوراً.'
                      : language === 'fr'
                      ? '⚠️ Attention : cette action est irréversible.'
                      : '⚠️ Warning: This action cannot be undone and will permanently remove this record.'}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {options.cancelText || defaultCancelText}
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    autoFocus
                    className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                      variant === 'danger'
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-600/30 hover:shadow-rose-600/40'
                        : variant === 'warning'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                        : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 shadow-sky-600/30'
                    }`}
                  >
                    {options.confirmText || defaultConfirmText}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ModalPortal>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
}
