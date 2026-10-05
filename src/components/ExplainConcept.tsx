import React, { useState } from 'react';
import { ExplanationResponse, SampleText } from '../types';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Volume2,
  Trash2,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Headphones,
  Download,
} from 'lucide-react';
import { exportExplanationToPdf } from '../utils/pdfExport';

interface ExplainConceptProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendToSpeech: (text: string, lang?: string) => void;
  onOpenSamples: () => void;
}

export const ExplainConcept: React.FC<ExplainConceptProps> = ({
  inputText,
  setInputText,
  onSendToSpeech,
  onOpenSamples,
}) => {
  const { settings } = useAccessibility();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const characterCount = inputText.length;

  const handleExplain = async () => {
    if (!inputText.trim()) {
      setValidationError('Please enter or paste a paragraph, concept, or notice to explain.');
      return;
    }
    setValidationError(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error ${response.status}`);
      }

      const data: ExplanationResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Explain error:', err);
      setError(err?.message || 'Failed to explain concept. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCombinedText = () => {
    if (!result) return '';
    const points = result.keyPoints.map((p, idx) => `${idx + 1}. ${p}`).join('\n');
    return `Simple Explanation:\n${result.simpleExplanation}\n\nKey Points:\n${points}\n\nExample:\n${result.example}\n\nNote: ${result.caution}`;
  };

  const handleCopy = () => {
    const textToCopy = getCombinedText();
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReadAloud = () => {
    const textToRead = getCombinedText();
    if (!textToRead) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    if (!isSpeechSupported()) {
      alert('Your browser does not support Speech Synthesis.');
      return;
    }

    setIsSpeaking(true);
    speakText(textToRead, {
      lang: 'en',
      rate: settings.speechRate,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleClear = () => {
    setInputText('');
    setValidationError(null);
    setError(null);
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    exportExplanationToPdf({
      originalText: inputText,
      explanation: result,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explain It Simply
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Get an intuitive 3-part breakdown: a Plain English Explanation, Essential Key Points, and a Real-World Example.
          </p>
        </div>

        <button
          onClick={onOpenSamples}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Load Difficult Concept</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* INPUT BOX */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="explain-input" className="text-sm font-bold text-slate-900 dark:text-white">
              Complex Paragraph or Concept
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{characterCount} characters</span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            id="explain-input"
            rows={10}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Paste a complex scientific theorem, medical precaution, lease paragraph, or homework challenge..."
            className={`w-full rounded-2xl border p-4 text-sm sm:text-base leading-relaxed bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
              validationError ? 'border-rose-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          />

          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            onClick={handleExplain}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Explaining with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Explain in Plain Language</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT BOX */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              3-Part Accessible Breakdown
            </span>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReadAloud}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isSpeaking
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-rose-600' : ''}`} />
                  <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                </button>

                {/* Download as PDF Button */}
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/60 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                  title="Download explanation as PDF for offline reading"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Failed to Generate Explanation</span>
              </div>
              <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                {error}
              </p>
              <button
                onClick={handleExplain}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Section A: Simple Explanation */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">
                    A
                  </span>
                  <span>Simple Explanation</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
                  {result.simpleExplanation}
                </p>
              </div>

              {/* Section B: Key Points */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">
                    B
                  </span>
                  <span>Key Points ({result.keyPoints.length})</span>
                </div>
                <ul className="space-y-2 pt-1">
                  {result.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section C: Real-World Example */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">
                    C
                  </span>
                  <span>Everyday Example</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  {result.example}
                </p>
              </div>

              {/* Caution & Uncertainty Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Caution: </strong>
                  {result.caution}
                </div>
              </div>

              {/* Send to Speech */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onSendToSpeech(getCombinedText(), 'en')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Send Explanation to Audio Reader</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[340px] text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Ready to Explain
              </h3>
              <p className="text-xs sm:text-sm max-w-xs leading-relaxed">
                Paste any difficult paragraph, policy excerpt, or educational concept to receive a structured 3-part breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
