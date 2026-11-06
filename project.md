# AVICINNA Healthcare Platform - Comprehensive Project Architecture & Feature Specification

* **Platform Name:** AVICINNA Healthcare Turkey (منصة أفيسينا للرعاية الطبية الدولية)
* **Production Domain:** `https://avicinna.com`
* **Lead System Architect & Sole Builder:** Akram KAID
* **Primary Scope:** Cross-border medical tourism, clinical referrals, and hospital coordination connecting international patients (GCC, Arab world, Europe) with accredited JCI healthcare centers, chief surgeons, and professors in Istanbul, Turkey.
* **Document Version:** 1.0 (Full Master Specification)

---

## 1. Executive System Overview & Technology Stack

### 1.1 Architectural Vision
AVICINNA is an enterprise-grade medical tourism web application engineered to bridge international patients with Turkey's elite medical institutions. The platform combines consumer-facing luxury aesthetics with back-office hospital triage operations, real-time consultation lead routing, trilingual localization, and an authentic Rank Math-aligned SEO publication engine.

### 1.2 Core Technology Architecture
* **Frontend Framework:** Next.js (App Router, Server Components, Incremental Static Regeneration - ISR, Client Interactivity).
* **Programming Language:** TypeScript (Strict typing across all clinical models, API contracts, and state payloads).
* **Styling & Design System:** Tailwind CSS with custom medical palette, glassmorphism tokens, CSS variables, and fluid typography.
* **Animation & Gesture Engine:** Framer Motion (page transitions, spring physics, modal portals, draggable cards, spotlight tilt effects).
* **Database & Media Storage:** Supabase Cloud PostgreSQL + Supabase S3-compatible Object Storage for doctor photos, hospital galleries, and video assets.
* **CMS & Content Engine:** Dual-mode architecture featuring an internal Next.js CMS with 1-click AI translation and a synchronized Headless WordPress REST API bridge.
* **SEO & Content Optimization:** Custom Rank Math SEO Engine (22 mathematical ranking criteria, 0–100 live scoring, real-time SERP simulator).
* **Production Server Infrastructure:** Hostinger LiteSpeed Web Server, PM2 process clustering, reverse proxy configuration, and LiteSpeed Cache (LSCache) acceleration.
* **Localization:** Trilingual core: Arabic (`ar` - primary RTL), English (`en` - LTR), and French (`fr` - LTR) with contextual medical terminology dictionaries.
* **Theming:** Dual Mode (Celestial Dark & Luxury Light) with dynamic accent color presets (Sky, Emerald, Violet, Rose, Amber).

---

## 2. Global Design System & Responsive Layout Specifications

### 2.1 Color Tokens & Visual Identity
* **Primary Brand Navy:** `#032654` (Deep clinical authority, trust, stability).
* **Secondary Brand Blue:** `#0097FB` (Active medical technology, primary buttons, badges).
* **Accent Cyan / Teal:** `#00BFFF` / `#14B8A6` (Accreditations, JCI badges, highlighted typography).
* **Dark Background Base:** `#050C18` / `#080E1A` (Luxury cinema ambiance, high contrast).
* **Light Background Base:** `#F8FAFC` / `#FFFFFF` (Sterile medical clarity, high readability).
* **Border & Glass Tokens:** `rgba(255, 255, 255, 0.1)` on dark, `rgba(0, 0, 0, 0.06)` on light, `backdrop-blur-md`.

### 2.2 Breakpoint Matrix
* **Mobile Small:** `< 380px` (Compact phone layout, single-column stacks, minimized badges).
* **Mobile Standard:** `380px - 639px` (Standard smartphones, full-width cards, thumb-friendly touch targets).
* **Tablet:** `640px - 1023px` (2-column grids, collapsible sidebars, adaptive drawers).
* **Desktop (Laptop):** `1024px - 1279px` (3-column grids, fixed sidebars, visible main navigation).
* **Desktop Wide:** `1280px - 1599px` (Full floating pill navigation, 4-column metrics, split-screen hero).
* **Ultra-Wide:** `1600px+` (Max-width container bounding `1600px`, centered clinical layouts).

---

## 3. User Panel (Consumer-Facing Frontend)

### 3.1 Global Header & Navigation

#### Desktop Interface (>= 1280px)
* **Branding:** SVG medical insignia with animated typography, light/dark responsive contrast.
* **Navigation Dock:** Floating pill container with backdrop blur, subtle borders, and smooth hover pill highlights:
  * Home (`/`)
  * Treatments & Specialties (`/treatments`) with interactive dropdown menu previewing top specialties.
  * Partner Hospitals (`/hospitals`)
  * Consultant Doctors (`/doctors`)
  * Patient Stories (`/patient-stories`)
  * Medical Blog (`/blog`)
  * About AVICINNA (`/about`)
  * Contact & Coordination (`/contact`)
