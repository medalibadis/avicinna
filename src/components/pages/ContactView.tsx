'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { trackLeadConversion } from '@/components/analytics/TrackingScripts';
import type { InquiryAttachment } from '@/types/cms';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Paperclip,
  X,
  Loader2,
} from 'lucide-react';

export function ContactView() {
  const { language } = useLanguage();
  const { addInquiry, treatments: treatmentsData, sections, settings } = useData();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+213 ',
    email: '',
    country: '',
    specialty: treatmentsData[0]?.slug || '',
    notes: '',
  });

  const [attachments, setAttachments] = useState<InquiryAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const phoneClean =
    (settings?.contact?.whatsapp || sections?.finalCta?.phone || '+90 544 282 27 69').replace(
      /[^0-9]/g,
      ''
    ) || '905442822769';

  const content = {
    ar: {
      badge: 'فريق التنسيق الطبي الدولي AVICINNA',
      title: 'تواصل معنا واستشر نخبة أطباء تركيا مجاناً',
      subtitle:
        'فريقنا الطبي واللغوي متاح على مدار الساعة للإجابة عن استفساراتكم، مراجعة تقاريركم، وتجهيز خطة علاجية وعرض سعر شامل خلال 24 ساعة.',
      formHeading: 'طلب استشارة وتقييم طبي مجاني',
      formLead: 'يرجى تعبئة النموذج أدناه بدقة وسيتواصل معكم طبيب أو منسق معتمد فوراً.',
      nameLabel: 'الاسم الكامل *',
      phoneLabel: 'رقم الهاتف / واتساب مع رمز الدولة *',
      emailLabel: 'البريد الإلكتروني',
      countryLabel: 'بلد الإقامة *',
      specialtyLabel: 'التخصص الطبي المطلوب *',
      notesLabel: 'وصف الحالة المرضية أو تفاصيل الاستفسار',
      notesPlaceholder: 'اذكر الأعراض، التشخيص الحالي، أو أي أسئلة تود طرحها على الطبيب الاستشاري...',
      fileLabel: 'إرفاق تقارير طبية أو صور أشعة (PDF / صور - اختياري)',
      fileHint: 'انقر لاختيار ملفات (بحد أقصى 10 ميجابايت لكل ملف)',
      submitBtn: 'إرسال طلب الاستشارة المجانية',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم استلام طلبكم بنجاح!',
      successMsg:
        'شكراً لثقتكم بمنصة AVICINNA. تم تسجيل طلبكم وتوجيه إشعار فوري لفريق التنسيق الطبي للتواصل معكم خلال أقل من 24 ساعة.',
      resetBtn: 'إرسال استفسار آخر',
      contactInfoHeading: 'معلومات التواصل المباشر',
      officeAddress: 'شيشلي - ليفنت، إسطنبول، الجمهورية التركية',
      hours: 'قسم الطوارئ والمرضى الدوليين: 24/7 على مدار الساعة',
      whatsappCardTitle: 'تواصل فوري عبر واتساب',
      whatsappCardDesc: 'تحدث مباشرة مع مستشار طبي واحصل على إجابة سريعة لاستفساراتك وإرسال التقارير الطبية فوراً.',
      faqHeading: 'الأسئلة الشائعة حول حجز العلاج في تركيا',
      faqs: [
        {
          q: 'كيف يتم الحصول على خطة العلاج وعرض السعر؟',
          a: 'بمجرد إرسال تقاريركم وصور الأشعة، يقوم فريقنا بعرضها على البروفيسور المتخصص لتحديد الإجراء المناسب ومدة الإقامة المتوقعة مع عرض سعر رسمي شامل.',
        },
        {
          q: 'هل يتوفر مترجم طبي يرافقني طوال فترة العلاج؟',
          a: 'نعم بالتأكيد، يتم توفير مترجم طبي معتمد يتحدث لغتكم بطلاقة يرافقكم في كافة المواعيد الطبية دون أي تكلفة إضافية.',
        },
        {
          q: 'كيف يتم الاستقبال في مطار إسطنبول؟',
          a: 'ينتظركم سائقنا الخاص في المطار بلافتة تحمل اسمكم بسيارة VIP لنقلكم مباشرة إلى الفندق أو المستشفى.',
        },
        {
          q: 'هل هناك أي رسوم مسبقة للاستشارة الأولى؟',
          a: 'لا، الاستشارة الأولى ودراسة التقارير الطبية مجانية تماماً بنسبة 100% ودون أي التزام مالي.',
        },
      ],
    },
    en: {
      badge: 'AVICINNA International Coordination Team',
      title: 'Connect With Istanbul’s Top Specialists for Free',
      subtitle:
        'Our dedicated clinical coordinators and language specialists are available 24/7 to review your medical reports and deliver a personalized treatment plan within 24 hours.',
      formHeading: 'Request Free Medical Assessment',
      formLead: 'Please fill out the form below. A licensed coordinator will review your case immediately.',
      nameLabel: 'Full Name *',
      phoneLabel: 'Phone / WhatsApp with Country Code *',
      emailLabel: 'Email Address',
      countryLabel: 'Country of Residence *',
      specialtyLabel: 'Requested Medical Specialty *',
      notesLabel: 'Condition Summary / Medical Questions',
      notesPlaceholder: 'Briefly describe current symptoms, prior diagnoses, or specific questions...',
      fileLabel: 'Attach Medical Reports / Scans (PDF / Images - Optional)',
      fileHint: 'Click to upload medical files (max 10 MB per file)',
      submitBtn: 'Submit Free Assessment Request',
      submitting: 'Submitting...',
      successTitle: 'Your Request Has Been Received!',
      successMsg:
        'Thank you for reaching out to AVICINNA. Your inquiry has been logged and an instant alert was dispatched to our clinical intake team.',
      resetBtn: 'Submit Another Inquiry',
      contactInfoHeading: 'Direct Contact Information',
      officeAddress: 'Sisli / Levent Financial District, Istanbul, Turkey',
      hours: 'International Patient Emergency Desk: 24/7 Round-the-clock',
      whatsappCardTitle: 'Direct WhatsApp Chat',
      whatsappCardDesc: 'Chat directly with a medical coordinator to share reports and receive specialist guidance.',
      faqHeading: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'How do I obtain a treatment plan and price quote?',
          a: 'Upon submitting your diagnostics and scans, our specialist board evaluates your case and issues an all-inclusive proposal within 24 hours.',
        },
        {
          q: 'Is a dedicated medical translator provided?',
          a: 'Yes, a licensed medical interpreter fluent in your language attends every consultation at zero extra cost.',
        },
        {
          q: 'How does airport reception work in Istanbul?',
          a: 'Our private chauffeur greets you at Istanbul Airport with a personalized name sign and VIP vehicle.',
        },
        {
          q: 'Is the preliminary second opinion really free?',
          a: 'Yes, 100% complimentary with zero financial obligation.',
        },
      ],
    },
    fr: {
      badge: 'Équipe de Coordination Internationale AVICINNA',
      title: 'Consultez Gratuitement les Meilleurs Spécialistes d’Istanbul',
      subtitle:
        'Notre équipe médicale et linguistique est à votre écoute 24h/24 pour analyser vos bilans et vous proposer un plan de soins personnalisé sous 24h.',
      formHeading: 'Demande d’Évaluation Médicale Gratuite',
      formLead: 'Veuillez remplir le formulaire ci-dessous pour une étude immédiate par un médecin coordinateur.',
      nameLabel: 'Nom Complet *',
      phoneLabel: 'Téléphone / WhatsApp avec Indicatif *',
      emailLabel: 'Adresse E-mail',
      countryLabel: 'Pays de Résidence *',
      specialtyLabel: 'Spécialité Médicale Recherchée *',
      notesLabel: 'Description des Symptômes / Antécédents',
      notesPlaceholder: 'Détaillez votre diagnostic actuel ou vos questions pour le chirurgien...',
      fileLabel: 'Joindre des Comptes-Rendus Médicaux (PDF / Images - Optionnel)',
      fileHint: 'Cliquez pour sélectionner vos fichiers médicaux (max 10 Mo par fichier)',
      submitBtn: 'Envoyer ma Demande Gratuite',
      submitting: 'Envoi en cours...',
      successTitle: 'Demande Reçue avec Succès !',
      successMsg:
        'Merci pour votre confiance. Votre dossier a été transmis instantanément à notre équipe médicale francophone qui vous contactera sous 24h.',
      resetBtn: 'Nouvelle demande',
      contactInfoHeading: 'Coordonnées Directes',
      officeAddress: 'Sisli / Levent, Istanbul, République de Turquie',
      hours: 'Assistance Internationale : 24h/24 et 7j/7',
      whatsappCardTitle: 'Échange Immédiat par WhatsApp',
      whatsappCardDesc: 'Transmettez directement vos comptes-rendus et IRM à notre équipe pour un avis rapide.',
      faqHeading: 'Foire Aux Questions',
      faqs: [
        {
          q: 'Comment obtenir un devis et protocole de soins ?',
          a: 'Après transmission de vos examens, nos professeurs étudient votre dossier pour établir un devis tout compris sous 24h.',
        },
        {
          q: 'Un interprète francophone est-il présent ?',
          a: 'Oui, un interprète médical dédié vous accompagne lors de chaque rendez-vous sans supplément.',
        },
        {
          q: 'Comment s’organise l’accueil à l’aéroport ?',
          a: 'Un chauffeur privé vous accueille dès votre atterrissage à Istanbul en véhicule VIP.',
        },
        {
          q: 'L’étude du dossier est-elle gratuite ?',
          a: 'Oui, le premier avis médical et l’établissement du devis sont 100% gratuits et sans engagement.',
        },
      ],
    },
  }[language];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError('');
    setIsUploading(true);
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
      setUploadError('Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;
    setSubmitError('');
    setIsSubmitting(true);
    const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      const id = await addInquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        specialty: formData.specialty,
        notes: formData.notes,
        language,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        attachments,
      });
      setTrackingId(id);
      trackLeadConversion({ eventId, specialty: formData.specialty, language });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 dark:bg-[#080E1A] min-h-screen">
      <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">{content.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 dark:border-slate-800">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{content.successTitle}</h3>
                  {trackingId && (
                    <div className="inline-block px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold">
                      {trackingId}
                    </div>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                    {content.successMsg}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '+213 ',
                          email: '',
                          country: '',
                          specialty: treatmentsData[0]?.slug || '',
                          notes: '',
                        });
                        setAttachments([]);
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-2.5 rounded-full text-sm transition-colors cursor-pointer"
                    >
                      {content.resetBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{content.formHeading}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">{content.formLead}</p>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={language === 'ar' ? 'محمد الأحمد' : language === 'fr' ? 'Amine Benali' : 'John Smith'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+213 5XX XX XX XX"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="patient@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {content.countryLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder={language === 'ar' ? 'الجزائر، تونس، المغرب...' : language === 'fr' ? 'Algérie, Tunisie, Maroc, France...' : 'Algeria, UK, Canada...'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {content.specialtyLabel}
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {treatmentsData.map((tItem) => (
                        <option key={tItem.slug} value={tItem.slug} className="dark:bg-slate-900">
                          {tItem.title[language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {content.notesLabel}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={content.notesPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Medical File Attachments */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{content.fileLabel}</span>
                      {isUploading && <Loader2 className="w-4 h-4 animate-spin text-sky-500" />}
                    </label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-500 rounded-xl p-3.5 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                      <Paperclip className="w-4 h-4 text-sky-500" />
                      <span>{content.fileHint}</span>
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
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((att) => (
                          <span
                            key={att.id}
                            className="inline-flex items-center gap-1.5 text-xs bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-lg border border-sky-200"
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

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{content.submitting}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{content.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{content.whatsappCardTitle}</h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed">{content.whatsappCardDesc}</p>
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent('Hello AVICINNA Medical Desk')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="contact-page-card"
                  className="inline-flex items-center justify-center w-full gap-2 bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-slate-100 shadow transition-colors text-sm"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-mono font-bold tracking-wider">+{phoneClean}</span>
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                {content.contactInfoHeading}
              </h3>
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Istanbul HQ</div>
                  <div>{content.officeAddress}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Clock className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>{content.hours}</div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>{settings?.contact?.email || 'contact@avicinna-health.com'}</div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar'
                    ? 'بيانات وتقارير المرضى مشفرة وفق معايير HIPAA وGDPR.'
                    : language === 'fr'
                    ? 'Données chiffrées selon les normes HIPAA & RGPD.'
                    : 'Protected in accordance with HIPAA & GDPR standards.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{content.faqHeading}</h2>
          </div>

          <div className="space-y-3">
            {content.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-start flex items-center justify-between gap-4 font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600 text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-sky-500' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

