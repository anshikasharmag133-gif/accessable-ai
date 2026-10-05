import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilitySettings, FontScale, FontStyleOption } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (partial: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleDyslexicFont: () => void;
  setFontScale: (scale: FontScale) => void;
  setFontStyle: (font: FontStyleOption) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontScale: 'md',
  fontStyle: 'default',
  highContrast: false,
  darkMode: false,
  dyslexicFont: false,
  reducedMotion: false,
  speechRate: 1.0,
  speechPitch: 1.0,
  preferredVoiceURI: '',
};

const STORAGE_KEY = 'accessable_ai_settings_v1';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Backwards compatibility migration
        if (parsed.dyslexicFont && !parsed.fontStyle) {
          parsed.fontStyle = 'opendyslexic';
        } else if (!parsed.fontStyle) {
          parsed.fontStyle = 'default';
        }
        return { ...defaultSettings, ...parsed };
      }
    } catch {
      // ignore
    }
    // Check system prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        return { ...defaultSettings, reducedMotion: true };
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    const body = document.body;

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font Style Classes (6 options)
    const fontStyleClasses = [
      'font-style-default',
      'font-style-arial',
      'font-style-verdana',
      'font-style-georgia',
      'font-style-opendyslexic',
      'font-style-monospace',
    ];
    body.classList.remove(...fontStyleClasses);
    body.classList.add(`font-style-${settings.fontStyle || 'default'}`);

    // Dyslexic font backward-compatible marker
    if (settings.fontStyle === 'opendyslexic' || settings.dyslexicFont) {
      body.classList.add('dyslexic-font');
    } else {
      body.classList.remove('dyslexic-font');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font scaling
    body.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    body.classList.add(`font-scale-${settings.fontScale}`);
  }, [settings]);

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleDyslexicFont = () => {
    setSettings((prev) => {
      const next = !prev.dyslexicFont;
      return {
        ...prev,
        dyslexicFont: next,
        fontStyle: next ? 'opendyslexic' : 'default',
      };
    });
  };

  const setFontScale = (scale: FontScale) => {
    setSettings((prev) => ({ ...prev, fontScale: scale }));
  };

  const setFontStyle = (font: FontStyleOption) => {
    setSettings((prev) => ({
      ...prev,
      fontStyle: font,
      dyslexicFont: font === 'opendyslexic',
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        toggleDarkMode,
        toggleHighContrast,
        toggleDyslexicFont,
        setFontScale,
        setFontStyle,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
