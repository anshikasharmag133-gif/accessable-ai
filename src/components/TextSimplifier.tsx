import React, { useState } from 'react';
import { ReadingLevel, SimplificationResponse, ActiveTab, SampleText } from '../types';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Volume2,
  Trash2,
  RotateCcw,
  Languages,
  Headphones,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Download,
} from 'lucide-react';
import { exportSimplifiedTextToPdf } from '../utils/pdfExport';

interface TextSimplifierProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendToTranslator: (text: string) => void;
  onSendToSpeech: (text: string, lang?: string) => void;
  onOpenSamples: () => void;
}

export const TextSimplifier: React.FC<TextSimplifierProps> = ({
  inputText,
  setInputText,
  onSendToTranslator,
  onSendToSpeech,
  onOpenSamples,
}) => {
  const { settings } = useAccessibility();
  const [level, setLevel] = useState<ReadingLevel>('simple');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimplificationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleSimplify = async () => {
    if (!inputText.trim()) {
      setValidationError('Please enter or paste some text before clicking Simplify.');
      return;
    }
    setValidationError(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, level }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Simplify error:', err);
      setError(err?.message || 'Failed to simplify text. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.simplifiedText) return;
    navigator.clipboard.writeText(result.simplifiedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReadAloud = () => {
    if (!result?.simplifiedText) return;

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
    speakText(result.simplifiedText, {
      lang: 'en',
      rate: settings.speechRate,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleClearInput = () => {
    setInputText('');
    setValidationError(null);
    setError(null);
  };

  const handleClearResult = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    }
    setResult(null);
    setError(null);
  };

  const handleDownloadPdf = () => {
    if (!result?.simplifiedText) return;
    exportSimplifiedTextToPdf({
      originalText: inputText,
      simplifiedText: result.simplifiedText,
      level: result.level,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Text Simplifier
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Transform dense academic, bureaucratic, or technical writing into clear, easy-to-read prose.
          </p>
        </div>

        <button
          onClick={onOpenSamples}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Load Sample Text</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* INPUT COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="simplify-input" className="text-sm font-bold text-slate-900 dark:text-white">
              Original Text to Simplify
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{characterCount} characters</span>
              <span aria-hidden="true">·</span>
              <span>{wordCount} words</span>
              {inputText && (
                <button
                  onClick={handleClearInput}
                  className="text-rose-600 dark:text-rose-400 hover:underline font-semibold ml-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="simplify-input"
              rows={9}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Paste or type any difficult paragraph, assignment, terms of service, or notice here..."
              className={`w-full rounded-2xl border p-4 text-sm sm:text-base leading-relaxed bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 ${
                validationError
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>

          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Reading Level Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Choose Reading Comprehension Level:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Simple */}
              <button
                type="button"
                onClick={() => setLevel('simple')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'simple'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Simple</span>
                  {level === 'simple' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Everyday words & clear natural sentences.
                </p>
              </button>

              {/* Option 2: Very Simple */}
              <button
                type="button"
                onClick={() => setLevel('very-simple')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'very-simple'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Very Simple</span>
                  {level === 'very-simple' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Basic words, short ideas for ESL or young readers.
                </p>
              </button>

              {/* Option 3: Student-Friendly */}
              <button
                type="button"
                onClick={() => setLevel('student-friendly')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  level === 'student-friendly'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Student-Friendly</span>
                  {level === 'student-friendly' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Analogies, clear headings & study bullet points.
                </p>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSimplify}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus-visible:ring-4 focus-visible:ring-indigo-300"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simplifying with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span>Simplify with AI</span>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Simplified Result
            </span>
            {result && (
              <button
                onClick={handleClearResult}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
              >
                Clear Result
              </button>
            )}
          </div>

          {/* Result Card or Empty State */}
          {error ? (
            <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Simplification Failed</span>
              </div>
              <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                {error}
              </p>
              <button
                onClick={handleSimplify}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Request</span>
              </button>
            </div>
          ) : result ? (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  <span>Level: {result.level.replace('-', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-normal">
                    Reduced by {Math.max(0, Math.round(((result.originalLength - result.simplifiedLength) / result.originalLength) * 100))}% length
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy simplified text"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Read Aloud Button */}
                  <button
                    onClick={handleReadAloud}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      isSpeaking
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-rose-600' : ''}`} />
                    <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                  </button>

                  {/* Download as PDF Button */}
                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                    title="Download simplified text as PDF for offline reading"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>

              {/* Simplified Content Display */}
              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 leading-relaxed text-base whitespace-pre-line font-normal">
                {result.simplifiedText}
              </div>

              {/* Cross-Tool Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Take this further:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onSendToTranslator(result.simplifiedText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 text-xs font-bold hover:bg-violet-100 transition-colors"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Translate This</span>
                  </button>

                  <button
                    onClick={() => onSendToSpeech(result.simplifiedText, 'en')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Open in Audio Studio</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[340px] text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Simplified Text Yet
              </h3>
              <p className="text-xs sm:text-sm max-w-xs leading-relaxed">
                Paste difficult paragraphs on the left and click "Simplify with AI". Your accessible, easy-to-read version will appear here.
              </p>
              <button
                onClick={onOpenSamples}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Or try a sample paragraph</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
