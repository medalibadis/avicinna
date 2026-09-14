export interface PatientStory {
  id: string;
  slug: string;
  patientName: string;
  country: {
    ar: string;
    en: string;
    fr: string;
  };
  treatment: {
    ar: string;
    en: string;
    fr: string;
  };
  treatmentSlug: string;
  duration: {
    ar: string;
    en: string;
    fr: string;
  };
  doctorName: {
    ar: string;
    en: string;
    fr: string;
  };
  hospital: {
    ar: string;
    en: string;
    fr: string;
  };
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  shortStory: {
    ar: string;
    en: string;
    fr: string;
  };
  fullExperience: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  timeline: {
    step: { ar: string; en: string; fr: string };
    detail: { ar: string; en: string; fr: string };
  }[];
  image: string;
  hasVideo: boolean;
  videoDuration?: string;
  rating: number;
}

export const patientStoriesData: PatientStory[] = [
  {
    id: 'story-1',
    slug: 'omar-cardiac-valve-recovery',
    patientName: 'عمر التميمي',
    country: {
      ar: 'المملكة العربية السعودية (الرياض)',
      en: 'Saudi Arabia (Riyadh)',
      fr: 'Arabie Saoudite (Riyad)',
    },
    treatment: {
      ar: 'ترميم الصمام التاجي بالمنظار',
      en: 'Minimally Invasive Mitral Valve Repair',
      fr: 'Réparation Valvulaire Mitrale Mini-Invasive',
    },
    treatmentSlug: 'cardiac-surgery',
    duration: {
      ar: '10 أيام في إسطنبول',
      en: '10 Days in Istanbul',
      fr: '10 Jours à Istanbul',
    },
    doctorName: {
      ar: 'أ. د. أحمد أوزكارا',
      en: 'Prof. Dr. Ahmet Ozkara',
      fr: 'Prof. Dr. Ahmet Ozkara',
    },
    hospital: {
      ar: 'مستشفى أجيبادم إسطنبول',
      en: 'Acibadem Hospital Istanbul',
      fr: 'Hôpital Acibadem Istanbul',
    },
    title: {
      ar: 'رحلة عمر من ضيق التنفس الشديد إلى الشفاء التام بعد جراحة الصمام بالمنظار',
      en: 'Omar’s Journey from Severe Dyspnea to Full Recovery via Valve Repair',
      fr: 'Le parcours d’Omar : de la gêne respiratoire sévère à la guérison complète',
    },
    shortStory: {
      ar: 'كنت أعاني من تعب وإرهاق متواصل عند المشي. تواصلت مع AVICINNA وحصلت على استشارة مجانية مع البروفيسور أحمد أوزكارا خلال 24 ساعة، وتم ترتيب كل خطوة من الاستقبال الفندقي حتى الجراحة.',
      en: 'After suffering from chronic shortness of breath, I contacted AVICINNA. Within 24 hours I had a direct consultation with Prof. Ozkara, and my entire surgical journey in Istanbul was seamlessly coordinated.',
      fr: 'Souffrant d’essoufflement sévère, j’ai contacté AVICINNA. En 24h, j’ai bénéficié d’un avis du Prof. Ozkara et toute mon intervention à Istanbul a été orchestrée avec une fluidité remarquable.',
    },
    fullExperience: {
      ar: [
        'بدأت قصتي عندما أخبرني أطباء محليون بضرورة إجراء جراحة قلب مفتوح كاملة لترميم الصمام الميترالي، وهو ما أصابني بالقلق الشديد.',
        'قمت بالتواصل مع منسق AVICINNA وأرسلت تقارير القسطرة والإيكو. قام البروفيسور د. أحمد أوزكارا بمراجعة الملف وأكد إمكانية إجراء العملية عبر شق جانبي صغير بالمنظار دون شق عظم الصدر.',
        'استقبلني فريق AVICINNA في مطار إسطنبول الجديد بسيارة VIP خاصة ونقلوني مباشرة إلى الفندق. وفي اليوم التالي أجريت الفحوصات وتكللت العملية بنجاح باهر.',
        'خرجت من المستشفى بعد 4 أيام فقط وبدأت بالمشي الخفيف في ساحة السلطان أحمد رفقة المترجم الطبي، واليوم أمارس عملي وصحتي في أفضل حالاتها بفضل الله وفريق أفيسينا.'
      ],
      en: [
        'Local specialists recommended traditional open-heart sternotomy, causing me great concern.',
        'I submitted my echocardiograms to AVICINNA. Prof. Dr. Ahmet Ozkara confirmed that a minimally invasive keyhole approach was fully feasible.',
        'Upon landing in Istanbul, AVICINNA provided VIP airport reception and transferred me directly to my hotel. Surgery was performed seamlessly the following morning.',
        'I was discharged after only 4 days and enjoyed gentle walks in Istanbul before my flight home. Today, my cardiac endurance is completely restored.'
      ],
      fr: [
        'Face à une recommandation de chirurgie ouverte classique à cœur ouvert, j’ai contacté AVICINNA pour un second avis.',
        'Le Prof. Dr. Ahmet Ozkara a confirmé la faisabilité d’une réparation par mini-incision latérale évitant d’ouvrir le sternum.',
        'L’accueil VIP à l’aéroport et le transfert à l’hôtel m’ont immédiatement rassuré. L’intervention a été une réussite totale.',
        'Sorti de l’hôpital après 4 jours, j’ai pu me promener sereinement à Istanbul avant mon vol retour.'
      ],
    },
    timeline: [
      { step: { ar: 'اليوم 1', en: 'Day 1', fr: 'Jour 1' }, detail: { ar: 'الاستقبال في المطار والتسكين بالفندق', en: 'Airport VIP reception and hotel check-in', fr: 'Accueil VIP et installation à l’hôtel' } },
      { step: { ar: 'اليوم 2', en: 'Day 2', fr: 'Jour 2' }, detail: { ar: 'الفحوصات الشاملة ولقاء البروفيسور', en: 'Pre-op diagnostics and consultation with Prof. Ozkara', fr: 'Bilan complet et rencontre avec le chirurgien' } },
      { step: { ar: 'اليوم 3', en: 'Day 3', fr: 'Jour 3' }, detail: { ar: 'إجراء الجراحة بالمنظار بنجاح', en: 'Successful minimally invasive valve repair', fr: 'Intervention mini-invasive réussie' } },
      { step: { ar: 'اليوم 7', en: 'Day 7', fr: 'Jour 7' }, detail: { ar: 'الخروج من المستشفى والمتابعة بالفندق', en: 'Discharge to hotel and follow-up consultation', fr: 'Sortie de l’hôpital et suivi en hôtel' } },
      { step: { ar: 'اليوم 10', en: 'Day 10', fr: 'Jour 10' }, detail: { ar: 'فحص المغادرة النهائي والعودة للوطن', en: 'Final clearance check and return flight', fr: 'Bilan de départ et retour au pays' } },
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    hasVideo: true,
    videoDuration: '3:45',
    rating: 5,
  },
  {
    id: 'story-2',
    slug: 'sarah-robotic-spine-success',
    patientName: 'سارة لوموان',
    country: {
      ar: 'فرنسا (باريس)',
      en: 'France (Paris)',
      fr: 'France (Paris)',
    },
    treatment: {
      ar: 'جراحة انزلاق الفقرات المجهرية',
      en: 'Microscopic Spinal Herniation Decompression',
      fr: 'Microchirurgie de Hernie Discale Lombaire',
    },
    treatmentSlug: 'neurosurgery',
    duration: {
      ar: '7 أيام في إسطنبول',
      en: '7 Days in Istanbul',
      fr: '7 Jours à Istanbul',
    },
    doctorName: {
      ar: 'أ. د. محمد زكي غوكشيل',
      en: 'Prof. Dr. Mehmet Zeki Gokcil',
      fr: 'Prof. Dr. Mehmet Zeki Gokcil',
    },
    hospital: {
      ar: 'مستشفى أفيسينا التخصصي',
      en: 'Avicenna Specialist Hospital',
      fr: 'Hôpital Spécialisé Avicenna',
    },
    title: {
      ar: 'كيف تخلصت سارة من آلام عرق النسا والظهر المزمنة خلال 48 ساعة فقط',
      en: 'How Sarah Overcame Chronic Sciatica & Back Pain in 48 Hours',
      fr: 'Comment Sarah s’est libérée de sa sciatique chronique en 48 heures',
    },
    shortStory: {
      ar: 'عانيت لأكثر من سنتين من آلام مبرحة في أسفل الظهر منعني من الجلوس والعمل. بفضل الجراحة المجهرية الدقيقة مع الدكتور غوكشيل، استعدت حركتي بدون ألم في اليوم التالي مباشرة.',
      en: 'I had been bedridden by excruciating lumbar nerve compression for over two years. Thanks to Prof. Gokcil’s microscopic surgery, I was walking pain-free the very next morning.',
      fr: 'Après deux ans de douleurs sciatiques invalidantes, la microdiscectomie du Prof. Gokcil m’a permis de remarcher dès le lendemain sans aucune douleur.',
    },
    fullExperience: {
      ar: [
        'كانت قائمة الانتظار للعمليات الجراحية في فرنسا تتجاوز تسعة أشهر، في حين كانت الآلام تتفاقم يومياً.',
        'تواصلت مع فريق AVICINNA باللغة الفرنسية، وخلال أقل من 48 ساعة تلقيت تقريراً كاملاً ومترجماً عن صور الرنين المغناطيسي مع موعد مؤكد للعملية.',
        'المستوى الطبي في المستشفى فاق توقعاتي، حيث استغرقت الجراحة أقل من 50 دقيقة عبر شق متناهي الصغر لم يتطلب أي غرز خارجية ظاهرة.',
        'أشكر المنسقة الطبية ليلى التي رافقتني في كل لحظة، إنها تجربة غيرت جودة حياتي بالكامل.'
      ],
      en: [
        'Faced with a 9-month surgical waitlist in Europe, my mobility was rapidly deteriorating.',
        'AVICINNA’s French-speaking coordination team answered all my questions within hours and scheduled my surgery with Prof. Gokcil without delay.',
        'The surgical procedure took under 50 minutes with microscopic precision. By afternoon, the nerve pain that tortured me for 2 years had vanished.',
        'The warmth and continuous care of the AVICINNA team made me feel safe and respected throughout.'
      ],
      fr: [
        'Face aux délais d’attente de plusieurs mois, la douleur devenait insupportable au quotidien.',
        'L’équipe francophone d’AVICINNA m’a guidée avec bienveillance et clarté, organisant mon rendez-vous chirurgical sans délai.',
        'L’intervention par microchirurgie a duré moins d’une heure. Dès mon réveil, la douleur radiculaire avait totalement disparu.',
        'Un immense merci à toute l’équipe d’AVICINNA pour leur professionnalisme exceptionnel.'
      ],
    },
    timeline: [
      { step: { ar: 'اليوم 1', en: 'Day 1', fr: 'Jour 1' }, detail: { ar: 'الوصول لإسطنبول والفحص السريري المباشر', en: 'Arrival and neurosurgical clinical evaluation', fr: 'Arrivée à Istanbul et consultation clinique' } },
      { step: { ar: 'اليوم 2', en: 'Day 2', fr: 'Jour 2' }, detail: { ar: 'الجراحة المجهرية والمشي في المساء', en: 'Microscopic surgery and assisted evening walking', fr: 'Intervention microchirurgicale et premier lever' } },
      { step: { ar: 'اليوم 4', en: 'Day 4', fr: 'Jour 4' }, detail: { ar: 'جلسة العلاج الطبيعي التأهيلي', en: 'Physical therapy and mobility exercises', fr: 'Séance de rééducation postopératoire' } },
      { step: { ar: 'اليوم 7', en: 'Day 7', fr: 'Jour 7' }, detail: { ar: 'الموافقة الطبية للسفر والعودة لباريس', en: 'Travel fitness clearance and departure', fr: 'Certificat d’aptitude au vol et retour' } },
    ],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    hasVideo: false,
    rating: 5,
  },
  {
    id: 'story-3',
    slug: 'khalid-robotic-knee-arthroplasty',
    patientName: 'خالد الكندري',
    country: {
      ar: 'دولة الكويت (الكويت)',
      en: 'Kuwait (Kuwait City)',
      fr: 'Koweït (Koweït City)',
    },
    treatment: {
      ar: 'تبديل مفصل الركبة بالروبوت MAKO',
      en: 'Robotic MAKO Knee Arthroplasty',
      fr: 'Prothèse Robotisée du Genou MAKO',
    },
    treatmentSlug: 'orthopedics',
    duration: {
      ar: '8 أيام في إسطنبول',
      en: '8 Days in Istanbul',
      fr: '8 Jours à Istanbul',
    },
    doctorName: {
      ar: 'د. ألبير كايا',
      en: 'Assoc. Prof. Dr. Alper Kaya',
      fr: 'Dr. Alper Kaya',
    },
    hospital: {
      ar: 'مستشفى ميموريال ومجموعة أفيسينا',
      en: 'Memorial & Avicenna Hospitals',
      fr: 'Hôpitaux Memorial & Avicenna',
    },
    title: {
      ar: 'عودة خالد للمشي بحرية والصلاة دون ألم بعد تبديل مفصل الركبة بالذراع الروبوتي',
      en: 'Khalid Walking Freely and Praying Without Pain After Robotic Knee Surgery',
      fr: 'Khalid retrouve la mobilité et la marche sans douleur grâce au robot MAKO',
    },
    shortStory: {
      ar: 'كنت عاجزاً عن صعود السلم أو ثني الركبة بسبب احتكاك العظم الشديد. نصحني صديق بمنصة AVICINNA، وتمت العملية بواسطة الروبوت الجراحي الدقيق، واليوم أتحرك بكل سهولة.',
      en: 'Bone-on-bone osteoarthritis left me unable to climb stairs or kneel. A friend recommended AVICINNA; with robotic precision, my knee function was completely restored.',
      fr: 'L’arthrose avancée m’empêchait de monter les escaliers. Recommandé par un ami, j’ai bénéficié de la chirurgie robotique MAKO avec un résultat spectaculaire.',
    },
    fullExperience: {
      ar: [
        'جربت حقن الكورتيزون والبلازما في عدة دول دون جدوى، وكان خياري الوحيد هو استبدال المفصل.',
        'ما لفت انتباهي في AVICINNA هو الشفافية التامة؛ قدموا لي عرض سعر مفصل شامل المستشفى والإقامة الفندقية والمواصلات دون أي رسوم مخفية.',
        'الدكتور ألبير كايا شرح لي كيف يحدد الذراع الروبوتي قياس المفصل بدقة أعشار الملليمتر، وهذا ما جعل التعافي سريعاً ومريحاً للغاية.',
        'في اليوم الخامس كنت أمشي في بهو الفندق دون أي عكاز، وأنصح كل من يعاني بعدم التردد في التواصل معهم.'
      ],
      en: [
        'After years of temporary injections, joint replacement was the only definitive solution.',
        'What impressed me most about AVICINNA was the utter transparency—a fixed all-inclusive package with zero hidden costs.',
        'Dr. Alper Kaya mapped my knee anatomy in 3D using the robotic system, which protected my collateral ligaments and accelerated my healing.',
        'By day 5 I was strolling through my hotel lounge unassisted. I cannot praise AVICINNA enough.'
      ],
      fr: [
        'Après des années d’infiltrations sans résultat durable, le remplacement articulaire était inévitable.',
        'La transparence d’AVICINNA avec un forfait tout compris sans surprise financière m’a convaincu.',
        'Le Dr Alper Kaya m’a expliqué le guidage robotique 3D garantissant une précision inégalée.',
        'Au 5e jour, je marchais déjà sans canne dans l’hôtel.'
      ],
    },
    timeline: [
      { step: { ar: 'اليوم 1', en: 'Day 1', fr: 'Jour 1' }, detail: { ar: 'الوصول والتصوير المقطعي ثلاثي الأبعاد للركبة', en: 'Arrival and 3D CT scan mapping for robotic planning', fr: 'Arrivée et scanner 3D pour planification robotisée' } },
      { step: { ar: 'اليوم 2', en: 'Day 2', fr: 'Jour 2' }, detail: { ar: 'إجراء العملية بالروبوت MAKO بنجاح', en: 'MAKO robotic knee arthroplasty performed', fr: 'Pose de prothèse robotisée MAKO réussie' } },
      { step: { ar: 'اليوم 3-4', en: 'Day 3-4', fr: 'Jour 3-4' }, detail: { ar: 'جلسات التأهيل الحركي بالمستشفى', en: 'In-hospital physical therapy and movement training', fr: 'Séances de kinésithérapie et rééducation' } },
      { step: { ar: 'اليوم 8', en: 'Day 8', fr: 'Jour 8' }, detail: { ar: 'مراجعة ختامية والمغادرة بسلامة', en: 'Final surgical check and flight back home', fr: 'Contrôle final et retour au Koweït' } },
    ],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    hasVideo: true,
    videoDuration: '4:12',
    rating: 5,
  },
];
