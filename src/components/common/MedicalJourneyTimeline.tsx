'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { InteractivePatientJourney } from '@/components/public/LuxuryPatientHeroAndJourney';

export const MedicalJourneyTimeline: React.FC = () => {
  const { language } = useLanguage();
  return <InteractivePatientJourney locale={language as any} />;
};

