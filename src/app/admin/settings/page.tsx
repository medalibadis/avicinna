'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { initialSiteConfig, SiteConfig } from '@/data/siteConfig';
import { SmartTranslatableField, LocalizedString } from '@/components/admin/SingleInputAutoTranslator';
import type { Locale } from '@/components/admin/AdminShell';
import { useAccent, ACCENT_OPTIONS } from '@/context/AccentContext';
import {
  Settings,
  Save,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Database,
  ShieldCheck,
  Globe,
  Sliders,
  Download,
  RotateCcw,
  ExternalLink,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Lock,
  Server,
  AlertTriangle,
  Compass,
  X,
  Target,
  Keyboard,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminGuideStatus } from '@/components/admin/AdminOnboardingGuide';

const SETTINGS_STORAGE_KEY = 'avicinna_admin_settings_v1';

const settingsDict = {
  ar: {
    badge: 'مركز الضبط والتهيئة',
    pageTitle: 'إعدادات المنصة والتحكم بالنظام',
    pageSubtitle: 'إدارة بيانات التواصل الرسمي، روابط الواتساب المباشرة، مفاتيح الربط مع قاعدة البيانات، وتخصيص تجربة الاستخدام.',
    saveBtn: 'حفظ التعديلات',
    saveSuccess: 'تم حفظ كافة الإعدادات بنجاح في النظام!',
    tabs: {
      general: 'المنصة والهوية',
      guide: 'المساعد والجولات',
      appearance: 'السمات والمظهر (Fernly)',
      whatsapp: 'قنوات التواصل وواتساب',
      database: 'قاعدة البيانات والمزامنة',
      sections: 'رؤية أقسام الموقع',
      security: 'الأمان وحماية الجلسة',
    },
    guideSetting: {
      title: 'المساعد الإرشادي والجولات التفاعلية',
      badge: 'محرك تجربة الاستخدام والإرشاد',
      sub: 'تحكم شامل في تفعيل أو إخفاء نظام المساعدة والتوجيه السريري لكافة لوحات التحكم والمدراء.',
      active: 'دليل الاستخدام نشط ومتاح لكافة المدراء',
      inactive: 'الدليل معطّل ومخفي بالكامل من النظام',
      enableBtn: 'تفعيل الدليل',
      disableBtn: 'تعطيل وإخفاء الدليل',
      activatedToast: 'تم تفعيل دليل الاستخدام التفاعلي بنجاح!',
      deactivatedToast: 'تم تعطيل وإخفاء دليل الاستخدام بالكامل!',
      testDriveBtn: 'معاينة حية وتجربة الجولة الآن',
      resetTourBtn: 'إعادة ضبط تقدم الجولة للمدراء',
      resetTourToast: 'تمت إعادة ضبط الجولة بنجاح، ستظهر للمدراء في زيارتهم القادمة!',
      featuresTitle: 'خصائص نظام الإرشاد النشطة',
      feature1Title: 'زر الترويسة واختصار لوحة المفاتيح',
      feature1Desc: 'إظهار زر "دليل الاستخدام ؟" في الشريط العلوي وتفعيل اختصار لوحة المفاتيح السريع (?) لبدء الجولة التفاعلية فوراً.',
      feature2Title: 'مؤشر التركيز الضوئي التلقائي',
      feature2Desc: 'تسليط ضوء سريري مباشر بدون تقطيع على الأزرار المستهدفة مع مؤشر حركي يوجه المستخدم خطوة بخطوة.',
      feature3Title: 'نصائح الأقسام التوجيهية المدمجة',
      feature3Desc: 'بطاقات توجيهية استرشادية مدمجة داخل صفحات الأطباء والمستشفيات والطلبات لتسهيل إدارة المحتوى.',
      statusNoticeActive: 'النظام نشط: تظهر الجولة الإرشادية لجميع المدراء مع دعم كامل للمزامنة واللغات الثلاث (AR • FR • EN).',
      statusNoticeDisabled: 'النظام معطّل: تم إخفاء زر الترويسة وخطوات الإرشاد بالكامل دون التأثير على عمل أقسام الموقع أو الأطباء.',
    },
    appearance: {
      title: 'محرك السمات والمظهر السريري (Clinical Accent Engine)',
      sub: 'اختر اللون والسمة التفاعلية لنظام أفيسينا بالكامل. تتوافق السمات بانسيابية مع كلٍ من النمط النهاري والنمط الليلي الفاخر.',
      activeLabel: 'السمة النشطة حالياً',
      previewTitle: 'معاينة حية للمكونات التفاعلية',
      sampleButton: 'زر إجراء رئيسي',
      sampleBadge: 'مؤشر سريري نشط',
      sampleLead: 'طلب استشارة فورية جديد',
    },
    general: {
      title: 'بيانات المنصة والهوية الرسمية',
      sub: 'اسم المؤسسة والعناوين الرئيسية التي تظهر في الترويسة ومحركات البحث مع ترجمة تلقائية.',
      brandName: 'اسم المنصة الرسمي',
      contactEmail: 'البريد الإلكتروني الرسمي للمراسلات',
      workingHours: 'ساعات العمل والتنسيق الطبي',
      address: 'عنوان المكتب الرئيسي في إسطنبول',
    },
    whatsapp: {
      title: 'إعدادات الواتساب وقنوات التواصل الفوري',
      sub: 'الرقم المعتمد لزر الواتساب العائم، ونماذج الرسائل الترحيبية التلقائية عند بدء الاستشارة.',
      numberLabel: 'رقم الواتساب بالصيغة الدولية (بدون + أو مسافات)',
      testBtn: 'اختبار المحادثة',
      phoneFormatted: 'رقم الاتصال المباشر المعروض للمرضى',
      templatesTitle: 'الرسائل الترحيبية التلقائية عند طلب الاستشارة',
      templateAr: 'نص الرسالة التلقائية بالعربية',
      templateEn: 'نص الرسالة التلقائية بالإنجليزية',
      templateFr: 'نص الرسالة التلقائية بالفرنسية',
    },
    database: {
      title: 'حالة قاعدة البيانات والتخزين السحابي',
      sub: 'متابعة اتصال سوبابيس (Supabase PostgreSQL) وإدارة الذاكرة المؤقتة المحلية.',
      cloudConnected: 'قاعدة بيانات Supabase السحابية متصلة ونشطة',
      cloudLocal: 'وضع التشغيل المستقل (ذاكرة محلية مشفرة)',
      cloudConnectedSub: 'يتم حفظ وتحديث الأطباء والمستشفيات والطلبات لحظياً في سوبابيس.',
      cloudLocalSub: 'المنصة تعمل بكفاءة تامة بالاعتماد على البيانات المشفرة في النظام.',
      syncNow: 'مزامنة فورية',
      syncing: 'جاري المزامنة...',
      backupDesc: 'النسخ الاحتياطي يتيح لك تصدير كامل بيانات الموقع في ملف JSON لاستعادته في أي وقت.',
      exportBackup: 'تصدير نسخة احتياطية (JSON)',
      resetCache: 'مسح الذاكرة المحلية (Cache)',
      confirmReset: 'هل تريد مسح الكاش المحلي وإعادة التحميل من قاعدة البيانات؟',
    },
    sections: {
      title: 'التحكم في ظهور أقسام الموقع الرئيسي',
      sub: 'يمكنك إظهار أو إخفاء أي قسم من أقسام الصفحة الرئيسية فوراً بضغطة زر واحدة.',
      hero: 'قسم الواجهة الرئيسية (Hero)',
      heroSub: 'العنوان البارز، زر الاستشارة، وصورة الواجهة',
      statistics: 'شريط الأرقام والإحصائيات',
      statisticsSub: 'أرقام العمليات، المستشفيات، ونسب النجاح',
      specialties: 'شبكة التخصصات والعمليات',
      specialtiesSub: 'الأقسام العلاجية والجراحية المتاحة',
      hospitals: 'المستشفيات الشريكة المعتمدة',
      hospitalsSub: 'شبكة المستشفيات الحاصلة على JCI',
      doctors: 'كادر الأطباء والجراحين',
      doctorsSub: 'أبرز الأطباء والاستشاريين المعتمدين',
      consultationCta: 'استمارة طلب الاستشارة السريعة',
      consultationCtaSub: 'نموذج إرسال التقرير الطبي والطلب',
      patientStories: 'قصص وتجارب المرضى',
      patientStoriesSub: 'مقاطع الفيديو وتجارب التعافي الواقعية',
      blog: 'المقالات والمدونة الطبية',
      blogSub: 'أدلة التوعية الصحية وتهيئة محركات البحث',
      whatsappFloating: 'زر الواتساب العائم الذكي',
      whatsappFloatingSub: 'الزر الدائري في زاوية الشاشة',
    },
    security: {
      title: 'الأمان وحماية الجلسة الإدارية',
      sub: 'مستوى حماية لوحة التحكم والإجراءات الأمنية المطبقة ضد محاولات الاختراق.',
      bruteForceTitle: 'حماية هجمات التخمين (Brute-Force)',
      bruteForceDesc: 'مفعل تلقائياً مع تحديد عدد محاولات الدخول (بحد أقصى 5 محاولات) وحظر IP تلقائياً لمدة 15 دقيقة عند التكرار.',
      pinTitle: 'رمز الحماية الإضافي (PIN Security)',
      pinDesc: 'يطلب النظام رمز تأكيد أمان إضافي عند تسجيل الدخول لمنع الوصول غير المصرح به حتى مع معرفة كلمة المرور.',
      cookieTitle: 'جلسة مشفرة (HTTP-Only Secure Cookie)',
      cookieDesc: 'كوكي الجلسة مشفر برمجياً ومرتبط بالخادم مع حظر وصول جافاسكريبت للكوكي لحمايته من ثغرات XSS.',
      auditBadge: 'تم اجتياز كافة الفحوصات الأمنية بنجاح',
    },
  },
  en: {
    badge: 'Configuration & Control Center',
    pageTitle: 'Platform & System Settings',
    pageSubtitle: 'Manage official contact information, direct WhatsApp channels, database connectivity, and user experience toggles.',
    saveBtn: 'Save Changes',
    saveSuccess: 'All platform settings have been successfully saved!',
    tabs: {
      general: 'Branding & Identity',
      guide: 'Interactive Guide',
      appearance: 'Appearance & Accent (Fernly)',
      whatsapp: 'WhatsApp & Channels',
      database: 'Database & Sync',
      sections: 'Sections Visibility',
      security: 'Security & Access',
    },
    guideSetting: {
      title: 'Interactive Onboarding Guide & Walkthrough',
      badge: 'Clinical UX & Onboarding Engine',
      sub: 'Comprehensive control to activate or hide the interactive guidance and clinical tours across all administrative dashboards.',
      active: 'Interactive guide active & visible to all admins',
      inactive: 'Interactive guide disabled & hidden system-wide',
      enableBtn: 'Enable Guide',
      disableBtn: 'Disable Guide',
      activatedToast: 'Interactive guide enabled successfully!',
      deactivatedToast: 'Interactive guide disabled and hidden!',
      testDriveBtn: 'Test-Drive Live Tour Now',
      resetTourBtn: 'Reset Onboarding Tour State',
      resetTourToast: 'Onboarding tour progress has been reset for all administrators!',
      featuresTitle: 'Active Guidance Features',
      feature1Title: 'Header Button & Keyboard Shortcut',
      feature1Desc: 'Displays the "Interactive Guide ?" button in the top navbar and activates the instant (?) keyboard shortcut.',
      feature2Title: 'Clinical Spotlight & Target Beacon',
      feature2Desc: 'Highlights targeted controls with an animated clinical pulse beacon and zero-clipping spotlight precision.',
      feature3Title: 'In-Page Contextual Advice Cards',
      feature3Desc: 'Helpful guidance banners embedded directly into Doctors, Hospitals, and Inquiries management views.',
      statusNoticeActive: 'Active: Guidance tour is available for all administrators with full trilingual support (AR • FR • EN).',
      statusNoticeDisabled: 'Disabled: Navbar assistant and spotlight tours are completely hidden without affecting data or site sections.',
    },
    appearance: {
      title: 'Clinical Accent Engine (Fernly)',
      sub: 'Customize the interactive accent theme across the entire AVICINNA platform. Perfectly synchronized with both Daylight and Obsidian Night modes.',
      activeLabel: 'Currently Active Accent',
      previewTitle: 'Live Dynamic Component Preview',
      sampleButton: 'Primary Action Button',
      sampleBadge: 'Clinical Metric Pill',
      sampleLead: 'New Consultation Lead #AV-884',
    },
    general: {
      title: 'Platform Branding & Identity',
      sub: 'Official institutional name and primary titles rendered across page headers and search engines with instant AI translation.',
      brandName: 'Official Platform Brand Name',
      contactEmail: 'Official Contact Email',
      workingHours: 'Medical Coordination Working Hours',
      address: 'Headquarters Address in Istanbul',
    },
    whatsapp: {
      title: 'WhatsApp & Direct Communication Channels',
      sub: 'Designated telephone hotline for the floating button and automated welcome consultation templates.',
      numberLabel: 'International WhatsApp Number (digits only, e.g. 905442822769)',
      testBtn: 'Test Chat',
      phoneFormatted: 'Formatted Public Phone Display',
      templatesTitle: 'Default Consultation Greeting Templates',
      templateAr: 'Arabic Automated Template',
      templateEn: 'English Automated Template',
      templateFr: 'French Automated Template',
    },
    database: {
      title: 'Cloud Database & Storage Telemetry',
      sub: 'Monitor live Supabase PostgreSQL connection status and manage cached local application state.',
      cloudConnected: 'Supabase Cloud PostgreSQL Connected & Active',
      cloudLocal: 'Independent Local Storage Mode (Encrypted Cache)',
      cloudConnectedSub: 'Doctors, hospitals, and consultation inquiries are synchronized in real-time to Supabase.',
      cloudLocalSub: 'System operating reliably using encrypted in-memory persistence.',
      syncNow: 'Sync Now',
      syncing: 'Synchronizing...',
      backupDesc: 'Backups permit exporting complete website data in a standard JSON format for recovery at any time.',
      exportBackup: 'Export JSON Backup',
      resetCache: 'Clear Local Cache',
      confirmReset: 'Are you sure you want to clear local cache and re-sync from database?',
    },
    sections: {
      title: 'Homepage Section Visibility Controls',
      sub: 'Instantly show or hide any landing page section with a single toggle.',
      hero: 'Hero Headline Section',
      heroSub: 'Main value proposition, CTA buttons, and imagery',
      statistics: 'Live Statistics Counter',
      statisticsSub: 'Surgery counts, partner clinics, and success ratios',
      specialties: 'Clinical Specialties Grid',
      specialtiesSub: 'Integrated medical and surgical departments',
      hospitals: 'Accredited Partner Hospitals',
      hospitalsSub: 'JCI certified hospital directory',
      doctors: 'Featured Medical Faculty',
      doctorsSub: 'Top accredited consultants and surgeons',
      consultationCta: 'Online Consultation Intake Form',
      consultationCtaSub: 'Medical report submission and triage',
      patientStories: 'Patient Recovery Journeys',
      patientStoriesSub: 'Documented video testimonials and reviews',
      blog: 'Clinical Blog & Articles',
      blogSub: 'Health educational guides and SEO articles',
      whatsappFloating: 'Floating WhatsApp Hotline',
      whatsappFloatingSub: 'Interactive floating button in screen corner',
    },
    security: {
      title: 'Administrative Security & Session Shielding',
      sub: 'Dashboard protection protocols and defenses implemented against malicious intrusion attempts.',
      bruteForceTitle: 'Brute-Force Rate Limiting',
      bruteForceDesc: 'Automatically enforced with a strict 5-attempt threshold and 15-minute temporary IP ban upon failure.',
      pinTitle: 'PIN Security Verification',
      pinDesc: 'Secondary authorization code required during administrative login to prevent unauthorized access.',
      cookieTitle: 'Encrypted HTTP-Only Sessions',
      cookieDesc: 'Server-bound cryptographic cookie with client-side script access strictly blocked against XSS.',
      auditBadge: 'All Security Audits Passed',
    },
  },
  fr: {
    badge: 'Centre de Configuration & Contrôle',
    pageTitle: 'Paramètres Plateforme & Système',
    pageSubtitle: 'Gestion des coordonnées officielles, des canaux WhatsApp, de la base de données et de l’affichage.',
    saveBtn: 'Enregistrer les Modifications',
    saveSuccess: 'Tous les paramètres ont été enregistrés avec succès !',
    tabs: {
      general: 'Identité & Marque',
      guide: 'Guide & Assistance',
      appearance: 'Apparence & Thèmes (Fernly)',
      whatsapp: 'WhatsApp & Canaux',
      database: 'Base de Données & Sync',
      sections: 'Visibilité des Sections',
      security: 'Sécurité & Accès',
    },
    guideSetting: {
      title: 'Assistant & Guide Interactif de la Plateforme',
      badge: 'Moteur d’Assistance Clinique & Ergonomie',
      sub: 'Contrôle centralisé pour activer ou masquer le système de visite guidée et d’assistance sur tous les tableaux de bord.',
      active: 'Guide interactif activé et visible par tous les administrateurs',
      inactive: 'Guide interactif désactivé et totalement masqué',
      enableBtn: 'Activer le guide',
      disableBtn: 'Désactiver le guide',
      activatedToast: 'Guide interactif activé avec succès !',
      deactivatedToast: 'Guide interactif désactivé et masqué !',
      testDriveBtn: 'Tester la visite guidée en direct',
      resetTourBtn: 'Réinitialiser la progression du guide',
      resetTourToast: 'La progression du guide a été réinitialisée avec succès !',
      featuresTitle: 'Fonctionnalités du Guide d’Assistance',
      feature1Title: 'Bouton d’En-tête & Raccourci Clavier',
      feature1Desc: 'Affiche le bouton "Guide d’utilisation ?" dans la barre supérieure et active le raccourci direct (?) pour lancer la visite.',
      feature2Title: 'Faisceau Lumineux & Pointeur Animé',
      feature2Desc: 'Met en lumière les boutons cibles grâce à un halo fluide sans aucun débordement de mise en page.',
      feature3Title: 'Conseils Contextuels dans les Sections',
      feature3Desc: 'Bannières d’aide pratique intégrées aux pages Médecins, Hôpitaux et Demandes pour assister l’équipe.',
      statusNoticeActive: 'Actif : La visite guidée est disponible pour tous les administrateurs en 3 langues (AR • FR • EN).',
      statusNoticeDisabled: 'Désactivé : L’assistant d’en-tête et les visites sont masqués sans impacter la gestion des données.',
    },
    appearance: {
      title: 'Moteur de Thèmes & Accents (Fernly)',
      sub: 'Personnalisez le thème d’accentuation visuelle sur l’ensemble de la plateforme AVICINNA.',
      activeLabel: 'Accent Actif',
      previewTitle: 'Aperçu Dynamique en Direct',
      sampleButton: 'Bouton d’action principal',
      sampleBadge: 'Indicateur Clinique',
      sampleLead: 'Nouvelle Consultation #AV-884',
    },
    general: {
      title: 'Identité Institutionnelle & Marque',
      sub: 'Nom officiel de la plateforme et coordonnées apparaissant dans l’en-tête et les moteurs de recherche.',
      brandName: 'Nom Officiel de la Plateforme',
      contactEmail: 'Email officiel de contact',
      workingHours: 'Horaires de coordination médicale',
      address: 'Adresse du siège à Istanbul',
    },
    whatsapp: {
      title: 'Configuration WhatsApp & Contact Direct',
      sub: 'Numéro de permanence pour le bouton flottant et modèles de messages d’accueil automatiques.',
      numberLabel: 'Numéro WhatsApp international (chiffres uniquement, ex. 905442822769)',
      testBtn: 'Tester le chat',
      phoneFormatted: 'Numéro de téléphone affiché aux patients',
      templatesTitle: 'Modèles de messages automatiques de consultation',
      templateAr: 'Modèle automatique en arabe',
      templateEn: 'Modèle automatique en anglais',
      templateFr: 'Modèle automatique en français',
    },
    database: {
      title: 'Télémétrie Base de Données & Cache Cloud',
      sub: 'Supervision de la connexion Supabase PostgreSQL et gestion du stockage local.',
      cloudConnected: 'Base de Données Supabase Connectée & Active',
      cloudLocal: 'Mode Local Autonome (Cache Chiffré)',
      cloudConnectedSub: 'Les médecins, hôpitaux et demandes sont synchronisés en temps réel.',
      cloudLocalSub: 'Fonctionnement fluide via le stockage chiffré du navigateur.',
      syncNow: 'Synchroniser',
      syncing: 'Synchronisation...',
      backupDesc: 'L’export JSON permet de sauvegarder l’intégralité des données de la plateforme.',
      exportBackup: 'Exporter la sauvegarde JSON',
      resetCache: 'Vider le cache local',
      confirmReset: 'Voulez-vous vider le cache local et recharger depuis la base de données ?',
    },
    sections: {
      title: 'Contrôle de Visibilité des Sections',
      sub: 'Affichez ou masquez n’importe quelle section de la page d’accueil en un clic.',
      hero: 'Section Accueil (Hero)',
      heroSub: 'Accroche principale, boutons d’action et visuels',
      statistics: 'Compteurs Statistiques',
      statisticsSub: 'Chiffres d’interventions et taux de réussite',
      specialties: 'Pôles Spécialisés & Chirurgies',
      specialtiesSub: 'Départements médicaux et chirurgicaux disponibles',
      hospitals: 'Hôpitaux Partenaires Agréés',
      hospitalsSub: 'Réseau d’établissements accrédités JCI',
      doctors: 'Médecins & Spécialistes Référents',
      doctorsSub: 'Praticiens et chirurgiens renommés',
      consultationCta: 'Formulaire de Consultation en Ligne',
      consultationCtaSub: 'Envoi du dossier médical et prise en charge',
      patientStories: 'Témoignages & Récits de Patients',
      patientStoriesSub: 'Vidéos et retours d’expérience cliniques',
      blog: 'Blog & Articles Médicaux',
      blogSub: 'Conseils de santé et référencement naturel',
      whatsappFloating: 'Bouton WhatsApp Flottant',
      whatsappFloatingSub: 'Bouton circulaire interactif en bas d’écran',
    },
    security: {
      title: 'Sécurité Administrative & Protection de Session',
      sub: 'Protocoles de sécurité et mesures défensives contre les intrusions et attaques.',
      bruteForceTitle: 'Protection Anti Brute-Force',
      bruteForceDesc: 'Limite stricte à 5 tentatives de connexion avant blocage temporaire d’IP pendant 15 minutes.',
      pinTitle: 'Code de Sécurité PIN Obligatoire',
      pinDesc: 'Code de vérification additionnel requis lors de la connexion pour sécuriser l’accès.',
      cookieTitle: 'Session Chiffrée HTTP-Only',
      cookieDesc: 'Cookie d’authentification chiffré et protégé contre les attaques de script XSS.',
      auditBadge: 'Tous les audits de sécurité validés',
    },
  },
};