* **Utility Cluster:**
  * Trilingual Language Selector (Arabic, English, French) with automatic text direction (`dir="rtl"` / `dir="ltr"`).
  * Celestial Theme Switcher (Dark / Light toggle with animated sun/moon transition).
  * Direct Call CTA (`+90 544 282 27 69`) and "Book Consultation" trigger.
* **Scroll Dynamics:** Transparent floating state on hero, transforming into frosted glass with shadow on scroll (`window.scrollY > 20px`).

#### Mobile Interface (< 1280px)
* **Compact Header Bar:** Brand logo left/right according to text direction, language pill toggle, theme toggle, and hamburger menu trigger.
* **Off-Canvas Navigation Drawer:**
  * Full-height slide-over overlay with backdrop blur.
  * Accordion navigation links with active route indicators.
  * Direct WhatsApp quick button and emergency hotline dialer.
  * Clear touch targets (minimum 48px height) for clinical accessibility.

---

### 3.2 Homepage Sections Architecture (13 Structural Sections)

#### Section 1: Hero Section (Luxury Cinema Hero)
* **Desktop UI:**
  * Ambient auto-playing medical video background with 35% opacity and saturate grading.
  * Trilingual Eyebrow badge with glowing border.
  * High-impact dual-part headline with highlighted medical gradient segment.
  * Live Autocomplete Search Dock:
    * Real-time querying across Doctors, Hospitals, and Procedures simultaneously.
    * Instant categorized dropdown displaying results with direct links and thumbnail previews.
  * Trust Badges Row: JCI Accredited Hospitals, Board-Certified Surgeons, VIP Stay & Coordination, 24h Response.
  * Dual Action Buttons: "Free Consultation" (scrolls to form) and "Explore Specialties".
* **Mobile UI:**
  * Background video optimized with mobile poster fallback to preserve cellular bandwidth.
  * Stacked typography with responsive text scaling (`text-2xl` to `text-3xl`).
  * Full-width search bar with touch-triggered expandable modal to prevent viewport zooming.
  * Vertical trust badge indicators with compact typography.

#### Section 2: Statistics & Metrics Section
* **Desktop UI:** 4-column horizontal bento strip featuring animated Dopamine Number Tickers:
  * Total Patients Treated (e.g., `12,500+`).
  * JCI Partner Hospitals (e.g., `14+`).
  * Years of Clinical Experience (e.g., `18+`).
  * Patient Satisfaction Rate (e.g., `99.2%`).
* **Mobile UI:** 2x2 grid layout with high-contrast divider borders and compact metric labels.

#### Section 3: Quick Value & Trust Cards
* **Desktop UI:** 3 glassmorphic cards highlighting core value propositions:
  * 100% Free Preliminary Medical Assessment.
  * Direct WhatsApp Translation & Arabic Coordination.
  * No Upfront Financial Obligation.
* **Mobile UI:** Horizontally scrollable swipe cards with snap-to-center physics.

#### Section 4: About AVICINNA Section
* **Desktop UI:** Asymmetrical 2-column layout:
  * Left: Multi-layered clinical photography with floating experience badge and JCI seal.
  * Right: Eyebrow badge, main heading, lead clinical paragraph, and three feature checkmark points.
* **Mobile UI:** Stacked single column with media placed above editorial text.

#### Section 5: Medical Specialties Grid
* **Desktop UI:** Dynamic grid displaying top clinical disciplines:
  * Oncology & Cancer Surgery.
  * Cardiovascular Surgery.
  * Neurosurgery & Brain Surgery.
  * Orthopedics & Joint Replacement.
  * Advanced Sapphire Hair Transplantation.
  * Aesthetic Dentistry & Oral Rehabilitation.
  * Organ Transplantation (Kidney & Liver).
  * Robotic Surgery (Da Vinci Xi).
* Card Elements: High-definition specialty cover image, specialty icon, title in active language, procedure count pill, short description, and hover zoom effect.
* **Mobile UI:** 1-column cards with touch-friendly target cards and direct links to `/treatments/[slug]`.

#### Section 6: Why Choose AVICINNA (Quality Standards)
* **Desktop UI:** 4 detailed feature columns featuring icon illustration, benefit title, description, and savings benchmark (up to 60% compared to Western Europe and North America).
* **Mobile UI:** Accordion-style expandable list or stacked cards with primary points highlighted.

#### Section 7: Partner Hospitals Infinite Showcase
* **Desktop UI:** Dual-row infinite marquee with interactive touch/mouse drag:
  * Smooth continuous horizontal loop with physics momentum.
  * Hover pause mechanism.
  * Hospital Card: Facility photo, JCI accreditation badge, bed count, ICU capacity, address, and "Explore Hospital" button.
* **Mobile UI:** Native horizontal drag track with inertia, full touch responsiveness, and drag-hint overlay.

#### Section 8: Featured Consultant Doctors Carousel
* **Desktop UI:** 3-card or 4-card carousel spotlighting premier surgeons:
  * Doctor portrait with verified board-certified badge.
  * Doctor name, academic title (Prof. Dr. / Assoc. Prof.), and specialty.
  * Affiliated hospital name and star rating with review count.
  * Completed surgery count and clinical experience years.
  * Direct "View Full Profile" and "Book Consultation" triggers.
