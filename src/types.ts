export type ReadingLevel = 'simple' | 'very-simple' | 'student-friendly';

export type SupportedLanguageCode = 'en' | 'hi' | 'pa' | 'es' | 'fr' | 'bn';

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
}

export interface SimplificationResponse {
  simplifiedText: string;
  originalLength: number;
  simplifiedLength: number;
  level: ReadingLevel;
}

export interface TranslationResponse {
  translatedText: string;
  targetLanguage: string;
  targetLanguageName: string;
  sourceLanguage: string;
}

export interface ExplanationResponse {
  simpleExplanation: string;
  keyPoints: string[];
  example: string;
  caution: string;
}

export type FontScale = 'sm' | 'md' | 'lg' | 'xl';

export type FontStyleOption = 'default' | 'arial' | 'verdana' | 'georgia' | 'opendyslexic' | 'monospace';

export interface AccessibilitySettings {
  fontScale: FontScale;
  fontStyle: FontStyleOption;
  highContrast: boolean;
  darkMode: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  speechRate: number;
  speechPitch?: number;
  preferredVoiceURI: string;
}

export type ActiveTab = 'home' | 'simplify' | 'translate' | 'speech' | 'explain' | 'settings';

export interface SampleText {
  id: string;
  title: string;
  category: string;
  original: string;
  previewSimplified?: string;
  suitableFor: 'simplify' | 'explain' | 'translate';
}
