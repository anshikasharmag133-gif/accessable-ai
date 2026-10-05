import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  FileText,
  Languages,
  Volume2,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Contrast,
  Menu,
  X,
  BookOpen,
  Home,
  Eye,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSamples: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSamples }) => {
  const { settings, toggleDarkMode, toggleHighContrast, toggleDyslexicFont } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'simplify' as ActiveTab, label: 'Simplify Text', icon: FileText },
    { id: 'translate' as ActiveTab, label: 'Translate', icon: Languages },
    { id: 'speech' as ActiveTab, label: 'Read Aloud', icon: Volume2 },
    { id: 'explain' as ActiveTab, label: 'Explain Concept', icon: Sparkles },
    { id: 'settings' as ActiveTab, label: 'Accessibility', icon: Settings },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      {/* Skip to Main Content Link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
              aria-label="AccessAble AI Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    AccessAble<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                  Understand Anything. Access Everything.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Accessibility Quick Tools & Sample button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSamples}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900 transition-colors"
              title="Open sample demonstrations"
              aria-label="Sample Demonstrations"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sample Demos</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              aria-label={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
              title="Toggle High Contrast"
              className={`p-2 rounded-lg border transition-colors ${
                settings.highContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Contrast className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Dyslexia font quick toggle */}
            <button
              onClick={toggleDyslexicFont}
              aria-label={settings.dyslexicFont ? 'Disable Dyslexia-friendly font' : 'Enable Dyslexia-friendly font'}
              title="Toggle Dyslexic-Friendly Font"
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                settings.dyslexicFont
                  ? 'bg-indigo-600 text-white border-indigo-700 font-serif'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <span aria-hidden="true">Aa</span>
              <span className="sr-only">Dyslexic Font</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={settings.darkMode ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 transition-colors"
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="space-y-1 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-semibold ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSamples();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 font-semibold text-sm dark:bg-violet-950 dark:text-violet-300"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Sample Demos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
