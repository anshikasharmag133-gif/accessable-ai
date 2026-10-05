import React from 'react';
import { SAMPLE_TEXTS } from '../data/samples';
import { SampleText, ActiveTab } from '../types';
import { BookOpen, X, ArrowRight, Zap, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface SampleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleText, targetTab?: ActiveTab) => void;
}

export const SampleDemoModal: React.FC<SampleDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-50/60 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sample-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Sample Demonstrations Library
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated examples demonstrating how AccessAble AI reframes dense text into clear formats.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Sample Demonstrations dialog"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div className="px-6 py-3 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Sample Demonstration: </strong> These presets are provided so you can test the AI tools immediately without searching for complex text.
          </span>
        </div>

        {/* Samples List */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {SAMPLE_TEXTS.map((sample) => (
            <div
              key={sample.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    {sample.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sample.title}
                  </h3>
                </div>

                <span className="text-xs text-slate-500">
                  Ideal for: <strong className="capitalize text-slate-700 dark:text-slate-300">{sample.suitableFor}</strong>
                </span>
              </div>

              {/* Original snippet */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Original Text:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  "{sample.original}"
                </p>
              </div>

              {/* Simplified preview if available */}
              {sample.previewSimplified && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Sample Simplified Result:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
                    "{sample.previewSimplified}"
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    onSelectSample(sample, 'simplify');
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load into Simplifier</span>
                </button>

                <button
                  onClick={() => {
                    onSelectSample(sample, 'explain');
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Explain Concept</span>
                </button>

                <button
                  onClick={() => {
                    onSelectSample(sample, 'translate');
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <span>Translate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Clicking any button immediately populates the selected tool.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
