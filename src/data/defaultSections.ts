import type {
  InquiryAttachment,
  InquiryInternalNote,
  InquiryNotificationLog,
  Locale,
} from '@/types/cms';

export interface ConsultationInquiry {
  id: string;
  trackingId: string;
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  specialty?: string;
  notes?: string;
  language?: Locale;
  sourceUrl?: string;
  assignedTo?: string;
  assignedName?: string;
  internalNotes?: InquiryInternalNote[];
  attachments?: InquiryAttachment[];
  notificationLog?: InquiryNotificationLog[];
  createdAt: string;
  updatedAt?: string;
  status: 'new' | 'in_review' | 'contacted' | 'scheduled';
}

export interface SiteSectionsData {
  hero: {
    eyebrow: { ar: string; en: string; fr: string };
    headlinePart1: { ar: string; en: string; fr: string };
    headlineHighlight: { ar: string; en: string; fr: string };
    headlinePart2: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
    backgroundImage?: string;
  };
  stats: {
    patientsCount: string;
    patientsLabel: { ar: string; en: string; fr: string };
    hospitalsCount: string;
    hospitalsLabel: { ar: string; en: string; fr: string };
    experienceCount: string;
    experienceLabel: { ar: string; en: string; fr: string };
    satisfactionRate: string;
    satisfactionLabel: { ar: string; en: string; fr: string };
  };
  about: {
    badge: { ar: string; en: string; fr: string };
    heading: { ar: string; en: string; fr: string };
    lead: { ar: string; en: string; fr: string };
  };
  whyChoose: {
    badge: { ar: string; en: string; fr: string };
    title: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
    whatsappNumber: string;
    cards?: Array<{
      title: { ar: string; en: string; fr: string };
      desc: { ar: string; en: string; fr: string };
    }>;
    visualTitle?: { ar: string; en: string; fr: string };
    visualDesc?: { ar: string; en: string; fr: string };
    visualImage?: string;
  };
  finalCta: {
    title: { ar: string; en: string; fr: string };
    subtitle: { ar: string; en: string; fr: string };
    phone: string;
  };
}

