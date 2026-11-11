import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { doctorsData, type Doctor } from '@/data/doctors';
import { hospitalsData, type HospitalPartner } from '@/data/hospitals';
import { treatmentsData, type Treatment } from '@/data/treatments';
import { patientStoriesData, type PatientStory } from '@/data/stories';
import { articlesData, type Article } from '@/data/articles';
import { initialPagesData } from '@/data/pages';
import { initialSocialVideos, type SocialVideo } from '@/data/socialVideos';
import { initialSiteConfig, type SiteConfig } from '@/data/siteConfig';
import {
  defaultSections,
  mergeSectionsWithDefaults,
  type SiteSectionsData,
  type ConsultationInquiry,
} from '@/data/defaultSections';
import { DEFAULT_ENTITY_UPDATED_AT } from '@/lib/i18nRoutes';
import type {
  ActivityLogEntry,
  AdminRole,
  AdminUserRecord,
  CmsPage,
  MediaItem,
  RedirectRule,
  SafeAdminUser,
} from '@/types/cms';

export interface CmsStoreState {
  version: number;
  sections: SiteSectionsData;
  settings: SiteConfig;
  doctors: Doctor[];
  hospitals: HospitalPartner[];
  treatments: Treatment[];
  stories: PatientStory[];
  articles: Article[];
  pages: CmsPage[];
  redirects: RedirectRule[];
  media: MediaItem[];
  socialVideos: SocialVideo[];
  inquiries: ConsultationInquiry[];
  users: AdminUserRecord[];
  activityLogs: ActivityLogEntry[];
}

function resolveDataDir(): string {
  const custom = process.env.AVICINNA_DATA_DIR?.trim();
  if (custom) return custom;
  return path.join(/*turbopackIgnore: true*/ process.cwd(), '.avicinna-data');
}

const DATA_DIR = resolveDataDir();
const STORE_PATH = path.join(/*turbopackIgnore: true*/ DATA_DIR, 'store.json');
const MEDICAL_FILES_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, 'medical-files');
const MEDIA_UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, 'media-uploads');

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

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, hashHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hashHex, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

export function sanitizeUser(user: AdminUserRecord): SafeAdminUser {
  const { passwordHash: _ph, totpSecret: _ts, ...safe } = user;
  return safe;
}

function buildDefaultUsers(): AdminUserRecord[] {
  const defaultUsername = (process.env.ADMIN_USER || 'avicinna_core_admin').trim().toLowerCase();
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Avic#99_TrK!Xp2026_mZ#99';
  const now = DEFAULT_ENTITY_UPDATED_AT;
  return [
    {
      id: 'usr-root-admin',
      username: defaultUsername,
      email: 'sysadmin@avicinna.com',
      fullName: 'AVICINNA Super Administrator',
      role: 'admin',
      passwordHash: hashPassword(defaultPassword),
      totpEnabled: false,
      isActive: true,
      tokenVersion: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function withSeedTimestamps<T extends { updatedAt?: string }>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    updatedAt: item.updatedAt || DEFAULT_ENTITY_UPDATED_AT,
  }));
}

function createInitialStore(): CmsStoreState {
  return {
    version: 2,
    sections: defaultSections,
    settings: initialSiteConfig,
    doctors: withSeedTimestamps(doctorsData),
    hospitals: withSeedTimestamps(hospitalsData),
    treatments: withSeedTimestamps(treatmentsData),
    stories: withSeedTimestamps(patientStoriesData),
    articles: articlesData.map((a) => ({
      ...a,
      updatedAt: a.updatedAt || (a.updatedDate ? `${a.updatedDate}T10:00:00.000Z` : `${a.publishedDate}T10:00:00.000Z`),
    })),
    pages: initialPagesData,
    redirects: [],
    media: [],
    socialVideos: initialSocialVideos,
    inquiries: [], // ZERO demo or test leads
    users: buildDefaultUsers(),
    activityLogs: [],
  };
}

declare global {
  var __avicinnaCmsStore: CmsStoreState | undefined;
  var __avicinnaStoreMtime: number | undefined;
}

