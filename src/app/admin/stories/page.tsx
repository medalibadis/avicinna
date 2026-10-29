'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { PatientStory, getPatientName } from '@/data/stories';
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Star,
  MapPin,
  Search,
  X,
  Sparkles,
  Globe,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';
import { ModalPortal } from '@/components/admin/ModalPortal';

type Lang = 'ar' | 'en' | 'fr';

const storiesDict = {
  ar: {
    badge: 'قصص وتجارب المرضى الموثقة',
    pageTitle: 'إدارة تجارب المرضى والشفاء',
    pageSubtitle: 'توثيق رحلات العلاج الناجحة، صور وتفاصيل إقامة المرضى في إسطنبول، وتقييماتهم.',
    btnAddStory: 'إضافة قصة مريض جديدة',
    searchPlaceholder: 'ابحث باسم المريض، البلد، أو نوع العلاج الجراحي...',
    btnEdit: 'تعديل',
    btnDelete: 'حذف',
    deleteConfirm: (name: string) => `هل أنت متأكد من رغبتك في حذف قصة المريض: ${name}؟`,
    modalAddTitle: 'إضافة تجربة مريض جديدة',
    modalEditTitle: 'تعديل قصة المريض',
    modalAddSubtitle: 'أدخل تفاصيل رحلة المريض والتقييم لتظهر في قسم تجارب المرضى الدوليين.',
    modalEditSubtitle: 'تحديث بيانات الرحلة العلاجية وتقييم المريض.',
    autoTranslateBtn: 'ترجمة ذكية فورية لجميع اللغات (AR / FR / EN)',
    translating: 'جارٍ ترجمة القصة بالذكاء الاصطناعي...',
    writeInOneTab: 'اكتب القصة في لغتك المفضلة، وسيتولى الذكاء الاصطناعي ترجمتها لباقي اللغات بدقة.',
    fieldName: 'اسم المريض *',
    fieldCountry: 'الدولة والمدينة *',
    fieldTreatment: 'التخصص الطبي والجراحي *',
    fieldDuration: 'مدة الإقامة في إسطنبول',
    fieldDoctor: 'الطبيب المعالج',
    fieldHospital: 'المستشفى الشريك',
    fieldTitle: 'عنوان التجربة الرئيسي',
    fieldShortStory: 'اقتباس أو ملخص القصة',
    fieldFullExperience: 'القصة الكاملة (فقرة في كل سطر)',
    fieldImage: 'صورة المريض أو نتيجة العلاج *',
    fieldRating: 'التقييم (من 5 نجوم)',
    btnSave: 'حفظ واعتماد القصة',
    btnCancel: 'إلغاء',
    toastTranslated: 'تمت ترجمة تجربة المريض بنجاح لجميع اللغات!',
  },
  en: {
    badge: 'Documented Patient Testimonials',
    pageTitle: 'Patient Stories & Recovery Records',
    pageSubtitle: 'Manage verified patient journeys, international stays in Istanbul, and clinical reviews.',
    btnAddStory: 'Add New Patient Story',
    searchPlaceholder: 'Search by patient name, country, or surgical treatment...',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    deleteConfirm: (name: string) => `Are you sure you want to permanently delete story: ${name}?`,
    modalAddTitle: 'Add New Patient Experience',
    modalEditTitle: 'Edit Patient Story',
    modalAddSubtitle: 'Submit patient journey highlights to display in international success stories.',
    modalEditSubtitle: 'Update patient travel details, clinical outcomes, and star rating.',
    autoTranslateBtn: 'Auto-Translate to All Languages (AR / FR / EN)',
    translating: 'Translating patient story with AI...',
    writeInOneTab: 'Write in any language tab; AI accurately translates clinical testimonials across AR, EN, and FR.',
    fieldName: 'Patient Name *',
    fieldCountry: 'Country & City *',
    fieldTreatment: 'Medical & Surgical Treatment *',
    fieldDuration: 'Duration in Istanbul',
    fieldDoctor: 'Attending Physician',
    fieldHospital: 'Partner Hospital',
    fieldTitle: 'Story Main Headline',
    fieldShortStory: 'Patient Quote / Short Excerpt',
    fieldFullExperience: 'Full Experience Narrative (One paragraph per line)',
    fieldImage: 'Patient Photo or Treatment Result *',
    fieldRating: 'Review Rating (out of 5 stars)',
    btnSave: 'Save & Publish Story',
    btnCancel: 'Cancel',
    toastTranslated: 'Patient story translated successfully across all languages!',
  },
  fr: {
    badge: 'Témoignages & Récits Patients',
    pageTitle: 'Gestion des Témoignages Patients',
    pageSubtitle: 'Gérez les parcours de soins réussis, séjours médicaux à Istanbul et avis vérifiés.',
    btnAddStory: 'Ajouter un Témoignage',
    searchPlaceholder: 'Rechercher par patient, pays ou acte chirurgical...',
    btnEdit: 'Modifier',
    btnDelete: 'Supprimer',
    deleteConfirm: (name: string) => `Voulez-vous vraiment supprimer le témoignage de : ${name} ?`,
    modalAddTitle: 'Ajouter un Témoignage Patient',
    modalEditTitle: 'Modifier le Témoignage',
    modalAddSubtitle: 'Renseignez l’histoire du patient pour l’intégrer aux témoignages internationaux.',
    modalEditSubtitle: 'Mettre à jour les détails du séjour médical, les résultats et l’évaluation.',
    autoTranslateBtn: 'Traduire vers toutes les langues (AR / FR / EN)',
    translating: 'Traduction du témoignage par l’IA...',
    writeInOneTab: 'Rédigez dans un onglet, l’IA traduit fidèlement le récit dans les autres langues.',
    fieldName: 'Nom du Patient *',
    fieldCountry: 'Pays & Ville d’origine *',
    fieldTreatment: 'Spécialité & Acte Médical *',
    fieldDuration: 'Durée du séjour à Istanbul',
    fieldDoctor: 'Médecin Praticien',
    fieldHospital: 'Hôpital Partenaire',
    fieldTitle: 'Titre principal du témoignage',
    fieldShortStory: 'Citation / Résumé court',
    fieldFullExperience: 'Récit complet du séjour (un paragraphe par ligne)',
    fieldImage: 'Photo du patient ou résultat *',
    fieldRating: 'Évaluation (sur 5 étoiles)',
    btnSave: 'Enregistrer le Témoignage',
    btnCancel: 'Annuler',
    toastTranslated: 'Témoignage traduit avec succès en AR, FR et EN !',
  },
};

