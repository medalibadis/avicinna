'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { Doctor, DoctorCareerItem } from '@/data/doctors';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Star,
  Building2,
  Search,
  X,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Award,
  Cpu,
  Video,
  ExternalLink,
  CheckCircle2,
  Check,
  FileText,
  Languages,
  Sparkles,
  AlertCircle,
  Activity,
  Loader2,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { VideoUploadField } from '@/components/admin/VideoUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';
import { ModalPortal } from '@/components/admin/ModalPortal';
import { SmartTranslatableField } from '@/components/admin/SingleInputAutoTranslator';
import { ContextualSectionTip } from '@/components/admin/AdminOnboardingGuide';

const DEFAULT_LANGUAGES_MAP: Record<'ar' | 'en' | 'fr', string[]> = {
  ar: [
    'العربية',
    'العربية (مترجم)',
    'English',
    'Türkçe',
    'Français',
    'Français (مترجم)',
    'Deutsch',
    'Русский',
  ],
  en: [
    'Arabic',
    'Arabic (with interpreter)',
    'English',
    'Turkish',
    'French',
    'French (with interpreter)',
    'German',
    'Russian',
  ],
  fr: [
    'Arabe',
    'Arabe (avec interprète)',
    'Anglais',
    'Turc',
    'Français',
    'Français (avec interprète)',
    'Allemand',
    'Russe',
  ],
};

interface EditableCareerItem {
  period: string;
  roleAr: string;
  roleEn: string;
  instAr: string;
  instEn: string;
}

