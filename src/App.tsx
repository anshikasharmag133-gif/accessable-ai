import React, { useState } from 'react';
import { ActiveTab, SampleText } from './types';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeDashboard } from './components/HomeDashboard';
import { TextSimplifier } from './components/TextSimplifier';
import { Translator } from './components/Translator';
import { TtsReader } from './components/TtsReader';
import { ExplainConcept } from './components/ExplainConcept';
import { AccessibilitySettingsView } from './components/AccessibilitySettingsView';
import { SampleDemoModal } from './components/SampleDemoModal';
import { AboutModal } from './components/AboutModal';
import { SAMPLE_TEXTS } from './data/samples';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [simplifyText, setSimplifyText] = useState<string>('');
  const [translateText, setTranslateText] = useState<string>('');
  const [speechText, setSpeechText] = useState<string>('');
  const [speechLanguage, setSpeechLanguage] = useState<string>('en');
  const [explainText, setExplainText] = useState<string>('');
  const [sampleModalOpen, setSampleModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  // Photosynthesis sample (required in prompt demo)
  const photosynthesisSample = SAMPLE_TEXTS[0];

  const handleSelectSample = (sample: SampleText, targetTab?: ActiveTab) => {
    const tab = targetTab || (sample.suitableFor as ActiveTab) || 'simplify';
    if (tab === 'simplify') {
      setSimplifyText(sample.original);
    } else if (tab === 'translate') {
      setTranslateText(sample.original);
    } else if (tab === 'speech') {
      setSpeechText(sample.original);
      setSpeechLanguage('en');
    } else if (tab === 'explain') {
      setExplainText(sample.original);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToTranslator = (text: string) => {
    setTranslateText(text);
    setActiveTab('translate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToSpeech = (text: string, lang?: string) => {
    setSpeechText(text);
    if (lang) {
      setSpeechLanguage(lang);
    }
    setActiveTab('speech');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToSimplifier = (text: string) => {
    setSimplifyText(text);
    setActiveTab('simplify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSamples={() => setSampleModalOpen(true)}
        />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {activeTab === 'home' && (
            <HomeDashboard
              setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectSample={handleSelectSample}
              photosynthesisSample={photosynthesisSample}
            />
          )}

          {activeTab === 'simplify' && (
            <TextSimplifier
              inputText={simplifyText}
              setInputText={setSimplifyText}
              onSendToTranslator={handleSendToTranslator}
              onSendToSpeech={handleSendToSpeech}
              onOpenSamples={() => setSampleModalOpen(true)}
            />
          )}

          {activeTab === 'translate' && (
            <Translator
              inputText={translateText}
              setInputText={setTranslateText}
              onSendToSpeech={handleSendToSpeech}
              onSendToSimplifier={handleSendToSimplifier}
            />
          )}

          {activeTab === 'speech' && (
            <TtsReader
              initialText={speechText}
              initialLanguage={speechLanguage}
              onOpenSamples={() => setSampleModalOpen(true)}
            />
          )}

          {activeTab === 'explain' && (
            <ExplainConcept
              inputText={explainText}
              setInputText={setExplainText}
              onSendToSpeech={handleSendToSpeech}
              onOpenSamples={() => setSampleModalOpen(true)}
            />
          )}

          {activeTab === 'settings' && <AccessibilitySettingsView />}
        </main>

        {/* Global Footer */}
        <Footer
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAbout={() => setAboutModalOpen(true)}
        />

        {/* Modals */}
        <SampleDemoModal
          isOpen={sampleModalOpen}
          onClose={() => setSampleModalOpen(false)}
          onSelectSample={handleSelectSample}
        />

        <AboutModal
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
        />
      </div>
    </AccessibilityProvider>
  );
}
