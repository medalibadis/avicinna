'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Doctor, doctorsData } from '@/data/doctors';
import { Treatment, treatmentsData } from '@/data/treatments';
import { PatientStory, patientStoriesData } from '@/data/stories';
import { Article, articlesData } from '@/data/articles';
import { HospitalPartner, hospitalsData } from '@/data/hospitals';
import { initialPagesData } from '@/data/pages';
import { initialSiteConfig, type SiteConfig } from '@/data/siteConfig';
import { SocialVideo, initialSocialVideos } from '@/data/socialVideos';
import {
  defaultSections,
  mergeSectionsWithDefaults,
  type ConsultationInquiry,
  type SiteSectionsData,
} from '@/data/defaultSections';
import type { CmsPage, MediaItem, RedirectRule } from '@/types/cms';
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
  deleteInquiryFromDb,
} from '@/lib/supabase';

export { defaultSections, type ConsultationInquiry, type SiteSectionsData };

const DEMO_INQUIRY_IDS = new Set([
  'inq-1',
  'inq-2',
  'inq-3',
  'inq-101',
  'inq-102',
  'inq-103',
  'inq-104',
  'inq-105',
  'inq-106',
]);

export interface DataContextType {
  doctors: Doctor[];
  treatments: Treatment[];
  stories: PatientStory[];
  articles: Article[];
  hospitals: HospitalPartner[];
  pages: CmsPage[];
  redirects: RedirectRule[];
  media: MediaItem[];
  settings: SiteConfig;
  sections: SiteSectionsData;
  inquiries: ConsultationInquiry[];
  isSupabaseConnected: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  refreshFromSupabase: () => Promise<void>;
  refreshFromServer: (includeAdmin?: boolean) => Promise<void>;
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
  // Standalone Pages
  addPage: (page: CmsPage) => Promise<void>;
  updatePage: (page: CmsPage) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  // Settings
  updateSettings: (nextSettings: SiteConfig) => Promise<void>;
  // Sections
  updateSection: <K extends keyof SiteSectionsData>(
    section: K,
    data: SiteSectionsData[K]
  ) => Promise<void>;
  updateAllSections: (nextSections: SiteSectionsData) => Promise<boolean>;
  // Inquiries
  addInquiry: (
    inquiry: Omit<ConsultationInquiry, 'id' | 'trackingId' | 'createdAt' | 'status'>
  ) => Promise<string>;
  updateInquiryStatus: (id: string, status: ConsultationInquiry['status']) => Promise<void>;
  updateInquiry: (
    id: string,
    patch: {
      status?: ConsultationInquiry['status'];
      assignedTo?: string | null;
      assignedName?: string | null;
      internalNote?: string;
    }
  ) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  // Social Videos / Reels
  socialVideos: SocialVideo[];
  addSocialVideo: (video: SocialVideo) => Promise<void>;
  updateSocialVideo: (video: SocialVideo) => Promise<void>;
  deleteSocialVideo: (id: string) => Promise<void>;
  // Redirects & Media refreshers
  setRedirects: React.Dispatch<React.SetStateAction<RedirectRule[]>>;
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  // Clear local cache
  clearLocalCache: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'avicinna_cms_v10';

function sanitizeHospitals(rawList?: HospitalPartner[] | null): HospitalPartner[] {
  if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
    return hospitalsData;
  }
  return rawList.map((hosp) => {
    const canonical = hospitalsData.find((h) => h.id === hosp.id);
    return {
      ...canonical,
      ...hosp,
      technologies: hosp.technologies || canonical?.technologies || {
        ar: ['روبوت دافنشي الجراحي', 'رنين مغناطيسي 3 تسلا'],
        en: ['Da Vinci Robotic Surgery', '3T MRI'],
        fr: ['Chirurgie Robotique Da Vinci', 'IRM 3T'],
      },
      specialties: hosp.specialties?.length
        ? hosp.specialties
        : canonical?.specialties || ['cardiac-surgery', 'oncology', 'orthopedics'],
      cityCategory: hosp.cityCategory || canonical?.cityCategory || 'istanbul-europe',
      address:
        hosp.address ||
        canonical?.address || {
          ar: hosp.city?.ar || '',
          en: hosp.city?.en || '',
          fr: hosp.city?.fr || '',
        },
      accreditationBadge: hosp.accreditationBadge || canonical?.accreditationBadge || 'JCI',
      bedsCount: hosp.bedsCount || canonical?.bedsCount || 250,
      icuBedsCount: hosp.icuBedsCount || canonical?.icuBedsCount || 50,
      operatingRoomsCount: hosp.operatingRoomsCount || canonical?.operatingRoomsCount || 10,
      establishedYear: hosp.establishedYear || canonical?.establishedYear || 2010,
      rating: hosp.rating || canonical?.rating || 4.9,
      reviewsCount: hosp.reviewsCount || canonical?.reviewsCount || 150,
    };
  });
}

