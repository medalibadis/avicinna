import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor } from '@/data/doctors';
import { Treatment } from '@/data/treatments';
import { PatientStory } from '@/data/stories';
import { Article } from '@/data/articles';
import { HospitalPartner } from '@/data/hospitals';
import { ConsultationInquiry, SiteSectionsData } from '@/context/DataContext';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// 1. SITE SECTIONS HELPERS
// ==============================================================================
export async function fetchSectionsFromDb(): Promise<Partial<SiteSectionsData> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('site_sections').select('id, data');
    if (error || !data) return null;
    const sections: Partial<SiteSectionsData> = {};
    for (const row of data) {
      if (row.id && row.data) {
        // @ts-expect-error dynamic key assignment
        sections[row.id] = row.data;
      }
    }
    return sections;
  } catch (err) {
    console.warn('Supabase fetchSections error:', err);
    return null;
  }
}

export async function upsertSectionToDb(id: string, data: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('site_sections').upsert(
      { id, data, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
    return !error;
  } catch (err) {
    console.warn('Supabase upsertSection error:', err);
    return false;
  }
}

// ==============================================================================
// 2. HOSPITALS HELPERS
// ==============================================================================
function mapHospitalRowToModel(row: any): HospitalPartner {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    city: row.city,
    accreditation: row.accreditation,
    description: row.description,
    image: row.image,
    featured: row.featured,
    specialtiesCount: row.specialties_count,
  };
}

function mapHospitalModelToRow(hosp: HospitalPartner) {
  return {
    id: hosp.id,
    name: hosp.name,
    type: hosp.type,
    city: hosp.city,
    accreditation: hosp.accreditation,
    description: hosp.description,
    image: hosp.image,
    featured: hosp.featured,
    specialties_count: hosp.specialtiesCount,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchHospitalsFromDb(): Promise<HospitalPartner[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('hospitals').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(mapHospitalRowToModel);
  } catch (err) {
    console.warn('Supabase fetchHospitals error:', err);
    return null;
  }
}

export async function upsertHospitalToDb(hosp: HospitalPartner): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapHospitalModelToRow(hosp);
    const { error } = await supabase.from('hospitals').upsert(row, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase upsertHospital error:', err);
    return false;
  }
}

export async function deleteHospitalFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('hospitals').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteHospital error:', err);
    return false;
  }
}

// ==============================================================================
// 3. DOCTORS HELPERS
// ==============================================================================
function mapDoctorRowToModel(row: any): Doctor {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    specialtySlug: row.specialty_slug,
    specialtyName: row.specialty_name,
    hospital: row.hospital,
    experienceYears: row.experience_years,
    image: row.image,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    languages: row.languages || [],
    biography: row.biography,
    areasOfExpertise: row.areas_of_expertise,
    procedures: row.procedures,
    education: row.education,
  };
}

function mapDoctorModelToRow(doc: Doctor) {
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    title: doc.title,
    specialty_slug: doc.specialtySlug,
    specialty_name: doc.specialtyName,
    hospital: doc.hospital,
    experience_years: doc.experienceYears,
    image: doc.image,
    rating: doc.rating,
    review_count: doc.reviewCount,
    languages: doc.languages,
    biography: doc.biography,
    areas_of_expertise: doc.areasOfExpertise,
    procedures: doc.procedures,
    education: doc.education,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchDoctorsFromDb(): Promise<Doctor[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(mapDoctorRowToModel);
  } catch (err) {
    console.warn('Supabase fetchDoctors error:', err);
    return null;
  }
}

export async function upsertDoctorToDb(doc: Doctor): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapDoctorModelToRow(doc);
    const { error } = await supabase.from('doctors').upsert(row, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase upsertDoctor error:', err);
    return false;
  }
}

export async function deleteDoctorFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteDoctor error:', err);
    return false;
  }
}

// ==============================================================================
// 4. TREATMENTS HELPERS
// ==============================================================================
function mapTreatmentRowToModel(row: any): Treatment {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    fullOverview: row.full_overview,
    image: row.image,
    iconName: row.icon_name || 'Activity',
    featured: row.featured,
    conditionsTreated: row.conditions_treated,
    procedures: row.procedures,
    whyTurkey: row.why_turkey,
    faqs: row.faqs || [],
    doctorIds: row.doctor_ids || [],
  };
}

function mapTreatmentModelToRow(treat: Treatment) {
  return {
    id: treat.id,
    slug: treat.slug,
    title: treat.title,
    short_description: treat.shortDescription,
    full_overview: treat.fullOverview,
    image: treat.image,
    icon_name: treat.iconName,
    featured: treat.featured,
    conditions_treated: treat.conditionsTreated,
    procedures: treat.procedures,
    why_turkey: treat.whyTurkey,
    faqs: treat.faqs,
    doctor_ids: treat.doctorIds || [],
    updated_at: new Date().toISOString(),
  };
}

