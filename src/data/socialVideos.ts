export interface SocialVideo {
  id: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  subtitle?: {
    ar: string;
    en: string;
    fr: string;
  };
  platform: 'instagram' | 'youtube' | 'facebook' | 'tiktok' | 'custom';
  videoUrl: string; // Direct MP4 URL, Instagram Reel, YouTube Shorts, etc.
  videoType: 'link' | 'upload'; // Link from 3rd party or Direct uploaded video
  thumbnailUrl?: string; // Poster thumbnail image
  authorHandle?: string; // e.g. '@avicinna_medical'
  authorUrl?: string; // e.g. 'https://www.instagram.com/avicinna_medical'
  views?: string; // e.g. '48.5K'
  duration?: string; // e.g. '0:58'
  category?: {
    ar: string;
    en: string;
    fr: string;
  };
  rating?: number; // e.g. 5
  featured?: boolean;
  isActive: boolean;
  order: number;
}

export const initialSocialVideos: SocialVideo[] = [
  {
    id: 'reel-1',
    title: {
      ar: 'قصة نجاح واستعادة البسمة مع طاقم أفيسينا في إسطنبول',
      en: 'Patient Success Story & New Smile in Istanbul',
      fr: 'Récit de Réussite et Nouveau Sourire à Istanbul',
    },
    subtitle: {
      ar: 'مرافقة طبية دقيقة من لحظة الوصول حتى انتهاء فترة النقاهة',
      en: 'Comprehensive VIP medical assistance from arrival to full recovery',
      fr: 'Accompagnement VIP complet de l’arrivée au rétablissement',
    },
    platform: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/DfVJRI2uM34/',
    videoType: 'link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    authorHandle: '@avicinna_medical',
    authorUrl: 'https://www.instagram.com/avicinna_medical',
    views: '48.2K',
    duration: '0:58',
    category: {
      ar: 'تجارب المرضى',
      en: 'Patient Stories',
      fr: 'Témoignages',
    },
    rating: 5,
    featured: true,
    isActive: true,
    order: 1,
  },
  {
    id: 'reel-2',
    title: {
      ar: 'استقبال المريض الدولي في المطار بسيارة VIP والانتقال للمستشفى',
      en: 'VIP International Patient Airport Pick-up & Hospital Transfer',
      fr: 'Accueil VIP à l’Aéroport et Transfert Médicalisé',
    },
    subtitle: {
      ar: 'خدمة فندقية راقية ومترجم شخصي مخصص 24/7 طوال الرحلة',
      en: 'Luxury hotel arrangements and 24/7 dedicated personal interpreter',
      fr: 'Hébergement de luxe et interprète personnel 24/7',
    },
    platform: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/DfVJRI2uM34/',
    videoType: 'link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    authorHandle: '@avicinna_medical',
    authorUrl: 'https://www.instagram.com/avicinna_medical',
    views: '32.6K',
    duration: '0:45',
    category: {
      ar: 'خدمات الاستقبال VIP',
      en: 'VIP Concierge',
      fr: 'Accueil VIP',
    },
    rating: 5,
    featured: true,
    isActive: true,
    order: 2,
  },
  {
    id: 'reel-3',
    title: {
      ar: 'استشارة طبية مجانية ودراسة صور الأشعة مع كبار البروفيسورات',
      en: 'Free Medical Consultation & Board Diagnostic Review with Professors',
      fr: 'Consultation Médicale Gratuite et Évaluation avec nos Professeurs',
    },
    subtitle: {
      ar: 'تشخيص دقيق وخطة علاجية واضحة ومفصلة بدون أي التزام مالي',
      en: 'Precise diagnosis and tailored treatment plan with zero obligation',
      fr: 'Diagnostic précis et plan de soins sur-mesure sans engagement',
    },
    platform: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/DfVJRI2uM34/',
    videoType: 'link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
    authorHandle: '@avicinna_medical',
    authorUrl: 'https://www.instagram.com/avicinna_medical',
    views: '29.1K',
    duration: '1:12',
    category: {
      ar: 'استشارة طبية',
      en: 'Free Consultation',
      fr: 'Consultation',
    },
    rating: 5,
    featured: false,
    isActive: true,
    order: 3,
  },
  {
    id: 'reel-4',
    title: {
      ar: 'جراحة الروبوت المتقدمة وغرف العمليات الذكية في مستشفيات تركيا',
      en: 'State-of-the-Art Robotic Surgery & Smart Theaters in Turkey',
      fr: 'Chirurgie Robotique et Blocs Opératoires Intelligents en Turquie',
    },
    subtitle: {
      ar: 'تقنيات الجيل الخامس لاعتماد أعلى نسب أمان وشفاء سريع للمريض',
      en: 'Next-gen surgical precision ensuring top patient safety & recovery',
      fr: 'Précision de pointe pour une sécurité optimale et rétablissement rapide',
    },
    platform: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/DfVJRI2uM34/',
    videoType: 'link',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
    authorHandle: '@avicinna_medical',
    authorUrl: 'https://www.instagram.com/avicinna_medical',
    views: '54.7K',
    duration: '0:50',
    category: {
      ar: 'أحدث التقنيات',
      en: 'Advanced Tech',
      fr: 'Technologies',
    },
    rating: 5,
    featured: false,
    isActive: true,
    order: 4,
  },
];
