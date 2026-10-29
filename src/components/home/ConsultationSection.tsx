'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { MessageCircle, Send, CheckCircle2, ShieldCheck, PhoneCall, ArrowLeft, ArrowRight } from 'lucide-react';

export const ConsultationSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { addInquiry, treatments: treatmentsData, sections } = useData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [caseNotes, setCaseNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState('');

  const whatsappPhone = (sections.finalCta.phone || '+90 544 282 27 69').replace(/[\s\-\+\(\)]/g, '') || '905442822769';
  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: 'Bonjour, je souhaite obtenir une consultation médicale gratuite avec l\'équipe AVICINNA concernant des soins en Turquie.',
  };
  const whatsappMsg = encodeURIComponent(defaultMsg[language] || defaultMsg.en);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const matchedTreatment = treatmentsData.find((t) => t.slug === specialty);
    const specialtyTitle = matchedTreatment
      ? matchedTreatment.title[language]
      : (specialty || (language === 'ar' ? 'استشارة طبية عامة' : 'General Consultation'));

    try {
      await addInquiry({
        fullName,
        phone,
        country,
        specialty: specialty || 'general',
        notes: caseNotes ? `${caseNotes} (تحويل مباشر إلى واتساب)` : '(تحويل مباشر إلى واتساب)',
      });
    } catch (err) {
      console.error('Storage error:', err);
    }

    // Build personalized WhatsApp message with all patient case details
    let directMsg = '';
    if (language === 'ar') {
      directMsg = `*طلب استشارة طبية مجانية - منصة AVICINNA*\n\n` +
        `• *الاسم الكامل:* ${fullName}\n` +
        `• *رقم الهاتف:* ${phone}\n` +
        `• *دولة الإقامة:* ${country}\n` +
        `• *التخصص المطلوب:* ${specialtyTitle}\n` +
        (caseNotes ? `• *وصف الحالة / الأعراض:* ${caseNotes}\n\n` : '\n') +
        `أود إرسال التقارير الطبية ومتابعة الاستشارة معكم مباشرة عبر واتساب.`;
    } else if (language === 'fr') {
      directMsg = `*Demande de Consultation Médicale Gratuite - AVICINNA*\n\n` +
        `• *Nom complet:* ${fullName}\n` +
        `• *Téléphone:* ${phone}\n` +
        `• *Pays de résidence:* ${country}\n` +
        `• *Spécialité:* ${specialtyTitle}\n` +
        (caseNotes ? `• *Description du cas:* ${caseNotes}\n\n` : '\n') +
        `Je souhaite transmettre mes comptes-rendus médicaux et obtenir un avis directement sur WhatsApp.`;
    } else {
      directMsg = `*Free Medical Consultation Request - AVICINNA*\n\n` +
        `• *Full Name:* ${fullName}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Country:* ${country}\n` +
        `• *Specialty:* ${specialtyTitle}\n` +
        (caseNotes ? `• *Case Summary:* ${caseNotes}\n\n` : '\n') +
        `I would like to share my medical reports and consult with the specialist team directly via WhatsApp.`;
    }

    const waDirectUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(directMsg)}`;
    setSubmittedWhatsappUrl(waDirectUrl);

    // Direct user straight to WhatsApp
    if (typeof window !== 'undefined') {
      window.open(waDirectUrl, '_blank');
    }

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <section id="consultation" className="py-20 bg-[#032654] text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Value Proposition (5 cols) */}
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

            <p className="text-base text-slate-200/90 leading-relaxed">
              {t.cta.subtitle}
            </p>

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
                    ? 'خطة علاجية واضحة ومفصلة مع التكلفة التقديرية'
                    : language === 'fr'
                    ? 'Plan de traitement clair et détaillé avec devis transparent'
                    : 'Clear treatment proposal with transparent pricing'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'سرية تامة لجميع البيانات والتقارير الطبية'
                    : language === 'fr'
                    ? 'Confidentialité médicale absolue de vos données'
                    : 'Strict medical data confidentiality'}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-3">
                {language === 'ar'
                  ? 'أو تفضل التحدث مباشرة مع منسق طبي؟'
                  : language === 'fr'
                  ? 'Ou préférez-vous échanger directement avec un coordinateur ?'
                  : 'Or prefer to chat directly with a coordinator?'}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.cta.whatsappBtn}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-10 shadow-2xl border border-white/20 dark:border-slate-800">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t.cta.successTitle}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {language === 'ar'
                      ? 'تم تسجيل طلبك بنجاح وفتح محادثة واتساب للتواصل مع الفريق الطبي ومشاركة تقاريرك وصورك الطبية مباشرة.'
                      : language === 'fr'
                      ? 'Votre demande a été enregistrée avec succès et une discussion WhatsApp s’ouvre pour échanger directement avec notre équipe médicale.'
                      : 'Your inquiry has been recorded and a WhatsApp chat opened so you can share your medical reports and scans directly with our team.'}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={submittedWhatsappUrl || whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        setPhone('');
                        setCountry('');
                        setSpecialty('');
                        setCaseNotes('');
                      }}
                      className="w-full sm:w-auto text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-full transition-colors cursor-pointer"
                    >
                      {language === 'ar'
                        ? 'طلب استشارة لحالة أخرى'
                        : language === 'fr'
                        ? 'Autre demande de consultation'
                        : 'Submit another inquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-[#032654] dark:text-white">
                      {t.cta.formTitle}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                      {language === 'ar'
                        ? 'البيانات آمنة ومحمية بسرية تامة'
                        : language === 'fr'
                        ? 'Données médicales strictement confidentielles et protégées'
                        : 'Your medical data is encrypted and confidential'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: محمد العمري' : language === 'fr' ? 'ex. Jean Dupont' : 'e.g., John Smith'}
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        dir="ltr"
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.country} *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={language === 'ar' ? 'السعودية، الكويت، الجزائر...' : language === 'fr' ? 'France, Algérie, Suisse...' : 'Country of residence'}
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                      />
                    </div>

                    {/* Specialty Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                        {t.cta.specialty} *
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                        className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <option value="" className="dark:bg-slate-900">{language === 'ar' ? 'اختر التخصص المطلوب...' : language === 'fr' ? 'Sélectionnez une spécialité...' : 'Select specialty...'}</option>
                        {treatmentsData.map((item) => (
                          <option key={item.slug} value={item.slug} className="dark:bg-slate-900">
                            {item.title[language] || item.title.en || item.title.ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Case Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#163B63] dark:text-slate-200 mb-1.5">
                      {t.cta.caseNotes}
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes}
                      onChange={(e) => setCaseNotes(e.target.value)}
                      placeholder={language === 'ar' ? 'يرجى كتابة التشخيص السابق أو الأعراض التي تشكو منها...' : language === 'fr' ? 'Décrivez vos symptômes ou votre diagnostic médical...' : 'Describe symptoms or medical history...'}
                      className="w-full bg-[#F4F7FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-[#0097FB] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    />
                  </div>

                  {/* Direct WhatsApp Report Notice (No PDF Upload) */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-xs font-semibold">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="leading-relaxed">
                      {language === 'ar'
                        ? 'إرسال التقارير الطبية وفحوصات الأشعة يتم مباشرة عبر محادثة واتساب لسرعة التقييم الطبي الفوري مع الطبيب الاستشاري.'
                        : language === 'fr'
                        ? 'L’envoi des comptes-rendus médicaux et imageries se fait directement sur WhatsApp pour une évaluation rapide par le spécialiste.'
                        : 'Medical reports and diagnostic scans are shared directly via WhatsApp for rapid specialist assessment.'}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <span>{language === 'ar' ? 'جاري التحويل إلى واتساب...' : language === 'fr' ? 'Redirection vers WhatsApp...' : 'Redirecting to WhatsApp...'}</span>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 fill-current" />
                          <span>
                            {language === 'ar'
                              ? 'إرسال والاستشارة الفورية عبر واتساب'
                              : language === 'fr'
                              ? 'Envoyer & Consulter sur WhatsApp'
                              : 'Submit & Consult on WhatsApp'}
                          </span>
                        </>
                      )}
                    </button>
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