export default function AdminSettingsPage() {
  const {
    doctors,
    hospitals,
    treatments,
    articles,
    stories,
    inquiries,
    isSupabaseConnected,
    syncStatus,
    refreshFromSupabase,
    clearLocalCache,
  } = useData();

  const { language } = useLanguage();
  const locale = (language || 'en') as Locale;
  const d = settingsDict[locale] || settingsDict.en;
  const { accent, setAccent, accentOption } = useAccent();

  const [activeTab, setActiveTab] = useState<'general' | 'guide' | 'appearance' | 'whatsapp' | 'database' | 'sections' | 'security'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { isEnabled: guideEnabled, setGuideEnabled } = useAdminGuideStatus();

  // Settings State initialized from initialSiteConfig + localStorage
  const [settings, setSettings] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        try {
          return { ...initialSiteConfig, ...JSON.parse(saved) };
        } catch {
          // fallback
        }
      }
    }
    return initialSiteConfig;
  });

  const handleToggleGuide = () => {
    const currentStatus = typeof settings.adminGuideEnabled === 'boolean'
      ? settings.adminGuideEnabled
      : guideEnabled;
    const nextVal = !currentStatus;

    setSettings((prev) => ({
      ...prev,
      adminGuideEnabled: nextVal,
    }));
    setGuideEnabled(nextVal);
    toast.success(nextVal ? d.guideSetting.activatedToast : d.guideSetting.deactivatedToast);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      if (typeof settings.adminGuideEnabled === 'boolean') {
        setGuideEnabled(settings.adminGuideEnabled);
      }
    }
    setSavedSuccess(true);
    toast.success(d.saveSuccess);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    setIsExporting(true);
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'AVICINNA CMS',
      version: '3.0.0',
      settings,
      counts: {
        doctors: doctors.length,
        hospitals: hospitals.length,
        treatments: treatments.length,
        articles: articles.length,
        stories: stories.length,
        inquiries: inquiries.length,
      },
      data: {
        doctors,
        hospitals,
        treatments,
        articles,
        stories,
        inquiries,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avicinna_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleFullSync = async () => {
    setIsSyncing(true);
    await refreshFromSupabase();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const toggleSection = (key: keyof SiteConfig['sectionsVisibility']) => {
    setSettings((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [key]: !prev.sectionsVisibility[key],
      },
    }));
  };

  // Helper localized string for brand name
  const brandNameObj: LocalizedString = {
    en: settings.brandName || 'AVICINNA',
    ar: settings.brandArabic || 'أفيسينا للرعاية الطبية الدولية',
    fr: settings.brandName || 'AVICINNA',
  };

  const workingHoursObj: LocalizedString = {
    ar: settings.contact.workingHours?.ar || 'التنسيق والاستشارات الطبية متاح 24 ساعة / 7 أيام',
    en: settings.contact.workingHours?.en || 'Medical Coordination & Inquiries Available 24/7',
    fr: settings.contact.workingHours?.fr || 'Coordination Médicale & Téléconsultations 24h/24, 7j/7',
  };

  const addressObj: LocalizedString = {
    ar: settings.contact.address?.ar || 'إسطنبول، ليفنت / أتاشهير، الجمهورية التركية',
    en: settings.contact.address?.en || 'Istanbul, Levent & Ataşehir Healthcare District, Turkey',
    fr: settings.contact.address?.fr || 'Istanbul, Quartier Médical de Levent & Ataşehir, Turquie',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-1 shadow-2xs">
            <Settings className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{d.badge}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            {d.pageTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-3xl text-pretty">
            {d.pageSubtitle}
          </p>
        </div>

        <motion.button
          id="tour-save-changes-btn"
          type="button"
          onClick={() => handleSave()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{d.saveBtn}</span>
        </motion.button>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{d.saveSuccess}</span>
        </motion.div>
      )}

      {/* Spring Liquid Tabs */}
      <div id="tour-settings-tabs" className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'general', label: d.tabs.general, icon: Globe },
          { id: 'guide', label: d.tabs.guide, icon: Compass },
          { id: 'appearance', label: d.tabs.appearance, icon: Sparkles },
          { id: 'whatsapp', label: d.tabs.whatsapp, icon: MessageCircle },
          { id: 'database', label: d.tabs.database, icon: Database },
          { id: 'sections', label: d.tabs.sections, icon: Sliders },
          { id: 'security', label: d.tabs.security, icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-sky-900 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="settings-tab-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General & Branding */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Card 1: Official Brand Identity & Contact */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>{d.general.title}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {d.general.sub}
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Unified Brand Name with Auto-Translate */}
              <SmartTranslatableField
                label={d.general.brandName}
                value={brandNameObj}
                activeLocale={locale}
                onChange={(updated) => {
                  setSettings({
                    ...settings,
                    brandName: updated.en,
                    brandArabic: updated.ar,
                  });
                }}
              />

              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  {d.general.contactEmail}
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.contact.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 transition-colors focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
              </div>

              {/* Medical Coordination Working Hours with Auto-Translate */}
              <SmartTranslatableField
                label={d.general.workingHours}
                value={workingHoursObj}
                activeLocale={locale}
                onChange={(updated) => {
                  setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      workingHours: updated,
                    },
                  });
                }}
              />

              {/* Headquarters Address in Istanbul with Auto-Translate */}
              <SmartTranslatableField
                label={d.general.address}
                value={addressObj}
                activeLocale={locale}
                multiline
                onChange={(updated) => {
                  setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      address: updated,
                    },
                  });
                }}
              />
            </div>
          </div>

        </div>
      )}

      {/* Tab: Dedicated Interactive Onboarding Guide Command Center */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Main Command Console Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 via-teal-500/15 to-emerald-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 shadow-sm">
                  <Compass className="h-6 w-6" />
                  {(settings.adminGuideEnabled ?? guideEnabled) && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {d.guideSetting.title}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        (settings.adminGuideEnabled ?? guideEnabled)
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          (settings.adminGuideEnabled ?? guideEnabled)
                            ? 'bg-emerald-500 animate-pulse'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span>
                        {(settings.adminGuideEnabled ?? guideEnabled)
                          ? d.guideSetting.active
                          : d.guideSetting.inactive}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl text-pretty">
                    {d.guideSetting.sub}
                  </p>
                </div>
              </div>

              {/* Master Switch Button with Precision LTR Coordinates */}
              <div className="flex flex-col items-end sm:items-center gap-2 shrink-0 self-end sm:self-start">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {(settings.adminGuideEnabled ?? guideEnabled)
                      ? d.guideSetting.enableBtn
                      : d.guideSetting.disableBtn}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.adminGuideEnabled ?? guideEnabled}
                    onClick={handleToggleGuide}
                    dir="ltr"
                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
                      (settings.adminGuideEnabled ?? guideEnabled)
                        ? 'bg-gradient-to-r from-sky-500 to-teal-500 shadow-md shadow-sky-500/25 ring-1 ring-sky-400/40'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span className="sr-only">{d.guideSetting.title}</span>
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`pointer-events-none inline-flex h-6 w-6 transform rounded-full bg-white shadow-md items-center justify-center transition-all ${
                        (settings.adminGuideEnabled ?? guideEnabled)
                          ? 'translate-x-6 text-teal-600'
                          : 'translate-x-0 text-slate-400'
                      }`}
                    >
                      {(settings.adminGuideEnabled ?? guideEnabled) ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 stroke-[2.5]" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
                      )}
                    </motion.span>
                  </button>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {(settings.adminGuideEnabled ?? guideEnabled) ? 'STATUS • ACTIVE' : 'STATUS • DISABLED'}
                </span>
              </div>
            </div>

            {/* Quick Testing & Management Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-medium">
                  {(settings.adminGuideEnabled ?? guideEnabled)
                    ? d.guideSetting.statusNoticeActive
                    : d.guideSetting.statusNoticeDisabled}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    if (!(settings.adminGuideEnabled ?? guideEnabled)) {
                      handleToggleGuide();
                    }
                    window.dispatchEvent(new CustomEvent('avicinna:start-admin-tour'));
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{d.guideSetting.testDriveBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('avicinna_admin_guide_completed');
                      toast.success(d.guideSetting.resetTourToast);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-98"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{d.guideSetting.resetTourBtn}</span>
                </button>
              </div>
            </div>

            {/* 3 Interactive Feature Cards */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {d.guideSetting.featuresTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Feature 1 */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/40 p-4 space-y-2.5 shadow-2xs hover:border-sky-300 dark:hover:border-sky-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {locale === 'ar' ? 'اختصار ؟' : locale === 'fr' ? 'Raccourci ?' : 'Shortcut ?'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {d.guideSetting.feature1Title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {d.guideSetting.feature1Desc}
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/40 p-4 space-y-2.5 shadow-2xs hover:border-teal-300 dark:hover:border-teal-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                      {locale === 'ar' ? 'تركيز ضوئي' : locale === 'fr' ? 'Spotlight 0 Débordement' : 'Zero-Clipping'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {d.guideSetting.feature2Title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {d.guideSetting.feature2Desc}
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-800/40 p-4 space-y-2.5 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                      {locale === 'ar' ? 'نصائح الصفحات' : locale === 'fr' ? 'Bannières Pages' : 'Page Tips'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {d.guideSetting.feature3Title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {d.guideSetting.feature3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Appearance & Fernly Accent Theme */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{d.appearance.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {d.appearance.sub}
            </p>
          </div>

          {/* 4 Accent Cards matching Fernly anim.mp4 00:07-00:08 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {ACCENT_OPTIONS.map((opt) => {
              const isSelected = accent === opt.id;
              return (
                <motion.div
                  key={opt.id}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAccent(opt.id)}
                  className={`relative p-5 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-44 select-none ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 shadow-lg ring-2 ring-slate-900/10 dark:ring-white/10'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top row: Swatch Circle + Checkmark */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-full shadow-md border-2 border-white dark:border-slate-900"
                        style={{ backgroundColor: opt.color }}
                      />
                      {isSelected ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs shadow-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current stroke-white dark:stroke-slate-900" />
                        </motion.span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {opt.label[locale]}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {opt.color}
                    </p>
                  </div>

                  {/* Micro Visual Gradient Bar */}
                  <div
                    className="w-full h-2.5 rounded-full overflow-hidden"
                    style={{ background: `linear-gradient(90deg, ${opt.color} 0%, #0284C7 100%)` }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Live Component Preview */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{d.appearance.previewTitle}</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all active:scale-98"
                style={{
                  background: `linear-gradient(135deg, ${accentOption.color} 0%, #0369A1 100%)`,
                }}
              >
                {d.appearance.sampleButton}
              </button>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: `${accentOption.color}15`,
                  color: accentOption.color,
                  borderColor: `${accentOption.color}40`,
                }}
              >
                {d.appearance.sampleBadge}
              </span>

              <div
                className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                style={{
                  borderColor: `${accentOption.color}40`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentOption.color }}
                />
                <span>{d.appearance.sampleLead}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: WhatsApp & Direct Contact */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{d.whatsapp.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {d.whatsapp.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                {d.whatsapp.numberLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={settings.contact.whatsapp}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, whatsapp: e.target.value.replace(/[^0-9]/g, '') },
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono outline-none transition-all tabular-nums"
                />
                <a
                  href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
                    settings.contact.whatsappMessage[locale] || settings.contact.whatsappMessage.en
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors shadow-2xs"
                  title={d.whatsapp.testBtn}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{d.whatsapp.testBtn}</span>
                </a>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                {d.whatsapp.phoneFormatted}
              </label>
              <input
                type="text"
                dir="ltr"
                value={settings.contact.phoneFormatted}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      phoneFormatted: e.target.value,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-mono outline-none transition-all tabular-nums"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {d.whatsapp.templatesTitle}
            </h3>

            <SmartTranslatableField
              label={d.whatsapp.templatesTitle}
              value={settings.contact.whatsappMessage}
              activeLocale={locale}
              multiline
              onChange={(updated) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    whatsappMessage: updated,
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {/* Tab 3: Database & Sync */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span>{d.database.title}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {d.database.sub}
              </p>
            </div>

            {/* Connection Banner */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSupabaseConnected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs ${
                    isSupabaseConnected ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                >
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span>
                      {isSupabaseConnected ? d.database.cloudConnected : d.database.cloudLocal}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isSupabaseConnected
                          ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {syncStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 mt-0.5">
                    {isSupabaseConnected ? d.database.cloudConnectedSub : d.database.cloudLocalSub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFullSync}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-600 dark:text-sky-400' : 'text-sky-600 dark:text-sky-400'}`} />
                  <span>{isSyncing ? d.database.syncing : d.database.syncNow}</span>
                </button>
              </div>
            </div>

            {/* Counts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                { label: locale === 'ar' ? 'الأطباء' : locale === 'fr' ? 'Médecins' : 'Doctors', count: doctors.length },
                { label: locale === 'ar' ? 'المستشفيات' : locale === 'fr' ? 'Hôpitaux' : 'Hospitals', count: hospitals.length },
                { label: locale === 'ar' ? 'التخصصات' : locale === 'fr' ? 'Spécialités' : 'Specialties', count: treatments.length },
                { label: locale === 'ar' ? 'المقالات' : locale === 'fr' ? 'Articles' : 'Articles', count: articles.length },
                { label: locale === 'ar' ? 'القصص' : locale === 'fr' ? 'Témoignages' : 'Stories', count: stories.length },
                { label: locale === 'ar' ? 'الطلبات' : locale === 'fr' ? 'Demandes' : 'Inquiries', count: inquiries.length },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{c.count}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Storage Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                {d.database.backupDesc}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>{d.database.exportBackup}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(d.database.confirmReset)) {
                      clearLocalCache();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>{d.database.resetCache}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sections Toggle */}
      {activeTab === 'sections' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{d.sections.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {d.sections.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { key: 'adminGuide', title: d.guideSetting.title, sub: d.guideSetting.sub, isGuide: true },
              { key: 'hero', title: d.sections.hero, sub: d.sections.heroSub },
              { key: 'statistics', title: d.sections.statistics, sub: d.sections.statisticsSub },
              { key: 'specialties', title: d.sections.specialties, sub: d.sections.specialtiesSub },
              { key: 'hospitals', title: d.sections.hospitals, sub: d.sections.hospitalsSub },
              { key: 'doctors', title: d.sections.doctors, sub: d.sections.doctorsSub },
              { key: 'consultationCta', title: d.sections.consultationCta, sub: d.sections.consultationCtaSub },
              { key: 'patientStories', title: d.sections.patientStories, sub: d.sections.patientStoriesSub },
              { key: 'blog', title: d.sections.blog, sub: d.sections.blogSub },
              { key: 'whatsappFloating', title: d.sections.whatsappFloating, sub: d.sections.whatsappFloatingSub },
            ].map((sec) => {
              const isEnabled = (sec as any).isGuide
                ? (settings.adminGuideEnabled ?? guideEnabled)
                : settings.sectionsVisibility[sec.key as keyof SiteConfig['sectionsVisibility']];
              return (
                <div
                  key={sec.key}
                  onClick={() => ((sec as any).isGuide ? handleToggleGuide() : toggleSection(sec.key as any))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isEnabled
                      ? 'bg-sky-50/50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/60 hover:border-sky-300 dark:hover:border-sky-700'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {(sec as any).isGuide && <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                      <span>{sec.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sec.sub}</div>
                  </div>

                  <div className="flex-shrink-0">
                    {isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Security & Session */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{d.security.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {d.security.sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{d.security.bruteForceTitle}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {d.security.bruteForceDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{d.security.pinTitle}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {d.security.pinDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{d.security.cookieTitle}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {d.security.cookieDesc}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>AVICINNA Security Protocol v3.0 (Hardened)</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{d.security.auditBadge}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
