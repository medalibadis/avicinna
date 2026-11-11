'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/types/cms';

export type LocalePathsMap = Partial<Record<Locale, string>>;

interface LocaleAlternatesContextValue {
  alternates: LocalePathsMap | null;
  setAlternates: (paths: LocalePathsMap | null) => void;
}

const LocaleAlternatesContext = createContext<LocaleAlternatesContextValue>({
  alternates: null,
  setAlternates: () => {},
});

export function LocaleAlternatesProvider({ children }: { children: React.ReactNode }) {
  const [alternates, setAlternates] = useState<LocalePathsMap | null>(null);
  return (
    <LocaleAlternatesContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </LocaleAlternatesContext.Provider>
  );
}

export function useLocaleAlternates() {
  return useContext(LocaleAlternatesContext);
}

export function RegisterLocaleAlternates({ paths }: { paths: LocalePathsMap }) {
  const { setAlternates } = useLocaleAlternates();
  const serialized = JSON.stringify(paths);

  useEffect(() => {
    setAlternates(paths);
    return () => setAlternates(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, setAlternates]);

  return null;
}