const doctorsDict = {
  ar: {
    badge: 'قاعدة بيانات الكادر الطبي المعتمد',
    pageTitle: 'إدارة الأطباء والاستشاريين',
    pageSubtitle: 'تحكم كامل في بيانات الكادر الطبي المعتمد: المسيرة المهنية، العمليات، المؤهلات، العضويات، اللغات والوسائط.',
    btnAddDoctor: 'إضافة طبيب استشاري جديد',
    searchPlaceholder: 'ابحث عن طبيب بالاسم، المستشفى، أو التخصص الطبي...',
    allSpecialties: 'كافة التخصصات الطبية',
    statDoctors: 'كادر طبي معتمد',
    statExperience: 'متوسط سنوات الخبرة',
    statSurgeries: 'عملية جراحية موثقة',
    statSpecialties: 'تخصصات جراحية دقيقة',
    experienceYears: (y: number) => `+${y} سنة خبرة`,
    surgeriesCount: (s: number) => `+${s} عملية`,
    publicationsCount: (p: number) => `+${p} بحث`,
    rating: 'التقييم',
    hasVideo: 'فيديو',
    noVideo: 'بدون فيديو',
    btnPreview: 'معاينة السيرة المباشرة',
    btnEdit: 'تعديل السيرة الذاتية',
    btnDelete: 'حذف',
    deleteConfirm: (name: string) => `هل أنت متأكد من رغبتك في حذف ملف الطبيب: ${name} نهائياً؟`,
    deletedToast: (name: string) => `تم حذف ملف الطبيب ${name} بنجاح.`,
    savedToast: (name: string) => `تم حفظ وتحديث السيرة الذاتية لـ ${name} بنجاح!`,
    addedToast: (name: string) => `تمت إضافة الطبيب ${name} إلى قاعدة البيانات بنجاح!`,
    noResultsTitle: 'لا توجد نتائج مطابقة لبحثك',
    noResultsSub: 'جرّب البحث باسم آخر أو اختر تخصصاً مختلفاً.',
    modalAddTitle: 'إضافة استشاري / طبيب جديد',
    modalEditTitle: (name: string) => `تعديل السيرة الذاتية: ${name}`,
    modalSubtitle: 'استوديو إدارة بيانات السيرة الذاتية الطبية الشاملة والمعتمدة.',
    tabBasic: '1. البيانات الأساسية والمستشفى',
    tabBio: '2. السيرة الذاتية والنبذة',
    tabCareer: '3. المسيرة المهنية والمناصب',
    tabExpertise: '4. التخصصات الدقيقة والعمليات',
    tabEducation: '5. المؤهلات والعضويات والتقنيات',
    tabVideo: '6. فيديو وشرح الطبيب',
    fieldNameAr: 'الاسم بالعربية *',
    fieldNameEn: 'الاسم بالإنجليزية *',
    fieldNameFr: 'الاسم بالفرنسية *',
    fieldTitleAr: 'اللقب والصفة السريرية (عربي) *',
    fieldTitleEn: 'اللقب والصفة السريرية (إنجليزي) *',
    fieldTitleFr: 'اللقب والصفة السريرية (فرنسي) *',
    fieldSpecialty: 'التخصص الطبي المرتبط *',
    fieldHospital: 'المستشفى الشريك المعتمد *',
    metricsTitle: 'المؤشرات السريرية والأرقام المعتمدة للطبيب',
    expField: 'سنوات الخبرة',
    ratingField: 'التقييم (من 5)',
    reviewsField: 'عدد التقييمات',
    surgeriesField: 'العمليات الناجحة',
    pubsField: 'الأبحاث المنشورة',
    fieldLanguages: 'لغات الاستشارة والتواصل الطبي مع المريض',
    fieldCustomLangPlaceholder: 'أو اكتب لغة أخرى واضغط إضافة...',
    btnAddCustomLang: 'إضافة لغة',
    fieldImage: 'صورة الطبيب الشخصية الرسمية *',
    fieldImageHelper: 'اختر صورة عالية الدقة للطبيب بالزي الطبي الرسمي، أو اسحب صورة من جهازك، أو الصق رابطاً مباشراً.',
    fieldBioAr: 'السيرة الذاتية والنبذة التقديمية (بالعربية) *',
    fieldBioEn: 'السيرة الذاتية والنبذة التقديمية (بالإنجليزية) *',
    fieldBioFr: 'السيرة الذاتية والنبذة التقديمية (بالفرنسية) *',
    careerHeader: 'المسيرة المهنية والمناصب السابقة',
    careerSub: 'أضف المحطات والمناصب التي شغلها الطبيب مع الفترة الزمنية واسم المستشفى أو الصرح الطبي.',
    btnAddCareer: '+ إضافة محطة مهنية جديدة',
    careerEmpty: 'لا توجد محطات مهنية مضافة حتى الآن',
    careerStation: (n: number) => `المحطة #${n}`,
    fieldPeriod: 'الفترة الزمنية:',
    fieldRoleAr: 'المنصب والمسمى (عربي):',
    fieldRoleEn: 'المنصب والمسمى (إنجليزي):',
    fieldInstAr: 'المشفى أو المؤسسة (عربي):',
    fieldInstEn: 'المشفى أو المؤسسة (إنجليزي):',
    expertiseTitle: 'التخصصات الدقيقة والاهتمامات السريرية',
    expertisePlaceholder: 'مثال: جراحة الشرايين التاجية، زراعة الصمام الأبهري TAVI...',
    proceduresTitle: 'العمليات والإجراءات الجراحية المعتمدة',
    proceduresPlaceholder: 'مثال: مجازة الشريان التاجي CABG، استبدال الصمام التاجي...',
    btnAddTag: '+ إضافة',
    eduTitle: 'المؤهلات العلمية والشهادات والزمالات الدولية',
    eduPlaceholder: 'مثال: البورد الأوروبي، زمالة كلية الجراحين الملكية FRCS...',
    membershipsTitle: 'العضويات في الجمعيات الدولية والطبية',
    membershipsPlaceholder: 'مثال: الجمعية الأوروبية EACTS، الجمعية الطبية التركية...',
    techTitle: 'التقنيات الطبية والأجهزة المعتمدة',
    techPlaceholder: 'مثال: روبوت دافنشي Xi، الرنين المغناطيسي 3 تسلا...',
    videoNoteTitle: 'ملاحظة هامة حول قسم الفيديو:',
    videoNoteDesc: 'فيديو الطبيب اختياري تماماً. إذا تُرِك هذا الحقل فارغاً، فلن يظهر أي مشغل فيديو في صفحة السيرة الذاتية المباشرة للطبيب على الإطلاق.',
    fieldVideoUpload: 'فيديو وشرح الطبيب المعتمد',
    fieldVideoHelper: 'أدخل رابط فيديو يوتيوب حقيقي للطبيب أو ارفع مقطع فيديو مباشر من جهازك.',
    fieldVideoTitleEn: 'عنوان الفيديو بالإنجليزية (اختياري):',
    saveBtn: 'حفظ واعتماد بيانات الطبيب',
    cancelBtn: 'إلغاء',
    stepIndicator: (step: number) => `الخطوة ${step} من 6`,
  },
  en: {
    badge: 'Accredited Medical Faculty Directory',
    pageTitle: 'Consultants & Surgical Faculty',
    pageSubtitle: 'Comprehensive control over doctor credentials: career timeline, surgeries, fellowships, memberships, languages, and media.',
    btnAddDoctor: 'Add New Consultant Doctor',
    searchPlaceholder: 'Search by doctor name, hospital, or specialty...',
    allSpecialties: 'All Medical Specialties',
    statDoctors: 'Accredited Faculty',
    statExperience: 'Avg. Clinical Experience',
    statSurgeries: 'Documented Surgeries',
    statSpecialties: 'Clinical Specialties',
    experienceYears: (y: number) => `+${y} yrs exp`,
    surgeriesCount: (s: number) => `+${s} surgeries`,
    publicationsCount: (p: number) => `+${p} pubs`,
    rating: 'Rating',
    hasVideo: 'Video',
    noVideo: 'No video',
    btnPreview: 'View Public Profile',
    btnEdit: 'Edit Profile',
    btnDelete: 'Delete',
    deleteConfirm: (name: string) => `Are you sure you want to permanently delete doctor: ${name}?`,
    deletedToast: (name: string) => `Doctor ${name} has been removed.`,
    savedToast: (name: string) => `Doctor profile for ${name} saved successfully!`,
    addedToast: (name: string) => `Doctor ${name} added to database successfully!`,
    noResultsTitle: 'No doctors match your query',
    noResultsSub: 'Try searching by a different name or specialty filter.',
    modalAddTitle: 'Add New Consultant Doctor',
    modalEditTitle: (name: string) => `Edit Clinical Profile: ${name}`,
    modalSubtitle: 'Professional medical CV and credentials management studio.',
    tabBasic: '1. Basic Info & Hospital',
    tabBio: '2. Clinical Biography',
    tabCareer: '3. Career Timeline',
    tabExpertise: '4. Expertise & Surgeries',
    tabEducation: '5. Education & Credentials',
    tabVideo: '6. Video & Interviews',
    fieldNameAr: 'Name in Arabic *',
    fieldNameEn: 'Name in English *',
    fieldNameFr: 'Name in French *',
    fieldTitleAr: 'Clinical Title (Arabic) *',
    fieldTitleEn: 'Clinical Title (English) *',
    fieldTitleFr: 'Clinical Title (French) *',
    fieldSpecialty: 'Medical Specialty *',
    fieldHospital: 'Partner Hospital *',
    metricsTitle: 'Clinical Indicators & Key Performance Stats',
    expField: 'Years of Experience',
    ratingField: 'Rating Score (out of 5)',
    reviewsField: 'Review Count',
    surgeriesField: 'Completed Surgeries',
    pubsField: 'Publications Count',
    fieldLanguages: 'Consultation & Communication Languages',
    fieldCustomLangPlaceholder: 'Or type custom language and click add...',
    btnAddCustomLang: 'Add Language',
    fieldImage: 'Official Portrait Photo *',
    fieldImageHelper: 'Upload a high-resolution professional portrait in surgical attire or paste a verified direct URL.',
    fieldBioAr: 'Detailed Biography (Arabic) *',
    fieldBioEn: 'Detailed Biography (English) *',
    fieldBioFr: 'Detailed Biography (French) *',
    careerHeader: 'Career Milestones & Appointments Timeline',
    careerSub: 'Add institutional appointments with time periods, hospital names, and leadership roles.',
    btnAddCareer: '+ Add Career Timeline Entry',
    careerEmpty: 'No career milestones recorded yet',
    careerStation: (n: number) => `Milestone #${n}`,
    fieldPeriod: 'Time Period:',
    fieldRoleAr: 'Title/Role (Arabic):',
    fieldRoleEn: 'Title/Role (English):',
    fieldInstAr: 'Hospital/Center (Arabic):',
    fieldInstEn: 'Hospital/Center (English):',
    expertiseTitle: 'Clinical Sub-Specialties & Areas of Expertise',
    expertisePlaceholder: 'e.g., Coronary artery bypass, TAVI aortic valve replacement...',
    proceduresTitle: 'Approved Surgical Procedures & Interventions',
    proceduresPlaceholder: 'e.g., Minimally invasive CABG, mitral valve repair...',
    btnAddTag: '+ Add',
    eduTitle: 'Academic Degrees, Board Certifications & Fellowships',
    eduPlaceholder: 'e.g., European Board of Surgery, Fellow of Royal College FRCS...',
    membershipsTitle: 'Medical Societies & International Memberships',
    membershipsPlaceholder: 'e.g., European Association for Cardio-Thoracic Surgery (EACTS)...',
    techTitle: 'Approved Surgical Technologies & Robotics',
    techPlaceholder: 'e.g., Da Vinci Xi Surgical Robot, 3 Tesla Intraoperative MRI...',
    videoNoteTitle: 'Video Media Note:',
    videoNoteDesc: 'Doctor video is optional. If left blank, no video section will be displayed on the doctor profile.',
    fieldVideoUpload: 'Verified Doctor Clinical Video',
    fieldVideoHelper: 'Paste a real YouTube video link or upload an approved direct video file.',
    fieldVideoTitleEn: 'Video Title in English (Optional):',
    saveBtn: 'Save & Publish Doctor Profile',
    cancelBtn: 'Cancel',
    stepIndicator: (step: number) => `Step ${step} of 6`,
  },
  fr: {
    badge: 'Répertoire du Corps Médical Agréé',
    pageTitle: 'Médecins & Chirurgiens Agréés',
    pageSubtitle: 'Contrôle complet des dossiers médicaux : parcours clinique, interventions, titres, sociétés savantes, langues et médias.',
    btnAddDoctor: 'Ajouter un Médecin Consultant',
    searchPlaceholder: 'Rechercher par médecin, hôpital ou spécialité...',
    allSpecialties: 'Toutes les Spécialités',
    statDoctors: 'Praticiens Agréés',
    statExperience: 'Expérience Moyenne',
    statSurgeries: 'Chirurgies Réalisées',
    statSpecialties: 'Spécialités Pratiquées',
    experienceYears: (y: number) => `+${y} ans d’exp.`,
    surgeriesCount: (s: number) => `+${s} actes`,
    publicationsCount: (p: number) => `+${p} publis`,
    rating: 'Note',
    hasVideo: 'Vidéo',
    noVideo: 'Sans vidéo',
    btnPreview: 'Voir Profil en Ligne',
    btnEdit: 'Modifier le Dossier',
    btnDelete: 'Supprimer',
    deleteConfirm: (name: string) => `Êtes-vous sûr de vouloir supprimer définitivement le praticien : ${name} ?`,
    deletedToast: (name: string) => `Le praticien ${name} a été supprimé.`,
    savedToast: (name: string) => `Dossier de ${name} enregistré avec succès !`,
    addedToast: (name: string) => `Le praticien ${name} a été ajouté avec succès !`,
    noResultsTitle: 'Aucun médecin ne correspond à votre recherche',
    noResultsSub: 'Essayez avec un autre nom ou modifiez le filtre de spécialité.',
    modalAddTitle: 'Ajouter un Médecin Consultant',
    modalEditTitle: (name: string) => `Modifier Dossier Médical : ${name}`,
    modalSubtitle: 'Studio de gestion des qualifications et du parcours médical.',
    tabBasic: '1. Informations Générales & Hôpital',
    tabBio: '2. Biographie Clinique',
    tabCareer: '3. Parcours Clinique',
    tabExpertise: '4. Spécialités & Actes',
    tabEducation: '5. Formation & Sociétés',
    tabVideo: '6. Vidéo & Présentation',
    fieldNameAr: 'Nom en Arabe *',
    fieldNameEn: 'Nom en Anglais *',
    fieldNameFr: 'Nom en Français *',
    fieldTitleAr: 'Titre Médical (Arabe) *',
    fieldTitleEn: 'Titre Médical (Anglais) *',
    fieldTitleFr: 'Titre Médical (Français) *',
    fieldSpecialty: 'Pôle Médical Associé *',
    fieldHospital: 'Hôpital Partenaire Agréé *',
    metricsTitle: 'Indicateurs Cliniques & Statistiques d’Activité',
    expField: 'Années d’Expérience',
    ratingField: 'Évaluation (sur 5)',
    reviewsField: 'Nombre d’Avis',
    surgeriesField: 'Chirurgies Réalisées',
    pubsField: 'Publications Médicales',
    fieldLanguages: 'Langues de Consultation et d’Échange',
    fieldCustomLangPlaceholder: 'Ou saisissez une langue...',
    btnAddCustomLang: 'Ajouter',
    fieldImage: 'Photo Officielle du Médecin *',
    fieldImageHelper: 'Importez une photo haute résolution en blouse médicale ou collez une URL directe.',
    fieldBioAr: 'Biographie Clinique (Arabe) *',
    fieldBioEn: 'Biographie Clinique (Anglais) *',
    fieldBioFr: 'Biographie Clinique (Français) *',
    careerHeader: 'Parcours Clinique & Étapes Professionnelles',
    careerSub: 'Ajoutez les postes hospitaliers occupés avec les dates et établissements de référence.',
    btnAddCareer: '+ Ajouter une Étape Professionnelle',
    careerEmpty: 'Aucune étape clinique enregistrée',
    careerStation: (n: number) => `Étape #${n}`,
    fieldPeriod: 'Période :',
    fieldRoleAr: 'Fonction (Arabe) :',
    fieldRoleEn: 'Fonction (Anglais) :',
    fieldInstAr: 'Établissement (Arabe) :',
    fieldInstEn: 'Établissement (Anglais) :',
    expertiseTitle: 'Sur-spécialités & Domaines d’Expertise',
    expertisePlaceholder: 'Ex: Pontage coronarien, chirurgie valvulaire TAVI...',
    proceduresTitle: 'Actes & Protocoles Chirurgicaux Pratiqués',
    proceduresPlaceholder: 'Ex: Chirurgie cardiaque mini-invasive, plastie mitrale...',
    btnAddTag: '+ Ajouter',
    eduTitle: 'Diplômes, Spécialités & Fellowships Internationaux',
    eduPlaceholder: 'Ex: European Board of Surgery, Fellow Royal College...',
    membershipsTitle: 'Sociétés Savantes & Organismes Internationaux',
    membershipsPlaceholder: 'Ex: European Association for Cardio-Thoracic Surgery...',
    techTitle: 'Technologies & Équipements de Haute Précision',
    techPlaceholder: 'Ex: Robot chirurgical Da Vinci Xi, IRM 3 Tesla...',
    videoNoteTitle: 'Note Vidéo :',
    videoNoteDesc: 'La vidéo est optionnelle. Si le champ reste vide, aucune section vidéo n’apparaîtra sur la fiche publique.',
    fieldVideoUpload: 'Vidéo Clinique du Praticien',
    fieldVideoHelper: 'Collez un lien YouTube vérifié ou déposez un fichier vidéo direct.',
    fieldVideoTitleEn: 'Titre de la Vidéo en Anglais (Optionnel) :',
    saveBtn: 'Enregistrer et Publier le Profil',
    cancelBtn: 'Annuler',
    stepIndicator: (step: number) => `Étape ${step} sur 6`,
  },
};