export async function fetchTreatmentsFromDb(): Promise<Treatment[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('treatments').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(mapTreatmentRowToModel);
  } catch (err) {
    console.warn('Supabase fetchTreatments error:', err);
    return null;
  }
}

export async function upsertTreatmentToDb(treat: Treatment): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapTreatmentModelToRow(treat);
    const { error } = await supabase.from('treatments').upsert(row, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase upsertTreatment error:', err);
    return false;
  }
}

export async function deleteTreatmentFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('treatments').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteTreatment error:', err);
    return false;
  }
}

// ==============================================================================
// 5. PATIENT STORIES HELPERS
// ==============================================================================
function mapStoryRowToModel(row: any): PatientStory {
  return {
    id: row.id,
    slug: row.slug,
    patientName: row.patient_name,
    country: row.country,
    treatment: row.treatment,
    treatmentSlug: row.treatment_slug,
    duration: row.duration,
    doctorName: row.doctor_name,
    hospital: row.hospital,
    title: row.title,
    shortStory: row.short_story,
    fullExperience: row.full_experience,
    timeline: row.timeline || [],
    image: row.image,
    hasVideo: row.has_video,
    videoDuration: row.video_duration,
    rating: row.rating,
  };
}

function mapStoryModelToRow(story: PatientStory) {
  return {
    id: story.id,
    slug: story.slug,
    patient_name: story.patientName,
    country: story.country,
    treatment: story.treatment,
    treatment_slug: story.treatmentSlug,
    duration: story.duration,
    doctor_name: story.doctorName,
    hospital: story.hospital,
    title: story.title,
    short_story: story.shortStory,
    full_experience: story.fullExperience,
    timeline: story.timeline,
    image: story.image,
    has_video: story.hasVideo,
    video_duration: story.videoDuration,
    rating: story.rating,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchStoriesFromDb(): Promise<PatientStory[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('patient_stories').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(mapStoryRowToModel);
  } catch (err) {
    console.warn('Supabase fetchStories error:', err);
    return null;
  }
}

export async function upsertStoryToDb(story: PatientStory): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapStoryModelToRow(story);
    const { error } = await supabase.from('patient_stories').upsert(row, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase upsertStory error:', err);
    return false;
  }
}

export async function deleteStoryFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('patient_stories').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteStory error:', err);
    return false;
  }
}

// ==============================================================================
// 6. ARTICLES HELPERS
// ==============================================================================
function mapArticleRowToModel(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    readingTimeMinutes: row.reading_time_minutes,
    publishedDate: row.published_date,
    sourceHospital: row.source_hospital,
    image: row.image,
    author: row.author,
  };
}

function mapArticleModelToRow(art: Article) {
  return {
    id: art.id,
    slug: art.slug,
    category_slug: art.categorySlug,
    category_name: art.categoryName,
    title: art.title,
    excerpt: art.excerpt,
    content: art.content,
    reading_time_minutes: art.readingTimeMinutes,
    published_date: art.publishedDate,
    source_hospital: art.sourceHospital,
    image: art.image,
    author: art.author,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchArticlesFromDb(): Promise<Article[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map(mapArticleRowToModel);
  } catch (err) {
    console.warn('Supabase fetchArticles error:', err);
    return null;
  }
}

export async function upsertArticleToDb(art: Article): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapArticleModelToRow(art);
    const { error } = await supabase.from('articles').upsert(row, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Supabase upsertArticle error:', err);
    return false;
  }
}

export async function deleteArticleFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteArticle error:', err);
    return false;
  }
}

// ==============================================================================
// 7. CONSULTATION INQUIRIES HELPERS
// ==============================================================================
function mapInquiryRowToModel(row: any): ConsultationInquiry {
  return {
    id: row.id,
    trackingId: row.tracking_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    country: row.country,
    specialty: row.specialty,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapInquiryModelToRow(inq: ConsultationInquiry) {
  return {
    id: inq.id,
    tracking_id: inq.trackingId,
    full_name: inq.fullName,
    phone: inq.phone,
    email: inq.email || null,
    country: inq.country || null,
    specialty: inq.specialty || null,
    notes: inq.notes || null,
    status: inq.status,
    created_at: inq.createdAt,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchInquiriesFromDb(): Promise<ConsultationInquiry[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('consultation_inquiries').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map(mapInquiryRowToModel);
  } catch (err) {
    console.warn('Supabase fetchInquiries error:', err);
    return null;
  }
}

export async function insertInquiryToDb(inq: ConsultationInquiry): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapInquiryModelToRow(inq);
    const { error } = await supabase.from('consultation_inquiries').insert(row);
    return !error;
  } catch (err) {
    console.warn('Supabase insertInquiry error:', err);
    return false;
  }
}

export async function updateInquiryStatusInDb(id: string, status: ConsultationInquiry['status']): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('consultation_inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase updateInquiryStatus error:', err);
    return false;
  }
}

export async function deleteInquiryFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('consultation_inquiries').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteInquiry error:', err);
    return false;
  }
}
