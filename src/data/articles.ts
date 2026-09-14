export interface ArticleCategory {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
}

export const articleCategories: ArticleCategory[] = [
  { id: 'cat-all', slug: 'all', name: { ar: 'جميع المقالات', en: 'All Articles', fr: 'Tous les articles' } },
  { id: 'cat-oncology', slug: 'oncology', name: { ar: 'الأورام والسرطان', en: 'Oncology & Cancer', fr: 'Oncologie & Cancer' } },
  { id: 'cat-cardiology', slug: 'cardiology', name: { ar: 'الأمراض القلبية', en: 'Cardiology', fr: 'Cardiologie' } },
  { id: 'cat-diagnostics', slug: 'diagnostics', name: { ar: 'التشخيص الطبي', en: 'Medical Diagnostics', fr: 'Diagnostic Médical' } },
  { id: 'cat-transplant', slug: 'transplant', name: { ar: 'زراعة الأعضاء', en: 'Organ Transplant', fr: 'Greffe d’Organes' } },
  { id: 'cat-neurosurgery', slug: 'neurosurgery', name: { ar: 'جراحة الأعصاب والعمود الفقري', en: 'Neurosurgery & Spine', fr: 'Neurochirurgie' } },
  { id: 'cat-orthopedics', slug: 'orthopedics', name: { ar: 'العظام والمفاصل', en: 'Orthopedics', fr: 'Orthopédie' } },
  { id: 'cat-dentistry', slug: 'dentistry', name: { ar: 'طب الأسنان', en: 'Dentistry', fr: 'Dentisterie' } },
  { id: 'cat-medical-tourism', slug: 'medical-tourism', name: { ar: 'السياحة العلاجية', en: 'Medical Tourism', fr: 'Tourisme Médical' } },
];

export interface Article {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: {
    ar: string;
    en: string;
    fr: string;
  };
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  excerpt: {
    ar: string;
    en: string;
    fr: string;
  };
  content: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  readingTimeMinutes: number;
  publishedDate: string;
  sourceHospital: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  author: {
    name: { ar: string; en: string; fr: string };
    role: { ar: string; en: string; fr: string };
  };
}

