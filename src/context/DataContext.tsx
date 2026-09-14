'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor, doctorsData as defaultDoctors } from '@/data/doctors';
import { Treatment, treatmentsData as defaultTreatments } from '@/data/treatments';
import { PatientStory, patientStoriesData as defaultStories } from '@/data/stories';
import { Article, articlesData as defaultArticles } from '@/data/articles';
import { HospitalPartner, hospitalsData as defaultHospitals } from '@/data/hospitals';
import {
  isSupabaseConfigured,
  fetchSectionsFromDb,
  upsertSectionToDb,
  fetchHospitalsFromDb,
  upsertHospitalToDb,
  deleteHospitalFromDb,
  fetchDoctorsFromDb,
  upsertDoctorToDb,
  deleteDoctorFromDb,
  fetchTreatmentsFromDb,
  upsertTreatmentToDb,
  deleteTreatmentFromDb,
  fetchStoriesFromDb,
  upsertStoryToDb,
  deleteStoryFromDb,
  fetchArticlesFromDb,
  upsertArticleToDb,
  deleteArticleFromDb,
  fetchInquiriesFromDb,
  insertInquiryToDb,
  updateInquiryStatusInDb,
  deleteInquiryFromDb,
} from '@/lib/supabase';

export interface ConsultationInquiry {
  id: string;
  trackingId: string;
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  specialty?: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'in_review' | 'contacted' | 'scheduled';
}

export interface SiteSectionsData {
  hero: {
    eyebrow: { ar: string; en: string; fr: string };
    headlinePart1: { ar: string; en: string; fr: string };
    headlineHighlight: { ar: string; en: string; fr: string };
    headlinePart2: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
  };
  stats: {
    patientsCount: string;
    patientsLabel: { ar: string; en: string; fr: string };
    hospitalsCount: string;
    hospitalsLabel: { ar: string; en: string; fr: string };
    experienceCount: string;
    experienceLabel: { ar: string; en: string; fr: string };
    satisfactionRate: string;
    satisfactionLabel: { ar: string; en: string; fr: string };
  };
  about: {
    badge: { ar: string; en: string; fr: string };
    heading: { ar: string; en: string; fr: string };
    lead: { ar: string; en: string; fr: string };
  };
  whyChoose: {
    badge: { ar: string; en: string; fr: string };
    title: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
    whatsappNumber: string;
  };
  finalCta: {
    title: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
    phone: string;
  };
}

