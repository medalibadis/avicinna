'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DopamineLanguageSwitcher } from '@/components/ui/DopaminePrimitives';

export const LanguageSwitcher: React.FC<{ isScrolled?: boolean; id?: string }> = ({
  isScrolled = false,
  id = 'default',
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <DopamineLanguageSwitcher
      activeLang={language}
      onChange={setLanguage}
      isScrolled={isScrolled}
      id={id}
    />
  );
};
