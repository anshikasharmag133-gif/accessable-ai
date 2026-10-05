/**
 * Browser Text-to-Speech (TTS) Utility using Web Speech SpeechSynthesis API
 * Optimized for multi-lingual cognitive accessibility (English, Hindi, Punjabi, Spanish, French, Bengali)
 */

export interface SpeechOptions {
  voice?: SpeechSynthesisVoice | null;
  lang?: string; // Language code (e.g., 'hi', 'pa', 'es', 'fr', 'bn', 'en', or BCP-47)
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.8 to 1.2
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
}

/**
 * BCP-47 language candidate tags prioritized for matching browser speech voices
 */
export const LANGUAGE_BCP47_MAP: Record<string, string[]> = {
  hi: ['hi-IN', 'hi_IN', 'hi'],
  pa: ['pa-IN', 'pa_IN', 'pa-Guru-IN', 'pa-PK', 'pa', 'pan'],
  es: ['es-ES', 'es-MX', 'es-US', 'es-419', 'es_ES', 'es_MX', 'es'],
  fr: ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr_FR', 'fr'],
  bn: ['bn-IN', 'bn-BD', 'bn_IN', 'bn_BD', 'bn', 'ben'],
  en: ['en-US', 'en-GB', 'en-IN', 'en-AU', 'en-CA', 'en'],
};

/**
 * Standard default BCP-47 language tag for SpeechSynthesisUtterance.lang
 */
export const LANGUAGE_DEFAULT_BCP47: Record<string, string> = {
  hi: 'hi-IN',
  pa: 'pa-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  bn: 'bn-IN',
  en: 'en-US',
};

export const SUPPORTED_SPEECH_LANGUAGES = [
  { code: 'en', name: 'English', bcp47: 'en-US' },
  { code: 'hi', name: 'Hindi (हिन्दी)', bcp47: 'hi-IN' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', bcp47: 'pa-IN' },
  { code: 'es', name: 'Spanish (Español)', bcp47: 'es-ES' },
  { code: 'fr', name: 'French (Français)', bcp47: 'fr-FR' },
  { code: 'bn', name: 'Bengali (বাংলা)', bcp47: 'bn-IN' },
];

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/**
 * Get available browser voices, reloading or waiting for voiceschanged if necessary
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      return resolve([]);
    }

    const synth = window.speechSynthesis;
    let voices = synth.getVoices();

    if (voices.length > 0) {
      return resolve(voices);
    }

    const handler = () => {
      voices = synth.getVoices();
      synth.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };

    synth.addEventListener('voiceschanged', handler);

    // Timeout fallback if voiceschanged never fires
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', handler);
      resolve(synth.getVoices());
    }, 1500);
  });
}

/**
 * Find the most suitable voice for a requested language code using BCP-47 matching
 */
export function findVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  langCode: string
): SpeechSynthesisVoice | null {
  if (!langCode || voices.length === 0) return null;

  const normalized = langCode.trim().toLowerCase().replace('_', '-');
  const baseLang = normalized.split('-')[0];
  const candidateTags = (LANGUAGE_BCP47_MAP[baseLang] || [normalized]).map((t) =>
    t.toLowerCase().replace('_', '-')
  );

  // 1. Direct candidate BCP-47 match
  for (const tag of candidateTags) {
    const match = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === tag;
    });
    if (match) return match;
  }

  // 2. Prefix match on base language (e.g. 'hi' matches 'hi-IN', 'pa' matches 'pa-IN')
  const prefixMatch = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang.startsWith(`${baseLang}-`) || vLang === baseLang;
  });
  if (prefixMatch) return prefixMatch;

  // 3. Name keywords matching in voice name
  const keywordsMap: Record<string, string[]> = {
    hi: ['hindi', 'हिन्दी', 'devanagari'],
    pa: ['punjabi', 'ਪੰਜਾਬੀ', 'panjabi', 'gurmukhi'],
    es: ['spanish', 'español', 'castellano', 'espanol'],
    fr: ['french', 'français', 'francais'],
    bn: ['bengali', 'বাংলা', 'bangla'],
    en: ['english'],
  };

  const keywords = keywordsMap[baseLang] || [baseLang];
  const nameMatch = voices.find((v) => {
    const vName = v.name.toLowerCase();
    return keywords.some((kw) => vName.includes(kw));
  });
  if (nameMatch) return nameMatch;

  return null;
}