* **Mobile UI:** Swipeable single-card carousel with pagination dots.

#### Section 9: Consultation Intake & WhatsApp Lead Router
* **Desktop UI:** Split-screen clinical conversion center:
  * Left Column: Value checklist (Free second opinion, Treatment quotation within 24h, Confidentiality guarantee).
  * Right Column: Interactive Consultation Form:
    * Full Patient Name.
    * Phone Number with International Country Code.
    * Country of Residence.
    * Medical Specialty dropdown (populated dynamically from data).
    * Clinical Case Notes & Symptoms description.
    * Submit Button with loading spinner.
  * Dual Routing Engine:
    * 1. Submits lead payload to backend database (Supabase/Internal CRM).
    * 2. Automatically structures a personalized, formatted WhatsApp message and opens `wa.me` directly.
* **Mobile UI:** Full-width form layout with native mobile keyboard type configurations (`tel`, `text`, `textarea`).

#### Section 10: Patient Stories & Video Testimonials
* **Desktop UI:** 3-column video card showcase:
  * Patient portrait/video thumbnail with dark overlay.
  * Pulsing acoustic wave play button.
  * Patient name, home country, treatment received, and treatment duration.
  * Star rating and authentic quote.
  * Interactive Modal Player: Clicking opens a full-screen video lightbox with detailed written case report.
* **Mobile UI:** Vertical card list with native video playback controls.

#### Section 11: Medical Blog & Clinical Guides Preview
* **Desktop UI:** 3 featured articles from the Headless WordPress / internal blog system:
  * Cover image with category badge.
  * Reading time badge (e.g., `6 min read`).
  * Article title, excerpt, and author byline (Doctor/Hospital).
  * "Read Clinical Guide" arrow link.
* **Mobile UI:** Compact article cards with horizontal orientation (thumbnail left/right + text content).

#### Section 12: Interactive 8-Step Patient Journey Timeline
* **Desktop UI:** Interactive journey navigator across 8 stages:
  * Step 01: Initial Contact (24/7 multilingual response).
  * Step 02: Medical Records Upload (100% encrypted transfer).
  * Step 03: Free Surgical Board Evaluation (Review by chief professors within 24h).
  * Step 04: Hospital & Surgeon Matching (JCI accredited facility selection).
  * Step 05: Transparent Itemized Quote (Zero hidden costs, up to 60% savings).
  * Step 06: Travel & 5-Star Stay Arrangements (Medical visa invitation & hotel booking).
  * Step 07: VIP Airport Pickup & Dedicated Interpreter (Private transfer & personal escort).
  * Step 08: Lifetime Post-Operative Aftercare (Remote continuous surgeon follow-up).
  * Interactive State: Clicking any step dynamically switches the featured description card with smooth animations.
* **Mobile UI:** Vertical step-by-step numbered stepper with collapsible detail cards.

#### Section 13: Final Conversion CTA
* **Desktop UI:** Wide luxury gradient container (`#032654` to `#0097FB`) with direct telephone dialer, instant WhatsApp trigger, and free assessment button.
* **Mobile UI:** Stacked full-width CTA block with tap-to-call and tap-to-WhatsApp direct actions.

---

### 3.3 Public Subpages Architecture

#### 3.3.1 Doctors Directory (`/doctors`) & Single Doctor Profile (`/doctors/[slug]`)
* **Directory Page:**
  * Real-time search by doctor name, medical specialty, or hospital affiliation.
  * Category pill filter bar (Cardiology, Oncology, Neurosurgery, Orthopedics, etc.).
  * Responsive doctor cards with experience years, surgery counters, ratings, and profile links.
  * Server-side JSON-LD Schema: `MedicalWebPage`, `ItemList`, and `Physician` schemas.
* **Single Doctor Profile Page:**
  * Clinical Hero: Doctor photo, verified badge, academic title, specialty, hospital name, and contact buttons.
  * Metric Badges: Years of Experience, Successful Surgeries, Published Research Papers.
  * Tabbed Content Sections:
    * 1. Clinical Biography & Philosophy.
    * 2. Education & Academic Background (Medical school, residency, fellowships).
    * 3. Professional Career & Hospital Appointments.
    * 4. Awards, Honors & Board Certifications.
    * 5. Surgical Procedures & Specializations.
    * 6. Video Showcase (Interviews, surgical explanations via YouTube/Vimeo/MP4).
  * Sticky Consultation Sidebar: Direct booking card with pre-selected doctor name.

#### 3.3.2 Hospitals Directory (`/hospitals`) & Single Hospital Profile (`/hospitals/[slug]`)
* **Directory Page:**
  * Multi-parameter filter dock: City (Istanbul European / Asian sides), Clinical Specialties, and Medical Technologies.
  * Hospital Cards: Bed count, ICU capacity, JCI logo, address, and affiliated doctors count.
