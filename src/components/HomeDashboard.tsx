import React from 'react';
import { ActiveTab, SampleText } from '../types';
import {
  FileText,
  Languages,
  Volume2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
  BookOpen,
} from 'lucide-react';

interface HomeDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectSample: (sample: SampleText, targetTab?: ActiveTab) => void;
  photosynthesisSample: SampleText;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveTab,
  onSelectSample,
  photosynthesisSample,
}) => {
  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-700/50">
        {/* Soft background accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI-Powered Cognitive Accessibility</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Understand Anything.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-white">
              Access Everything.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-indigo-100/90 leading-relaxed max-w-2xl font-normal">
            AccessAble AI helps students, people with dyslexia or reading difficulties, English learners,
            and auditory listeners comprehend difficult paragraphs, instructions, and notices in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('simplify')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-base shadow-lg hover:bg-indigo-50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-4 focus-visible:ring-white/50"
            >
              <span>Make Text Easier</span>
              <ArrowRight className="w-5 h-5 text-indigo-700" />
            </button>

            <button
              onClick={() => onSelectSample(photosynthesisSample, 'simplify')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-base border border-indigo-400/40 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Try Live Demo Sample</span>
            </button>
          </div>

          {/* Quick reassurance badges */}
          <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-indigo-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Preserves vital facts & dates
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Full browser read-aloud voice
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              6 accessible world languages
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Three Essential Accessibility Capabilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Select any tool to start transforming complex language into clear, friendly formats.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Simplify */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Simplify Text
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Rewrites dense articles, academic jargon, and confusing instructions into plain,
                natural prose. Pick from Simple, Very Simple, or Student-Friendly levels.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('simplify')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch Simplifier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Translate */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Translate Language
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Translate materials between English, Hindi, Punjabi, Spanish, French, and Bengali.
                Maintains context, native script authenticity, and essential instructions.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('translate')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch Translator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Read Aloud */}
          <div className="group relative rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Read Aloud (TTS)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Listen to any text using high-fidelity native speech synthesis. Adjust reading speeds
                from 0.5x to 2.0x, choose voices, and play/pause/resume effortlessly.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('speech')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 group-hover:translate-x-1 transition-transform"
            >
              <span>Open Speech Reader</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Sample Showcase Card */}
      <section className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sample Demonstration: See the Difference
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 self-start sm:self-auto">
            Interactive Sample
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          This sample illustrates how AccessAble AI reframes dense academic scientific prose into crisp, intuitive understanding:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Original */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Original Complex Paragraph
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{photosynthesisSample.original}"
            </p>
          </div>

          {/* Simplified Preview */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Simplified Result
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              "{photosynthesisSample.previewSimplified}"
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Note: This is an illustrative demo. You can test your own custom text anytime!
          </span>
          <button
            onClick={() => onSelectSample(photosynthesisSample, 'simplify')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <span>Load This Into Simplifier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How AccessAble AI Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Three simple, accessible steps to take control of your reading and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Paste or Select Text
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Paste any study chapter, assignment, government notice, legal term, or select one of our built-in samples.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Choose Reading Preference
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pick your target comprehension level (Simple, Very Simple, Student-Friendly), or request a 3-part concept breakdown.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Read, Listen & Translate
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Copy the clear result, listen aloud with adjustable speed, or translate into 6 supported languages instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Callout */}
      <section className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            User Privacy & Data Respect
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            AccessAble AI processes text on-demand without recording personal user accounts.
            To protect your privacy, please avoid pasting sensitive personal identifiers, medical record numbers,
            or confidential passwords.
          </p>
        </div>
      </section>
    </div>
  );
};
