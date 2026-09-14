-- ==============================================================================
-- AVICINNA MEDICAL TOURISM PLATFORM — SUPABASE INITIAL SEED DATA
-- Default production-ready data for Site Sections, Partner Hospitals, Doctors,
-- Medical Specialties, Patient Stories, Blog Articles, and Sample Leads.
-- ==============================================================================

-- 1. SEED SITE SECTIONS
INSERT INTO public.site_sections (id, data) VALUES
('hero', '{
  "eyebrow": {
    "ar": "وجهتكم الأولى للرعاية الصحية المتقدمة في إسطنبول",
    "en": "Your Premier Destination for Advanced Healthcare in Istanbul",
    "fr": "Votre Destination d’Excellence Médicale à Istanbul"
  },
  "headlinePart1": {
    "ar": "أفضل المستشفيات وأشهر الأطباء في",
    "en": "Turkey’s Leading Hospitals & Renowned Physicians for Your",
    "fr": "Les Meilleurs Hôpitaux et Chirurgiens Réputés de Turquie pour Votre"
  },
  "headlineHighlight": {
    "ar": "تركيا",
    "en": "Care",
    "fr": "Santé"
  },
  "headlinePart2": {
    "ar": "لرعايتكم",
    "en": "Journey",
    "fr": "Voyage"
  },
  "subtitle": {
    "ar": "نربطكم بأعلى المستشفيات المعتمدة دولياً (JCI) ونخبة الجراحين الاستشاريين في تركيا، مع مرافقة علاجية ولوجستية شاملة واستشارة مجانية فورية.",
    "en": "Connecting you with JCI-accredited medical facilities and elite board-certified professors in Istanbul, supported by seamless end-to-end concierge services.",
    "fr": "Nous vous relions aux centres hospitaliers accrédités JCI et aux chirurgiens les plus réputés de Turquie avec un accompagnement complet et une assistance 24/7."
  }
}'::jsonb),
('stats', '{
  "patientsCount": "+2,500",
  "patientsLabel": {
    "ar": "مريض دولي تلقوا العلاج بنجاح",
    "en": "International Patients Successfully Treated",
    "fr": "Patients Internationaux Soignés avec Succès"
  },
  "hospitalsCount": "+15",
  "hospitalsLabel": {
    "ar": "مستشفى معتمد دولياً (JCI)",
    "en": "JCI-Accredited Partner Hospitals",
    "fr": "Hôpitaux Partenaires Accrédités JCI"
  },
  "experienceCount": "+10",
  "experienceLabel": {
    "ar": "سنوات من الريادة في السياحة العلاجية",
    "en": "Years of Excellence in Medical Tourism",
    "fr": "Années d’Excellence en Tourisme Médical"
  },
  "satisfactionRate": "98.4%",
  "satisfactionLabel": {
    "ar": "نسبة رضا المرضى والنتائج الإيجابية",
    "en": "Clinical Success & Satisfaction Rate",
    "fr": "Taux de Satisfaction et Réussite Clinique"
  }
}'::jsonb),
('about', '{
  "badge": {
    "ar": "خبرة تمتد لأكثر من عقد كامل",
    "en": "Over a Decade of Medical Excellence",
    "fr": "Plus d’une Décennie d’Excellence Médicale"
  },
  "heading": {
    "ar": "ريادة طبية بمعايير عالمية في قلب إسطنبول",
    "en": "World-Class Healthcare Standards in the Heart of Istanbul",
    "fr": "Excellence Médicale aux Normes Internationales à Istanbul"
  },
  "lead": {
    "ar": "تأسست منصة AVICINNA لتكون الجسر الموثوق الذي يربط المرضى من كافة أنحاء العالم بأفضل الكفاءات الطبية والمستشفيات التخصصية المعتمدة في تركيا.",
    "en": "AVICINNA was founded as a trusted international healthcare bridge connecting global patients with top-tier accredited medical centers and distinguished specialists in Turkey.",
    "fr": "AVICINNA est née d’une mission claire : offrir aux patients du monde entier un accès direct et privilégié aux meilleurs spécialistes et hôpitaux de pointe en Turquie."
  }
}'::jsonb),
('whyChoose', '{
  "badge": {
    "ar": "لماذا يختار المرضى منصة أفيسينا؟",
    "en": "Why Patients Worldwide Choose AVICINNA",
    "fr": "Pourquoi Choisir la Plateforme AVICINNA ?"
  },
  "title": {
    "ar": "رعاية صحية متكاملة تضع صحتك وراحتك أولاً",
    "en": "Comprehensive Healthcare Putting Your Wellbeing First",
    "fr": "Une Prise en Charge Médicale Intégrale Centrée sur Votre Confort"
  },
  "subtitle": {
    "ar": "نحن لا نكتفي بحجز موعد، بل ندير كافة تفاصيل رحلتك الطبية من لحظة وصولك المطار حتى الشفاء التام والعودة لوطنك.",
    "en": "We orchestrate every dimension of your journey—from airport reception to advanced surgical care and post-discharge recovery follow-up.",
    "fr": "Nous coordonnons l’intégralité de votre séjour médical : accueil aéroport VIP, hébergement de luxe, traduction dédiée et suivi personnalisé."
  },
  "whatsappNumber": "+90 500 000 00 00"
}'::jsonb),
('finalCta', '{
  "title": {
    "ar": "ابدأ رحلتك نحو الشفاء اليوم مع أفضل أطباء تركيا",
    "en": "Begin Your Path to Recovery Today with Turkey’s Leading Medical Faculty",
    "fr": "Commencez Votre Rétablissement Aujourd’hui avec les Meilleurs Spécialistes"
  },
  "subtitle": {
    "ar": "فريقنا الطبي جاهز لمراجعة تقاريرك وتقديم استشارة مجانية مع خطة علاجية مخصصة وعرض سعر شامل خلال 24 ساعة.",
    "en": "Our clinical coordination board is ready to review your medical reports and deliver a comprehensive all-inclusive proposal within 24 hours.",
    "fr": "Notre équipe médicale étudie vos examens pour vous délivrer un plan de soins personnalisé et un devis complet sous 24 heures."
  },
  "phone": "+90 500 000 00 00"
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- 2. SEED HOSPITALS
INSERT INTO public.hospitals (id, name, type, city, accreditation, description, image, featured, specialties_count) VALUES
('hosp-1',
  '{"ar": "مجموعة مستشفيات أجيبادم إسطنبول (Acibadem Healthcare)", "en": "Acibadem Healthcare Group Istanbul", "fr": "Groupe Hospitalier Acibadem Istanbul"}'::jsonb,
  '{"ar": "مستشفى جامعي وتخصصي دولي", "en": "International Academic & Surgical Center", "fr": "Centre Hospitalier Universitaire International"}'::jsonb,
  '{"ar": "إسطنبول (مسلك وأتاشهير)", "en": "Istanbul (Maslak & Atasehir)", "fr": "Istanbul (Maslak & Atasehir)"}'::jsonb,
  'JCI Accredited & ISO 9001',
  '{"ar": "أحد أرقى الصروح الطبية في تركيا وأوروبا، يمتلك أحدث تقنيات الروبوت الجراحي دافنشي ومراكز زراعة الأعضاء والقلب المفتوح.", "en": "One of the foremost healthcare networks in Europe, equipped with Da Vinci robotic surgical systems, hybrid suites, and comprehensive oncology centers.", "fr": "L’un des réseaux hospitaliers les plus prestigieux d’Europe, doté de la chirurgie robotique Da Vinci et de pôles oncologiques intégrés."}'::jsonb,
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
  true,
  36
),
('hosp-2',
  '{"ar": "مجموعة مستشفيات أفيسينا الدولية (Avicenna Health)", "en": "Avicenna International Hospitals Group", "fr": "Groupe Hospitalier International Avicenna"}'::jsonb,
  '{"ar": "مجمع مستشفيات تخصصية", "en": "Specialized Multispecialty Hospitals", "fr": "Hôpitaux Pluridisciplinaires Spécialisés"}'::jsonb,
  '{"ar": "إسطنبول (أتاشهير وغولتبه وكارتال)", "en": "Istanbul (Atasehir, Gultepe & Kartal)", "fr": "Istanbul (Atasehir, Gultepe & Kartal)"}'::jsonb,
  'Turkish Ministry of Health & International Quality Certified',
  '{"ar": "شبكة مستشفيات متكاملة تضم أكثر من 4 أفرع كبرى في إسطنبول، تقدم رعاية متميزة للمرضى الدوليين في جراحة العظام والقلب والتجميل وطب الأسنان.", "en": "A premier hospital network across 4 major Istanbul locations, providing comprehensive surgical and diagnostic services for international patients.", "fr": "Réseau hospitalier majeur à Istanbul comptant plusieurs campus spécialisés en orthopédie, chirurgie cardiaque et dentisterie."}'::jsonb,
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
  true,
  28
),
('hosp-3',
  '{"ar": "مستشفى ميموريال إسطنبول (Memorial Health Group)", "en": "Memorial Healthcare Group Istanbul", "fr": "Groupe de Santé Memorial Istanbul"}'::jsonb,
  '{"ar": "مستشفى تخصصي للجراحة والقلب وزراعة الأعضاء", "en": "Tertiary Care & Organ Transplant Center", "fr": "Hôpital Tertiaire de Chirurgie & Greffes"}'::jsonb,
  '{"ar": "إسطنبول (شيشلي وبهتشلي إيفلر)", "en": "Istanbul (Sisli & Bahcelievler)", "fr": "Istanbul (Sisli & Bahcelievler)"}'::jsonb,
  'JCI Accredited',
  '{"ar": "أول مستشفى في تركيا يحصل على الاعتماد الأمريكي المشترك JCI، رائد عالمي في زراعة الكبد والكلى وعلاج العقم وأطفال الأنابيب.", "en": "The first hospital in Turkey awarded JCI accreditation, renowned for pioneering living-donor organ transplantation and cardiovascular surgery.", "fr": "Premier hôpital en Turquie certifié JCI, reconnu mondialement pour ses réussites en greffes et cardiologie interventionnelle."}'::jsonb,
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
  false,
  30
),
('hosp-4',
  '{"ar": "مستشفيات فلورنس نايتنجيل (Florence Nightingale)", "en": "Group Florence Nightingale Hospitals", "fr": "Hôpitaux Groupe Florence Nightingale"}'::jsonb,
  '{"ar": "مراكز التميز الجراحي وأمراض العمود الفقري", "en": "Center of Excellence in Spine & Neurosurgery", "fr": "Centre d’Excellence en Rachis et Neurochirurgie"}'::jsonb,
  '{"ar": "إسطنبول (شيشلي وقاديكوي)", "en": "Istanbul (Sisli & Kadikoy)", "fr": "Istanbul (Sisli & Kadikoy)"}'::jsonb,
  'JCI Accredited & ISO Certified',
  '{"ar": "مرجع عالمي بارز في جراحات العمود الفقري المعقدة، وجراحات القلب المفتوح وتصحيح انحرافات الظهر (الجنف) بمساعدة الروبوت.", "en": "A world-class reference center for complex spine deformity surgery, scoliosis reconstruction, and adult cardiovascular care.", "fr": "Centre de référence mondial pour la chirurgie du rachis, la correction de la scoliose et la réhabilitation cardio-vasculaire."}'::jsonb,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
  false,
  25
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  city = EXCLUDED.city,
  accreditation = EXCLUDED.accreditation,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  featured = EXCLUDED.featured,
  specialties_count = EXCLUDED.specialties_count,
  updated_at = now();

-- 3. SEED DOCTORS
INSERT INTO public.doctors (id, slug, name, title, specialty_slug, specialty_name, hospital, experience_years, image, rating, review_count, languages, biography, areas_of_expertise, procedures, education) VALUES
('doc-1', 'prof-dr-ahmet-ozkara',
  '{"ar": "أ. د. أحمد أوزكارا", "en": "Prof. Dr. Ahmet Ozkara", "fr": "Prof. Dr. Ahmet Ozkara"}'::jsonb,
  '{"ar": "بروفيسور ورئيس قسم جراحة القلب والأوعية الدموية", "en": "Professor & Head of Cardiovascular Surgery", "fr": "Professeur & Chef de Chirurgie Cardiovasculaire"}'::jsonb,
  'cardiac-surgery',
  '{"ar": "جراحة القلب والأوعية الدموية", "en": "Cardiovascular Surgery", "fr": "Chirurgie Cardiovasculaire"}'::jsonb,
  '{"ar": "مستشفى أجيبادم مسلك إسطنبول", "en": "Acibadem Maslak Hospital Istanbul", "fr": "Hôpital Acibadem Maslak Istanbul"}'::jsonb,
  24,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
  4.9,
  148,
  ARRAY['العربية (مترجم)', 'English', 'Türkçe']::TEXT[],
  '{"ar": "أحد أبرز جراحي القلب في تركيا والشرق الأوسط، أجرى أكثر من 4,000 جراحة قلب معقدة بنسبة نجاح سريرية تتجاوز 99%. رائد في استخدام المنظار والروبوت الجراحي لترميم الصمامات وجراحات القلب طفيفة التوغل.", "en": "One of Turkey’s most respected cardiovascular surgeons with over 4,000 open and minimally invasive surgeries performed. Pioneer in robotic mitral valve repair and off-pump coronary bypass.", "fr": "Chirurgien cardiovasculaire éminent cumulant plus de 4 000 interventions cardiaques majeures avec un taux de réussite clinique supérieur à 99%."}'::jsonb,
  '{"ar": ["جراحة مجازة الشريان التاجي (CABG)", "ترميم واستبدال الصمام الميترالي والأورطي بالمنظار", "جراحات القلب بالروبوت دافنشي", "علاج تمدد الشريان الأورطي الصدري (Aortic Aneurysm)"], "en": ["Coronary Artery Bypass Grafting (CABG)", "Minimally Invasive Mitral & Aortic Valve Surgery", "Robotic Cardiac Surgery (Da Vinci)", "Thoracic Aortic Aneurysm Repair"], "fr": ["Pontage Aortocoronarien (CABG)", "Chirurgie Valvulaire Mini-invasive", "Chirurgie Cardiaque Robotisée", "Réparation d’Anévrisme de l’Aorte"]}'::jsonb,
  '{"ar": ["ترميم الصمام الميترالي بالمنظار دون شق الصدر", "زراعة الشرايين التاجية على القلب النابض", "استبدال الصمام الأورطي عبر القسطرة TAVI", "إصلاح عيوب الحاجز الأذيني والبطيني"], "en": ["Endoscopic Mitral Valve Repair", "Beating Heart Off-Pump Bypass", "Transcatheter Aortic Valve Implantation (TAVI)", "Septal Defect Repair"], "fr": ["Plastie Mitrale Endoscopique", "Pontage à Cœur Battant", "Implantation TAVI", "Fermeture de Communication Interauriculaire"]}'::jsonb,
  '{"ar": ["بكالوريوس الطب والجراحة - كلية الطب بجامعة إسطنبول (1998)", "التخصص والزمالة في جراحة القلب - معهد القلب بجامعة إسطنبول", "زمالة جراحة القلب بالروبوت - المركز الطبي الجامعي لايبتزيغ، ألمانيا", "عضوية الجمعية الأوروبية لجراحة القلب والصدر (EACTS)"], "en": ["MD - Istanbul University Faculty of Medicine (1998)", "Cardiovascular Residency - Istanbul Cardiology Institute", "Fellowship in Robotic Cardiac Surgery - Heart Center Leipzig, Germany", "Fellow of European Association for Cardio-Thoracic Surgery (EACTS)"], "fr": ["Docteur en Médecine - Faculté de Médecine d’Istanbul", "Spécialisation en Chirurgie Cardiovasculaire", "Fellowship en Chirurgie Robotique - Leipzig, Allemagne", "Membre actif de l’EACTS"]}'::jsonb
),
('doc-2', 'dr-mehmet-erdogan',
  '{"ar": "د. محمد أردوغان", "en": "Dr. Mehmet Erdogan", "fr": "Dr. Mehmet Erdogan"}'::jsonb,
  '{"ar": "استشاري أول زراعة الشعر التجميلية وترميم البصيلات", "en": "Senior Hair Restoration Consultant & Surgeon", "fr": "Chirurgien Spécialiste en Restauration Capillaire"}'::jsonb,
  'hair-transplant',
  '{"ar": "زراعة الشعر والترميم التجميلي", "en": "Hair Restoration & Aesthetics", "fr": "Restauration Capillaire & Esthétique"}'::jsonb,
  '{"ar": "مجموعة أفيسينا التخصصية إسطنبول", "en": "Avicenna Aesthetic Center Istanbul", "fr": "Centre Avicenna Esthétique Istanbul"}'::jsonb,
  16,
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
  4.9,
  210,
  ARRAY['العربية (مترجم)', 'English', 'Türkçe']::TEXT[],
  '{"ar": "خبير معترف به دولياً في زراعة الشعر بتقنيات Sapphire FUE و DHI المتقدمة. أشرف شخصياً على أكثر من 5,500 جلسة زراعة شعر لمرضى من أكثر من 45 دولة، مع تركيز خاص على رسم خط المقدمة الطبيعي وكثافة البصيلات القصوى.", "en": "Internationally acclaimed hair restoration specialist with over 5,500 successful procedures. Renowned for natural hairline architecture and advanced Sapphire Micro-FUE and Choi DHI methodologies.", "fr": "Spécialiste de renommée internationale en greffe capillaire Sapphire FUE et stylet DHI avec plus de 5 500 interventions réussies."}'::jsonb,
  '{"ar": ["زراعة الشعر بتقنية السفير الماسي (Sapphire FUE)", "زراعة الشعر المباشرة بأقلام تشوي (DHI)", "زراعة شعر اللحية والشارب والحواجب", "علاجات البلازما الغنية بالصفائح والخلايا الجذعية (PRP & Regenera)"], "en": ["Sapphire FUE Micro-Grafting", "Direct Hair Implantation (DHI Choi Pen)", "Beard, Mustache & Eyebrow Restoration", "Regenerative Stem-Cell & PRP Therapies"], "fr": ["Micro-Greffe Sapphire FUE", "Technique Directe DHI", "Greffe de Barbe et Sourcils", "Traitements Régénératifs PRP"]}'::jsonb,
  '{"ar": ["زراعة تصل إلى 5,500 بصيلة في جلسة واحدة", "رسم خط الشعر التجميلي التوافقي ثلاثي الأبعاد", "علاج الصلع الوراثي المتقدم وندبات الحروق", "ترميم عمليات الزراعة السابقة غير الناجحة"], "en": ["High-Density Mega Sessions (up to 5,500 grafts)", "3D Natural Facial Hairline Design", "Advanced Alopecia & Scar Revision", "Corrective Revision Hair Transplants"], "fr": ["Méga-sessions haute densité", "Tracé naturel de la ligne frontale", "Correction de greffes antérieures ratées", "Traitements des alopécies cicatricielles"]}'::jsonb,
  '{"ar": ["كلية الطب بجامعة حجة تبه - أنقرة", "البورد التركي للطب التجميلي والترميمي", "عضوية الجمعية الدولية لجراحة زراعة الشعر (ISHRS)", "عضو الجمعية الأوروبية لأبحاث الشعر (EHRS)"], "en": ["MD - Hacettepe University School of Medicine", "Turkish Board Certification in Aesthetic Medicine", "Active Member of International Society of Hair Restoration Surgery (ISHRS)", "Member of European Hair Research Society (EHRS)"], "fr": ["Diplômé de la Faculté de Médecine Hacettepe", "Certification d’État en Médecine Esthétique", "Membre Titulaire de l’ISHRS", "Membre de l’EHRS"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  specialty_slug = EXCLUDED.specialty_slug,
  specialty_name = EXCLUDED.specialty_name,
  hospital = EXCLUDED.hospital,
  experience_years = EXCLUDED.experience_years,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  languages = EXCLUDED.languages,
  biography = EXCLUDED.biography,
  areas_of_expertise = EXCLUDED.areas_of_expertise,
  procedures = EXCLUDED.procedures,
  education = EXCLUDED.education,
  updated_at = now();

-- 4. SEED SAMPLE CONSULTATION INQUIRIES
INSERT INTO public.consultation_inquiries (id, tracking_id, full_name, phone, email, country, specialty, notes, status, created_at) VALUES
('inq-1', 'AVIC-7821', 'خالد عبد الله العتيبي', '+966 50 123 4567', 'khaled.alotaibi@example.com', 'المملكة العربية السعودية', 'cardiac-surgery', 'استفسار بخصوص عملية ترميم الصمام الميترالي بالمنظار لوالدي (65 سنة).', 'contacted', '2026-09-12T14:30:00Z'),
('inq-2', 'AVIC-7822', 'Jean-Marc Dubois', '+33 6 12 34 56 78', 'jm.dubois@example.fr', 'France', 'hair-transplant', 'Demande de devis pour greffe de cheveux DHI (environ 4000 greffons).', 'new', '2026-09-13T09:15:00Z'),
('inq-3', 'AVIC-7823', 'مريم الكواري', '+974 55 987 654', 'maryam.k@example.com', 'قطر', 'dentistry', 'حجز موعد لابتسامة هوليوود (عدسات إيماكس لكلا الفكين) خلال شهر أكتوبر.', 'in_review', '2026-09-14T08:00:00Z')
ON CONFLICT (id) DO NOTHING;
