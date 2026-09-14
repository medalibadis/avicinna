export interface Doctor {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  specialtySlug: string;
  specialtyName: {
    ar: string;
    en: string;
    fr: string;
  };
  hospital: {
    ar: string;
    en: string;
    fr: string;
  };
  experienceYears: number;
  image: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  biography: {
    ar: string;
    en: string;
    fr: string;
  };
  areasOfExpertise: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  procedures: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  education: {
    ar: string[];
    en: string[];
    fr: string[];
  };
}

export const doctorsData: Doctor[] = [
  {
    id: 'doc-1',
    slug: 'prof-dr-ahmet-ozkara',
    name: {
      ar: 'أ. د. أحمد أوزكارا',
      en: 'Prof. Dr. Ahmet Ozkara',
      fr: 'Prof. Dr. Ahmet Ozkara',
    },
    title: {
      ar: 'استشاري جراحة القلب والأوعية الدموية وجراحة الشرايين التاجية',
      en: 'Professor of Cardiovascular & Coronary Artery Surgery',
      fr: 'Professeur de Chirurgie Cardiovasculaire et Coronaire',
    },
    specialtySlug: 'cardiac-surgery',
    specialtyName: {
      ar: 'جراحة القلب',
      en: 'Cardiovascular Surgery',
      fr: 'Chirurgie Cardiaque',
    },
    hospital: {
      ar: 'مستشفى أجيبادم إسطنبول ومجموعة أفيسينا',
      en: 'Acibadem Hospital & Avicenna Health Group',
      fr: 'Hôpital Acibadem & Groupe de Santé Avicenna',
    },
    experienceYears: 24,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 184,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français (interprète)'],
    biography: {
      ar: 'يُعد البروفيسور د. أحمد أوزكارا من أبرز جراحي القلب والأوعية الدموية في تركيا بخبرة تتجاوز 24 عاماً. أجرى أكثر من 3500 عملية جراحية دقيقة ناجحة تشمل جراحة المجازة التاجية، واستبدال وترميم صمامات القلب بالمنظار، وجراحات الشريان الأورطي المعقدة.',
      en: 'Prof. Dr. Ahmet Ozkara is a leading cardiovascular surgeon in Turkey with over 24 years of surgical leadership. He has performed more than 3,500 successful procedures including coronary artery bypass, minimally invasive valve repair, and complex aortic interventions.',
      fr: 'Le Prof. Dr. Ahmet Ozkara est un chirurgien cardiovasculaire de premier plan en Turquie avec plus de 24 ans d’expérience. Il a réalisé plus de 3 500 interventions réussies, notamment les pontages coronariens et la réparation valvulaire mini-invasive.',
    },
    areasOfExpertise: {
      ar: ['جراحة الشرايين التاجية المفتوحة وبالمجازة', 'ترميم واستبدال صمامات القلب بالمنظار', 'جراحة تمدد الشريان الأورطي', 'جراحة الأوعية الدموية الطرفية'],
      en: ['Coronary Artery Bypass Grafting (CABG)', 'Minimally Invasive Heart Valve Repair', 'Aortic Aneurysm Surgery', 'Peripheral Vascular Interventions'],
      fr: ['Pontage aortocoronarien (PAC)', 'Chirurgie valvulaire mini-invasive', 'Chirurgie de l’anévrisme de l’aorte', 'Chirurgie vasculaire périphérique'],
    },
    procedures: {
      ar: ['مجازة الشريان التاجي (CABG)', 'تبديل الصمام الميترالي والأورطي', 'القسطرة القلبية وتركيب الدعامات الذكية', 'إصلاح العيوب الخلقية للقلب لدى البالغين'],
      en: ['CABG Bypass Surgery', 'Mitral & Aortic Valve Replacement', 'Cardiac Catheterization & Stenting', 'Adult Congenital Heart Defect Repair'],
      fr: ['Pontage coronarien CABG', 'Remplacement valvulaire mitral et aortique', 'Cathétérisme et pose de stents', 'Chirurgie cardiaque adulte'],
    },
    education: {
      ar: ['كلية الطب - جامعة إسطنبول (مرتبة الشرف)', 'تخصص جراحة القلب - معهد القلب المتقدم في إسطنبول', 'زمالة جراحة الصمامات المتقدمة - كليفلاند كلينك بالولايات المتحدة'],
      en: ['Istanbul University Faculty of Medicine (Honors)', 'Cardiovascular Surgery Residency - Istanbul Heart Center', 'Advanced Valve Fellowship - Cleveland Clinic (USA)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Spécialisation en Chirurgie Cardiovasculaire', 'Fellowship en Chirurgie Valvulaire Avancée (USA)'],
    },
  },
  {
    id: 'doc-2',
    slug: 'prof-dr-mehmet-zeki-gokcil',
    name: {
      ar: 'أ. د. محمد زكي غوكشيل',
      en: 'Prof. Dr. Mehmet Zeki Gokcil',
      fr: 'Prof. Dr. Mehmet Zeki Gokcil',
    },
    title: {
      ar: 'استشاري جراحة المخ والأعصاب والعمود الفقري وقاع الجمجمة',
      en: 'Professor of Neurosurgery & Complex Spine Surgery',
      fr: 'Professeur de Neurochirurgie et Rachis Complexe',
    },
    specialtySlug: 'neurosurgery',
    specialtyName: {
      ar: 'جراحة المخ والأعصاب',
      en: 'Neurosurgery & Spine',
      fr: 'Neurochirurgie & Rachis',
    },
    hospital: {
      ar: 'مستشفى أجيبادم التخصصي ومجموعة أفيسينا',
      en: 'Acibadem Specialist Hospital & Avicenna Group',
      fr: 'Hôpital Spécialisé Acibadem & Groupe Avicenna',
    },
    experienceYears: 22,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 215,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'من كبار جراحي الأعصاب وقاع الجمجمة في تركيا وأوروبا الشرقية، متخصص في استئصال أورام الدماغ باستخدام أحدث تقنيات الملاحة العصبية والجراحة المجهرية ثلاثية الأبعاد وعلاج انزلاقات العمود الفقري بدون جراحة مفتوحة.',
      en: 'One of the foremost neurosurgeons and skull-base specialists in Turkey and Eastern Europe, specializing in neuronavigation brain tumor resection and minimally invasive spine stabilization.',
      fr: 'L’un des neurochirurgiens les plus renommés de Turquie, expert en résection de tumeurs cérébrales guidée par neuronavigation et chirurgie mini-invasive de la colonne vertébrale.',
    },
    areasOfExpertise: {
      ar: ['استئصال أورام الدماغ وقاع الجمجمة', 'جراحة أورام الغدة النخامية بالمنظار', 'علاج الانزلاق الغضروفي بالمايكروسكوب', 'تثبيت الفقرات وتصحيح انحراف العمود الفقري (الجنف)'],
      en: ['Brain Tumor & Skull Base Microsurgery', 'Endoscopic Pituitary Tumor Resection', 'Microscopic Disc Herniation Surgery', 'Spinal Fusion & Scoliosis Correction'],
      fr: ['Microchirurgie des tumeurs cérébrales', 'Chirurgie hypophysaire endoscopique', 'Microdiscectomie lombaire et cervicale', 'Correction de la scoliose et arthrodèse'],
    },
    procedures: {
      ar: ['الجراحة الإشعاعية الروبوتية سايبر نايف (CyberKnife)', 'استئصال الورم بالملاحة العصبية', 'التحفيز العميق للدماغ (DBS)', 'رأب الفقرات الدقيق بالبالون'],
      en: ['CyberKnife Robotic Radiosurgery', 'Neuronavigation Resection', 'Deep Brain Stimulation (DBS)', 'Percutaneous Kyphoplasty'],
      fr: ['Radiochirurgie robotisée CyberKnife', 'Résection sous guidage neuronavigation', 'Stimulation cérébrale profonde (DBS)', 'Kyphoplastie percutanée'],
    },
    education: {
      ar: ['كلية الطب - جامعة هاسيتيبيه أنقرة', 'تخصص جراحة المخ والأعصاب - مشفى التعليم والبحوث في إسطنبول', 'عضو الجمعية الأوروبية لجراحة الأعصاب (EANS)'],
      en: ['Hacettepe University School of Medicine', 'Neurosurgery Residency - Istanbul Training & Research Hospital', 'Member of the European Association of Neurosurgical Societies (EANS)'],
      fr: ['Faculté de Médecine de l’Université Hacettepe', 'Internat de Neurochirurgie à Istanbul', 'Membre de l’Association Européenne des Sociétés de Neurochirurgie (EANS)'],
    },
  },
  {
    id: 'doc-3',
    slug: 'assoc-prof-dr-alper-kaya',
    name: {
      ar: 'د. ألبير كايا',
      en: 'Assoc. Prof. Dr. Alper Kaya',
      fr: 'Dr. Alper Kaya',
    },
    title: {
      ar: 'أخصائي جراحة العظام والمفاصل والطب الرياضي وتبديل المفاصل بالروبوت',
      en: 'Orthopedic & Robotic Joint Replacement Specialist',
      fr: 'Chirurgien Orthopédiste et Remplacement Robotique des Articulations',
    },
    specialtySlug: 'orthopedics',
    specialtyName: {
      ar: 'جراحة العظام والمفاصل',
      en: 'Orthopedics & Joint Surgery',
      fr: 'Orthopédie & Articulations',
    },
    hospital: {
      ar: 'مستشفى أفيسينا الدولي ومستشفى ميموريال',
      en: 'Avicenna International Hospital & Memorial',
      fr: 'Hôpital International Avicenna & Memorial',
    },
    experienceYears: 18,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 162,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Deutsch'],
    biography: {
      ar: 'طبيب استشاري رائد في جراحة المفاصل الصناعية بالذراع الروبوتي (Mako Robotic Surgery) وتنظير الركبة والكتف. يتمتع بسجل حافل في إعادة تأهيل الرياضيين وكبار السن لممارسة حياتهم الطبيعية في غضون أيام قليلة.',
      en: 'A pioneer in robotic-assisted joint arthroplasty (MAKO) and advanced arthroscopic procedures of the knee, hip, and shoulder, enabling rapid recovery for international patients.',
      fr: 'Chirurgien orthopédiste réputé, pionnier des prothèses articulaires assistées par bras robotisé (MAKO) et de l’arthroscopie avancée pour une récupération rapide.',
    },
    areasOfExpertise: {
      ar: ['تبديل مفصل الركبة والورك بالروبوت', 'ترميم الرباط الصليبي والغضاريف بالمنظار', 'جراحة وتر الكتف وتجميد الكتف', 'علاج تشوهات العظام وتطويل القامة التجميلي'],
      en: ['Robotic Knee & Hip Replacement', 'Arthroscopic ACL & Meniscus Reconstruction', 'Rotator Cuff & Shoulder Arthroscopy', 'Deformity Correction & Limb Lengthening'],
      fr: ['Prothèse totale de hanche et genou robotisée', 'Reconstruction ligament croisé (LCA)', 'Chirurgie de la coiffe des rotateurs', 'Allongement osseux et correction'],
    },
    procedures: {
      ar: ['استبدال مفصل الركبة الكلي والجزئي', 'تنظير المفاصل الدقيق', 'حقن الخلايا الجذعية والبلازما (PRP)', 'تثبيت الكسور المعقدة'],
      en: ['Total & Partial Knee Arthroplasty', 'Advanced Joint Arthroscopy', 'Stem Cell & PRP Biologics', 'Complex Fracture Fixation'],
      fr: ['Arthroplastie totale du genou', 'Arthroscopie articulaire diagnostique et thérapeutique', 'Thérapie régénérative PRP et cellules souches'],
    },
    education: {
      ar: ['كلية جراح باشا الطبية - جامعة إسطنبول', 'زمالة جراحة المفاصل الصناعية - مستشفى شاريتيه برلين (ألمانيا)'],
      en: ['Cerrahpasa Faculty of Medicine - Istanbul', 'Arthroplasty Fellowship - Charité Hospital Berlin (Germany)'],
      fr: ['Faculté de Médecine Cerrahpasa d’Istanbul', 'Fellowship en Arthroplastie - Hôpital de la Charité Berlin (Allemagne)'],
    },
  },
  {
    id: 'doc-4',
    slug: 'prof-dr-alper-demirbas',
    name: {
      ar: 'أ. د. ألبير دميرباش',
      en: 'Prof. Dr. Alper Demirbas',
      fr: 'Prof. Dr. Alper Demirbas',
    },
    title: {
      ar: 'رئيس قسم زراعة الأعضاء وجراحة الكلى والكبد',
      en: 'Head of Organ Transplantation (Kidney & Liver)',
      fr: 'Chef du Département de Transplantation d’Organes (Rein & Foie)',
    },
    specialtySlug: 'organ-transplant',
    specialtyName: {
      ar: 'زراعة الأعضاء',
      en: 'Organ Transplantation',
      fr: 'Transplantation d’Organes',
    },
    hospital: {
      ar: 'مركز زراعة الأعضاء المعتمد - مجموعة مستشفيات تركيا',
      en: 'Accredited Organ Transplant Center - Istanbul',
      fr: 'Centre Agréé de Transplantation d’Organes - Istanbul',
    },
    experienceYears: 28,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 310,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'أحد أشهر أطباء زراعة الأعضاء في العالم بنسبة نجاح تفوق 98%. أجرى وفريقه أكثر من 6000 عملية زراعة كلى وكبد للمرضى من أكثر من 40 دولة، وحاز على جوائز دولية من الجمعية العالمية لزراعة الأعضاء.',
      en: 'Globally celebrated organ transplant pioneer with a clinical success rate exceeding 98%. Performed over 6,000 kidney and liver transplants for international patients from 40+ countries.',
      fr: 'Pionnier mondial de la transplantation d’organes avec un taux de réussite clinique supérieur à 98% sur plus de 6 000 greffes de rein et de foie réalisées.',
    },
    areasOfExpertise: {
      ar: ['زراعة الكلى من متبرع حي بالمنظار', 'زراعة الكبد الجزئي', 'زراعة الكلى للأطفال وحالات عدم تطابق فصائل الدم (ABO)', 'جراحة استئصال الأورام الكلوية المعقدة'],
      en: ['Laparoscopic Donor Nephrectomy & Kidney Transplant', 'Living-Donor Liver Transplantation', 'Pediatric Kidney Transplants & ABO Incompatible', 'Complex Renal Oncologic Surgery'],
      fr: ['Greffe rénale par cœlioscopie donneur vivant', 'Transplantation hépatique donneur vivant', 'Greffes pédiatriques et incompatibilité ABO'],
    },
    procedures: {
      ar: ['استئصال كلية المتبرع عبر المنظار الدقيق', 'زراعة الكلى التحضيرية والفورية', 'فحوصات التوافق النسيجي الجيني المتقدمة'],
      en: ['Micro-Laparoscopic Donor Nephrectomy', 'Kidney Transplantation', 'Advanced HLA Genetic Tissue Matching'],
      fr: ['Néphrectomie mini-invasive par cœlioscopie', 'Greffe rénale', 'Typage tissulaire génétique HLA avancé'],
    },
    education: {
      ar: ['جامعة هاجي تبه الطبية', 'زمالة زراعة الأعضاء - جامعة ميامي (الولايات المتحدة الأمريكية)', 'رئيس الجمعية التركية لزراعة الأعضاء سابقاً'],
      en: ['Hacettepe University Faculty of Medicine', 'Transplant Fellowship - University of Miami (USA)', 'Former President of Turkish Transplantation Society'],
      fr: ['Faculté de Médecine de l’Université Hacettepe', 'Fellowship en Transplantation - Université de Miami (USA)'],
    },
  },
  {
    id: 'doc-5',
    slug: 'dr-emre-cicek',
    name: {
      ar: 'د. إيمري تشيتشيك',
      en: 'Dr. Emre Cicek',
      fr: 'Dr. Emre Cicek',
    },
    title: {
      ar: 'استشاري زراعة الشعر والترميم الجلدي بتقنيات DHI وSapphire FUE',
      en: 'Specialist in Hair Restoration & Sapphire FUE / DHI',
      fr: 'Spécialiste de la Greffe de Cheveux DHI & Sapphire FUE',
    },
    specialtySlug: 'hair-transplant',
    specialtyName: {
      ar: 'زراعة الشعر',
      en: 'Hair Restoration',
      fr: 'Greffe de Cheveux',
    },
    hospital: {
      ar: 'مركز أفيسينا الدولي لزراعة الشعر والتجميل',
      en: 'Avicenna International Hair & Aesthetic Clinic',
      fr: 'Clinique Internationale Avicenna de Greffe Capillaire',
    },
    experienceYears: 14,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 420,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français'],
    biography: {
      ar: 'خبير دولي معتمد من الجمعية الدولية لجراحة استعادة الشعر (ISHRS). يتميز بتصميم خطوط الشعر الطبيعية بدقة متناهية وزراعة الكثافة العالية دون ترك أي ندوب باستخدام أقلام تشوي ورؤوس الياقوت السفير.',
      en: 'Certified member of the International Society of Hair Restoration Surgery (ISHRS), renowned for natural hairline artistry and mega-session mega-density transplants with zero visible scarring.',
      fr: 'Membre certifié de l’ISHRS, reconnu pour son tracé naturel de la ligne frontale et ses greffes haute densité sans cicatrice grâce aux techniques Sapphire et DHI.',
    },
    areasOfExpertise: {
      ar: ['زراعة الشعر بتقنية السفير Sapphire FUE', 'زراعة الشعر بأقلام تشوي DHI بدون حلاقة', 'تكثيف شعر اللحية والشارب والحواجب', 'علاج تساقط الشعر بحقن الميزوثيرابي والخلايا الجذعية'],
      en: ['Sapphire Micro-FUE Hair Transplant', 'Unshaven DHI Choi Pen Implantation', 'Beard & Eyebrow Reconstruction', 'Stem Cell & Regenerative Mesotherapy'],
      fr: ['Greffe Sapphire Micro-FUE', 'Implantation DHI stylos Choi sans rasage', 'Greffe de barbe et sourcils', 'Mésothérapie et cellules souches régénératives'],
    },
    procedures: {
      ar: ['اقتطاف البصيلات فائقة الدقة', 'فتح القنوات بأحجار الياقوت السفير', 'حقن البلازما الغنية بالصفائح PRP المعززة'],
      en: ['Ultra-Fine Follicular Extraction', 'Sapphire Blade Channel Opening', 'Growth-Factor Enriched PRP Therapy'],
      fr: ['Extraction folliculaire ultra-précise', 'Ouverture de canaux par lame saphir', 'Thérapie PRP enrichie en facteurs de croissance'],
    },
    education: {
      ar: ['كلية الطب - جامعة أنقرة', 'عضو الجمعية الدولية لجراحة ترميم الشعر ISHRS'],
      en: ['Ankara University Faculty of Medicine', 'Active Member - International Society of Hair Restoration Surgery (ISHRS)'],
      fr: ['Faculté de Médecine de l’Université d’Ankara', 'Membre certifié ISHRS'],
    },
  },
  {
    id: 'doc-6',
    slug: 'dr-dt-seda-arslan',
    name: {
      ar: 'د. سيدا أرسلان',
      en: 'Dr. Dt. Seda Arslan',
      fr: 'Dr. Dt. Seda Arslan',
    },
    title: {
      ar: 'استشارية تجميل وزراعة الأسنان وتصميم ابتسامة هوليوود الرقمية 3D',
      en: 'Cosmetic Dentistry & 3D Digital Hollywood Smile Specialist',
      fr: 'Chirurgien-Dentiste & Spécialiste du Hollywood Smile 3D',
    },
    specialtySlug: 'dentistry',
    specialtyName: {
      ar: 'طب الأسنان',
      en: 'Aesthetic Dentistry',
      fr: 'Dentisterie Esthétique',
    },
    hospital: {
      ar: 'مركز أفيسينا لطب وتجميل الأسنان المتقدم',
      en: 'Avicenna Advanced Dental Center Istanbul',
      fr: 'Centre Dentaire Avancé Avicenna Istanbul',
    },
    experienceYears: 15,
    image: 'https://images.unsplash.com/photo-1594824813576-0c62e5513d8d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 380,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français'],
    biography: {
      ar: 'استشارية بارزة في التركيبات السنية التجميلية وتصميم الابتسامة الرقمية (Digital Smile Design). ساعدت آلاف المرضى الأوروبيين والعرب على الحصول على ابتسامة أحلامهم باستخدام أحدث قشور الإيماكس E-Max والزيركون وزراعة الأسنان الفورية All-on-4.',
      en: 'Renowned aesthetic prosthodontist specializing in Digital Smile Design (DSD), porcelain E-Max veneers, and All-on-4/6 immediate load implants using 3D guided surgery.',
      fr: 'Spécialiste reconnue en réhabilitation esthétique du sourire (Digital Smile Design), facettes E-Max et implants dentaires guidés par ordinateur All-on-4.',
    },
    areasOfExpertise: {
      ar: ['تصميم ابتسامة هوليوود الرقمية (DSD)', 'قشور الإيماكس والزيركون فائق الشفافية', 'زراعة الأسنان الفورية بتقنية All-on-4 و All-on-6', 'تبييض الأسنان بالليزر وتجميل اللثة بالبلازما'],
      en: ['Digital Smile Design (DSD)', 'Ultra-Translucent E-Max & Zirconia Veneers', 'All-on-4 / All-on-6 Immediate Implants', 'Laser Teeth Whitening & Gingival Contouring'],
      fr: ['Design numérique du sourire (DSD)', 'Facettes E-Max et couronnes en zircone', 'Implants à mise en charge immédiate All-on-4', 'Blanchiment dentaire laser'],
    },
    procedures: {
      ar: ['تركيب عدسات الفينير واللومينير', 'الزراعة الجراحية الموجهة بالكمبيوتر', 'معالجة وتجميل الأسنان خلال 5 أيام فقط'],
      en: ['Veneer & Lumineer Placement', 'Computer-Guided Guided Implantology', 'Full Mouth Transformation in 5 Days'],
      fr: ['Pose de facettes et pellicules dentaires', 'Chirurgie implantaire guidée par ordinateur', 'Restauration complète en 5 jours'],
    },
    education: {
      ar: ['كلية طب الأسنان - جامعة مرمرة إسطنبول', 'ماجستير التركيبات وزراعة الأسنان - ألمانيا'],
      en: ['Marmara University Faculty of Dentistry', 'Master of Science in Oral Implantology & Aesthetics (Germany)'],
      fr: ['Faculté de Médecine Dentaire de l’Université de Marmara', 'Master en Implantologie et Esthétique Dentaire (Allemagne)'],
    },
  },
  {
    id: 'doc-7',
    slug: 'prof-dr-serdar-turhal',
    name: {
      ar: 'أ. د. سردار تورهال',
      en: 'Prof. Dr. Serdar Turhal',
      fr: 'Prof. Dr. Serdar Turhal',
    },
    title: {
      ar: 'رئيس قسم الأورام والعلاج المناعي والعلاج الكيميائي الذكي',
      en: 'Head of Medical Oncology & Targeted Immunotherapy',
      fr: 'Chef du Service d’Oncologie Médicale et Immunothérapie',
    },
    specialtySlug: 'oncology',
    specialtyName: {
      ar: 'الأورام والسرطان',
      en: 'Oncology & Cancer Care',
      fr: 'Oncologie & Soins du Cancer',
    },
    hospital: {
      ar: 'مركز الأورام المتخصص - مستشفيات تركيا المعتمدة',
      en: 'Comprehensive Cancer Center - Istanbul',
      fr: 'Centre Intégré d’Oncologie - Istanbul',
    },
    experienceYears: 26,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 198,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'أحد أشهر أطباء الأورام في المنطقة، عضو الجمعية الأمريكية لطب الأورام (ASCO) والجمعية الأوروبية (ESMO). يقدم أحدث بروتوكولات العلاج المناعي والعلاج الموجه بالجينات لاستهداف الخلايا السرطانية بدقة مع حماية الأنسجة السليمة.',
      en: 'Distinguished oncologist and active member of ASCO & ESMO, specializing in next-generation gene-targeted therapies, immunotherapy protocols, and multi-disciplinary tumor board evaluations.',
      fr: 'Oncologue de renommée internationale, membre de l’ASCO et de l’ESMO, expert en immunothérapie de pointe et thérapies ciblées par profilage génétique des tumeurs.',
    },
    areasOfExpertise: {
      ar: ['العلاج المناعي المتقدم (Immunotherapy)', 'العلاج الموجه بالجينات والطفرات الجينية', 'أورام الجهاز الهضمي والقولون والرئة والثدي', 'الاستشارات الثانية وتخطيط علاج الأورام'],
      en: ['Targeted Molecular Therapy & Immunotherapy', 'Next-Generation Gene Profiling', 'Gastrointestinal, Lung, and Breast Oncology', 'Multidisciplinary Second Opinions'],
      fr: ['Immunothérapie et thérapies moléculaires ciblées', 'Profilage génétique des tumeurs', 'Cancers digestifs, pulmonaires et du sein', 'Deuxième avis médical oncologique'],
    },
    procedures: {
      ar: ['دراسة الملف الوراثي للأورام بالـ NGS', 'بروتوكولات العلاج المناعي البيولوجي', 'تقييم شامل عبر المجلس الطبي للأورام'],
      en: ['Next-Generation Sequencing (NGS) Tumor Profiling', 'Biological Immunotherapy Infusions', 'Tumor Board Multi-Disciplinary Assessment'],
      fr: ['Séquençage haut débit NGS des tumeurs', 'Protocoles d’immunothérapie biologique', 'Évaluation multidisciplinaire du dossier tumoral'],
    },
    education: {
      ar: ['جامعة إسطنبول للطب', 'تخصص أمراض الباطنة والأورام - جامعة سينسيناتي (الولايات المتحدة)', 'عضو الجمعية الأمريكية لعلم الأورام السريري ASCO'],
      en: ['Istanbul University School of Medicine', 'Oncology Residency - University of Cincinnati (USA)', 'Member of the American Society of Clinical Oncology (ASCO)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Spécialisation en Oncologie - Université de Cincinnati (USA)', 'Membre de l’ASCO et ESMO'],
    },
  },
  {
    id: 'doc-8',
    slug: 'prof-dr-nilgun-demir',
    name: {
      ar: 'أ. د. نيلغون ديمير',
      en: 'Prof. Dr. Nilgun Demir',
      fr: 'Prof. Dr. Nilgun Demir',
    },
    title: {
      ar: 'استشارية التشخيص الطبي المتقدم والفحوصات الشاملة (Check-Up)',
      en: 'Professor of Internal Medicine & Advanced Medical Diagnostics',
      fr: 'Professeur de Médecine Interne & Diagnostic Médical Avancé',
    },
    specialtySlug: 'diagnostics',
    specialtyName: {
      ar: 'التشخيص الطبي',
      en: 'Medical Diagnostics',
      fr: 'Diagnostic Médical',
    },
    hospital: {
      ar: 'مستشفى أفيسينا التخصصي للتشخيص المبكر',
      en: 'Avicenna Specialist Diagnostic Hospital',
      fr: 'Hôpital Spécialisé de Diagnostic Avicenna',
    },
    experienceYears: 20,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 145,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français'],
    biography: {
      ar: 'استشارية التشخيص الطبي الشامل والفحص الوقائي المبكر. تدير برامج الفحص الدوري VIP للزوار والمرضى الدوليين باستخدام أحدث أجهزة الرنين المغناطيسي 3-Tesla والتصوير المقطعي PET-CT والتحاليل الجينية.',
      en: 'Head of VIP Comprehensive Health Screening and early preventive diagnosis for international visitors, utilizing 3-Tesla MRI, PET-CT scans, and advanced molecular bio-markers.',
      fr: 'Responsable du dépistage médical VIP et du diagnostic précoce pour les patients internationaux, utilisant l’IRM 3-Tesla, le PET-Scan et les biomarqueurs moléculaires.',
    },
    areasOfExpertise: {
      ar: ['الفحص الطبي الشامل VIP في يوم واحد', 'التصوير المقطعي بالرنين المغناطيسي 3T والـ PET-CT', 'الكشف المبكر عن الأورام وأمراض القلب والشرايين', 'الفحوصات الجينية والوقائية المتقدمة'],
      en: ['VIP Executive One-Day Comprehensive Health Check', '3T MRI & High-Definition PET-CT Imaging', 'Early Detection of Cardiovascular & Oncologic Diseases', 'Genetic Risk & Preventive Profiling'],
      fr: ['Bilan de santé global VIP en une journée', 'Imagerie IRM 3T et TEP-Scan haute résolution', 'Dépistage précoce des pathologies vasculaires et tumorales', 'Profilage génétique préventif'],
    },
    procedures: {
      ar: ['إجراء الفحص الشامل المخصص خلال 6 ساعات', 'تصوير شرايين القلب بالأشعة المقطعية بدون قسطرة', 'تقرير طبي مفصل متعدد اللغات'],
      en: ['6-Hour Personalized Executive Health Screening', 'Coronary CT Angiography Without Catheter', 'Multi-Language Comprehensive Medical Summary'],
      fr: ['Bilan de santé personnalisé en 6 heures', 'Coroscanner cardiaque sans cathétérisme', 'Rapport médical détaillé multilingue'],
    },
    education: {
      ar: ['كلية الطب - جامعة أنقرة', 'زمالة أمراض الباطنة والتشخيص الطبي - باريس (فرنسا)'],
      en: ['Ankara University Faculty of Medicine', 'Diagnostic Medicine Fellowship - Paris (France)'],
      fr: ['Faculté de Médecine de l’Université d’Ankara', 'Fellowship en Médecine Interne et Diagnostic - Paris'],
    },
  },
];