export default function AdminStoriesPage() {
  const { stories, treatments, addStory, updateStory, deleteStory } = useData();
  const { language, direction } = useLanguage();
  const langKey = (language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar') as Lang;
  const t = storiesDict[langKey];

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<PatientStory | null>(null);

  // Write-Once Multi-Language State
  const [editorTab, setEditorTab] = useState<Lang>(langKey);
  const [isTranslating, setIsTranslating] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [treatmentSlug, setTreatmentSlug] = useState('cardiac-surgery');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  );

  const [countries, setCountries] = useState<Record<Lang, string>>({
    ar: 'المملكة العربية السعودية',
    en: 'Saudi Arabia',
    fr: 'Arabie Saoudite',
  });
  const [durations, setDurations] = useState<Record<Lang, string>>({
    ar: '8 أيام في إسطنبول',
    en: '8 days in Istanbul',
    fr: '8 jours à Istanbul',
  });
  const [doctorNames, setDoctorNames] = useState<Record<Lang, string>>({
    ar: 'أ. د. أحمد أوزكارا',
    en: 'Prof. Dr. Ahmet Ozkara',
    fr: 'Pr Dr Ahmet Ozkara',
  });
  const [hospitals, setHospitals] = useState<Record<Lang, string>>({
    ar: 'مستشفى أجيبادم إسطنبول',
    en: 'Acibadem Hospital Istanbul',
    fr: 'Hôpital Acibadem Istanbul',
  });

  const [titles, setTitles] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });
  const [shortStories, setShortStories] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });
  const [fullExperiences, setFullExperiences] = useState<Record<Lang, string>>({ ar: '', en: '', fr: '' });

  const openAddModal = () => {
    setEditingStory(null);
    setEditorTab(langKey);
    setPatientName('');
    setTreatmentSlug('cardiac-surgery');
    setRating(5);
    setImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop');

    setCountries({
      ar: 'المملكة العربية السعودية (الرياض)',
      en: 'Saudi Arabia (Riyadh)',
      fr: 'Arabie Saoudite (Riyad)',
    });
    setDurations({
      ar: '8 أيام في إسطنبول',
      en: '8 days in Istanbul',
      fr: '8 jours à Istanbul',
    });
    setDoctorNames({
      ar: 'أ. د. أحمد أوزكارا',
      en: 'Prof. Dr. Ahmet Ozkara',
      fr: 'Pr Dr Ahmet Ozkara',
    });
    setHospitals({
      ar: 'مستشفى أجيبادم إسطنبول',
      en: 'Acibadem Hospital Istanbul',
      fr: 'Hôpital Acibadem Istanbul',
    });

    setTitles({
      ar: 'تجربة علاجية ناجحة واستعادة كاملة للصحة في إسطنبول',
      en: 'A Successful Heart Surgery and Complete Health Restoration in Istanbul',
      fr: 'Chirurgie cardiaque réussie et rétablissement complet à Istanbul',
    });
    setShortStories({
      ar: 'تجربة رائعة مع فريق أفيسينا، تم تنظيم كافة تفاصيل الرحلة بدقة متناهية.',
      en: 'An outstanding experience with AVICINNA; every detail of our clinical stay was flawlessly coordinated.',
      fr: 'Une expérience remarquable avec AVICINNA ; tous les détails de notre séjour médical ont été orchestrés avec perfection.',
    });
    setFullExperiences({
      ar: 'بدأت رحلتي بالتواصل مع منصة أفيسينا وإرسال التقارير الطبية.\nتم استقبالي في مطار إسطنبول بسيارة VIP ونقلي إلى الفندق.\nأجريت الفحوصات والعملية بنجاح تام وبمرافقة مترجم طبي معتمد.\nأشكر الفريق الطبي على الرعاية الفائقة والاهتمام الإنساني.',
      en: 'My journey began by contacting AVICINNA and transmitting diagnostic scans.\nI was greeted at Istanbul Airport with VIP private transfer to our hotel.\nPre-op evaluations and minimally invasive surgery succeeded with a dedicated medical interpreter.\nI thank the surgical faculty for their clinical excellence.',
      fr: 'Mon parcours a débuté par l’envoi de mes bilans à l’équipe AVICINNA.\nJ’ai été accueilli à l’aéroport d’Istanbul avec un transfert VIP jusqu’à l’hôtel.\nLes examens et l’intervention chirurgicale se sont déroulés avec un succès total et un interprète médical dédié.\nUn grand merci aux praticiens pour leur humanité.',
    });

    setModalOpen(true);
  };

  const openEditModal = (s: PatientStory) => {
    setEditingStory(s);
    setEditorTab(langKey);
    setPatientName(getPatientName(s.patientName, langKey));
    setTreatmentSlug(s.treatmentSlug);
    setRating(s.rating);
    setImageUrl(s.image);

    setCountries({
      ar: s.country.ar || '',
      en: s.country.en || s.country.ar || '',
      fr: s.country.fr || s.country.en || s.country.ar || '',
    });
    setDurations({
      ar: s.duration.ar || '',
      en: s.duration.en || s.duration.ar || '',
      fr: s.duration.fr || s.duration.en || s.duration.ar || '',
    });
    setDoctorNames({
      ar: s.doctorName.ar || '',
      en: s.doctorName.en || s.doctorName.ar || '',
      fr: s.doctorName.fr || s.doctorName.en || s.doctorName.ar || '',
    });
    setHospitals({
      ar: s.hospital.ar || '',
      en: s.hospital.en || s.hospital.ar || '',
      fr: s.hospital.fr || s.hospital.en || s.hospital.ar || '',
    });

    setTitles({
      ar: s.title.ar || '',
      en: s.title.en || s.title.ar || '',
      fr: s.title.fr || s.title.en || s.title.ar || '',
    });
    setShortStories({
      ar: s.shortStory.ar || '',
      en: s.shortStory.en || s.shortStory.ar || '',
      fr: s.shortStory.fr || s.shortStory.en || s.shortStory.ar || '',
    });
    setFullExperiences({
      ar: (s.fullExperience.ar || []).join('\n'),
      en: (s.fullExperience.en || s.fullExperience.ar || []).join('\n'),
      fr: (s.fullExperience.fr || s.fullExperience.en || s.fullExperience.ar || []).join('\n'),
    });

    setModalOpen(true);
  };

  const handleAutoTranslate = async () => {
    const currentTitle = titles[editorTab].trim();
    const currentShort = shortStories[editorTab].trim();
    const currentFull = fullExperiences[editorTab].trim();

    if (!currentTitle) {
      alert('Please enter at least a story title before translating.');
      return;
    }

    setIsTranslating(true);
    const targetLangs = (['ar', 'en', 'fr'] as Lang[]).filter((l) => l !== editorTab);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang: editorTab,
          targetLangs,
          payload: {
            title: currentTitle,
            shortStory: currentShort,
            fullExperience: currentFull,
          },
          domainContext: 'patient_story',
        }),
      });

      const data = await res.json();
      if (data.success && data.translations) {
        setTitles((prev) => ({
          ...prev,
          ar: data.translations.ar?.title || prev.ar,
          en: data.translations.en?.title || prev.en,
          fr: data.translations.fr?.title || prev.fr,
        }));
        setShortStories((prev) => ({
          ...prev,
          ar: data.translations.ar?.shortStory || prev.ar,
          en: data.translations.en?.shortStory || prev.en,
          fr: data.translations.fr?.shortStory || prev.fr,
        }));
        setFullExperiences((prev) => ({
          ...prev,
          ar: data.translations.ar?.fullExperience || prev.ar,
          en: data.translations.en?.fullExperience || prev.en,
          fr: data.translations.fr?.fullExperience || prev.fr,
        }));

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
        });
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mainTitle = titles[editorTab] || titles.ar || titles.en || titles.fr;
    if (!patientName || !mainTitle) return;

    const matchedTreatment = treatments.find((t) => t.slug === treatmentSlug);
    const treatmentTitle = {
      ar: matchedTreatment?.title.ar || 'علاج جراحي تخصصي',
      en: matchedTreatment?.title.en || 'Specialized Surgical Care',
      fr: matchedTreatment?.title.fr || 'Chirurgie Spécialisée',
    };

    const paragraphsAr = (fullExperiences.ar || fullExperiences[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);
    const paragraphsEn = (fullExperiences.en || fullExperiences[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);
    const paragraphsFr = (fullExperiences.fr || fullExperiences[editorTab]).split('\n').map((p) => p.trim()).filter(Boolean);

    const payload: PatientStory = {
      id: editingStory ? editingStory.id : `story-${Date.now()}`,
      slug: editingStory
        ? editingStory.slug
        : `${patientName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      patientName: editingStory && typeof editingStory.patientName === 'object' ? {
        ...editingStory.patientName,
        [editorTab]: patientName,
      } : {
        ar: patientName,
        en: patientName,
        fr: patientName,
      },
      country: {
        ar: countries.ar,
        en: countries.en || countries.ar,
        fr: countries.fr || countries.en || countries.ar,
      },
      treatment: treatmentTitle,
      treatmentSlug,
      duration: {
        ar: durations.ar,
        en: durations.en || durations.ar,
        fr: durations.fr || durations.en || durations.ar,
      },
      doctorName: {
        ar: doctorNames.ar,
        en: doctorNames.en || doctorNames.ar,
        fr: doctorNames.fr || doctorNames.en || doctorNames.ar,
      },
      hospital: {
        ar: hospitals.ar,
        en: hospitals.en || hospitals.ar,
        fr: hospitals.fr || hospitals.en || hospitals.ar,
      },
      title: {
        ar: titles.ar || mainTitle,
        en: titles.en || titles.fr || mainTitle,
        fr: titles.fr || titles.en || mainTitle,
      },
      shortStory: {
        ar: shortStories.ar || shortStories[editorTab],
        en: shortStories.en || shortStories.fr || shortStories[editorTab],
        fr: shortStories.fr || shortStories.en || shortStories[editorTab],
      },
      fullExperience: {
        ar: paragraphsAr,
        en: paragraphsEn,
        fr: paragraphsFr,
      },
      timeline: editingStory ? editingStory.timeline : [
        { step: { ar: 'اليوم 1', en: 'Day 1', fr: 'Jour 1' }, detail: { ar: 'الوصول لمطار إسطنبول والاستقبال VIP', en: 'VIP airport arrival', fr: 'Arrivée VIP' } },
        { step: { ar: 'اليوم 2', en: 'Day 2', fr: 'Jour 2' }, detail: { ar: 'الفحوصات الطبية ولقاء الجراح', en: 'Clinical diagnostics and consultation', fr: 'Examens cliniques' } },
        { step: { ar: 'اليوم 3', en: 'Day 3', fr: 'Jour 3' }, detail: { ar: 'إجراء العملية بنجاح تام', en: 'Successful surgery', fr: 'Intervention réussie' } },
        { step: { ar: 'اليوم 7', en: 'Day 7', fr: 'Jour 7' }, detail: { ar: 'المتابعة الطبية والعودة للوطن', en: 'Discharge and return flight', fr: 'Retour au pays' } },
      ],
      image: imageUrl,
      hasVideo: editingStory ? editingStory.hasVideo : false,
      rating: Number(rating),
    };

    if (editingStory) {
      updateStory(payload);
    } else {
      addStory(payload);
    }

    setModalOpen(false);
  };

  const handleDelete = (s: PatientStory) => {
    if (window.confirm(t.deleteConfirm(getPatientName(s.patientName, langKey)))) {
      deleteStory(s.id);
    }
  };

  const filteredStories = stories.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameVal = getPatientName(s.patientName, langKey).toLowerCase();
    const titleVal = (s.title[langKey] || s.title.ar || '').toLowerCase();
    const countryVal = (s.country[langKey] || s.country.ar || '').toLowerCase();
    const treatVal = (s.treatment[langKey] || s.treatment.ar || '').toLowerCase();
    return nameVal.includes(q) || titleVal.includes(q) || countryVal.includes(q) || treatVal.includes(q);
  });

  return (
    <div dir={direction} className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.pageTitle} ({stories.length})
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.pageSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnAddStory}</span>
        </button>
      </div>

      {/* Responsive Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 start-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-xs rounded-2xl py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-sky-500 outline-none transition-all"
        />
      </div>

      {/* Stories Fluid Responsive Grid (Rule #4: minmax(320px, 1fr)) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {filteredStories.map((s) => {
          const displayTitle = s.title[langKey] || s.title.ar;
          const displayShort = s.shortStory[langKey] || s.shortStory.ar;
          const displayCountry = s.country[langKey] || s.country.ar;
          const displayTreatment = s.treatment[langKey] || s.treatment.ar;
          const displayDuration = s.duration[langKey] || s.duration.ar;
          const displayName = getPatientName(s.patientName, langKey);

          return (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs group transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={s.image}
                    alt={displayName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded-md inline-block">
                      {displayTreatment}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                      {displayName}
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                      <span>{displayCountry}</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                  {displayTitle}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  &ldquo;{displayShort}&rdquo;
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 font-medium">
                    {displayDuration}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(s.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(s)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span>{t.btnEdit}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title={t.btnDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Story with Write-Once Auto-Translate */}
      <ModalPortal isOpen={modalOpen}>
        <div dir={direction} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200 overflow-hidden">
          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[26px] sm:rounded-[30px] max-w-3xl w-full max-h-[86vh] flex flex-col shadow-2xl shadow-slate-900/15 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            {/* Shimmer Overlay during AI Translation */}
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-sky-500/10 via-purple-500/20 to-teal-500/10 backdrop-blur-[2px] flex items-center justify-center"
                >
                  <div className="bg-white/95 px-6 py-4 rounded-2xl shadow-2xl border border-purple-200 flex items-center gap-3 text-sm font-bold text-purple-900 animate-pulse">
                    <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                    <span>{t.translating}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center ring-4 ring-purple-500/10 shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                    {editingStory ? t.modalEditTitle : t.modalAddTitle}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingStory ? t.modalEditSubtitle : t.modalAddSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6 space-y-4">
              {/* Patient Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldName}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Mohammed Al-Saeed"
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldCountry}
                  </label>
                  <input
                    type="text"
                    required
                    value={countries[editorTab]}
                    onChange={(e) => setCountries({ ...countries, [editorTab]: e.target.value })}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Treatment & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    label={t.fieldTreatment}
                    value={treatmentSlug}
                    onChange={setTreatmentSlug}
                    options={treatments.map((tr) => ({
                      value: tr.slug,
                      label: tr.title[langKey] || tr.title.ar,
                      subLabel: tr.title.en,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldDuration}
                  </label>
                  <input
                    type="text"
                    value={durations[editorTab]}
                    onChange={(e) => setDurations({ ...durations, [editorTab]: e.target.value })}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Doctor & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldDoctor}
                  </label>
                  <input
                    type="text"
                    value={doctorNames[editorTab]}
                    onChange={(e) => setDoctorNames({ ...doctorNames, [editorTab]: e.target.value })}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fieldHospital}
                  </label>
                  <input
                    type="text"
                    value={hospitals[editorTab]}
                    onChange={(e) => setHospitals({ ...hospitals, [editorTab]: e.target.value })}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Write-Once Language Tabs & Auto-Translate Action */}
              <div className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {(['fr', 'ar', 'en'] as Lang[]).map((tab) => {
                      const isSelected = editorTab === tab;
                      const hasContent = Boolean(titles[tab] && titles[tab].trim().length > 0);
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditorTab(tab)}
                          className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>{tab}</span>
                          {hasContent && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTranslating}
                    onClick={handleAutoTranslate}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>{t.translating}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t.autoTranslateBtn}</span>
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.writeInOneTab}
                </p>
              </div>

              {/* Story Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldTitle} ({editorTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={titles[editorTab]}
                  onChange={(e) => setTitles({ ...titles, [editorTab]: e.target.value })}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Short Story */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldShortStory} ({editorTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={shortStories[editorTab]}
                  onChange={(e) => setShortStories({ ...shortStories, [editorTab]: e.target.value })}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Full Experience Narrative */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldFullExperience} ({editorTab.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  dir={editorTab === 'ar' ? 'rtl' : 'ltr'}
                  value={fullExperiences[editorTab]}
                  onChange={(e) => setFullExperiences({ ...fullExperiences, [editorTab]: e.target.value })}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white leading-relaxed outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Photo Upload */}
              <ImageUploadField
                label={t.fieldImage}
                value={imageUrl}
                onChange={setImageUrl}
                folder="stories"
                aspectRatio="square"
              />

              {/* Star Rating Slider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fieldRating}: {rating} / 5
                </label>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              </div>

              {/* Modal Footer Controls - Sticky & Always Visible */}
              <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer transition-all"
                >
                  {t.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}