function sanitizeDoctors(rawList?: Doctor[] | null): Doctor[] {
  if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
    return doctorsData;
  }
  return rawList.map((doc) => {
    const canonical = doctorsData.find((d) => d.id === doc.id);
    const isPlaceholderVideo = (url?: string) =>
      Boolean(
        url &&
          (url.includes('a3ICNMQW7Ok') ||
            url.includes('5qap5aO4i9A') ||
            url.toLowerCase().includes('wildlife'))
      );

    const cleanVideos = (doc.videos || []).filter((v) => v?.url && !isPlaceholderVideo(v.url));
    const hasValidDocVideo =
      doc.videoUrl && !isPlaceholderVideo(doc.videoUrl) && doc.videoUrl.trim().length > 0;
    const cleanVideoUrl = hasValidDocVideo ? doc.videoUrl!.trim() : undefined;
    const cleanVideoTitle = cleanVideoUrl ? doc.videoTitle : undefined;

    return {
      ...canonical,
      ...doc,
      hospitalId: doc.hospitalId || canonical?.hospitalId || 'acibadem-altunizade',
      procedures: doc.procedures || canonical?.procedures || { ar: [], en: [], fr: [] },
      areasOfExpertise:
        doc.areasOfExpertise || canonical?.areasOfExpertise || { ar: [], en: [], fr: [] },
      education: doc.education || canonical?.education || { ar: [], en: [], fr: [] },
      careerHistory: doc.careerHistory || canonical?.careerHistory || [],
      memberships: doc.memberships || canonical?.memberships || { ar: [], en: [], fr: [] },
      technologies: doc.technologies || canonical?.technologies || { ar: [], en: [], fr: [] },
      languages: doc.languages?.length
        ? doc.languages
        : canonical?.languages || ['العربية (مترجم)', 'English', 'Türkçe'],
      videos: cleanVideos,
      videoUrl: cleanVideoUrl,
      videoTitle: cleanVideoTitle,
      surgeriesCount: doc.surgeriesCount || canonical?.surgeriesCount || 2500,
      publicationsCount: doc.publicationsCount || canonical?.publicationsCount || 45,
    };
  });
}

function sanitizeStories(rawList?: PatientStory[] | null): PatientStory[] {
  if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
    return patientStoriesData;
  }
  return rawList.map((story) => {
    const canonical = patientStoriesData.find(
      (s) => s.id === story.id || s.slug === story.slug
    );
    const resolvedName =
      canonical?.patientName ||
      (typeof story.patientName === 'object' && story.patientName !== null
        ? story.patientName
        : {
            ar: String(story.patientName || ''),
            en: String(story.patientName || ''),
            fr: String(story.patientName || ''),
          });

    return {
      ...canonical,
      ...story,
      patientName: resolvedName,
    };
  });
}

