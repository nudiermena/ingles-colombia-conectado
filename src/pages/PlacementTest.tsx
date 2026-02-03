import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PlacementTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [recommendedLevel, setRecommendedLevel] = useState<string>("");

  // Sample questions for placement test
  const questions = [
    {
      id: 1,
      question: "How do you say 'Hola' in English?",
      options: ["Hello", "Goodbye", "Thanks", "Please"],
      correct: 0
    },
    {
      id: 2,
      question: "Complete: I ___ a student.",
      options: ["am", "is", "are", "be"],
      correct: 0
    },
    {
      id: 3,
      question: "What is the past tense of 'go'?",
      options: ["goed", "went", "gone", "going"],
      correct: 1
    },
    {
      id: 4,
      question: "Choose the correct sentence:",
      options: [
        "I have been to Paris last year",
        "I went to Paris last year",
        "I go to Paris last year",
        "I am going to Paris last year"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "What does 'I'm looking forward to' mean?",
      options: [
        "I'm searching for something",
        "I'm excited about something in the future",
        "I'm looking behind me",
        "I'm worried about something"
      ],
      correct: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (userAnswers: number[]) => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / questions.length) * 100;
    
    let level = "A1";
    if (percentage >= 80) {
      level = "B1";
    } else if (percentage >= 60) {
      level = "A2";
    }

    setRecommendedLevel(level);
    setShowResult(true);

    toast({
      title: "Test Completado",
      description: `Tu nivel recomendado es ${level}`,
    });
  };

  const handleStartLevel = () => {
    navigate(`/nivel/${recommendedLevel.toLowerCase()}`);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setRecommendedLevel("");
  };

  if (showResult) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correct
    ).length;
    const percentage = (correctAnswers / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl">¡Test Completado!</CardTitle>
                <CardDescription className="text-lg">
                  Basado en tus respuestas, te recomendamos:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Badge className="text-2xl px-6 py-2 bg-gradient-primary text-white border-0">
                    Nivel {recommendedLevel}
                  </Badge>
                  <p className="text-muted-foreground">
                    Respondiste correctamente {correctAnswers} de {questions.length} preguntas ({Math.round(percentage)}%)
                  </p>
                </div>

                <div className="space-y-4">
                  <Progress value={percentage} className="h-3" />
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">¿Qué incluye el nivel {recommendedLevel}?</h3>
                    {recommendedLevel === "A1" && (
                      <ul className="text-left space-y-2 text-muted-foreground">
                        <li>• Fundamentos del inglés</li>
                        <li>• Saludos y presentaciones</li>
                        <li>• Vocabulario básico</li>
                        <li>• 24 lecciones interactivas</li>
                      </ul>
                    )}
                    {recommendedLevel === "A2" && (
                      <ul className="text-left space-y-2 text-muted-foreground">
                        <li>• Inglés pre-intermedio</li>
                        <li>• Conversaciones simples</li>
                        <li>• Tiempos verbales básicos</li>
                        <li>• 32 lecciones interactivas</li>
                      </ul>
                    )}
                    {recommendedLevel === "B1" && (
                      <ul className="text-left space-y-2 text-muted-foreground">
                        <li>• Inglés intermedio</li>
                        <li>• Expresión de opiniones</li>
                        <li>• Gramática avanzada</li>
                        <li>• 40 lecciones interactivas</li>
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={handleStartLevel} size="lg" className="group">
                      Comenzar Nivel {recommendedLevel}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button onClick={handleRetake} variant="outline" size="lg">
                      Volver a Intentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Test de Nivelación</CardTitle>
                <Badge variant="secondary">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </Badge>
              </div>
              <CardDescription>
                Responde las siguientes preguntas para determinar tu nivel de inglés
              </CardDescription>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {questions[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleAnswer(index)}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="ghost" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>Aproximadamente 5 minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlacementTest;

