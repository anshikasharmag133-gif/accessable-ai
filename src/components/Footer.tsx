import React from 'react';
import { ActiveTab } from '../types';
import { Shield, Sparkles, Heart, Eye } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAbout }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-colors text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                AccessAble<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Empowering students, neurodivergent readers, English-language learners, and audio listeners
              to break down complicated language into clear, manageable, and accessible information.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Designed with WCAG AA accessibility principles</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('simplify')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Text Simplifier
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('translate')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Multilingual Translator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('speech')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Read Aloud (TTS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('explain')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Explain Concept
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Accessibility Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Project */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  About AccessAble AI
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Powered by Gemini 3.8 Flash</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Note & Medical/Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Privacy & Important Notice: </strong>
              Users should avoid submitting sensitive personal information, passwords, or confidential records.
              AI-generated content can contain inaccuracies or omit subtle conditions; always verify important legal,
              medical, academic, or financial documents with certified sources.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-2">
            <p>© {new Date().getFullYear()} AccessAble AI. Understand Anything. Access Everything.</p>
            <p className="mt-1 sm:mt-0">Inclusive Design · Keyboard Accessible · High-Contrast Ready</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