function ensureDirs() {
  if (!fs.existsSync(/*turbopackIgnore: true*/ DATA_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(/*turbopackIgnore: true*/ MEDICAL_FILES_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ MEDICAL_FILES_DIR, { recursive: true });
  }
  if (!fs.existsSync(/*turbopackIgnore: true*/ MEDIA_UPLOADS_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ MEDIA_UPLOADS_DIR, { recursive: true });
  }
}

function normalizeLoadedStore(raw: Partial<CmsStoreState>): CmsStoreState {
  const base = createInitialStore();
  const cleanInquiries = Array.isArray(raw.inquiries)
    ? raw.inquiries.filter((inq) => !DEMO_INQUIRY_IDS.has(inq.id))
    : [];

  return {
    version: raw.version || base.version,
    sections: mergeSectionsWithDefaults(raw.sections),
    settings: raw.settings
      ? {
          ...base.settings,
          ...raw.settings,
          contact: { ...base.settings.contact, ...(raw.settings.contact || {}) },
          sectionsVisibility: {
            ...base.settings.sectionsVisibility,
            ...(raw.settings.sectionsVisibility || {}),
          },
          tracking: { ...base.settings.tracking!, ...(raw.settings.tracking || {}) },
          notifications: { ...base.settings.notifications!, ...(raw.settings.notifications || {}) },
        }
      : base.settings,
    doctors: raw.doctors?.length ? withSeedTimestamps(raw.doctors) : base.doctors,
    hospitals: raw.hospitals?.length ? withSeedTimestamps(raw.hospitals) : base.hospitals,
    treatments: raw.treatments?.length ? withSeedTimestamps(raw.treatments) : base.treatments,
    stories: raw.stories?.length ? withSeedTimestamps(raw.stories) : base.stories,
    articles: raw.articles?.length ? raw.articles : base.articles,
    pages: raw.pages?.length ? raw.pages : base.pages,
    redirects: Array.isArray(raw.redirects) ? raw.redirects : [],
    media: Array.isArray(raw.media) ? raw.media : [],
    socialVideos: raw.socialVideos?.length ? raw.socialVideos : base.socialVideos,
    inquiries: cleanInquiries,
    users: raw.users?.length ? raw.users : base.users,
    activityLogs: Array.isArray(raw.activityLogs) ? raw.activityLogs : [],
  };
}

export function readCmsStore(): CmsStoreState {
  try {
    ensureDirs();
    if (!fs.existsSync(/*turbopackIgnore: true*/ STORE_PATH)) {
      const initial = createInitialStore();
      fs.writeFileSync(/*turbopackIgnore: true*/ STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      globalThis.__avicinnaCmsStore = initial;
      globalThis.__avicinnaStoreMtime = fs.statSync(/*turbopackIgnore: true*/ STORE_PATH).mtimeMs;
      return initial;
    }

    const stat = fs.statSync(/*turbopackIgnore: true*/ STORE_PATH);
    if (globalThis.__avicinnaCmsStore && globalThis.__avicinnaStoreMtime === stat.mtimeMs) {
      return globalThis.__avicinnaCmsStore;
    }

    const text = fs.readFileSync(/*turbopackIgnore: true*/ STORE_PATH, 'utf8');
    const parsed = JSON.parse(text) as Partial<CmsStoreState>;
    const normalized = normalizeLoadedStore(parsed);
    globalThis.__avicinnaCmsStore = normalized;
    globalThis.__avicinnaStoreMtime = stat.mtimeMs;
    return normalized;
  } catch (err) {
    console.warn('[cmsStore] Fallback to in-memory initial store:', err);
    if (!globalThis.__avicinnaCmsStore) {
      globalThis.__avicinnaCmsStore = createInitialStore();
    }
    return globalThis.__avicinnaCmsStore;
  }
}

export function writeCmsStore(nextState: CmsStoreState): CmsStoreState {
  globalThis.__avicinnaCmsStore = nextState;
  try {
    ensureDirs();
    const tmpPath = `${STORE_PATH}.${process.pid}.tmp`;
    fs.writeFileSync(/*turbopackIgnore: true*/ tmpPath, JSON.stringify(nextState, null, 2), 'utf8');
    fs.renameSync(/*turbopackIgnore: true*/ tmpPath, /*turbopackIgnore: true*/ STORE_PATH);
    globalThis.__avicinnaStoreMtime = fs.statSync(/*turbopackIgnore: true*/ STORE_PATH).mtimeMs;
  } catch (err) {
    console.error('[cmsStore] Failed writing store.json:', err);
  }
  return nextState;
}

export function updateCmsStore(updater: (current: CmsStoreState) => CmsStoreState): CmsStoreState {
  const current = readCmsStore();
  const next = updater(current);
  return writeCmsStore(next);
}

export function appendActivityLog(entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>): ActivityLogEntry {
  const fullEntry: ActivityLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  updateCmsStore((state) => ({
    ...state,
    activityLogs: [fullEntry, ...state.activityLogs].slice(0, 500),
  }));
  return fullEntry;
}

export function normalizeRedirectPath(p: string): string {
  const trimmed = p.trim();
  if (!trimmed) return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.length > 1 ? withLeading.replace(/\/+$/, '') : withLeading;
}

export function findMatchingRedirect(pathname: string): RedirectRule | null {
  const store = readCmsStore();
  const clean = normalizeRedirectPath(pathname);
  return (
    store.redirects.find(
      (r) => r.isActive && normalizeRedirectPath(r.fromPath).toLowerCase() === clean.toLowerCase()
    ) || null
  );
}

export function incrementRedirectHit(id: string): void {
  updateCmsStore((state) => ({
    ...state,
    redirects: state.redirects.map((r) => (r.id === id ? { ...r, hits: (r.hits || 0) + 1 } : r)),
  }));
}

export function findUserByIdentifier(identifier: string): AdminUserRecord | undefined {
  const store = readCmsStore();
  const clean = identifier.trim().toLowerCase();
  return store.users.find(
    (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
  );
}

export function findUserById(id: string): AdminUserRecord | undefined {
  const store = readCmsStore();
  return store.users.find((u) => u.id === id);
}

export function getPublicTrackingConfig() {
  const { settings } = readCmsStore();
  const t = settings.tracking;
  return {
    enableTracking: Boolean(t?.enableTracking),
    ga4MeasurementId: t?.ga4MeasurementId || process.env.NEXT_PUBLIC_GA4_ID || '',
    metaPixelId: t?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  };
}

export function getPublicSections(): SiteSectionsData {
  const { sections } = readCmsStore();
  return mergeSectionsWithDefaults(sections);
}

export function getDataDirectory(): string {
  ensureDirs();
  return DATA_DIR;
}

export function getMedicalFilesDirectory(): string {
  ensureDirs();
  return MEDICAL_FILES_DIR;
}

export function getMediaUploadsDirectory(): string {
  ensureDirs();
  return MEDIA_UPLOADS_DIR;
}

export function canAccessRole(userRole: AdminRole, allowed: AdminRole[]): boolean {
  return allowed.includes(userRole);
}

