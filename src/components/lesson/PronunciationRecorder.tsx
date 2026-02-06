import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Mic, Square, Play, Loader2, CheckCircle } from 'lucide-react';

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
}: PronunciationRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

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

  const handleMarkComplete = useCallback(() => {
    setIsSaving(true);
    onComplete?.();
    setIsSaving(false);
  }, [onComplete]);

  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Practica la pronunciación de:</h3>
      <div className="bg-muted p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">{word}</h2>
        {pronunciation && (
          <p className="text-muted-foreground">{pronunciation}</p>
        )}
      </div>

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
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {isSpeakingReference ? 'Detener' : 'Escuchar pronunciación'}
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
        </CardContent>
      </Card>

      {!isCompleted && recordedBlob && (
        <Button
          variant="lesson"
          size="lg"
          onClick={handleMarkComplete}
          disabled={isSaving}
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
