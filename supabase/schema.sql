-- ==============================================================================
-- AVICINNA MEDICAL TOURISM PLATFORM — SUPABASE POSTGRESQL SCHEMA
-- Comprehensive Database Schema for Sections, Hospitals, Doctors, Treatments,
-- Patient Stories, Blog Articles, and Consultation Leads.
-- ==============================================================================

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE 1: SITE SECTIONS (Homepage dynamic sections)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_sections (
    id TEXT PRIMARY KEY, -- 'hero', 'stats', 'about', 'whyChoose', 'finalCta'
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLE 2: HOSPITALS & CLINICAL PARTNERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    slug TEXT,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL, -- { ar, en, fr }
    seo JSONB DEFAULT '{}'::JSONB NOT NULL, -- { ar: {title,description,focusKeyword}, en, fr }
    name JSONB NOT NULL, -- { ar, en, fr }
    type JSONB NOT NULL, -- { ar, en, fr }
    city JSONB NOT NULL, -- { ar, en, fr }
    city_category TEXT DEFAULT 'istanbul-europe' NOT NULL,
    address JSONB DEFAULT '{}'::JSONB NOT NULL,
    accreditation TEXT NOT NULL,
    accreditation_badge TEXT DEFAULT 'JCI' NOT NULL,
    description JSONB NOT NULL, -- { ar, en, fr }
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::JSONB NOT NULL,
    featured BOOLEAN DEFAULT true NOT NULL,
    specialties_count INTEGER DEFAULT 20 NOT NULL,
    beds_count INTEGER DEFAULT 250 NOT NULL,
    icu_beds_count INTEGER DEFAULT 50 NOT NULL,
    operating_rooms_count INTEGER DEFAULT 12 NOT NULL,
    established_year INTEGER DEFAULT 2010 NOT NULL,
    technologies JSONB DEFAULT '{}'::JSONB NOT NULL,
    specialties JSONB DEFAULT '[]'::JSONB NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.9 NOT NULL,
    reviews_count INTEGER DEFAULT 150 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hospitals_featured ON public.hospitals(featured);

-- ==============================================================================
-- TABLE 3: DOCTORS & SPECIALISTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL,
    seo JSONB DEFAULT '{}'::JSONB NOT NULL,
    name JSONB NOT NULL, -- { ar, en, fr }
    title JSONB NOT NULL, -- { ar, en, fr }
    specialty_slug TEXT NOT NULL,
    specialty_name JSONB NOT NULL, -- { ar, en, fr }
    hospital_id TEXT DEFAULT 'acibadem-altunizade' NOT NULL,
    hospital JSONB NOT NULL, -- { ar, en, fr }
    experience_years INTEGER DEFAULT 10 NOT NULL,
    image TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.9 NOT NULL,
    review_count INTEGER DEFAULT 100 NOT NULL,
    surgeries_count INTEGER DEFAULT 2500 NOT NULL,
    publications_count INTEGER DEFAULT 40 NOT NULL,
    languages TEXT[] DEFAULT ARRAY['العربية', 'English', 'Türkçe']::TEXT[] NOT NULL,
    biography JSONB NOT NULL, -- { ar, en, fr }
    areas_of_expertise JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    procedures JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    education JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    career_history JSONB DEFAULT '[]'::JSONB NOT NULL,
    memberships JSONB DEFAULT '{}'::JSONB NOT NULL,
    technologies JSONB DEFAULT '{}'::JSONB NOT NULL,
    videos JSONB DEFAULT '[]'::JSONB NOT NULL,
    video_url TEXT,
    video_title JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_doctors_slug ON public.doctors(slug);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty_slug);

-- ==============================================================================
-- TABLE 4: TREATMENTS & MEDICAL SPECIALTIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.treatments (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL,
    seo JSONB DEFAULT '{}'::JSONB NOT NULL,
    title JSONB NOT NULL, -- { ar, en, fr }
    short_description JSONB NOT NULL, -- { ar, en, fr }
    full_overview JSONB NOT NULL, -- { ar, en, fr }
    image TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Activity' NOT NULL,
    featured BOOLEAN DEFAULT true NOT NULL,
    conditions_treated JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    procedures JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    why_turkey JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    faqs JSONB DEFAULT '[]'::JSONB NOT NULL,
    doctor_ids TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_treatments_slug ON public.treatments(slug);
CREATE INDEX IF NOT EXISTS idx_treatments_featured ON public.treatments(featured);

-- ==============================================================================
-- TABLE 5: PATIENT STORIES & RECOVERY EXPERIENCES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.patient_stories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL,
    seo JSONB DEFAULT '{}'::JSONB NOT NULL,
    patient_name JSONB NOT NULL,
    country JSONB NOT NULL, -- { ar, en, fr }
    treatment JSONB NOT NULL, -- { ar, en, fr }
    treatment_slug TEXT,
    duration JSONB NOT NULL, -- { ar, en, fr }
    doctor_name JSONB NOT NULL, -- { ar, en, fr }
    hospital JSONB NOT NULL, -- { ar, en, fr }
    title JSONB NOT NULL, -- { ar, en, fr }
    short_story JSONB NOT NULL, -- { ar, en, fr }
    full_experience JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    timeline JSONB DEFAULT '[]'::JSONB NOT NULL,
    image TEXT NOT NULL,
    has_video BOOLEAN DEFAULT false NOT NULL,
    video_duration TEXT,
    rating INTEGER DEFAULT 5 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_patient_stories_slug ON public.patient_stories(slug);

-- ==============================================================================
-- TABLE 6: MEDICAL BLOG & KNOWLEDGE ARTICLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL,
    seo JSONB DEFAULT '{}'::JSONB NOT NULL,
    category_slug TEXT NOT NULL,
    category_name JSONB NOT NULL, -- { ar, en, fr }
    title JSONB NOT NULL, -- { ar, en, fr }
    excerpt JSONB NOT NULL, -- { ar, en, fr }
    content JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    html_content JSONB DEFAULT '{}'::JSONB NOT NULL, -- { ar, en, fr }
    faqs JSONB DEFAULT '[]'::JSONB NOT NULL,
    reading_time_minutes INTEGER DEFAULT 5 NOT NULL,
    published_date TEXT NOT NULL,
    updated_date TEXT,
    source_hospital JSONB NOT NULL, -- { ar, en, fr }
    image TEXT NOT NULL,
    author_doctor_id TEXT,
    author JSONB NOT NULL, -- { name, role }
    medical_reviewer JSONB, -- { doctorId, name, role }
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_slug);

