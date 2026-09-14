'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const { language, t } = useLanguage();
  const { addInquiry, treatments: treatmentsData } = useData();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    specialty: treatmentsData[0]?.slug || '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
      submitBtn: 'إرسال طلب الاستشارة المجانية',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم استلام طلبكم بنجاح!',
      successMsg:
        'شكراً لثقتكم بمنصة AVICINNA. قام نظامنا بتسجيل طلبكم وسيتواصل معكم أحد أطبائنا أو منسقينا المعتمدين عبر واتساب أو الهاتف خلال أقل من 24 ساعة.',
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
          a: 'بمجرد إرسال تقاريركم وصور الأشعة، يقوم فريقنا بعرضها على البروفيسور المتخصص لتحديد الإجراء المناسب ومدة الإقامة المتوقعة، ثم نرسل لكم تقريراً مفصلاً مع عرض سعر رسمي شامل الفندق والمواصلات.',
        },
        {
          q: 'هل يتوفر مترجم طبي يرافقني طوال فترة العلاج؟',
          a: 'نعم بالتأكيد، يتم توفير مترجم طبي معتمد يتحدث لغتكم بطلاقة يرافقكم في كافة المواعيد الطبية وجلسات الفحص والاستشارات الجراحية دون أي تكلفة إضافية.',
        },
        {
          q: 'كيف يتم الاستقبال في مطار إسطنبول؟',
          a: 'ينتظركم سائقنا الخاص في المطار بلافتة تحمل اسمكم بسيارة VIP مكيفة لنقلكم مباشرة إلى فندقكم الفاخر أو المستشفى حسب جدول المواعيد المسبق.',
        },
        {
          q: 'هل هناك أي رسوم مسبقة للاستشارة الأولى؟',
          a: 'لا، الاستشارة الأولى ودراسة التقارير الطبية مجانية تماماً بنسبة 100% ودون أي التزام مالي من طرفكم.',
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
      notesPlaceholder: 'Briefly describe current symptoms, prior diagnoses, or specific questions for the specialist...',
      submitBtn: 'Submit Free Assessment Request',
      submitting: 'Submitting...',
      successTitle: 'Your Request Has Been Received!',
      successMsg:
        'Thank you for reaching out to AVICINNA. Your inquiry is registered with our clinical intake desk, and our medical coordinator will contact you via WhatsApp or phone within 24 hours.',
      resetBtn: 'Submit Another Inquiry',
      contactInfoHeading: 'Direct Contact Information',
      officeAddress: 'Sisli / Levent Financial District, Istanbul, Turkey',
      hours: 'International Patient Emergency Desk: 24/7 Round-the-clock',
      whatsappCardTitle: 'Direct WhatsApp Chat',
      whatsappCardDesc: 'Chat directly with a medical coordinator to transmit imaging scans and pathology reports instantly.',
      faqHeading: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'How do I obtain a treatment plan and price quote?',
          a: 'Upon submitting your diagnostics and scans, our specialist physician board evaluates the case to determine the optimal procedure and estimated hospital stay, issuing a comprehensive all-inclusive proposal.',
        },
        {
          q: 'Is a dedicated medical translator provided?',
          a: 'Yes, a licensed medical interpreter fluent in your language attends every consultation, clinical exam, and discharge meeting at zero extra cost.',
        },
        {
          q: 'How does airport reception work in Istanbul?',
          a: 'Our private chauffeur greets you at Istanbul Airport with a personalized name sign and transports you in a VIP vehicle directly to your 5-star hotel or clinic.',
        },
        {
          q: 'Is the preliminary second opinion really free?',
          a: 'Yes, 100% free with zero financial obligation. You receive an authentic clinical evaluation from Turkish board-certified professors at no charge.',
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
      submitBtn: 'Envoyer ma Demande Gratuite',
      submitting: 'Envoi en cours...',
      successTitle: 'Demande Reçue avec Succès !',
      successMsg:
        'Merci pour votre confiance. Votre dossier est entre les mains de notre équipe médicale. Un coordinateur francophone vous contactera par WhatsApp sous 24 heures.',
      resetBtn: 'Nouvelle demande',
      contactInfoHeading: 'Coordonnées Directes',
      officeAddress: 'Sisli / Levent, Istanbul, République de Turquie',
      hours: 'Assistance Internationale : 24h/24 et 7j/7',
      whatsappCardTitle: 'Échange Immédiat par WhatsApp',
      whatsappCardDesc: 'Transmettez directement vos comptes-rendus et IRM à notre équipe pour un avis chirurgical rapide.',
      faqHeading: 'Foire Aux Questions',
      faqs: [
        {
          q: 'Comment obtenir un devis et protocole de soins ?',
          a: 'Après transmission de vos examens, nos professeurs étudient votre dossier pour définir la technique adaptée et établir un devis clair tout compris.',
        },
        {
          q: 'Un interprète francophone est-il présent ?',
          a: 'Oui, un interprète médical dédié vous accompagne lors de chaque rendez-vous médical et visite postopératoire sans supplément.',
        },
        {
          q: 'Comment s’organise l’accueil à l’aéroport ?',
          a: 'Un chauffeur privé vous accueille dès votre atterrissage à Istanbul avec une pancarte personnalisée en véhicule VIP.',
        },
        {
          q: 'L’étude du dossier est-elle gratuite ?',
          a: 'Oui, le premier avis médical et l’établissement du devis sont 100% gratuits et sans aucun engagement.',
        },
      ],
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    setIsSubmitting(true);
    try {
      await addInquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        specialty: formData.specialty,
        notes: formData.notes,
      });
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Header Banner */}
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
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100">
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{content.successTitle}</h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                    {content.successMsg}
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          country: '',
                          specialty: treatmentsData[0]?.slug || '',
                          notes: '',
                        });
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                    >
                      {content.resetBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{content.formHeading}</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">{content.formLead}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {content.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="محمد الأحمد / John Smith"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {content.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {content.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="patient@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {content.countryLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="السعودية / France / Kuwait"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {content.specialtyLabel}
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-white"
                    >
                      {treatmentsData.map((tItem) => (
                        <option key={tItem.slug} value={tItem.slug}>
                          {tItem.title[language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Medical Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {content.notesLabel}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={content.notesPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

          {/* Sidebar Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct WhatsApp Box */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{content.whatsappCardTitle}</h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                  {content.whatsappCardDesc}
                </p>
                <a
                  href="https://wa.me/905000000000?text=Hello%20AVICINNA%20Medical%20Desk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-slate-100 shadow transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>+90 500 000 00 00</span>
                </a>
              </div>
            </div>

            {/* Direct Headquarters Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                {content.contactInfoHeading}
              </h3>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">المقر الرئيسي / Headquarters</div>
                  <div>{content.officeAddress}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Clock className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">ساعات العمل / Service Hours</div>
                  <div>{content.hours}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Mail className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">البريد الإلكتروني / Email</div>
                  <div>care@avicinna.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">سرية وأمان البيانات الطبية</div>
                  <div className="text-xs text-slate-500">مشفرة بالكامل طبقاً لمعايير HIPAA وGDPR الدولية.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>إجابات فورية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.faqHeading}
          </h2>
        </div>

        <div className="space-y-3">
          {content.faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-sky-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
