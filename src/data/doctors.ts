export interface DoctorVideo {
  id: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  url: string;
  thumbnail?: string;
  duration?: string;
  description?: {
    ar?: string;
    en?: string;
    fr?: string;
  };
}

export interface DoctorCareerItem {
  period: string;
  role: { ar: string; en: string; fr: string };
  institution: { ar: string; en: string; fr: string };
}

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
  hospitalId: string;
  hospitalSlug?: string;
  hospital: {
    ar: string;
    en: string;
    fr: string;
  };
  experienceYears: number;
  image: string;
  rating: number;
  reviewCount: number;
  surgeriesCount?: number;
  publicationsCount?: number;
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
  careerHistory?: DoctorCareerItem[];
  memberships?: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  technologies?: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  videos?: DoctorVideo[];
  videoUrl?: string;
  videoTitle?: {
    ar: string;
    en: string;
    fr: string;
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
    hospitalId: 'acibadem-altunizade',
    hospitalSlug: 'acibadem-altunizade-hastanesi',
    hospital: {
      ar: 'مستشفى أجيبادم ألتونيزاده',
      en: 'Acıbadem Altunizade Hospital',
      fr: 'Hôpital Acıbadem Altunizade',
    },
    experienceYears: 24,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 184,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français (interprète)'],
    biography: {
      ar: 'يُعد البروفيسور د. أحمد أوزكارا من أبرز جراحي القلب والأوعية الدموية في تركيا بخبرة تتجاوز 24 عاماً في مستشفى أجيبادم ألتونيزاده. أجرى أكثر من 3500 عملية جراحية دقيقة ناجحة تشمل جراحة المجازة التاجية واستبدال الصمامات بالروبوت.',
      en: 'Prof. Dr. Ahmet Ozkara is a leading cardiovascular surgeon at Acıbadem Altunizade Hospital with over 24 years of surgical leadership, performing more than 3,500 successful coronary and valve procedures.',
      fr: 'Le Prof. Dr. Ahmet Ozkara est un chirurgien cardiovasculaire de premier plan à l’Hôpital Acıbadem Altunizade, cumulant plus de 3 500 interventions à cœur ouvert réussies.',
    },
    areasOfExpertise: {
      ar: ['جراحة الشرايين التاجية بالمجازة', 'ترميم واستبدال صمامات القلب بالمنظار', 'جراحة تمدد الشريان الأورطي', 'جراحة الأوعية الدموية بالروبوت'],
      en: ['Coronary Artery Bypass Grafting (CABG)', 'Minimally Invasive Heart Valve Repair', 'Aortic Aneurysm Surgery', 'Robotic Cardiac Interventions'],
      fr: ['Pontage aortocoronarien (PAC)', 'Chirurgie valvulaire mini-invasive', 'Chirurgie de l’anévrisme de l’aorte', 'Chirurgie cardiaque robotisée'],
    },
    procedures: {
      ar: ['مجازة الشريان التاجي (CABG)', 'تبديل الصمام الميترالي والأورطي', 'القسطرة القلبية وتركيب الدعامات الذكية', 'إصلاح العيوب الخلقية للقلب'],
      en: ['CABG Bypass Surgery', 'Mitral & Aortic Valve Replacement', 'Cardiac Catheterization & Stenting', 'Adult Congenital Heart Defect Repair'],
      fr: ['Pontage coronarien CABG', 'Remplacement valvulaire mitral et aortique', 'Cathétérisme et pose de stents', 'Chirurgie cardiaque adulte'],
    },
    education: {
      ar: ['كلية الطب - جامعة إسطنبول (مرتبة الشرف)', 'تخصص جراحة القلب - معهد القلب المتقدم في إسطنبول', 'زمالة جراحة الصمامات المتقدمة - كليفلاند كلينك بالولايات المتحدة'],
      en: ['Istanbul University Faculty of Medicine (Honors)', 'Cardiovascular Surgery Residency - Istanbul Heart Center', 'Advanced Valve Fellowship - Cleveland Clinic (USA)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Spécialisation en Chirurgie Cardiovasculaire', 'Fellowship en Chirurgie Valvulaire Avancée (USA)'],
    },
    surgeriesCount: 4200,
    publicationsCount: 64,
    careerHistory: [
      {
        period: '2016 - الحالي',
        role: {
          ar: 'رئيس قسم جراحة القلب والأوعية الدموية',
          en: 'Head of Cardiovascular Surgery Department',
          fr: 'Chef du Service de Chirurgie Cardiovasculaire',
        },
        institution: {
          ar: 'مستشفى أجيبادم ألتونيزاده - إسطنبول',
          en: 'Acıbadem Altunizade Hospital',
          fr: 'Hôpital Acıbadem Altunizade',
        },
      },
      {
        period: '2008 - 2016',
        role: {
          ar: 'استشاري أول جراحة القلب والشرايين التاجية',
          en: 'Senior Consultant in Adult Cardiac Surgery',
          fr: 'Chirurgien Cardiaque Sénior',
        },
        institution: {
          ar: 'معهد القلب المتقدم بجامعة إسطنبول',
          en: 'Istanbul University Cardiology Institute',
          fr: 'Institut de Cardiologie de l’Université d’Istanbul',
        },
      },
    ],
    memberships: {
      ar: [
        'الجمعية الأوروبية لجراحة القلب والصدر (EACTS)',
        'الجمعية التركية لجراحة القلب والأوعية الدموية (TKDCD)',
        'الجمعية الأمريكية لجراحي الصدر (STS)',
      ],
      en: [
        'European Association for Cardio-Thoracic Surgery (EACTS)',
        'Turkish Society of Cardiovascular Surgery (TKDCD)',
        'Society of Thoracic Surgeons (STS, USA)',
      ],
      fr: [
        'European Association for Cardio-Thoracic Surgery (EACTS)',
        'Société Turque de Chirurgie Cardiovasculaire (TKDCD)',
        'Society of Thoracic Surgeons (STS)',
      ],
    },
    technologies: {
      ar: [
        'روبوت دافنشي الجراحي للقلب (Da Vinci Xi)',
        'جهاز القلب والرئة الاصطناعي الأحدث (Heart-Lung Bypass Machine)',
        'الموجات فوق الصوتية عبر المريء ثلاثية الأبعاد (3D TEE)',
      ],
      en: [
        'Da Vinci Xi Robotic Surgical System',
        'Advanced Cardiopulmonary Bypass Equipment',
        'Intraoperative 3D Transesophageal Echocardiography',
      ],
      fr: [
        'Système robotique Da Vinci Xi',
        'Équipement de circulation extracorporelle avancée',
        'Échocardiographie transœsophagienne 3D peropératoire',
      ],
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
      ar: 'استشاري جراحة المخ والأعصاب وقاع الجمجمة والعمود الفقري',
      en: 'Professor of Neurosurgery & Skull Base Surgery',
      fr: 'Professeur de Neurochirurgie et Base du Crâne',
    },
    specialtySlug: 'neurosurgery',
    specialtyName: {
      ar: 'جراحة المخ والأعصاب',
      en: 'Neurosurgery & Spine',
      fr: 'Neurochirurgie & Rachis',
    },
    hospitalId: 'acibadem-altunizade',
    hospitalSlug: 'acibadem-altunizade-hastanesi',
    hospital: {
      ar: 'مستشفى أجيبادم ألتونيزاده',
      en: 'Acıbadem Altunizade Hospital',
      fr: 'Hôpital Acıbadem Altunizade',
    },
    experienceYears: 22,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 142,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'خبير دولي رائد في جراحات أورام الدماغ وقاع الجمجمة المعقدة باستخدام الجراحة المجهرية وتقنية جاما نايف والملاحة ثلاثية الأبعاد في مستشفى أجيبادم ألتونيزاده.',
      en: 'Distinguished international neurosurgeon specializing in complex skull base tumors, neuro-oncology, and stereotactic radiosurgery with Gamma Knife at Acıbadem Altunizade.',
      fr: 'Neurochirurgien de renommée internationale, expert en tumeurs de la base du crâne et en radiochirurgie Gamma Knife à l’Hôpital Acıbadem Altunizade.',
    },
    areasOfExpertise: {
      ar: ['أورام الدماغ وقاع الجمجمة', 'الجراحة الإشعاعية بجاما نايف', 'جراحة الانزلاق الغضروفي بالمجهر', 'تشوهات الأوعية الدموية الدماغية'],
      en: ['Skull Base & Brain Tumors', 'Gamma Knife Radiosurgery', 'Microscopic Spine Surgery', 'Cerebrovascular Aneurysms & AVM'],
      fr: ['Tumeurs de la base du crâne et du cerveau', 'Radiochirurgie Gamma Knife', 'Microchirurgie du rachis', 'Malformations vasculaires cérébrales'],
    },
    procedures: {
      ar: ['استئصال أورام الدماغ المجهري بالملاحة', 'علاج أورام الغدة النخامية بالمنظار عبر الأنف', 'تثبيت الفقرات وتوسيع القناة العصبية', 'جلسات جاما نايف المركزة'],
      en: ['Image-Guided Brain Tumor Resection', 'Endoscopic Transsphenoidal Pituitary Surgery', 'Spinal Fusion & Decompression', 'Stereotactic Radiosurgery (Gamma Knife)'],
      fr: ['Résection tumorale cérébrale guidée par imagerie', 'Chirurgie hypophysaire par voie endonasale', 'Fusion rachidienne et décompression', 'Radiochirurgie Gamma Knife'],
    },
    education: {
      ar: ['أكاديمية جولهانه العسكرية للطب (GATA) - بكالوريوس الطب والجراحة العامة', 'تخصص جراحة الأعصاب - مستشفى هيدار باشا للتدريب والبحوث في إسطنبول', 'زمالة جراحة قاع الجمجمة المتقدمة والجراحة المجهرية - مستشفى جامعة زيورخ بسويسرا'],
      en: ['Gulhane Military Medical Academy (GATA) - Doctor of Medicine (M.D.)', 'Neurosurgery Residency - Haydarpasa Training & Research Hospital, Istanbul', 'Advanced Skull Base & Microsurgery Fellowship - Zurich University Hospital (Switzerland)'],
      fr: ['Académie Militaire de Médecine Gulhane - Diplôme d’État de Docteur en Médecine', 'Spécialisation en Neurochirurgie - Hôpital Universitaire Haydarpasa', 'Fellowship Avancé en Chirurgie de la Base du Crâne - Hôpital Universitaire de Zurich'],
    },
    surgeriesCount: 3800,
    publicationsCount: 86,
    careerHistory: [
      {
        period: '2019 - الحالي',
        role: {
          ar: 'رئيس قسم جراحة المخ والأعصاب وجراحة قاع الجمجمة المتقدمة',
          en: 'Chief of Neurosurgery & Skull Base Surgery',
          fr: 'Chef du Département de Neurochirurgie et Base du Crâne',
        },
        institution: {
          ar: 'مستشفى أجيبادم ألتونيزاده - إسطنبول',
          en: 'Acıbadem Altunizade Hospital - Istanbul',
          fr: 'Hôpital Acıbadem Altunizade - Istanbul',
        },
      },
      {
        period: '2012 - 2019',
        role: {
          ar: 'بروفيسور جراحة الأعصاب ورئيس وحدة جراحة أورام الجهاز العصبي',
          en: 'Professor of Neurosurgery & Neuro-Oncology Unit Lead',
          fr: 'Professeur de Neurochirurgie et Responsable Unité Neuro-Oncologie',
        },
        institution: {
          ar: 'مستشفى هيدار باشا للتدريب والأبحاث الطبية',
          en: 'Haydarpasa Training & Research Hospital',
          fr: 'Hôpital de Formation et de Recherche Haydarpasa',
        },
      },
      {
        period: '2008 - 2012',
        role: {
          ar: 'استشاري مشارك في جراحة قاع الجمجمة والجراحة الإشعاعية التجسيمية',
          en: 'Associate Consultant in Skull Base & Stereotactic Radiosurgery',
          fr: 'Praticien Associé en Chirurgie de la Base du Crâne & Radiochirurgie',
        },
        institution: {
          ar: 'مستشفى جامعة زيورخ للعلوم العصبية - سويسرا',
          en: 'Zurich University Hospital (USZ) - Switzerland',
          fr: 'Hôpital Universitaire de Zurich - Suisse',
        },
      },
      {
        period: '2002 - 2008',
        role: {
          ar: 'أخصائي جراحة الأعصاب وجراحة العمود الفقري المجهرية',
          en: 'Neurosurgery & Spine Specialist',
          fr: 'Spécialiste en Neurochirurgie et Chirurgie du Rachis',
        },
        institution: {
          ar: 'أكاديمية جولهانه العسكرية للطب (GATA)',
          en: 'Gulhane Military Medical Academy (GATA)',
          fr: 'Académie Militaire de Médecine Gulhane',
        },
      },
    ],
    memberships: {
      ar: [
        'الجمعية الأوروبية لجراحي الأعصاب (EANS)',
        'الاتحاد العالمي لجمعيات جراحة المخ والأعصاب (WFNS)',
        'الجمعية الأمريكية لجراحي الأعصاب (AANS)',
        'الجمعية التركية لجراحة المخ والأعصاب (Türk Nöroşirürji Derneği)',
        'جمعية أورام الدماغ وجراحة قاع الجمجمة الدولية (NASBS)',
      ],
      en: [
        'European Association of Neurosurgical Societies (EANS)',
        'World Federation of Neurosurgical Societies (WFNS)',
        'American Association of Neurological Surgeons (AANS)',
        'Turkish Neurosurgical Society',
        'North American Skull Base Society (NASBS)',
      ],
      fr: [
        'Association Européenne des Sociétés de Neurochirurgie (EANS)',
        'Fédération Mondiale des Sociétés de Neurochirurgie (WFNS)',
        'American Association of Neurological Surgeons (AANS)',
        'Société Turque de Neurochirurgie',
        'North American Skull Base Society (NASBS)',
      ],
    },
    technologies: {
      ar: [
        'الجراحة الإشعاعية بجاما نايف أيكون الأحدث عالمياً (Gamma Knife Icon)',
        'الملاحة الجراحية الكهرومغناطيسية والبصرية ثلاثية الأبعاد (3D Neuronavigation)',
        'التصوير بالرنين المغناطيسي أثناء الجراحة المفتوحة (Intraoperative 3T MRI)',
        'المجهر الجراحي الرقمي عالي الدقة (Zeiss Kinevo 900 4K 3D)',
        'المراقبة العصبية الفسيولوجية أثناء التخدير التام (Intraoperative Neuromonitoring - IONM)',
        'مناظير قاع الجمجمة ذات الزوايا العريضة عالية الوضوح (Full HD Neuro-endoscopy)',
      ],
      en: [
        'Gamma Knife Icon Stereotactic Radiosurgery Suite',
        '3D Optical & Electromagnetic Neuronavigation System',
        'Intraoperative 3T MRI Suite (iMRI)',
        'Zeiss Kinevo 900 4K 3D Robotic Visualization Microscope',
        'Intraoperative Neurophysiological Monitoring (IONM)',
        'High-Definition Angled Endoscopic Skull Base Systems',
      ],
      fr: [
        'Suite de radiochirurgie stéréotaxique Gamma Knife Icon',
        'Système de neuronavigation optique et électromagnétique 3D',
        'IRM peropératoire 3T intégrée au bloc opératoire',
        'Microscope chirurgical robotisé Zeiss Kinevo 900 4K 3D',
        'Monitoring neurophysiologique peropératoire (IONM)',
        'Endoscopie cérébrale haute définition pour base du crâne',
      ],
    },
  },
  {
    id: 'doc-3',
    slug: 'prof-dr-serdar-turhal',
    name: {
      ar: 'أ. د. سردار تورهال',
      en: 'Prof. Dr. Serdar Turhal',
      fr: 'Prof. Dr. Serdar Turhal',
    },
    title: {
      ar: 'رئيس قسم علاج الأورام والعلاج المناعي المستهدف',
      en: 'Professor of Medical Oncology & Targeted Therapy',
      fr: 'Professeur d’Oncologie Médicale & Thérapies Ciblées',
    },
    specialtySlug: 'oncology',
    specialtyName: {
      ar: 'علاج الأورام',
      en: 'Medical Oncology',
      fr: 'Oncologie Médicale',
    },
    hospitalId: 'acibadem-maslak',
    hospitalSlug: 'acibadem-maslak-hospital',
    hospital: {
      ar: 'مستشفى أجيبادم مسلك',
      en: 'Acibadem Maslak Hospital',
      fr: 'Hôpital Acibadem Maslak',
    },
    experienceYears: 26,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 215,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français'],
    biography: {
      ar: 'الرئيس السابق للجمعية التركية للأورام الطبية وباحث رائد في العلاج المناعي والعلاج الموجه لأورام الجهاز الهضمي والثدي والرئة في مستشفى أجيبادم مسلك.',
      en: 'Former President of the Turkish Medical Oncology Society and leading researcher in immunotherapy and molecular targeted cancer care at Acibadem Maslak Hospital.',
      fr: 'Ancien Président de la Société Turque d’Oncologie Médicale et sommité en immunothérapie et thérapies ciblées à l’Hôpital Acibadem Maslak.',
    },
    areasOfExpertise: {
      ar: ['العلاج المناعي المتقدم للأورام', 'أورام الجهاز الهضمي والقولون', 'سرطان الثدي والعلاج الهرموني', 'الفحص الجيني والتسلسل الجزيئي'],
      en: ['Advanced Cancer Immunotherapy', 'Gastrointestinal & Colorectal Oncology', 'Breast Cancer & Targeted Biotherapy', 'Molecular Profiling & Next-Gen Sequencing'],
      fr: ['Immunothérapie oncologique avancée', 'Cancers digestifs et colorectaux', 'Cancer du sein et thérapies ciblées', 'Profilage moléculaire et séquençage génomique'],
    },
    procedures: {
      ar: ['تصميم خطط العلاج الكيميائي والمناعي الموجه', 'العلاج الدوائي المساعد قبل وبعد الجراحة', 'استشارات الفحص الجيني الوراثي للأورام', 'العلاج الهرموني الموجه'],
      en: ['Personalized Immuno-Oncology Protocols', 'Neoadjuvant & Adjuvant Chemotherapy', 'Comprehensive Genetic Cancer Risk Profiling', 'Targeted Biological Therapy Administration'],
      fr: ['Protocoles personnalisés d’immunothérapie', 'Chimiothérapie néoadjuvante et adjuvante', 'Conseil génétique oncologique', 'Biothérapies ciblées'],
    },
    education: {
      ar: ['كلية الطب - جامعة مرمرة', 'تخصص الأورام - مستشفى ماونت سيناي بنيويورك بالولايات المتحدة', 'عضوية الجمعية الأمريكية لعلم الأورام السريري (ASCO)'],
      en: ['Marmara University Faculty of Medicine', 'Oncology Fellowship - Mount Sinai Hospital, New York (USA)', 'Active Member, American Society of Clinical Oncology (ASCO)'],
      fr: ['Faculté de Médecine de l’Université Marmara', 'Fellowship en Oncologie - Mount Sinai Hospital, New York (USA)', 'Membre actif de l’ASCO'],
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
      ar: 'رائد زراعة الكلى والكبد من متبرعين أحياء في الشرق الأوسط',
      en: 'Professor of Living-Donor Organ Transplantation',
      fr: 'Professeur de Greffe d’Organes Donneur Vivant',
    },
    specialtySlug: 'organ-transplant',
    specialtyName: {
      ar: 'زراعة الأعضاء',
      en: 'Organ Transplantation',
      fr: 'Greffes d’Organes',
    },
    hospitalId: 'memorial-sisli',
    hospitalSlug: 'memorial-sisli-hastanesi',
    hospital: {
      ar: 'مستشفى ميموريال شيشلي',
      en: 'Memorial Şişli Hospital',
      fr: 'Hôpital Memorial Şişli',
    },
    experienceYears: 28,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 312,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'يُعد البروفيسور ألبير دميرباش من أعظم جراحي زراعة الأعضاء في العالم. أجرى أكثر من 5000 عملية زراعة كلى وكبد بنسب نجاح تفوق 98% في ميموريال شيشلي.',
      en: 'Prof. Dr. Alper Demirbas is a globally recognized living-donor organ transplant pioneer with more than 5,000 successful kidney and liver transplants at Memorial Şişli Hospital.',
      fr: 'Le Prof. Dr. Alper Demirbas est un pionnier mondial de la greffe d’organes donneur vivant, ayant réalisé plus de 5 000 greffes de rein et de foie à Memorial Şişli.',
    },
    areasOfExpertise: {
      ar: ['زراعة الكلى من متبرع حي للبالغين والأطفال', 'زراعة الكبد من متبرع حي', 'جراحة الأوعية الدموية الدقيقة للزراعة', 'زراعة الكلى عبر فصائل الدم غير المتطابقة'],
      en: ['Living-Donor Kidney Transplantation (Adult & Pediatric)', 'Living-Donor Liver Transplantation', 'Microsurgical Vascular Anastomosis', 'ABO-Incompatible Kidney Transplantation'],
      fr: ['Greffe rénale donneur vivant adulte et pédiatrique', 'Greffe hépatique donneur vivant', 'Microchirurgie vasculaire', 'Transplantation rénale ABO-incompatible'],
    },
    procedures: {
      ar: ['استئصال الكلى من المتبرع بالمنظار', 'زراعة الكلى المجهرية للأطفال', 'زراعة الفص الكبدي من متبرع حي', 'متابعة وتثبيط المناعة الدقيق'],
      en: ['Laparoscopic Donor Nephrectomy', 'Pediatric Kidney Transplantation', 'Living-Donor Liver Lobectomy & Grafting', 'Immunosuppression Optimization'],
      fr: ['Néphrectomie laparoscopique donneur', 'Transplantation rénale pédiatrique', 'Hépatectomie partielle donneur vivant', 'Gestion de l’immunosuppression'],
    },
    education: {
      ar: ['كلية الطب - جامعة حجة تبة', 'زمالة زراعة الأعضاء - جامعة ميامي بالولايات المتحدة', 'عضو الجمعية الدولية لزراعة الأعضاء (TTS)'],
      en: ['Hacettepe University Faculty of Medicine', 'Organ Transplant Fellowship - University of Miami (USA)', 'Member, The Transplantation Society (TTS)'],
      fr: ['Faculté de Médecine de l’Université Hacettepe', 'Fellowship en Greffes - Université de Miami (USA)', 'Membre de The Transplantation Society (TTS)'],
    },
  },
  {
    id: 'doc-5',
    slug: 'assoc-prof-dr-alper-kaya',
    name: {
      ar: 'د. ألبير كايا',
      en: 'Assoc. Prof. Dr. Alper Kaya',
      fr: 'Prof. Assoc. Dr. Alper Kaya',
    },
    title: {
      ar: 'استشاري جراحة العظام وتبديل المفاصل بالروبوت',
      en: 'Associate Professor of Robotic Orthopedic & Joint Surgery',
      fr: 'Chirurgien Orthopédiste Spécialiste des Prothèses Robotisées',
    },
    specialtySlug: 'orthopedics',
    specialtyName: {
      ar: 'جراحة العظام والمفاصل',
      en: 'Orthopedics & Joint Surgery',
      fr: 'Chirurgie Orthopédique',
    },
    hospitalId: 'american-hospital',
    hospitalSlug: 'american-hospital-istanbul',
    hospital: {
      ar: 'المستشفى الأمريكي إسطنبول',
      en: 'American Hospital Istanbul',
      fr: 'Hôpital Américain d’Istanbul',
    },
    experienceYears: 18,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 96,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'جراح عظام بارز في المستشفى الأمريكي إسطنبول، متخصص في عمليات استبدال مفصل الركبة والورك بمساعدة الروبوت، وجراحات المناظير الرياضية الدقيقة للكتف والأربطة.',
      en: 'Leading orthopedic surgeon at American Hospital Istanbul, renowned for robotic-assisted knee and hip arthroplasty, complex shoulder arthroscopy, and sports trauma reconstruction.',
      fr: 'Chirurgien orthopédiste réputé à l’Hôpital Américain d’Istanbul, expert en arthroplastie robotisée de la hanche et du genou et arthroscopie sportive.',
    },
    areasOfExpertise: {
      ar: ['استبدال مفصل الركبة بالروبوت', 'استبدال مفصل الورك بأقل تدخل جراحي', 'ترميم الرباط الصليبي والغضاريف', 'جراحة تنظير الكتف والأوتار'],
      en: ['Robotic-Assisted Total Knee Arthroplasty', 'Minimally Invasive Hip Replacement', 'ACL & Meniscus Arthroscopic Reconstruction', 'Rotator Cuff & Shoulder Arthroscopy'],
      fr: ['Prothèse totale du genou assistée par robot', 'Prothèse de hanche mini-invasive', 'Reconstruction du ligament croisé antérieur', 'Arthroscopie de l’épaule'],
    },
    procedures: {
      ar: ['تبديل الركبة بالذراع الروبوتي', 'استبدال مفصل الورك بالتدخل الأمامي السريع', 'تنظير الركبة وإصلاح الغضروف المفصلي', 'علاج الكسور المعقدة بالصفائح الذكية'],
      en: ['Robotic Knee Replacement', 'Direct Anterior Hip Replacement', 'Knee Arthroscopy & Cartilage Regeneration', 'Complex Fracture Fixation'],
      fr: ['Pose de prothèse de genou robotisée', 'Prothèse de hanche voie antérieure', 'Arthroscopie et greffe cartilagineuse', 'Ostéosynthèse de fractures complexes'],
    },
    education: {
      ar: ['كلية الطب - جامعة إسطنبول (تشابا)', 'تخصص جراحة العظام - مستشفى شيشلي للتدريب', 'زمالة جراحة المفاصل الروبوتية - مستشفى الجراحة الخاصة (HSS) بنيويورك'],
      en: ['Istanbul University Istanbul Faculty of Medicine', 'Orthopedic Surgery Residency - Sisli Etfal Training Hospital', 'Robotic Arthroplasty Fellowship - Hospital for Special Surgery, NY (USA)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Résidence en Chirurgie Orthopédique', 'Fellowship en Arthroplastie Robotisée (HSS New York)'],
    },
  },
  {
    id: 'doc-6',
    slug: 'prof-dr-burak-kocak',
    name: {
      ar: 'أ. د. بوراك كوتشاك',
      en: 'Prof. Dr. Burak Kocak',
      fr: 'Prof. Dr. Burak Kocak',
    },
    title: {
      ar: 'رئيس مركز زراعة الأعضاء وجراحة المسالك البولية الروبوتية',
      en: 'Professor of Urology & Organ Transplantation',
      fr: 'Professeur d’Urologie et de Greffe d’Organes',
    },
    specialtySlug: 'robotic-surgery',
    specialtyName: {
      ar: 'الجراحة الروبوتية',
      en: 'Robotic Surgery & Urology',
      fr: 'Chirurgie Robotique & Urologie',
    },
    hospitalId: 'koc-university-hospital',
    hospitalSlug: 'koc-university-hospital',
    hospital: {
      ar: 'مستشفى جامعة كوتش',
      en: 'Koç University Hospital',
      fr: 'Hôpital Universitaire Koç',
    },
    experienceYears: 23,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 168,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'رئيس قسم جراحة المسالك البولية وزراعة الأعضاء في مستشفى جامعة كوتش، رائد عالمي في استئصال أورام الكلى والبروستاتا بالروبوت دافنشي وزراعة الكلى بالمنظار.',
      en: 'Head of Urology and Organ Transplantation at Koç University Hospital, recognized globally for robotic prostatectomy, partial nephrectomy, and laparoscopic donor nephrectomy.',
      fr: 'Chef du département d’Urologie et de Transplantation d’Organes à l’Hôpital Universitaire Koç, sommité en prostatectomie robotisée et néphrectomie partielle.',
    },
    areasOfExpertise: {
      ar: ['استئصال أورام البروستاتا بالروبوت', 'جراحة أورام الكلى الجزئية بالروبوت', 'زراعة الكلى بالمنظار والروبوت', 'علاج تضخم البروستاتا بالليزر هولميوم HoLEP'],
      en: ['Robotic Radical Prostatectomy', 'Robotic Partial Nephrectomy', 'Robotic Kidney Transplantation', 'HoLEP Laser Prostate Enucleation'],
      fr: ['Prostatectomie radicale robotique', 'Néphrectomie partielle robot-assistée', 'Greffe rénale robotique', 'Énucléation prostatique au laser HoLEP'],
    },
    procedures: {
      ar: ['استئصال البروستاتا بالروبوت مع الحفاظ على الأعصاب', 'استئصال ورم الكلى مع الحفاظ على وظيفة الكلية', 'جراحة تضخم البروستاتا بهولميوم ليزر', 'تفتيت حصوات الكلى بالمنظار المرن'],
      en: ['Nerve-Sparing Robotic Prostatectomy', 'Nephron-Sparing Robotic Kidney Surgery', 'HoLEP Laser Surgery for BPH', 'Flexible Ureteroscopy for Kidney Stones'],
      fr: ['Prostatectomie robotique avec préservation nerveuse', 'Chirurgie conservatrice du rein au robot', 'Intervention HoLEP au laser', 'Urétéroscopie souple pour calculs rénaux'],
    },
    education: {
      ar: ['كلية الطب - جامعة حجة تبة', 'زمالة المسالك البولية الروبوتية - كليفلاند كلينك بالولايات المتحدة', 'عضو الجمعية الأوروبية لجراحة المسالك البولية (EAU)'],
      en: ['Hacettepe University Faculty of Medicine', 'Robotic Urology Fellowship - Cleveland Clinic (USA)', 'Active Fellow, European Association of Urology (EAU)'],
      fr: ['Faculté de Médecine de l’Université Hacettepe', 'Fellowship en Urologie Robotique - Cleveland Clinic (USA)', 'Membre de l’Association Européenne d’Urologie (EAU)'],
    },
  },
  {
    id: 'doc-7',
    slug: 'assoc-prof-dr-volkan-baytekin',
    name: {
      ar: 'د. فولكان بايتكين',
      en: 'Assoc. Prof. Dr. Volkan Baytekin',
      fr: 'Prof. Assoc. Dr. Volkan Baytekin',
    },
    title: {
      ar: 'استشاري الجراحة التجميلية والترميمية ونحت القوام',
      en: 'Plastic, Reconstructive & Aesthetic Surgery Specialist',
      fr: 'Spécialiste en Chirurgie Plastique, Reconstructrice et Esthétique',
    },
    specialtySlug: 'plastic-surgery',
    specialtyName: {
      ar: 'جراحة التجميل ونحت القوام',
      en: 'Plastic & Aesthetic Surgery',
      fr: 'Chirurgie Esthétique & Plastique',
    },
    hospitalId: 'liv-hospital',
    hospitalSlug: 'liv-hospital-istanbul',
    hospital: {
      ar: 'مستشفيات ليف الدولية',
      en: 'Liv Hospital (Ulus & Vadistanbul)',
      fr: 'Hôpitaux Internationaux Liv',
    },
    experienceYears: 16,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 220,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français (interprète)'],
    biography: {
      ar: 'من أشهر جراحي التجميل في تركيا بمستشفى ليف أولوس ووادي إسطنبول، متخصص في نحت القوام رباعي الأبعاد بالفيزر، وتجميل الأنف الطبيعي وشد الوجه العميق بتقنية الـ Deep Plane.',
      en: 'Renowned plastic and aesthetic surgeon at Liv Hospital Istanbul, specializing in high-definition VASER liposculpture, natural preservation rhinoplasty, and Deep Plane facelift surgery.',
      fr: 'Chirurgien plasticien réputé aux Hôpitaux Liv d’Istanbul, expert en liposuccion haute définition VASER, rhinoplastie ultrasonique et lifting cervico-facial Deep Plane.',
    },
    areasOfExpertise: {
      ar: ['نحت القوام الديناميكي عالي الدقة (VASER 4D)', 'تجميل الأنف بالموجات فوق الصوتية (Piezo)', 'شد الوجه العميق Deep Plane Facelift', 'تجميل الثدي وترميمه'],
      en: ['High-Definition VASER 4D Liposculpture', 'Piezo Ultrasonic Rhinoplasty', 'Deep Plane Facelift & Neck Lift', 'Composite Breast Augmentation & Lift'],
      fr: ['Lipoaspiration VASER 4D haute définition', 'Rhinoplastie ultrasonique piézoélectrique', 'Lifting Deep Plane visage et cou', 'Augmentation et lifting mammaire composite'],
    },
    procedures: {
      ar: ['تجميل الأنف المغلق والمفتوح', 'شد البطن مع نحت الخصر والأجناب', 'تكبير الثدي بحشوات السيليكون مع حقن الدهون', 'شد الوجه والرقبة الجراحي'],
      en: ['Preservation Ultrasonic Rhinoplasty', 'Abdominoplasty with Waistline Sculpting', 'Composite Breast Augmentation with Fat Grafting', 'Surgical Deep Plane Facelift'],
      fr: ['Rhinoplastie de préservation fermée/ouverte', 'Abdominoplastie et remodelage de la taille', 'Augmentation mammaire composite avec lipofilling', 'Lifting cervico-facial'],
    },
    education: {
      ar: ['كلية الطب - جامعة أنقرة', 'تخصص جراحة التجميل - مستشفى أنقرة للتدريب والأبحاث', 'زمالة جراحة الوجه التجميلية المتقدمة - إيطاليا وفرنسا'],
      en: ['Ankara University Faculty of Medicine', 'Plastic Surgery Residency - Ankara Training Hospital', 'Advanced Facial Aesthetics Fellowship - Italy & France'],
      fr: ['Faculté de Médecine de l’Université d’Ankara', 'Résidence en Chirurgie Plastique', 'Fellowship en Esthétique Faciale Avancée (Italie & France)'],
    },
  },
  {
    id: 'doc-8',
    slug: 'prof-dr-azmi-hamzaoglu',
    name: {
      ar: 'أ. د. عزمي حمزة أوغلو',
      en: 'Prof. Dr. Azmi Hamzaoglu',
      fr: 'Prof. Dr. Azmi Hamzaoglu',
    },
    title: {
      ar: 'المؤسس ورئيس المركز المرجعي العالمي لجراحة العمود الفقري',
      en: 'Pioneer & Head of Istanbul Comprehensive Spine Center',
      fr: 'Pionnier Mondial & Chef du Centre de Chirurgie du Rachis',
    },
    specialtySlug: 'spine-surgery',
    specialtyName: {
      ar: 'جراحة العمود الفقري وتشوهات الظهر',
      en: 'Spine & Scoliosis Surgery',
      fr: 'Chirurgie du Rachis & Scoliose',
    },
    hospitalId: 'florence-nightingale',
    hospitalSlug: 'istanbul-florence-nightingale-hastanesi',
    hospital: {
      ar: 'مستشفى فلورنس نايتنجيل إسطنبول',
      en: 'İstanbul Florence Nightingale Hastanesi',
      fr: 'Hôpital Florence Nightingale d’Istanbul',
    },
    experienceYears: 32,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 480,
    languages: ['العربية (مترجم)', 'English', 'Türkçe', 'Français (interprète)'],
    biography: {
      ar: 'أسطورة جراحة العمود الفقري والجنف في العالم. أسس مركز العمود الفقري بمستشفى فلورنس نايتنجيل إسطنبول وأجرى أكثر من 12000 جراحة معقدة للعمود الفقري للأطفال والبالغين من أكثر من 50 دولة.',
      en: 'A world-renowned spine legend and pioneer in complex scoliosis correction. Founder of the Istanbul Spine Center at Florence Nightingale Hospital, having performed over 12,000 successful surgeries.',
      fr: 'Une autorité mondiale en chirurgie du rachis et correction de la scoliose. Fondateur du Centre du Rachis à l’Hôpital Florence Nightingale, avec plus de 12 000 interventions réussies.',
    },
    areasOfExpertise: {
      ar: ['تصحيح انحراف العمود الفقري (الجنف والحداب)', 'جراحة الفقرات التنكسية وتضيق القناة العصبية', 'أورام العمود الفقري المجهرية', 'تصحيح تشوهات العمود الفقري لدى الأطفال والبالغين'],
      en: ['Complex Scoliosis & Kyphosis Correction', 'Degenerative Spine & Spinal Stenosis', 'Spinal Tumors & Reconstruction', 'Pediatric & Adult Spinal Deformity'],
      fr: ['Correction des scolioses et cyphoses complexes', 'Canal lombaire étroit et pathologie dégénérative', 'Tumeurs vertébrales et reconstruction', 'Déformations rachidiennes pédiatriques et adultes'],
    },
    procedures: {
      ar: ['تعديل اعوجاج العمود الفقري بالمسامير الموجهة حاسوبياً', 'استئصال الغضروف القطني والعنقي بالمجهر', 'تثبيت الفقرات ثلاثي الأبعاد مع المراقبة العصبية المستمرة', 'استبدال الأقراص الغضروفية الاصطناعية'],
      en: ['Computer-Navigated Spinal Deformity Correction', 'Microscopic Cervical & Lumbar Discectomy', '3D Instrumented Spinal Fusion with Neuromonitoring', 'Artificial Disc Replacement (ADR)'],
      fr: ['Correction de scoliose naviguée par ordinateur', 'Discectomie cervicale et lombaire sous microscope', 'Arthrodèse rachidienne instrumentée avec neuromonitoring', 'Prothèse discale'],
    },
    education: {
      ar: ['كلية الطب - جامعة إسطنبول', 'زمالة جراحة العمود الفقري - جامعة مينيسوتا بالولايات المتحدة', 'الرئيس السابق للجمعية الأوروبية لأبحاث العمود الفقري (Spine Society of Europe)'],
      en: ['Istanbul University Faculty of Medicine', 'Spine Surgery Fellowship - Twin Cities Spine Center, Minnesota (USA)', 'Past President, Spine Society of Europe (EuroSpine)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Fellowship en Chirurgie du Rachis - Twin Cities Spine Center (USA)', 'Ancien Président d’EuroSpine'],
    },
  },
  {
    id: 'doc-9',
    slug: 'prof-dr-necdet-uskent',
    name: {
      ar: 'أ. د. نجدت أوسكنت',
      en: 'Prof. Dr. Necdet Uskent',
      fr: 'Prof. Dr. Necdet Uskent',
    },
    title: {
      ar: 'كبير استشاريي طب الأورام وزراعة نخاع العظم',
      en: 'Senior Consultant in Medical Oncology & Hematology',
      fr: 'Consultant Senior en Oncologie Médicale et Hématologie',
    },
    specialtySlug: 'oncology',
    specialtyName: {
      ar: 'علاج الأورام وأمراض الدم',
      en: 'Oncology & Hematology',
      fr: 'Oncologie & Hématologie',
    },
    hospitalId: 'anadolu-medical-center',
    hospitalSlug: 'anadolu-saglik-merkezi-hastanesi',
    hospital: {
      ar: 'مستشفى مركز أنادولو الطبي',
      en: 'Anadolu Sağlık Merkezi Hastanesi',
      fr: 'Centre Médical Anadolu',
    },
    experienceYears: 30,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 230,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'رائد طب الأورام في مركز أنادولو الطبي التابع لمستشفى جونز هوبكنز. يتمتع بخبرة تزيد عن 30 عاماً في العلاج الموجه وزراعة نخاع العظم الذاتي والخيفي للأورام الصلبة وأمراض الدم.',
      en: 'Senior Oncology Leader at Anadolu Medical Center in affiliation with Johns Hopkins Medicine. Over 30 years of expertise in targeted therapy and bone marrow transplantation.',
      fr: 'Éminent spécialiste en oncologie au Centre Médical Anadolu (affilié Johns Hopkins Medicine), cumulant plus de 30 ans d’expérience en thérapies ciblées et greffes de moelle.',
    },
    areasOfExpertise: {
      ar: ['زراعة نخاع العظم الذاتي والخيفي', 'العلاج الإشعاعي بسايبر نايف', 'سرطان الرئة والأمعاء والغدد الليمفاوية', 'الفحوصات الجزيئية لأورام السرطان'],
      en: ['Autologous & Allogeneic Bone Marrow Transplant', 'CyberKnife Radiosurgery Coordination', 'Lung, Colorectal & Hematologic Malignancies', 'Precision Cancer Genomics'],
      fr: ['Greffes autologues et allogéniques de moelle', 'Radiochirurgie CyberKnife', 'Cancers bronchopulmonaires et digestifs', 'Génomique oncologique de précision'],
    },
    procedures: {
      ar: ['تصميم خطط علاج الأورام وفق بروتوكولات جونز هوبكنز', 'إدارة زراعة الخلايا الجذعية لنخاع العظم', 'العلاج المناعي الموجه بالبصمة الوراثية', 'إعادة تقييم الحالات المستعصية (Second Opinion)'],
      en: ['Johns Hopkins Protocol Cancer Treatment Planning', 'Stem Cell Transplant Protocol Oversight', 'Biomarker-Driven Immunotherapy Infusions', 'International Complex Second Opinion Review'],
      fr: ['Plans de traitement selon protocoles Johns Hopkins', 'Supervision des greffes de cellules souches', 'Immunothérapie guidée par biomarqueurs', 'Deuxièmes avis d’experts internationaux'],
    },
    education: {
      ar: ['أكاديمية جولهانه العسكرية للطب (GATA)', 'زمالة الأورام - معهد دانا فاربر للسرطان / هارفارد ببوسطن بالولايات المتحدة', 'زميل الجمعية الأوروبية لطب الأورام (ESMO)'],
      en: ['Gulhane Military Medical Academy', 'Oncology Research Fellowship - Dana-Farber Cancer Institute, Harvard Medical School (USA)', 'ESMO Certified Medical Oncologist'],
      fr: ['Académie Militaire de Médecine Gulhane', 'Fellowship de Recherche - Dana-Farber Cancer Institute (Harvard, USA)', 'Certifié ESMO'],
    },
  },
  {
    id: 'doc-10',
    slug: 'prof-dr-gazi-zorer',
    name: {
      ar: 'أ. د. غازي زورير',
      en: 'Prof. Dr. Gazi Zorer',
      fr: 'Prof. Dr. Gazi Zorer',
    },
    title: {
      ar: 'استشاري جراحة العظام وتطويل القامة وتشوهات الأطراف',
      en: 'Professor of Orthopedic Surgery & Limb Lengthening',
      fr: 'Professeur d’Orthopédie et Allongement Membre',
    },
    specialtySlug: 'orthopedics',
    specialtyName: {
      ar: 'جراحة العظام وتطويل القامة',
      en: 'Orthopedics & Limb Lengthening',
      fr: 'Orthopédie & Allongement',
    },
    hospitalId: 'medipol-mega',
    hospitalSlug: 'medipol-mega-university-hospital',
    hospital: {
      ar: 'مستشفى ميدي بول ميجا الجامعي',
      en: 'Medipol Mega University Hospital',
      fr: 'Hôpital Universitaire Medipol Mega',
    },
    experienceYears: 27,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 195,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'رئيس قسم جراحة العظام في مستشفى ميدي بول ميجا الجامعي، أحد أكبر الصروح الطبية في تركيا. رائد في جراحات تطويل القامة التجميلية والطبية وتقويم تشوهات الأطراف المتقدمة.',
      en: 'Distinguished Professor of Orthopedics at Medipol Mega University Hospital. A pioneer in medical and cosmetic limb lengthening and complex congenital deformity correction.',
      fr: 'Éminent Professeur d’Orthopédie à l’Hôpital Universitaire Medipol Mega. Pionnier en allongement osseux et correction des déformations complexes des membres.',
    },
    areasOfExpertise: {
      ar: ['تطويل القامة بالمسامير الداخلية الممغنطة (PRECICE)', 'تصحيح اعوجاج وتقوس الساقين', 'جراحة خلع الورك الولادي', 'استبدال مفاصل الركبة والورك'],
      en: ['Intramedullary Limb Lengthening (PRECICE & Stryde)', 'Angular Limb Deformity Correction', 'Developmental Dysplasia of the Hip (DDH)', 'Total Knee & Hip Arthroplasty'],
      fr: ['Allongement par clous intramédullaires électromagnétiques (PRECICE)', 'Correction des déformations angulaires', 'Dysplasie congénitale de la hanche', 'Prothèses de hanche et de genou'],
    },
    procedures: {
      ar: ['تطويل عظم الفخذ والساق بالمسامير الممغنطة الذكية', 'قص وتعديل العظام لتصحيح التقوس (Osteotomy)', 'رد وتثبيت خلع الورك الولادي', 'تبديل المفاصل المتقدم'],
      en: ['Motorized Magnetic Nail Limb Lengthening', 'Realignment Osteotomy for Knock Knees / Bow Legs', 'Pediatric Hip Reconstruction', 'Revision Joint Arthroplasty'],
      fr: ['Allongement fémoral et tibial par clou magnétique', 'Ostéotomie de réalignement membre inférieur', 'Reconstruction de la hanche pédiatrique', 'Chirurgie de révision articulaire'],
    },
    education: {
      ar: ['كلية الطب - جامعة إسطنبول', 'تخصص جراحة العظام - مستشفى شيلشي إتفال', 'زمالة جراحة تطويل الأطراف والتشوهات - معهد بالتيمور بالولايات المتحدة'],
      en: ['Istanbul University Faculty of Medicine', 'Orthopedic Surgery Residency - Sisli Etfal Hospital', 'Limb Lengthening & Deformity Correction Fellowship - Baltimore (USA)'],
      fr: ['Faculté de Médecine de l’Université d’Istanbul', 'Résidence en Chirurgie Orthopédique', 'Fellowship en Allongement et Reconstruction (Baltimore, USA)'],
    },
  },
  {
    id: 'doc-11',
    slug: 'prof-dr-ali-cemal-ozcan',
    name: {
      ar: 'أ. د. علي جمال أوزجان',
      en: 'Prof. Dr. Ali Cemal Ozcan',
      fr: 'Prof. Dr. Ali Cemal Ozcan',
    },
    title: {
      ar: 'استشاري جراحة القلب والأوعية الدموية والشريان الأورطي',
      en: 'Professor of Cardiovascular & Thoracic Surgery',
      fr: 'Professeur de Chirurgie Cardiovasculaire et Thoracique',
    },
    specialtySlug: 'cardiac-surgery',
    specialtyName: {
      ar: 'جراحة القلب والأوعية',
      en: 'Cardiovascular Surgery',
      fr: 'Chirurgie Cardiaque',
    },
    hospitalId: 'memorial-ankara',
    hospitalSlug: 'memorial-ankara-hastanesi',
    hospital: {
      ar: 'مستشفى ميموريال أنقرة',
      en: 'Memorial Ankara Hastanesi',
      fr: 'Hôpital Memorial d’Ankara',
    },
    experienceYears: 25,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 174,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'كبير جراحي القلب في مستشفى ميموريال أنقرة بالعاصمة التركية، خبير في جراحات القلب النابض بدون ماكينة تروية (Off-pump CABG) وترميم الصمامات بالتدخل المحدود.',
      en: 'Head of Cardiovascular Surgery at Memorial Ankara Hospital in Turkey’s capital. Renowned for beating-heart bypass surgery (Off-pump CABG) and minimally invasive valve repair.',
      fr: 'Chef du service de chirurgie cardiaque à l’Hôpital Memorial d’Ankara. Réputé pour les pontages à cœur battant sans CEC et la chirurgie valvulaire mini-invasive.',
    },
    areasOfExpertise: {
      ar: ['جراحة مجازة الشريان التاجي على القلب النابض', 'جراحة تمدد الشريان الأورطي الصدري والبطني (EVAR/TEVAR)', 'ترميم واستبدال الصمام الأورطي والميترالي', 'جراحة الأوردة والشرايين الطرفية'],
      en: ['Beating-Heart Off-Pump CABG Surgery', 'Endovascular Aortic Repair (EVAR / TEVAR)', 'Minimally Invasive Aortic & Mitral Valve Surgery', 'Peripheral Vascular Bypass Interventions'],
      fr: ['Pontage coronarien à cœur battant (Off-Pump)', 'Traitement endovasculaire de l’aorte (EVAR/TEVAR)', 'Chirurgie valvulaire aortique et mitrale mini-invasive', 'Chirurgie vasculaire périphérique'],
    },
    procedures: {
      ar: ['مجازة الشرايين التاجية بدون إيقاف القلب', 'تركيب دعامات الشريان الأورطي بالقسطرة (EVAR)', 'ترميم الصمام الميترالي عبر شق جانبي صغير', 'علاج دوالي الساقين بالقسطرة الحرارية والليزر'],
      en: ['Off-Pump Coronary Artery Bypass', 'Endovascular Stent-Graft Placement for Aorta', 'Minimally Invasive Mitral Valve Repair', 'Endovenous Laser & Radiofrequency Ablation'],
      fr: ['Pontage coronarien à cœur battant', 'Pose d’endoprothèse aortique (EVAR)', 'Plastie mitrale par mini-thoracotomie', 'Traitement des varices par radiofréquence'],
    },
    education: {
      ar: ['كلية الطب - جامعة أنقرة', 'تخصص جراحة القلب - معهد أنقرة المتقدم للقلب', 'زمالة جراحة الأورطي المعقدة - فرانكفورت بألمانيا'],
      en: ['Ankara University Faculty of Medicine', 'Cardiovascular Surgery Residency - Ankara Heart Institute', 'Complex Aortic Surgery Fellowship - Frankfurt University Hospital (Germany)'],
      fr: ['Faculté de Médecine de l’Université d’Ankara', 'Spécialisation en Chirurgie Cardiovasculaire', 'Fellowship en Chirurgie Aortique (Francfort, Allemagne)'],
    },
  },
  {
    id: 'doc-12',
    slug: 'prof-dr-cihangir-akyol',
    name: {
      ar: 'أ. د. جيهانكير أكيول',
      en: 'Prof. Dr. Cihangir Akyol',
      fr: 'Prof. Dr. Cihangir Akyol',
    },
    title: {
      ar: 'استشاري الجراحة العامة والجراحة الروبوتية المتقدمة للأورام',
      en: 'Professor of General & Robotic Surgical Oncology',
      fr: 'Professeur de Chirurgie Générale & Oncologie Robotique',
    },
    specialtySlug: 'robotic-surgery',
    specialtyName: {
      ar: 'الجراحة الروبوتية للأورام',
      en: 'Robotic Surgical Oncology',
      fr: 'Chirurgie Oncologique Robotisée',
    },
    hospitalId: 'memorial-bahcelievler',
    hospitalSlug: 'memorial-bahcelievler-hastanesi',
    hospital: {
      ar: 'مستشفى ميموريال بهتشلي إيفلر',
      en: 'Memorial Bahçelievler Hastanesi',
      fr: 'Hôpital Memorial Bahçelievler',
    },
    experienceYears: 22,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 165,
    languages: ['العربية (مترجم)', 'English', 'Türkçe'],
    biography: {
      ar: 'استشاري الجراحة الروبوتية في مستشفى ميموريال بهتشلي إيفلر الصديق للبيئة (LEED Platinum). خبير في جراحات استئصال أورام القولون والمستقيم والمعدة بالروبوت دافنشي Xi بأعلى درجات الدقة وسرعة التعافي.',
      en: 'Leading Robotic Surgical Oncologist at the world’s first LEED Platinum hospital, Memorial Bahçelievler. Specializes in Da Vinci Xi colorectal surgery, upper GI oncology, and advanced laparoscopic procedures.',
      fr: 'Chirurgien oncologue robotique réputé à l’Hôpital Memorial Bahçelievler (certifié LEED Platine). Spécialiste de la chirurgie colorectale et digestive au robot Da Vinci Xi.',
    },
    areasOfExpertise: {
      ar: ['استئصال أورام القولون والمستقيم بالروبوت', 'جراحة أورام المعدة والمريء بالمنظار والروبوت', 'جراحة الفتق المعقد وجدار البطن بالروبوت', 'علاج أورام البريتون بالعلاج الكيميائي عالي الحرارة (HIPEC)'],
      en: ['Robotic Colorectal Cancer Surgery', 'Minimally Invasive Gastric & Esophageal Cancer Surgery', 'Robotic Complex Abdominal Wall Hernia Reconstruction', 'HIPEC Heated Intraperitoneal Chemotherapy'],
      fr: ['Chirurgie colorectale oncologique robotisée', 'Chirurgie mini-invasive gastrique et œsophagienne', 'Reconstruction robotique des hernies complexes', 'Chimiothérapie hyperthermique intrapéritonéale (CHIP)'],
    },
    procedures: {
      ar: ['استئصال المستقيم الروبوتي مع الحفاظ على المصرات والأعصاب', 'استئصال المعدة الجذري بالروبوت مع تجريف العقد اللمفاوية', 'إجراء HIPEC داخل البطن بعد إزالة الأورام', 'إصلاح الفتق البطني المعقد بالروبوت'],
      en: ['Sphincter-Sparing Robotic Rectal Cancer Resection', 'Robotic Radical Gastrectomy with D2 Lymphadenectomy', 'Cytoreductive Surgery with Hyperthermic Chemotherapy (HIPEC)', 'Robotic Transversus Abdominis Release (TAR) for Hernias'],
      fr: ['Résection rectale robotique avec préservation sphinctérienne', 'Gastrectomie radicale robotisée avec curage ganglionnaire D2', 'Chirurgie de cytoréduction avec CHIP', 'Cure de hernie complexe sous robot'],
    },
    education: {
      ar: ['كلية الطب - جامعة أنقرة', 'تخصص الجراحة العامة - مستشفى أنقرة ابن سينا', 'زمالة الجراحة الروبوتية للأورام - مركز أورام سيول بكوريا الجنوبية'],
      en: ['Ankara University Faculty of Medicine', 'General Surgery Residency - Ankara Ibn-i Sina Hospital', 'Robotic Surgical Oncology Fellowship - Asan Medical Center, Seoul (South Korea)'],
      fr: ['Faculté de Médecine de l’Université d’Ankara', 'Résidence en Chirurgie Générale', 'Fellowship en Chirurgie Oncologique Robotique (Séoul, Corée du Sud)'],
    },
  },
];
