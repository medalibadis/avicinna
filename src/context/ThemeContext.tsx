'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (forced?: Theme) => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'avicinna_admin_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Synchronize theme on mount and route change
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    try {
      const saved = (localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('avicinna_theme')) as Theme | null;
      if (isAdmin) {
        if (saved === 'dark') {
          setThemeState('dark');
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          setThemeState('light');
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      } else {
        // Public website remains clean and luxury daylight mode
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        setThemeState('light');
      }
    } catch {
      // Ignore storage errors in restricted iframes/browsers
    }
  }, [isAdmin, pathname]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        localStorage.setItem('avicinna_theme', newTheme);
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  const toggleTheme = useCallback((forced?: Theme) => {
    setThemeState((currentTheme) => {
      const nextTheme = forced ? forced : currentTheme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
          localStorage.setItem('avicinna_theme', nextTheme);
        } catch {
          // Ignore storage errors
        }
      }
      return nextTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
