import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Play, Pause, Volume2, RotateCcw, CheckCircle2, X, Loader2, Mic, Square } from "lucide-react";

const Demo = () => {
  const { speak, stop, isSpeaking, isPreparingSpeak } = useTextToSpeech();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fillAnswer, setFillAnswer] = useState("");
  const [readingAnswer, setReadingAnswer] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  const demoSteps = [
    {
      title: "Lección Interactiva: Saludos",
      type: "vocabulary",
      content: "Hello! How are you?",
      translation: "¡Hola! ¿Cómo estás?",
      audio: "/audio/hello.mp3"
    },
    {
      title: "Ejercicio de Comprensión",
      type: "quiz",
      question: "¿Cómo se dice 'Buenos días' en inglés?",
      options: ["Good morning", "Good night", "Good evening", "Good afternoon"],
      correct: 0
    },
    {
      title: "Completar espacio en blanco",
      type: "fill",
      question: "I ___ a student.",
      answer: "am",
      hint: "Verbo 'to be' en primera persona"
    },
    {
      title: "Comprensión de Lectura",
      type: "reading",
      passage: "My name is Ana. I am from Colombia. I study English every day. I like reading and listening to music.",
      question: "Where is Ana from?",
      options: ["Mexico", "Colombia", "Spain", "Argentina"],
      correct: 1
    },
    {
      title: "Comprensión Auditiva",
      type: "listening",
      text: "The weather is nice today. It is sunny and warm.",
      tip: "Escucha el audio y responde la pregunta.",
      question: "¿Cómo está el clima en el audio?",
      options: ["Rainy and cold", "Sunny and warm", "Windy and cloudy", "Snowy"],
      correct: 1
    },
    {
      title: "Pronunciación",
      type: "pronunciation",
      content: "Good morning",
      phonetic: "/ɡʊd ˈmɔːnɪŋ/",
      tip: "Practica la pronunciación clara de cada palabra"
    },
    {
      title: "Más vocabulario: Números",
      type: "vocabulary",
      content: "One, Two, Three",
      translation: "Uno, Dos, Tres",
      audio: "/audio/numbers.mp3"
    },
    {
      title: "Quiz final",
      type: "quiz",
      question: "¿Cómo se dice 'Gracias' en inglés?",
      options: ["Please", "Thank you", "Sorry", "Hello"],
      correct: 1
    }
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleFillSubmit = () => {
    const d = demoSteps[currentStep];
    if (d.type !== "fill" || !("answer" in d)) return;
    const correct = fillAnswer.trim().toLowerCase() === (d.answer as string).toLowerCase();
    setShowResult(true);
    if (!correct) setFillAnswer("");
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFillAnswer("");
      setReadingAnswer(null);
      setRecordedUrl(null);
      setIsRecording(false);
    }
  };

  const resetDemo = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setFillAnswer("");
    setReadingAnswer(null);
    setRecordedUrl(null);
    setIsRecording(false);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const playRecorded = useCallback(() => {
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

  const canAdvance = () => {
    const d = demoSteps[currentStep];
    if (d.type === "quiz" || (d.type === "reading" && "correct" in d)) return showResult || selectedAnswer !== null;
    if (d.type === "listening" && "correct" in d) return showResult || selectedAnswer !== null;
    if (d.type === "fill") return showResult;
    return true;
  };

  const currentDemo = demoSteps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Demo Interactivo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experimenta nuestra metodología de aprendizaje con esta lección demo
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progreso</span>
            <span className="text-sm font-medium">{currentStep + 1} de {demoSteps.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{currentDemo.title}</CardTitle>
                <Badge variant="secondary">
                  {currentDemo.type === 'vocabulary' ? 'Vocabulario' :
                   currentDemo.type === 'quiz' ? 'Quiz' :
                   currentDemo.type === 'fill' ? 'Completar' :
                   currentDemo.type === 'reading' ? 'Comprensión de Lectura' :
                   currentDemo.type === 'listening' ? 'Comprensión Auditiva' : 'Pronunciación'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Vocabulary Demo */}
              {currentDemo.type === 'vocabulary' && (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-primary">{currentDemo.content}</h2>
                    <p className="text-xl text-muted-foreground">{currentDemo.translation}</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={isSpeaking ? "outline" : "success"}
                      size="lg"
                      onClick={() => (isSpeaking ? stop() : speak(currentDemo.content as string, { lang: "en-US" }))}
                      disabled={isPreparingSpeak}
                    >
                      {isPreparingSpeak ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : isSpeaking ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPreparingSpeak ? "Preparando…" : isSpeaking ? "Pausar" : "Reproducir"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => stop()}>
                      <Volume2 className="w-5 h-5 mr-2" />
                      Detener
                    </Button>
                  </div>
                </div>
              )}

              {/* Quiz Demo */}
              {currentDemo.type === 'quiz' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">{currentDemo.question}</h2>
                  
                  <div className="grid gap-3">
                    {currentDemo.options?.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showResult 
                            ? index === currentDemo.correct 
                              ? "success" 
                              : selectedAnswer === index 
                                ? "destructive" 
                                : "outline"
                            : selectedAnswer === index 
                              ? "default" 
                              : "outline"
                        }
                        className="justify-start h-auto p-4 text-left relative"
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        <span className="flex-1">{option}</span>
                        {showResult && index === currentDemo.correct && (
                          <CheckCircle2 className="w-5 h-5 text-success-foreground ml-2" />
                        )}
                        {showResult && selectedAnswer === index && index !== currentDemo.correct && (
                          <X className="w-5 h-5 text-destructive-foreground ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`p-4 rounded-lg border ${
                      selectedAnswer === currentDemo.correct 
                        ? 'bg-success/10 border-success/20 text-success' 
                        : 'bg-destructive/10 border-destructive/20 text-destructive'
                    }`}>
                      {selectedAnswer === currentDemo.correct 
                        ? "¡Correcto! Excelente trabajo." 
                        : "Incorrecto. La respuesta correcta es 'Good morning'."}
                    </div>
                  )}
                </div>
              )}

              {/* Fill-in-the-blank Demo */}
              {currentDemo.type === 'fill' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center">{(currentDemo as { question: string }).question}</h2>
                  <p className="text-sm text-muted-foreground text-center">{(currentDemo as { hint?: string }).hint}</p>
                  <div className="space-y-2">
                    <Label htmlFor="demo-fill">Tu respuesta</Label>
                    <Input
                      id="demo-fill"
                      type="text"
                      placeholder="Escribe la palabra que falta"
                      value={fillAnswer}
                      onChange={(e) => setFillAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFillSubmit()}
                      disabled={showResult}
                      className="text-center text-lg"
                    />
                  </div>
                  {!showResult ? (
                    <Button className="w-full" onClick={handleFillSubmit} disabled={!fillAnswer.trim()}>
                      Completar
                    </Button>
                  ) : (
                    <div className={`p-4 rounded-lg border ${
                      fillAnswer.trim().toLowerCase() === ((currentDemo as { answer: string }).answer).toLowerCase()
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-destructive/10 border-destructive/20 text-destructive"
                    }`}>
                      {fillAnswer.trim().toLowerCase() === ((currentDemo as { answer: string }).answer).toLowerCase()
                        ? "¡Correcto! Excelente trabajo."
                        : `Incorrecto. La respuesta correcta es "${(currentDemo as { answer: string }).answer}".`}
                    </div>
                  )}
                </div>
              )}

              {/* Reading comprehension Demo */}
              {currentDemo.type === 'reading' && (
                <div className="space-y-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">{(currentDemo as { passage: string }).passage}</p>
                  <h2 className="text-xl font-semibold text-center">{(currentDemo as { question: string }).question}</h2>
                  <div className="grid gap-3">
                    {((currentDemo as { options?: string[] }).options ?? []).map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showResult
                            ? index === (currentDemo as { correct: number }).correct
                              ? "success"
                              : selectedAnswer === index
                                ? "destructive"
                                : "outline"
                            : selectedAnswer === index
                              ? "default"
                              : "outline"
                        }
                        className="justify-start h-auto p-4 text-left"
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        <span className="flex-1">{option}</span>
                        {showResult && index === (currentDemo as { correct: number }).correct && (
                          <CheckCircle2 className="w-5 h-5 text-success-foreground ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>
                  {showResult && (
                    <div className={`p-4 rounded-lg border ${
                      selectedAnswer === (currentDemo as { correct: number }).correct
                        ? "bg-success/10 border-success/20 text-success"
                        : "bg-destructive/10 border-destructive/20 text-destructive"
                    }`}>
                      {selectedAnswer === (currentDemo as { correct: number }).correct
                        ? "¡Correcto!"
                        : "Incorrecto. La respuesta correcta es Colombia."}
                    </div>
                  )}
                </div>
              )}

              {/* Listening Demo */}
              {currentDemo.type === 'listening' && (
                <div className="space-y-6">
                  <p className="text-muted-foreground text-center">{(currentDemo as { tip: string }).tip}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => speak((currentDemo as { text: string }).text, { lang: "en-US" })}
                      disabled={isPreparingSpeak || isSpeaking}
                    >
                      {isPreparingSpeak ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPreparingSpeak ? "Preparando…" : isSpeaking ? "Reproduciendo…" : "Reproducir audio"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => stop()}>
                      Detener
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                    <strong className="text-foreground">Contenido del audio:</strong> {(currentDemo as { text: string }).text}
                  </div>
                  {"question" in currentDemo && (currentDemo as { question: string }).question && (
                    <>
                      <h2 className="text-xl font-semibold text-center">{(currentDemo as { question: string }).question}</h2>
                      <div className="grid gap-3">
                        {((currentDemo as { options?: string[] }).options ?? []).map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              showResult
                                ? index === (currentDemo as { correct: number }).correct
                                  ? "success"
                                  : selectedAnswer === index
                                    ? "destructive"
                                    : "outline"
                                : selectedAnswer === index
                                  ? "default"
                                  : "outline"
                            }
                            className="justify-start h-auto p-4 text-left"
                            onClick={() => !showResult && handleAnswerSelect(index)}
                            disabled={showResult}
                          >
                            <span className="flex-1">{option}</span>
                            {showResult && index === (currentDemo as { correct: number }).correct && (
                              <CheckCircle2 className="w-5 h-5 text-success-foreground ml-2" />
                            )}
                          </Button>
                        ))}
                      </div>
                      {showResult && (
                        <div className={`p-4 rounded-lg border ${
                          selectedAnswer === (currentDemo as { correct: number }).correct
                            ? "bg-success/10 border-success/20 text-success"
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                        }`}>
                          {selectedAnswer === (currentDemo as { correct: number }).correct
                            ? "¡Correcto!"
                            : `Incorrecto. La respuesta correcta es "${((currentDemo as { options?: string[] }).options ?? [])[(currentDemo as { correct: number }).correct]}".`}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Pronunciation Demo */}
              {currentDemo.type === 'pronunciation' && (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-primary">{currentDemo.content}</h2>
                    <p className="text-xl text-muted-foreground font-mono">{currentDemo.phonetic}</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      💡 {currentDemo.tip}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => (isSpeaking ? stop() : speak(currentDemo.content as string, { lang: "en-US" }))}
                      disabled={isPreparingSpeak}
                    >
                      {isPreparingSpeak ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPreparingSpeak ? "Preparando…" : "Escuchar Modelo"}
                    </Button>
                    {!isRecording && !recordedUrl && (
                      <Button variant="outline" size="lg" onClick={startRecording}>
                        <Mic className="w-5 h-5 mr-2" />
                        Grabar mi Voz
                      </Button>
                    )}
                    {isRecording && (
                      <Button variant="destructive" size="lg" onClick={stopRecording}>
                        <Square className="w-5 h-5 mr-2" />
                        Detener grabación
                      </Button>
                    )}
                    {recordedUrl && !isRecording && (
                      <>
                        <Button variant="outline" size="lg" onClick={playRecorded} disabled={isPlayingBack}>
                          {isPlayingBack ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                          {isPlayingBack ? "Reproduciendo…" : "Escuchar mi grabación"}
                        </Button>
                        <Button variant="ghost" size="lg" onClick={() => { if (recordedUrl) URL.revokeObjectURL(recordedUrl); setRecordedUrl(null); }}>
                          Volver a grabar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button variant="outline" onClick={resetDemo}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar Demo
                </Button>
                
                {currentStep < demoSteps.length - 1 ? (
                  <Button 
                    variant="hero" 
                    onClick={nextStep}
                    disabled={!canAdvance()}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button variant="success" asChild>
                    <Link to="/login">
                      ¡Comenzar Gratis!
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-hero text-white border-0 max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">¿Te gustó el demo?</h2>
            <p className="text-white/80 mb-6">
              Accede a cientos de lecciones como esta, ejercicios interactivos, 
              y seguimiento de progreso personalizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/login">
                Ya tengo cuenta
                </Link>
              </Button>
              {/* <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/login">
                  Ya tengo cuenta
                </Link>
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;