export const defaultSections: SiteSectionsData = {
  hero: {
    eyebrow: {
      ar: 'وجهتكم الأولى للرعاية الصحية المتقدمة في إسطنبول',
      en: 'Your Premier Destination for Advanced Healthcare in Istanbul',
      fr: 'Votre Destination d’Excellence Médicale à Istanbul',
    },
    headlinePart1: {
      ar: 'أفضل المستشفيات وأشهر الأطباء في تركيا',
      en: 'Turkey’s Leading Hospitals & Renowned Specialists',
      fr: 'Les Meilleurs Hôpitaux et Chirurgiens Réputés de Turquie',
    },
    headlineHighlight: {
      ar: 'لرعايتكم الصحية',
      en: 'For Your Health & Care',
      fr: 'Pour Votre Santé',
    },
    headlinePart2: {
      ar: '',
      en: '',
      fr: '',
    },
    subtitle: {
      ar: 'نربطكم بأعلى المستشفيات المعتمدة دولياً (JCI) ونخبة الجراحين الاستشاريين في تركيا، مع مرافقة علاجية ولوجستية شاملة واستشارة مجانية فورية.',
      en: 'Connecting you with JCI-accredited medical facilities and elite board-certified professors in Istanbul, supported by seamless end-to-end concierge services.',
      fr: 'Nous vous relions aux centres hospitaliers accrédités JCI et aux chirurgiens les plus réputés de Turquie avec un accompagnement complet et une assistance 24/7.',
    },
    backgroundImage: '/images/hospitals/memorial-bahcelievler.jpg',
  },
  stats: {
    patientsCount: '+2,500',
    patientsLabel: {
      ar: 'مريض دولي تلقوا العلاج بنجاح',
      en: 'International Patients Successfully Treated',
      fr: 'Patients Internationaux Soignés avec Succès',
    },
    hospitalsCount: '+15',
    hospitalsLabel: {
      ar: 'مستشفى معتمد دولياً (JCI)',
      en: 'JCI-Accredited Partner Hospitals',
      fr: 'Hôpitaux Partenaires Accrédités JCI',
    },
    experienceCount: '+10',
    experienceLabel: {
      ar: 'سنوات من الريادة في السياحة العلاجية',
      en: 'Years of Excellence in Medical Tourism',
      fr: 'Années d’Excellence en Tourisme Médical',
    },
    satisfactionRate: '98.4%',
    satisfactionLabel: {
      ar: 'نسبة رضا المرضى والنتائج الإيجابية',
      en: 'Clinical Success & Satisfaction Rate',
      fr: 'Taux de Satisfaction et Réussite Clinique',
    },
  },
  about: {
    badge: {
      ar: 'خبرة تمتد لأكثر من عقد كامل',
      en: 'Over a Decade of Medical Excellence',
      fr: 'Plus d’une Décennie d’Excellence Médicale',
    },
    heading: {
      ar: 'ريادة طبية بمعايير عالمية في قلب إسطنبول',
      en: 'World-Class Healthcare Standards in the Heart of Istanbul',
      fr: 'Excellence Médicale aux Normes Internationales à Istanbul',
    },
    lead: {
      ar: 'تأسست منصة AVICINNA لتكون الجسر الموثوق الذي يربط المرضى من كافة أنحاء العالم بأفضل الكفاءات الطبية والمستشفيات التخصصية المعتمدة في تركيا.',
      en: 'AVICINNA was founded as a trusted international healthcare bridge connecting global patients with top-tier accredited medical centers and distinguished specialists in Turkey.',
      fr: 'AVICINNA est née d’une mission claire : offrir aux patients du monde entier un accès direct et privilégié aux meilleurs spécialistes et hôpitaux de pointe en Turquie.',
    },
  },
  whyChoose: {
    badge: {
      ar: 'لماذا يختار المرضى AVICINNA؟',
      en: 'Why Choose AVICINNA?',
      fr: 'Pourquoi choisir AVICINNA ?',
    },
    title: {
      ar: 'خدمات متكاملة لخطوتك نحو الشفاء',
      en: 'Comprehensive Services for Your Healing Journey',
      fr: 'Des services complets pour votre parcours de guérison',
    },
    subtitle: {
      ar: 'نقدم حلولاً علاجية شاملة تزيل عنك عبء التنظيم والترجمة، لنضمن لك تركيزاً كاملاً على صحتك وراحتك.',
      en: 'We eliminate the complexity of traveling abroad for treatment, handling all medical and logistical details.',
      fr: 'Nous éliminons la complexité d’un voyage médical à l’étranger en gérant tous les aspects médicaux et logistiques.',
    },
    whatsappNumber: '+90 544 282 27 69',
    visualImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop',
    visualTitle: {
      ar: 'فريق طبي متعدد اللغات',
      en: 'Multilingual Medical Board',
      fr: 'Équipe Médicale Polyglotte',
    },
    visualDesc: {
      ar: 'نرافقك باللغات العربية، الإنجليزية والفرنسية في كل خطوة.',
      en: 'Personal medical translators supporting you in Arabic, English, and French.',
      fr: 'Interprètes médicaux dédiés vous accompagnant en français, arabe et anglais à chaque étape.',
    },
    cards: [
      {
        title: {
          ar: 'استشارة مجانية ودراسة ملفك',
          en: 'Free Consultation & Case Study',
          fr: 'Consultation et étude de dossier gratuites',
        },
        desc: {
          ar: 'يقوم أطباؤنا الاستشاريون بدراسة تقاريرك وصورك الشعاعية وتقديم خطة علاجية مفصلة مع التكلفة المتوقعة مسبقاً دون أي التزام.',
          en: 'Our medical board reviews your medical records, scans, and prepares an honest treatment plan and quote without obligation.',
          fr: 'Nos spécialistes examinent vos rapports et radiographies pour établir un plan thérapeutique précis sans engagement.',
        },
      },
      {
        title: {
          ar: 'أفضل المستشفيات والمراكز التخصصية',
          en: 'Top-Tier Partner Hospitals',
          fr: 'Hôpitaux d’excellence partenaires',
        },
        desc: {
          ar: 'الوصول المباشر إلى مستشفيات كبرى مجهزة بأعلى تصنيفات السلامة العالمية مثل مستشفيات أجيبادم ومستشفيات أفيسينا الدولية.',
          en: 'Direct access to premier health systems like Acibadem Istanbul and Avicenna International Hospitals.',
          fr: 'Accès direct aux réseaux prestigieux tels qu’Acibadem Istanbul et les hôpitaux internationaux Avicenna.',
        },
      },
      {
        title: {
          ar: 'دعم كامل وإقامة فاخرة',
          en: 'Full Support & Luxury Accommodations',
          fr: 'Assistance complète et séjour de luxe',
        },
        desc: {
          ar: 'حجز أجنحة فندقية 5 نجوم مجهزة للمرضى ومرافقيهم مع سيارات استقبال وتوديع خاصة على مدار الساعة.',
          en: 'Stay in selected 5-star partner hotels with private round-the-clock airport and hospital transfers.',
          fr: 'Hébergement dans des hôtels 5 étoiles partenaires avec transferts VIP privés 24h/24.',
        },
      },
      {
        title: {
          ar: 'تواصل واستجابة فورية 24/7',
          en: 'Instant 24/7 Communication',
          fr: 'Communication instantanée 24/7',
        },
        desc: {
          ar: 'منسق طبي مخصص يجيب على استفساراتك فوراً بلغتك الأم عبر واتساب والهاتف في أي وقت.',
          en: 'A dedicated coordinator answers all your questions in your preferred language via WhatsApp and phone.',
          fr: 'Un coordinateur dédié répond à toutes vos questions en français via WhatsApp et téléphone.',
        },
      },
    ],
  },
  finalCta: {
    title: {
      ar: 'ابدأ رحلتك نحو الشفاء اليوم مع أفضل أطباء تركيا',
      en: 'Begin Your Path to Recovery Today with Turkey’s Leading Medical Faculty',
      fr: 'Commencez Votre Rétablissement Aujourd’hui avec les Meilleurs Spécialistes',
    },
    subtitle: {
      ar: 'فريقنا الطبي جاهز لمراجعة تقاريرك وتقديم استشارة مجانية مع خطة علاجية مخصصة وعرض سعر شامل خلال 24 ساعة.',
      en: 'Our clinical coordination board is ready to review your medical reports and deliver a comprehensive all-inclusive proposal within 24 hours.',
      fr: 'Notre équipe médicale étudie vos examens pour vous délivrer un plan de soins personnalisé et un devis complet sous 24 heures.',
    },
    phone: '+90 544 282 27 69',
  },
};

