/**
 * AVICINNA Healthcare Platform - Internationalization Fallback Guard
 * Ensures strict zero-string leakage of Arabic into French/English layouts.
 */

export type Locale = 'ar' | 'fr' | 'en';

export interface LocalizedString {
  ar?: string;
  fr?: string;
  en?: string;
}

/**
 * Resolves a localized field strictly for the target locale.
 * If the target language is missing, it falls back to English (for French/English views)
 * rather than raw Arabic, and falls back to a clean localized placeholder if empty.
 */
export function getLocalizedField(
  source: any,
  fieldPath: string,
  locale: Locale,
  fallbackText?: string
): string {
  if (!source) return fallbackText || '';

  // 1. Direct object localized property: source[fieldPath] = { ar: '...', fr: '...', en: '...' }
  const targetObj = fieldPath ? source[fieldPath] : source;
  if (targetObj && typeof targetObj === 'object') {
    if (targetObj[locale] && typeof targetObj[locale] === 'string' && targetObj[locale].trim().length > 0) {
      return targetObj[locale].trim();
    }

    // In FR mode, prefer EN over AR if FR is missing
    if (locale === 'fr') {
      if (targetObj.en && typeof targetObj.en === 'string' && targetObj.en.trim().length > 0) {
        return targetObj.en.trim();
      }
    }

    // In EN mode, prefer FR over AR if EN is missing
    if (locale === 'en') {
      if (targetObj.fr && typeof targetObj.fr === 'string' && targetObj.fr.trim().length > 0) {
        return targetObj.fr.trim();
      }
    }

    // In AR mode, take AR
    if (locale === 'ar') {
      if (targetObj.ar && typeof targetObj.ar === 'string' && targetObj.ar.trim().length > 0) {
        return targetObj.ar.trim();
      }
    }
  }

  // 2. Flat suffixed property: source[`${fieldPath}_${locale}`]
  const suffixedKey = `${fieldPath}_${locale}`;
  if (source[suffixedKey] && typeof source[suffixedKey] === 'string' && source[suffixedKey].trim().length > 0) {
    return source[suffixedKey].trim();
  }

  // 3. Fallback text or generic clean placeholder
  if (fallbackText) return fallbackText;

  if (locale === 'fr') return 'Non spécifié';
  if (locale === 'en') return 'Not specified';
  return 'غير محدد';
}

/**
 * Returns clean localized status badge for consultation leads & articles
 */
export function getLocalizedStatus(
  status: string,
  locale: Locale
): { label: string; color: string } {
  const map: Record<string, Record<Locale, string>> = {
    new: { ar: 'جديد', en: 'New', fr: 'Nouveau' },
    in_review: { ar: 'قيد المراجعة', en: 'In Review', fr: 'En examen' },
    contacted: { ar: 'تم التواصل', en: 'Contacted', fr: 'Contacté' },
    scheduled: { ar: 'تم الحجز', en: 'Scheduled', fr: 'Rendez-vous' },
    completed: { ar: 'مكتمل', en: 'Completed', fr: 'Complété' },
    published: { ar: 'منشور', en: 'Published', fr: 'Publié' },
    draft: { ar: 'مسودة', en: 'Draft', fr: 'Brouillon' },
  };

  const colors: Record<string, string> = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    in_review: 'bg-amber-50 text-amber-700 border-amber-200',
    contacted: 'bg-sky-50 text-sky-700 border-sky-200',
    scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const key = status?.toLowerCase() || 'new';
  const label = map[key]?.[locale] || map[key]?.en || status;
  const color = colors[key] || 'bg-slate-50 text-slate-700 border-slate-200';

  return { label, color };
}
