'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Website is strictly locked to Luxury Light mode across all viewports (mobile & desktop)
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    // Strip any dark class from documentElement and body
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('avicinna_theme', 'light');
      } catch {
        // Ignore
      }
    }
  }, []);

  const setTheme = (_t: Theme) => {
    // Strictly enforced light mode
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('avicinna_theme', 'light');
      } catch {
        // Ignore
      }
    }
  };

  const toggleTheme = () => {
    // Night mode removed across mobile and desktop per client request
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
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