* **Single Hospital Profile Page:**
  * Facility Hero & Photo Gallery with full-screen lightbox.
  * Accreditation Badges: JCI (Joint Commission International), ISO, Turkish Ministry of Health certification.
  * Capacity Data: Total Beds, Intensive Care Beds, Operating Theatres, International Patient Lounge.
  * Medical Technologies Suite: Da Vinci Robotic Surgery, CyberKnife M6, Gamma Knife Icon, TrueBeam STx, PET-CT.
  * Affiliated Doctors Directory: Interactive list of physicians practicing at this specific center.
  * Location Map and International Patient Coordination contacts.

#### 3.3.3 Medical Specialties Directory (`/treatments`) & Single Treatment Page (`/treatments/[slug]`)
* **Directory Page:** Grid of all medical specialties with procedure counts and descriptions.
* **Single Treatment Page:**
  * Clinical overview and diagnostic criteria.
  * Target conditions and symptoms treated.
  * Surgical and non-surgical procedures breakdown.
  * "Why Choose Turkey for This Treatment?" (Comparative cost analysis, medical technology, surgeon expertise).
  * Recommended Partner Hospitals & Consultant Specialists for this specific field.
  * FAQ Accordion with structured `FAQPage` schema.

#### 3.3.4 Medical Blog Directory (`/blog`) & Single Article Reader (`/blog/[slug]`)
* **Directory Page:**
  * Category navigation (Cancer Treatment, Heart Surgery, Hair Restoration, Dental Tourism, etc.).
  * Real-time keyword search and pagination controls.
  * Incremental Static Regeneration (ISR) revalidated every 60 seconds.
* **Single Article Reader Page:**
  * Dynamic Table of Contents (TOC) with scroll-spy active heading indicator.
  * Reading Progress Bar pinned to top viewport.
  * Author & Reviewer Byline: Attributed to verified doctor with medical reviewer stamp.
  * JCI Verification Badge: Guaranteeing clinical accuracy.
  * 1-Click Translation Pill: Switch article content between Arabic, English, and French instantly.
  * Key Takeaways Callout Box: Highlighting clinical highlights for skimming readers.
  * Medical Disclaimer Callout Box.
  * Social Share Bar & Copy Link button with toast confirmation.
  * Integrated Contextual Consultation Banner.

#### 3.3.5 Patient Stories Hub (`/patient-stories`) & Single Story View
* **Hub Page:** Filterable gallery of real patient journeys organized by country of origin and medical procedure.
* **Story View:** Detailed case timeline, before/after documentation, video interview, and verified patient quote.

#### 3.3.6 About AVICINNA (`/about`) & Contact (`/contact`)
* **About Page:** Platform founding story, medical directorate, hospital vetting standards, patient safety protocol.
* **Contact Page:** Physical office locations (Istanbul Levent & Atasehir), 24/7 international patient coordination desk, inquiry form, Google Maps integration, email routing.

---

### 3.4 Floating Elements & Global Patient Helpers

#### Floating WhatsApp Concierge (`FloatingWhatsApp.tsx`)
* **Visual Presentation:** Pulsing circular button with official WhatsApp brand styling and badge icon.
* **Attention Mechanism:** Soft radar pulse animation with localized tooltip badge ("Need Free Consultation?").
* **Click Behavior:** Generates direct deep link to `wa.me/905442822769` with URL-encoded greeting tailored to active site language.
* **Responsive Behavior:** Docked above mobile bottom bar navigation to prevent touch target interference.

---

## 4. Admin Panel (Executive CMS & Patient Triage CRM)

### 4.1 Authentication & Security Architecture (`/auth/login`)

#### Multi-Factor Hardened Portal
* **Credential Fields:**
  * 1. Admin Identifier (Username).
  * 2. Master Password (Masked with toggleable eye icon).
  * 3. 6-Digit Encrypted Security PIN.
* **Anti-Brute-Force System:**
  * Failed attempt tracking counter.
  * Progressive cooldown lockout: Exceeding 5 failed attempts triggers a security freeze with an active countdown timer.
  * Rate-limiting enforcement at API layer (`src/app/api/auth/route.ts`).
* **Session Hardening:**
  * High-entropy cryptographic session tokens stored in `HttpOnly`, `SameSite=Strict` secure cookies.
  * Automatic session expiration on inactivity.
* **UI Features:** Glassmorphic card, live telemetry server status indicator, language selector, and quick link back to public site.

---

### 4.2 Admin Global Shell (`AdminShell.tsx`)