async function persistCmsEntity(entityType: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function DataProvider({
  children,
  initialSections,
}: {
  children: React.ReactNode;
  initialSections?: SiteSectionsData;
}) {
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [treatments, setTreatments] = useState<Treatment[]>(treatmentsData);
  const [stories, setStories] = useState<PatientStory[]>(patientStoriesData);
  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [hospitals, setHospitals] = useState<HospitalPartner[]>(hospitalsData);
  const [pages, setPages] = useState<CmsPage[]>(initialPagesData);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SiteConfig>(initialSiteConfig);
  const [sections, setSections] = useState<SiteSectionsData>(() =>
    mergeSectionsWithDefaults(initialSections)
  );
  const sectionsRef = useRef<SiteSectionsData>(sections);
  sectionsRef.current = sections;
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>([]);
  const [socialVideos, setSocialVideos] = useState<SocialVideo[]>(initialSocialVideos);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const refreshFromServer = useCallback(async (includeAdmin = false) => {
    try {
      const endpoint = includeAdmin ? '/api/cms?admin=true' : '/api/cms';
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.doctors) setDoctors(sanitizeDoctors(payload.doctors));
      if (payload.hospitals) setHospitals(sanitizeHospitals(payload.hospitals));
      if (payload.treatments) setTreatments(payload.treatments);
      if (payload.stories) setStories(sanitizeStories(payload.stories));
      if (payload.articles) setArticles(payload.articles);
      if (payload.pages) setPages(payload.pages);
      if (payload.sections) setSections(mergeSectionsWithDefaults(payload.sections));
      if (payload.socialVideos) setSocialVideos(payload.socialVideos);

      if (includeAdmin) {
        if (payload.settings) setSettings(payload.settings);
        if (Array.isArray(payload.redirects)) setRedirects(payload.redirects);
        if (Array.isArray(payload.media)) setMedia(payload.media);
        if (Array.isArray(payload.inquiries)) {
          setInquiries(payload.inquiries.filter((i: ConsultationInquiry) => !DEMO_INQUIRY_IDS.has(i.id)));
        }
      } else if (payload.publicSettings) {
        setSettings((prev) => ({
          ...prev,
          contact: payload.publicSettings.contact || prev.contact,
          sectionsVisibility: payload.publicSettings.sectionsVisibility || prev.sectionsVisibility,
          tracking: payload.publicSettings.tracking
            ? { ...prev.tracking!, ...payload.publicSettings.tracking }
            : prev.tracking,
        }));
      }
    } catch {
      // ignore background sync failures cleanly
    }
  }, []);

  const refreshFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      await refreshFromServer(false);
      return;
    }
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

      if (secRes) setSections((prev) => mergeSectionsWithDefaults({ ...prev, ...secRes }));
      setHospitals(sanitizeHospitals(hospRes));
      setDoctors(sanitizeDoctors(docRes));
      setTreatments(treatRes ?? treatmentsData);
      setStories(sanitizeStories(storyRes ?? patientStoriesData));
      setArticles(artRes ?? articlesData);
      setInquiries((inqRes || []).filter((i) => !DEMO_INQUIRY_IDS.has(i.id)));
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error refreshing from Supabase:', err);
      setSyncStatus('error');
    }
  }, [refreshFromServer]);

  // Initial client hydration
  useEffect(() => {
    try {
      [
        'avicinna_cms_v1',
        'avicinna_cms_v2',
        'avicinna_cms_v3',
        'avicinna_cms_v4',
        'avicinna_cms_v8',
        'avicinna_cms_v9',
      ].forEach((k) => localStorage.removeItem(k));

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.doctors) setDoctors(sanitizeDoctors(parsed.doctors));
        if (parsed.treatments?.length) setTreatments(parsed.treatments);
        if (parsed.stories) setStories(sanitizeStories(parsed.stories));
        if (parsed.articles?.length) setArticles(parsed.articles);
        if (parsed.hospitals) setHospitals(sanitizeHospitals(parsed.hospitals));
        if (parsed.pages?.length) setPages(parsed.pages);
        if (!initialSections && parsed.sections) {
          setSections(mergeSectionsWithDefaults(parsed.sections));
        }
      }
    } catch {
      // use canonical defaults
    }

    setIsLoaded(true);

    const isAdminPath =
      typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    refreshFromServer(isAdminPath);

    if (isSupabaseConfigured) {
      refreshFromSupabase();
    }
  }, [refreshFromServer, refreshFromSupabase]);

  // Lightweight local cache mirror (excluding sensitive inquiries & tokens)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          doctors,
          treatments,
          stories,
          articles,
          hospitals,
          pages,
          sections,
        })
      );
      localStorage.setItem('avicinna_social_videos', JSON.stringify(socialVideos));
    } catch {
      // ignore storage quota errors
    }
  }, [doctors, treatments, stories, articles, hospitals, pages, sections, socialVideos, isLoaded]);

  // Doctor CRUD
  const addDoctor = async (doc: Doctor) => {
    const nextDoc = { ...doc, updatedAt: new Date().toISOString() };
    const nextList = [nextDoc, ...doctors];
    setDoctors(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('doctors', nextList);
    const okDb = isSupabaseConfigured ? await upsertDoctorToDb(nextDoc) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const updateDoctor = async (doc: Doctor) => {
    const nextDoc = { ...doc, updatedAt: new Date().toISOString() };
    const nextList = doctors.map((d) => (d.id === nextDoc.id ? nextDoc : d));
    setDoctors(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('doctors', nextList);
    const okDb = isSupabaseConfigured ? await upsertDoctorToDb(nextDoc) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const deleteDoctor = async (id: string) => {
    const nextList = doctors.filter((d) => d.id !== id);
    setDoctors(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('doctors', nextList);
    const okDb = isSupabaseConfigured ? await deleteDoctorFromDb(id) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Treatment CRUD
  const addTreatment = async (treat: Treatment) => {
    const nextTreat = { ...treat, updatedAt: new Date().toISOString() };
    const nextList = [nextTreat, ...treatments];
    setTreatments(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('treatments', nextList);
    const okDb = isSupabaseConfigured ? await upsertTreatmentToDb(nextTreat) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const updateTreatment = async (treat: Treatment) => {
    const nextTreat = { ...treat, updatedAt: new Date().toISOString() };
    const nextList = treatments.map((t) => (t.id === nextTreat.id ? nextTreat : t));
    setTreatments(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('treatments', nextList);
    const okDb = isSupabaseConfigured ? await upsertTreatmentToDb(nextTreat) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const deleteTreatment = async (id: string) => {
    const nextList = treatments.filter((t) => t.id !== id);
    setTreatments(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('treatments', nextList);
    const okDb = isSupabaseConfigured ? await deleteTreatmentFromDb(id) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Story CRUD
  const addStory = async (story: PatientStory) => {
    const nextStory = { ...story, updatedAt: new Date().toISOString() };
    const nextList = [nextStory, ...stories];
    setStories(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('stories', nextList);
    const okDb = isSupabaseConfigured ? await upsertStoryToDb(nextStory) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const updateStory = async (story: PatientStory) => {
    const nextStory = { ...story, updatedAt: new Date().toISOString() };
    const nextList = stories.map((s) => (s.id === nextStory.id ? nextStory : s));
    setStories(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('stories', nextList);
    const okDb = isSupabaseConfigured ? await upsertStoryToDb(nextStory) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const deleteStory = async (id: string) => {
    const nextList = stories.filter((s) => s.id !== id);
    setStories(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('stories', nextList);
    const okDb = isSupabaseConfigured ? await deleteStoryFromDb(id) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Article CRUD
  const addArticle = async (art: Article) => {
    const nextArt = { ...art, updatedAt: new Date().toISOString() };
    const nextList = [nextArt, ...articles];
    setArticles(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('articles', nextList);
    const okDb = isSupabaseConfigured ? await upsertArticleToDb(nextArt) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const updateArticle = async (art: Article) => {
    const nextArt = { ...art, updatedAt: new Date().toISOString() };
    const nextList = articles.map((a) => (a.id === nextArt.id ? nextArt : a));
    setArticles(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('articles', nextList);
    const okDb = isSupabaseConfigured ? await upsertArticleToDb(nextArt) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const deleteArticle = async (id: string) => {
    const nextList = articles.filter((a) => a.id !== id);
    setArticles(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('articles', nextList);
    const okDb = isSupabaseConfigured ? await deleteArticleFromDb(id) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Hospital CRUD
  const addHospital = async (hosp: HospitalPartner) => {
    const nextHosp = { ...hosp, updatedAt: new Date().toISOString() };
    const nextList = [nextHosp, ...hospitals];
    setHospitals(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('hospitals', nextList);
    const okDb = isSupabaseConfigured ? await upsertHospitalToDb(nextHosp) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const updateHospital = async (hosp: HospitalPartner) => {
    const nextHosp = { ...hosp, updatedAt: new Date().toISOString() };
    const nextList = hospitals.map((h) => (h.id === nextHosp.id ? nextHosp : h));
    setHospitals(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('hospitals', nextList);
    const okDb = isSupabaseConfigured ? await upsertHospitalToDb(nextHosp) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  const deleteHospital = async (id: string) => {
    const nextList = hospitals.filter((h) => h.id !== id);
    setHospitals(nextList);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('hospitals', nextList);
    const okDb = isSupabaseConfigured ? await deleteHospitalFromDb(id) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Standalone Pages CRUD
  const addPage = async (page: CmsPage) => {
    const now = new Date().toISOString();
    const nextPage: CmsPage = { ...page, createdAt: page.createdAt || now, updatedAt: now };
    const nextList = [nextPage, ...pages];
    setPages(nextList);
    setSyncStatus('syncing');
    const ok = await persistCmsEntity('pages', nextList);
    setSyncStatus(ok ? 'synced' : 'error');
  };

  const updatePage = async (page: CmsPage) => {
    const nextPage: CmsPage = { ...page, updatedAt: new Date().toISOString() };
    const nextList = pages.map((p) => (p.id === nextPage.id ? nextPage : p));
    setPages(nextList);
    setSyncStatus('syncing');
    const ok = await persistCmsEntity('pages', nextList);
    setSyncStatus(ok ? 'synced' : 'error');
  };

  const deletePage = async (id: string) => {
    const nextList = pages.filter((p) => p.id !== id || p.isSystem);
    setPages(nextList);
    setSyncStatus('syncing');
    const ok = await persistCmsEntity('pages', nextList);
    setSyncStatus(ok ? 'synced' : 'error');
  };

  // Site Settings
  const updateSettings = async (nextSettings: SiteConfig) => {
    setSettings(nextSettings);
    setSyncStatus('syncing');
    const ok = await persistCmsEntity('settings', nextSettings);
    setSyncStatus(ok ? 'synced' : 'error');
  };

  // Section Update (uses ref to avoid stale-closure overwrites when updating sequentially)
  const updateSection = async <K extends keyof SiteSectionsData>(
    section: K,
    data: SiteSectionsData[K]
  ) => {
    const nextSections = {
      ...sectionsRef.current,
      [section]: data,
    };
    sectionsRef.current = nextSections;
    setSections(nextSections);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('sections', nextSections);
    const okDb = isSupabaseConfigured ? await upsertSectionToDb(section as string, data) : true;
    setSyncStatus(okServer && okDb ? 'synced' : 'error');
  };

  // Atomic Full-Sections Save (used by /admin/sections so all tabs save in a single request)
  const updateAllSections = async (nextSections: SiteSectionsData): Promise<boolean> => {
    const merged = mergeSectionsWithDefaults(nextSections);
    sectionsRef.current = merged;
    setSections(merged);
    setSyncStatus('syncing');
    const okServer = await persistCmsEntity('sections', merged);
    let okDb = true;
    if (isSupabaseConfigured) {
      const results = await Promise.all(
        (Object.keys(merged) as Array<keyof SiteSectionsData>).map((k) =>
          upsertSectionToDb(k as string, merged[k])
        )
      );
      okDb = results.every(Boolean);
    }
    const ok = okServer && okDb;
    setSyncStatus(ok ? 'synced' : 'error');
    return ok;
  };

  // Inquiries
  const addInquiry = async (
    inquiryData: Omit<ConsultationInquiry, 'id' | 'trackingId' | 'createdAt' | 'status'>
  ): Promise<string> => {
    const res = await fetch('/api/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to submit inquiry');
    }

    const data = await res.json();
    if (data.inquiry) {
      setInquiries((prev) => [data.inquiry, ...prev]);
    }
    return data.trackingId || `AV-${Math.floor(100000 + Math.random() * 899999)}`;
  };

  const updateInquiry = async (
    id: string,
    patch: {
      status?: ConsultationInquiry['status'];
      assignedTo?: string | null;
      assignedName?: string | null;
      internalNote?: string;
    }
  ) => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.inquiry) {
          setInquiries((prev) => prev.map((inq) => (inq.id === id ? data.inquiry : inq)));
        }
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const updateInquiryStatus = async (id: string, status: ConsultationInquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    await updateInquiry(id, { status });
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    setSyncStatus('syncing');
    const res = await fetch(`/api/consultation?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const okDb = isSupabaseConfigured ? await deleteInquiryFromDb(id) : true;
    setSyncStatus(res.ok && okDb ? 'synced' : 'error');
  };

  const clearLocalCache = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDoctors(doctorsData);
    setTreatments(treatmentsData);
    setStories(patientStoriesData);
    setArticles(articlesData);
    setHospitals(hospitalsData);
    setPages(initialPagesData);
    setSections(defaultSections);
    refreshFromServer(
      typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
    );
  };

  // Social Videos CRUD
  const addSocialVideo = async (video: SocialVideo) => {
    const nextList = [video, ...socialVideos];
    setSocialVideos(nextList);
    await persistCmsEntity('socialVideos', nextList);
  };

  const updateSocialVideo = async (video: SocialVideo) => {
    const nextList = socialVideos.map((v) => (v.id === video.id ? video : v));
    setSocialVideos(nextList);
    await persistCmsEntity('socialVideos', nextList);
  };

  const deleteSocialVideo = async (id: string) => {
    const nextList = socialVideos.filter((v) => v.id !== id);
    setSocialVideos(nextList);
    await persistCmsEntity('socialVideos', nextList);
  };

  return (
    <DataContext.Provider
      value={{
        doctors,
        treatments,
        stories,
        articles,
        hospitals,
        pages,
        redirects,
        media,
        settings,
        sections,
        inquiries,
        socialVideos,
        isSupabaseConnected: isSupabaseConfigured,
        syncStatus,
        refreshFromSupabase,
        refreshFromServer,
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
        addPage,
        updatePage,
        deletePage,
        updateSettings,
        updateSection,
        updateAllSections,
        addInquiry,
        updateInquiryStatus,
        updateInquiry,
        deleteInquiry,
        addSocialVideo,
        updateSocialVideo,
        deleteSocialVideo,
        setRedirects,
        setMedia,
        clearLocalCache,
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