function DoctorsContent() {
  const { doctors, treatments, hospitals, addDoctor, updateDoctor, deleteDoctor } = useData();
  const { language, direction } = useLanguage();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = doctorsDict[langKey];
  const searchParams = useSearchParams();
  const targetDoctorId = searchParams?.get('edit') || searchParams?.get('id');

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'bio' | 'career' | 'expertise' | 'education' | 'video'>('basic');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [specialtySlug, setSpecialtySlug] = useState('cardiac-surgery');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalAr, setHospitalAr] = useState('');
  const [experienceYears, setExperienceYears] = useState(15);
  const [rating, setRating] = useState(4.9);
  const [reviewCount, setReviewCount] = useState(120);
  const [surgeriesCount, setSurgeriesCount] = useState(2500);
  const [publicationsCount, setPublicationsCount] = useState(45);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop'
  );
  const [languages, setLanguages] = useState<string[]>(['العربية (مترجم)', 'English', 'Türkçe']);
  const [customLanguageInput, setCustomLanguageInput] = useState('');

  // Tab 2: Biographies
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioFr, setBioFr] = useState('');

  // Tab 3: Career History Timeline
  const [careerList, setCareerList] = useState<EditableCareerItem[]>([]);

  // Tab 4: Areas of Expertise & Key Procedures
  const [expertiseList, setExpertiseList] = useState<string[]>([]);
  const [newExpertiseInput, setNewExpertiseInput] = useState('');
  const [proceduresList, setProceduresList] = useState<string[]>([]);
  const [newProcedureInput, setNewProcedureInput] = useState('');

  // Tab 5: Education, Memberships & Technologies
  const [educationList, setEducationList] = useState<string[]>([]);
  const [newEducationInput, setNewEducationInput] = useState('');
  const [membershipsList, setMembershipsList] = useState<string[]>([]);
  const [newMembershipInput, setNewMembershipInput] = useState('');
  const [technologiesList, setTechnologiesList] = useState<string[]>([]);
  const [newTechnologyInput, setNewTechnologyInput] = useState('');

  // Tab 6: Doctor Video
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitleAr, setVideoTitleAr] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Open Modal for New Doctor
  const openAddModal = () => {
    setEditingDoctor(null);
    setActiveTab('basic');

    setNameAr('');
    setNameEn('');
    setNameFr('');
    setTitleAr('استشاري جراحة متقدمة وأورام في إسطنبول');
    setTitleEn('Consultant Specialist Surgeon');
    setTitleFr('Chirurgien Spécialiste Consultant');

    const firstTreatment = treatments[0]?.slug || 'cardiac-surgery';
    setSpecialtySlug(firstTreatment);

    const firstHosp = hospitals[0];
    setHospitalId(firstHosp?.id || 'acibadem-altunizade');
    setHospitalAr(firstHosp?.name.ar || 'مستشفى أجيبادم ألتونيزاده');

    setExperienceYears(18);
    setRating(4.9);
    setReviewCount(140);
    setSurgeriesCount(3200);
    setPublicationsCount(50);
    setImageUrl('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop');
    setLanguages(['العربية (مترجم)', 'English', 'Türkçe']);
    setCustomLanguageInput('');

    setBioAr(
      'استشاري رائد في تركيا يتمتع بسجل استثنائي يمتد لأكثر من 18 عاماً في إجراء العمليات الجراحية المتقدمة وفق أحدث البروتوكولات الطبية الدولية.'
    );
    setBioEn(
      'Distinguished consultant surgeon with over 18 years of clinical leadership in performing advanced surgical procedures under international accreditation.'
    );
    setBioFr(
      'Chirurgien consultant émérite avec plus de 18 ans d’expérience clinique dans les interventions de haute précision à Istanbul.'
    );

    setCareerList([
      {
        period: '2019 - الحالي',
        roleAr: 'استشاري أول ورئيس الفريق الجراحي',
        roleEn: 'Senior Consultant & Surgical Team Lead',
        instAr: firstHosp?.name.ar || 'مستشفى أجيبادم ألتونيزاده - إسطنبول',
        instEn: firstHosp?.name.en || 'Acıbadem Altunizade Hospital - Istanbul',
      },
      {
        period: '2014 - 2019',
        roleAr: 'أخصائي جراحة متقدمة',
        roleEn: 'Advanced Surgery Specialist',
        instAr: 'المركز الطبي التخصصي الجامعي - تركيا',
        instEn: 'University Specialty Medical Center - Turkey',
      },
    ]);

    setExpertiseList(['جراحة دقيقة بالمنظار', 'استشارات تخصصية معقدة', 'علاج الحالات المتقدمة']);
    setNewExpertiseInput('');
    setProceduresList(['الجراحة طفيفة التوغل', 'العمليات الدقيقة بالروبوت', 'إعادة التأهيل الجراحي المتقدم']);
    setNewProcedureInput('');
    setEducationList([
      'كلية الطب - جامعة إسطنبول (مرتبة الشرف)',
      'تخصص الجراحة المتقدمة - المشافي الجامعية في تركيا',
      'زمالة الجراحة الدولية المتطورة',
    ]);
    setNewEducationInput('');
    setMembershipsList([
      'الجمعية الطبية التركية (TTB)',
      'الجمعية الأوروبية للجراحة التخصصية (ES)',
      'الجمعية الدولية لجراحة الأعضاء المتقدمة',
    ]);
    setNewMembershipInput('');
    setTechnologiesList([
      'روبوت دافنشي Xi الجراحي',
      'غرف العمليات الهجينة الذكية',
      'نظام الملاحة الجراحية ثلاثي الأبعاد',
    ]);
    setNewTechnologyInput('');
    setVideoUrl('');
    setVideoTitleAr('');
    setVideoTitleEn('');

    setModalOpen(true);
  };

  // Open Modal for Existing Doctor
  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setActiveTab('basic');

    setNameAr(doc.name.ar || '');
    setNameEn(doc.name.en || '');
    setNameFr(doc.name.fr || doc.name.en || '');

    setTitleAr(doc.title.ar || '');
    setTitleEn(doc.title.en || '');
    setTitleFr(doc.title.fr || doc.title.en || '');

    setSpecialtySlug(doc.specialtySlug);

    const currentHosp = hospitals.find((h) => h.id === doc.hospitalId || h.slug === doc.hospitalSlug) || hospitals[0];
    setHospitalId(doc.hospitalId || currentHosp?.id || 'acibadem-altunizade');
    setHospitalAr(doc.hospital.ar || currentHosp?.name.ar || '');

    setExperienceYears(doc.experienceYears);
    setRating(doc.rating);
    setReviewCount(doc.reviewCount);
    setSurgeriesCount(doc.surgeriesCount || 2500);
    setPublicationsCount(doc.publicationsCount || 40);
    setImageUrl(doc.image);

    setLanguages(doc.languages && doc.languages.length > 0 ? doc.languages : ['العربية (مترجم)', 'English', 'Türkçe']);
    setCustomLanguageInput('');

    setBioAr(doc.biography.ar || '');
    setBioEn(doc.biography.en || '');
    setBioFr(doc.biography.fr || doc.biography.en || '');

    if (doc.careerHistory && doc.careerHistory.length > 0) {
      setCareerList(
        doc.careerHistory.map((item) => ({
          period: item.period || '',
          roleAr: item.role.ar || '',
          roleEn: item.role.en || '',
          instAr: item.institution.ar || '',
          instEn: item.institution.en || '',
        }))
      );
    } else {
      setCareerList([
        {
          period: '2019 - الحالي',
          roleAr: doc.title.ar,
          roleEn: doc.title.en,
          instAr: doc.hospital.ar,
          instEn: doc.hospital.en,
        },
      ]);
    }

    setExpertiseList(doc.areasOfExpertise?.ar ? [...doc.areasOfExpertise.ar] : []);
    setNewExpertiseInput('');
    setProceduresList(doc.procedures?.ar ? [...doc.procedures.ar] : []);
    setNewProcedureInput('');
    setEducationList(doc.education?.ar ? [...doc.education.ar] : []);
    setNewEducationInput('');
    setMembershipsList(doc.memberships?.ar ? [...doc.memberships.ar] : []);
    setNewMembershipInput('');
    setTechnologiesList(doc.technologies?.ar ? [...doc.technologies.ar] : []);
    setNewTechnologyInput('');

    const rawVUrl = (doc.videoUrl || (doc.videos && doc.videos[0]?.url) || '').trim();
    const isPlaceholder =
      rawVUrl.includes('a3ICNMQW7Ok') ||
      rawVUrl.includes('5qap5aO4i9A') ||
      rawVUrl.toLowerCase().includes('wildlife');

    const cleanVUrl = isPlaceholder ? '' : rawVUrl;
    setVideoUrl(cleanVUrl);

    const rawVTitle = (doc.videoTitle?.ar || (doc.videos && doc.videos[0]?.title?.ar) || '').trim();
    setVideoTitleAr(cleanVUrl ? rawVTitle : '');
    setVideoTitleEn(cleanVUrl ? (doc.videoTitle?.en || (doc.videos && doc.videos[0]?.title?.en) || '') : '');

    setModalOpen(true);
  };

  // Deep-Linking: When user clicks a specific doctor from search (?edit=... or ?id=...)
  useEffect(() => {
    if (targetDoctorId && doctors.length > 0) {
      const targetDoc = doctors.find((item) => item.id === targetDoctorId || item.slug === targetDoctorId);
      if (targetDoc) {
        openEditModal(targetDoc);
        const nameToSearch = targetDoc.name?.[langKey] || targetDoc.name?.ar || targetDoc.name?.en || '';
        setSearchQuery(nameToSearch);
      }
    }
  }, [targetDoctorId, doctors]);

  const addCareerItem = () => {
    setCareerList([
      ...careerList,
      {
        period: '2020 - 2024',
        roleAr: 'استشاري جراحة متخصصة',
        roleEn: 'Consultant Specialist Surgeon',
        instAr: hospitalAr || 'مستشفى تركي معتمد - إسطنبول',
        instEn: 'Accredited Hospital - Istanbul',
      },
    ]);
  };

  const updateCareerItem = (index: number, field: keyof EditableCareerItem, val: string) => {
    setCareerList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const removeCareerItem = (index: number) => {
    setCareerList((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const [isAutoTranslatingDoctor, setIsAutoTranslatingDoctor] = useState(false);
  const [bioTab, setBioTab] = useState<'ar' | 'en' | 'fr'>(langKey);

  const handleAutoTranslateDoctor = async () => {
    const sourceLang: 'ar' | 'en' | 'fr' =
      langKey === 'fr' && (bioFr || titleFr) ? 'fr' :
      langKey === 'en' && (bioEn || titleEn) ? 'en' : 'ar';
    const targetLangs = (['ar', 'en', 'fr'] as ('ar' | 'en' | 'fr')[]).filter((l) => l !== sourceLang);

    const sourcePayload: Record<string, string> = {};
    if (sourceLang === 'fr') {
      if (titleFr) sourcePayload.title = titleFr;
      if (bioFr) sourcePayload.biography = bioFr;
    } else if (sourceLang === 'en') {
      if (titleEn) sourcePayload.title = titleEn;
      if (bioEn) sourcePayload.biography = bioEn;
    } else {
      if (titleAr) sourcePayload.title = titleAr;
      if (bioAr) sourcePayload.biography = bioAr;
    }

    if (Object.keys(sourcePayload).length === 0) return;

    setIsAutoTranslatingDoctor(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang,
          targetLangs,
          payload: sourcePayload,
          domainContext: 'doctor_profile',
        }),
      });
      const data = await res.json();
      if (data.success && data.translations) {
        if (data.translations.ar?.title) setTitleAr(data.translations.ar.title);
        if (data.translations.en?.title) setTitleEn(data.translations.en.title);
        if (data.translations.fr?.title) setTitleFr(data.translations.fr.title);

        if (data.translations.ar?.biography) setBioAr(data.translations.ar.biography);
        if (data.translations.en?.biography) setBioEn(data.translations.en.biography);
        if (data.translations.fr?.biography) setBioFr(data.translations.fr.biography);

        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.65 },
        });
      }
    } catch (err) {
      console.error('Doctor translation failed:', err);
    } finally {
      setIsAutoTranslatingDoctor(false);
    }
  };

  const addCustomLanguage = () => {
    const trimmed = customLanguageInput.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed]);
      setCustomLanguageInput('');
    }
  };

  const addTagItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue('');
    }
  };

  const removeTagItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalNameAr = nameAr.trim() || nameFr.trim() || nameEn.trim();
    const finalNameEn = nameEn.trim() || nameFr.trim() || nameAr.trim();
    const finalNameFr = nameFr.trim() || nameEn.trim() || nameAr.trim();

    if (!finalNameAr && !finalNameEn) {
      alert(langKey === 'ar' ? 'يرجى إدخال اسم الطبيب.' : 'Please provide doctor name.');
      return;
    }

    const finalTitleAr = titleAr.trim() || titleFr.trim() || titleEn.trim() || 'استشاري جراحة';
    const finalTitleEn = titleEn.trim() || titleFr.trim() || titleAr.trim() || 'Consultant Specialist';
    const finalTitleFr = titleFr.trim() || titleEn.trim() || titleAr.trim() || 'Chirurgien Spécialiste';

    const matchedTreatment = treatments.find((t) => t.slug === specialtySlug) || treatments[0];
    const matchedHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];

    const cleanExpertise = expertiseList.length > 0 ? expertiseList : ['استشارات جراحية متقدمة', 'علاج الحالات المعقدة'];
    const cleanProcedures = proceduresList.length > 0 ? proceduresList : ['العمليات الجراحية الدقيقة'];
    const cleanEducation = educationList.length > 0 ? educationList : ['كلية الطب - المشافي الجامعية في تركيا'];
    const cleanMemberships = membershipsList.length > 0 ? membershipsList : ['الجمعية الطبية التركية'];
    const cleanTechnologies = technologiesList.length > 0 ? technologiesList : ['غرف العمليات المجهزة'];

    const assembledCareerHistory: DoctorCareerItem[] =
      careerList.length > 0
        ? careerList.map((c) => ({
            period: c.period.trim(),
            role: {
              ar: c.roleAr.trim() || finalTitleAr,
              en: c.roleEn.trim() || finalTitleEn,
              fr: c.roleEn.trim() || finalTitleFr,
            },
            institution: {
              ar: c.instAr.trim() || matchedHospital.name.ar,
              en: c.instEn.trim() || matchedHospital.name.en,
              fr: c.instEn.trim() || matchedHospital.name.fr || matchedHospital.name.en,
            },
          }))
        : [
            {
              period: '2019 - الحالي',
              role: { ar: finalTitleAr, en: finalTitleEn, fr: finalTitleFr },
              institution: {
                ar: matchedHospital.name.ar,
                en: matchedHospital.name.en,
                fr: matchedHospital.name.fr || matchedHospital.name.en,
              },
            },
          ];

    const validVideoUrl = videoUrl.trim();
    const docVideos = validVideoUrl
      ? [
          {
            id: `v-${Date.now()}`,
            title: {
              ar: videoTitleAr.trim() || `شرح ${finalNameAr}`,
              en: videoTitleEn.trim() || `Clinical Explanation by ${finalNameEn}`,
              fr: `Présentation clinique par ${finalNameFr}`,
            },
            url: validVideoUrl,
          },
        ]
      : [];

    const docPayload: Doctor = {
      id: editingDoctor ? editingDoctor.id : `doc-${Date.now()}`,
      slug: editingDoctor ? editingDoctor.slug : (finalNameEn || 'doctor').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      name: {
        ar: finalNameAr,
        en: finalNameEn,
        fr: finalNameFr,
      },
      title: {
        ar: finalTitleAr,
        en: finalTitleEn,
        fr: finalTitleFr,
      },
      specialtySlug,
      specialtyName: {
        ar: matchedTreatment.title.ar,
        en: matchedTreatment.title.en,
        fr: matchedTreatment.title.fr,
      },
      hospitalId: matchedHospital.id,
      hospitalSlug: matchedHospital.slug,
      hospital: {
        ar: matchedHospital.name.ar,
        en: matchedHospital.name.en,
        fr: matchedHospital.name.fr || matchedHospital.name.en,
      },
      experienceYears: Number(experienceYears) || 15,
      image: imageUrl,
      rating: Number(rating) || 4.9,
      reviewCount: Number(reviewCount) || 120,
      surgeriesCount: Number(surgeriesCount) || 2500,
      publicationsCount: Number(publicationsCount) || 40,
      languages: languages.length > 0 ? languages : ['العربية (مترجم)', 'English', 'Türkçe'],
      biography: {
        ar: bioAr.trim(),
        en: bioEn.trim() || bioAr.trim(),
        fr: bioFr.trim() || bioEn.trim() || bioAr.trim(),
      },
      careerHistory: assembledCareerHistory,
      areasOfExpertise: {
        ar: cleanExpertise,
        en: cleanExpertise,
        fr: cleanExpertise,
      },
      procedures: {
        ar: cleanProcedures,
        en: cleanProcedures,
        fr: cleanProcedures,
      },
      education: {
        ar: cleanEducation,
        en: cleanEducation,
        fr: cleanEducation,
      },
      memberships: {
        ar: cleanMemberships,
        en: cleanMemberships,
        fr: cleanMemberships,
      },
      technologies: {
        ar: cleanTechnologies,
        en: cleanTechnologies,
        fr: cleanTechnologies,
      },
      videoUrl: validVideoUrl || undefined,
      videoTitle: validVideoUrl
        ? {
            ar: videoTitleAr.trim() || `شرح ${nameAr}`,
            en: videoTitleEn.trim() || `Clinical Explanation by ${nameEn}`,
            fr: `Présentation clinique par ${nameEn}`,
          }
        : undefined,
      videos: docVideos,
    };

    try {
      if (editingDoctor) {
        await updateDoctor(docPayload);
        showToast(d.savedToast(docPayload.name[langKey] || docPayload.name.ar));
      } else {
        await addDoctor(docPayload);
        showToast(d.addedToast(docPayload.name[langKey] || docPayload.name.ar));
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving doctor profile.');
    }
  };

  const handleDelete = async (doc: Doctor) => {
    const docName = doc.name[langKey] || doc.name.ar;
    if (window.confirm(d.deleteConfirm(docName))) {
      await deleteDoctor(doc.id);
      showToast(d.deletedToast(docName));
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSpecialty = specialtyFilter === 'all' || doc.specialtySlug === specialtyFilter;
    if (!matchSpecialty) return false;
    if (!q) return true;
    return (
      doc.name.ar?.toLowerCase().includes(q) ||
      doc.name.en?.toLowerCase().includes(q) ||
      doc.name.fr?.toLowerCase().includes(q) ||
      doc.specialtyName?.ar?.toLowerCase().includes(q) ||
      doc.specialtyName?.en?.toLowerCase().includes(q) ||
      doc.hospital?.ar?.toLowerCase().includes(q) ||
      doc.hospital?.en?.toLowerCase().includes(q)
    );
  });

  const totalSurgeries = doctors.reduce((acc, doc) => acc + (doc.surgeriesCount || 2500), 0);

  return (
    <div dir={direction} className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 rtl:right-6 rtl:left-auto ltr:left-auto ltr:right-6 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{d.badge}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {d.pageTitle} ({doctors.length})
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {d.pageSubtitle}
          </p>
        </div>

        <button
          id="tour-add-doctor-btn"
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{d.btnAddDoctor}</span>
        </button>
      </div>

      {/* Contextual Interactive Guide Banner */}
      <ContextualSectionTip
        locale={langKey}
        title={
          langKey === 'fr'
            ? 'Guide Pratique : Gestion des Profils Médicaux & Spécialistes'
            : langKey === 'ar'
            ? 'دليل إدارة ملفات الأطباء الجراحين والتخصصات السريرية'
            : 'Interactive Guide: Surgeon Profiles & Clinical Specialties'
        }
        steps={
          langKey === 'fr'
            ? [
                {
                  title: 'Profil Chirurgical & Hôpital',
                  desc: 'Cliquez sur "+ Ajouter" ou "Modifier" pour attribuer un praticien à son hôpital partenaire accrédité.',
                  targetButtonLabel: '+ Ajouter un Médecin',
                  actionOutcome: 'Fiche médecin ouverte',
                  targetSelector: '#tour-add-doctor-btn',
                },
                {
                  title: 'Traduction Automatique',
                  desc: 'Renseignez le titre et la biographie une seule fois : l’IA traduit simultanément en AR, FR et EN.',
                  targetButtonLabel: 'Auto-Translate',
                  actionOutcome: 'Biographie synchronisée dans les 3 langues',
                  targetSelector: '#tour-doctor-search',
                },
                {
                  title: 'Parcours & Vidéos',
                  desc: 'Ajoutez les étapes de carrière, spécialités d’excellence et vidéos YouTube d’explications chirurgicales.',
                  targetButtonLabel: 'Spécialités & Vidéos',
                  actionOutcome: 'Éléments cliniques enregistrés',
                  targetSelector: '#tour-add-doctor-btn',
                },
              ]
            : langKey === 'ar'
            ? [
                {
                  title: 'الملف الجراحي والمستشفى',
                  desc: 'اضغط على "+ إضافة طبيب" أو "تعديل" لربط الجراح بالمستشفى المعتمد وتحديد تخصصه الدقيق.',
                  targetButtonLabel: '+ إضافة طبيب جراح',
                  actionOutcome: 'تم فتح ملف الطبيب',
                  targetSelector: '#tour-add-doctor-btn',
                },
                {
                  title: 'الترجمة الآلية الفورية',
                  desc: 'اكتب اللقب المهني والسيرة الذاتية لمرة واحدة، وسيقوم الذكاء الاصطناعي بمزامنتها لجميع اللغات.',
                  targetButtonLabel: 'ترجمة ذكية موحدة',
                  actionOutcome: 'تمت مزامنة النبذة لجميع اللغات',
                  targetSelector: '#tour-doctor-search',
                },
                {
                  title: 'الخبرات ومقاطع الفيديو',
                  desc: 'أضف المسار المهني الأكاديمي، اللغات المتقنة، ومقاطع الفيديو التوضيحية للجراحات.',
                  targetButtonLabel: 'المسار والوسائط',
                  actionOutcome: 'تم حفظ السجل الطبي بنجاح',
                  targetSelector: '#tour-add-doctor-btn',
                },
              ]
            : [
                {
                  title: 'Surgeon Profile & Hospital',
                  desc: 'Click "+ Add Consultant Doctor" or "Edit" to assign a practitioner to an accredited hospital partner.',
                  targetButtonLabel: '+ Add Consultant Doctor',
                  actionOutcome: 'Doctor profile wizard opened',
                  targetSelector: '#tour-add-doctor-btn',
                },
                {
                  title: 'Smart 1-Click Translation',
                  desc: 'Enter clinical title and biography once: AI synchronizes AR, FR, and EN simultaneously.',
                  targetButtonLabel: 'Auto-Translate',
                  actionOutcome: 'Biography synced to all 3 languages',
                  targetSelector: '#tour-doctor-search',
                },
                {
                  title: 'Career Timeline & Media',
                  desc: 'Add clinical milestones, surgical expertise areas, and patient explanation video links.',
                  targetButtonLabel: 'Expertise & Video',
                  actionOutcome: 'Clinical assets saved',
                  targetSelector: '#tour-add-doctor-btn',
                },
              ]
        }
      />

      {/* Executive 4-Metric Grid (Fluid auto-fit) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statDoctors}</span>
            <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{doctors.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statExperience}</span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">~18 {d.experienceYears(0).replace('+0 ', '')}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statSurgeries}</span>
            <Stethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">+{totalSurgeries.toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statSpecialties}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{treatments.length}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div id="tour-doctor-search" className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={d.searchPlaceholder}
            className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 rtl:pr-11 rtl:pl-4 ltr:pl-11 ltr:pr-4 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0097FB]/20 focus:border-[#0097FB] dark:focus:border-sky-500 transition-all shadow-2xs"
          />
        </div>

        {/* Specialty Filter Dropdown */}
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0097FB]/20 focus:border-[#0097FB] dark:focus:border-sky-500 cursor-pointer shadow-2xs"
        >
          <option value="all" className="dark:bg-slate-900">
            {d.allSpecialties} ({doctors.length})
          </option>
          {treatments.map((t) => {
            const count = doctors.filter((doc) => doc.specialtySlug === t.slug).length;
            const title = t.title[langKey] || t.title.ar;
            return (
              <option key={t.slug} value={t.slug} className="dark:bg-slate-900">
                {title} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Doctors Grid / Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 p-12 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-slate-400 dark:text-slate-500">
          <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{d.noResultsTitle}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">{d.noResultsSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          {filteredDoctors.map((doc) => {
            const hasCustomVideo = Boolean(
              doc.videoUrl &&
                !doc.videoUrl.includes('a3ICNMQW7Ok') &&
                !doc.videoUrl.includes('5qap5aO4i9A')
            );
            const careerCount = doc.careerHistory?.length || 0;
            const expertiseCount = doc.areasOfExpertise?.ar?.length || 0;
            const eduCount = doc.education?.ar?.length || 0;

            const name = doc.name[langKey] || doc.name.ar;
            const title = doc.title[langKey] || doc.title.ar;
            const specialtyName = doc.specialtyName[langKey] || doc.specialtyName.ar;
            const hospitalName = doc.hospital[langKey] || doc.hospital.ar;

            const isDeepLinked = targetDoctorId && (doc.id === targetDoctorId || doc.slug === targetDoctorId);

            return (
              <div
                key={doc.id}
                className={`bg-white dark:bg-slate-900/90 rounded-3xl border p-5 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group ${
                  isDeepLinked ? 'ring-2 ring-sky-500 border-sky-500/50' : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Header: Photo + Identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-2xs">
                      <img
                        src={doc.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1 right-1 rtl:right-1 rtl:left-auto ltr:left-1 ltr:right-auto bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md">
                          {specialtyName}
                        </span>
                        {hasCustomVideo ? (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Video className="w-2.5 h-2.5" />
                            <span>{d.hasVideo}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {d.noVideo}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                        {name}
                      </h3>
                      {langKey === 'ar' && doc.name.en ? (
                        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate mt-0.5 dir-ltr text-end">
                          {doc.name.en}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Subtitle / Title */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 mb-3 bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {title}
                  </p>

                  {/* Partner Hospital */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold mb-3">
                    <Building2 className="w-3.5 h-3.5 text-[#0097FB] shrink-0" />
                    <span className="truncate">{hospitalName}</span>
                  </div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">{d.expField}</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{d.experienceYears(doc.experienceYears)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">{d.surgeriesField}</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+{doc.surgeriesCount || 2500}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">{d.pubsField}</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">+{doc.publicationsCount || 40}</span>
                    </div>
                  </div>

                  {/* CV Completeness badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{careerCount}</span>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{expertiseCount}</span>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-sky-500" />
                      <span>{eduCount}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                  <Link
                    href={`/doctors/${doc.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-[#0097FB] dark:hover:text-sky-400 px-3 py-2 rounded-xl hover:bg-[#EAF6FF] dark:hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{d.btnPreview}</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(doc)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{d.btnEdit}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                      title={d.btnDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: FULL DOCTOR CV MANAGEMENT STUDIO (6 TABS)
      ══════════════════════════════════════════════════════════════ */}
      <ModalPortal isOpen={modalOpen}>
        <div dir={direction} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200 overflow-hidden">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[26px] sm:rounded-[30px] max-w-4xl w-full max-h-[86vh] flex flex-col shadow-2xl shadow-slate-900/15 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            {/* Modal Top Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 flex items-center justify-center ring-4 ring-sky-50 dark:ring-sky-950/40">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {editingDoctor
                      ? d.modalEditTitle(editingDoctor.name[langKey] || editingDoctor.name.en || editingDoctor.name.ar || nameAr)
                      : d.modalAddTitle}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {d.modalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'basic'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{d.tabBasic}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bio')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'bio'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{d.tabBio}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('career')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'career'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{d.tabCareer} ({careerList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('expertise')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'expertise'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{d.tabExpertise} ({expertiseList.length + proceduresList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('education')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'education'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{d.tabEducation}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'video'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{d.tabVideo}</span>
                {videoUrl && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </button>
            </div>

            {/* Modal Body / Tab Content with pb-12 to prevent bottom scroll clipping */}
            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6 pb-12 space-y-5">
                {/* TAB 1: BASIC INFO & HOSPITAL */}
                {activeTab === 'basic' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Doctor Full Name (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? 'Nom Complet du Médecin *' : langKey === 'en' ? 'Doctor Full Name *' : 'اسم الطبيب الجراح *'}
                      value={{ ar: nameAr, en: nameEn, fr: nameFr }}
                      activeLocale={langKey as any}
                      placeholder={langKey === 'fr' ? 'ex: Pr Dr Ahmet Ozkara' : langKey === 'en' ? 'e.g. Prof. Dr. Ahmet Ozkara' : 'مثال: أ. د. أحمد أوزكارا'}
                      onChange={(val) => {
                        setNameAr(val.ar || '');
                        setNameEn(val.en || '');
                        setNameFr(val.fr || '');
                      }}
                    />

                    {/* Clinical Specialty Title (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? 'Titre Médical & Spécialité Principale *' : langKey === 'en' ? 'Clinical Title & Primary Specialty *' : 'اللقب الطبي والتخصص الدقيق *'}
                      value={{ ar: titleAr, en: titleEn, fr: titleFr }}
                      activeLocale={langKey as any}
                      placeholder={langKey === 'fr' ? 'ex: Professeur de Chirurgie Cardiovasculaire' : langKey === 'en' ? 'e.g. Professor of Cardiovascular Surgery' : 'مثال: استشاري جراحة القلب والأوعية الدموية'}
                      onChange={(val) => {
                        setTitleAr(val.ar || '');
                        setTitleEn(val.en || '');
                        setTitleFr(val.fr || '');
                      }}
                    />

                  {/* Specialty & Hospital Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CustomSelect
                        label={d.fieldSpecialty}
                        value={specialtySlug}
                        onChange={setSpecialtySlug}
                        options={treatments.map((t) => ({
                          value: t.slug,
                          label: t.title[langKey] || t.title.ar,
                          subLabel: t.title.en,
                        }))}
                      />
                    </div>
                    <div>
                      <CustomSelect
                        label={d.fieldHospital}
                        value={hospitalId}
                        onChange={(val) => {
                          setHospitalId(val);
                          const h = hospitals.find((item) => item.id === val);
                          if (h) setHospitalAr(h.name[langKey] || h.name.ar);
                        }}
                        options={hospitals.map((h) => ({
                          value: h.id,
                          label: h.name[langKey] || h.name.ar,
                          subLabel: `${h.city[langKey] || h.city.ar} • ${h.name.en}`,
                        }))}
                      />
                    </div>
                  </div>

                  {/* Clinical Metrics */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {d.metricsTitle}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {d.expField}
                        </span>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {d.ratingField}
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {d.reviewsField}
                        </span>
                        <input
                          type="number"
                          value={reviewCount}
                          onChange={(e) => setReviewCount(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {d.surgeriesField}
                        </span>
                        <input
                          type="number"
                          value={surgeriesCount}
                          onChange={(e) => setSurgeriesCount(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          {d.pubsField}
                        </span>
                        <input
                          type="number"
                          value={publicationsCount}
                          onChange={(e) => setPublicationsCount(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Languages Spoken - Localized Pills based on active language */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Languages className="w-4 h-4 text-[#0097FB]" />
                      <span>{d.fieldLanguages}</span>
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {(DEFAULT_LANGUAGES_MAP[langKey] || DEFAULT_LANGUAGES_MAP.ar).map((lang) => {
                        const isSelected = languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#0097FB] text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0097FB] dark:hover:border-sky-500'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={customLanguageInput}
                        onChange={(e) => setCustomLanguageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomLanguage();
                          }
                        }}
                        placeholder={d.fieldCustomLangPlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomLanguage}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        {d.btnAddCustomLang}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {languages.map((l) => (
                        <span
                          key={l}
                          className="bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-sky-800 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        >
                          <span>{l}</span>
                          <button
                            type="button"
                            onClick={() => toggleLanguage(l)}
                            className="text-sky-500 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Profile Image */}
                  <ImageUploadField
                    label={d.fieldImage}
                    value={imageUrl}
                    onChange={setImageUrl}
                    folder="doctors"
                    aspectRatio="portrait"
                    helperText={d.fieldImageHelper}
                  />
                </div>
              )}

              {/* TAB 2: COMPREHENSIVE BIOGRAPHY WITH SMART SINGLE-INPUT AUTO-TRANSLATE */}
              {activeTab === 'bio' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <SmartTranslatableField
                    label={langKey === 'fr' ? 'Biographie Clinique & Parcours d’Excellence' : langKey === 'en' ? 'Clinical Biography & Career Summary' : 'النبذة المهنية والمسار السريري'}
                    value={{ ar: bioAr, en: bioEn, fr: bioFr }}
                    activeLocale={langKey as any}
                    multiline
                    placeholder={langKey === 'fr' ? 'Rédigez la biographie du médecin ici (titres, réalisations, leadership chirurgical)...' : langKey === 'en' ? 'Write the doctor biography here...' : 'اكتب السيرة الذاتية المهنية للطبيب هنا...'}
                    onChange={(val) => {
                      setBioAr(val.ar || '');
                      setBioEn(val.en || '');
                      setBioFr(val.fr || '');
                    }}
                  />
                </div>
              )}

              {/* TAB 3: CAREER HISTORY TIMELINE */}
              {activeTab === 'career' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {d.careerHeader}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {d.careerSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addCareerItem}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{d.btnAddCareer}</span>
                    </button>
                  </div>

                  {careerList.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <Briefcase className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{d.careerEmpty}</p>
                      <button
                        type="button"
                        onClick={addCareerItem}
                        className="mt-3 text-xs text-[#0097FB] dark:text-sky-400 font-bold hover:underline cursor-pointer"
                      >
                        {d.btnAddCareer}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {careerList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg">
                              {d.careerStation(idx + 1)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCareerItem(idx)}
                              className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                {d.fieldPeriod}
                              </label>
                              <input
                                type="text"
                                value={item.period}
                                onChange={(e) => updateCareerItem(idx, 'period', e.target.value)}
                                placeholder="2018 - 2024"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0097FB] dark:focus:border-sky-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                {d.fieldRoleAr}
                              </label>
                              <input
                                type="text"
                                value={item.roleAr}
                                onChange={(e) => updateCareerItem(idx, 'roleAr', e.target.value)}
                                placeholder="رئيس قسم جراحة القلب"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                {d.fieldInstAr}
                              </label>
                              <input
                                type="text"
                                value={item.instAr}
                                onChange={(e) => updateCareerItem(idx, 'instAr', e.target.value)}
                                placeholder="مستشفى أجيبادم ألتونيزاده"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: EXPERTISE & PROCEDURES */}
              {activeTab === 'expertise' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{d.expertiseTitle} ({expertiseList.length})</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newExpertiseInput}
                        onChange={(e) => setNewExpertiseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTagItem(expertiseList, setExpertiseList, newExpertiseInput, setNewExpertiseInput);
                          }
                        }}
                        placeholder={d.expertisePlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagItem(expertiseList, setExpertiseList, newExpertiseInput, setNewExpertiseInput)
                        }
                        className="px-4 py-2 bg-[#0097FB] hover:bg-[#0082d6] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {d.btnAddTag}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {expertiseList.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeTagItem(expertiseList, setExpertiseList, idx)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-[#0097FB]" />
                      <span>{d.proceduresTitle} ({proceduresList.length})</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newProcedureInput}
                        onChange={(e) => setNewProcedureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTagItem(proceduresList, setProceduresList, newProcedureInput, setNewProcedureInput);
                          }
                        }}
                        placeholder={d.proceduresPlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagItem(proceduresList, setProceduresList, newProcedureInput, setNewProcedureInput)
                        }
                        className="px-4 py-2 bg-[#0097FB] hover:bg-[#0082d6] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {d.btnAddTag}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {proceduresList.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeTagItem(proceduresList, setProceduresList, idx)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: EDUCATION, MEMBERSHIPS & TECH */}
              {activeTab === 'education' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-sky-500" />
                      <span>{d.eduTitle} ({educationList.length})</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newEducationInput}
                        onChange={(e) => setNewEducationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTagItem(educationList, setEducationList, newEducationInput, setNewEducationInput);
                          }
                        }}
                        placeholder={d.eduPlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagItem(educationList, setEducationList, newEducationInput, setNewEducationInput)
                        }
                        className="px-4 py-2 bg-[#0097FB] hover:bg-[#0082d6] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {d.btnAddTag}
                      </button>
                    </div>

                    <div className="space-y-2 pt-1">
                      {educationList.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold p-2.5 rounded-xl shadow-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-sky-500" />
                            <span>{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTagItem(educationList, setEducationList, idx)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{d.membershipsTitle} ({membershipsList.length})</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMembershipInput}
                        onChange={(e) => setNewMembershipInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTagItem(membershipsList, setMembershipsList, newMembershipInput, setNewMembershipInput);
                          }
                        }}
                        placeholder={d.membershipsPlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagItem(membershipsList, setMembershipsList, newMembershipInput, setNewMembershipInput)
                        }
                        className="px-4 py-2 bg-[#0097FB] hover:bg-[#0082d6] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {d.btnAddTag}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {membershipsList.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeTagItem(membershipsList, setMembershipsList, idx)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-500" />
                      <span>{d.techTitle} ({technologiesList.length})</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTechnologyInput}
                        onChange={(e) => setNewTechnologyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTagItem(technologiesList, setTechnologiesList, newTechnologyInput, setNewTechnologyInput);
                          }
                        }}
                        placeholder={d.techPlaceholder}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#0097FB] dark:focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagItem(technologiesList, setTechnologiesList, newTechnologyInput, setNewTechnologyInput)
                        }
                        className="px-4 py-2 bg-[#0097FB] hover:bg-[#0082d6] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {d.btnAddTag}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {technologiesList.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2"
                        >
                          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeTagItem(technologiesList, setTechnologiesList, idx)}
                            className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: DOCTOR VIDEO */}
              {activeTab === 'video' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#0097FB] shrink-0 mt-0.5" />
                    <div className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
                      <span className="font-bold">{d.videoNoteTitle}</span>{' '}
                      {d.videoNoteDesc}
                    </div>
                  </div>

                  <VideoUploadField
                    label={d.fieldVideoUpload}
                    videoUrl={videoUrl}
                    videoTitle={videoTitleAr}
                    onVideoUrlChange={setVideoUrl}
                    onVideoTitleChange={setVideoTitleAr}
                    helperText={d.fieldVideoHelper}
                  />

                  {videoUrl && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {d.fieldVideoTitleEn}
                      </label>
                      <input
                        type="text"
                        value={videoTitleEn}
                        onChange={(e) => setVideoTitleEn(e.target.value)}
                        placeholder="Clinical Explanation Video"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none dir-ltr"
                      />
                    </div>
                  )}
                </div>
              )}

              </div>

              {/* Modal Footer Controls - Sticky & Always Visible */}
              <div className="sticky bottom-0 z-20 p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  {activeTab === 'basic' && d.stepIndicator(1)}
                  {activeTab === 'bio' && d.stepIndicator(2)}
                  {activeTab === 'career' && d.stepIndicator(3)}
                  {activeTab === 'expertise' && d.stepIndicator(4)}
                  {activeTab === 'education' && d.stepIndicator(5)}
                  {activeTab === 'video' && d.stepIndicator(6)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {d.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs shadow-sky-600/20 transition-all cursor-pointer"
                  >
                    {d.saveBtn}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}

export default function AdminDoctorsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-semibold">Loading Doctors Directory...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
