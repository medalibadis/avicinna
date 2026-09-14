export type Language = 'ar' | 'en' | 'fr';

export interface TranslationDictionary {
  nav: {
    home: string;
    doctors: string;
    patientStories: string;
    blog: string;
    services: string;
    about: string;
    contact: string;
    freeConsultation: string;
  };
  hero: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    subtitle: string;
    searchPlaceholder: string;
    primaryCta: string;
    secondaryCta: string;
    trustBadge: string;
  };
  stats: {
    patientsCount: string;
    patientsLabel: string;
    hospitalsCount: string;
    hospitalsLabel: string;
    specialtiesCount: string;
    specialtiesLabel: string;
  };
  values: {
    experienceTitle: string;
    experienceDesc: string;
    networkTitle: string;
    networkDesc: string;
    guidanceTitle: string;
    guidanceDesc: string;
  };
  about: {
    badge: string;
    heading: string;
    lead: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    cta: string;
  };
  specialties: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    viewDetails: string;
  };
  whyChoose: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    whatsappCta: string;
  };
  hospitals: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    facilityTitle: string;
    facilityDesc: string;
    transferTitle: string;
    transferDesc: string;
    coordinationTitle: string;
    coordinationDesc: string;
  };
  doctors: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    viewProfile: string;
    requestConsultation: string;
    allDoctorsCta: string;
  };
  cta: {
    title: string;
    subtitle: string;
    whatsappBtn: string;
    formTitle: string;
    fullName: string;
    phone: string;
    country: string;
    specialty: string;
    caseNotes: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    uploadReport: string;
  };
  patientStories: {
    badge: string;
    title: string;
    subtitle: string;
    readStory: string;
    allStoriesCta: string;
    duration: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allArticles: string;
    readMore: string;
    allBlogCta: string;
    minRead: string;
  };
  journey: {
    badge: string;
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    step7: string;
    step8: string;
    step9: string;
  };
  footer: {
    tagline: string;
    servicesTitle: string;
    quickLinksTitle: string;
    contactTitle: string;
    rights: string;
    privacy: string;
    terms: string;
    workingHours: string;
    location: string;
  };
  common: {
    whatsapp: string;
    callNow: string;
    back: string;
    explore: string;
    freeQuote: string;
    learnMore: string;
    adminDashboard: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    nav: {
      home: 'الرئيسية',
      doctors: 'الأطباء',
      patientStories: 'قصص المرضى',
      blog: 'المدونة',
      services: 'الخدمات',
      about: 'عن أفيسينا',
      contact: 'اتصل بنا',
      freeConsultation: 'استشارة مجانية',
    },
    hero: {
      eyebrow: 'منصتكم الموثوقة للعلاج المتقدم والرعاية الطبية الدولية في تركيا',
      headlinePart1: 'صحتك تبدأ بخطوة واحدة',
      headlineHighlight: 'نحو أفضل رعاية طبية في تركيا',
      headlinePart2: 'مع نخبة الاستشاريين وأحدث المستشفيات المعتمدة عالمياً',
      subtitle: 'ترافقكم AVICINNA في كافة مراحل رحلتكم العلاجية، من الاستشارة الطبية الأولية المجانية حتى الشفاء التام والمتابعة المستمرة في إسطنبول.',
      searchPlaceholder: 'ابحث عن تخصص، طبيب أو علاج...',
      primaryCta: 'احصل على استشارة مجانية',
      secondaryCta: 'اكتشف خدماتنا',
      trustBadge: 'معتمد من وزارة الصحة التركية ومستشفيات JCI',
    },
    stats: {
      patientsCount: '+2500',
      patientsLabel: 'مريض سعيد',
      hospitalsCount: '+15',
      hospitalsLabel: 'مستشفى شريك',
      specialtiesCount: '+10',
      specialtiesLabel: 'تخصصات طبية',
    },
    values: {
      experienceTitle: 'خبرة موثوقة',
      experienceDesc: 'أكثر من 10 سنوات من الخبرة الاستشارية في توجيه ومرافقة المرضى الدوليين بنجاح وأمان.',
      networkTitle: 'شبكة طبية قوية',
      networkDesc: 'شراكات استراتيجية حصرية مع أرقى المستشفيات الجامعية والمراكز التخصصية الحائزة على اعتماد JCI.',
      guidanceTitle: 'مرافقة في كل الخطوات',
      guidanceDesc: 'فريق طبي وإداري متعدد اللغات يلازمك من المطار والفندق حتى داخل غرف العمليات وبعد العودة.',
    },
    about: {
      badge: 'عن منصة أفيسينا',
      heading: '10 سنوات من التميز في مرافقة المريض الدولي',
      lead: 'تأسست AVICINNA بهدف توفير أرقى مستويات الرعاية الصحية المتخصصة للمرضى القادمين من شتى أنحاء العالم إلى تركيا، مع الالتزام بأعلى معايير الشفافية والاحترافية الطبية.',
      feature1Title: 'أفضل المستشفيات المعتمدة',
      feature1Desc: 'نختار لك المستشفى الأنسب لحالتك المزود بأحدث التقنيات الجراحية مثل الروبوت الجراحي وCyberKnife ومختبرات زراعة الخلايا.',
      feature2Title: 'مرافقة في كل الخطوات',
      feature2Desc: 'مترجم طبي شخصي، نقل خاص بسيارات VIP، إقامة فاخرة، ومتابعة طبية دقيقة طوال فترة إقامتك وما بعدها.',
      cta: 'اعرف المزيد عن أفيسينا',
    },
    specialties: {
      badge: 'التخصصات الطبية الدقيقة',
      title: 'خيارات علاجية متقدمة في أهم الأقسام الطبية',
      subtitle: 'نغطي أدق العمليات الجراحية والعلاجات المتطورة بواسطة كبار الجراحين والاستشاريين المعترف بهم دولياً.',
      cta: 'اكتشف جميع التخصصات',
      viewDetails: 'تفاصيل التخصص',
    },
    whyChoose: {
      badge: 'لماذا يختار المرضى AVICINNA؟',
      title: 'خدمات متكاملة لخطوتك نحو الشفاء',
      subtitle: 'نقدم حلولاً علاجية شاملة تزيل عنك عبء التنظيم والترجمة، لنضمن لك تركيزاً كاملاً على صحتك وراحتك.',
      card1Title: 'استشارة مجانية ودراسة ملفك',
      card1Desc: 'يقوم أطباؤنا الاستشاريون بدراسة تقاريرك وصورك الشعاعية وتقديم خطة علاجية مفصلة مع التكلفة المتوقعة مسبقاً دون أي التزام.',
      card2Title: 'أفضل المستشفيات والمراكز التخصصية',
      card2Desc: 'الوصول المباشر إلى مستشفيات كبرى مجهزة بأعلى تصنيفات السلامة العالمية مثل مستشفيات أجيبادم ومستشفيات أفيسينا الدولية.',
      card3Title: 'دعم كامل وإقامة فاخرة',
      card3Desc: 'حجز أجنحة فندقية 5 نجوم مجهزة للمرضى ومرافقيهم مع سيارات استقبال وتوديع خاصة على مدار الساعة.',
      card4Title: 'تواصل واستجابة فورية 24/7',
      card4Desc: 'منسق طبي مخصص يجيب على استفساراتك فوراً بلغتك الأم عبر واتساب والهاتف في أي وقت.',
      whatsappCta: 'تواصل واتساب مع منسق طبي',
    },
    hospitals: {
      badge: 'المرافق الطبية والشراكات',
      title: 'تعالج واستكشف إسطنبول',
      subtitle: 'نجمع بين أرقى خدمات العلاج المتقدم والإقامة الفاخرة لتجعل من رحلتك العلاجية تجربة مطمئنة ومريحة في قلب تركيا.',
      card1Title: 'أجنحة إقامة فندقية فاخرة للمرضى',
      card1Desc: 'إقامة راقية في فنادق 5 نجوم شريكة قريبة من المستشفيات، مهيأة بالكامل لراحة المريض ومرافقيه مع خدمات تمريض عند الحاجة.',
      card2Title: 'مستشفى أجيبادم إسطنبول والشركاء',
      card2Desc: 'أحد أهم الصروح الطبية في تركيا وأوروبا، يمتلك تقنيات جراحية رائدة ومراكز متخصصة في الأورام والقلب وجراحة الأعصاب.',
      facilityTitle: 'مرافق إقامة للمرضى',
      facilityDesc: 'أجنحة مهيأة للمرضى مع وجبات صحية مخصصة ومصاعد طبية.',
      transferTitle: 'تنقلات منظمة 24/7',
      transferDesc: 'سيارات VIP حديثة لتنقلاتك بين المطار والفندق والمستشفى في كل موعد.',
      coordinationTitle: 'دعم وتنسيق طبي',
      coordinationDesc: 'مترجم معتمد يلازمك في كافة الاستشارات والفحوصات المخبرية.',
    },
    doctors: {
      badge: 'الكادر الطبي الاستشاري',
      title: 'فريقنا الطبي المتخصص',
      subtitle: 'أطباء متخصصون في أكثر من 10 تخصصات طبية، يعملون في أفضل المستشفيات في تركيا، بخبرات دولية مشهود لها.',
      filterAll: 'جميع التخصصات',
      viewProfile: 'عرض الملف الطبي',
      requestConsultation: 'طلب استشارة مع الطبيب',
      allDoctorsCta: 'عرض جميع الأطباء والاستشاريين',
    },
    cta: {
      title: 'ابدأ رحلتك العلاجية اليوم',
      subtitle: 'أرسل لنا تقريرك الطبي وسيقوم كبار الأطباء بدراسة حالتك وتقديم تقييم مجاني وخطة علاجية مخصصة خلال 24 ساعة.',
      whatsappBtn: 'محادثة فورية عبر واتساب',
      formTitle: 'طلب تقييم طبي مجاني وسريع',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف مع رمز الدولة',
      country: 'الدولة ومكان الإقامة',
      specialty: 'التخصص أو العلاج المطلوب',
      caseNotes: 'نبذة عن الحالة الطبية والأعراض',
      submit: 'أرسل طلب الاستشارة الآن',
      successTitle: 'تم استلام طلبك بنجاح!',
      successMessage: 'سيتواصل معك فريق AVICINNA الطبي في أقرب وقت عبر واتساب لدراسة حالتك وترتيب استشارتك المجانية.',
      uploadReport: 'إرفاق تقرير طبي أو صور أشعة (اختياري)',
    },
    patientStories: {
      badge: 'تجارب واقعية',
      title: 'قصص حقيقية، رحلات علاج ناجحة',
      subtitle: 'كل مريض خاض تجربة فريدة، وكان لـ AVICINNA شرف مرافقته خطوة بخطوة حتى عودته سالماً إلى وطنه.',
      readStory: 'اقرأ القصة الكاملة',
      allStoriesCta: 'عرض جميع قصص المرضى',
      duration: 'مدة العلاج',
    },
    blog: {
      badge: 'المرجع الطبي الموثوق',
      title: 'المدونة الطبية',
      subtitle: 'مقالات طبية استشارية، أدلة علاجية شاملة وإجابات علمية دقيقة حول أحدث العلاجات والتكاليف في تركيا.',
      searchPlaceholder: 'ابحث في المقالات والأدلة الطبية...',
      allArticles: 'جميع المقالات',
      readMore: 'اقرأ المقال كاملاً',
      allBlogCta: 'عرض جميع المقالات الطبية',
      minRead: 'دقائق قراءة',
    },
    journey: {
      badge: 'خطوات ميسرة وواضحة',
      title: 'رحلتك العلاجية معنا من البداية إلى الشفاء',
      subtitle: 'نظام منظم ومدروس يضمن لك الراحة والاطمئنان في كل مرحلة من مراحل سفرك وعلاجك.',
      step1: '1. تواصل معنا',
      step2: '2. إرسال الملف الطبي',
      step3: '3. تقييم الحالة مجاناً',
      step4: '4. اختيار الطبيب والمستشفى',
      step5: '5. خطة وتكلفة العلاج',
      step6: '6. ترتيب السفر والإقامة',
      step7: '7. الاستقبال والمرافقة VIP',
      step8: '8. إجراء العلاج والجراحة',
      step9: '9. المتابعة المستمرة بعد العودة',
    },
    footer: {
      tagline: 'منصتكم الدولية الرائدة للرعاية الطبية المتقدمة في تركيا. نرافقكم بأمان وخبرة من الاستشارة الأولى حتى تمام الشفاء.',
      servicesTitle: 'التخصصات الطبية',
      quickLinksTitle: 'روابط سريعة',
      contactTitle: 'التواصل والاستفسار',
      rights: 'جميع الحقوق محفوظة لمنصة AVICINNA الطبية © 2026',
      privacy: 'سياسة الخصوصية وسرية البيانات الطبية',
      terms: 'الشروط والأحكام',
      workingHours: 'خدمة وتنسيق طبي على مدار الساعة 24/7',
      location: 'إسطنبول، الجمهورية التركية',
    },
    common: {
      whatsapp: 'تواصل عبر واتساب',
      callNow: 'اتصل بنا',
      back: 'رجوع',
      explore: 'استكشف',
      freeQuote: 'عرض سعر مجاني',
      learnMore: 'اعرف المزيد',
      adminDashboard: 'لوحة التحكم',
    },
  },
  en: {
    nav: {
      home: 'Home',
      doctors: 'Doctors',
      patientStories: 'Patient Stories',
      blog: 'Medical Blog',
      services: 'Specialties',
      about: 'About AVICINNA',
      contact: 'Contact Us',
      freeConsultation: 'Free Consultation',
    },
    hero: {
      eyebrow: 'Your Trusted International Medical Assistance & Treatment Platform in Turkey',
      headlinePart1: 'Your Health Journey Begins',
      headlineHighlight: 'With World-Class Healthcare in Turkey',
      headlinePart2: 'Connecting you with top accredited professors & JCI hospitals',
      subtitle: 'AVICINNA accompanies you every step of the way—from your free initial doctor consultation to VIP arrival, surgery, and long-term recovery in Istanbul.',
      searchPlaceholder: 'Search specialty, doctor or procedure...',
      primaryCta: 'Get a Free Consultation',
      secondaryCta: 'Explore Specialties',
      trustBadge: 'Accredited by Turkish Ministry of Health & JCI Hospitals',
    },
    stats: {
      patientsCount: '+2500',
      patientsLabel: 'Satisfied Patients',
      hospitalsCount: '+15',
      hospitalsLabel: 'Partner Hospitals',
      specialtiesCount: '+10',
      specialtiesLabel: 'Medical Specialties',
    },
    values: {
      experienceTitle: 'Trusted Expertise',
      experienceDesc: 'Over 10 years of clinical and logistical leadership in international patient facilitation.',
      networkTitle: 'Leading Hospital Network',
      networkDesc: 'Direct partnerships with top university hospitals and JCI-accredited surgical facilities in Istanbul.',
      guidanceTitle: 'End-to-End Support',
      guidanceDesc: 'Dedicated multilingual medical coordinator by your side from airport arrival to your safe return home.',
    },
    about: {
      badge: 'About AVICINNA',
      heading: '10 Years of Excellence in International Patient Care',
      lead: 'AVICINNA was founded to provide patients from all over the world with direct, transparent access to cutting-edge medical treatments in Turkey with complete peace of mind.',
      feature1Title: 'Top Accredited Hospitals',
      feature1Desc: 'We match you with hospitals equipped with robotic surgery, CyberKnife radiation, and advanced organ transplant units.',
      feature2Title: 'Full Journey Assistance',
      feature2Desc: 'Personal medical translator, private VIP transfers, 5-star patient accommodation, and thorough post-op monitoring.',
      cta: 'Learn More About AVICINNA',
    },
    specialties: {
      badge: 'Advanced Medical Departments',
      title: 'Comprehensive Treatments in Key Medical Fields',
      subtitle: 'Specialized healthcare and surgical solutions performed by Turkey’s leading certified professors.',
      cta: 'Discover All Specialties',
      viewDetails: 'View Specialty',
    },
    whyChoose: {
      badge: 'Why Choose AVICINNA?',
      title: 'Comprehensive Services for Your Healing Journey',
      subtitle: 'We eliminate the complexity of traveling abroad for treatment, handling all medical and logistical details.',
      card1Title: 'Free Consultation & Case Study',
      card1Desc: 'Our medical board reviews your medical records, scans, and prepares an honest treatment plan and quote without obligation.',
      card2Title: 'Top-Tier Partner Hospitals',
      card2Desc: 'Direct access to premier health systems like Acibadem Istanbul and Avicenna International Hospitals.',
      card3Title: 'Full Support & Luxury Accommodations',
      card3Desc: 'Stay in selected 5-star partner hotels with private round-the-clock airport and hospital transfers.',
      card4Title: 'Instant 24/7 Communication',
      card4Desc: 'A dedicated coordinator answers all your questions in your preferred language via WhatsApp and phone.',
      whatsappCta: 'Chat on WhatsApp with a Coordinator',
    },
    hospitals: {
      badge: 'Hospitals & Healthcare Partners',
      title: 'Heal & Discover Istanbul',
      subtitle: 'Combining world-renowned medical excellence with hospitality and comfort in Turkey’s vibrant capital of medicine.',
      card1Title: 'Luxury Patient Suites & Accommodation',
      card1Desc: '5-star suites tailored for patient recovery and accompanying family members, located near partner medical facilities.',
      card2Title: 'Acibadem Hospital Istanbul & Partners',
      card2Desc: 'One of the most advanced healthcare networks globally, featuring state-of-the-art oncology, neurosurgery, and cardiovascular units.',
      facilityTitle: 'Patient Lodging Facilities',
      facilityDesc: 'Accessible accommodations with custom healthy meals and medical elevators.',
      transferTitle: '24/7 Organized VIP Transfers',
      transferDesc: 'Private vehicle service between the airport, hotel, and clinic for all appointments.',
      coordinationTitle: 'Medical Translation & Coordination',
      coordinationDesc: 'Certified medical interpreter accompanying you during every consultation.',
    },
    doctors: {
      badge: 'Medical Faculty',
      title: 'Our Specialized Medical Team',
      subtitle: 'Distinguished doctors across 10+ medical disciplines practicing in Turkey’s highest-rated medical centers.',
      filterAll: 'All Specialties',
      viewProfile: 'View Medical Profile',
      requestConsultation: 'Book Doctor Consultation',
      allDoctorsCta: 'View All Doctors & Specialists',
    },
    cta: {
      title: 'Start Your Treatment Journey Today',
      subtitle: 'Send us your medical history and our specialist board will provide a complimentary case assessment and treatment proposal within 24 hours.',
      whatsappBtn: 'Instant WhatsApp Chat',
      formTitle: 'Request a Free Medical Evaluation',
      fullName: 'Full Name',
      phone: 'Phone Number (with country code)',
      country: 'Country of Residence',
      specialty: 'Required Specialty or Treatment',
      caseNotes: 'Brief summary of condition & symptoms',
      submit: 'Submit Consultation Request',
      successTitle: 'Request Received Successfully!',
      successMessage: 'The AVICINNA medical team will reach out via WhatsApp shortly to review your records and arrange your free consultation.',
      uploadReport: 'Attach Medical Report or Scans (Optional)',
    },
    patientStories: {
      badge: 'Real Patient Experiences',
      title: 'True Stories, Successful Healing Journeys',
      subtitle: 'Every patient has a unique story, and AVICINNA is honored to support each one through a successful recovery.',
      readStory: 'Read Full Journey',
      allStoriesCta: 'View All Patient Stories',
      duration: 'Treatment Duration',
    },
    blog: {
      badge: 'Medical Knowledge Center',
      title: 'Medical Blog & Guides',
      subtitle: 'Evidence-based articles, treatment guides, and transparent information regarding healthcare and costs in Turkey.',
      searchPlaceholder: 'Search medical articles and guides...',
      allArticles: 'All Articles',
      readMore: 'Read Full Article',
      allBlogCta: 'View All Medical Articles',
      minRead: 'min read',
    },
    journey: {
      badge: 'Step-by-Step Care',
      title: 'Your Medical Journey With Us from Start to Recovery',
      subtitle: 'A structured, transparent pathway designed for peace of mind at every phase.',
      step1: '1. Contact Us',
      step2: '2. Send Medical Files',
      step3: '3. Free Expert Evaluation',
      step4: '4. Doctor & Hospital Match',
      step5: '5. Transparent Treatment Plan',
      step6: '6. Travel & Stay Arrangements',
      step7: '7. VIP Reception & Assistance',
      step8: '8. Treatment & Surgery',
      step9: '9. Post-Op Follow-Up',
    },
    footer: {
      tagline: 'Your premier international gateway for advanced medical care in Turkey. Guiding your recovery with clinical excellence and compassion.',
      servicesTitle: 'Medical Specialties',
      quickLinksTitle: 'Quick Links',
      contactTitle: 'Get in Touch',
      rights: 'All rights reserved to AVICINNA Healthcare © 2026',
      privacy: 'Privacy & Medical Confidentiality Policy',
      terms: 'Terms & Conditions',
      workingHours: '24/7 International Patient Coordination',
      location: 'Istanbul, Republic of Turkey',
    },
    common: {
      whatsapp: 'Chat on WhatsApp',
      callNow: 'Call Us Now',
      back: 'Back',
      explore: 'Explore',
      freeQuote: 'Free Quote',
      learnMore: 'Learn More',
      adminDashboard: 'Admin Dashboard',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      doctors: 'Médecins',
      patientStories: 'Témoignages',
      blog: 'Blog Médical',
      services: 'Spécialités',
      about: 'À propos',
      contact: 'Contact',
      freeConsultation: 'Consultation Gratuite',
    },
    hero: {
      eyebrow: 'Votre plateforme de référence pour les soins médicaux de pointe en Turquie',
      headlinePart1: 'Votre santé commence par une étape',
      headlineHighlight: 'Vers les meilleurs soins médicaux en Turquie',
      headlinePart2: 'Avec des professeurs d’élite et des hôpitaux certifiés JCI',
      subtitle: 'AVICINNA vous accompagne tout au long de votre parcours de soins, de la première consultation médicale gratuite jusqu’au rétablissement complet à Istanbul.',
      searchPlaceholder: 'Rechercher une spécialité, un médecin ou un soin...',
      primaryCta: 'Obtenir une consultation gratuite',
      secondaryCta: 'Découvrir nos spécialités',
      trustBadge: 'Agréé par le Ministère de la Santé de Turquie et hôpitaux JCI',
    },
    stats: {
      patientsCount: '+2500',
      patientsLabel: 'Patients satisfaits',
      hospitalsCount: '+15',
      hospitalsLabel: 'Hôpitaux partenaires',
      specialtiesCount: '+10',
      specialtiesLabel: 'Spécialités médicales',
    },
    values: {
      experienceTitle: 'Expertise de confiance',
      experienceDesc: 'Plus de 10 ans d’accompagnement clinique et logistique pour les patients internationaux.',
      networkTitle: 'Réseau hospitalier d’élite',
      networkDesc: 'Partenariats stratégiques avec les plus grands centres hospitaliers universitaires et certifiés JCI.',
      guidanceTitle: 'Assistance à chaque étape',
      guidanceDesc: 'Un coordinateur médical dédié à vos côtés dès votre arrivée à l’aéroport jusqu’à votre retour.',
    },
    about: {
      badge: 'À propos d’AVICINNA',
      heading: '10 ans d’excellence dans l’accompagnement du patient international',
      lead: 'AVICINNA a été fondée pour offrir aux patients du monde entier un accès direct, transparent et sécurisé aux traitements médicaux de pointe en Turquie.',
      feature1Title: 'Les meilleurs hôpitaux agréés',
      feature1Desc: 'Nous sélectionnons l’établissement le plus adapté à votre pathologie, doté des technologies de chirurgie robotique et CyberKnife.',
      feature2Title: 'Accompagnement intégral',
      feature2Desc: 'Traducteur médical bilingue, transferts VIP privés, hébergement 5 étoiles et suivi postopératoire rigoureux.',
      cta: 'En savoir plus sur AVICINNA',
    },
    specialties: {
      badge: 'Spécialités de pointe',
      title: 'Options thérapeutiques avancées dans les principaux départements',
      subtitle: 'Traitements et interventions chirurgicales réalisés par d’éminents spécialistes turcs reconnus.',
      cta: 'Découvrir toutes les spécialités',
      viewDetails: 'Détails de la spécialité',
    },
    whyChoose: {
      badge: 'Pourquoi choisir AVICINNA ?',
      title: 'Des services complets pour votre parcours de guérison',
      subtitle: 'Nous éliminons la complexité d’un voyage médical à l’étranger en gérant tous les aspects médicaux et logistiques.',
      card1Title: 'Consultation et étude de dossier gratuites',
      card1Desc: 'Nos spécialistes examinent vos rapports et radiographies pour établir un plan thérapeutique précis sans engagement.',
      card2Title: 'Hôpitaux d’excellence partenaires',
      card2Desc: 'Accès direct aux réseaux prestigieux tels qu’Acibadem Istanbul et les hôpitaux internationaux Avicenna.',
      card3Title: 'Assistance complète et séjour de luxe',
      card3Desc: 'Hébergement dans des hôtels 5 étoiles partenaires avec transferts VIP privés 24h/24.',
      card4Title: 'Communication instantanée 24/7',
      card4Desc: 'Un coordinateur dédié répond à toutes vos questions en français via WhatsApp et téléphone.',
      whatsappCta: 'Échanger sur WhatsApp avec un coordinateur',
    },
    hospitals: {
      badge: 'Partenaires hospitaliers',
      title: 'Soignez-vous et découvrez Istanbul',
      subtitle: 'L’alliance de l’excellence chirurgicale et de l’hospitalité turque pour un séjour médical serein.',
      card1Title: 'Suites et hébergements de prestige',
      card1Desc: 'Hôtels 5 étoiles spécialement équipés pour le confort et le repos du patient et de ses accompagnants.',
      card2Title: 'Hôpital Acibadem Istanbul & Partenaires',
      card2Desc: 'L’un des pôles médicaux les plus avancés au monde en oncologie, neurochirurgie et cardiologie.',
      facilityTitle: 'Infrastructures adaptées',
      facilityDesc: 'Chambres adaptées avec repas équilibrés et accès médicalisés.',
      transferTitle: 'Transferts VIP 24h/24',
      transferDesc: 'Chauffeur privé entre l’aéroport, l’hôtel et l’hôpital pour chaque rendez-vous.',
      coordinationTitle: 'Traduction médicale certifiée',
      coordinationDesc: 'Un interprète médical dédié vous accompagne lors de chaque examen.',
    },
    doctors: {
      badge: 'Corps médical',
      title: 'Notre équipe médicale spécialisée',
      subtitle: 'Des médecins professeurs opérant dans plus de 10 spécialités au sein des meilleurs hôpitaux en Turquie.',
      filterAll: 'Toutes les spécialités',
      viewProfile: 'Consulter le profil',
      requestConsultation: 'Demander une consultation',
      allDoctorsCta: 'Voir tous les médecins spécialistes',
    },
    cta: {
      title: 'Commencez votre parcours de soins dès aujourd’hui',
      subtitle: 'Transmettez-nous votre dossier médical pour recevoir un avis médical et un devis personnalisé sous 24 heures.',
      whatsappBtn: 'Discussion immédiate sur WhatsApp',
      formTitle: 'Demande d’évaluation médicale gratuite',
      fullName: 'Nom et Prénom',
      phone: 'Numéro de téléphone avec indicatif',
      country: 'Pays de résidence',
      specialty: 'Spécialité ou traitement souhaité',
      caseNotes: 'Description de votre état et symptômes',
      submit: 'Envoyer ma demande de consultation',
      successTitle: 'Demande reçue avec succès !',
      successMessage: 'L’équipe médicale d’AVICINNA vous contactera très rapidement sur WhatsApp pour planifier votre consultation gratuite.',
      uploadReport: 'Joindre un compte-rendu médical ou imagerie (Optionnel)',
    },
    patientStories: {
      badge: 'Témoignages authentiques',
      title: 'Histoires vraies, parcours de guérison réussis',
      subtitle: 'Chaque patient vit une expérience unique, et AVICINNA a le privilège de le guider pas à pas jusqu’à sa guérison.',
      readStory: 'Lire le témoignage complet',
      allStoriesCta: 'Voir tous les récits de patients',
      duration: 'Durée du séjour',
    },
    blog: {
      badge: 'Centre d’information médicale',
      title: 'Blog Médical et Conseils',
      subtitle: 'Articles médicaux détaillés, guides pratiques et analyses transparentes sur les traitements et coûts en Turquie.',
      searchPlaceholder: 'Rechercher un article ou guide médical...',
      allArticles: 'Tous les articles',
      readMore: 'Lire la suite',
      allBlogCta: 'Voir tous les articles médicaux',
      minRead: 'min de lecture',
    },
    journey: {
      badge: 'Démarches simplifiées',
      title: 'Votre parcours de soins de A à Z avec nous',
      subtitle: 'Une organisation millimétrée pour votre confort et votre tranquillité d’esprit.',
      step1: '1. Contact initial',
      step2: '2. Envoi du dossier médical',
      step3: '3. Évaluation gratuite par les spécialistes',
      step4: '4. Choix du médecin et de l’hôpital',
      step5: '5. Plan de traitement & devis transparent',
      step6: '6. Organisation du voyage et hébergement',
      step7: '7. Accueil VIP à l’aéroport',
      step8: '8. Intervention et soins hospitaliers',
      step9: '9. Suivi continu après le retour',
    },
    footer: {
      tagline: 'Votre passerelle internationale de référence pour les soins médicaux avancés en Turquie. L’excellence au service de votre santé.',
      servicesTitle: 'Spécialités médicales',
      quickLinksTitle: 'Liens rapides',
      contactTitle: 'Nous contacter',
      rights: 'Tous droits réservés à AVICINNA Healthcare © 2026',
      privacy: 'Politique de confidentialité & secret médical',
      terms: 'Conditions générales',
      workingHours: 'Coordination internationale 24h/24 et 7j/7',
      location: 'Istanbul, République de Turquie',
    },
    common: {
      whatsapp: 'Discuter sur WhatsApp',
      callNow: 'Appelez-nous',
      back: 'Retour',
      explore: 'Explorer',
      freeQuote: 'Devis gratuit',
      learnMore: 'En savoir plus',
      adminDashboard: 'Tableau de bord',
    },
  },
};
