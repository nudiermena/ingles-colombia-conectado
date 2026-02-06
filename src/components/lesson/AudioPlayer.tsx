import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  textToSpeech?: string; // Fallback to TTS if no audio URL
  lang?: string;
  title?: string;
  transcript?: string; // Optional transcript for listening exercises
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export const AudioPlayer = ({
  audioUrl,
  textToSpeech,
  lang = 'en-US',
  title = 'Audio',
  transcript,
  onPlay,
  onPause,
  onEnded
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [useTTS, setUseTTS] = useState(!audioUrl && !!textToSpeech);

  useEffect(() => {
    if (audioUrl && !useTTS) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const updateProgress = () => {
        if (audio.duration) {
          setDuration(audio.duration);
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleTimeUpdate = () => updateProgress();
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        onEnded?.();
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl, useTTS, onEnded]);

  const togglePlay = () => {
    if (useTTS && textToSpeech) {
      // Use browser TTS
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        onPause?.();
      } else {
        const utterance = new SpeechSynthesisUtterance(textToSpeech);
        utterance.lang = lang;
        utterance.rate = 0.85; // Slightly slower for comprehension
        utterance.onstart = () => {
          setIsPlaying(true);
          onPlay?.();
        };
        utterance.onend = () => {
          setIsPlaying(false);
          onEnded?.();
        };
        window.speechSynthesis.speak(utterance);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
    } else if (useTTS) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {title && (
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              {title}
            </h3>
          )}

          {!audioUrl && textToSpeech && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              <p>Reproduciendo con síntesis de voz del navegador</p>
            </div>
          )}

          {audioUrl && (
            <div className="space-y-2">
              <div
                className="relative h-2 bg-muted rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={togglePlay}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Reproducir
                </>
              )}
            </Button>
            {audioUrl && (
              <Button variant="outline" size="lg" onClick={reset}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>

          {transcript && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Ver transcripción
              </summary>
              <div className="mt-2 p-4 bg-muted rounded-lg text-sm">
                <p className="whitespace-pre-line">{transcript}</p>
              </div>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
