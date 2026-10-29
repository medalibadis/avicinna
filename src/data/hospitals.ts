export interface HospitalPartner {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  type: {
    ar: string;
    en: string;
    fr: string;
  };
  city: {
    ar: string;
    en: string;
    fr: string;
  };
  cityCategory: 'istanbul-asia' | 'istanbul-europe' | 'ankara' | 'kocaeli';
  address: {
    ar: string;
    en: string;
    fr: string;
  };
  accreditation: string;
  accreditationBadge: 'JCI' | 'LEED' | 'ISO' | 'ACADEMIC';
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  gallery?: string[];
  featured: boolean;
  specialtiesCount: number;
  bedsCount: number;
  icuBedsCount: number;
  operatingRoomsCount: number;
  establishedYear: number;
  technologies: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  specialties: string[]; // Specialty slugs matching treatments/doctors
  rating: number;
  reviewsCount: number;
}

export const hospitalsData: HospitalPartner[] = [
  {
    id: 'acibadem-altunizade',
    slug: 'acibadem-altunizade-hastanesi',
    name: {
      ar: 'مستشفى أجيبادم ألتونيزاده (Acıbadem Altunizade)',
      en: 'Acıbadem Altunizade Hospital',
      fr: 'Hôpital Acıbadem Altunizade',
    },
    type: {
      ar: 'مجمع مستشفيات تخصصية وجامعية رائدة',
      en: 'Flagship Academic & Surgical Center',
      fr: 'Centre Hospitalier Universitaire de Référence',
    },
    city: {
      ar: 'إسطنبول (أوسكودار - الجانب الآسيوي)',
      en: 'Istanbul (Üsküdar - Asian Side)',
      fr: 'Istanbul (Üsküdar - Rive Asiatique)',
    },
    cityCategory: 'istanbul-asia',
    address: {
      ar: 'ألتونيزاده، حي يورتسفين، أوسكودار، إسطنبول',
      en: 'Altunizade, Yurtseven Sk., Üsküdar, Istanbul',
      fr: 'Altunizade, Yurtseven Sk., Üsküdar, Istanbul',
    },
    accreditation: 'JCI Accredited & LEED Gold Certified',
    accreditationBadge: 'JCI',
    description: {
      ar: 'أحدث وأكبر صرح طبي متكامل لمجموعة أجيبادم في الجانب الآسيوي لإسطنبول. مجهز بأرقى تقنيات غرف العمليات الهجينة وجراحة الروبوت دافنشي وجهاز جاما نايف أيكون للتصوير الإشعاعي الموجه ثلاثي الأبعاد.',
      en: 'The crown jewel of the Acıbadem Healthcare Network on Istanbul’s Asian shore. Features cutting-edge hybrid surgical suites, Da Vinci Xi robotic systems, and Gamma Knife Icon radiosurgery.',
      fr: 'Le joyau du réseau Acıbadem sur la rive asiatique d’Istanbul. Équipé de blocs opératoires hybrides ultramodernes, de la chirurgie robotique Da Vinci Xi et du Gamma Knife Icon.',
    },
    image: '/images/hospitals/acibadem-altunizade.jpg',
    gallery: [
      '/images/hospitals/acibadem-altunizade.jpg',
      '/images/hospitals/acibadem-altunizade-interior.jpg',
    ],
    featured: true,
    specialtiesCount: 38,
    bedsCount: 350,
    icuBedsCount: 75,
    operatingRoomsCount: 18,
    establishedYear: 2017,
    technologies: {
      ar: ['روبوت دافنشي Xi الجراحي', 'جاما نايف أيكون (Gamma Knife)', 'رنين مغناطيسي 3 تسلا أثناء الجراحة', 'تروبيم (TrueBeam STx)', 'غرف عمليات هجينة ذكية'],
      en: ['Da Vinci Xi Robotic Surgery', 'Gamma Knife Icon Radiosurgery', 'Intraoperative 3T MRI', 'TrueBeam STx Linear Accelerator', 'Smart Hybrid Operating Suites'],
      fr: ['Chirurgie Robotique Da Vinci Xi', 'Gamma Knife Icon', 'IRM peropératoire 3T', 'Accélérateur TrueBeam STx', 'Salles d’Opération Hybrides'],
    },
    specialties: ['cardiac-surgery', 'neurosurgery', 'oncology', 'orthopedics', 'robotic-surgery', 'organ-transplant'],
    rating: 4.9,
    reviewsCount: 342,
  },
  {
    id: 'acibadem-maslak',
    slug: 'acibadem-maslak-hospital',
    name: {
      ar: 'مستشفى أجيبادم مسلك (Acıbadem Maslak)',
      en: 'Acibadem Maslak Hospital',
      fr: 'Hôpital Acibadem Maslak',
    },
    type: {
      ar: 'مستشفى دولي متكامل ومركز تميز الأورام',
      en: 'Comprehensive Cancer Center & Tertiary Care',
      fr: 'Centre Intégré d’Oncologie & Soins Tertiaires',
    },
    city: {
      ar: 'إسطنبول (ساريير / مسلك - الجانب الأوروبي)',
      en: 'Istanbul (Sarıyer / Maslak - European Side)',
      fr: 'Istanbul (Sarıyer / Maslak - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'شارع بيوك درة، مسلك، ساريير، إسطنبول',
      en: 'Büyükdere Cd. No:40, Maslak, Sarıyer, Istanbul',
      fr: 'Büyükdere Cd. No:40, Maslak, Sarıyer, Istanbul',
    },
    accreditation: 'JCI Accredited & LEED Gold Certified',
    accreditationBadge: 'JCI',
    description: {
      ar: 'أحد أكبر المراكز المرجعية لعلاج الأورام وأمراض القلب وجراحة الثدي في أوروبا. يقع في قلب المنطقة المالية لمسلك ومحاط ببيئة استشفائية خضراء تجمع بين الفخامة والتقنية الطبية الأحدث عالمياً.',
      en: 'A premier European reference hospital for surgical oncology, breast health, and interventional cardiology. Combines serene architecture with the most sophisticated radiotherapy and robotic systems.',
      fr: 'Hôpital de référence européen pour la chirurgie oncologique, la sénologie et la cardiologie interventionnelle. Alliant architecture apaisante et technologies de pointe.',
    },
    image: '/images/hospitals/acibadem-maslak.jpg',
    gallery: ['/images/hospitals/acibadem-maslak.jpg'],
    featured: true,
    specialtiesCount: 36,
    bedsCount: 364,
    icuBedsCount: 65,
    operatingRoomsCount: 20,
    establishedYear: 2009,
    technologies: {
      ar: ['سايبر نايف (CyberKnife M6)', 'روبوت دافنشي للجراحة البولية والصدرية', 'مسرع رابيد آرك الخطي', 'رنين مغناطيسي 3 تسلا واسع المجال', 'مركز تشخيص الجينات'],
      en: ['CyberKnife M6 Radiosurgery', 'Da Vinci Robotic Surgery', 'RapidArc Radiotherapy', '3-Tesla Wide-Bore MRI', 'Next-Gen Genetic Sequencing Lab'],
      fr: ['Radiochirurgie CyberKnife M6', 'Robot Da Vinci', 'Radiothérapie RapidArc', 'IRM 3T à large tunnel', 'Laboratoire de Génétique Médicale'],
    },
    specialties: ['oncology', 'cardiac-surgery', 'robotic-surgery', 'orthopedics', 'plastic-surgery', 'organ-transplant'],
    rating: 4.9,
    reviewsCount: 298,
  },
  {
    id: 'memorial-sisli',
    slug: 'memorial-sisli-hastanesi',
    name: {
      ar: 'مستشفى ميموريال شيشلي (Memorial Şişli)',
      en: 'Memorial Şişli Hospital',
      fr: 'Hôpital Memorial Şişli',
    },
    type: {
      ar: 'مستشفى رائد لزراعة الأعضاء وجراحة القلب',
      en: 'Pioneer Organ Transplant & Cardiac Hospital',
      fr: 'Centre Pionnier de Greffes & Chirurgie Cardiaque',
    },
    city: {
      ar: 'إسطنبول (شيشلي / أوكميداني - الجانب الأوروبي)',
      en: 'Istanbul (Şişli / Okmeydanı - European Side)',
      fr: 'Istanbul (Şişli / Okmeydanı - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'حي بياولو، شارع بياله باشا، شيشلي، إسطنبول',
      en: 'Piyalepaşa Blv., Şişli, Istanbul',
      fr: 'Piyalepaşa Blv., Şişli, Istanbul',
    },
    accreditation: 'JCI Accredited (1st in Turkey, 21st Worldwide)',
    accreditationBadge: 'JCI',
    description: {
      ar: 'أول مستشفى في الجمهورية التركية ينال الاعتماد الدولي المشترك JCI. يمتلك شهرة عالمية كمركز رائد في زراعة الكبد والكلى من متبرعين أحياء، وعلاج العقم وأطفال الأنابيب وجراحة القلب المفتوح.',
      en: 'The very first hospital in Turkey to achieve JCI accreditation. Internationally celebrated for pioneering living-donor liver and kidney transplants, IVF genetics, and cardiovascular innovations.',
      fr: 'Le tout premier hôpital de Turquie certifié JCI. Réputé dans le monde entier pour ses succès en greffes hépatiques et rénales donneur vivant, PMA/FIV et cardiologie.',
    },
    image: '/images/hospitals/memorial-sisli.jpg',
    gallery: [
      '/images/hospitals/memorial-sisli.jpg',
      '/images/hospitals/memorial-sisli-building.jpg',
    ],
    featured: true,
    specialtiesCount: 32,
    bedsCount: 252,
    icuBedsCount: 53,
    operatingRoomsCount: 13,
    establishedYear: 2000,
    technologies: {
      ar: ['مركز زراعة الكبد والكلى الحي', 'مختبرات أطفال الأنابيب والتشخيص الوراثي PGD', 'قسطرة القلب الرقمية ثلاثية الأبعاد', 'الجراحة التنظيرية المتقدمة'],
      en: ['Living-Donor Organ Transplant Center', 'Advanced IVF & Pre-implantation Genetics (PGD)', '3D Digital Cardiac Catheterization', 'Advanced Laparoscopic Surgical Suites'],
      fr: ['Centre de Greffes d’Organes Donneur Vivant', 'Laboratoires de FIV et DPI (Dépistage Génétique)', 'Cathétérisme Cardiaque 3D', 'Chirurgie Laparoscopique Avancée'],
    },
    specialties: ['organ-transplant', 'ivf', 'cardiac-surgery', 'neurosurgery', 'oncology', 'orthopedics'],
    rating: 4.8,
    reviewsCount: 412,
  },
  {
    id: 'american-hospital',
    slug: 'american-hospital-istanbul',
    name: {
      ar: 'المستشفى الأمريكي إسطنبول (American Hospital)',
      en: 'American Hospital Istanbul',
      fr: 'Hôpital Américain d’Istanbul',
    },
    type: {
      ar: 'صرح طبي خاص بمعايير الاعتماد الأمريكية',
      en: 'Premier Century-Old American Standard Hospital',
      fr: 'Hôpital de Référence aux Standards Américains',
    },
    city: {
      ar: 'إسطنبول (نيشانتاشي - الجانب الأوروبي)',
      en: 'Istanbul (Nişantaşı - European Side)',
      fr: 'Istanbul (Nişantaşı - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'شارع جوزيل باهتشه، نيشانتاشي، شيشلي، إسطنبول',
      en: 'Güzelbahçe Sk. No:20, Nişantaşı, Şişli, Istanbul',
      fr: 'Güzelbahçe Sk. No:20, Nişantaşı, Şişli, Istanbul',
    },
    accreditation: 'JCI Accredited, ISO 9001, ISO 14001 & ISO 27001',
    accreditationBadge: 'JCI',
    description: {
      ar: 'تأسس عام 1920 برعاية مؤسسة وهبي كوتش الخيرية، ويجسد أعلى معايير الجودة والبروتوكولات الطبية الأمريكية في الشرق الأوسط. يتميز برعاية سريرية فائقة الدقة في علاج الأورام وجراحة العمود الفقري.',
      en: 'Established in 1920 under the Vehbi Koç Foundation, providing over a century of American clinical standards in Istanbul. Premier hub for complex spine care, surgical oncology, and critical intensive care.',
      fr: 'Fondé en 1920 par la Fondation Vehbi Koç, perpétuant plus d’un siècle d’excellence clinique américaine à Istanbul. Référence pour la chirurgie du rachis et l’oncologie.',
    },
    image: '/images/hospitals/american-hospital.jpg',
    gallery: [
      '/images/hospitals/american-hospital.jpg',
      '/images/hospitals/american-hospital-campus.jpg',
    ],
    featured: true,
    specialtiesCount: 35,
    bedsCount: 278,
    icuBedsCount: 41,
    operatingRoomsCount: 12,
    establishedYear: 1920,
    technologies: {
      ar: ['شراكة MD Anderson للأورام', 'أنظمة الملاحة الجراحية الدقيقة للعمود الفقري', 'روبوت دافنشي الجراحي', 'وحدات العناية الحثيثة التخصصية'],
      en: ['MD Anderson Oncology Protocol Affiliation', 'Computer-Assisted Spine Navigation', 'Da Vinci Robotic Surgery', 'Subspecialty Intensive Care Units'],
      fr: ['Affiliation Protocoles MD Anderson', 'Navigation Chirurgicale du Rachis Assistée par Ordinateur', 'Chirurgie Robotique Da Vinci', 'Soins Intensifs Spécialisés'],
    },
    specialties: ['oncology', 'cardiac-surgery', 'neurosurgery', 'orthopedics', 'general-surgery', 'pediatrics'],
    rating: 4.9,
    reviewsCount: 380,
  },
  {
    id: 'koc-university-hospital',
    slug: 'koc-university-hospital',
    name: {
      ar: 'مستشفى جامعة كوتش (Koç University Hospital)',
      en: 'Koç University Hospital',
      fr: 'Hôpital Universitaire Koç',
    },
    type: {
      ar: 'مستشفى جامعي بحثي وتعليمي من الطراز الأول',
      en: 'Top-Tier Academic Research & Medical Center',
      fr: 'Centre Médical Universitaire et de Recherche de Premier Plan',
    },
    city: {
      ar: 'إسطنبول (توبكابي / زيتينبورنو - الجانب الأوروبي)',
      en: 'Istanbul (Topkapı / Zeytinburnu - European Side)',
      fr: 'Istanbul (Topkapı / Zeytinburnu - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'شارع داوود باشا، توبكابي، إسطنبول',
      en: 'Davutpaşa Cd. No:4, Topkapı, Istanbul',
      fr: 'Davutpaşa Cd. No:4, Topkapı, Istanbul',
    },
    accreditation: 'JCI Accredited & Academic Medical Center Certified',
    accreditationBadge: 'ACADEMIC',
    description: {
      ar: 'المستشفى التعليمي والبحثي لكلية الطب بجامعة كوتش المرموقة. يجمع بين أحدث الأبحاث السريرية والتدخلات الجراحية المعقدة لزراعة نخاع العظم للأطفال والبالغين وزراعة الكبد وجراحة المخ والأعصاب.',
      en: 'The premier teaching and research hospital of Koç University School of Medicine. Celebrated for pediatric & adult bone marrow transplantation, multi-organ transplants, and neurosurgical innovation.',
      fr: 'L’hôpital universitaire d’enseignement et de recherche de l’Université Koç. Reconnu pour les greffes de moelle osseuse pédiatriques et adultes et la neurochirurgie de pointe.',
    },
    image: '/images/hospitals/koc-university-hospital.jpg',
    gallery: ['/images/hospitals/koc-university-hospital.jpg'],
    featured: true,
    specialtiesCount: 40,
    bedsCount: 404,
    icuBedsCount: 73,
    operatingRoomsCount: 14,
    establishedYear: 2014,
    technologies: {
      ar: ['جاما نايف بيرفيكشن (Gamma Knife Perfexion)', 'مركز زراعة نخاع العظم التخصصي', 'الجراحة الإشعاعية المتقدمة', 'مركز المحاكاة الطبية الجراحية'],
      en: ['Gamma Knife Perfexion', 'Pediatric & Adult Bone Marrow Transplant Units', 'Advanced Stereotactic Radiosurgery', 'Advanced Surgical Simulation Center'],
      fr: ['Gamma Knife Perfexion', 'Unités de Greffe de Moelle Osseuse Pédiatrique et Adulte', 'Radiochirurgie Stéréotaxique', 'Centre de Simulation Chirurgicale'],
    },
    specialties: ['organ-transplant', 'oncology', 'neurosurgery', 'cardiac-surgery', 'orthopedics', 'ivf'],
    rating: 4.9,
    reviewsCount: 315,
  },
  {
    id: 'liv-hospital',
    slug: 'liv-hospital-istanbul',
    name: {
      ar: 'مستشفيات ليف الدولية (Liv Hospital)',
      en: 'Liv Hospital (Ulus & Vadistanbul)',
      fr: 'Hôpitaux Internationaux Liv',
    },
    type: {
      ar: 'مستشفيات النخبة للجراحة الروبوتية والتجميل',
      en: 'Center of Excellence in Robotic Surgery & VIP Care',
      fr: 'Centre d’Excellence en Chirurgie Robotique & Soins VIP',
    },
    city: {
      ar: 'إسطنبول (أولوس ووادي إسطنبول - الجانب الأوروبي)',
      en: 'Istanbul (Ulus & Vadistanbul - European Side)',
      fr: 'Istanbul (Ulus & Vadistanbul - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'شارع أحمد عدنان سايغون، أولوس، بشكتاش، إسطنبول',
      en: 'Ahmet Adnan Saygun Cd., Ulus, Beşiktaş, Istanbul',
      fr: 'Ahmet Adnan Saygun Cd., Ulus, Beşiktaş, Istanbul',
    },
    accreditation: 'JCI Accredited & SRC Center of Excellence in Robotic Surgery',
    accreditationBadge: 'JCI',
    description: {
      ar: 'صُمم لتقديم مفهوم الضيافة الفاخرة للرعاية الطبية (Leading International Vision). حائز على اعتماد SRC الأمريكي كمركز تميز عالمي في الجراحة الروبوتية والطب التجديدي والعلاج بالخلايا الجذعية.',
      en: 'Stands for "Leading International Vision," delivering 7-star boutique medical hospitality. Certified by the US Surgical Review Corporation (SRC) as a Center of Excellence in Robotic Surgery and Regenerative Medicine.',
      fr: 'Incarne la "Leading International Vision", alliant hôtellerie médicale 7 étoiles et excellence chirurgicale certifiée SRC (USA) en robotique et médecine régénérative.',
    },
    image: '/images/hospitals/liv-hospital.jpg',
    gallery: ['/images/hospitals/liv-hospital.jpg'],
    featured: true,
    specialtiesCount: 30,
    bedsCount: 154,
    icuBedsCount: 38,
    operatingRoomsCount: 8,
    establishedYear: 2013,
    technologies: {
      ar: ['روبوت دافنشي المعتمد من SRC', 'مركز أبحاث الخلايا الجذعية والطب التجديدي', 'أحدث ليزر لتصحيح النظر', 'جراحة التجميل ونحت القوام المجهري'],
      en: ['SRC-Accredited Robotic Surgery Suites', 'Regenerative Medicine & Stem Cell Facility', 'Femtosecond Laser Eye Surgery', 'Micro-Sculpting & Aesthetic Surgery Suite'],
      fr: ['Blocs Robotiques Accrédités SRC', 'Unité de Thérapie Cellulaire et Régénérative', 'Laser Ophtalmologique Femtoseconde', 'Chirurgie Plastique et Esthétique de Pointe'],
    },
    specialties: ['robotic-surgery', 'plastic-surgery', 'orthopedics', 'oncology', 'dental', 'hair-transplant'],
    rating: 4.8,
    reviewsCount: 260,
  },
  {
    id: 'anadolu-medical-center',
    slug: 'anadolu-saglik-merkezi-hastanesi',
    name: {
      ar: 'مستشفى مركز أنادولو الطبي (Anadolu Medical Center)',
      en: 'Anadolu Sağlık Merkezi Hastanesi',
      fr: 'Centre Médical Anadolu',
    },
    type: {
      ar: 'شريك جونز هوبكنز للطب وأكبر مراكز الأورام',
      en: 'In Affiliation with Johns Hopkins Medicine USA',
      fr: 'En Partenariat avec Johns Hopkins Medicine USA',
    },
    city: {
      ar: 'كوجالي / جبزي (ملاصق لإسطنبول الكبرى)',
      en: 'Kocaeli / Gebze (Greater Istanbul Border)',
      fr: 'Kocaeli / Gebze (Bordure Grand Istanbul)',
    },
    cityCategory: 'kocaeli',
    address: {
      ar: 'حي الأناضول، جبزي، كوجالي (إسطنبول الشرقية)',
      en: 'Anadolu Cd. No:1, Çayırova, Gebze, Kocaeli',
      fr: 'Anadolu Cd. No:1, Çayırova, Gebze, Kocaeli',
    },
    accreditation: 'JCI Accredited & ESMO Designated Center',
    accreditationBadge: 'JCI',
    description: {
      ar: 'مركز طبي استراتيجي يربط بين إسطنبول وكوجالي، يعمل بشراكة استراتيجية وتطبيق بروتوكولات مستشفى جونز هوبكنز ميديسين الأمريكي منذ تأسيسه. يُعد من أقوى مراكز العلاج الإشعاعي الدقيق وزراعة نخاع العظم.',
      en: 'A strategic clinical campus affiliated with Johns Hopkins Medicine (USA). Nationally renowned for CyberKnife stereotactic radiosurgery, allogeneic bone marrow transplantation, and international medical second opinions.',
      fr: 'Campus médical d’exception affilié à Johns Hopkins Medicine (USA). Célèbre pour sa radiochirurgie CyberKnife, les greffes allogéniques de moelle osseuse et les deuxièmes avis internationaux.',
    },
    image: '/images/hospitals/anadolu-medical-center.jpg',
    gallery: ['/images/hospitals/anadolu-medical-center.jpg'],
    featured: true,
    specialtiesCount: 34,
    bedsCount: 209,
    icuBedsCount: 59,
    operatingRoomsCount: 8,
    establishedYear: 2005,
    technologies: {
      ar: ['بروتوكولات جونز هوبكنز الطبية', 'سايبر نايف M6 للعلاج غير الجراحي للأورام', 'فاريان إيدج (Varian Edge)', 'وحدة زراعة نخاع العظم المتطورة'],
      en: ['Johns Hopkins Medicine Clinical Protocols', 'CyberKnife M6 Radiosurgery', 'Varian Edge High-Precision System', 'Advanced Hematologic Stem Cell Transplant Unit'],
      fr: ['Protocoles Cliniques Johns Hopkins Medicine', 'CyberKnife M6', 'Système Haute Précision Varian Edge', 'Unité de Greffe Hématopoïétique'],
    },
    specialties: ['oncology', 'organ-transplant', 'cardiac-surgery', 'neurosurgery', 'orthopedics', 'urology'],
    rating: 4.9,
    reviewsCount: 310,
  },
  {
    id: 'florence-nightingale',
    slug: 'istanbul-florence-nightingale-hastanesi',
    name: {
      ar: 'مستشفى فلورنس نايتنجيل إسطنبول (Florence Nightingale)',
      en: 'İstanbul Florence Nightingale Hastanesi',
      fr: 'Hôpital Florence Nightingale d’Istanbul',
    },
    type: {
      ar: 'المركز المرجعي الأول لجراحة العمود الفقري والقلب',
      en: 'Global Reference Center in Spine & Cardiovascular Care',
      fr: 'Centre de Référence Mondial en Rachis et Cardio-Vasculaire',
    },
    city: {
      ar: 'إسطنبول (شيشلي / تشاغلايان - الجانب الأوروبي)',
      en: 'Istanbul (Şişli / Çağlayan - European Side)',
      fr: 'Istanbul (Şişli / Çağlayan - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'حي تشاغلايان، شيشلي، إسطنبول',
      en: 'Çağlayan Mh., Şişli, Istanbul',
      fr: 'Çağlayan Mh., Şişli, Istanbul',
    },
    accreditation: 'JCI Accredited & 1st Certified Green Hospital in Turkey',
    accreditationBadge: 'ISO',
    description: {
      ar: 'أحد أشهر الصروح الطبية في علاج تشوهات وانحرافات العمود الفقري المعقدة (الجنف) وجراحة القلب المفتوح والأوعية الدموية في الشرق الأوسط. يتميز ببرج استشفائي ذكي صديق للبيئة مؤلف من 18 طابقاً.',
      en: 'A world-acclaimed reference center for complex scoliosis, spinal deformity reconstruction, and robotic cardiac interventions. Recognized as Turkey’s first certified Green Hospital.',
      fr: 'Centre de référence mondial pour la scoliose complexe, les déformations du rachis et la chirurgie cardiaque robotisée. Premier hôpital écologique certifié "Green Hospital" en Turquie.',
    },
    image: '/images/hospitals/florence-nightingale.jpg',
    gallery: ['/images/hospitals/florence-nightingale.jpg'],
    featured: false,
    specialtiesCount: 32,
    bedsCount: 219,
    icuBedsCount: 51,
    operatingRoomsCount: 11,
    establishedYear: 2013,
    technologies: {
      ar: ['نظام O-Arm للتصوير ثلاثي الأبعاد أثناء الجراحة', 'الملاحة الجراحية للعمود الفقري StealthStation', 'روبوت دافنشي لجراحة القلب', 'التصوير النووي المقطعي PET-CT'],
      en: ['O-Arm Intraoperative 3D Imaging', 'StealthStation Spinal Navigation', 'Da Vinci Robotic Heart Surgery', 'PET-CT & Nuclear Medicine Suite'],
      fr: ['Imagerie 3D peropératoire O-Arm', 'Navigation du Rachis StealthStation', 'Chirurgie Cardiaque Robotisée Da Vinci', 'Suite PET-CT et Médecine Nucléaire'],
    },
    specialties: ['spine-surgery', 'neurosurgery', 'cardiac-surgery', 'orthopedics', 'organ-transplant', 'oncology'],
    rating: 4.8,
    reviewsCount: 330,
  },
  {
    id: 'medipol-mega',
    slug: 'medipol-mega-university-hospital',
    name: {
      ar: 'مستشفى ميدي بول ميجا الجامعي (Medipol Mega)',
      en: 'Medipol Mega University Hospital',
      fr: 'Hôpital Universitaire Medipol Mega',
    },
    type: {
      ar: 'أكبر مجمع مستشفيات تخصصية خاص في تركيا (4 في 1)',
      en: 'Turkey’s Largest Private Hospital Mega-Complex (4-in-1)',
      fr: 'Le Plus Grand Méga-Complexe Hospitalier Privé de Turquie',
    },
    city: {
      ar: 'إسطنبول (باغجلار / تيم إكسبريس - الجانب الأوروبي)',
      en: 'Istanbul (Bağcılar / TEM - European Side)',
      fr: 'Istanbul (Bağcılar / TEM - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'حي غوزيل تبيه، باغجلار، إسطنبول',
      en: 'Göztepe Mh., Bağcılar, Istanbul',
      fr: 'Göztepe Mh., Bağcılar, Istanbul',
    },
    accreditation: 'JCI Accredited & Academic Teaching Complex',
    accreditationBadge: 'ACADEMIC',
    description: {
      ar: 'أكبر مجمع طبي جامعي متكامل في تركيا يضم 4 مستشفيات منفصلة: مستشفى عام، مستشفى الأورام، مستشفى جراحة القلب، ومستشفى طب وجراحة الأسنان. يوفر سعة تزيد عن 810 أسرّة مع مهبط للطائرات المروحية.',
      en: 'Turkey’s largest private medical complex uniting 4 specialized hospitals under one roof: General, Oncology, Cardiovascular, and Dental. Boasts over 810 beds and dedicated international patient heliports.',
      fr: 'Le plus grand complexe médical privé de Turquie réunissant 4 hôpitaux spécialisés : Général, Oncologie, Cardiovasculaire et Dentaire. Plus de 810 lits avec héliport international dédié.',
    },
    image: '/images/hospitals/medipol-mega.jpg',
    gallery: ['/images/hospitals/medipol-mega.jpg'],
    featured: true,
    specialtiesCount: 42,
    bedsCount: 810,
    icuBedsCount: 246,
    operatingRoomsCount: 35,
    establishedYear: 2012,
    technologies: {
      ar: ['الموجات فوق الصوتية المركزة عالية الكثافة HIFU', 'جاما نايف وسايبر نايف', 'روبوت دافنشي الجراحي', 'أحدث مختبرات زراعة الكلى والكبد'],
      en: ['HIFU High-Intensity Focused Ultrasound', 'Gamma Knife & CyberKnife Systems', 'Da Vinci Robotic Surgery', 'Comprehensive Organ & Bone Marrow Transplant Suites'],
      fr: ['Ultrasons Focalisés de Haute Intensité (HIFU)', 'Systèmes Gamma Knife et CyberKnife', 'Chirurgie Robotique Da Vinci', 'Plateaux de Greffes Rénale et Hépatique'],
    },
    specialties: ['oncology', 'cardiac-surgery', 'neurosurgery', 'organ-transplant', 'dental', 'ivf', 'orthopedics'],
    rating: 4.8,
    reviewsCount: 520,
  },
  {
    id: 'memorial-ankara',
    slug: 'memorial-ankara-hastanesi',
    name: {
      ar: 'مستشفى ميموريال أنقرة (Memorial Ankara)',
      en: 'Memorial Ankara Hastanesi',
      fr: 'Hôpital Memorial d’Ankara',
    },
    type: {
      ar: 'أرقى صرح طبي استشفائي في العاصمة التركية أنقرة',
      en: 'Flagship Tertiary Hospital in Turkey’s Capital',
      fr: 'Hôpital Tertiaire de Référence dans la Capitale Ankara',
    },
    city: {
      ar: 'أنقرة (بالغات / تشانكايا)',
      en: 'Ankara (Balgat / Çankaya)',
      fr: 'Ankara (Balgat / Çankaya)',
    },
    cityCategory: 'ankara',
    address: {
      ar: 'شارع مولانا، بالغات، تشانكايا، أنقرة',
      en: 'Mevlana Blv. No:142, Balgat, Çankaya, Ankara',
      fr: 'Mevlana Blv. No:142, Balgat, Çankaya, Ankara',
    },
    accreditation: 'JCI Accredited',
    accreditationBadge: 'JCI',
    description: {
      ar: 'الوجهة الطبية الأبرز للمرضى الدوليين والدبلوماسيين في العاصمة التركية أنقرة. صُمم وفق أعلى معايير العمارة الطبية الحديثة بمساحة 42 ألف متر مربع، ويضم أرقى مراكز أمراض القلب والأورام وأطفال الأنابيب.',
      en: 'The premier destination for international healthcare in Turkey’s capital city. Spans 42,000 square meters with world-class facilities in cardiovascular surgery, targeted oncology, and reproductive medicine.',
      fr: 'L’adresse médicale de référence pour les patients internationaux dans la capitale Ankara. Un complexe moderne de 42 000 m² abritant des pôles d’excellence en cardiologie et oncologie.',
    },
    image: '/images/hospitals/memorial-ankara.jpg',
    gallery: ['/images/hospitals/memorial-ankara.jpg'],
    featured: false,
    specialtiesCount: 30,
    bedsCount: 230,
    icuBedsCount: 60,
    operatingRoomsCount: 11,
    establishedYear: 2014,
    technologies: {
      ar: ['وحدة القسطرة الهجينة المتطورة', 'مسرع إلكتا الخطي للأورام (Elekta Versa HD)', 'رنين مغناطيسي رقمي 3 تسلا', 'وحدة الرعاية الفائقة للأطفال حديثي الولادة'],
      en: ['Hybrid Coronary Angiography Suite', 'Elekta Versa HD Radiotherapy', 'Digital 3T Magnetic Resonance Imaging', 'Level III Neonatal Intensive Care Unit (NICU)'],
      fr: ['Salle d’Angiographie Coronaire Hybride', 'Radiothérapie Elekta Versa HD', 'IRM Numérique 3 Tesla', 'Soins Intensifs Néonataux de Niveau III'],
    },
    specialties: ['cardiac-surgery', 'oncology', 'organ-transplant', 'orthopedics', 'neurosurgery', 'ivf'],
    rating: 4.9,
    reviewsCount: 275,
  },
  {
    id: 'memorial-bahcelievler',
    slug: 'memorial-bahcelievler-hastanesi',
    name: {
      ar: 'مستشفى ميموريال بهتشلي إيفلر (Memorial Bahçelievler)',
      en: 'Memorial Bahçelievler Hastanesi',
      fr: 'Hôpital Memorial Bahçelievler',
    },
    type: {
      ar: 'أول مستشفى في العالم حائز على اعتماد LEED البلاتيني الكامل',
      en: 'World’s 1st LEED Platinum Certified Full-Service Hospital',
      fr: '1er Hôpital au Monde Certifié LEED Platine Intégral',
    },
    city: {
      ar: 'إسطنبول (بهتشلي إيفلر - الجانب الأوروبي)',
      en: 'Istanbul (Bahçelievler - European Side)',
      fr: 'Istanbul (Bahçelievler - Rive Européenne)',
    },
    cityCategory: 'istanbul-europe',
    address: {
      ar: 'شارع إسكي لوندرة أصفالتي، بهتشلي إيفلر، إسطنبول',
      en: 'Eski Londra Asfaltı Cd. No:89, Bahçelievler, Istanbul',
      fr: 'Eski Londra Asfaltı Cd. No:89, Bahçelievler, Istanbul',
    },
    accreditation: 'JCI Accredited & USGBC LEED Platinum Certified',
    accreditationBadge: 'LEED',
    description: {
      ar: 'تحفة معمارية استشفائية صديقة للبيئة، وأول مستشفى متكامل في العالم يحوز على شهادة LEED البلاتينية للريادة البيئية. يوفر بيئة استشفاء فريدة مدعمة بالضوء الطبيعي والمساحات الخضراء وجراحة الروبوت دافنشي.',
      en: 'An architectural masterpiece in eco-healing and the world’s very first full-service hospital awarded LEED Platinum certification. Integrates daylight-maximizing healing design with advanced robotic surgery.',
      fr: 'Chef-d’œuvre architectural écologique et le premier hôpital au monde certifié LEED Platine. Alliant design thérapeutique maximisant la lumière naturelle et chirurgie robotique avancée.',
    },
    image: '/images/hospitals/memorial-bahcelievler.jpg',
    gallery: ['/images/hospitals/memorial-bahcelievler.jpg'],
    featured: true,
    specialtiesCount: 34,
    bedsCount: 320,
    icuBedsCount: 57,
    operatingRoomsCount: 15,
    establishedYear: 2018,
    technologies: {
      ar: ['تصميم استشفائي صديق للبيئة LEED Platinum', 'روبوت دافنشي Xi الجراحي', 'مركز متكامل لأورام الأطفال', 'أحدث جهاز TrueBeam للإشعاع المستهدف'],
      en: ['LEED Platinum Certified Healing Environment', 'Da Vinci Xi Robotic Surgery', 'Integrated Pediatric Oncology Institute', 'Advanced TrueBeam Target Radiotherapy'],
      fr: ['Environnement Thérapeutique Certifié LEED Platine', 'Robot Chirurgical Da Vinci Xi', 'Institut Intégré d’Oncologie Pédiatrique', 'Radiothérapie Ciblée TrueBeam'],
    },
    specialties: ['oncology', 'pediatric-surgery', 'robotic-surgery', 'cardiac-surgery', 'orthopedics', 'neurosurgery'],
    rating: 4.9,
    reviewsCount: 360,
  },
];