/**
 * Filter voices that match a specific language code
 */
export function getVoicesForLanguage(
  voices: SpeechSynthesisVoice[],
  langCode: string
): SpeechSynthesisVoice[] {
  if (!langCode || langCode === 'all' || voices.length === 0) {
    return voices;
  }

  const baseLang = langCode.trim().toLowerCase().split(/[-_]/)[0];
  const candidateTags = (LANGUAGE_BCP47_MAP[baseLang] || [baseLang]).map((t) =>
    t.toLowerCase().replace('_', '-')
  );

  return voices.filter((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    if (candidateTags.includes(vLang)) return true;
    if (vLang.startsWith(`${baseLang}-`) || vLang === baseLang) return true;
    const keywordsMap: Record<string, string[]> = {
      hi: ['hindi', 'हिन्दी'],
      pa: ['punjabi', 'ਪੰਜਾਬੀ', 'panjabi'],
      es: ['spanish', 'español'],
      fr: ['french', 'français'],
      bn: ['bengali', 'বাংলা'],
      en: ['english'],
    };
    const keywords = keywordsMap[baseLang];
    if (keywords && keywords.some((kw) => v.name.toLowerCase().includes(kw))) {
      return true;
    }
    return false;
  });
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak text aloud using SpeechSynthesis API with fresh voice detection and BCP-47 language matching
 */
export function speakText(text: string, options: SpeechOptions = {}): boolean {
  if (!isSpeechSupported()) {
    if (options.onError) {
      options.onError(new Error('Speech Synthesis is not supported in this browser environment.'));
    }
    return false;
  }

  const synth = window.speechSynthesis;
  // Always cancel any previous utterance
  synth.cancel();

  if (!text || !text.trim()) {
    return false;
  }

  try {
    // Refresh voices before speaking
    const freshVoices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    activeUtterance = utterance;

    let targetVoice: SpeechSynthesisVoice | null = options.voice || null;
    let bcp47Lang: string = '';

    if (options.lang) {
      const baseLang = options.lang.trim().toLowerCase().split(/[-_]/)[0];
      const defaultBcp = LANGUAGE_DEFAULT_BCP47[baseLang] || options.lang;

      // If no explicit voice or voice doesn't match requested language
      if (!targetVoice || !targetVoice.lang.toLowerCase().startsWith(baseLang)) {
        const matched = findVoiceForLanguage(freshVoices, options.lang);
        if (matched) {
          targetVoice = matched;
          bcp47Lang = matched.lang;
        } else {
          // Graceful fallback: set BCP-47 tag so browser synthesis engine routes to requested language
          bcp47Lang = defaultBcp;
          // Do not force an unrelated voice (e.g. Spanish) onto Hindi or Punjabi text!
          targetVoice = null;
        }
      } else {
        bcp47Lang = targetVoice.lang;
      }
    } else if (targetVoice) {
      bcp47Lang = targetVoice.lang;
    } else {
      // Default to English if unspecified
      bcp47Lang = 'en-US';
      targetVoice = findVoiceForLanguage(freshVoices, 'en');
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    if (bcp47Lang) {
      utterance.lang = bcp47Lang;
    }

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      if (options.onError) options.onError(e);
    };

    utterance.onpause = () => {
      if (options.onPause) options.onPause();
    };

    utterance.onresume = () => {
      if (options.onResume) options.onResume();
    };

    utterance.onboundary = (e: SpeechSynthesisEvent) => {
      if (options.onBoundary && typeof e.charIndex === 'number') {
        options.onBoundary(e.charIndex, e.charLength);
      }
    };

    synth.speak(utterance);
    return true;
  } catch (err) {
    if (options.onError) options.onError(err);
    return false;
  }
}

export function pauseSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.resume();
  }
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
