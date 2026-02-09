/**
 * Pronunciation practice: listen to model (TTS), record, validate with Web Speech API.
 * Speech Recognition + Speech Synthesis. Best in Chrome/Edge.
 * @see https://webapis.co/web-speech
 */
import { useMemo, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Mic, Square, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface PronunciationRecorderProps {
  /** Word or phrase to practice (shown and used for reference TTS) */
  word: string;
  /** Phonetic spelling e.g. "/həˈloʊ/" */
  pronunciation?: string;
  /** Language for TTS (reference) */
  lang?: string;
  /** Called when user has recorded and marks as complete */
  onComplete?: () => void;
  /** Whether this step is already completed (e.g. from parent) */
  isCompleted?: boolean;
  /** TTS: speak reference */
  onSpeakReference: (text: string, lang?: string) => void;
  onStopReference: () => void;
  isSpeakingReference: boolean;
  /** TTS is loading/preparing (show loader on reference button) */
  isPreparingReference?: boolean;
}

export const PronunciationRecorder = ({
  word,
  pronunciation,
  lang = 'en-US',
  onComplete,
  isCompleted = false,
  onSpeakReference,
  onStopReference,
  isSpeakingReference,
  isPreparingReference = false,
}: PronunciationRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pronunciationStatus, setPronunciationStatus] = useState<'idle' | 'checking' | 'ok' | 'not_ok' | 'unsupported'>('idle');
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [skippedValidation, setSkippedValidation] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const normalizedWord = useMemo(() => {
    return String(word || '').trim().toLowerCase();
  }, [word]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setPronunciationStatus('idle');
      setLastTranscript('');
      setErrorText('');
      setSkippedValidation(false);

      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setErrorText('No se pudo acceder al micrófono. Revisa permisos del navegador.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const playBack = useCallback(() => {
    if (!recordedUrl) return;
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
    const audio = new Audio(recordedUrl);
    playbackAudioRef.current = audio;
    audio.onplay = () => setIsPlayingBack(true);
    audio.onended = () => {
      setIsPlayingBack(false);
      playbackAudioRef.current = null;
    };
    audio.play();
  }, [recordedUrl]);

  /** Normalize for comparison: lowercase, collapse spaces, remove punctuation */
  const normalizeForMatch = useCallback((s: string) => {
    return String(s || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  /** Check if transcript matches expected word/phrase (lenient). */
  const transcriptMatches = useCallback((transcript: string) => {
    const t = normalizeForMatch(transcript);
    const w = normalizeForMatch(normalizedWord);
    if (!w) return false;
    if (t.includes(w)) return true;
    // Multi-word: require each significant word of expected phrase to appear in transcript
    const expectedWords = w.split(/\s+/).filter((x) => x.length > 0);
    const transcriptWords = new Set(t.split(/\s+/).filter((x) => x.length > 0));
    if (expectedWords.length <= 1) return false;
    const allPresent = expectedWords.every((ew) => {
      if (transcriptWords.has(ew)) return true;
      return Array.from(transcriptWords).some((tw) => tw.includes(ew) || ew.includes(tw));
    });
    return allPresent;
  }, [normalizedWord, normalizeForMatch]);

  const checkPronunciation = useCallback(async () => {
    setErrorText('');
    setLastTranscript('');

    const SpeechRecognitionCtor: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setPronunciationStatus('unsupported');
      setErrorText('Tu navegador no soporta verificación automática de pronunciación.');
      return;
    }

    if (!normalizedWord) {
      setPronunciationStatus('not_ok');
      setErrorText('No se encontró la palabra a validar.');
      return;
    }

    setPronunciationStatus('checking');
    setErrorText('');

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 5;

      const transcript: string = await new Promise((resolve, reject) => {
        let finished = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let lastResult = '';

        const finish = (result: string) => {
          if (finished) return;
          finished = true;
          if (timeoutId) clearTimeout(timeoutId);
          try {
            recognition.stop();
          } catch {
            // ignore
          }
          resolve(result);
        };

        recognition.onresult = (event: any) => {
          const results = event?.results;
          if (!results?.length) return;
          const last = results[results.length - 1];
          const alt0 = last[0]?.transcript || '';
          lastResult = String(alt0).trim();
          if (!last.isFinal) return;
          for (let i = 0; i < last.length; i++) {
            const text = last[i]?.transcript || '';
            if (transcriptMatches(String(text))) {
              finish(String(text).trim());
              return;
            }
          }
          if (lastResult) finish(lastResult);
        };
        recognition.onerror = (event: any) => {
          if (event?.error === 'no-speech') {
            finish(lastResult || '');
            return;
          }
          if (event?.error === 'aborted') return;
          reject(new Error(event?.error || 'recognition_error'));
        };
        recognition.onnomatch = () => finish(lastResult || '');
        recognition.onend = () => {
          if (finished) return;
          finished = true;
          if (timeoutId) clearTimeout(timeoutId);
          resolve(lastResult || '');
        };

        timeoutId = setTimeout(() => finish(lastResult || ''), 10000);
        recognition.start();
      });

      const displayTranscript = transcript.trim().toLowerCase();
      const noVoiceDetected = !displayTranscript;
      setLastTranscript(noVoiceDetected ? '' : displayTranscript);

      const ok = transcriptMatches(transcript);
      setPronunciationStatus(ok ? 'ok' : 'not_ok');
      if (!ok && noVoiceDetected) {
        setErrorText('No se detectó voz. Comprueba el micrófono, habla claro o usa "Continuar sin validación".');
      } else if (!ok) {
        setErrorText('Pronunciación no validada. Intenta de nuevo o continúa sin validación.');
      }
    } catch (err: any) {
      console.error('Pronunciation check error:', err);
      setPronunciationStatus('not_ok');
      setErrorText('No se pudo validar. Intenta de nuevo.');
    }
  }, [lang, normalizedWord, transcriptMatches]);

  const handleMarkComplete = useCallback(() => {
    const canProceed = pronunciationStatus === 'ok' || skippedValidation;
    if (!canProceed) {
      setErrorText('Debes validar tu pronunciación o usar "Continuar sin validación" para continuar.');
      return;
    }
    setIsSaving(true);
    onComplete?.();
    setIsSaving(false);
  }, [onComplete, pronunciationStatus, skippedValidation]);

  const canContinue = pronunciationStatus === 'ok' || skippedValidation;

  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Practica la pronunciación de:</h3>
      <div className="bg-muted p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">{word}</h2>
        {pronunciation && (
          <p className="text-muted-foreground">{pronunciation}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Para la mejor experiencia usa Chrome o Edge. La validación usa la Web Speech API (reconocimiento de voz).
      </p>

      {/* Reference: listen to model pronunciation */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">Escucha la pronunciación modelo</p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (isSpeakingReference) onStopReference();
              else onSpeakReference(word, lang);
            }}
            disabled={isPreparingReference}
          >
            {isPreparingReference ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Volume2 className="w-5 h-5 mr-2" />}
            {isPreparingReference ? 'Preparando...' : isSpeakingReference ? 'Detener' : 'Escuchar pronunciación'}
          </Button>
        </CardContent>
      </Card>

      {/* Record your voice */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm text-muted-foreground">Graba tu pronunciación para comparar</p>
          <div className="flex flex-wrap justify-center gap-2">
            {!isRecording ? (
              <Button
                variant="default"
                size="lg"
                onClick={startRecording}
                disabled={isCompleted}
              >
                <Mic className="w-5 h-5 mr-2" />
                Grabar
              </Button>
            ) : (
              <Button variant="destructive" size="lg" onClick={stopRecording}>
                <Square className="w-5 h-5 mr-2" />
                Detener grabación
              </Button>
            )}
            {recordedUrl && (
              <Button
                variant="secondary"
                size="lg"
                onClick={playBack}
                disabled={isPlayingBack || isCompleted}
              >
                {isPlayingBack ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                Escuchar mi grabación
              </Button>
            )}
          </div>

          {/* Validation */}
          <div className="pt-2 space-y-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={checkPronunciation}
              disabled={isCompleted || isRecording || pronunciationStatus === 'checking'}
              title="Validar tu pronunciación"
            >
              {pronunciationStatus === 'checking' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Habla ahora…
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Validar pronunciación
                </>
              )}
            </Button>

            {pronunciationStatus === 'ok' && (
              <div className="p-3 rounded-lg bg-success/10 text-success text-sm">
                <p className="font-medium">Pronunciación aceptada</p>
                {lastTranscript && (
                  <p className="text-xs text-success/80 mt-1">Detectado: “{lastTranscript}”</p>
                )}
              </div>
            )}

            {pronunciationStatus === 'not_ok' && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm space-y-2">
                <p className="font-medium text-foreground">
                  {lastTranscript ? 'Intenta de nuevo' : 'No se detectó voz'}
                </p>
                {lastTranscript && (
                  <p className="text-xs text-muted-foreground">Detectado: “{lastTranscript}”</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSkippedValidation(true);
                    setErrorText('');
                  }}
                  className="mt-2"
                >
                  Continuar sin validación automática
                </Button>
              </div>
            )}

            {pronunciationStatus === 'unsupported' && (
              <div className="p-3 rounded-lg bg-warning/10 text-warning text-sm space-y-2">
                <p className="font-medium">Validación no disponible en este navegador</p>
                <p className="text-xs">
                  La Web Speech API (reconocimiento de voz) funciona mejor en Chrome o Edge. Puedes practicar escuchando el modelo y grabando tu voz, y continuar sin validación automática.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSkippedValidation(true);
                    setErrorText('');
                  }}
                  className="mt-2"
                >
                  Continuar sin validación automática
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {errorText && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm inline-flex items-start gap-2 justify-center">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{errorText}</span>
        </div>
      )}

      {!isCompleted && (recordedBlob || canContinue) && (
        <Button
          variant="lesson"
          size="lg"
          onClick={handleMarkComplete}
          disabled={isSaving || !canContinue}
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
          Marcar como completado y continuar
        </Button>
      )}
      {isCompleted && (
        <div className="p-3 rounded-lg bg-success/10 text-success">
          <p className="font-medium">¡Ejercicio completado!</p>
        </div>
      )}
    </div>
  );
};
