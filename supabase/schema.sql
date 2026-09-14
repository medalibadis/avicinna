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
    name JSONB NOT NULL, -- { ar, en, fr }
    type JSONB NOT NULL, -- { ar, en, fr }
    city JSONB NOT NULL, -- { ar, en, fr }
    accreditation TEXT NOT NULL,
    description JSONB NOT NULL, -- { ar, en, fr }
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT true NOT NULL,
    specialties_count INTEGER DEFAULT 20 NOT NULL,
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
    name JSONB NOT NULL, -- { ar, en, fr }
    title JSONB NOT NULL, -- { ar, en, fr }
    specialty_slug TEXT NOT NULL,
    specialty_name JSONB NOT NULL, -- { ar, en, fr }
    hospital JSONB NOT NULL, -- { ar, en, fr }
    experience_years INTEGER DEFAULT 10 NOT NULL,
    image TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.9 NOT NULL,
    review_count INTEGER DEFAULT 100 NOT NULL,
    languages TEXT[] DEFAULT ARRAY['العربية', 'English', 'Türkçe']::TEXT[] NOT NULL,
    biography JSONB NOT NULL, -- { ar, en, fr }
    areas_of_expertise JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    procedures JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    education JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
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
    patient_name TEXT NOT NULL,
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
    category_slug TEXT NOT NULL,
    category_name JSONB NOT NULL, -- { ar, en, fr }
    title JSONB NOT NULL, -- { ar, en, fr }
    excerpt JSONB NOT NULL, -- { ar, en, fr }
    content JSONB NOT NULL, -- { ar: [], en: [], fr: [] }
    reading_time_minutes INTEGER DEFAULT 5 NOT NULL,
    published_date TEXT NOT NULL,
    source_hospital JSONB NOT NULL, -- { ar, en, fr }
    image TEXT NOT NULL,
    author JSONB NOT NULL, -- { name, role }
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
    status TEXT DEFAULT 'new' NOT NULL, -- 'new', 'in_review', 'contacted', 'scheduled'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_tracking_id ON public.consultation_inquiries(tracking_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.consultation_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.consultation_inquiries(created_at DESC);

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

-- 2. Public Read Policies (Allow anyone to view public medical content)
CREATE POLICY "Public can view site sections" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public can view treatments" ON public.treatments FOR SELECT USING (true);
CREATE POLICY "Public can view patient stories" ON public.patient_stories FOR SELECT USING (true);
CREATE POLICY "Public can view articles" ON public.articles FOR SELECT USING (true);

-- 3. Inquiries: Public can insert their consultation requests
CREATE POLICY "Public can submit consultation inquiries" ON public.consultation_inquiries FOR INSERT WITH CHECK (true);

-- 4. Admin Management Policies (Allow all operations for service_role and anon API key)
CREATE POLICY "Full access to site sections for anon/authenticated" ON public.site_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to hospitals for anon/authenticated" ON public.hospitals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to doctors for anon/authenticated" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to treatments for anon/authenticated" ON public.treatments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to patient stories for anon/authenticated" ON public.patient_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to articles for anon/authenticated" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access to consultation inquiries for anon/authenticated" ON public.consultation_inquiries FOR ALL USING (true) WITH CHECK (true);

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
