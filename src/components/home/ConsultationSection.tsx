'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { trackLeadConversion } from '@/components/analytics/TrackingScripts';
import type { InquiryAttachment } from '@/types/cms';
import {
  MessageCircle,
  Send,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Paperclip,
  X,
  Loader2,
} from 'lucide-react';

export const ConsultationSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { addInquiry, treatments: treatmentsData, sections, settings } = useData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+213 ');
  const [country, setCountry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [caseNotes, setCaseNotes] = useState('');
  const [attachments, setAttachments] = useState<InquiryAttachment[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState('');

  const whatsappPhone =
    (settings?.contact?.whatsapp || sections.finalCta.phone || '+90 544 282 27 69').replace(
      /[\s\-\+\(\)]/g,
      ''
    ) || '905442822769';

  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: "Bonjour, je souhaite obtenir une consultation médicale gratuite avec l'équipe AVICINNA concernant des soins en Turquie.",
  };
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    defaultMsg[language] || defaultMsg.en
  )}`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError('');
    setIsUploadingFile(true);

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.attachment) {
          setUploadError(data.error || 'Upload failed');
        } else {
          setAttachments((prev) => [...prev, data.attachment]);
        }
      }
    } catch {
      setUploadError(
        language === 'ar'
          ? 'تعذر رفع الملف، يرجى المحاولة مجدداً'
          : language === 'fr'
          ? 'Échec du téléchargement du fichier.'
          : 'Failed to upload medical file.'
      );
    } finally {
      setIsUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError('');

    const matchedTreatment = treatmentsData.find((tr) => tr.slug === specialty);
    const specialtyTitle = matchedTreatment
      ? matchedTreatment.title[language]
      : specialty || (language === 'ar' ? 'استشارة طبية عامة' : 'General Consultation');

    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      const assignedTrackingId = await addInquiry({
        fullName,
        phone,
        country,
        specialty: specialty || 'general',
        notes: caseNotes || undefined,
        language,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        attachments,
      });

      setTrackingId(assignedTrackingId);
      trackLeadConversion({ eventId, specialty: specialtyTitle, language });

      const directMsg =
        language === 'ar'
          ? `*طلب استشارة طبية مجانية (${assignedTrackingId}) - AVICINNA*\n• *الاسم:* ${fullName}\n• *الهاتف:* ${phone}\n• *البلد:* ${country}\n• *التخصص:* ${specialtyTitle}${
              caseNotes ? `\n• *التفاصيل:* ${caseNotes}` : ''
            }`
          : language === 'fr'
          ? `*Demande de Consultation (${assignedTrackingId}) - AVICINNA*\n• *Nom :* ${fullName}\n• *Tél :* ${phone}\n• *Pays :* ${country}\n• *Spécialité :* ${specialtyTitle}${
              caseNotes ? `\n• *Détails :* ${caseNotes}` : ''
            }`
          : `*Medical Consultation Request (${assignedTrackingId}) - AVICINNA*\n• *Name:* ${fullName}\n• *Phone:* ${phone}\n• *Country:* ${country}\n• *Specialty:* ${specialtyTitle}${
              caseNotes ? `\n• *Summary:* ${caseNotes}` : ''
            }`;

      setSubmittedWhatsappUrl(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(directMsg)}`);
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : language === 'ar'
          ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.'
          : language === 'fr'
          ? 'Erreur lors de l’envoi, veuillez réessayer.'
          : 'Error submitting request. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="consultation" className="py-20 bg-[#032654] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0097FB]/15 border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              {language === 'ar'
                ? 'استشارة طبية مجانية 100%'
                : language === 'fr'
                ? 'Consultation Médicale 100% Gratuite'
                : '100% Free Medical Assessment'}
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-base text-slate-200/90 leading-relaxed">{t.cta.subtitle}</p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'دراسة ملفك بواسطة كبار الاستشاريين المتخصصين'
                    : language === 'fr'
                    ? 'Étude de votre dossier par les meilleurs spécialistes de Turquie'
                    : 'Case review by Turkey’s leading certified professors'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'خطة علاجية وعرض سعر شامل ومفصل خلال 24 ساعة'
                    : language === 'fr'
                    ? 'Plan de soins et devis complet tout compris sous 24 heures'
                    : 'Detailed treatment plan & all-inclusive quote within 24 hours'}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source="home-consultation-direct"
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.common.whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 text-slate-800 dark:text-slate-100 shadow-2xl border border-white/10">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#032654] dark:text-white">
                      {language === 'ar'
                        ? 'تم استلام طلبكم الطبي بنجاح!'
                        : language === 'fr'
                        ? 'Votre demande a été enregistrée avec succès !'
                        : 'Your Medical Request Has Been Registered!'}
                    </h3>
                    {trackingId && (
                      <div className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
                        {trackingId}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      {language === 'ar'
                        ? 'وصل إشعار فوري إلى منسقينا الطبيين. يمكنك أيضاً فتح محادثة واتساب لمتابعة ملفك مباشرة.'
                        : language === 'fr'
                        ? 'Nos coordinateurs médicaux ont reçu votre dossier instantanément et vous contacteront sous 24h.'
                        : 'Our clinical coordinators received an instant alert and will reach out within 24 hours.'}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={submittedWhatsappUrl || whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-wa-source="home-consultation-after-submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>
                        {language === 'ar'
                          ? 'متابعة المحادثة في واتساب'
                          : language === 'fr'
                          ? 'Continuer sur WhatsApp'
                          : 'Open WhatsApp Chat'}
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFullName('');
                        setPhone('+213 ');
                        setCountry('');
                        setSpecialty('');
                        setCaseNotes('');
                        setAttachments([]);
                      }}
                      className="w-full sm:w-auto text-xs font-bold text-slate-600 dark:text-slate-300 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-full transition-colors cursor-pointer"
                    >
                      {language === 'ar'
                        ? 'طلب استشارة لحالة أخرى'
                        : language === 'fr'
                        ? 'Autre demande'
                        : 'Submit another inquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-[#032654] dark:text-white">{t.cta.formTitle}</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                      {language === 'ar'
                        ? 'البيانات والتقارير الطبية آمنة ومحمية بسرية تامة'
                        : language === 'fr'
                        ? 'Données et examens médicaux strictement confidentiels'
                        : 'Your medical data and files are encrypted and confidential'}
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: محمد الأحمد' : language === 'fr' ? 'ex. Amine Benali' : 'e.g., John Smith'}
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+213 5XX XX XX XX"
                        dir="ltr"
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.country} *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={language === 'ar' ? 'الجزائر، تونس، المغرب، فرنسا...' : language === 'fr' ? 'Algérie, Tunisie, Maroc, France...' : 'Country of residence'}
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.specialty} *
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] cursor-pointer"
                      >
                        <option value="" className="dark:bg-slate-900">
                          {language === 'ar' ? 'اختر التخصص المطلوب...' : language === 'fr' ? 'Sélectionnez une spécialité...' : 'Select specialty...'}
                        </option>
                        {treatmentsData.map((item) => (
                          <option key={item.slug} value={item.slug} className="dark:bg-slate-900">
                            {item.title[language] || item.title.en || item.title.ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                      {t.cta.caseNotes}
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes}
                      onChange={(e) => setCaseNotes(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'يرجى كتابة التشخيص السابق أو الأعراض...'
                          : language === 'fr'
                          ? 'Décrivez vos symptômes ou votre diagnostic...'
                          : 'Describe symptoms or medical history...'
                      }
                      className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB]"
                    />
                  </div>

                  {/* Optional Medical Reports / Scans Upload */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold text-[#163B63] dark:text-slate-200">
                      <span>
                        {language === 'ar'
                          ? 'إرفاق التقارير أو الفحوصات الطبية (PDF / صور - اختياري)'
                          : language === 'fr'
                          ? 'Joindre vos comptes-rendus médicaux (PDF / Images - optionnel)'
                          : 'Attach Medical Reports / Scans (PDF / Images - optional)'}
                      </span>
                      {isUploadingFile && <Loader2 className="w-4 h-4 animate-spin text-[#0097FB]" />}
                    </label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#0097FB] rounded-xl p-3 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 transition-colors">
                      <Paperclip className="w-4 h-4 text-[#0097FB]" />
                      <span>
                        {language === 'ar'
                          ? 'انقر لاختيار ملفات (حتى 10 ميجابايت للملف)'
                          : language === 'fr'
                          ? 'Cliquez pour joindre un fichier (max 10 Mo)'
                          : 'Click to upload medical files (max 10 MB per file)'}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadError && <p className="text-xs text-rose-600 font-semibold">{uploadError}</p>}
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {attachments.map((att) => (
                          <span
                            key={att.id}
                            className="inline-flex items-center gap-1.5 text-xs bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-lg border border-sky-200/70 dark:border-sky-800"
                          >
                            <span className="truncate max-w-[160px]">{att.name}</span>
                            <button
                              type="button"
                              onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                              className="hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isUploadingFile}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#0097FB] hover:bg-[#0082d6] disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>
                        {isLoading
                          ? language === 'ar'
                            ? 'جاري التسجيل والإرسال...'
                            : language === 'fr'
                            ? 'Envoi en cours...'
                            : 'Submitting...'
                          : language === 'ar'
                          ? 'إرسال طلب الاستشارة الطبية المجانية'
                          : language === 'fr'
                          ? 'Envoyer ma demande d’évaluation gratuite'
                          : 'Submit Free Medical Assessment'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {language === 'ar'
                        ? 'محمي ومشفر — سرية طبية تامة'
                        : language === 'fr'
                        ? 'Crypté & Protégé — Secret médical strict'
                        : 'Encrypted & Protected — Strict Medical Confidentiality'}
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