export function mergeSectionsWithDefaults(
  raw?: Partial<SiteSectionsData> | null
): SiteSectionsData {
  if (!raw) return defaultSections;
  return {
    hero: {
      ...defaultSections.hero,
      ...(raw.hero || {}),
      backgroundImage: raw.hero?.backgroundImage?.trim() || defaultSections.hero.backgroundImage,
    },
    stats: {
      ...defaultSections.stats,
      ...(raw.stats || {}),
    },
    about: {
      ...defaultSections.about,
      ...(raw.about || {}),
    },
    whyChoose: {
      ...defaultSections.whyChoose,
      ...(raw.whyChoose || {}),
      cards:
        Array.isArray(raw.whyChoose?.cards) && raw.whyChoose.cards.length > 0
          ? raw.whyChoose.cards.map((card, i) => ({
              title: {
                ...(defaultSections.whyChoose.cards?.[i]?.title || { ar: '', en: '', fr: '' }),
                ...(card?.title || {}),
              },
              desc: {
                ...(defaultSections.whyChoose.cards?.[i]?.desc || { ar: '', en: '', fr: '' }),
                ...(card?.desc || {}),
              },
            }))
          : defaultSections.whyChoose.cards,
      visualTitle: {
        ...defaultSections.whyChoose.visualTitle!,
        ...(raw.whyChoose?.visualTitle || {}),
      },
      visualDesc: {
        ...defaultSections.whyChoose.visualDesc!,
        ...(raw.whyChoose?.visualDesc || {}),
      },
      visualImage: raw.whyChoose?.visualImage?.trim() || defaultSections.whyChoose.visualImage,
    },
    finalCta: {
      ...defaultSections.finalCta,
      ...(raw.finalCta || {}),
    },
  };
}

