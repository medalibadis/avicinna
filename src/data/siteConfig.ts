export interface SiteConfig {
  brandName: string;
  brandArabic: string;
  contact: {
    phone: string;
    phoneFormatted: string;
    whatsapp: string;
    whatsappMessage: {
      ar: string;
      en: string;
      fr: string;
    };
    email: string;
    address: {
      ar: string;
      en: string;
      fr: string;
    };
    workingHours: {
      ar: string;
      en: string;
      fr: string;
    };
  };
  statistics: {
    patientsCount: string;
    patientsLabel: { ar: string; en: string; fr: string };
    hospitalsCount: string;
    hospitalsLabel: { ar: string; en: string; fr: string };
    specialtiesCount: string;
    specialtiesLabel: { ar: string; en: string; fr: string };
  };
  sectionsVisibility: {
    hero: boolean;
    statistics: boolean;
    quickValues: boolean;
    about: boolean;
    specialties: boolean;
    whyChoose: boolean;
    hospitals: boolean;
    doctors: boolean;
    consultationCta: boolean;
    patientStories: boolean;
    blog: boolean;
    finalCta: boolean;
    footer: boolean;
    whatsappFloating: boolean;
  };
}

export const initialSiteConfig: SiteConfig = {
  brandName: 'AVICINNA',
  brandArabic: 'أفيسينا للرعاية الطبية الدولية',
  contact: {
    phone: '+90 538 492 18 90',
    phoneFormatted: '+90 538 492 18 90',
    whatsapp: '905384921890',
    whatsappMessage: {
      ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
      en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
      fr: 'Bonjour, je souhaite obtenir une consultation médicale gratuite avec l’équipe AVICINNA concernant des soins en Turquie.',
    },
    email: 'contact@avicinna-health.com',
    address: {
      ar: 'إسطنبول، ليفنت / أتاشهير، الجمهورية التركية',
      en: 'Istanbul (Levent & Atasehir), Republic of Turkey',
      fr: 'Istanbul (Levent & Atasehir), République de Turquie',
    },
    workingHours: {
      ar: 'التنسيق والاستشارات الطبية متاح 24 ساعة / 7 أيام',
      en: '24/7 International Patient Coordination',
      fr: 'Coordination internationale disponible 24h/24 et 7j/7',
    },
  },
  statistics: {
    patientsCount: '+2500',
    patientsLabel: {
      ar: 'مريض سعيد',
      en: 'Satisfied Patients',
      fr: 'Patients Satisfaits',
    },
    hospitalsCount: '+15',
    hospitalsLabel: {
      ar: 'مستشفى شريك',
      en: 'Partner Hospitals',
      fr: 'Hôpitaux Partenaires',
    },
    specialtiesCount: '+10',
    specialtiesLabel: {
      ar: 'تخصصات طبية',
      en: 'Medical Specialties',
      fr: 'Spécialités Médicales',
    },
  },
  sectionsVisibility: {
    hero: true,
    statistics: true,
    quickValues: true,
    about: true,
    specialties: true,
    whyChoose: true,
    hospitals: true,
    doctors: true,
    consultationCta: true,
    patientStories: true,
    blog: true,
    finalCta: true,
    footer: true,
    whatsappFloating: true,
  },
};
