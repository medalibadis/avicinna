export interface Treatment {
  id: string;
  slug: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  shortDescription: {
    ar: string;
    en: string;
    fr: string;
  };
  fullOverview: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  iconName: string;
  featured: boolean;
  conditionsTreated: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  procedures: {
    ar: { name: string; desc: string }[];
    en: { name: string; desc: string }[];
    fr: { name: string; desc: string }[];
  };
  whyTurkey: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  faqs: {
    question: { ar: string; en: string; fr: string };
    answer: { ar: string; en: string; fr: string };
  }[];
  doctorIds: string[];
}

export const treatmentsData: Treatment[] = [
  {
    id: 'treat-1',
    slug: 'cardiac-surgery',
    title: {
      ar: 'جراحة القلب والأوعية الدموية',
      en: 'Cardiovascular Surgery',
      fr: 'Chirurgie Cardiaque & Vasculaire',
    },
    shortDescription: {
      ar: 'جراحات الشرايين التاجية، ترميم واستبدال الصمامات بالمنظار وقسطرة القلب بدقة فائقة ونسب نجاح عالمية.',
      en: 'Coronary artery bypass, minimally invasive valve replacement, and advanced catheterization with global success rates.',
      fr: 'Pontage coronarien, chirurgie valvulaire mini-invasive et cardiologie interventionnelle de pointe.',
    },
    fullOverview: {
      ar: 'تتميز تركيا بوجود أحدث مراكز جراحة القلب في العالم، المزودة بتقنيات الجراحة الهجينة (Hybrid OR) التي تتيح إجراء العمليات الجراحية المعقدة وتبديل الصمامات بأقل قدر من التدخل الجراحي وسرعة تعافي استثنائية.',
      en: 'Turkey houses some of the most advanced cardiac centers worldwide, equipped with Hybrid Operating Theaters enabling complex revascularization and valve replacements with minimal surgical invasion.',
      fr: 'La Turquie compte parmi les centres de chirurgie cardiaque les plus avancés au monde, équipés de salles d’opération hybrides permettant des interventions complexes avec une récupération rapide.',
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
    iconName: 'HeartPulse',
    featured: true,
    conditionsTreated: {
      ar: ['انسداد وتصلب الشرايين التاجية', 'تضيق أو ارتجاع صمامات القلب', 'تمدد الشريان الأورطي الصدري والبطني', 'اضطرابات النظم القلبي والرجفان'],
      en: ['Coronary Artery Disease', 'Heart Valve Stenosis & Regurgitation', 'Thoracic & Abdominal Aortic Aneurysms', 'Cardiac Arrhythmia & Fibrillation'],
      fr: ['Maladie coronarienne obstructive', 'Sténose et insuffisance valvulaire', 'Anévrismes aortiques', 'Troubles du rythme cardiaque'],
    },
    procedures: {
      ar: [
        { name: 'جراحة المجازة التاجية (CABG)', desc: 'إعادة تروية عضلة القلب باستخدام تقنيات القلب النابض بدون توقيف مؤقت للدورة الدموية.' },
        { name: 'تبديل الصمام الميترالي والأورطي بالمنظار', desc: 'جراحة دقيقة عبر شق جانبي صغير بين الأضلاع بدلاً من شق الصدر الكامل.' },
        { name: 'القسطرة العلاجية وزراعة الصمامات (TAVI)', desc: 'استبدال الصمام الأورطي عبر شريان الفخذ دون جراحة قلب مفتوح.' }
      ],
      en: [
        { name: 'Coronary Artery Bypass (CABG)', desc: 'Myocardial revascularization often performed on a beating heart for faster recovery.' },
        { name: 'Minimally Invasive Valve Repair', desc: 'Surgical repair through small intercostal incisions rather than full sternotomy.' },
        { name: 'Transcatheter Aortic Valve (TAVI)', desc: 'Aortic valve implantation via femoral catheter without open-chest surgery.' }
      ],
      fr: [
        { name: 'Pontage Aortocoronarien (CABG)', desc: 'Revascularisation myocardique à cœur battant pour une récupération accélérée.' },
        { name: 'Chirurgie Valvulaire Mini-Invasive', desc: 'Réparation par mini-thoracotomie évitant la sternotomie complète.' },
        { name: 'Implantation TAVI par Cathétérisme', desc: 'Remplacement valvulaire par voie fémorale sans chirurgie ouverte.' }
      ],
    },
    whyTurkey: {
      ar: ['نسب نجاح جراحات القلب في مشافي تركيا تتجاوز 98%', 'توفر أحدث غرف العمليات الهجينة والأجنحة المخصصة للعناية المركزة للقلب', 'تكلفة علاج تقل بنسبة تصل إلى 65% مقارنة بأوروبا والولايات المتحدة'],
      en: ['Cardiac surgery success rates in Turkish centers exceed 98%', 'State-of-the-art hybrid ORs and specialized cardiac ICUs', 'Treatment costs up to 65% lower than in Western Europe or the US'],
      fr: ['Taux de réussite en chirurgie cardiaque dépassant 98%', 'Salles hybrides de pointe et soins intensifs spécialisés', 'Coûts de traitement jusqu’à 65% inférieurs à l’Europe occidentale'],
    },
    faqs: [
      {
        question: {
          ar: 'كم يوماً يحتاج المريض للبقاء في تركيا بعد جراحة القلب؟',
          en: 'How many days should a patient stay in Turkey after heart surgery?',
          fr: 'Combien de jours le patient doit-il rester en Turquie après une chirurgie cardiaque ?',
        },
        answer: {
          ar: 'يقضي المريض في العادة 4 إلى 7 أيام في المستشفى، تليها أسبوع إلى أسبوعين من المتابعة والفحوصات في فندق الإقامة للتأكد من استقرار حالته قبل السفر.',
          en: 'Patients typically spend 4 to 7 days in the hospital, followed by 7 to 10 days of outpatient follow-ups at the hotel before flying home.',
          fr: 'Le séjour hospitalier dure généralement de 4 à 7 jours, suivi d’une semaine de suivi en hôtel avant l’autorisation de vol.',
        },
      },
    ],
    doctorIds: ['doc-1'],
  },
  {
    id: 'treat-2',
    slug: 'neurosurgery',
    title: {
      ar: 'جراحة المخ والأعصاب والعمود الفقري',
      en: 'Neurosurgery & Spine Surgery',
      fr: 'Neurochirurgie & Chirurgie du Rachis',
    },
    shortDescription: {
      ar: 'استئصال أورام الدماغ بالملاحة العصبية وجراحة العمود الفقري المجهرية والجراحة الإشعاعية سايبر نايف.',
      en: 'Neuronavigation brain tumor resection, microscopic spine disc surgeries, and CyberKnife radiosurgery.',
      fr: 'Microchirurgie des tumeurs cérébrales, chirurgie du rachis et radiochirurgie CyberKnife sans incision.',
    },
    fullOverview: {
      ar: 'يضم قسم جراحة المخ والأعصاب تقنيات الجراحة العصبية المجهرية ثلاثية الأبعاد، وتخطيط الرنين المغناطيسي الوظيفي أثناء العملية (Intraoperative MRI)، مما يتيح للأطباء استئصال الأورام وحماية المراكز الحيوية الحركية والنطقية بأعلى درجات الأمان.',
      en: 'The neurosurgical department features intraoperative MRI guidance and 3D microsurgery, allowing surgeons to achieve maximal tumor resection while preserving vital motor and speech functions.',
      fr: 'Le département de neurochirurgie intègre l’IRM peropératoire et la microchirurgie 3D, garantissant une résection tumorale maximale tout en préservant les fonctions vitales.',
    },
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Brain',
    featured: true,
    conditionsTreated: {
      ar: ['أورام الدماغ الحميدة والخبيثة', 'الانزلاق الغضروفي العنقي والقطني', 'انحراف العمود الفقري (الجنف والحدب)', 'أورام الغدة النخامية وقاع الجمجمة'],
      en: ['Benign & Malignant Brain Tumors', 'Cervical & Lumbar Disc Herniation', 'Scoliosis & Spine Deformities', 'Pituitary & Skull-Base Lesions'],
      fr: ['Tumeurs cérébrales bénignes et malignes', 'Hernies discales cervicales et lombaires', 'Scoliose et déformations rachidiennes', 'Adénomes hypophysaires'],
    },
    procedures: {
      ar: [
        { name: 'الجراحة المجهرية بالملاحة العصبية', desc: 'تحديد موقع الورم بدقة الملليمتر واستئصاله بأمان تام دون المساس بالمراكز الدماغية.' },
        { name: 'جراحة الغضروف المجهرية (Microdiscectomy)', desc: 'إزالة الضغط عن العصب عبر شق جراحي دقيق يقل عن 2 سم والخروج من المستشفى في نفس اليوم.' },
        { name: 'الجراحة الإشعاعية الروبوتية سايبر نايف', desc: 'استهداف الأورام الدقيقة بجرعات إشعاعية فائقة التركيز بدون فتح جراحي أو تخدير عام.' }
      ],
      en: [
        { name: 'Neuronavigation Brain Surgery', desc: 'Sub-millimeter real-time tracking for safe tumor resection preserving motor and cognitive pathways.' },
        { name: 'Microscopic Discectomy', desc: 'Minimally invasive nerve decompression through incisions under 2 cm with same-day ambulation.' },
        { name: 'CyberKnife Radiosurgery', desc: 'Painless pinpoint radiation beams destroying tumors without surgical incision or general anesthesia.' }
      ],
      fr: [
        { name: 'Microchirurgie par Neuronavigation', desc: 'Guidage assisté par ordinateur pour cibler les tumeurs avec une précision millimétrique.' },
        { name: 'Microdiscectomie lombaire', desc: 'Décompression nerveuse par mini-incision avec reprise de la marche le jour même.' },
        { name: 'Radiochirurgie Robotisée CyberKnife', desc: 'Faisceaux d’irradiation ciblés détruisant la lésion sans anesthésie ni cicatrice.' }
      ],
    },
    whyTurkey: {
      ar: ['استخدام تقنيات الرنين المغناطيسي أثناء الجراحة Intraoperative MRI', 'كفاءة وخبرة جراحي الأعصاب الأتراك الحائزين على زمالات أمريكية وأوروبية', 'توافر أحدث روبوتات سايبر نايف وغاما نايف'],
      en: ['Availability of intraoperative MRI in operating rooms', 'Internationally recognized neurosurgeons with top European/US fellowships', 'Cutting-edge CyberKnife and Gamma Knife radiosurgery installations'],
      fr: ['Présence d’IRM peropératoire en bloc chirurgical', 'Neurochirurgiens certifiés de rang international', 'Plateformes CyberKnife et Gamma Knife de dernière génération'],
    },
    faqs: [
      {
        question: {
          ar: 'هل تتوفر تقنية سايبر نايف لجميع الأورام؟',
          en: 'Is CyberKnife radiosurgery suitable for all brain lesions?',
          fr: 'Le CyberKnife est-il adapté à toutes les lésions cérébrales ?',
        },
        answer: {
          ar: 'يتم تقييم كل حالة بواسطة المجلس الطبي متعدد التخصصات لتحديد ما إذا كان سايبر نايف أو الجراحة المجهرية هو الخيار الأنسب والأكثر أماناً.',
          en: 'Every case is evaluated by our multidisciplinary neuro-oncology board to determine whether CyberKnife or microsurgery yields the optimal result.',
          fr: 'Chaque cas fait l’objet d’une concertation pluridisciplinaire pour confirmer l’indication du CyberKnife ou de la microchirurgie.',
        },
      },
    ],
    doctorIds: ['doc-2'],
  },
  {
    id: 'treat-3',
    slug: 'orthopedics',
    title: {
      ar: 'جراحة العظام والمفاصل',
      en: 'Orthopedics & Joint Surgery',
      fr: 'Chirurgie Orthopédique & Articulaire',
    },
    shortDescription: {
      ar: 'استبدال مفصل الركبة والورك بالذراع الروبوتي، ترميم الأربطة بالمنظار وعلاج تشوهات العظام.',
      en: 'Robotic knee and hip replacement, arthroscopic ligament reconstruction, and bone alignment.',
      fr: 'Remplacement articulaire du genou et de la hanche par bras robotisé et arthroscopie.',
    },
    fullOverview: {
      ar: 'يقدم قسم العظام في تركيا أحدث حلول الجراحة الروبوتية (MAKO Robotic Arthroplasty) التي تتيح تركيب المفصل الصناعي بدقة ميكانيكية متناهية تتوافق مع تشريح كل مريض، مما يضمن عمراً أطول للمفصل وتعافياً سريعاً دون ألم مزمن.',
      en: 'Our orthopedic department utilizes advanced MAKO robotic-arm assisted joint replacements customized to each patient’s unique anatomy, minimizing tissue trauma and extending prosthesis longevity.',
      fr: 'Notre service d’orthopédie s’appuie sur la chirurgie assistée par bras robotisé MAKO pour une pose d’implant sur mesure, réduisant les douleurs et accélérant la rééducation.',
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Activity',
    featured: true,
    conditionsTreated: {
      ar: ['خشونة وتآكل مفصل الركبة والورك المتقدم', 'تمزق الرباط الصليبي والغضروف الهلالي', 'إصابات الكتف والأوتار الرياضية', 'تشوهات الأطراف وقصر القامة'],
      en: ['Advanced Knee & Hip Osteoarthritis', 'Anterior Cruciate Ligament (ACL) & Meniscus Tears', 'Rotator Cuff & Shoulder Impingement', 'Limb Deformities & Alignment Disorders'],
      fr: ['Arthrose sévère du genou et de la hanche', 'Ruptures du ligament croisé et ménisque', 'Lésions de la coiffe des rotateurs', 'Inégalités de longueur des membres'],
    },
    procedures: {
      ar: [
        { name: 'استبدال المفصل بالروبوت MAKO', desc: 'تثبيت المفصل الصناعي بدقة كمبيوترية تحافظ على الأنسجة والأربطة الطبيعية المحيطة.' },
        { name: 'تنظير الركبة والكتف الدقيق', desc: 'ترميم الرباط الصليبي والغضاريف عبر ثقوب جراحية دقيقة لعودة الرياضي للمنافسة.' },
        { name: 'حقن الخلايا الجذعية التجديدية', desc: 'حقن الغضاريف المتآكلة بالخلايا التجديدية لإبطاء الخشونة وتسكين الآلام.' }
      ],
      en: [
        { name: 'MAKO Robotic Joint Arthroplasty', desc: 'Computerized robotic positioning preserving healthy bone and periarticular soft tissue.' },
        { name: 'Knee & Shoulder Arthroscopy', desc: 'Minimally invasive ligament and labral repairs allowing early sports rehabilitation.' },
        { name: 'Regenerative Stem Cell Injections', desc: 'Autologous biologics promoting cartilage preservation and inflammation relief.' }
      ],
      fr: [
        { name: 'Prothèse Articulaire Robotisée MAKO', desc: 'Positionnement assisté par ordinateur préservant le capital osseux sain.' },
        { name: 'Arthroscopie du Genou et de l’Épaule', desc: 'Réparation ligamentaire par mini-orifices permettant une reprise sportive précoce.' },
        { name: 'Infiltrations de Cellules Souches', desc: 'Biothérapies autologues pour régénérer le cartilage et apaiser l’inflammation.' }
      ],
    },
    whyTurkey: {
      ar: ['تجهيزات روبوتية متطورة تضاهي أكبر مراكز أمريكا', 'برامج إعادة تأهيل وفيزيوثيرابي فورية متكاملة', 'مفاصل صناعية من أحدث الطرازات العالمية المعتمدة من FDA'],
      en: ['Cutting-edge robotic platforms matching top US medical centers', 'Immediate in-hospital intensive physiotherapy pathways', 'FDA-approved premium titanium and ceramic prostheses'],
      fr: ['Centres robotisés de rang mondial équivalents aux États-Unis', 'Programmes de kinésithérapie immédiats personnalisés', 'Implants en titane et céramique certifiés FDA'],
    },
    faqs: [
      {
        question: {
          ar: 'متى يستطيع المريض المشي بعد عملية تبديل مفصل الركبة بالروبوت؟',
          en: 'When can a patient walk after robotic knee replacement?',
          fr: 'Quand le patient peut-il remarcher après une prothèse robotisée du genou ?',
        },
        answer: {
          ar: 'يستطيع المريض المشي بمساعدة الأخصائي في نفس يوم العملية أو خلال 24 ساعة بفضل تقنيات التخدير الموضعي والجراحة الروبوتية الدقيقة.',
          en: 'Most patients begin walking with assisted guidance on the same day or within 24 hours of surgery thanks to robotic precision and tissue preservation.',
          fr: 'Le lever et la marche accompagnée se font dès le jour même ou sous 24 heures grâce à la précision robotique.',
        },
      },
    ],
    doctorIds: ['doc-3'],
  },
  {
    id: 'treat-4',
    slug: 'organ-transplant',
    title: {
      ar: 'زراعة الأعضاء (الكلى والكبد)',
      en: 'Organ Transplantation',
      fr: 'Transplantation d’Organes',
    },
    shortDescription: {
      ar: 'زراعة الكلى والكبد من متبرع حي بتقنيات المنظار الجراحي ونسب نجاح سريرية تتجاوز 98%.',
      en: 'Living-donor kidney and liver transplantation via advanced laparoscopy with clinical success rates over 98%.',
      fr: 'Greffe de rein et de foie à donneur vivant par cœlioscopie avec un taux de succès supérieur à 98%.',
    },
    fullOverview: {
      ar: 'تعد تركيا الدولة الرائدة عالمياً في عمليات زراعة الأعضاء من متبرعين أحياء، حيث تطبق أحدث معايير التوافق الجيني وعمليات استئصال كلية المتبرع بالمنظار الكامل لتوفير أعلى مستويات الأمان للمتبرع والمريض.',
      en: 'Turkey is a global leader in living-donor organ transplantation, implementing rigorous immunological compatibility protocols and pure laparoscopic donor nephrectomy to maximize safety.',
      fr: 'La Turquie est un leader mondial de la transplantation d’organes à donneur vivant, appliquant des protocoles immunologiques de pointe et la néphrectomie par cœlioscopie.',
    },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
    iconName: 'ShieldPlus',
    featured: true,
    conditionsTreated: {
      ar: ['الفشل الكلوي المزمن والمرحلة النهائية', 'تليف وتلف الكبد المتقدم', 'الأمراض الكلوية الوراثية للأطفال والبالغين'],
      en: ['End-Stage Renal Disease (ESRD)', 'Advanced Liver Cirrhosis & Failure', 'Genetic Kidney & Hepatic Disorders'],
      fr: ['Insuffisance rénale terminale', 'Cirrhose et insuffisance hépatique avancée', 'Pathologies rénales génétiques'],
    },
    procedures: {
      ar: [
        { name: 'زراعة الكلى بالمنظار للمتبرع', desc: 'استئصال كلية المتبرع عبر ثقوب المنظار الدقيقة دون ألم وسرعة خروج من المستشفى.' },
        { name: 'زراعة الكبد من متبرع حي (Living Donor)', desc: 'فصل جزء من كبد المتبرع وزراعته بدقة جراحية عالية ليعود وينمو تلقائياً.' }
      ],
      en: [
        { name: 'Laparoscopic Donor Nephrectomy', desc: 'Minimally invasive donor surgery ensuring rapid recovery and minimal scarring.' },
        { name: 'Living-Donor Liver Transplantation', desc: 'Precision split-graft surgery leveraging liver regeneration in both donor and recipient.' }
      ],
      fr: [
        { name: 'Néphrectomie du Donneur par Cœlioscopie', desc: 'Intervention mini-invasive assurant un rétablissement rapide et indolore.' },
        { name: 'Transplantation Hépatique Donneur Vivant', desc: 'Greffe partielle exploitant la capacité naturelle de régénération du foie.' }
      ],
    },
    whyTurkey: {
      ar: ['المرتبة الأولى عالمياً في زراعة الأعضاء من متبرعين أحياء', 'نسب نجاح تصل إلى 98.5% للكلى و93% للكبد', 'مختبرات توافق الأنسجة الجينية المعتمدة من منظمة EFI الأوروبية'],
      en: ['Ranked #1 globally for living-donor transplantation volume and safety', 'Success rates of 98.5% for kidneys and 93% for liver grafts', 'EFI-accredited immunogenetics laboratories'],
      fr: ['Numéro 1 mondial en volume et sécurité des greffes à donneur vivant', 'Taux de succès de 98,5% pour le rein et 93% pour le foie', 'Laboratoires d’immunologie certifiés par l’EFI'],
    },
    faqs: [
      {
        question: {
          ar: 'ما هي شروط التبرع بالأعضاء للمرضى الدوليين في تركيا؟',
          en: 'What are the legal requirements for organ donation in Turkey for foreigners?',
          fr: 'Quelles sont les conditions pour un don d’organe en Turquie pour un patient étranger ?',
        },
        answer: {
          ar: 'يشترط القانون التركي أن يكون المتبرع قريباً من الدرجة الأولى حتى الرابعة مع توثيق الأوراق الرسمية والموافقة الطبية والأخلاقية الكاملة.',
          en: 'Turkish law requires living donors to be documented blood relatives up to the 4th degree, subject to ethical committee approval.',
          fr: 'La loi turque exige que le donneur vivant soit un membre de la famille jusqu’au 4e degré avec validation du comité d’éthique.',
        },
      },
    ],
    doctorIds: ['doc-4'],
  },
  {
    id: 'treat-5',
    slug: 'hair-transplant',
    title: {
      ar: 'زراعة الشعر والترميم الجلدي',
      en: 'Hair Restoration & Aesthetic Surgery',
      fr: 'Greffe de Cheveux & Restauration Capillaire',
    },
    shortDescription: {
      ar: 'تقنيات الياقوت السفير Sapphire FUE وأقلام تشوي DHI بدون حلاقة وبأعلى كثافة طبيعية تدوم مدى الحياة.',
      en: 'Sapphire FUE and direct Choi pen DHI with lifetime natural growth and maximum density.',
      fr: 'Techniques Sapphire FUE et stylos Choi DHI sans rasage pour une densité naturelle à vie.',
    },
    fullOverview: {
      ar: 'تعد إسطنبول العاصمة العالمية لزراعة الشعر، وتتميز مراكز AVICINNA بتطبيق أحدث تقنيات السفير الدقيقة وأقلام DHI تحت إشراف أطباء استشاريين أعضاء في الجمعية الدولية ISHRS لضمان زوايا نمو طبيعية 100% وضمان خطي مدى الحياة.',
      en: 'Istanbul is the world capital for hair restoration. AVICINNA clinics utilize authentic Sapphire blades and DHI Choi implanters led by ISHRS certified physicians, ensuring 100% natural angles and written lifetime guarantees.',
      fr: 'Istanbul est la référence mondiale en greffe capillaire. Les centres AVICINNA appliquent les lames saphir et stylos Choi DHI avec des médecins certifiés ISHRS et une garantie à vie.',
    },
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Sparkles',
    featured: true,
    conditionsTreated: {
      ar: ['الصلع الوراثي عند الرجال بدرجاته المختلفة', 'تساقط الشعر وترققه لدى النساء', 'فراغات اللحية والشارب والحواجب', 'تغطية الندوب الجراحية وآثار الحروق في الرأس'],
      en: ['Male Pattern Androgenetic Baldness', 'Female Hair Thinning & Alopecia', 'Beard, Mustache & Eyebrow Scarcity', 'Scalp Scar & Trauma Camouflage'],
      fr: ['Alopécie androgénétique masculine', 'Perte de densité capillaire féminine', 'Manque de densité barbe et sourcils', 'Correction de cicatrices crâniennes'],
    },
    procedures: {
      ar: [
        { name: 'زراعة الشعر بالسفير Sapphire FUE', desc: 'فتح قنوات الحاضنة برؤوس حجر الياقوت الطبيعي لالتئام أسرع دون ترك أي أثر أو ندوب.' },
        { name: 'تقنية أقلام تشوي DHI', desc: 'زراعة البصيلات مباشرة بين الشعر الأصلي دون الحاجة إلى حلاقة كاملة للرأس.' },
        { name: 'جلسات البلازما المعززة والخلايا الجذعية', desc: 'تغذية البصيلات المزروعة وتنشيط نموها بأحدث عوامل النمو البيولوجية.' }
      ],
      en: [
        { name: 'Sapphire Micro-FUE', desc: 'Micro-incisions created with genuine sapphire crystal for rapid healing and zero visible scarring.' },
        { name: 'DHI Direct Hair Implantation', desc: 'Implantation using Choi pens directly between existing hairs without full head shaving.' },
        { name: 'Growth Factor Enriched PRP', desc: 'Biologic stimulation maximizing graft vitality and boosting native hair density.' }
      ],
      fr: [
        { name: 'Greffe Sapphire Micro-FUE', desc: 'Canaux ouverts par lames de saphir pur pour une cicatrisation accélérée sans traces.' },
        { name: 'Technique DHI Stylos Choi', desc: 'Implantation directe sans rasage intégral, idéale pour densifier les zones clairsemées.' },
        { name: 'Thérapie PRP Enrichie', desc: 'Facteurs de croissance stimulant l’ancrage des greffons et revitalisant le cuir chevelu.' }
      ],
    },
    whyTurkey: {
      ar: ['خبرة طبية تفوق ملايين العمليات الناجحة في إسطنبول', 'باقات متكاملة شاملة الإقامة الفاخرة والأدوية والمتابعة طوال عام كامل', 'شهادة ضمان طبي مدى الحياة لنمو البصيلات'],
      en: ['Unmatched global clinical volume and hairline artistry', 'All-inclusive packages: 5-star hotel, VIP transport, medications & 1-year follow-up', 'Written lifetime certificate of graft growth'],
      fr: ['Expertise chirurgicale de premier ordre à Istanbul', 'Forfaits tout compris : hôtel 5 étoiles, transferts VIP et suivi médical sur 1 an', 'Certificat de garantie à vie sur la repousse'],
    },
    faqs: [
      {
        question: {
          ar: 'متى تظهر النتيجة النهائية لزراعة الشعر؟',
          en: 'When will the final hair transplant results be visible?',
          fr: 'Quand le résultat final de la greffe de cheveux est-il visible ?',
        },
        answer: {
          ar: 'يبدأ الشعر الجديد بالنمو تدريجياً بعد الشهر الثالث، وتظهر النتيجة الممتازة في الشهر السادس، في حين تكتمل الكثافة النهائية بنسبة 100% بين الشهر التاسع والثاني عشر.',
          en: 'New hair begins sprouting around month 3, noticeable aesthetic improvements emerge by month 6, and full 100% mature density is achieved between months 9 and 12.',
          fr: 'La repousse débute au 3e mois, le résultat s’intensifie au 6e mois et la densité définitive est acquise entre 9 et 12 mois.',
        },
      },
    ],
    doctorIds: ['doc-5'],
  },
  {
    id: 'treat-6',
    slug: 'dentistry',
    title: {
      ar: 'طب وتجميل الأسنان (ابتسامة هوليوود)',
      en: 'Aesthetic Dentistry & Hollywood Smile',
      fr: 'Dentisterie Esthétique & Hollywood Smile',
    },
    shortDescription: {
      ar: 'قشور الإيماكس والزيركون الألمانية، زراعة الأسنان الفورية All-on-4 وتصميم الابتسامة الرقمية 3D.',
      en: 'Premium E-Max and Zirconia veneers, All-on-4 instant implants, and 3D digital smile design.',
      fr: 'Facettes dentaires E-Max, couronnes zircone et implants immédiats All-on-4.',
    },
    fullOverview: {
      ar: 'نقدم حلولاً متكاملة لتجميل الأسنان خلال رحلة سياحية قصيرة مدتها 5 إلى 7 أيام في إسطنبول، باستخدام مختبرات الكاد-كام الرقمية (CAD/CAM) وتصميم ابتسامتك مسبقاً على شاشة ثلاثية الأبعاد قبل البدء بأي إجراء.',
      en: 'Transform your smile during a 5 to 7-day stay in Istanbul. Our dental clinics utilize German in-house CAD/CAM milling and 3D Digital Smile Design to preview your ideal smile before any procedure starts.',
      fr: 'Retrouvez un sourire éclatant en 5 à 7 jours à Istanbul. Nos cliniques utilisent la technologie CAD/CAM et le design numérique 3D pour prévisualiser le résultat avant la pose.',
    },
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Smile',
    featured: true,
    conditionsTreated: {
      ar: ['تصبغ واصفرار الأسنان الشديد المقاوم للتبييض', 'تكسر أو تآكل وتزاحم الأسنان', 'فقدان سن واحد أو عدة أسنان أو الفك كاملاً', 'تراجع وانحسار اللثة وعدم تناسق الابتسامة'],
      en: ['Severe Intrinsic Teeth Discoloration', 'Chipped, Worn or Misaligned Teeth', 'Missing Single, Multiple, or Full Arch Teeth', 'Gummy Smiles & Asymmetric Gingival Line'],
      fr: ['Colorations dentaires sévères', 'Dents ébréchées, usées ou mal alignées', 'Pertes dentaires unitaires ou complètes', 'Sourire gingival et asymétries'],
    },
    procedures: {
      ar: [
        { name: 'قشور الإيماكس التجميلية E-Max', desc: 'عدسات بورسلين فائقة الشفافية تحاكي لون ولمعان السن الطبيعي بأعلى درجات الجمال.' },
        { name: 'زراعة الأسنان الفورية All-on-4 / All-on-6', desc: 'تثبيت فك أسنان كامل وثابت على 4 أو 6 غرسات تيتانيوم سويسرية خلال 48 ساعة.' },
        { name: 'تيجان الزيركونيا المقواة', desc: 'تركيبات فائقة القوة والمتانة لتغطية الأسنان الخلفية والأمامية مع حماية اللثة.' }
      ],
      en: [
        { name: 'Ultra-Thin E-Max Porcelain Veneers', desc: 'High-translucency aesthetic laminates matching the natural shade and light reflection of teeth.' },
        { name: 'All-on-4 / All-on-6 Immediate Implants', desc: 'Complete fixed arch restoration placed on Swiss titanium implants within 48 to 72 hours.' },
        { name: 'Monolithic Zirconia Crowns', desc: 'Biocompatible high-strength crowns protecting teeth while maintaining pristine aesthetics.' }
      ],
      fr: [
        { name: 'Facettes Esthétiques E-Max', desc: 'Pellicules de céramique haute translucidité reproduisant la brillance naturelle.' },
        { name: 'Implants Immédiats All-on-4 / All-on-6', desc: 'Arcade fixe complète posée sur implants suisses en titane sous 48 à 72 heures.' },
        { name: 'Couronnes en Zircone Monolithique', desc: 'Céramique haute résistance biocompatible respectant la gencive.' }
      ],
    },
    whyTurkey: {
      ar: ['توفير ما يصل إلى 70% مقارنة بأسعار العيادات في بريطانيا وأوروبا والخليج', 'أحدث مختبرات الـ CAD/CAM الرقمية لإنهاء الابتسامة في 5 أيام فقط', 'ضمان رسمي معتمد على المواد والغرسات السويسرية والألمانية'],
      en: ['Save up to 70% compared to UK, European, and Gulf dental clinics', 'In-house digital CAD/CAM labs delivering custom smile makeovers in 5 days', 'Official manufacturer warranties on Swiss and German implants'],
      fr: ['Économies jusqu’à 70% par rapport à l’Europe et au Royaume-Uni', 'Laboratoires CAD/CAM intégrés assurant la confection en 5 jours', 'Garantie officielle sur les implants suisses et allemands'],
    },
    faqs: [
      {
        question: {
          ar: 'كم من الوقت تستغرق رحلة ابتسامة هوليوود في إسطنبول؟',
          en: 'How long does a Hollywood Smile makeover trip take in Istanbul?',
          fr: 'Combien de temps dure un séjour Hollywood Smile à Istanbul ?',
        },
        answer: {
          ar: 'تستغرق الإجراءات عادة 5 إلى 7 أيام فقط، تتضمن جلستين إلى ثلاث جلسات مريحة مع متسع من الوقت للاستمتاع بالسياحة في إسطنبول.',
          en: 'The entire treatment typically takes 5 to 7 days, consisting of 2 to 3 comfortable clinical appointments leaving plenty of time to explore Istanbul.',
          fr: 'Le traitement complet s’effectue en 5 à 7 jours à travers 2 à 3 séances confortables.',
        },
      },
    ],
    doctorIds: ['doc-6'],
  },
  {
    id: 'treat-7',
    slug: 'oncology',
    title: {
      ar: 'الأورام والسرطان والعلاج المناعي',
      en: 'Oncology & Cancer Care',
      fr: 'Oncologie & Soins du Cancer',
    },
    shortDescription: {
      ar: 'بروتوكولات العلاج المناعي الحديثة، الاستئصال الروبوتي دافنشي والعلاج الموجه بالجينات مع مجالس أورام دولية.',
      en: 'Targeted immunotherapy, Da Vinci robotic tumor resections, and comprehensive tumor board reviews.',
      fr: 'Immunothérapie de pointe, chirurgie robotique Da Vinci et thérapies ciblées.',
    },
    fullOverview: {
      ar: 'تقدم مراكز الأورام الشريكة لـ AVICINNA أحدث بروتوكولات الطب الشخصي الدقيق، حيث يتم تحليل الطفرات الجينية للورم لوضع خطة علاجية مخصصة تجمع بين العلاج المناعي والعلاج الكيميائي الذكي والجراحة الروبوتية دافنشي.',
      en: 'AVICINNA partner cancer centers deliver personalized precision medicine: genetic sequencing identifies specific tumor mutations to design targeted immunotherapy, smart chemotherapy, and Da Vinci robotic surgery.',
      fr: 'Les centres de cancérologie partenaires d’AVICINNA déploient une médecine de précision : le séquençage génétique cible les anomalies pour adapter l’immunothérapie et la chirurgie robotique Da Vinci.',
    },
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Microscope',
    featured: false,
    conditionsTreated: {
      ar: ['أورام الرئة والقولون والجهاز الهضمي', 'أورام الثدي والنساء', 'أورام المسالك البولية والبروستاتا', 'أورام الدماغ والغدد الليمفاوية'],
      en: ['Lung, Colorectal & GI Tumors', 'Breast & Gynecologic Cancers', 'Prostate & Urologic Cancers', 'Brain Lesions & Lymphomas'],
      fr: ['Cancers du poumon et digestifs', 'Cancers du sein et gynécologiques', 'Cancers de la prostate et urologiques', 'Tumeurs cérébrales et lymphomes'],
    },
    procedures: {
      ar: [
        { name: 'العلاج المناعي الموجه (Immunotherapy)', desc: 'تنشيط جهاز المناعة للتعرف على الخلايا السرطانية والقضاء عليها بدون الإضرار بالخلايا السليمة.' },
        { name: 'الجراحة الروبوتية دافنشي (Da Vinci)', desc: 'استئصال الأورام بدقة ثلاثية الأبعاد عبر شقوق متناهية الصغر تحافظ على وظائف الأعضاء.' }
      ],
      en: [
        { name: 'Targeted Immunotherapy', desc: 'Activating the body’s own immune defenses to recognize and eliminate malignant cells selectively.' },
        { name: 'Da Vinci Robotic Surgery', desc: 'Precision 3D tumor resection with articulating robotic instruments preserving organ functionality.' }
      ],
      fr: [
        { name: 'Immunothérapie Ciblée', desc: 'Stimulation du système immunitaire pour éliminer sélectivement les cellules tumorales.' },
        { name: 'Chirurgie Robotique Da Vinci', desc: 'Résection tumorale 3D ultra-précise préservant l’intégrité fonctionnelle des organes.' }
      ],
    },
    whyTurkey: {
      ar: ['توفر أحدث أدوية العلاج المناعي المعتمدة من منظمة الغذاء والدواء الأمريكية FDA', 'مناقشة كل حالة ضمن مجلس أورام استشاري يضم أكثر من 10 تخصصات', 'رعاية شمولية تجمع بين الدعم النفسي والغذائي والتلطيفي'],
      en: ['Immediate availability of FDA-approved targeted immunotherapy and biological drugs', 'Every patient profile reviewed by a comprehensive multidisciplinary tumor board', 'Holistic clinical, nutritional, and supportive oncology programs'],
      fr: ['Disponibilité immédiate des dernières molécules d’immunothérapie approuvées FDA', 'Dossiers revus par des réunions de concertation pluridisciplinaire (RCP)', 'Prise en charge globale nutritionnelle et soins de support'],
    },
    faqs: [
      {
        question: {
          ar: 'كيف أطلب رأياً طبياً ثانياً لحالة ورم؟',
          en: 'How can I request a second medical opinion for a cancer diagnosis?',
          fr: 'Comment demander un deuxième avis médical en oncologie ?',
        },
        answer: {
          ar: 'يمكنك إرسال التقارير الطبية ونتائج الخزعة والتصوير عبر واتساب أو استمارة الموقع، وسيقوم مجلس الأورام بمراجعتها وتقديم تقرير مفصل خلال 24 إلى 48 ساعة مجاناً.',
          en: 'Send your pathology reports and scans through our consultation form or WhatsApp. Our specialist board evaluates the data and delivers a written assessment within 24-48 hours.',
          fr: 'Transmettez vos comptes-rendus anatomo-pathologiques et imageries via WhatsApp ou formulaire pour une étude sous 24 à 48 heures.',
        },
      },
    ],
    doctorIds: ['doc-7'],
  },
  {
    id: 'treat-8',
    slug: 'diagnostics',
    title: {
      ar: 'التشخيص الطبي والفحص الشامل (Check-Up)',
      en: 'Medical Diagnostics & Comprehensive Check-Up',
      fr: 'Diagnostic Médical & Bilan de Santé (Check-Up)',
    },
    shortDescription: {
      ar: 'برامج الفحص الدوري الشامل VIP في يوم واحد باستخدام أحدث أجهزة الرنين المغناطيسي 3T والتصوير المقطعي.',
      en: 'Executive one-day VIP comprehensive check-ups with 3-Tesla MRI, PET-CT, and genetic testing.',
      fr: 'Bilans de santé VIP complets en 1 journée avec IRM 3T, PET-Scan et analyses génétiques.',
    },
    fullOverview: {
      ar: 'صممت باقات الفحص الطبي الشامل (Executive Check-up) في مراكز AVICINNA للزوار الراغبين في الاطمئنان الكامل على صحتهم خلال يوم واحد في إسطنبول، حيث تشمل تقييماً دقيقاً لكافة أجهزة الجسم والقلب والشرايين والكشف المبكر عن الأورام.',
      en: 'AVICINNA’s executive health screening packages are designed for international visitors desiring a full health audit within a single day in Istanbul, combining 3T imaging, cardiovascular tests, and multi-organ profiling.',
      fr: 'Les forfaits de check-up exécutif AVICINNA permettent aux visiteurs internationaux de réaliser un bilan préventif complet en 1 journée avec imagerie 3T et consultations spécialisées.',
    },
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    iconName: 'FileCheck2',
    featured: false,
    conditionsTreated: {
      ar: ['الكشف المبكر عن الأورام الصامتة', 'فحص صحة القلب والشرايين والوقاية من الجلطات', 'تقييم وظائف الكبد والكلى والغدد الصماء', 'فحوصات ما بعد التعافي الشاملة'],
      en: ['Early Detection of Asymptomatic Tumors', 'Cardiovascular Risk Profiling & Stroke Prevention', 'Metabolic, Liver & Endocrine Screening', 'Comprehensive Post-Recovery Evaluation'],
      fr: ['Dépistage précoce des pathologies silencieuses', 'Bilan cardiovasculaire préventif', 'Évaluation hépatique, rénale et hormonale', 'Bilans de suivi postopératoire'],
    },
    procedures: {
      ar: [
        { name: 'الفحص الدوري VIP خلال 6 ساعات', desc: 'إجراء كافة التحاليل المخبرية والأشعات واستشارات الأطباء في جناح خاص دون انتظار.' },
        { name: 'تصوير الجسم بالرنين المغناطيسي 3-Tesla', desc: 'أعلى دقة تصويرية تشخيصية للأعصاب والمخ والمفاصل بدون إشعاعات ضارة.' }
      ],
      en: [
        { name: 'VIP 6-Hour Executive Screening', desc: 'Complete blood panels, ultrasound, imaging, and multi-specialist consultations in a private suite.' },
        { name: '3-Tesla Whole-Body MRI', desc: 'Highest definition magnetic resonance imaging without ionizing radiation.' }
      ],
      fr: [
        { name: 'Bilan de Santé VIP en 6 Heures', desc: 'Analyses biologiques, imagerie complète et consultations spécialisées en salon privé.' },
        { name: 'IRM Corps Entier 3-Tesla', desc: 'Imagerie à très haute résolution sans rayonnement ionisant pour un diagnostic ultra-précis.' }
      ],
    },
    whyTurkey: {
      ar: ['نتائج وتقارير طبية شاملة باللغة الإنجليزية أو العربية في نفس اليوم', 'أجنحة استقبال VIP مخصصة للراحة وتناول وجبة صحية أثناء الفحص', 'تقنيات تصوير دقيقة تكتشف الأمراض في مراحلها الأولية المبكرة جداً'],
      en: ['Comprehensive final reports delivered in English or Arabic on the same day', 'Dedicated VIP lounge with complimentary nutritional dining between tests', 'World-leading diagnostic scanners detecting cellular-level irregularities early'],
      fr: ['Remise des résultats et rapport médical détaillé en français ou anglais le jour même', 'Salons VIP privatifs avec restauration équilibrée', 'Détection précoce des anomalies au stade débutant'],
    },
    faqs: [
      {
        question: {
          ar: 'هل يمكن حجز الفحص الشامل أثناء رحلة سياحية قصيرة في إسطنبول؟',
          en: 'Can I book a comprehensive check-up during a short vacation in Istanbul?',
          fr: 'Puis-je réaliser un check-up lors d’un court séjour touristique à Istanbul ?',
        },
        answer: {
          ar: 'نعم بالتأكيد، يتم إنجاز الفحوصات والاستشارات كاملة في صباح يوم واحد، ويتوفر لك باقي الوقت للاستمتاع برحلتك في إسطنبول.',
          en: 'Yes, the clinical procedures and tests are typically completed in a single morning, leaving the remainder of your stay free for tourism.',
          fr: 'Absolument, toutes les analyses et consultations se déroulent sur une matinée.',
        },
      },
    ],
    doctorIds: ['doc-8'],
  },
];
