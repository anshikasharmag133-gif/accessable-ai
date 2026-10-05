import React from 'react';
import { Eye, X, Heart, Shield, CheckCircle2, Sparkles, Volume2, Languages, FileText } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 to-violet-50/40 dark:from-slate-900 dark:to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="about-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                About AccessAble AI
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand Anything. Access Everything.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close About dialog"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Project Purpose & Mission
            </h3>
            <p>
              Information shouldn't be gated behind impenetrable jargon, dense bureaucratic notices, or complicated textbook prose.
              <strong> AccessAble AI</strong> was created to champion cognitive accessibility for:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs sm:text-sm">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Students tackling hard academic materials</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Readers with Dyslexia, ADHD, or fatigue</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>English & foreign language learners</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Auditory learners who absorb by listening</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Core Capabilities
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-indigo-600 mt-1 shrink-0" />
                <div>
                  <strong>Text Simplification: </strong> Converts complex paragraphs into Simple, Very Simple, or Student-Friendly explanations while preserving facts.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Languages className="w-4 h-4 text-violet-600 mt-1 shrink-0" />
                <div>
                  <strong>Multilingual Translation: </strong> Instant natural translation between English, Hindi, Punjabi, Spanish, French, and Bengali.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Volume2 className="w-4 h-4 text-sky-600 mt-1 shrink-0" />
                <div>
                  <strong>Text-to-Speech (TTS): </strong> Real browser-native voice player with play, pause, resume, stop, and speed adjustments (0.5x – 2.0x).
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                <div>
                  <strong>Explain It Simply: </strong> 3-part structured breakdown (Simple Explanation, Key Points, Real Example) for dense policies or science terms.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Official Disclaimer & Safety</span>
            </div>
            <p>
              AccessAble AI is an assistive comprehension tool powered by generative AI. It does not replace professional medical diagnosis, legal counsel, or official academic accreditation. Always verify critical safety warnings and legal agreements with official authorities.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hackathon & Student Ready
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
