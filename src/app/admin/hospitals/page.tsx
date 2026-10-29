'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { HospitalPartner } from '@/data/hospitals';
import { Doctor } from '@/data/doctors';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  UserPlus,
  Image as ImageIcon,
  Sparkles,
  Bed,
  Activity,
  Award,
  Calendar,
  ExternalLink,
  SlidersHorizontal,
  Stethoscope,
  Video,
  Upload,
} from 'lucide-react';
import { uploadImageFile } from '@/lib/supabase';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { VideoUploadField } from '@/components/admin/VideoUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';
import { ModalPortal } from '@/components/admin/ModalPortal';
import { SmartTranslatableField } from '@/components/admin/SingleInputAutoTranslator';
import { ContextualSectionTip } from '@/components/admin/AdminOnboardingGuide';

const hospitalsDict = {
  ar: {
    badge: 'نظام إدارة شبكة المستشفيات والمراكز المعتمدة',
    pageTitle: 'المستشفيات الشريكة والأطباء التابعون',
    pageSubtitle: 'تحكم كامل في بيانات المستشفيات، المعارض المصورة، وتعيين أو إنشاء الأطباء الاستشاريين لكل صرح طبي.',
    btnAddHospital: 'إضافة مستشفى شريك جديد',
    statHospitals: 'المستشفيات الشريكة',
    statHospitalsSub: 'معتمدة رسمياً في المنصة',
    statDoctors: 'الأطباء المعينون بالمستشفيات',
    statDoctorsSub: 'طبيباً استشارياً وجراحاً',
    statBeds: 'الطاقة الاستيعابية للأسرّة',
    statBedsSub: 'سرير تنويم متطور',
    statIcu: 'أسرّة العناية المركزة (ICU)',
    statIcuSub: 'رعاية حرجة فائقة',
    statJci: 'الاعتمادات الدولية (JCI)',
    statJciSub: 'أعلى معايير جودة الرعاية',
    searchPlaceholder: 'ابحث عن مستشفى بالاسم، المدينة، التخصص، أو التقنية (مثل: دافنشي، ألتونيزاده)...',
    clearSearch: 'مسح البحث',
    filterAll: 'كافة المستشفيات',
    filterFeatured: 'المراكز البارزة',
    filterEurope: 'إسطنبول (الجانب الأوروبي)',
    filterAsia: 'إسطنبول (الجانب الآسيوي)',
    filterAnkara: 'أنقرة',
    filterKocaeli: 'قوجه إيلي',
    noHospitals: 'لا توجد مستشفيات مطابقة لمعايير البحث الحالية.',
    noHospitalsSub: 'جرّب تعديل كلمات البحث أو اختيار منطقة جغرافية أخرى.',
    cardSpecialtiesCount: (n: number) => `+${n} تخصص`,
    cardBedsCount: 'سرير تنويم',
    cardIcuCount: 'عناية مركزة',
    cardOrCount: 'غرفة عمليات',
    cardEstYear: (y: number) => `تأسس عام ${y}`,
    btnManageDoctors: 'الأطباء المنتسبون',
    btnEditDetails: 'تعديل البيانات',
    btnDelete: 'حذف',
    deleteConfirm: (name: string) => `هل أنت متأكد من حذف مستشفى "${name}" نهائياً من النظام؟\nسيتم فك ارتباط الأطباء التابعين له.`,
    toastSaved: (name: string) => `تم حفظ وتحديث بيانات مستشفى "${name}" بنجاح!`,
    toastAdded: (name: string) => `تمت إضافة مستشفى "${name}" إلى شبكة الشركاء بنجاح!`,
    toastDeleted: 'تم حذف المستشفى بنجاح.',
    toastAssigned: (docName: string, hospName: string) => `تم تعيين الطبيب (${docName}) في ${hospName} بنجاح!`,
    modalAddTitle: 'إضافة مستشفى شريك جديد إلى الشبكة',
    modalEditTitle: (name: string) => `تعديل صرح طبي: ${name}`,
    modalSubtitle: 'إدارة الاعتمادات الدولية، الطاقة الاستيعابية، التقنيات الجراحية، ومعرض الصور.',
    tabInfo: '1. البيانات العامة والاعتمادات',
    tabImages: '2. الصور والمعرض',
    tabCapacities: '3. القدرات والتكنولوجيا',
    tabDoctors: '4. الأطباء الشركاء',
    fieldNameAr: 'اسم المستشفى بالعربية *',
    fieldNameEn: 'اسم المستشفى بالإنجليزية *',
    fieldNameFr: 'اسم المستشفى بالفرنسية *',
    fieldTypeAr: 'نوع الصرح الطبي (عربي) *',
    fieldTypeEn: 'نوع الصرح الطبي (إنجليزي) *',
    fieldTypeFr: 'نوع الصرح الطبي (فرنسي) *',
    fieldCityAr: 'المدينة والمنطقة (عربي) *',
    fieldCityEn: 'المدينة والمنطقة (إنجليزي) *',
    fieldCityFr: 'المدينة والمنطقة (فرنسي) *',
    fieldCityCategory: 'التقسيم الجغرافي *',
    fieldAddressAr: 'العنوان التفصيلي (عربي)',
    fieldAddressEn: 'العنوان التفصيلي (إنجليزي)',
    fieldAccreditation: 'الاعتماد ونصوص الجودة',
    fieldBadge: 'شارة الاعتماد الأبرز',
    fieldSpecialtiesCount: 'عدد الأقسام والتخصصات الطبية',
    fieldDescAr: 'نبذة عن المستشفى والتميز الطبي (عربي) *',
    fieldDescEn: 'نبذة عن المستشفى والتميز الطبي (إنجليزي) *',
    fieldDescFr: 'نبذة عن المستشفى والتميز الطبي (فرنسي) *',
    fieldImage: 'الصورة الرئيسية للمستشفى *',
    fieldImageHelper: 'صورة الواجهة الرئيسية أو مدخل المجمع الطبي.',
    fieldGallery: 'معرض صور الصرح الطبي',
    fieldGalleryHelper: 'أضف صور غرف العمليات، أجنحة التنويم، والاستقبال.',
    fieldBeds: 'عدد الأسرّة الإجمالي',
    fieldIcu: 'أسرّة العناية المركزة',
    fieldOperatingRooms: 'غرف العمليات الذكية',
    fieldYear: 'سنة التأسيس والافتتاح',
    fieldTech: 'التقنيات الجراحية والأجهزة الطبية المتطورة (مفصولة بفواصل)',
    fieldSpecialtiesList: 'الأقسام الطبية والجراحية المعتمدة في هذا المستشفى',
    saveBtn: 'حفظ واعتماد بيانات المستشفى',
    cancelBtn: 'إلغاء',
  },
  en: {
    badge: 'Accredited Hospital Network & Partner Centers',
    pageTitle: 'Partner Hospitals & Medical Faculty',
    pageSubtitle: 'Manage hospital partner directories, photo galleries, facilities, and affiliated consultant doctors.',
    btnAddHospital: 'Add Partner Hospital',
    statHospitals: 'Partner Hospitals',
    statHospitalsSub: 'Officially accredited network',
    statDoctors: 'Affiliated Faculty',
    statDoctorsSub: 'Consultants & surgeons',
    statBeds: 'Total Bed Capacity',
    statBedsSub: 'Modern inpatient beds',
    statIcu: 'Intensive Care Beds (ICU)',
    statIcuSub: 'Critical care units',
    statJci: 'JCI Accreditations',
    statJciSub: 'Highest patient safety',
    searchPlaceholder: 'Search by hospital name, city, specialty, or tech (e.g. Da Vinci, Altunizade)...',
    clearSearch: 'Clear',
    filterAll: 'All Hospitals',
    filterFeatured: 'Featured Centers',
    filterEurope: 'Istanbul (European Side)',
    filterAsia: 'Istanbul (Asian Side)',
    filterAnkara: 'Ankara',
    filterKocaeli: 'Kocaeli',
    noHospitals: 'No hospitals match your search criteria.',
    noHospitalsSub: 'Try adjusting your search terms or select another region.',
    cardSpecialtiesCount: (n: number) => `+${n} Specialties`,
    cardBedsCount: 'Inpatient Beds',
    cardIcuCount: 'ICU Beds',
    cardOrCount: 'Operating Theatres',
    cardEstYear: (y: number) => `Est. ${y}`,
    btnManageDoctors: 'Affiliated Doctors',
    btnEditDetails: 'Edit Details',
    btnDelete: 'Delete',
    deleteConfirm: (name: string) => `Are you sure you want to permanently delete hospital "${name}"?\nAffiliated doctors will be unlinked.`,
    toastSaved: (name: string) => `Hospital "${name}" profile saved successfully!`,
    toastAdded: (name: string) => `Hospital "${name}" added to partner network successfully!`,
    toastDeleted: 'Hospital removed successfully.',
    toastAssigned: (docName: string, hospName: string) => `Doctor (${docName}) assigned to ${hospName} successfully!`,
    modalAddTitle: 'Add New Partner Hospital to Network',
    modalEditTitle: (name: string) => `Edit Hospital Profile: ${name}`,
    modalSubtitle: 'Configure international accreditations, inpatient capacities, robotic tech, and photo galleries.',
    tabInfo: '1. General Info & Accreditations',
    tabImages: '2. Images & Gallery',
    tabCapacities: '3. Capacity & Medical Tech',
    tabDoctors: '4. Partner Doctors',
    fieldNameAr: 'Hospital Name in Arabic *',
    fieldNameEn: 'Hospital Name in English *',
    fieldNameFr: 'Hospital Name in French *',
    fieldTypeAr: 'Facility Classification (Arabic) *',
    fieldTypeEn: 'Facility Classification (English) *',
    fieldTypeFr: 'Facility Classification (French) *',
    fieldCityAr: 'City & District (Arabic) *',
    fieldCityEn: 'City & District (English) *',
    fieldCityFr: 'City & District (French) *',
    fieldCityCategory: 'Geographic Region *',
    fieldAddressAr: 'Detailed Address (Arabic)',
    fieldAddressEn: 'Detailed Address (English)',
    fieldAccreditation: 'Accreditation Standards',
    fieldBadge: 'Primary Quality Badge',
    fieldSpecialtiesCount: 'Specialties Count',
    fieldDescAr: 'Hospital Overview & Clinical Excellence (Arabic) *',
    fieldDescEn: 'Hospital Overview & Clinical Excellence (English) *',
    fieldDescFr: 'Hospital Overview & Clinical Excellence (French) *',
    fieldImage: 'Main Hospital Building Photo *',
    fieldImageHelper: 'Exterior facade or modern reception entrance image.',
    fieldGallery: 'Hospital Photo Gallery',
    fieldGalleryHelper: 'Add operating theatres, suites, and medical facilities.',
    fieldBeds: 'Total Inpatient Beds',
    fieldIcu: 'Intensive Care (ICU) Beds',
    fieldOperatingRooms: 'Smart Operating Theatres',
    fieldYear: 'Established Year',
    fieldTech: 'Surgical Robotics & High-End Tech (comma-separated)',
    fieldSpecialtiesList: 'Accredited Clinical Departments in this Center',
    saveBtn: 'Save & Publish Hospital Profile',
    cancelBtn: 'Cancel',
  },
  fr: {
    badge: 'Réseau d’Hôpitaux Partenaires & Centres Agréés',
    pageTitle: 'Hôpitaux Partenaires & Corps Médical',
    pageSubtitle: 'Supervisez les établissements hospitaliers, les galeries de blocs opératoires et les praticiens consultants rattachés.',
    btnAddHospital: 'Ajouter un Hôpital Partenaire',
    statHospitals: 'Hôpitaux Partenaires',
    statHospitalsSub: 'Réseau agréé de référence',
    statDoctors: 'Médecins Rattachés',
    statDoctorsSub: 'Praticiens et chirurgiens',
    statBeds: 'Capacité Litière Totale',
    statBedsSub: 'Lits d’hospitalisation modernes',
    statIcu: 'Soins Intensifs (USI)',
    statIcuSub: 'Lits de réanimation de pointe',
    statJci: 'Accréditations JCI',
    statJciSub: 'Normes de sécurité optimales',
    searchPlaceholder: 'Rechercher hôpital par nom, ville, spécialité ou équipement (ex: Da Vinci, Altunizade)...',
    clearSearch: 'Effacer',
    filterAll: 'Tous les Hôpitaux',
    filterFeatured: 'Centres de Référence',
    filterEurope: 'Istanbul (Rive Européenne)',
    filterAsia: 'Istanbul (Rive Asiatique)',
    filterAnkara: 'Ankara',
    filterKocaeli: 'Kocaeli',
    noHospitals: 'Aucun hôpital ne correspond à votre recherche.',
    noHospitalsSub: 'Modifiez vos critères ou sélectionnez une autre zone géographique.',
    cardSpecialtiesCount: (n: number) => `+${n} Spécialités`,
    cardBedsCount: 'Lits d’Accueil',
    cardIcuCount: 'Lits USI',
    cardOrCount: 'Blocs Opératoires',
    cardEstYear: (y: number) => `Inauguré en ${y}`,
    btnManageDoctors: 'Médecins Associés',
    btnEditDetails: 'Modifier la Fiche',
    btnDelete: 'Supprimer',
    deleteConfirm: (name: string) => `Êtes-vous sûr de vouloir supprimer définitivement l’hôpital "${name}" ?\nLes praticiens associés seront dissociés.`,
    toastSaved: (name: string) => `Fiche de l’hôpital "${name}" enregistrée avec succès !`,
    toastAdded: (name: string) => `L’hôpital "${name}" a été ajouté au réseau de soins !`,
    toastDeleted: 'Établissement supprimé avec succès.',
    toastAssigned: (docName: string, hospName: string) => `Le docteur (${docName}) a été assigné à ${hospName} !`,
    modalAddTitle: 'Ajouter un Hôpital Partenaire au Réseau',
    modalEditTitle: (name: string) => `Modifier l’Établissement : ${name}`,
    modalSubtitle: 'Gestion des accréditations internationales, capacités d’accueil et plateaux techniques.',
    tabInfo: '1. Informations Générales & Agréments',
    tabImages: '2. Photos & Galerie',
    tabCapacities: '3. Capacités & Équipements',
    tabDoctors: '4. Praticiens Partenaires',
    fieldNameAr: 'Nom de l’Hôpital en Arabe *',
    fieldNameEn: 'Nom de l’Hôpital en Anglais *',
    fieldNameFr: 'Nom de l’Hôpital en Français *',
    fieldTypeAr: 'Classification de l’Établissement (Arabe) *',
    fieldTypeEn: 'Classification de l’Établissement (Anglais) *',
    fieldTypeFr: 'Classification de l’Établissement (Français) *',
    fieldCityAr: 'Ville & Secteur (Arabe) *',
    fieldCityEn: 'Ville & Secteur (Anglais) *',
    fieldCityFr: 'Ville & Secteur (Français) *',
    fieldCityCategory: 'Zone Géographique *',
    fieldAddressAr: 'Adresse Complète (Arabe)',
    fieldAddressEn: 'Adresse Complète (Anglais)',
    fieldAccreditation: 'Normes & Accréditations',
    fieldBadge: 'Badge de Qualité',
    fieldSpecialtiesCount: 'Nombre de Spécialités',
    fieldDescAr: 'Présentation & Excellence Clinique (Arabe) *',
    fieldDescEn: 'Présentation & Excellence Clinique (Anglais) *',
    fieldDescFr: 'Présentation & Excellence Clinique (Français) *',
    fieldImage: 'Photo Principale de l’Établissement *',
    fieldImageHelper: 'Façade extérieure ou hall d’accueil principal.',
    fieldGallery: 'Galerie de Photos',
    fieldGalleryHelper: 'Ajoutez les blocs opératoires, chambres et unités de soins.',
    fieldBeds: 'Capacité Totale de Lits',
    fieldIcu: 'Lits de Soins Intensifs (USI)',
    fieldOperatingRooms: 'Salles d’Opération Intégrées',
    fieldYear: 'Année d’Inauguration',
    fieldTech: 'Robots Chirurgicaux & Technologies de Pointe (séparés par virgules)',
    fieldSpecialtiesList: 'Services Cliniques et Pôles d’Excellence Agréés',
    saveBtn: 'Enregistrer et Publier l’Établissement',
    cancelBtn: 'Annuler',
  },
};