-- ==============================================================================
-- TABLE 7: CONSULTATION INQUIRIES (PATIENT LEADS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consultation_inquiries (
    id TEXT PRIMARY KEY,
    tracking_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    country TEXT,
    specialty TEXT,
    notes TEXT,
    language TEXT DEFAULT 'ar' NOT NULL,
    source_url TEXT,
    assigned_to TEXT,
    assigned_name TEXT,
    internal_notes JSONB DEFAULT '[]'::JSONB NOT NULL,
    attachments JSONB DEFAULT '[]'::JSONB NOT NULL,
    notification_log JSONB DEFAULT '[]'::JSONB NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL, -- 'new', 'in_review', 'contacted', 'scheduled'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_tracking_id ON public.consultation_inquiries(tracking_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.consultation_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.consultation_inquiries(created_at DESC);

-- ==============================================================================
-- TABLE 8: STANDALONE CMS PAGES (PRIVACY, TERMS, LANDING PAGES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    slugs JSONB DEFAULT '{}'::JSONB NOT NULL,
    title JSONB NOT NULL,
    subtitle JSONB DEFAULT '{}'::JSONB NOT NULL,
    content_html JSONB NOT NULL,
    seo JSONB DEFAULT '{}'::JSONB NOT NULL,
    status TEXT DEFAULT 'published' NOT NULL,
    is_system BOOLEAN DEFAULT false NOT NULL,
    show_in_footer BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLE 9: REDIRECTS MANAGER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.redirects (
    id TEXT PRIMARY KEY,
    from_path TEXT UNIQUE NOT NULL,
    to_path TEXT NOT NULL,
    status_code INTEGER DEFAULT 301 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    hits INTEGER DEFAULT 0 NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLE 10: MEDIA LIBRARY WITH ALT TEXT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_items (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER DEFAULT 0 NOT NULL,
    alt JSONB DEFAULT '{}'::JSONB NOT NULL,
    caption JSONB DEFAULT '{}'::JSONB NOT NULL,
    folder TEXT DEFAULT 'uploads' NOT NULL,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLE 11: ADMIN USERS (RBAC + TOTP 2FA) & ACTIVITY LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'editor' NOT NULL, -- 'admin' | 'editor' | 'coordinator'
    password_hash TEXT NOT NULL,
    totp_secret TEXT,
    totp_enabled BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    token_version INTEGER DEFAULT 1 NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_username TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies (Allow anyone to view public medical content)
CREATE POLICY "Public can view site sections" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public can view treatments" ON public.treatments FOR SELECT USING (true);
CREATE POLICY "Public can view patient stories" ON public.patient_stories FOR SELECT USING (true);
CREATE POLICY "Public can view articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public can view pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Public can view redirects" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON public.media_items FOR SELECT USING (true);

-- 3. Inquiries: Public can insert their consultation requests
CREATE POLICY "Public can submit consultation inquiries" ON public.consultation_inquiries FOR INSERT WITH CHECK (true);

-- 4. Admin Management Policies
CREATE POLICY "Full access to site sections for anon/authenticated" ON public.site_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to hospitals for anon/authenticated" ON public.hospitals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to doctors for anon/authenticated" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to treatments for anon/authenticated" ON public.treatments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to patient stories for anon/authenticated" ON public.patient_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to articles for anon/authenticated" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to consultation inquiries for anon/authenticated" ON public.consultation_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to pages for anon/authenticated" ON public.pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to redirects for anon/authenticated" ON public.redirects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to media for anon/authenticated" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to admin_users for service/authenticated" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to activity_logs for service/authenticated" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_sections_updated_at BEFORE UPDATE ON public.site_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON public.treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_stories_updated_at BEFORE UPDATE ON public.patient_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultation_inquiries_updated_at BEFORE UPDATE ON public.consultation_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- SUPABASE STORAGE: PUBLIC BUCKET FOR MEDIA UPLOADS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avicinna-media', 'avicinna-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies: Allow public read and public uploads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for avicinna-media'
    ) THEN
        CREATE POLICY "Public Access for avicinna-media" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'avicinna-media');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Uploads for avicinna-media'
    ) THEN
        CREATE POLICY "Allow Uploads for avicinna-media" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'avicinna-media');
    END IF;
END $$;
