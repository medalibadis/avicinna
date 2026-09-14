'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { MessageCircle, Send, CheckCircle2, ShieldCheck, Upload, PhoneCall } from 'lucide-react';

export const ConsultationSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { addInquiry, treatments: treatmentsData, sections } = useData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [caseNotes, setCaseNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const whatsappPhone = (sections.finalCta.phone || '+90 500 000 00 00').replace(/[\s\-\+\(\)]/g, '');
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

    try {
      await addInquiry({
        fullName,
        phone,
        country,
        specialty: specialty || 'general',
        notes: caseNotes ? `${caseNotes} (مرفق: ${fileName || 'بدون'})` : '',
      });
    } catch (err) {
      console.error('Storage error:', err);
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
              {language === 'ar' ? 'استشارة طبية مجانية 100%' : '100% Free Medical Assessment'}
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
                    : 'Case review by Turkey’s leading certified professors'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'خطة علاجية واضحة ومفصلة مع التكلفة التقديرية'
                    : 'Clear treatment proposal with transparent pricing'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'سرية تامة لجميع البيانات والتقارير الطبية'
                    : 'Strict medical data confidentiality'}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-3">
                {language === 'ar' ? 'أو تفضل التحدث مباشرة مع منسق طبي؟' : 'Or prefer to chat directly with a coordinator?'}
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
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {t.cta.successTitle}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {t.cta.successMessage}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 underline"
                    >
                      {language === 'ar' ? 'إرسال طلب استشارة آخر' : 'Submit another inquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-[#032654]">
                      {t.cta.formTitle}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      {language === 'ar' ? 'البيانات آمنة ومحمية بسرية تامة' : 'Your medical data is encrypted and confidential'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                        {t.cta.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: محمد العمري' : 'e.g., John Smith'}
                        className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0097FB] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                        {t.cta.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        dir="ltr"
                        className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0097FB] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                        {t.cta.country} *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={language === 'ar' ? 'السعودية، الكويت، الجزائر...' : 'Country of residence'}
                        className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0097FB] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Specialty Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                        {t.cta.specialty} *
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                        className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0097FB] focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">{language === 'ar' ? 'اختر التخصص المطلوب...' : 'Select specialty...'}</option>
                        {treatmentsData.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.title[language]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Case Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                      {t.cta.caseNotes}
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes}
                      onChange={(e) => setCaseNotes(e.target.value)}
                      placeholder={language === 'ar' ? 'يرجى كتابة التشخيص السابق أو الأعراض التي تشكو منها...' : 'Describe symptoms or medical history...'}
                      className="w-full bg-[#F4F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0097FB] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Optional File Upload Placeholder */}
                  <div>
                    <label className="block text-xs font-bold text-[#163B63] mb-1.5">
                      {t.cta.uploadReport}
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0097FB] rounded-xl p-3 text-center bg-[#F4F7FA] hover:bg-[#EAF6FF]/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex items-center justify-center gap-2 text-xs text-[#64748B] font-medium">
                        <Upload className="w-4 h-4 text-[#0097FB]" />
                        <span>
                          {fileName || (language === 'ar' ? 'انقر لاختيار تقرير طبي (PDF أو صورة)' : 'Click to attach medical report (PDF / Image)')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0097FB]/25 transition-all duration-200 cursor-pointer text-sm"
                    >
                      {isLoading ? (
                        <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t.cta.submit}</span>
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