#### Layout & Navigation
* **Collapsible Left Sidebar:**
  * Toggle between Expanded (full labels + shortcuts) and Compact (icons only) modes.
  * Navigation Categories:
    * **Main:** Executive Dashboard (`/admin`) - Shortcut: `G D`.
    * **CMS:** Site Sections (`/admin/sections`) - Shortcut: `G S`.
    * **CMS:** Partner Hospitals (`/admin/hospitals`) - Shortcut: `G H`.
    * **CMS:** Doctors & Specialists (`/admin/doctors`) - Shortcut: `G M`.
    * **CMS:** Treatments & Procedures (`/admin/treatments`) - Shortcut: `G T`.
    * **CMS:** Patient Stories (`/admin/stories`) - Shortcut: `G P`.
    * **CMS:** Blog & Articles (`/admin/blog`) - Shortcut: `G B`.
    * **Comms:** Consultation Inquiries (`/admin/inquiries`) - Shortcut: `G I`.
    * **System:** Platform Settings (`/admin/settings`) - Shortcut: `G O`.
* **Top Utility Bar:**
  * Global Search & Command Palette trigger (`Cmd+K` / `Ctrl+K`).
  * Live View Website shortcut (opens production front in new tab).
  * Admin Language Switcher (AR / EN / FR).
  * Theme & Accent Color Palette Switcher (Fernly Theme Engine).
  * Logout Trigger with secure cookie destruction.
* **Mobile Drawer:** Slide-in admin navigation menu optimized for iPad, tablet, and smartphone emergency management.

#### Global Command Palette (`CommandMenu.tsx` & `AdminGlobalSearch.tsx`)
* Accessible via `Cmd+K` / `Ctrl+K` from any admin view.
* Instant fuzzy search across:
  * Admin subpages and settings tabs.
  * Patient inquiry names, phone numbers, and tracking IDs.
  * Doctor profiles and hospital facilities.
  * Published blog articles.

---

### 4.3 Executive Dashboard (`/admin`)

#### Real-Time Patient Triage Center
* **View Mode Switcher:** Seamless toggle between Table View and Kanban Board.
* **Kanban Workflow Columns:**
  * Column 1: `New` (Fresh inquiries requiring initial coordinator review).
  * Column 2: `In Review` (Patient reports forwarded to medical board).
  * Column 3: `Contacted` (Patient engaged via WhatsApp / phone).
  * Column 4: `Scheduled` (Hospital appointment & travel confirmed).
* **Expandable Kanban Cards (`ExpandableKanbanCard.tsx`):**
  * Displays patient name, country of residence, requested specialty, and submission timestamp.
  * One-click status advancement buttons.
  * Direct WhatsApp Launcher: Opens chat with pre-filled coordinator message.
  * Quick-view modal displaying clinical symptoms and attached notes.

#### KPI Bento Grid & Analytics
* **Bento Cards with Spotlight Tilt Effects:**
  * Total Inquiries (with delta percentage and new lead alert badge).
  * Active Consultant Doctors.
  * Accredited Partner Hospitals.
  * Medical Specialties.
* **Time Range Selector:** Filter statistics by 7 Days, 30 Days, or 90 Days.
* **Morphing Sparklines:** Visual trend indicators showing lead velocity.

#### System Health & Infrastructure Widget
* Live Supabase Database connection status.
* Headless WordPress API synchronization health.
* Cloud Uptime percentage badge (99.9%).
* Cache purge and revalidation trigger.

---

### 4.4 Homepage CMS & Section Editor (`/admin/sections`)

* **Visual Editor Tabs:**
  * 1. Hero Section (Eyebrow, Headline Part 1, Highlighted Segment, Subtitle).
  * 2. Statistics & Metrics (Patients count, hospitals count, experience years, satisfaction rate + labels).
  * 3. About AVICINNA (Badge, main heading, lead clinical paragraph).
  * 4. Why Choose Us (Badge, title, subtitle, WhatsApp number).
  * 5. Consultation CTA (Title, subtitle, direct contact hotline).
* **Smart Auto-Translator (`SingleInputAutoTranslator.tsx`):**
  * Admin can type in any one language (e.g., Arabic).
  * Clicking "Auto-Sync to AR & FR" calls the AI translation engine to automatically populate the other two language fields.
* **Live Reflection:** Saving immediately updates the shared `DataContext` and Supabase store, propagating changes to the live site.

---

### 4.5 Doctor & Specialist Management (`/admin/doctors`)

* **List View:** Table and card grid with real-time search, specialty filtering, and sorting.
* **Doctor Profile Modal Builder:**
  * Personal Data: Full Name, Clinical Title, Specialty, Hospital affiliation.
  * Experience Metrics: Years of experience, completed surgeries count, scientific publications count.
  * Ratings: Numeric score (e.g., `4.9`) and total review count.
  * Languages Spoken: Multi-select pill selector (Arabic, English, Turkish, French, German, Russian).
  * Dynamic Career Timeline Builder:
    * Add/Remove/Reorder items for Education, Career Appointments, Awards, and Certifications.
  * Media Management:
    * Image Upload Field: Direct upload to Supabase Storage with image compression, cropping, and URL fallback.
    * Video Upload & Embed Field: Embed YouTube interviews, Vimeo clinical summaries, or direct MP4 files.
  * Trilingual Translation: AI translator integrated into all bio, title, and career fields.