export const defaultSections: SiteSectionsData = {
  hero: {
    eyebrow: {
      ar: 'وجهتكم الأولى للرعاية الصحية المتقدمة في إسطنبول',
      en: 'Your Premier Destination for Advanced Healthcare in Istanbul',
      fr: 'Votre Destination d’Excellence Médicale à Istanbul',
    },
    headlinePart1: {
      ar: 'أفضل المستشفيات وأشهر الأطباء في',
      en: 'Turkey’s Leading Hospitals & Renowned Physicians for Your',
      fr: 'Les Meilleurs Hôpitaux et Chirurgiens Réputés de Turquie pour Votre',
    },
    headlineHighlight: {
      ar: 'تركيا',
      en: 'Care',
      fr: 'Santé',
    },
    headlinePart2: {
      ar: 'لرعايتكم',
      en: 'Journey',
      fr: 'Voyage',
    },
    subtitle: {
      ar: 'نربطكم بأعلى المستشفيات المعتمدة دولياً (JCI) ونخبة الجراحين الاستشاريين في تركيا، مع مرافقة علاجية ولوجستية شاملة واستشارة مجانية فورية.',
      en: 'Connecting you with JCI-accredited medical facilities and elite board-certified professors in Istanbul, supported by seamless end-to-end concierge services.',
      fr: 'Nous vous relions aux centres hospitaliers accrédités JCI et aux chirurgiens les plus réputés de Turquie avec un accompagnement complet et une assistance 24/7.',
    },
  },
  stats: {
    patientsCount: '+2,500',
    patientsLabel: {
      ar: 'مريض دولي تلقوا العلاج بنجاح',
      en: 'International Patients Successfully Treated',
      fr: 'Patients Internationaux Soignés avec Succès',
    },
    hospitalsCount: '+15',
    hospitalsLabel: {
      ar: 'مستشفى معتمد دولياً (JCI)',
      en: 'JCI-Accredited Partner Hospitals',
      fr: 'Hôpitaux Partenaires Accrédités JCI',
    },
    experienceCount: '+10',
    experienceLabel: {
      ar: 'سنوات من الريادة في السياحة العلاجية',
      en: 'Years of Excellence in Medical Tourism',
      fr: 'Années d’Excellence en Tourisme Médical',
    },
    satisfactionRate: '98.4%',
    satisfactionLabel: {
      ar: 'نسبة رضا المرضى والنتائج الإيجابية',
      en: 'Clinical Success & Satisfaction Rate',
      fr: 'Taux de Satisfaction et Réussite Clinique',
    },
  },
  about: {
    badge: {
      ar: 'خبرة تمتد لأكثر من عقد كامل',
      en: 'Over a Decade of Medical Excellence',
      fr: 'Plus d’une Décennie d’Excellence Médicale',
    },
    heading: {
      ar: 'ريادة طبية بمعايير عالمية في قلب إسطنبول',
      en: 'World-Class Healthcare Standards in the Heart of Istanbul',
      fr: 'Excellence Médicale aux Normes Internationales à Istanbul',
    },
    lead: {
      ar: 'تأسست منصة AVICINNA لتكون الجسر الموثوق الذي يربط المرضى من كافة أنحاء العالم بأفضل الكفاءات الطبية والمستشفيات التخصصية المعتمدة في تركيا.',
      en: 'AVICINNA was founded as a trusted international healthcare bridge connecting global patients with top-tier accredited medical centers and distinguished specialists in Turkey.',
      fr: 'AVICINNA est née d’une mission claire : offrir aux patients du monde entier un accès direct et privilégié aux meilleurs spécialistes et hôpitaux de pointe en Turquie.',
    },
  },
  whyChoose: {
    badge: {
      ar: 'لماذا يختار المرضى منصة أفيسينا؟',
      en: 'Why Patients Worldwide Choose AVICINNA',
      fr: 'Pourquoi Choisir la Plateforme AVICINNA ?',
    },
    title: {
      ar: 'رعاية صحية متكاملة تضع صحتك وراحتك أولاً',
      en: 'Comprehensive Healthcare Putting Your Wellbeing First',
      fr: 'Une Prise en Charge Médicale Intégrale Centrée sur Votre Confort',
    },
    subtitle: {
      ar: 'نحن لا نكتفي بحجز موعد، بل ندير كافة تفاصيل رحلتك الطبية من لحظة وصولك المطار حتى الشفاء التام والعودة لوطنك.',
      en: 'We orchestrate every dimension of your journey—from airport reception to advanced surgical care and post-discharge recovery follow-up.',
      fr: 'Nous coordonnons l’intégralité de votre séjour médical : accueil aéroport VIP, hébergement de luxe, traduction dédiée et suivi personnalisé.',
    },
    whatsappNumber: '+90 500 000 00 00',
  },
  finalCta: {
    title: {
      ar: 'ابدأ رحلتك نحو الشفاء اليوم مع أفضل أطباء تركيا',
      en: 'Begin Your Path to Recovery Today with Turkey’s Leading Medical Faculty',
      fr: 'Commencez Votre Rétablissement Aujourd’hui avec les Meilleurs Spécialistes',
    },
    subtitle: {
      ar: 'فريقنا الطبي جاهز لمراجعة تقاريرك وتقديم استشارة مجانية مع خطة علاجية مخصصة وعرض سعر شامل خلال 24 ساعة.',
      en: 'Our clinical coordination board is ready to review your medical reports and deliver a comprehensive all-inclusive proposal within 24 hours.',
      fr: 'Notre équipe médicale étudie vos examens pour vous délivrer un plan de soins personnalisé et un devis complet sous 24 heures.',
    },
    phone: '+90 500 000 00 00',
  },
};

