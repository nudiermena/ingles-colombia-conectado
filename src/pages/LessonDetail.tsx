import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useLessons, useLessonProgress } from "@/hooks/useLessons";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "@/components/lesson/AudioPlayer";
import { ReadingComprehension } from "@/components/lesson/ReadingComprehension";
import { PronunciationRecorder } from "@/components/lesson/PronunciationRecorder";
import { 
  CheckCircle, 
  Clock, 
  Star, 
  BookOpen, 
  Volume2,
  ArrowLeft,
  ArrowRight,
  Target,
  Award,
  Loader2,
  AlertCircle,
  X,
  Headphones,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Exercise Component to handle all exercise types
interface ExerciseComponentProps {
  exercise: any;
  exerciseIndex: number;
  isCompleted: boolean;
  onComplete: () => void;
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

const ExerciseComponent = ({ 
  exercise, 
  exerciseIndex, 
  isCompleted, 
  onComplete,
  speak,
  stop,
  isSpeaking
}: ExerciseComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");
  const [translationAnswer, setTranslationAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedAnswer(null);
    setFillBlankAnswer("");
    setTranslationAnswer("");
    setShowFeedback(false);
    setIsCorrect(false);
  }, [exerciseIndex, exercise.question]);

  const handleAnswer = (answer: string | number) => {
    if (isCompleted) return;
    
    setSelectedAnswer(answer);
    
    if (exercise.type === 'multiple-choice') {
      const correct = answer === exercise.correct;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      if (correct) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  };

  const handleFillBlank = () => {
    if (isCompleted || !fillBlankAnswer.trim()) return;
    
    const correct = fillBlankAnswer.trim().toLowerCase() === exercise.answer?.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleTranslation = () => {
    if (isCompleted || !translationAnswer.trim()) return;
    
    const correct = translationAnswer.trim().toLowerCase() === exercise.answer?.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  if (exercise.type === 'multiple-choice') {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold flex-1">
            {exercise.question}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (isSpeaking) {
                stop();
              } else {
                speak(exercise.question, 'es-ES');
              }
            }}
            className="flex-shrink-0"
            title="Escuchar pregunta"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {exercise.options?.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === exercise.correct;
            const showResult = showFeedback && isSelected;
            
            return (
              <div key={index} className="flex gap-2">
                <Button
                  variant={showResult ? (isCorrectOption ? "default" : "destructive") : "outline"}
                  className={`flex-1 text-left justify-start ${
                    showResult && isCorrectOption ? "bg-success text-success-foreground" : ""
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={isCompleted}
                >
                  {showResult && isCorrectOption && <CheckCircle className="w-4 h-4 mr-2" />}
                  {showResult && !isCorrectOption && <X className="w-4 h-4 mr-2" />}
                  {option}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSpeaking) {
                      stop();
                    } else {
                      speak(option, 'en-US');
                    }
                  }}
                  className="flex-shrink-0"
                  title="Escuchar opción"
                  disabled={isCompleted}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
        {showFeedback && (
          <div className={`p-3 rounded-lg ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {isCorrect ? (
              <p className="font-medium">¡Correcto! {exercise.explanation || ""}</p>
            ) : (
              <p className="font-medium">Incorrecto. Intenta de nuevo.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (exercise.type === 'fill-blank' || exercise.type === 'fill-in-the-blank') {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold flex-1">
            {exercise.question}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (isSpeaking) {
                stop();
              } else {
                speak(exercise.question, 'es-ES');
              }
            }}
            className="flex-shrink-0"
            title="Escuchar pregunta"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <Input
            type="text"
            value={fillBlankAnswer}
            onChange={(e) => setFillBlankAnswer(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full"
            disabled={isCompleted}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFillBlank();
              }
            }}
          />
          <Button 
            onClick={handleFillBlank}
            disabled={isCompleted || !fillBlankAnswer.trim()}
            className="w-full"
          >
            Verificar Respuesta
          </Button>
        </div>
        {showFeedback && (
          <div className={`p-3 rounded-lg ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {isCorrect ? (
              <div className="flex items-center justify-between">
                <p className="font-medium flex-1">
                  ¡Correcto! La respuesta es: {exercise.answer}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSpeaking) {
                      stop();
                    } else {
                      speak(exercise.answer || '', 'en-US');
                    }
                  }}
                  className="flex-shrink-0 ml-2"
                  title="Escuchar respuesta"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="font-medium">Incorrecto. Intenta de nuevo.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (exercise.type === 'translation') {
    // Extract Spanish text from question (usually in parentheses or after colon)
    const spanishText = exercise.question.match(/['"]([^'"]+)['"]|: (.+)/)?.[1] || exercise.question;
    
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold flex-1">
            {exercise.question}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isSpeaking) {
                  stop();
                } else {
                  speak(exercise.question, 'es-ES');
                }
              }}
              title="Escuchar pregunta"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isSpeaking) {
                  stop();
                } else {
                  speak(spanishText, 'es-ES');
                }
              }}
              title="Escuchar texto en español"
            >
              <Volume2 className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <Input
            type="text"
            value={translationAnswer}
            onChange={(e) => setTranslationAnswer(e.target.value)}
            placeholder="Escribe la traducción..."
            className="w-full"
            disabled={isCompleted}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTranslation();
              }
            }}
          />
          <Button 
            onClick={handleTranslation}
            disabled={isCompleted || !translationAnswer.trim()}
            className="w-full"
          >
            Verificar Traducción
          </Button>
        </div>
        {showFeedback && (
          <div className={`p-3 rounded-lg ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {isCorrect ? (
              <div className="flex items-center justify-between">
                <p className="font-medium flex-1">
                  ¡Correcto! La traducción es: {exercise.answer}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSpeaking) {
                      stop();
                    } else {
                      speak(exercise.answer || '', 'en-US');
                    }
                  }}
                  className="flex-shrink-0 ml-2"
                  title="Escuchar respuesta"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="font-medium">Incorrecto. Intenta de nuevo.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (exercise.type === 'matching') {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold flex-1">
            {exercise.question || "Une las parejas correctas"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (isSpeaking) {
                stop();
              } else {
                speak(exercise.question || "Une las parejas correctas", 'es-ES');
              }
            }}
            className="flex-shrink-0"
            title="Escuchar instrucciones"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {exercise.instructions || "Selecciona la opción que corresponde a cada elemento"}
          </p>
          {/* Matching exercises can be implemented with drag-and-drop or selection */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Ejercicio de emparejamiento - Funcionalidad en desarrollo
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (exercise.type === 'pronunciation') {
    return (
      <PronunciationRecorder
        word={exercise.word}
        pronunciation={exercise.pronunciation}
        lang="en-US"
        isCompleted={isCompleted}
        onComplete={onComplete}
        onSpeakReference={speak}
        onStopReference={stop}
        isSpeakingReference={isSpeaking}
      />
    );
  }

  // Default fallback for unknown exercise types
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold flex-1">
          {exercise.question || "Ejercicio"}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (isSpeaking) {
              stop();
            } else {
              speak(exercise.question || "Ejercicio", 'es-ES');
            }
          }}
          className="flex-shrink-0"
          title="Escuchar pregunta"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Tipo de ejercicio: {exercise.type}
        </p>
        {exercise.instructions && (
          <p className="text-sm mt-2">{exercise.instructions}</p>
        )}
      </div>
    </div>
  );
};

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentTenant, loading: tenantLoading, switchTenant } = useTenant(user?.id);
  
  // Get tenant and restart flag from navigation state if available
  const [initialTenant] = useState(() => {
    const state = location.state as { selectedTenant?: any } | null;
    return state?.selectedTenant || null;
  });
  const shouldRestart = (location.state as { restart?: boolean })?.restart ?? false;
  
  // Use initialTenant if available, otherwise use currentTenant from hook
  const activeTenant = initialTenant || currentTenant;
  
  const { lessons, loading: lessonsLoading } = useLessons(activeTenant?.id || null);
  const { getProgressForLesson, updateProgress } = useLessonProgress(user?.id, activeTenant?.id || null);
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const hasLoadedInitialProgress = useRef(false);
  const userHasNavigated = useRef(false);

  const lesson = lessons.find(l => l.id === id);
  const existingProgress = id ? getProgressForLesson(id) : null;

  // If we have initialTenant from navigation, set it in the hook
  useEffect(() => {
    if (initialTenant && (!currentTenant || currentTenant.id !== initialTenant.id)) {
      switchTenant(initialTenant);
    }
  }, [initialTenant, currentTenant, switchTenant]);

  useEffect(() => {
    // Wait for tenant to load before redirecting
    if (tenantLoading) return;
    
    if (!user) {
      navigate('/login');
    } else if (!activeTenant) {
      navigate('/tenant-select');
    }
  }, [user, activeTenant, tenantLoading, navigate]);

  useEffect(() => {
    // When "Repasar" is clicked, start from the beginning - don't load saved progress
    if (shouldRestart) {
      setCurrentStep(0);
      setCompletedExercises([]);
      hasLoadedInitialProgress.current = true;
      return;
    }
    // Load existing progress only once on initial mount
    // Don't reload if user has manually navigated
    if (existingProgress && lesson && !hasLoadedInitialProgress.current && !userHasNavigated.current) {
      const vocab = lesson.content?.vocabulary?.length || 0;
      const exer = lesson.content?.exercises?.length || 0;
      const reading = lesson.content?.reading?.length || 0;
      const listening = lesson.content?.listening?.length || 0;
      const totalSteps = vocab + exer + reading + listening;
      const savedStep = Math.floor((existingProgress.progress_percentage / 100) * totalSteps);
      setCurrentStep(savedStep);
      setCompletedExercises(existingProgress.exercise_results?.completed || []);
      hasLoadedInitialProgress.current = true;
    }
  }, [existingProgress, lesson, shouldRestart]);

  // Reset flags when lesson changes
  useEffect(() => {
    hasLoadedInitialProgress.current = false;
    userHasNavigated.current = false;
  }, [id]);

  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
      setTimeSpent(elapsed);
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      stop();
    };
  }, [startTime, stop]);

  useEffect(() => {
    // Auto-save progress
    if (lesson && currentStep > 0) {
      const vocab = lesson.content?.vocabulary?.length || 0;
      const exer = lesson.content?.exercises?.length || 0;
      const reading = lesson.content?.reading?.length || 0;
      const listening = lesson.content?.listening?.length || 0;
      const totalSteps = vocab + exer + reading + listening;
      const progressPercentage = Math.round((currentStep / totalSteps) * 100);
      
      const saveProgress = async () => {
        try {
          await updateProgress(lesson.id, {
            progress_percentage: progressPercentage,
            time_spent_minutes: timeSpent,
            exercise_results: { completed: completedExercises },
          });
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      };

      const timeoutId = setTimeout(saveProgress, 2000); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, lesson, timeSpent, completedExercises, updateProgress]);

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando organización...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!activeTenant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Selecciona una Organización</h2>
              <p className="text-muted-foreground mb-4">
                Necesitas seleccionar una organización para ver esta lección
              </p>
              <Button onClick={() => navigate('/tenant-select')}>
                Seleccionar Organización
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (lessonsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Lección no encontrada</h2>
              <Button onClick={() => navigate('/lecciones')}>Volver a Lecciones</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const vocabulary = lesson.content?.vocabulary || [];
  const exercises = lesson.content?.exercises || [];
  const readingSections = lesson.content?.reading || [];
  const listeningSections = lesson.content?.listening || [];
  
  // Calculate total steps: vocabulary + exercises + reading sections + listening sections
  const totalSteps = vocabulary.length + exercises.length + readingSections.length + listeningSections.length;
  const progressPercentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const handleComplete = async () => {
    try {
      await updateProgress(lesson.id, {
        progress_percentage: 100,
        completed: true,
        time_spent_minutes: timeSpent,
        exercise_results: { completed: completedExercises },
      });
      
      toast({
        title: "¡Lección completada!",
        description: "Has completado esta lección exitosamente",
      });
      
      navigate("/lecciones");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el progreso",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      userHasNavigated.current = true;
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      userHasNavigated.current = true;
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine current content type and data
  const vocabEnd = vocabulary.length;
  const exercisesEnd = vocabEnd + exercises.length;
  const readingEnd = exercisesEnd + readingSections.length;
  
  const isVocabulary = currentStep < vocabEnd;
  const isExercise = currentStep >= vocabEnd && currentStep < exercisesEnd;
  const isReading = currentStep >= exercisesEnd && currentStep < readingEnd;
  const isListening = currentStep >= readingEnd;
  
  const vocabularyData = isVocabulary ? vocabulary[currentStep] : null;
  const exerciseData = isExercise ? exercises[currentStep - vocabEnd] : null;
  const readingData = isReading ? readingSections[currentStep - exercisesEnd] : null;
  const listeningData = isListening ? listeningSections[currentStep - readingEnd] : null;

  const isCurrentStepCompleted =
    isVocabulary ||
    (isExercise && completedExercises.includes(currentStep - vocabEnd)) ||
    (isReading && completedExercises.includes(currentStep)) ||
    (isListening && completedExercises.includes(currentStep));
  const canGoNext = isCurrentStepCompleted;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/lecciones")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Lecciones
            </Button>
            <Badge variant="secondary">{lesson.level}</Badge>
            <Badge variant="outline">{lesson.type}</Badge>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {lesson.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span>{lesson.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Paso {currentStep + 1} de {totalSteps}</span>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-3 mb-6" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isVocabulary ? (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Vocabulario
                    </>
                  ) : isExercise ? (
                    <>
                      <Target className="w-5 h-5" />
                      Ejercicio
                    </>
                  ) : isReading ? (
                    <>
                      <FileText className="w-5 h-5" />
                      Comprensión de Lectura
                    </>
                  ) : isListening ? (
                    <>
                      <Headphones className="w-5 h-5" />
                      Comprensión Auditiva
                    </>
                  ) : null}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isVocabulary && vocabularyData ? (
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-primary p-8 rounded-xl text-white">
                      <h2 className="text-3xl font-bold mb-2">
                        {vocabularyData.english}
                      </h2>
                      <p className="text-xl opacity-90">
                        {vocabularyData.spanish}
                      </p>
                      <p className="text-sm opacity-75 mt-2">
                        {vocabularyData.pronunciation}
                      </p>
                      {vocabularyData.example && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-sm opacity-90 font-medium mb-1">Ejemplo:</p>
                          <p className="text-lg">{vocabularyData.example}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => {
                          if (isSpeaking) {
                            stop();
                          } else {
                            speak(vocabularyData.english, 'en-US');
                          }
                        }}
                        className="w-full"
                      >
                        <Volume2 className="w-5 h-5 mr-2" />
                        {isSpeaking ? "Detener" : "Pronunciación EN"}
                      </Button>
                      {vocabularyData.example && (
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => {
                            if (isSpeaking) {
                              stop();
                            } else {
                              // Extract English part from example (before the Spanish translation in parentheses)
                              // Handle format: "English text. (Spanish translation.)" or just "English text."
                              let exampleText = vocabularyData.example.trim();
                              
                              // Remove Spanish translation in parentheses if present
                              const parenMatch = exampleText.match(/^([^(]+?)\s*\([^)]+\)\s*\.?$/);
                              if (parenMatch) {
                                exampleText = parenMatch[1].trim();
                              }
                              
                              // Remove trailing period if present
                              exampleText = exampleText.replace(/\.+$/, '').trim();
                              
                              if (exampleText) {
                                speak(exampleText, 'en-US');
                              }
                            }
                          }}
                          className="w-full"
                        >
                          <Volume2 className="w-5 h-5 mr-2" />
                          {isSpeaking ? "Detener" : "Ejemplo EN"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : exerciseData ? (
                  <ExerciseComponent 
                    exercise={exerciseData}
                    exerciseIndex={currentStep - vocabEnd}
                    isCompleted={completedExercises.includes(currentStep - vocabEnd)}
                    onComplete={() => {
                      if (!completedExercises.includes(currentStep - vocabEnd)) {
                        setCompletedExercises([...completedExercises, currentStep - vocabEnd]);
                        toast({
                          title: "¡Ejercicio completado!",
                          description: "Buen trabajo, sigue así.",
                          variant: "default",
                        });
                      }
                    }}
                    speak={speak}
                    stop={stop}
                    isSpeaking={isSpeaking}
                  />
                ) : readingData ? (
                  <ReadingComprehension
                    passage={readingData.passage}
                    title={readingData.title || "Reading Comprehension"}
                    questions={readingData.questions || []}
                    lang={readingData.lang || 'en-US'}
                    onComplete={(score, total) => {
                      if (!completedExercises.includes(currentStep)) {
                        setCompletedExercises([...completedExercises, currentStep]);
                        toast({
                          title: "¡Lectura completada!",
                          description: `Puntuación: ${score}/${total}`,
                          variant: "default",
                        });
                      }
                    }}
                  />
                ) : listeningData ? (
                  <div className="space-y-6">
                    <AudioPlayer
                      audioUrl={listeningData.audioUrl}
                      textToSpeech={listeningData.textToSpeech}
                      lang={listeningData.lang || 'en-US'}
                      title={listeningData.title || "Listening Exercise"}
                      transcript={listeningData.transcript}
                    />
                    {!completedExercises.includes(currentStep) && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCompletedExercises((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
                          toast({ title: "Listo", description: "Puedes continuar al siguiente paso.", variant: "default" });
                        }}
                      >
                        Marcar como escuchado y continuar
                      </Button>
                    )}
                    {listeningData.questions && listeningData.questions.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Preguntas de Comprensión</h3>
                        <div className="space-y-4">
                          {listeningData.questions.map((q: any, qIndex: number) => (
                            <div key={qIndex} className="space-y-2">
                              <p className="font-medium">{q.question}</p>
                              <div className="space-y-2">
                                {q.options?.map((option: string, oIndex: number) => (
                                  <Button
                                    key={oIndex}
                                    variant="outline"
                                    className="w-full text-left justify-start"
                                  >
                                    <span className="font-semibold mr-2">
                                      {String.fromCharCode(65 + oIndex)}.
                                    </span>
                                    {option}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex flex-col gap-2">
              {!canGoNext && (isExercise || isReading || isListening) && (
                <p className="text-sm text-amber-600 dark:text-amber-500 text-center">
                  Completa esta actividad para continuar al siguiente paso.
                </p>
              )}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                {currentStep === totalSteps - 1 ? (
                  <Button variant="success" onClick={handleComplete} disabled={!canGoNext}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completar Lección
                  </Button>
                ) : (
                  <Button variant="lesson" onClick={handleNextStep} disabled={!canGoNext}>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(lesson.objectives || []).map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Tu Progreso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(progressPercentage)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Completado</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vocabulario:</span>
                    <span>{Math.min(currentStep + 1, vocabulary.length)}/{vocabulary.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ejercicios:</span>
                    <span>{completedExercises.filter(e => e < exercisesEnd).length}/{exercises.length}</span>
                  </div>
                  {readingSections.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Lectura:</span>
                      <span>{completedExercises.filter(e => e >= exercisesEnd && e < readingEnd).length}/{readingSections.length}</span>
                    </div>
                  )}
                  {listeningSections.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Escucha:</span>
                      <span>{completedExercises.filter(e => e >= readingEnd).length}/{listeningSections.length}</span>
                    </div>
                  )}
                  {timeSpent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tiempo:</span>
                      <span>{timeSpent} min</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LessonDetail;