export const articlesData: Article[] = [
  {
    id: 'art-1',
    slug: 'cancer-treatment-turkey-guide-cost',
    categorySlug: 'oncology',
    categoryName: {
      ar: 'الأورام والسرطان',
      en: 'Oncology & Cancer',
      fr: 'Oncologie & Cancer',
    },
    title: {
      ar: 'علاج السرطان في تركيا: دليل المستشفيات والتكلفة وأحدث البروتوكولات',
      en: 'Cancer Treatment in Turkey: Hospital Guide, Costs & Modern Protocols',
      fr: 'Traitement du Cancer en Turquie : Guide des Hôpitaux, Coûts et Protocoles',
    },
    excerpt: {
      ar: 'دليل شامل يوضح أحدث خيارات علاج الأورام في إسطنبول، الفروق في التكلفة مقارنة بأوروبا، وكيفية الحصول على خطة علاجية مخصصة من مجلس الأورام الاستشاري.',
      en: 'A comprehensive guide exploring oncologic treatment options in Istanbul, international cost comparisons, and multidisciplinary tumor board pathways.',
      fr: 'Guide détaillé sur les options thérapeutiques oncologiques à Istanbul, analyse comparative des coûts et accès aux comités pluridisciplinaires.',
    },
    content: {
      ar: [
        'أصبحت تركيا في السنوات الأخيرة إحدى الوجهات العالمية المفضلة لعلاج الأورام وأمراض السرطان، بفضل استثماراتها الهائلة في البنية التحتية الطبية وتوفر أحدث التقنيات مثل المعجلات الخطية وجراحة دافنشي الروبوتية والعلاج بالخلايا التائية CAR-T.',
        'ما يميز مراكز الأورام الشريكة لـ AVICINNA هو نهج "مجلس الأورام متعدد التخصصات" (Tumor Board)، حيث يجتمع نخبة من استشاريي جراحة الأورام، والعلاج الإشعاعي، والعلاج الكيميائي، والتشخيص الجيني لمراجعة ملف المريض معاً ووضع أنسب خطة علاجية.',
        'من حيث التكلفة، توفر المستشفيات التركية المعتمدة عالمياً أسعاراً تقل بنسبة 40% إلى 60% عن المشافي الأوروبية والأمريكية، مع الحفاظ على نفس جودة الأدوية الحيوية والمناعية المعتمدة من الـ FDA والـ EMA.',
        'يقدم فريق AVICINNA دراسة مجانية لتقارير الخزعة والفحوصات، ومرافقة مترجم طبي معتمد طوال فترة الجلسات العلاجية لضمان راحة المريض النفسية والبدنية.'
      ],
      en: [
        'Turkey has emerged as a premier destination for oncology care, driven by state-of-the-art infrastructure including TrueBeam linear accelerators, Da Vinci robotic systems, and targeted CAR-T immunotherapies.',
        'The hallmark of AVICINNA partner cancer centers is the multidisciplinary tumor board, uniting medical oncologists, surgical oncologists, radiation experts, and geneticists to chart individualized pathways.',
        'Financially, internationally accredited Turkish hospitals deliver savings of 40% to 60% compared to Western Europe and the US, while utilizing identical FDA/EMA approved medications.',
        'AVICINNA provides complimentary preliminary evaluation of biopsy and imaging records, along with dedicated multilingual bedside coordination.'
      ],
      fr: [
        'La Turquie s’est imposée comme une référence internationale en oncologie grâce à des équipements de pointe tels que les accélérateurs TrueBeam et la chirurgie robotique Da Vinci.',
        'La prise en charge repose sur une réunion de concertation pluridisciplinaire (RCP) associant oncologues médicaux, chirurgiens, radiothérapeutes et anatomopathologistes.',
        'Les coûts sont de 40% à 60% inférieurs à ceux pratiqués en Europe occidentale, tout en garantissant des molécules certifiées par les autorités de santé internationales.',
        'AVICINNA assure l’analyse préalable gratuite de vos bilans ainsi qu’un accompagnement linguistique continu.'
      ],
    },
    readingTimeMinutes: 6,
    publishedDate: '2026-08-15',
    sourceHospital: {
      ar: 'مستشفى أجيبادم للأورام والمركز المعتمد بتركيا',
      en: 'Acibadem Comprehensive Cancer Center',
      fr: 'Centre Intégré d’Oncologie Acibadem',
    },
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'أ. د. سردار تورهال', en: 'Prof. Dr. Serdar Turhal', fr: 'Prof. Dr. Serdar Turhal' },
      role: { ar: 'استشاري طب الأورام السريري', en: 'Medical Oncology Professor', fr: 'Professeur d’Oncologie Médicale' },
    },
  },
  {
    id: 'art-2',
    slug: 'immunotherapy-cancer-treatment-turkey',
    categorySlug: 'oncology',
    categoryName: {
      ar: 'الأورام والسرطان',
      en: 'Oncology & Cancer',
      fr: 'Oncologie & Cancer',
    },
    title: {
      ar: 'العلاج المناعي في تركيا: تسخير جهازك المناعي لمحاربة السرطان بدقة',
      en: 'Immunotherapy in Turkey: Harnessing Your Immune System to Fight Cancer',
      fr: 'L’Immunothérapie en Turquie : Mobiliser l’Immunité contre le Cancer',
    },
    excerpt: {
      ar: 'كيف أحدث العلاج المناعي ومثبطات نقاط التفتيش (Checkpoint Inhibitors) ثورة طبية في السيطرة على الأورام المتقدمة مع الحفاظ على خلايا الجسم السليمة.',
      en: 'How checkpoint inhibitors and biologic immunotherapy are revolutionizing cancer management with minimal toxic side effects.',
      fr: 'Comment les inhibiteurs de points de contrôle immunitaire transforment la prise en charge des tumeurs avancées.',
    },
    content: {
      ar: [
        'يمثل العلاج المناعي (Immunotherapy) قفزة نوعية في علاج السرطان، فبدلاً من مهاجمة الخلايا الكيميائياً بشكل عشوائي، يعمل العلاج المناعي على "إزالة القناع" عن الخلايا السرطانية ليتعرف عليها الجهاز المناعي الطبيعي ويقوم بتدميرها تلقائياً.',
        'تعتمد المستشفيات الشريكة لـ AVICINNA على فحص الواسمات الحيوية الجينية مثل PD-L1 وMSI وTMB للتأكد بدقة عالية من مدى استجابة المريض للعلاج المناعي قبل بدء الجرعات.',
        'يتميز العلاج المناعي بقلة الآثار الجانبية مقارنة بالعلاج الكيميائي التقليدي، مما يحافظ على حيوية المريض وقدرته على ممارسة حياته الطبيعية.',
        'يتولى أطباؤنا مراجعة التقارير ومطابقتها مع أحدث الأدوية البيولوجية المعتمدة عالمياً لتحديد الجرعات الأنسب لكل مريض.'
      ],
      en: [
        'Immunotherapy represents a fundamental paradigm shift: instead of indiscriminate cytotoxicity, it empowers the patient’s own immune system to unmask and eradicate cancer cells.',
        'AVICINNA partner centers conduct precision biomarker profiling (including PD-L1, MSI, and TMB) to predict therapeutic efficacy before therapy initiation.',
        'Compared to traditional chemotherapy, immunotherapy preserves quality of life with significantly milder adverse effect profiles.',
        'Our oncology faculty reviews individual genetic tumor signatures to tailor targeted regimens.'
      ],
      fr: [
        'L’immunothérapie constitue une révolution majeure : elle réactive les défenses naturelles de l’organisme pour cibler et détruire spécifiquement les cellules malignes.',
        'Les centres partenaires d’AVICINNA effectuent des analyses moléculaires (PD-L1, instabilité microsatellitaire MSI) pour prédire l’efficacité du protocole.',
        'Ce traitement présente une toxicité nettement inférieure à la chimiothérapie classique, préservant l’énergie et l’autonomie du patient.'
      ],
    },
    readingTimeMinutes: 5,
    publishedDate: '2026-08-28',
    sourceHospital: {
      ar: 'مركز أبحاث الأورام والمناعة الحيوية',
      en: 'Biologic Immuno-Oncology Research Institute',
      fr: 'Institut de Recherche en Immuno-Oncologie',
    },
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'د. ليلى جان', en: 'Dr. Leyla Can', fr: 'Dr. Leyla Can' },
      role: { ar: 'أخصائية المناعة السريرية', en: 'Clinical Immunologist', fr: 'Immunologue Clinique' },
    },
  },
  {
    id: 'art-3',
    slug: 'cyberknife-robotic-radiosurgery-guide',
    categorySlug: 'neurosurgery',
    categoryName: {
      ar: 'جراحة الأعصاب والعمود الفقري',
      en: 'Neurosurgery & Spine',
      fr: 'Neurochirurgie',
    },
    title: {
      ar: 'جراحة سايبر نايف الإشعاعية وعلاج الأورام: الدقة بدون شق جراحي',
      en: 'CyberKnife Robotic Radiosurgery: Surgical Precision Without Incision',
      fr: 'Radiochirurgie Robotisée CyberKnife : Précision Sans Incision',
    },
    excerpt: {
      ar: 'تعرف على تقنية CyberKnife الروبوتية المتقدمة التي تعالج أورام الدماغ والرئة والعمود الفقري بجرعات إشعاعية متناهية الدقة ودون الحاجة إلى تخدير أو إقامة في المستشفى.',
      en: 'Discover how CyberKnife robotic radiosurgery destroys tumors in the brain, spine, and lungs without open surgery or hospital stays.',
      fr: 'Découvrez comment le CyberKnife robotisé traite les tumeurs cérébrales et rachidiennes sans anesthésie ni hospitalisation.',
    },
    content: {
      ar: [
        'تعد تقنية سايبر نايف (CyberKnife) أول نظام روبوتي مخصص للجراحة الإشعاعية التجسيمية في العالم. يتيح الذراع الروبوتي المتحرك توجيه مئات الحزم الإشعاعية من زوايا متعددة إلى الورم بدقة تقل عن ملليمتر واحد.',
        'تكمن الميزة الكبرى لسايبر نايف في نظام التتبع الفوري للحركة؛ حيث يستشعر حركة تنفس المريض ويقوم بتعديل زاوية الإشعاع تلقائياً، مما يحمي الأنسجة والأعصاب المحيطة تماماً.',
        'تتم الجلسة في العيادات الخارجية وتستغرق بين 30 إلى 90 دقيقة، ويعود المريض إلى فندقه في نفس اليوم لممارسة نشاطه المعتاد.',
        'تستخدم هذه التقنية بنجاح فائق لأورام الدماغ، والأورام الشفانية السمعية، وأورام الغدة النخامية، ونقائل الرئة والعمود الفقري.'
      ],
      en: [
        'CyberKnife is the world’s first and only robotic radiosurgery system designed for sub-millimeter precision tumor ablation anywhere in the body.',
        'Its cutting-edge real-time tracking camera compensates automatically for patient respiratory motions, sparing neighboring healthy neurological structures.',
        'Sessions are entirely painless, performed on an outpatient basis in 30 to 90 minutes with zero hospital stay required.',
        'Common indications include acoustic neuromas, pituitary adenomas, spinal metastases, and localized pulmonary lesions.'
      ],
      fr: [
        'Le CyberKnife est le premier système de radiochirurgie robotisée guidé par imagerie en temps réel au monde.',
        'Son bras articulé compense les mouvements respiratoires du patient, épargnant les tissus sains adjacents.',
        'L’intervention est ambulatoire, indolore, et le patient regagne son hôtel immédiatement après la séance.'
      ],
    },
    readingTimeMinutes: 5,
    publishedDate: '2026-09-02',
    sourceHospital: {
      ar: 'مستشفى أجيبادم - مركز جراحة الأعصاب الإشعاعية',
      en: 'Acibadem Radiosurgery & Spine Center',
      fr: 'Centre de Radiochirurgie Acibadem',
    },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'أ. د. محمد زكي غوكشيل', en: 'Prof. Dr. Mehmet Zeki Gokcil', fr: 'Prof. Dr. Mehmet Zeki Gokcil' },
      role: { ar: 'استشاري جراحة المخ والأعصاب', en: 'Professor of Neurosurgery', fr: 'Professeur de Neurochirurgie' },
    },
  },
  {
    id: 'art-4',
    slug: 'coronary-artery-bypass-surgery-types-success',
    categorySlug: 'cardiology',
    categoryName: {
      ar: 'الأمراض القلبية',
      en: 'Cardiology',
      fr: 'Cardiologie',
    },
    title: {
      ar: 'جراحة شرايين القلب (المجازة التاجية): الأنواع ونسب النجاح والتعافي',
      en: 'Coronary Artery Bypass Surgery (CABG): Types, Success Rates & Recovery',
      fr: 'Pontage Coronarien (CABG) : Techniques, Taux de Réussite et Convalescence',
    },
    excerpt: {
      ar: 'كل ما تحتاج معرفته عن عملية مجازة الشريان التاجي، الفرق بين تقنية القلب النابض والجراحة المفتوحة، وبرامج التأهيل السريع في المشافي التركية.',
      en: 'Everything you need to know regarding off-pump beating heart bypass vs traditional CABG and rapid post-op rehabilitation in Turkey.',
      fr: 'Tout ce que vous devez savoir sur le pontage à cœur battant et les programmes de récupération accélérée en Turquie.',
    },
    content: {
      ar: [
        'تعد عملية المجازة التاجية (CABG) من أهم العمليات المنقذة للحياة للمرضى الذين يعانون من تضيق شديد في الشرايين التاجية المغذية لعضلة القلب.',
        'يطبق جراحو القلب في تركيا تقنية "القلب النابض" (Off-Pump CABG) التي تجرى دون إيقاف القلب أو استخدام ماكينة القلب والرئة الصناعية، مما يقلل بشكل ملحوظ من مخاطر الجلطات الدماغية ويسرع فترة الاستشفاء.',
        'تتجاوز نسبة نجاح عمليات الشرايين التاجية في المراكز التخصصية بتركيا 98.5%، بفضل غرف العناية المركزة المزودة بأحدث أجهزة مراقبة المؤشرات الحيوية.',
        'تتضمن خطة AVICINNA إشرافاً طبياً دقيقاً، وبرنامج تغذية علاجية، وتمارين تنفسية متخصصة تضمن للمريض عودة آمنة إلى وطنه.'
      ],
      en: [
        'Coronary Artery Bypass Grafting (CABG) remains the gold standard in restoring myocardial perfusion for multi-vessel coronary artery disease.',
        'Turkish surgeons frequently employ off-pump (beating heart) techniques, mitigating complications associated with cardiopulmonary bypass machines.',
        'Clinical success rates across accredited Istanbul hospitals surpass 98.5%, supported by dedicated cardiac intensive care units.',
        'AVICINNA coordinates structured respiratory and cardiovascular rehabilitation prior to international travel clearance.'
      ],
      fr: [
        'Le pontage coronarien reste l’intervention de référence pour rétablir une vascularisation optimale du muscle cardiaque.',
        'Les équipes chirurgicales privilégient le pontage à cœur battant (off-pump), réduisant considérablement la durée de réanimation.',
        'Le taux de réussite dépasse 98,5% au sein des centres spécialisés à Istanbul.'
      ],
    },
    readingTimeMinutes: 7,
    publishedDate: '2026-09-08',
    sourceHospital: {
      ar: 'مستشفى أفيسينا والمركز الجامعي للقلب',
      en: 'Avicenna University Heart Center',
      fr: 'Centre Universitaire de Cardiologie Avicenna',
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'أ. د. أحمد أوزكارا', en: 'Prof. Dr. Ahmet Ozkara', fr: 'Prof. Dr. Ahmet Ozkara' },
      role: { ar: 'استشاري جراحة القلب والأوعية', en: 'Cardiovascular Surgery Chair', fr: 'Chirurgien Cardiovasculaire' },
    },
  },
  {
    id: 'art-5',
    slug: 'hair-transplant-sapphire-vs-dhi-comparison',
    categorySlug: 'medical-tourism',
    categoryName: {
      ar: 'السياحة العلاجية',
      en: 'Medical Tourism',
      fr: 'Tourisme Médical',
    },
    title: {
      ar: 'زراعة الشعر بالسفير FUE مقابل أقلام DHI: مقارنة شاملة لاختيار الأنسب',
      en: 'Sapphire FUE vs DHI Choi Implantation: A Comprehensive Comparison',
      fr: 'Greffe Sapphire FUE vs Stylos DHI : Comparatif Complet',
    },
    excerpt: {
      ar: 'مقارنة طبية دقيقة بين تقنيتي السفير وأقلام تشوي DHI من حيث كثافة الزراعة، مدة التعافي، التكلفة، والحالات الأنسب لكل منهما.',
      en: 'A medical comparison between Sapphire blade micro-incisions and DHI Choi implanters covering graft density, healing speed, and suitability.',
      fr: 'Comparatif clinique entre les lames de saphir et les stylos Choi DHI pour choisir la méthode adaptée à votre calvitie.',
    },
    content: {
      ar: [
        'تشهد تقنيات زراعة الشعر في إسطنبول تطوراً مستمراً، وتعتبر تقنيتا الياقوت السفير (Sapphire FUE) وأقلام تشوي (DHI) الأكثر طلباً وتفوقاً على المستوى العالمي.',
        'تقنية السفير تعتمد على استخدام شفرات مصنعة من حجر الياقوت الطبيعي فائق الدقة، مما يتيح فتح آلاف القنوات الدقيقة جداً بزوايا مطابقة لاتجاه الشعر الأصلي مع التئام سريع للبشرة دون ترك أي أثر ندبي.',
        'أما تقنية DHI فتتميز بإمكانية زراعة البصيلة وفتح القناة في خطوة واحدة متزامنة باستخدام قلم تشوي، وهي مثالية لتكثيف الشعر دون الحاجة إلى حلاقة كاملة للرأس، خاصة للنساء ولمناطق اللحية والشارب.',
        'في مراكز AVICINNA، يتم فحص فروة الرأس بمجهر ثلاثي الأبعاد لتحديد التقنية الأنسب التي تحقق أعلى كثافة ممكنة ومظهراً طبيعياً يدوم مدى الحياة.'
      ],
      en: [
        'Hair restoration techniques in Istanbul have reached unprecedented refinement, led by Sapphire FUE and Direct Hair Implantation (DHI).',
        'Sapphire blades allow surgeons to craft ultra-dense micro-incisions with microscopic margins, resulting in accelerated healing and zero keloid formation.',
        'DHI Choi pens simultaneously create recipient sites and insert grafts, making it the technique of choice for unshaven procedures and eyebrow/beard enhancements.',
        'AVICINNA dermatological consultants perform 3D trichoscopic analysis to determine the optimal method for each individual patient.'
      ],
      fr: [
        'Les techniques de greffe capillaire à Istanbul atteignent une précision inégalée grâce au Sapphire FUE et au DHI.',
        'La lame de saphir offre une cicatrisation ultra-rapide et un tracé frontal naturel.',
        'Les stylos DHI permettent d’implanter directement sans rasage préalable, particulièrement adapté aux femmes et à la densification de la barbe.'
      ],
    },
    readingTimeMinutes: 5,
    publishedDate: '2026-09-10',
    sourceHospital: {
      ar: 'مركز أفيسينا لزراعة الشعر والترميم الجلدي',
      en: 'Avicenna Aesthetic & Hair Center',
      fr: 'Centre Esthétique et Capillaire Avicenna',
    },
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'د. إيمري تشيتشيك', en: 'Dr. Emre Cicek', fr: 'Dr. Emre Cicek' },
      role: { ar: 'استشاري زراعة وترميم الشعر', en: 'Hair Restoration Specialist', fr: 'Spécialiste de la Greffe Capillaire' },
    },
  },
  {
    id: 'art-6',
    slug: 'hollywood-smile-istanbul-steps-cost-benefits',
    categorySlug: 'dentistry',
    categoryName: {
      ar: 'طب الأسنان',
      en: 'Dentistry',
      fr: 'Dentisterie',
    },
    title: {
      ar: 'ابتسامة هوليوود في إسطنبول: خطوات العلاج، المواد والأسعار والضمان',
      en: 'Hollywood Smile in Istanbul: Procedures, Materials, Costs & Warranties',
      fr: 'Hollywood Smile à Istanbul : Étapes, Matériaux, Tarifs et Garanties',
    },
    excerpt: {
      ar: 'كيف تحصل على ابتسامة أحلامك باستخدام عدسات الإيماكس والزيركون الألمانية خلال 5 أيام فقط في إسطنبول مع توفير يصل إلى 70%.',
      en: 'How to achieve your dream smile with German E-Max and Zirconia veneers in just 5 days in Istanbul while saving up to 70%.',
      fr: 'Obtenez un sourire éclatant avec les facettes E-Max en 5 jours à Istanbul avec des garanties internationales.',
    },
    content: {
      ar: [
        'تعد إسطنبول الوجهة الأولى عالمياً لتجميل الأسنان وابتسامة هوليوود، بفضل توفر أحدث مختبرات الـ CAD/CAM الرقمية التي تصنع قشور البورسلين والزيركون بدقة ميكرونية.',
        'تبدأ الرحلة بجلسة تصوير رقمية ثلاثية الأبعاد (Digital Smile Design)، حيث يرى المريض صورة تقريبية لابتسامته المستقبلية على الكمبيوتر ويختار درجة البياض والشكل الذي يفضله.',
        'تستخدم عياداتنا المعتمدة عدسات الإيماكس (Ivoclar Vivadent E-Max) السويسرية الأصلية وتيجان الزيركون فائقة الشفافية، المقاومة للتصبغات والتآكل مع شهادة ضمان رسمي موثقة.',
        'تشمل باقة AVICINNA العلاج المتكامل، الإقامة الفندقية، والتنقلات بسيارات خاصة، لتجعل من رحلة علاج أسنانك عطلة سياحية ممتعة ومريحة.'
      ],
      en: [
        'Istanbul has become the premier global destination for cosmetic dentistry, supported by in-house CAD/CAM robotics that mill porcelain and zirconia crowns with micron accuracy.',
        'The journey begins with Digital Smile Design (DSD), empowering patients to preview their custom smile aesthetics and approve shade and contour prior to fitting.',
        'We exclusively utilize authentic Swiss Ivoclar Vivadent E-Max veneers and ultra-translucent zirconia crowns with official manufacturer warranties.',
        'AVICINNA packages bundle full treatment, 5-star hotel lodging, and private VIP chauffeurs for a seamless dental vacation.'
      ],
      fr: [
        'Istanbul est devenue la destination de prédilection pour le Hollywood Smile grâce aux technologies CAD/CAM haute précision.',
        'Grâce au Digital Smile Design, vous visualisez votre futur sourire en 3D dès le premier rendez-vous.',
        'Nos cliniques emploient exclusivement les facettes E-Max suisses d’Ivoclar et les couronnes en zircone haute translucidité.'
      ],
    },
    readingTimeMinutes: 4,
    publishedDate: '2026-09-12',
    sourceHospital: {
      ar: 'مركز أفيسينا لطب وجراحة الأسنان الرقمية',
      en: 'Avicenna Digital Dental Hospital',
      fr: 'Centre Dentaire Numérique Avicenna',
    },
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: 'د. سيدا أرسلان', en: 'Dr. Dt. Seda Arslan', fr: 'Dr. Dt. Seda Arslan' },
      role: { ar: 'استشارية تجميل الأسنان الرقمي', en: 'Cosmetic Prosthodontist', fr: 'Chirurgien-Dentiste Esthétique' },
    },
  },
];