function HospitalsContent() {
  const {
    hospitals,
    doctors,
    treatments,
    addHospital,
    updateHospital,
    deleteHospital,
    addDoctor,
  } = useData();
  const { language, direction } = useLanguage();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = hospitalsDict[langKey];
  const searchParams = useSearchParams();
  const targetHospitalId = searchParams?.get('edit') || searchParams?.get('id');

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Hospital Modal state
  const [hospitalModalOpen, setHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalPartner | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'capacities' | 'doctors'>('info');

  // Hospital Form fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [typeAr, setTypeAr] = useState('');
  const [typeEn, setTypeEn] = useState('');
  const [typeFr, setTypeFr] = useState('');
  const [cityAr, setCityAr] = useState('');
  const [cityEn, setCityEn] = useState('');
  const [cityFr, setCityFr] = useState('');
  const [cityCategory, setCityCategory] = useState<'istanbul-asia' | 'istanbul-europe' | 'ankara' | 'kocaeli'>('istanbul-europe');
  const [addressAr, setAddressAr] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [accreditation, setAccreditation] = useState('JCI Accredited & ISO 9001');
  const [accreditationBadge, setAccreditationBadge] = useState<'JCI' | 'LEED' | 'ISO' | 'ACADEMIC'>('JCI');
  const [specialtiesCount, setSpecialtiesCount] = useState(32);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop');
  const [gallery, setGallery] = useState<string[]>([]);
  const [featured, setFeatured] = useState(true);
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [bedsCount, setBedsCount] = useState(300);
  const [icuBedsCount, setIcuBedsCount] = useState(60);
  const [operatingRoomsCount, setOperatingRoomsCount] = useState(14);
  const [establishedYear, setEstablishedYear] = useState(2015);
  const [technologiesRaw, setTechnologiesRaw] = useState('روبوت دافنشي Xi, رنين مغناطيسي 3 تسلا, غرف عمليات هجينة');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['cardiac-surgery', 'oncology', 'neurosurgery', 'orthopedics']);

  // Affiliated Doctors Drawer state
  const [activeHospitalForDoctors, setActiveHospitalForDoctors] = useState<HospitalPartner | null>(null);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [assignDoctorId, setAssignDoctorId] = useState('');

  // Quick Doctor Creation Modal for Hospital
  const [docNameAr, setDocNameAr] = useState('');
  const [docNameEn, setDocNameEn] = useState('');
  const [docTitleAr, setDocTitleAr] = useState('استشاري جراحة دقيقة وأورام');
  const [docTitleEn, setDocTitleEn] = useState('Consultant Specialist Surgeon');
  const [docSpecialtySlug, setDocSpecialtySlug] = useState(treatments[0]?.slug || 'cardiac-surgery');
  const [docExpYears, setDocExpYears] = useState(18);
  const [docRating, setDocRating] = useState(4.9);
  const [docSurgeries, setDocSurgeries] = useState(3000);
  const [docPublications, setDocPublications] = useState(45);
  const [docImage, setDocImage] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop');
  const [docVideoUrl, setDocVideoUrl] = useState('');
  const [docVideoTitleAr, setDocVideoTitleAr] = useState('');
  const [docBioAr, setDocBioAr] = useState('استشاري معتمد في تركيا يتمتع بسجل حافل بالعمليات الناجحة في هذا المستشفى.');
  const [docBioEn, setDocBioEn] = useState('Board-certified specialist with extensive surgical experience in this hospital.');
  const [docExpertiseRaw, setDocExpertiseRaw] = useState('جراحة دقيقة, تشخيص متقدم, رعاية سريرية فائقة');

  // Preview Image Lightbox state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Metrics
  const totalHospitals = hospitals.length;
  const totalAffiliatedDoctors = doctors.filter((doc) => doc.hospitalId).length;
  const totalBeds = hospitals.reduce((acc, h) => acc + (h.bedsCount || 0), 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + (h.icuBedsCount || 0), 0);
  const jciAccreditedCount = hospitals.filter((h) => h.accreditationBadge === 'JCI' || h.accreditation?.includes('JCI')).length;

  // Open Add Hospital
  const openAddModal = () => {
    setEditingHospital(null);
    setActiveTab('info');
    setNameAr('');
    setNameEn('');
    setNameFr('');
    setTypeAr('مجمع مستشفيات تخصصية وجامعية رائدة');
    setTypeEn('Flagship Academic & Surgical Center');
    setTypeFr('Centre Hospitalier Universitaire de Référence');
    setCityAr('إسطنبول (الجانب الأوروبي)');
    setCityEn('Istanbul (European Side)');
    setCityFr('Istanbul (Rive Européenne)');
    setCityCategory('istanbul-europe');
    setAddressAr('شارع بيوك درة، مسلك، إسطنبول');
    setAddressEn('Buyukdere Cad., Maslak, Istanbul');
    setAccreditation('JCI Accredited & ISO 9001');
    setAccreditationBadge('JCI');
    setSpecialtiesCount(36);
    setImage('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop');
    setGallery([
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop',
    ]);
    setFeatured(true);
    setDescAr('صرح طبي عالمي مجهز بأحدث غرف العمليات الهجينة الذكية وروبوتات الجراحة مع نخبة الاستشاريين الدوليين.');
    setDescEn('World-class medical center equipped with state-of-the-art robotic surgery and certified specialty faculties.');
    setDescFr('Centre médical de classe mondiale doté de blocs opératoires robotisés et de technologies de pointe.');
    setBedsCount(350);
    setIcuBedsCount(70);
    setOperatingRoomsCount(16);
    setEstablishedYear(2016);
    setTechnologiesRaw('روبوت دافنشي Xi الجراحي, رنين مغناطيسي 3 تسلا, غرف عمليات هجينة ذكية');
    setSelectedSpecialties(['cardiac-surgery', 'oncology', 'neurosurgery', 'orthopedics', 'organ-transplant']);
    setHospitalModalOpen(true);
  };

  // Open Edit Hospital
  const openEditModal = (hosp: HospitalPartner, initialTab: 'info' | 'images' | 'capacities' | 'doctors' = 'info') => {
    setEditingHospital(hosp);
    setActiveTab(initialTab);
    setNameAr(hosp.name.ar);
    setNameEn(hosp.name.en);
    setNameFr(hosp.name.fr || hosp.name.en);
    setTypeAr(hosp.type.ar);
    setTypeEn(hosp.type.en);
    setTypeFr(hosp.type.fr || hosp.type.en);
    setCityAr(hosp.city.ar);
    setCityEn(hosp.city.en);
    setCityFr(hosp.city.fr || hosp.city.en);
    setCityCategory(hosp.cityCategory || 'istanbul-europe');
    setAddressAr(hosp.address.ar || hosp.city.ar);
    setAddressEn(hosp.address.en || hosp.city.en);
    setAccreditation(hosp.accreditation);
    setAccreditationBadge(hosp.accreditationBadge || 'JCI');
    setSpecialtiesCount(hosp.specialtiesCount || 30);
    setImage(hosp.image);
    setGallery(hosp.gallery && hosp.gallery.length > 0 ? hosp.gallery : [hosp.image]);
    setFeatured(hosp.featured);
    setDescAr(hosp.description.ar);
    setDescEn(hosp.description.en);
    setDescFr(hosp.description.fr || hosp.description.en);
    setBedsCount(hosp.bedsCount || 300);
    setIcuBedsCount(hosp.icuBedsCount || 50);
    setOperatingRoomsCount(hosp.operatingRoomsCount || 14);
    setEstablishedYear(hosp.establishedYear || 2015);
    setTechnologiesRaw((hosp.technologies?.ar || []).join(', ') || 'روبوت دافنشي الجراحي, رنين مغناطيسي 3 تسلا');
    setSelectedSpecialties(hosp.specialties || ['cardiac-surgery', 'oncology']);
    setHospitalModalOpen(true);
  };

  // Deep-Linking: When user clicks a specific hospital from search (?edit=... or ?id=...)
  useEffect(() => {
    if (targetHospitalId && hospitals.length > 0) {
      const targetHosp = hospitals.find((h) => h.id === targetHospitalId || h.slug === targetHospitalId);
      if (targetHosp) {
        openEditModal(targetHosp);
        const nameToSearch = targetHosp.name[langKey] || targetHosp.name.ar || targetHosp.name.en || '';
        setSearchQuery(nameToSearch);
      }
    }
  }, [targetHospitalId, hospitals]);

  // Save Hospital
  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNameAr = nameAr || nameFr || nameEn;
    const finalNameEn = nameEn || nameFr || nameAr;
    const finalNameFr = nameFr || nameEn || nameAr;

    if (!finalNameAr && !finalNameEn) {
      alert(langKey === 'ar' ? 'يرجى إدخال اسم المستشفى' : 'Please provide hospital name.');
      return;
    }

    const parsedTechs = technologiesRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const finalGallery = gallery.length > 0 ? gallery : [image];

    const payload: HospitalPartner = {
      id: editingHospital ? editingHospital.id : `hosp-${Date.now()}`,
      slug: editingHospital?.slug || (finalNameEn || 'hospital').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: {
        ar: finalNameAr,
        en: finalNameEn,
        fr: finalNameFr,
      },
      type: {
        ar: typeAr || typeFr || typeEn || 'مستشفى تخصصي',
        en: typeEn || typeFr || typeAr || 'Specialized Hospital',
        fr: typeFr || typeEn || typeAr || 'Hôpital Spécialisé',
      },
      city: {
        ar: cityAr || cityFr || cityEn || 'إسطنبول',
        en: cityEn || cityFr || cityAr || 'Istanbul',
        fr: cityFr || cityEn || cityAr || 'Istanbul',
      },
      cityCategory,
      address: {
        ar: addressAr || cityAr || 'تركيا',
        en: addressEn || cityEn || 'Turkey',
        fr: addressEn || cityEn || 'Turquie',
      },
      accreditation,
      accreditationBadge,
      description: {
        ar: descAr || descFr || descEn,
        en: descEn || descFr || descAr,
        fr: descFr || descEn || descAr,
      },
      image,
      gallery: finalGallery,
      featured,
      specialtiesCount: Number(specialtiesCount),
      bedsCount: Number(bedsCount),
      icuBedsCount: Number(icuBedsCount),
      operatingRoomsCount: Number(operatingRoomsCount),
      establishedYear: Number(establishedYear),
      technologies: {
        ar: parsedTechs,
        en: parsedTechs,
        fr: parsedTechs,
      },
      specialties: selectedSpecialties,
      rating: editingHospital?.rating ?? 4.9,
      reviewsCount: editingHospital?.reviewsCount ?? 120,
    };

    const toastDisplayName = langKey === 'ar' ? finalNameAr : (finalNameFr || finalNameEn);
    if (editingHospital) {
      updateHospital(payload);
      showToast(d.toastSaved(toastDisplayName));
    } else {
      addHospital(payload);
      showToast(d.toastAdded(toastDisplayName));
    }

    setHospitalModalOpen(false);
  };

  // Delete Hospital
  const handleDeleteHospital = (hosp: HospitalPartner) => {
    const hospName = hosp.name[langKey] || hosp.name.ar;
    if (window.confirm(d.deleteConfirm(hospName))) {
      deleteHospital(hosp.id);
      showToast(d.toastDeleted);
    }
  };

  // Filter logic
  const filteredHospitals = hospitals.filter((h) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      h.name.ar.toLowerCase().includes(q) ||
      h.name.en.toLowerCase().includes(q) ||
      (h.name.fr && h.name.fr.toLowerCase().includes(q)) ||
      h.city.ar.toLowerCase().includes(q) ||
      h.city.en.toLowerCase().includes(q) ||
      h.accreditation.toLowerCase().includes(q) ||
      (h.technologies?.ar || []).some((t) => t.toLowerCase().includes(q));

    const matchesRegion =
      selectedRegion === 'all' ||
      (selectedRegion === 'featured' && h.featured) ||
      h.cityCategory === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  return (
    <div dir={direction} className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold mb-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{d.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {d.pageTitle} ({hospitals.length})
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {d.pageSubtitle}
          </p>
        </div>

        <button
          id="tour-add-hospital-btn"
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] active:scale-98 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#0097FB]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{d.btnAddHospital}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Contextual Interactive Guide Banner */}
      <ContextualSectionTip
        locale={langKey}
        title={
          langKey === 'fr'
            ? 'Guide Pratique : Gestion des Hôpitaux Partenaires & Médecins'
            : langKey === 'ar'
            ? 'دليل إدارة شبكة المستشفيات الشريكة والأطباء المنتسبين'
            : 'Interactive Guide: Managing Partner Hospitals & Doctors'
        }
        steps={
          langKey === 'fr'
            ? [
                {
                  title: 'Ajout & Édition',
                  desc: 'Cliquez sur "+ Ajouter" ou "Modifier" pour mettre à jour les accréditations JCI, capacités et galeries photos.',
                  targetButtonLabel: '+ Ajouter un Hôpital',
                  actionOutcome: 'Formulaire d’établissement ouvert',
                  targetSelector: '#tour-add-hospital-btn',
                },
                {
                  title: 'Traduction 1-Clic',
                  desc: 'Rédigez le nom et la ville une seule fois, puis cliquez sur Auto-Translate pour synchroniser AR, FR et EN.',
                  targetButtonLabel: 'Auto-Translate',
                  actionOutcome: 'Mots-clés synchronisés dans les 3 langues',
                  targetSelector: '#tour-hospital-search',
                },
                {
                  title: 'Attribution Médicale',
                  desc: 'Gérez la liste des spécialistes accrédités et rattachez de nouveaux chirurgiens à cet établissement.',
                  targetButtonLabel: 'Médecins Affiliés',
                  actionOutcome: 'Profil chirurgical associé à l’hôpital',
                  targetSelector: '#tour-add-hospital-btn',
                },
              ]
            : langKey === 'ar'
            ? [
                {
                  title: 'الإضافة والتعديل',
                  desc: 'اضغط على "+ إضافة" أو "تعديل" لتحديث اعتمادات JCI والصور والقدرات الاستيعابية.',
                  targetButtonLabel: '+ إضافة مستشفى شريك',
                  actionOutcome: 'تم فتح نافذة بيانات المستشفى',
                  targetSelector: '#tour-add-hospital-btn',
                },
                {
                  title: 'الترجمة الآلية',
                  desc: 'اكتب اسم الصرح الطبي والمدينة مرة واحدة، ثم اضغط على زر الترجمة التلقائية لمزامنة اللغات الثلاث.',
                  targetButtonLabel: 'ترجمة آلية ذكية',
                  actionOutcome: 'تمت مزامنة اللغات الثلاث بنقرة واحدة',
                  targetSelector: '#tour-hospital-search',
                },
                {
                  title: 'إسناد الأطباء',
                  desc: 'قم بربط الأطباء والاستشاريين المعتمدين بملف المستشفى لتظهر في الدليل الموحد.',
                  targetButtonLabel: 'الأطباء المنتسبون',
                  actionOutcome: 'تم تعيين الطبيب في هذا الصرح الطبي',
                  targetSelector: '#tour-add-hospital-btn',
                },
              ]
            : [
                {
                  title: 'Add & Edit Facilities',
                  desc: 'Click "+ Add Partner Hospital" or "Edit" to configure JCI accreditation, capacity, and cover images.',
                  targetButtonLabel: '+ Add Partner Hospital',
                  actionOutcome: 'Hospital configuration wizard opened',
                  targetSelector: '#tour-add-hospital-btn',
                },
                {
                  title: '1-Click Translation',
                  desc: 'Enter hospital name and city once, then click Auto-Translate to instantly synchronize AR, FR, and EN.',
                  targetButtonLabel: 'Auto-Translate',
                  actionOutcome: 'All 3 languages synchronized simultaneously',
                  targetSelector: '#tour-hospital-search',
                },
                {
                  title: 'Doctor Affiliation',
                  desc: 'Assign board-certified surgeons and consultant specialists to their affiliated hospital center.',
                  targetButtonLabel: 'Affiliated Doctors',
                  actionOutcome: 'Surgeon profile linked to facility',
                  targetSelector: '#tour-add-hospital-btn',
                },
              ]
        }
      />

      {/* Key Metric Counters (Balanced 5-Card Row on Desktop xl) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statHospitals}</span>
            <Building2 className="w-4 h-4 text-[#0097FB]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalHospitals}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{d.statHospitalsSub}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statDoctors}</span>
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAffiliatedDoctors}</div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">{d.statDoctorsSub}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statBeds}</span>
            <Bed className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">+{totalBeds.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">{d.statBedsSub}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statIcu}</span>
            <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">+{totalIcuBeds.toLocaleString()}</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{d.statIcuSub}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs col-span-2 md:col-span-1 xl:col-span-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.statJci}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{jciAccreditedCount} / {totalHospitals}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{d.statJciSub}</div>
        </div>
      </div>

      {/* 2. Search & Region Filter Pills */}
      <div id="tour-hospital-search" className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={d.searchPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-2xl rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {d.clearSearch}
            </button>
          )}
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pt-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0097FB]" />
            <span>{d.filterAll}:</span>
          </span>

          {[
            { id: 'all', label: `${d.filterAll} (${hospitals.length})` },
            { id: 'istanbul-europe', label: d.filterEurope },
            { id: 'istanbul-asia', label: d.filterAsia },
            { id: 'ankara', label: d.filterAnkara },
            { id: 'kocaeli', label: d.filterKocaeli },
            { id: 'featured', label: d.filterFeatured },
          ].map((tab) => {
            const isActive = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0097FB] text-white shadow-xs shadow-[#0097FB]/25'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hospitals Grid */}
      {filteredHospitals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 p-12 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs text-slate-400 dark:text-slate-500">
          <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{d.noHospitals}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">{d.noHospitalsSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {filteredHospitals.map((hosp) => {
            const name = hosp.name[langKey] || hosp.name.ar;
            const city = hosp.city[langKey] || hosp.city.ar;
            const desc = hosp.description[langKey] || hosp.description.ar;
            const galleryList = hosp.gallery && hosp.gallery.length > 0 ? hosp.gallery : [hosp.image];

            const isDeepLinked = targetHospitalId && (hosp.id === targetHospitalId || hosp.slug === targetHospitalId);

            return (
              <div
                key={hosp.id}
                className={`bg-white dark:bg-slate-900/90 border rounded-3xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-2xs ${
                  isDeepLinked ? 'ring-2 ring-sky-500 border-sky-500/50' : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Cover Image & Badges (aspect-[16/10] with non-clipping scrim) */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={hosp.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 pointer-events-none" />

                    <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto flex items-center gap-1.5 z-10">
                      {hosp.featured && (
                        <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        </span>
                      )}
                      <span className="bg-sky-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        {d.cardSpecialtiesCount(hosp.specialtiesCount)}
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto z-10">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{hosp.accreditationBadge || 'JCI'}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white flex items-center justify-between z-10">
                      <div className="text-xs font-bold text-sky-200 flex items-center gap-1 drop-shadow-md min-w-0 pr-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{city}</span>
                      </div>

                      <span className="text-[11px] font-bold bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/20 shrink-0">
                        {d.cardEstYear(hosp.establishedYear || 2012)}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                        {name}
                      </h3>
                      {langKey === 'ar' && hosp.name.en ? (
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 dir-ltr text-end">
                          {hosp.name.en}
                        </div>
                      ) : null}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Quick Capacity Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-center">
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2">
                        <div className="text-xs font-black text-slate-900 dark:text-white">{hosp.bedsCount || 250}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{d.cardBedsCount}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2">
                        <div className="text-xs font-black text-rose-600 dark:text-rose-400">{hosp.icuBedsCount || 50}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{d.cardIcuCount}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2">
                        <div className="text-xs font-black text-sky-600 dark:text-sky-400">{hosp.operatingRoomsCount || 12}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{d.cardOrCount}</div>
                      </div>
                    </div>

                    {/* Photo Gallery Thumbnails Strip */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-[#0097FB]" />
                          <span>{d.fieldGallery} ({galleryList.length}):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditModal(hosp, 'images')}
                          className="text-[11px] font-bold text-[#0097FB] dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2 overflow-hidden">
                        {galleryList.slice(0, 4).map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewImage(imgUrl)}
                            className="w-14 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative group/thumb cursor-pointer shrink-0"
                          >
                            <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 mt-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveHospitalForDoctors(hosp);
                      openEditModal(hosp, 'doctors');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0097FB] dark:hover:text-sky-400 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#EAF6FF] dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-[#0097FB] dark:text-sky-400" />
                    <span>{d.btnManageDoctors}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(hosp)}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{d.btnEditDetails}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHospital(hosp)}
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

      {/* Hospital Edit Modal */}
      <ModalPortal isOpen={hospitalModalOpen}>
        <div dir={direction} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200 overflow-hidden">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[26px] sm:rounded-[30px] max-w-4xl w-full max-h-[86vh] flex flex-col shadow-2xl shadow-slate-900/15 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            {/* Modal Top Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 flex items-center justify-center ring-4 ring-sky-50 dark:ring-sky-950/40">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {editingHospital
                      ? d.modalEditTitle(editingHospital.name[langKey] || editingHospital.name.en || editingHospital.name.ar || nameAr)
                      : d.modalAddTitle}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {d.modalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHospitalModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{d.tabInfo}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'images'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{d.tabImages}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('capacities')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'capacities'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bed className="w-3.5 h-3.5" />
                <span>{d.tabCapacities}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('doctors')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'doctors'
                    ? 'bg-[#0097FB] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{d.tabDoctors}</span>
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleHospitalSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6 space-y-5">
                {activeTab === 'info' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Hospital Name (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? "Nom de l'Établissement *" : langKey === 'en' ? 'Hospital Name *' : 'اسم الصرح الطبي *'}
                      value={{ ar: nameAr, en: nameEn, fr: nameFr }}
                      activeLocale={langKey as any}
                      placeholder={langKey === 'fr' ? 'ex: Hôpital Acıbadem Maslak' : langKey === 'en' ? 'e.g. Acıbadem Maslak Hospital' : 'مثال: مستشفى أجيبادم مسلك'}
                      onChange={(val) => {
                        setNameAr(val.ar || '');
                        setNameEn(val.en || '');
                        setNameFr(val.fr || '');
                      }}
                    />

                    {/* Facility Classification (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? "Classification de l'Établissement *" : langKey === 'en' ? 'Facility Classification *' : 'نوع وتصنيف الصرح الطبي *'}
                      value={{ ar: typeAr, en: typeEn, fr: typeFr }}
                      activeLocale={langKey as any}
                      placeholder={langKey === 'fr' ? 'ex: Hôpital Universitaire de Référence' : langKey === 'en' ? 'e.g. Leading Academic Medical Center' : 'مثال: مجمع طبي جامعي رائد'}
                      onChange={(val) => {
                        setTypeAr(val.ar || '');
                        setTypeEn(val.en || '');
                        setTypeFr(val.fr || '');
                      }}
                    />

                    {/* City & Region (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? 'Ville & Secteur *' : langKey === 'en' ? 'City & District *' : 'المدينة والمنطقة *'}
                      value={{ ar: cityAr, en: cityEn, fr: cityFr }}
                      activeLocale={langKey as any}
                      placeholder={langKey === 'fr' ? 'ex: Istanbul, Maslak' : langKey === 'en' ? 'e.g. Istanbul, Maslak' : 'مثال: إسطنبول، مسلك'}
                      onChange={(val) => {
                        setCityAr(val.ar || '');
                        setCityEn(val.en || '');
                        setCityFr(val.fr || '');
                      }}
                    />

                    {/* Geographic Region & Accreditation Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldCityCategory}</label>
                        <select
                          value={cityCategory}
                          onChange={(e) => setCityCategory(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value="istanbul-europe" className="dark:bg-slate-800">{d.filterEurope}</option>
                          <option value="istanbul-asia" className="dark:bg-slate-800">{d.filterAsia}</option>
                          <option value="ankara" className="dark:bg-slate-800">{d.filterAnkara}</option>
                          <option value="kocaeli" className="dark:bg-slate-800">{d.filterKocaeli}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldBadge}</label>
                        <select
                          value={accreditationBadge}
                          onChange={(e) => setAccreditationBadge(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value="JCI" className="dark:bg-slate-800">JCI Accredited</option>
                          <option value="LEED" className="dark:bg-slate-800">LEED Gold Certified</option>
                          <option value="ISO" className="dark:bg-slate-800">ISO 9001 Certified</option>
                          <option value="ACADEMIC" className="dark:bg-slate-800">Academic Medical Center</option>
                        </select>
                      </div>
                    </div>

                    {/* Overview & Clinical Excellence Description (Write-Once Smart AI Auto-Translate) */}
                    <SmartTranslatableField
                      label={langKey === 'fr' ? 'Présentation & Excellence Clinique *' : langKey === 'en' ? 'Overview & Clinical Excellence *' : 'نبذة عن المستشفى والتميز الطبي *'}
                      value={{ ar: descAr, en: descEn, fr: descFr }}
                      activeLocale={langKey as any}
                      multiline
                      placeholder={langKey === 'fr' ? 'Décrivez les spécialités d’excellence et l’infrastructure...' : langKey === 'en' ? 'Describe key clinical excellence and facilities...' : 'اكتب نبذة عن الصرح الطبي والتميز الجراحي...'}
                      onChange={(val) => {
                        setDescAr(val.ar || '');
                        setDescEn(val.en || '');
                        setDescFr(val.fr || '');
                      }}
                    />
                  </div>
                )}

              {activeTab === 'images' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <ImageUploadField
                    label={d.fieldImage}
                    value={image}
                    onChange={setImage}
                    folder="hospitals"
                    helperText={d.fieldImageHelper}
                  />

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {d.fieldGallery} ({gallery.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt(
                            langKey === 'fr'
                              ? 'Entrez l’URL directe de l’image pour la galerie :'
                              : langKey === 'ar'
                              ? 'أدخل رابط الصورة المباشر لإضافتها إلى المعرض:'
                              : 'Enter direct image URL for the gallery:'
                          );
                          if (url && url.trim()) {
                            setGallery([...gallery, url.trim()]);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {langKey === 'fr' ? 'Ajouter par URL' : langKey === 'ar' ? 'إضافة برابط' : 'Add via URL'}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {gallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video group shadow-2xs">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                            className="absolute top-2 end-2 p-1 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs hover:bg-rose-700"
                            title="Supprimer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add to Gallery Trigger Card */}
                      <label className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-800/30 aspect-video text-center cursor-pointer transition-colors p-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const uploaded = await uploadImageFile(e.target.files[0], 'hospitals/gallery');
                              if (uploaded) {
                                setGallery([...gallery, uploaded]);
                              }
                            }
                          }}
                        />
                        <Upload className="w-5 h-5 text-sky-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {langKey === 'fr' ? '+ Ajouter' : langKey === 'ar' ? '+ إضافة صورة' : '+ Add Image'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'capacities' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldBeds}</label>
                      <input
                        type="number"
                        value={bedsCount}
                        onChange={(e) => setBedsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldIcu}</label>
                      <input
                        type="number"
                        value={icuBedsCount}
                        onChange={(e) => setIcuBedsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldOperatingRooms}</label>
                      <input
                        type="number"
                        value={operatingRoomsCount}
                        onChange={(e) => setOperatingRoomsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldYear}</label>
                      <input
                        type="number"
                        value={establishedYear}
                        onChange={(e) => setEstablishedYear(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.fieldTech}</label>
                    <input
                      type="text"
                      value={technologiesRaw}
                      onChange={(e) => setTechnologiesRaw(e.target.value)}
                      placeholder="روبوت دافنشي Xi الجراحي, رنين مغناطيسي 3 تسلا"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'doctors' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{d.statDoctors}</span>
                    <Link
                      href={`/admin/doctors`}
                      className="text-xs font-bold text-[#0097FB] dark:text-sky-400 hover:underline"
                    >
                      + {d.btnAddHospital}
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {doctors
                      .filter((doc) => doc.hospitalId === editingHospital?.id || doc.hospitalSlug === editingHospital?.slug)
                      .map((doc) => (
                        <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/80">
                          <div className="flex items-center gap-3">
                            <img src={doc.image} alt={doc.name.ar} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">{doc.name[langKey] || doc.name.ar}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{doc.title[langKey] || doc.title.ar}</div>
                            </div>
                          </div>
                          <Link
                            href={`/admin/doctors?edit=${doc.id}`}
                            className="text-xs font-bold text-[#0097FB] dark:text-sky-400 hover:underline"
                          >
                            {d.btnEditDetails}
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              </div>

              {/* Modal Footer Controls - Sticky & Always Visible */}
              <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setHospitalModalOpen(false)}
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
            </form>
          </div>
        </div>
      </ModalPortal>

      {/* Lightbox Preview */}
      <ModalPortal isOpen={!!previewImage}>
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <img src={previewImage || ''} alt="Preview" className="max-w-4xl max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      </ModalPortal>
    </div>
  );
}

export default function AdminHospitalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-semibold">Loading Hospitals Directory...</div>}>
      <HospitalsContent />
    </Suspense>
  );
}
