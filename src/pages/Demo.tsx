import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, Pause, Volume2, RotateCcw, CheckCircle2, X } from "lucide-react";

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fillAnswer, setFillAnswer] = useState("");
  const [readingAnswer, setReadingAnswer] = useState<number | null>(null);
  const [listeningPlaying, setListeningPlaying] = useState(false);

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
      tip: "Escucha el audio y practica la comprensión."
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

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFillAnswer("");
      setReadingAnswer(null);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setFillAnswer("");
    setReadingAnswer(null);
  };

  const canAdvance = () => {
    const d = demoSteps[currentStep];
    if (d.type === "quiz" || (d.type === "reading" && "correct" in d)) return showResult || selectedAnswer !== null;
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
                      variant={isPlaying ? "outline" : "success"}
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPlaying ? "Pausar" : "Reproducir"}
                    </Button>
                    <Button variant="outline" size="lg">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Audio Lento
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
                  
                  <div className="flex justify-center gap-4">
                    <Button variant="success" size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Escuchar Modelo
                    </Button>
                    <Button variant="outline" size="lg">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Grabar mi Voz
                    </Button>
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
                    <Link to="/signup">
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
                <Link to="/signup">
                  Crear Cuenta Gratis
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/login">
                  Ya tengo cuenta
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;