---

### 4.6 Partner Hospital Management (`/admin/hospitals`)

* **List View:** Searchable directory showing facility name, city, bed count, and assigned doctors.
* **Hospital Profile Builder:**
  * Facility Name, City, Full Physical Address.
  * Clinical Capacity: Total Bed Capacity, Intensive Care Beds (ICU), Operating Theatres.
  * Accreditations: Checkboxes for JCI, ISO, Ministry of Health.
  * Technology Suite: Multi-select tags for advanced equipment (Da Vinci, CyberKnife, Gamma Knife, PET-CT, Linear Accelerator).
  * Doctor Assignment Engine: Directly assign existing doctors from the database to this hospital.
  * Photo Gallery Manager: Multi-image upload for hospital exterior, VIP patient suites, operating rooms, and lobby.

---

### 4.7 Medical Specialties & Treatments Management (`/admin/treatments`)

* **List View:** Overview of clinical specialties with procedure count and condition count.
* **Treatment Builder:**
  * Trilingual Specialty Name (Arabic, English, French).
  * Short Excerpt & Deep Clinical Overview.
  * Treated Conditions: Comma-separated or tag-based list of clinical diagnoses treated.
  * "Why Turkey?" Value Points: Key benefits for international patients.
  * Cover Image Upload and URL slug assignment.

---

### 4.8 Patient Stories & Testimonials Management (`/admin/stories`)

* **List View:** Searchable list of patient recovery cases.
* **Story Builder:**
  * Patient Name (supports localized display).
  * Country and City of Residence.
  * Treatment Received, Treating Physician, and Hospital.
  * Duration of Stay in Istanbul.
  * Star Rating (1 to 5 stars).
  * Short Quote & Full Narrative Experience.
  * Media: Patient photo upload and video testimony URL.

---

### 4.9 Medical Blog & Rank Math SEO Studio (`/admin/blog`)

#### Article Management
* Create, Edit, Delete, and Filter articles by category and author.
* Fields: Title, Excerpt, Body Content (formatted paragraphs/markdown), Category, Estimated Read Time, Author Name, Clinical Title, Hospital Attribution, Featured Image.

#### Authentic Rank Math SEO Studio Engine (`ArticleSeoStudio.tsx` & `seoAnalyzer.ts`)
* **Real-Time Score Badge:** Live 0 to 100 numerical score with authentic color coding:
  * Red: `0 - 49` (Poor / Needs significant optimization).
  * Yellow: `50 - 79` (Fair / Acceptable).
  * Green: `80 - 100` (Excellent / Ready for Google Page 1 ranking).
* **22 Mathematical Audit Criteria across 4 Categories:**
  * **1. Basic SEO (Impact: 36 Points):**
    * Focus Keyword present in the SEO Title.
    * Focus Keyword present in the Meta Description.
    * Focus Keyword present in the URL Slug.
    * Focus Keyword appears in the first 10% of content.
    * Content word count meets minimum length (600+ words, 1000+ recommended).
  * **2. Additional SEO (Impact: 34 Points):**
    * Focus Keyword found in subheadings (H2, H3).
    * Image Alt attributes contain the Focus Keyword.
    * Keyword Density scored between 1.0% and 2.5%.
    * Content includes internal links to other platform pages.
    * Content includes external authoritative medical references.
    * External links configured with DoFollow.
    * Table of Contents (TOC) detected.
  * **3. Title Readability (Impact: 15 Points):**
    * Focus Keyword placed near the beginning of the title.
    * Title contains a positive or negative sentiment word.
    * Title includes a power word (e.g., Comprehensive, Verified, Elite).
    * Title contains a number for higher CTR.
  * **4. Content Readability (Impact: 15 Points):**
    * Table of Contents present for complex sections.
    * Paragraphs structured with short, readable blocks (max 120 words per paragraph).
    * Media elements (images, diagrams) embedded to enrich text.
* **Interactive SERP Preview:**
  * Switch between Desktop Google SERP preview and Mobile snippet preview.
  * Visual progress bars for SEO Title length (ideal: 50–60 characters) and Meta Description length (ideal: 150–160 characters).
* **WordPress Sync Bridge:**
  * "Publish & Sync to WordPress" trigger pushing post content to Headless WordPress via REST API with Gutenberg block formatting and Rank Math meta serialization.

---

### 4.10 Patient Inquiries & CRM Management (`/admin/inquiries`)

* **Inquiry List & Filters:** Filter leads by status: `All`, `New`, `In Review`, `Contacted`, `Scheduled`.
* **Lead Inspection Drawer:**
  * Full patient contact details (Name, Phone, Country, Email).
  * Requested specialty and full clinical description/symptoms.
  * Administrative tracking ID (e.g., `AV-2026-XXXX`).
  * Direct "Open WhatsApp Chat" button generating customized medical coordination message.
  * Status transition dropdown with immediate database update.
  * Safe delete action with confirmation modal.

