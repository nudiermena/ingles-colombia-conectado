import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  /** If provided, prefer this voice URI (exact match) */
  voiceURI?: string;
};

const VOICE_STORAGE_KEY = 'ttsVoiceURI';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPreparingSpeak, setIsPreparingSpeak] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [preferredVoiceURI, setPreferredVoiceURI] = useState<string>(() => {
    try {
      return localStorage.getItem(VOICE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const voiceReadyResolvers = useRef<((ok: boolean) => void)[]>([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsLoadingVoices(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Some browsers return empty list initially; keep loading=true until non-empty.
      const ready = Array.isArray(availableVoices) && availableVoices.length > 0;
      setIsLoadingVoices(!ready);
      if (ready && voiceReadyResolvers.current.length) {
        const resolvers = [...voiceReadyResolvers.current];
        voiceReadyResolvers.current = [];
        resolvers.forEach((r) => r(true));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const isSupported = useMemo(() => 'speechSynthesis' in window, []);

  const setPreferredVoice = useCallback((voiceURI: string) => {
    setPreferredVoiceURI(voiceURI);
    try {
      if (voiceURI) localStorage.setItem(VOICE_STORAGE_KEY, voiceURI);
      else localStorage.removeItem(VOICE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const waitForVoices = useCallback(async (timeoutMs = 1200) => {
    if (!isSupported) return false;
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length > 0) return true;

    // Wait for onvoiceschanged or timeout
    return await new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(false), timeoutMs);
      voiceReadyResolvers.current.push((ok) => {
        clearTimeout(timer);
        resolve(ok);
      });
    });
  }, [isSupported]);

  const pickVoice = useCallback((lang: string, voiceURI?: string) => {
    if (!voices.length) return null;
    const requestedURI = voiceURI || preferredVoiceURI;
    if (requestedURI) {
      const exact = voices.find((v) => v.voiceURI === requestedURI);
      if (exact) return exact;
    }

    // Prefer exact lang match, then prefix match, and prefer localService voices.
    const exactLang = voices.filter((v) => v.lang === lang);
    if (exactLang.length) {
      const local = exactLang.find((v) => (v as any).localService);
      return local || exactLang[0];
    }

    const prefix = lang.split('-')[0];
    const prefixMatch = voices.filter((v) => v.lang?.startsWith(prefix));
    if (prefixMatch.length) {
      const local = prefixMatch.find((v) => (v as any).localService);
      return local || prefixMatch[0];
    }

    return voices[0] || null;
  }, [voices, preferredVoiceURI]);

  const speak = useCallback(async (text: string, options: SpeakOptions = {}) => {
    if (!isSupported) return;

    const clean = String(text || '').trim();
    if (!clean) return;

    setIsPreparingSpeak(true);

    const lang = options.lang || 'en-US';
    const rate = options.rate ?? 0.95;
    const pitch = options.pitch ?? 1.1;
    const volume = options.volume ?? 1;

    try {
      const voicesReady = await waitForVoices(1200);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = voicesReady ? pickVoice(lang, options.voiceURI) : null;
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsPreparingSpeak(false);
        setIsSpeaking(true);
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsPreparingSpeak(false);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPreparingSpeak(false);
    }
  }, [isSupported, pickVoice, waitForVoices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPreparingSpeak(false);
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isPreparingSpeak,
    isSupported,
    voices,
    isLoadingVoices,
    preferredVoiceURI,
    setPreferredVoice,
  };
};
