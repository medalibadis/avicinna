export interface HospitalPartner {
  id: string;
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
  accreditation: string;
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  featured: boolean;
  specialtiesCount: number;
}

export const hospitalsData: HospitalPartner[] = [
  {
    id: 'hosp-1',
    name: {
      ar: 'مجموعة مستشفيات أجيبادم إسطنبول (Acibadem Healthcare)',
      en: 'Acibadem Healthcare Group Istanbul',
      fr: 'Groupe Hospitalier Acibadem Istanbul',
    },
    type: {
      ar: 'مستشفى جامعي وتخصصي دولي',
      en: 'International Academic & Surgical Center',
      fr: 'Centre Hospitalier Universitaire International',
    },
    city: {
      ar: 'إسطنبول (مسلك وأتاشهير)',
      en: 'Istanbul (Maslak & Atasehir)',
      fr: 'Istanbul (Maslak & Atasehir)',
    },
    accreditation: 'JCI Accredited & ISO 9001',
    description: {
      ar: 'أحد أرقى الصروح الطبية في تركيا وأوروبا، يمتلك أحدث تقنيات الروبوت الجراحي دافنشي ومراكز زراعة الأعضاء والقلب المفتوح.',
      en: 'One of the foremost healthcare networks in Europe, equipped with Da Vinci robotic surgical systems, hybrid suites, and comprehensive oncology centers.',
      fr: 'L’un des réseaux hospitaliers les plus prestigieux d’Europe, doté de la chirurgie robotique Da Vinci et de pôles oncologiques intégrés.',
    },
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    specialtiesCount: 36,
  },
  {
    id: 'hosp-2',
    name: {
      ar: 'مجموعة مستشفيات أفيسينا الدولية (Avicenna Health)',
      en: 'Avicenna International Hospitals Group',
      fr: 'Groupe Hospitalier International Avicenna',
    },
    type: {
      ar: 'مجمع مستشفيات تخصصية',
      en: 'Specialized Multispecialty Hospitals',
      fr: 'Hôpitaux Pluridisciplinaires Spécialisés',
    },
    city: {
      ar: 'إسطنبول (أتاشهير وغولتبه وكارتال)',
      en: 'Istanbul (Atasehir, Gultepe & Kartal)',
      fr: 'Istanbul (Atasehir, Gultepe & Kartal)',
    },
    accreditation: 'Turkish Ministry of Health & International Quality Certified',
    description: {
      ar: 'شبكة مستشفيات متكاملة تضم أكثر من 4 أفرع كبرى في إسطنبول، تقدم رعاية متميزة للمرضى الدوليين في جراحة العظام والقلب والتجميل وطب الأسنان.',
      en: 'A premier hospital network across 4 major Istanbul locations, providing comprehensive surgical and diagnostic services for international patients.',
      fr: 'Réseau hospitalier majeur à Istanbul comptant plusieurs campus spécialisés en orthopédie, chirurgie cardiaque et dentisterie.',
    },
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    specialtiesCount: 28,
  },
  {
    id: 'hosp-3',
    name: {
      ar: 'مستشفى ميموريال إسطنبول (Memorial Health Group)',
      en: 'Memorial Healthcare Group Istanbul',
      fr: 'Groupe de Santé Memorial Istanbul',
    },
    type: {
      ar: 'مستشفى تخصصي للجراحة والقلب وزراعة الأعضاء',
      en: 'Tertiary Care & Organ Transplant Center',
      fr: 'Hôpital Tertiaire de Chirurgie & Greffes',
    },
    city: {
      ar: 'إسطنبول (شيشلي وبهتشلي إيفلر)',
      en: 'Istanbul (Sisli & Bahcelievler)',
      fr: 'Istanbul (Sisli & Bahcelievler)',
    },
    accreditation: 'JCI Accredited',
    description: {
      ar: 'أول مستشفى في تركيا يحصل على الاعتماد الأمريكي المشترك JCI، رائد عالمي في زراعة الكبد والكلى وعلاج العقم وأطفال الأنابيب.',
      en: 'The first hospital in Turkey awarded JCI accreditation, renowned for pioneering living-donor organ transplantation and cardiovascular surgery.',
      fr: 'Premier hôpital en Turquie certifié JCI, reconnu mondialement pour ses réussites en greffes et cardiologie interventionnelle.',
    },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    specialtiesCount: 30,
  },
  {
    id: 'hosp-4',
    name: {
      ar: 'مستشفيات فلورنس نايتنجيل (Florence Nightingale)',
      en: 'Group Florence Nightingale Hospitals',
      fr: 'Hôpitaux Groupe Florence Nightingale',
    },
    type: {
      ar: 'مراكز التميز الجراحي وأمراض العمود الفقري',
      en: 'Center of Excellence in Spine & Neurosurgery',
      fr: 'Centre d’Excellence en Rachis et Neurochirurgie',
    },
    city: {
      ar: 'إسطنبول (شيشلي وقاديكوي)',
      en: 'Istanbul (Sisli & Kadikoy)',
      fr: 'Istanbul (Sisli & Kadikoy)',
    },
    accreditation: 'JCI Accredited & ISO Certified',
    description: {
      ar: 'مرجع عالمي بارز في جراحات العمود الفقري المعقدة، وجراحات القلب المفتوح وتصحيح انحرافات الظهر (الجنف) بمساعدة الروبوت.',
      en: 'A world-class reference center for complex spine deformity surgery, scoliosis reconstruction, and adult cardiovascular care.',
      fr: 'Centre de référence mondial pour la chirurgie du rachis, la correction de la scoliose et la réhabilitation cardio-vasculaire.',
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    specialtiesCount: 25,
  },
];