export const defaultInquiries: ConsultationInquiry[] = [
  {
    id: 'inq-1',
    trackingId: 'AVIC-7821',
    fullName: 'خالد عبد الله العتيبي',
    phone: '+966 50 123 4567',
    email: 'khaled.alotaibi@example.com',
    country: 'المملكة العربية السعودية',
    specialty: 'cardiac-surgery',
    notes: 'استفسار بخصوص عملية ترميم الصمام الميترالي بالمنظار لوالدي (65 سنة).',
    createdAt: '2026-09-12T14:30:00Z',
    status: 'contacted',
  },
  {
    id: 'inq-2',
    trackingId: 'AVIC-7822',
    fullName: 'Jean-Marc Dubois',
    phone: '+33 6 12 34 56 78',
    email: 'jm.dubois@example.fr',
    country: 'France',
    specialty: 'hair-transplant',
    notes: 'Demande de devis pour greffe de cheveux DHI (environ 4000 greffons).',
    createdAt: '2026-09-13T09:15:00Z',
    status: 'new',
  },
  {
    id: 'inq-3',
    trackingId: 'AVIC-7823',
    fullName: 'مريم الكواري',
    phone: '+974 55 987 654',
    email: 'maryam.k@example.com',
    country: 'قطر',
    specialty: 'dentistry',
    notes: 'حجز موعد لابتسامة هوليوود (عدسات إيماكس لكلا الفكين) خلال شهر أكتوبر.',
    createdAt: '2026-09-14T08:00:00Z',
    status: 'in_review',
  },
];

