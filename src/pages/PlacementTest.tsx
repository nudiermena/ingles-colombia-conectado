import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAdaptiveTestQuestions, calculateLevel, type PlacementQuestion } from "@/data/placementTestQuestions";

const PlacementTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [recommendedLevel, setRecommendedLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Load questions on mount
  useEffect(() => {
    const testQuestions = getAdaptiveTestQuestions();
    setQuestions(testQuestions);
    setLoading(false);
  }, []);

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
    const level = calculateLevel(userAnswers, questions);
    setRecommendedLevel(level);
    setShowResult(true);

    const correctAnswers = questions.reduce((acc, q, index) => {
      return acc + (userAnswers[index] === q.correct ? 1 : 0);
    }, 0);
    const percentage = (correctAnswers / questions.length) * 100;

    toast({
      title: "Test Completado",
      description: `Tu nivel recomendado es ${level}. Puntuación: ${correctAnswers}/${questions.length} (${Math.round(percentage)}%)`,
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
                {/* Show breakdown by level */}
                <div className="mt-4 space-y-2 text-sm">
                  {['A1', 'A2', 'B1', 'B2'].map(level => {
                    const levelQuestions = questions.filter(q => q.level === level);
                    const levelCorrect = levelQuestions.reduce((acc, q, idx) => {
                      const globalIdx = questions.indexOf(q);
                      return acc + (answers[globalIdx] === q.correct ? 1 : 0);
                    }, 0);
                    const levelPercentage = levelQuestions.length > 0 
                      ? Math.round((levelCorrect / levelQuestions.length) * 100)
                      : 0;
                    return (
                      <div key={level} className="flex justify-between items-center">
                        <span className="font-medium">Nivel {level}:</span>
                        <span className="text-muted-foreground">
                          {levelCorrect}/{levelQuestions.length} ({levelPercentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No hay preguntas disponibles</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Test de Nivelación</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentQ.level}</Badge>
                  <Badge variant="outline">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Responde las siguientes preguntas para determinar tu nivel de inglés.
                El test incluye preguntas de diferentes niveles (A1, A2, B1, B2).
              </CardDescription>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold flex-1">
                    {currentQ.question}
                  </h3>
                </div>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
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
                  <span>Aproximadamente 15-20 minutos</span>
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

