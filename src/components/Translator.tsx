import React, { useState } from 'react';
import { SupportedLanguageCode, LanguageOption, TranslationResponse, ActiveTab } from '../types';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  Trash2,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Headphones,
  FileText,
  Download,
} from 'lucide-react';
import { exportTranslationToPdf } from '../utils/pdfExport';

interface TranslatorProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendToSpeech: (text: string, lang?: string) => void;
  onSendToSimplifier: (text: string) => void;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

export const Translator: React.FC<TranslatorProps> = ({
  inputText,
  setInputText,
  onSendToSpeech,
  onSendToSimplifier,
}) => {
  const { settings } = useAccessibility();
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<SupportedLanguageCode>('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const characterCount = inputText.length;

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setValidationError('Please enter or paste text to translate.');
      return;
    }
    setValidationError(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          targetLanguage: targetLang,
          sourceLanguage: sourceLang === 'auto' ? undefined : sourceLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: TranslationResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Translate error:', err);
      setError(err?.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'auto') {
      // If auto-detect, set source to current target and target to english if target isn't english
      setSourceLang(targetLang);
      setTargetLang(targetLang === 'en' ? 'es' : 'en');
    } else {
      const prevSource = sourceLang as SupportedLanguageCode;
      const prevTarget = targetLang;
      setSourceLang(prevTarget);
      setTargetLang(prevSource);
    }

    if (result?.translatedText) {
      const prevTranslated = result.translatedText;
      setInputText(prevTranslated);
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (!result?.translatedText) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReadAloud = () => {
    if (!result?.translatedText) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    if (!isSpeechSupported()) {
      alert('Your browser does not support Speech Synthesis.');
      return;
    }

    const selectedLangCode = result.targetLanguage || targetLang;
    setIsSpeaking(true);
    speakText(result.translatedText, {
      lang: selectedLangCode,
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
    if (!result?.translatedText) return;
    exportTranslationToPdf({
      originalText: inputText,
      translatedText: result.translatedText,
      targetLanguageName: result.targetLanguageName,
      sourceLanguage: result.sourceLanguage,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
              <Languages className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Multilingual Accessibility Translator
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Break language barriers across English, Hindi, Punjabi, Spanish, French, and Bengali with context preservation.
          </p>
        </div>
      </div>

      {/* Language Selector Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Source Language */}
        <div className="flex-1 space-y-1">
          <label htmlFor="source-lang" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Source Language
          </label>
          <select
            id="source-lang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="auto">Detect Automatically</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center pt-2 sm:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap source and target languages"
            title="Swap Languages"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </button>
        </div>

        {/* Target Language */}
        <div className="flex-1 space-y-1">
          <label htmlFor="target-lang" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Target Language
          </label>
          <select
            id="target-lang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as SupportedLanguageCode)}
            className="w-full rounded-xl border border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/40 px-3 py-2 text-sm font-bold text-violet-950 dark:text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="translate-input" className="text-sm font-bold text-slate-900 dark:text-white">
              Text to Translate
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{characterCount} characters</span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            id="translate-input"
            rows={9}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Type or paste sentences in any language here..."
            className={`w-full rounded-2xl border p-4 text-sm sm:text-base leading-relaxed bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 transition-colors ${
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
            onClick={handleTranslate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold text-base shadow-md hover:shadow-lg transition-all focus-visible:ring-4 focus-visible:ring-violet-300"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Translating with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-violet-200" />
                <span>Translate with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Output Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Translation Result
            </span>
            {result && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-200">
                {result.targetLanguageName}
              </span>
            )}
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Translation Encountered an Error</span>
              </div>
              <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                {error}
              </p>
              <button
                onClick={handleTranslate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Translation</span>
              </button>
            </div>
          ) : result ? (
            <div className="rounded-2xl border border-violet-200 dark:border-violet-900/70 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Target: <strong className="text-violet-700 dark:text-violet-300">{result.targetLanguageName}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy translated text"
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

                  <button
                    onClick={handleReadAloud}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      isSpeaking
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isSpeaking ? 'Stop speech' : 'Read aloud in native language'}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-rose-600' : ''}`} />
                    <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/60 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
                    title="Download translated text as PDF for offline reading"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>

              {/* Translation text */}
              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 leading-relaxed text-base whitespace-pre-line font-normal">
                {result.translatedText}
              </div>

              {/* Cross Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Next steps:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onSendToSpeech(result.translatedText, result.targetLanguage || targetLang)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Listen with Custom Voice</span>
                  </button>

                  <button
                    onClick={() => onSendToSimplifier(result.translatedText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Simplify This Language</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[340px] text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-slate-800 flex items-center justify-center text-violet-500">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Awaiting Translation Input
              </h3>
              <p className="text-xs sm:text-sm max-w-xs leading-relaxed">
                Enter or paste any sentence, select your target language from the top, and click "Translate with AI".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
