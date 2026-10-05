import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  isSpeechSupported,
  getAvailableVoices,
  speakText,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
  findVoiceForLanguage,
  getVoicesForLanguage,
  SUPPORTED_SPEECH_LANGUAGES,
} from '../utils/speech';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Volume2,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Trash2,
  BookOpen,
  Edit3,
  Highlighter,
} from 'lucide-react';

interface TtsReaderProps {
  initialText: string;
  initialLanguage?: string;
  onOpenSamples: () => void;
}

export const TtsReader: React.FC<TtsReaderProps> = ({
  initialText,
  initialLanguage,
  onOpenSamples,
}) => {
  const { settings, updateSettings } = useAccessibility();
  const [text, setText] = useState(initialText || '');
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage || 'en');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(settings.speechRate || 1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(settings.speechPitch ?? 1.0);
  const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Word-level progress tracking
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [viewMode, setViewMode] = useState<'edit' | 'read-along'>('edit');
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // Split current text into an array of words
  const words = useMemo(() => {
    if (!text || !text.trim()) return [];
    return text.trim().split(/\s+/);
  }, [text]);

  // Compute character start offsets for each word in text.trim()
  const wordOffsets = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed || words.length === 0) return [];

    const offsets: number[] = [];
    let searchPos = 0;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const found = trimmed.indexOf(w, searchPos);
      if (found !== -1) {
        offsets.push(found);
        searchPos = found + w.length;
      } else {
        offsets.push(searchPos);
      }
    }
    return offsets;
  }, [text, words]);

  // Auto-scroll the active highlighted word into view smoothly
  useEffect(() => {
    if (activeWordRef.current && currentWordIndex >= 0) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentWordIndex]);

  const findWordIndexAtChar = (charIndex: number): number => {
    if (words.length === 0 || wordOffsets.length === 0) return -1;
    for (let i = wordOffsets.length - 1; i >= 0; i--) {
      if (charIndex >= wordOffsets[i]) {
        return i;
      }
    }
    return 0;
  };

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      setCurrentWordIndex(-1);
    }
  }, [initialText]);

  useEffect(() => {
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
      const fresh = isSpeechSupported() ? window.speechSynthesis.getVoices() : [];
      if (fresh.length > 0) {
        const match = findVoiceForLanguage(fresh, initialLanguage);
        if (match) {
          setSelectedVoiceURI(match.voiceURI);
        }
      }
    }
  }, [initialLanguage]);

  useEffect(() => {
    const isAvail = isSpeechSupported();
    setSupported(isAvail);

    if (isAvail) {
      getAvailableVoices().then((loadedVoices) => {
        setVoices(loadedVoices);
        if (loadedVoices.length > 0) {
          const targetLang = initialLanguage || selectedLanguage || 'en';
          const match = findVoiceForLanguage(loadedVoices, targetLang);
          if (match) {
            setSelectedVoiceURI(match.voiceURI);
          } else {
            const enVoice = loadedVoices.find((v) => v.lang.startsWith('en'));
            setSelectedVoiceURI((enVoice || loadedVoices[0]).voiceURI);
          }
        }
      });
    }

    return () => {
      stopSpeech();
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const fresh = isSpeechSupported() ? window.speechSynthesis.getVoices() : voices;
    if (fresh.length > 0 && fresh.length !== voices.length) {
      setVoices(fresh);
    }

    if (langCode === 'all') {
      if (fresh.length > 0 && !fresh.some((v) => v.voiceURI === selectedVoiceURI)) {
        setSelectedVoiceURI(fresh[0].voiceURI);
      }
    } else {
      const match = findVoiceForLanguage(fresh, langCode);
      if (match) {
        setSelectedVoiceURI(match.voiceURI);
        updateSettings({ preferredVoiceURI: match.voiceURI });
      } else {
        setSelectedVoiceURI('');
      }
    }

    if (playbackState === 'playing') {
      handleStop();
    }
  };

  const handlePlay = (startFromIndex?: number) => {
    if (!text.trim()) {
      setErrorMessage('Please enter or paste text to read aloud.');
      return;
    }
    setErrorMessage(null);

    // Refresh voices before speaking
    const fresh = isSpeechSupported() ? window.speechSynthesis.getVoices() : voices;
    if (fresh.length > 0 && fresh.length !== voices.length) {
      setVoices(fresh);
    }

    const voice = fresh.find((v) => v.voiceURI === selectedVoiceURI) || null;

    const startIndex = typeof startFromIndex === 'number' && startFromIndex >= 0 ? startFromIndex : 0;
    const charOffset = wordOffsets[startIndex] || 0;
    const textToSpeak = text.trim().slice(charOffset);

    setCurrentWordIndex(startIndex);

    const started = speakText(textToSpeak, {
      voice,
      lang: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => {
        setPlaybackState('playing');
        setCurrentWordIndex(startIndex);
      },
      onEnd: () => {
        setPlaybackState('stopped');
        setCurrentWordIndex(-1);
      },
      onPause: () => setPlaybackState('paused'),
      onResume: () => setPlaybackState('playing'),
      onBoundary: (charIndex: number) => {
        const absoluteCharIndex = charOffset + charIndex;
        const matchedIndex = findWordIndexAtChar(absoluteCharIndex);
        if (matchedIndex !== -1) {
          setCurrentWordIndex(matchedIndex);
        }
      },
      onError: (err) => {
        console.error('Speech error:', err);
        setPlaybackState('stopped');
        setCurrentWordIndex(-1);
        setErrorMessage('Speech playback encountered an error. Click play again to retry.');
      },
    });

    if (started) {
      setPlaybackState('playing');
    }
  };

  const handlePause = () => {
    pauseSpeech();
    setPlaybackState('paused');
  };

  const handleResume = () => {
    resumeSpeech();
    setPlaybackState('playing');
  };

  const handleStop = () => {
    stopSpeech();
    setPlaybackState('stopped');
    setCurrentWordIndex(-1);
  };

  const handleWordClick = (index: number) => {
    if (index >= 0 && index < words.length) {
      handleStop();
      setTimeout(() => handlePlay(index), 50);
    }
  };

  const handleSpeedPreset = (speed: number) => {
    setSpeechRate(speed);
    updateSettings({ speechRate: speed });
    if (playbackState === 'playing') {
      const resumeFrom = currentWordIndex >= 0 ? currentWordIndex : 0;
      handleStop();
      setTimeout(() => handlePlay(resumeFrom), 100);
    }
  };

  const handlePitchPreset = (pitch: number) => {
    setSpeechPitch(pitch);
    updateSettings({ speechPitch: pitch });
    if (playbackState === 'playing') {
      const resumeFrom = currentWordIndex >= 0 ? currentWordIndex : 0;
      handleStop();
      setTimeout(() => handlePlay(resumeFrom), 100);
    }
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    updateSettings({ preferredVoiceURI: uri });
    if (playbackState === 'playing') {
      const resumeFrom = currentWordIndex >= 0 ? currentWordIndex : 0;
      handleStop();
      setTimeout(() => handlePlay(resumeFrom), 100);
    }
  };

  const filteredVoices = selectedLanguage === 'all'
    ? voices
    : getVoicesForLanguage(voices, selectedLanguage);

  const selectedLangObj = SUPPORTED_SPEECH_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Text-to-Speech Reader
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Listen to articles, notes, or simplified summaries with natural voice synthesis, real-time word highlighting, and customizable speed & pitch.
          </p>
        </div>

        <button
          onClick={onOpenSamples}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold hover:bg-sky-100 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Load Audio Sample</span>
        </button>
      </div>

      {/* Unsupported Browser Alert */}
      {!supported && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <strong className="font-bold">Speech Synthesis API Unavailable: </strong>
            Your current web browser environment does not support or grant permission to the Web Speech API.
            For full audio support, please use Google Chrome, Edge, Safari, or Firefox on a desktop or mobile device.
          </div>
        </div>
      )}

      {/* Main Player Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Text Area / Word-Level Highlighting Workspace */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <label htmlFor="tts-input" className="text-sm font-bold text-slate-900 dark:text-white">
                Text to Read Aloud
              </label>

              {/* View Switcher: Edit Text vs Read-Along */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    viewMode === 'edit'
                      ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label="Edit text mode"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('read-along')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    viewMode === 'read-along'
                      ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label="Read along word highlighting view"
                >
                  <Highlighter className="w-3 h-3 text-amber-500" />
                  <span>Read-Along View</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              {currentWordIndex >= 0 && (
                <span className="font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Word {currentWordIndex + 1} of {words.length}
                </span>
              )}
              <span>{words.length} words · {text.length} chars</span>
              {text && (
                <button
                  onClick={() => {
                    handleStop();
                    setText('');
                  }}
                  className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* View Container */}
          {viewMode === 'edit' ? (
            <div className="space-y-3">
              <textarea
                id="tts-input"
                rows={8}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCurrentWordIndex(-1);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Paste text here or transfer from Simplifier/Translator to listen..."
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4 text-base leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {/* Real-time word-level highlight strip below textarea when speaking in edit mode */}
              {(playbackState === 'playing' || playbackState === 'paused' || currentWordIndex >= 0) && words.length > 0 && (
                <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-slate-800/80 border border-sky-200 dark:border-sky-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
                    <span className="flex items-center gap-1.5">
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      Live Word Read-Out:
                    </span>
                    <button
                      onClick={() => setViewMode('read-along')}
                      className="text-sky-600 dark:text-sky-400 hover:underline text-[11px]"
                    >
                      Expand to Full Read-Along View &rarr;
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto leading-relaxed text-base sm:text-lg flex flex-wrap gap-1 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-700">
                    {words.map((word, index) => {
                      const isHighlighted = currentWordIndex === index;
                      return (
                        <span
                          key={index}
                          ref={isHighlighted ? activeWordRef : null}
                          onClick={() => handleWordClick(index)}
                          className={`inline-block transition-all duration-100 rounded px-1.5 py-0.5 cursor-pointer ${
                            isHighlighted
                              ? 'highlight ring-2 ring-amber-400/80'
                              : index < currentWordIndex && currentWordIndex >= 0
                              ? 'text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                          title="Click to jump and read from this word"
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Full Read-Along / Word-Highlighting Display */
            <div className="rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-gradient-to-b from-sky-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-5 sm:p-6 min-h-[220px] max-h-[380px] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-sky-100 dark:border-slate-800 pb-2">
                <span className="font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                  Read-Along Mode · Click any word to jump playback there
                </span>
                <span>
                  {playbackState === 'playing' ? 'Speaking...' : playbackState === 'paused' ? 'Paused' : 'Ready'}
                </span>
              </div>

              {words.length === 0 ? (
                <p className="text-slate-400 italic text-sm py-8 text-center">
                  No text to read. Switch to "Edit" to type or paste words.
                </p>
              ) : (
                <div className="leading-loose text-lg sm:text-xl font-normal flex flex-wrap gap-1.5 tracking-normal">
                  {words.map((word, index) => {
                    const isHighlighted = currentWordIndex === index;
                    return (
                      <span
                        key={index}
                        ref={isHighlighted ? activeWordRef : null}
                        onClick={() => handleWordClick(index)}
                        className={`inline-block transition-all duration-100 rounded px-1.5 py-0.5 cursor-pointer ${
                          isHighlighted
                            ? 'highlight ring-2 ring-amber-400/80'
                            : index < currentWordIndex && currentWordIndex >= 0
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-sky-100/70 dark:hover:bg-slate-800'
                        }`}
                        title="Click to jump and read from this word"
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Playback Controls & Status */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/40 to-slate-50 dark:from-slate-800 dark:via-indigo-950/30 dark:to-slate-800 border border-sky-100 dark:border-slate-700 space-y-6">
          {/* Main Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {playbackState === 'playing' ? (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </button>
              ) : playbackState === 'paused' ? (
                <button
                  onClick={handleResume}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={() => handlePlay()}
                  disabled={!supported || !text.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play Speech</span>
                </button>
              )}

              <button
                onClick={handleStop}
                disabled={playbackState === 'stopped'}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
                title="Stop Speech"
              >
                <Square className="w-4 h-4 fill-current text-rose-500" />
                <span>Stop</span>
              </button>
            </div>

            {/* Speaking Status Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  playbackState === 'playing'
                    ? 'bg-emerald-500 animate-ping'
                    : playbackState === 'paused'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="capitalize">
                {playbackState === 'playing'
                  ? `Speaking in ${selectedLangObj?.name || 'Selected Voice'}...`
                  : playbackState === 'paused'
                  ? 'Paused'
                  : 'Ready to listen'}
              </span>
            </div>
          </div>

          {/* Voice, Language, Speed & Pitch Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-sky-100 dark:border-slate-700/80">
            {/* 1. Speech Language Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="language-select" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Speech Language
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {SUPPORTED_SPEECH_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
                <option value="all">All Installed Voices ({voices.length})</option>
              </select>
            </div>

            {/* 2. Voice Selection Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="voice-select" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Voice Selection {filteredVoices.length > 0 && `(${filteredVoices.length})`}
              </label>
              <select
                id="voice-select"
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {filteredVoices.length > 0 ? (
                  filteredVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="">
                    {selectedLangObj?.name || 'Selected Language'} Browser Synthesizer (Auto)
                  </option>
                )}
              </select>
            </div>

            {/* 3. Speed / Rate Slider & Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="uppercase tracking-wider">Speed: {speechRate.toFixed(2)}x</span>
                <span className="text-slate-500 font-normal">0.5x – 2.0x</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => handleSpeedPreset(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Speech Speed"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedPreset(speed)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      speechRate === speed
                        ? 'bg-sky-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Pitch Slider & Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="uppercase tracking-wider">
                  Pitch: {speechPitch.toFixed(2)}x {speechPitch === 1.0 ? '(Normal)' : speechPitch < 1.0 ? '(Deeper)' : '(Higher)'}
                </span>
                <span className="text-slate-500 font-normal">0.5x – 1.5x</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => handlePitchPreset(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                  aria-label="Voice Pitch"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { value: 0.75, label: 'Deep' },
                  { value: 1.0, label: 'Normal' },
                  { value: 1.25, label: 'High' },
                  { value: 1.5, label: 'Higher' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handlePitchPreset(item.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      speechPitch === item.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
