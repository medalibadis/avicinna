export type Locale = 'ar' | 'en' | 'fr';

export interface LocalizedString {
  ar: string;
  en: string;
  fr: string;
}

export interface LocalizedSlugs {
  ar?: string;
  en?: string;
  fr?: string;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  focusKeyword?: string;
}

export interface LocalizedSeo {
  ar?: SeoMeta;
  en?: SeoMeta;
  fr?: SeoMeta;
}

export interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface MedicalReviewerInfo {
  doctorId?: string;
  name: LocalizedString;
  role: LocalizedString;
}

export interface CmsPage {
  id: string;
  slug: string;
  slugs?: LocalizedSlugs;
  title: LocalizedString;
  subtitle?: LocalizedString;
  contentHtml: LocalizedString;
  seo?: LocalizedSeo;
  status: 'published' | 'draft';
  isSystem?: boolean;
  showInFooter?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302 | 307 | 308;
  isActive: boolean;
  hits: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: LocalizedString;
  caption?: LocalizedString;
  folder: string;
  uploadedBy?: string;
  createdAt: string;
}

export type AdminRole = 'admin' | 'editor' | 'coordinator';

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: AdminRole;
  passwordHash: string;
  totpSecret?: string;
  totpEnabled: boolean;
  isActive: boolean;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type SafeAdminUser = Omit<AdminUserRecord, 'passwordHash' | 'totpSecret'>;

export interface ActivityLogEntry {
  id: string;
  actorId: string;
  actorUsername: string;
  actorRole: AdminRole | 'system' | 'anonymous';
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface TrackingConfig {
  enableTracking: boolean;
  ga4MeasurementId: string;
  metaPixelId: string;
  metaCapiAccessToken: string;
  metaTestEventCode?: string;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  emailTo: string;
  emailFrom?: string;
  resendApiKey?: string;
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  whatsappWebhookEnabled: boolean;
  whatsappWebhookUrl?: string;
  whatsappCloudToken?: string;
  whatsappPhoneNumberId?: string;
  whatsappNotifyNumber?: string;
}

export interface InquiryAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface InquiryInternalNote {
  id: string;
  author: string;
  authorRole?: string;
  text: string;
  createdAt: string;
}

export interface InquiryNotificationLog {
  channel: 'email' | 'telegram' | 'whatsapp';
  status: 'sent' | 'skipped' | 'failed';
  detail?: string;
  at: string;
}