export interface DataContextType {
  doctors: Doctor[];
  treatments: Treatment[];
  stories: PatientStory[];
  articles: Article[];
  hospitals: HospitalPartner[];
  sections: SiteSectionsData;
  inquiries: ConsultationInquiry[];
  isSupabaseConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  refreshFromSupabase: () => Promise<void>;
  // Doctors
  addDoctor: (doc: Doctor) => Promise<void>;
  updateDoctor: (doc: Doctor) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  // Treatments
  addTreatment: (treat: Treatment) => Promise<void>;
  updateTreatment: (treat: Treatment) => Promise<void>;
  deleteTreatment: (id: string) => Promise<void>;
  // Stories
  addStory: (story: PatientStory) => Promise<void>;
  updateStory: (story: PatientStory) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  // Articles
  addArticle: (art: Article) => Promise<void>;
  updateArticle: (art: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  // Hospitals
  addHospital: (hosp: HospitalPartner) => Promise<void>;
  updateHospital: (hosp: HospitalPartner) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;
  // Sections
  updateSection: <K extends keyof SiteSectionsData>(section: K, data: SiteSectionsData[K]) => Promise<void>;
  // Inquiries
  addInquiry: (inquiry: Omit<ConsultationInquiry, 'id' | 'trackingId' | 'createdAt' | 'status'>) => Promise<string>;
  updateInquiryStatus: (id: string, status: ConsultationInquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  // Reset
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'avicinna_cms_v1';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);
  const [treatments, setTreatments] = useState<Treatment[]>(defaultTreatments);
  const [stories, setStories] = useState<PatientStory[]>(defaultStories);
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [hospitals, setHospitals] = useState<HospitalPartner[]>(defaultHospitals);
  const [sections, setSections] = useState<SiteSectionsData>(defaultSections);
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>(defaultInquiries);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Helper to fetch from Supabase
  const refreshFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setSyncStatus('syncing');
    try {
      const [secRes, hospRes, docRes, treatRes, storyRes, artRes, inqRes] = await Promise.all([
        fetchSectionsFromDb(),
        fetchHospitalsFromDb(),
        fetchDoctorsFromDb(),
        fetchTreatmentsFromDb(),
        fetchStoriesFromDb(),
        fetchArticlesFromDb(),
        fetchInquiriesFromDb(),
      ]);

      if (secRes) {
        setSections((prev) => ({ ...prev, ...secRes }));
      }
      if (hospRes && hospRes.length > 0) setHospitals(hospRes);
      if (docRes && docRes.length > 0) setDoctors(docRes);
      if (treatRes && treatRes.length > 0) setTreatments(treatRes);
      if (storyRes && storyRes.length > 0) setStories(storyRes);
      if (artRes && artRes.length > 0) setArticles(artRes);
      if (inqRes && inqRes.length > 0) setInquiries(inqRes);

      setSyncStatus('synced');
    } catch (err) {
      console.error('Error refreshing from Supabase:', err);
      setSyncStatus('error');
    }
  }, []);

  // Load initial data from localStorage first, then sync with Supabase
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.doctors) setDoctors(parsed.doctors);
        if (parsed.treatments) setTreatments(parsed.treatments);
        if (parsed.stories) setStories(parsed.stories);
        if (parsed.articles) setArticles(parsed.articles);
        if (parsed.hospitals) setHospitals(parsed.hospitals);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.inquiries) setInquiries(parsed.inquiries);
      }
    } catch (e) {
      console.error('Failed to load CMS data from localStorage:', e);
    }
    setIsLoaded(true);

    // If Supabase is configured, fetch live data
    if (isSupabaseConfigured) {
      refreshFromSupabase();
    }
  }, [refreshFromSupabase]);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        doctors,
        treatments,
        stories,
        articles,
        hospitals,
        sections,
        inquiries,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }
  }, [doctors, treatments, stories, articles, hospitals, sections, inquiries, isLoaded]);

  // Doctor CRUD
  const addDoctor = async (doc: Doctor) => {
    setDoctors((prev) => [doc, ...prev]);
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertDoctorToDb(doc);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const updateDoctor = async (doc: Doctor) => {
    setDoctors((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertDoctorToDb(doc);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteDoctor = async (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteDoctorFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Treatment CRUD
  const addTreatment = async (treat: Treatment) => {
    setTreatments((prev) => [treat, ...prev]);
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertTreatmentToDb(treat);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const updateTreatment = async (treat: Treatment) => {
    setTreatments((prev) => prev.map((t) => (t.id === treat.id ? treat : t)));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertTreatmentToDb(treat);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteTreatment = async (id: string) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteTreatmentFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Story CRUD
  const addStory = async (story: PatientStory) => {
    setStories((prev) => [story, ...prev]);
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertStoryToDb(story);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const updateStory = async (story: PatientStory) => {
    setStories((prev) => prev.map((s) => (s.id === story.id ? story : s)));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertStoryToDb(story);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteStory = async (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteStoryFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Article CRUD
  const addArticle = async (art: Article) => {
    setArticles((prev) => [art, ...prev]);
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertArticleToDb(art);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const updateArticle = async (art: Article) => {
    setArticles((prev) => prev.map((a) => (a.id === art.id ? art : a)));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertArticleToDb(art);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteArticleFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Hospital CRUD
  const addHospital = async (hosp: HospitalPartner) => {
    setHospitals((prev) => [hosp, ...prev]);
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertHospitalToDb(hosp);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const updateHospital = async (hosp: HospitalPartner) => {
    setHospitals((prev) => prev.map((h) => (h.id === hosp.id ? hosp : h)));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertHospitalToDb(hosp);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteHospital = async (id: string) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteHospitalFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Section Update
  const updateSection = async <K extends keyof SiteSectionsData>(
    section: K,
    data: SiteSectionsData[K]
  ) => {
    setSections((prev) => ({
      ...prev,
      [section]: data,
    }));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await upsertSectionToDb(section as string, data);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  // Inquiries
  const addInquiry = async (
    inquiryData: Omit<ConsultationInquiry, 'id' | 'trackingId' | 'createdAt' | 'status'>
  ): Promise<string> => {
    const trackingId = `AVIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInq: ConsultationInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      trackingId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setInquiries((prev) => [newInq, ...prev]);

    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      await insertInquiryToDb(newInq);
      setSyncStatus('synced');
    }

    return trackingId;
  };

  const updateInquiryStatus = async (id: string, status: ConsultationInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await updateInquiryStatusInDb(id, status);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await deleteInquiryFromDb(id);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const resetToDefaults = () => {
    setDoctors(defaultDoctors);
    setTreatments(defaultTreatments);
    setStories(defaultStories);
    setArticles(defaultArticles);
    setHospitals(defaultHospitals);
    setSections(defaultSections);
    setInquiries(defaultInquiries);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        doctors,
        treatments,
        stories,
        articles,
        hospitals,
        sections,
        inquiries,
        isSupabaseConnected: isSupabaseConfigured,
        syncStatus,
        refreshFromSupabase,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addTreatment,
        updateTreatment,
        deleteTreatment,
        addStory,
        updateStory,
        deleteStory,
        addArticle,
        updateArticle,
        deleteArticle,
        addHospital,
        updateHospital,
        deleteHospital,
        updateSection,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