---

### 4.11 Platform Settings & System Configuration (`/admin/settings`)

* **7 Configuration Tabs:**
  * **Tab 1: Platform & Identity:** Brand name, Arabic name, official contact email, physical clinic addresses in Istanbul (Levent & Atasehir), 24/7 working hours description.
  * **Tab 2: Onboarding & Interactive Guides:** Toggle interactive admin onboarding walkthrough, reset tooltips, tour velocity.
  * **Tab 3: Appearance & Themes (Fernly Engine):** Accent color presets (Sky, Emerald, Violet, Rose, Amber), theme modes, UI density.
  * **Tab 4: Communication Channels & WhatsApp:** Official hotline number, WhatsApp direct routing number, personalized message templates for AR/EN/FR.
  * **Tab 5: Database & Cloud Sync:** Supabase project URL and anon key validation, real-time connection test, JSON backup export (download full database snapshot), and JSON backup restore.
  * **Tab 6: Homepage Section Visibility:** Toggle checkboxes to instantly show or hide any of the 13 homepage sections without editing code.
  * **Tab 7: Security & Session Shield:** Change admin master credentials, update 6-digit security PIN, review recent failed login telemetry, session timeout duration.

---

## 5. Data Architecture & TypeScript Model Specifications

### 5.1 Doctor Entity (`Doctor`)
```typescript
export interface DoctorCareerItem {
  year?: string;
  title: Record<'ar' | 'en' | 'fr', string>;
  subtitle?: Record<'ar' | 'en' | 'fr', string>;
  description?: Record<'ar' | 'en' | 'fr', string>;
}

export interface Doctor {
  id: string;
  slug: string;
  name: Record<'ar' | 'en' | 'fr', string>;
  title: Record<'ar' | 'en' | 'fr', string>;
  specialtyId: string;
  specialtyName: Record<'ar' | 'en' | 'fr', string>;
  hospitalId?: string;
  hospital: Record<'ar' | 'en' | 'fr', string>;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  surgeriesCount?: number;
  publicationsCount?: number;
  image: string;
  languages: Record<'ar' | 'en' | 'fr', string[]>;
  bio: Record<'ar' | 'en' | 'fr', string>;
  education?: DoctorCareerItem[];
  experience?: DoctorCareerItem[];
  awards?: DoctorCareerItem[];
  certifications?: DoctorCareerItem[];
  procedures?: Record<'ar' | 'en' | 'fr', string[]>;
  videos?: Array<{
    title: Record<'ar' | 'en' | 'fr', string>;
    url: string;
    thumbnail?: string;
  }>;
}
```

### 5.2 Hospital Partner Entity (`HospitalPartner`)
```typescript
export interface HospitalPartner {
  id: string;
  slug: string;
  name: Record<'ar' | 'en' | 'fr', string>;
  city: Record<'ar' | 'en' | 'fr', string>;
  address: Record<'ar' | 'en' | 'fr', string>;
  bedsCount: number;
  icuBedsCount: number;
  operatingRoomsCount?: number;
  image: string;
  gallery?: string[];
  accreditations: string[]; // e.g. ['JCI', 'ISO 9001']
  technologies: Record<'ar' | 'en' | 'fr', string[]>; // e.g. ['Da Vinci Robotic Surgery', 'CyberKnife']
  rating: number;
  reviewCount: number;
  description: Record<'ar' | 'en' | 'fr', string>;
  assignedDoctorIds?: string[];
}
```

### 5.3 Medical Specialty Entity (`Treatment`)
```typescript
export interface Treatment {
  id: string;
  slug: string;
  title: Record<'ar' | 'en' | 'fr', string>;
  coverImage: string;
  shortDesc: Record<'ar' | 'en' | 'fr', string>;
  overview: Record<'ar' | 'en' | 'fr', string>;
  procedures: Record<'ar' | 'en' | 'fr', string[]>;
  conditions: Record<'ar' | 'en' | 'fr', string[]>;
  whyTurkey: Record<'ar' | 'en' | 'fr', string[]>;
}
```

### 5.4 Consultation Inquiry Entity (`ConsultationInquiry`)
```typescript
export interface ConsultationInquiry {
  id: string;
  trackingId: string; // e.g. "AV-2026-8942"
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  specialty?: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'in_review' | 'contacted' | 'scheduled';
}
```

### 5.5 Article & SEO Entity (`Article`)
```typescript
export interface Article {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: Record<'ar' | 'en' | 'fr', string>;
  title: Record<'ar' | 'en' | 'fr', string>;
  excerpt: Record<'ar' | 'en' | 'fr', string>;
  content: Record<'ar' | 'en' | 'fr', string[]>;
  readingTimeMinutes: number;
  publishedDate: string;
  sourceHospital?: Record<'ar' | 'en' | 'fr', string>;
  image: string;
  author: {
    name: Record<'ar' | 'en' | 'fr', string>;
    role: Record<'ar' | 'en' | 'fr', string>;
    avatar?: string;
  };
  seo?: {
    focusKeyword?: string;
    title?: string;
    description?: string;
    canonical?: string;
  };
}
```

