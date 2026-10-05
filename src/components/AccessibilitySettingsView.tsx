import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { FontScale, FontStyleOption } from '../types';
import {
  Settings,
  Type,
  Contrast,
  Sun,
  Moon,
  RotateCcw,
  Check,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';

interface FontOptionData {
  id: FontStyleOption;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  preview: string;
  previewClass: string;
}

const FONT_OPTIONS: FontOptionData[] = [
  {
    id: 'default',
    name: 'Default / System Sans',
    badge: 'Standard UI',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    desc: 'Modern, balanced sans-serif optimized for crisp rendering across all screen sizes.',
    preview: 'Understand Anything. Access Everything.',
    previewClass: 'preview-font-default',
  },
  {
    id: 'arial',
    name: 'Arial',
    badge: 'Universal Sans',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    desc: 'Standardized neo-grotesque sans-serif with neutral proportions and predictable curves.',
    preview: 'Clear, direct reading with uniform stroke weights.',
    previewClass: 'preview-font-arial',
  },
  {
    id: 'verdana',
    name: 'Verdana',
    badge: 'Screen Optimized',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    desc: 'Wide apertures and large x-height, engineered specifically for high screen legibility.',
    preview: 'Spacious letter spacing prevents eye fatigue.',
    previewClass: 'preview-font-verdana',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    badge: 'High-Legibility Serif',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    desc: 'Warm, open-counter serif designed for comfortable reading during extended focus.',
    preview: 'Distinctive serifs guide the eye along sentences.',
    previewClass: 'preview-font-georgia',
  },
  {
    id: 'opendyslexic',
    name: 'OpenDyslexic',
    badge: 'Dyslexia Support',
    badgeColor: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    desc: 'Weighted bottom-heavy letterforms that anchor characters to counter letter flipping.',
    preview: 'Gravity-weighted bottoms reduce reading confusion.',
    previewClass: 'preview-font-opendyslexic',
  },
  {
    id: 'monospace',
    name: 'Monospace',
    badge: 'Fixed Width',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    desc: 'Equal glyph width providing distinct shapes for numbers and easily confused characters.',
    preview: 'Distinct glyphs for 0/O, 1/l/I, and punctuation.',
    previewClass: 'preview-font-monospace',
  },
];

export const AccessibilitySettingsView: React.FC = () => {
  const {
    settings,
    setFontScale,
    setFontStyle,
    toggleDarkMode,
    toggleHighContrast,
    updateSettings,
    resetSettings,
  } = useAccessibility();

  const fontSizes: { id: FontScale; label: string; desc: string; sizeClass: string }[] = [
    { id: 'sm', label: 'Small', desc: 'Compact (14px)', sizeClass: 'text-sm' },
    { id: 'md', label: 'Medium', desc: 'Default (16px)', sizeClass: 'text-base' },
    { id: 'lg', label: 'Large', desc: 'Comfortable (18px)', sizeClass: 'text-lg' },
    { id: 'xl', label: 'Extra Large', desc: 'Maximum Readability (20px)', sizeClass: 'text-xl' },
  ];

  const currentFontData = FONT_OPTIONS.find((f) => f.id === settings.fontStyle) || FONT_OPTIONS[0];

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Accessibility & Display Settings
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize typography, font styles, text sizing, contrast, and visual comfort. Your preferences save automatically in your browser.
        </p>
      </div>

      {/* Live Preview Box */}
      <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 p-6 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            Live Accessibility Preview
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200">
              Font: {currentFontData.name}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Size: {settings.fontScale.toUpperCase()}
            </span>
            {settings.highContrast && (
              <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-extrabold">
                High Contrast
              </span>
            )}
          </div>
        </div>

        <p className="leading-relaxed text-slate-800 dark:text-slate-100 font-normal text-base sm:text-lg">
          "Accessible typography allows every person, regardless of visual acuity, neurodiversity, or reading speed, to independently explore, understand, and enjoy written ideas."
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-100/60 dark:border-indigo-900/40">
          Sample phrase: 0123456789 — The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* SETTINGS GROUPS */}
      <div className="space-y-8">
        {/* 1. Font Style Selection (6 Distinct Choices) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Font Family & Typography Style
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a font engineered for your reading preference. Changes apply immediately across the entire app.
                </p>
              </div>
            </div>

            {/* Quick dropdown for fast switching */}
            <div className="sm:self-auto self-start">
              <label htmlFor="font-quick-select" className="sr-only">Choose font family</label>
              <select
                id="font-quick-select"
                value={settings.fontStyle}
                onChange={(e) => setFontStyle(e.target.value as FontStyleOption)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6 Selectable Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {FONT_OPTIONS.map((font) => {
              const isSelected = settings.fontStyle === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setFontStyle(font.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/70 dark:border-indigo-400 ring-2 ring-indigo-500/25 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-base font-bold text-slate-900 dark:text-white ${font.previewClass}`}>
                        {font.name}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                    </div>

                    <div className="inline-block">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${font.badgeColor}`}>
                        {font.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-0.5">
                      {font.desc}
                    </p>
                  </div>

                  {/* Visual typography sample */}
                  <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 ${font.previewClass}`}>
                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1 italic">
                      "{font.preview}"
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size Scaling */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reading Text Size
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scale text across all simplifier, translator, and explanation panels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fontSizes.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontScale(f.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  settings.fontScale === f.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-slate-900 dark:text-white ${f.sizeClass}`}>
                    {f.label}
                  </span>
                  {settings.fontScale === f.id && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                  {f.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Contrast & Motion Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Contrast Mode */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  High Contrast
                </h3>
                <Contrast className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Heightens contrast with thick borders and high-visibility accents for low-vision readers.
              </p>
            </div>

            <button
              onClick={toggleHighContrast}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                settings.highContrast
                  ? 'bg-black text-yellow-300 border-yellow-300 shadow-md ring-2 ring-yellow-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Contrast className="w-3.5 h-3.5" />
              <span>{settings.highContrast ? 'High Contrast Active' : 'Enable High Contrast'}</span>
            </button>
          </div>

          {/* Color Theme (Light / Dark) */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Color Theme
                </h3>
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Switch between soft light mode or an eye-strain-reducing indigo-slate dark theme.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ darkMode: false })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !settings.darkMode
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ darkMode: true })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  settings.darkMode
                    ? 'bg-indigo-950 border-indigo-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reduced Motion
                </h3>
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Minimizes screen animations, transitions, and pulsing effects for vestibular comfort.
              </p>
            </div>

            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                settings.reducedMotion
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{settings.reducedMotion ? 'Reduced Motion Active' : 'Enable Reduced Motion'}</span>
            </button>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Preferences are saved in your local browser storage and do not track personal identifying information.
          </p>

          <button
            onClick={resetSettings}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