### 5.6 Site Sections CMS Entity (`SiteSectionsData`)
```typescript
export interface SiteSectionsData {
  hero: {
    eyebrow: Record<'ar' | 'en' | 'fr', string>;
    headlinePart1: Record<'ar' | 'en' | 'fr', string>;
    headlineHighlight: Record<'ar' | 'en' | 'fr', string>;
    headlinePart2: Record<'ar' | 'en' | 'fr', string>;
    subtitle: Record<'ar' | 'en' | 'fr', string>;
  };
  stats: {
    patientsCount: string;
    patientsLabel: Record<'ar' | 'en' | 'fr', string>;
    hospitalsCount: string;
    hospitalsLabel: Record<'ar' | 'en' | 'fr', string>;
    experienceCount: string;
    experienceLabel: Record<'ar' | 'en' | 'fr', string>;
    satisfactionRate: string;
    satisfactionLabel: Record<'ar' | 'en' | 'fr', string>;
  };
  about: {
    badge: Record<'ar' | 'en' | 'fr', string>;
    heading: Record<'ar' | 'en' | 'fr', string>;
    lead: Record<'ar' | 'en' | 'fr', string>;
  };
  whyChoose: {
    badge: Record<'ar' | 'en' | 'fr', string>;
    title: Record<'ar' | 'en' | 'fr', string>;
    subtitle: Record<'ar' | 'en' | 'fr', string>;
    whatsappNumber: string;
  };
  finalCta: {
    title: Record<'ar' | 'en' | 'fr', string>;
    subtitle: Record<'ar' | 'en' | 'fr', string>;
    phone: string;
  };
}
```

---

## 6. Mobile vs Desktop UI/UX Responsive Specifications

| Feature / UI Module | Desktop Display (>= 1024px) | Mobile Display (< 1024px) |
| :--- | :--- | :--- |
| **Header Navigation** | Sticky frosted glass dock with hover dropdowns | Compact bar with off-canvas slide-out drawer |
| **Hero Background** | Auto-playing ambient medical video | Optimized low-bandwidth video with poster |
| **Search Function** | Wide horizontal dock with 3-tab dropdown | Touch-friendly search bar opening full-width modal |
| **Key Metrics Strip** | 4-column horizontal bento grid | 2x2 compact matrix with divider borders |
| **Specialties Grid** | 3 to 4 column responsive card grid | 1 to 2 column cards with clear touch targets |
| **Hospital Marquee** | Dual-track mouse-draggable infinite loop | Single-track touch-draggable track with momentum |
| **Doctor Cards** | Full portrait with surgery counts and buttons | Compact card with photo and direct WhatsApp call |
| **Consultation Form** | Split-screen: Trust points left, form right | Single-column stacked form with phone keyboard triggers |
| **Patient Journey** | 8-step interactive horizontal click stepper | Vertical timeline stepper with expandable milestones |
| **Article Reader** | Side-by-side Table of Contents and reader | TOC in collapsible drawer, reading bar pinned top |
| **Admin Shell** | Multi-column layout with persistent sidebar | Collapsible off-canvas drawer with touch icons |
| **Admin Triage** | Dual-mode: Expandable Kanban + Full Table | Single-column stacked cards with swipe actions |
| **Rank Math Studio** | Split view: Article editor left, live audit right | Tabbed view switching between Editor and SEO Audit |
| **Floating WhatsApp** | Corner bubble with expanding tooltip | Pinned bottom bubble clearing navigation bars |

---

## 7. Search Engine Optimization & Structural Data (Google Page 1 Compliance)

1. **Structured Data Schemas (JSON-LD):**
   * `MedicalOrganization` on Root and About pages.
   * `Physician` & `AggregateRating` on individual doctor profiles.
   * `Hospital` on individual partner hospital pages.
   * `MedicalWebPage` & `ItemList` on directories.
   * `Article` & `MedicalScholarlyArticle` on blog publications.
   * `BreadcrumbList` on all hierarchical routes.
   * `FAQPage` on treatment and guide accordions.
2. **Rank Math Parity:**
   * 1:1 mathematical alignment between the admin's internal analyzer (`seoAnalyzer.ts`) and official WordPress Rank Math plugin.
   * Real-time calculation of focus keyword distribution, keyword density (1.0% - 2.5%), heading tags hierarchy (H1, H2, H3), and image alt text presence.
3. **Crawlability & Performance:**
   * Server-Side Rendering (SSR) and Static Generation via Next.js App Router for sub-200ms initial Time to First Byte (TTFB).
   * Automated XML Sitemap generator (`/sitemap.xml`) indexing all doctors, hospitals, treatments, and blog posts.
   * Strict `robots.txt` configuration indexing public clinical routes while protecting `/admin` and `/api` paths.
