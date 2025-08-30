import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  BookOpen, 
  Volume2,
  ArrowLeft,
  ArrowRight,
  Target,
  Award
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Saludos y Presentaciones",
    description: "Aprende a saludar y presentarte en inglés de manera natural",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.8,
    completed: true,
    type: "Vocabulario",
    progress: 100,
    objectives: [
      "Saludar de manera formal e informal",
      "Presentarte con tu nombre y edad", 
      "Preguntar y responder sobre el origen",
      "Usar expresiones de cortesía básicas"
    ],
    content: {
      vocabulary: [
        { english: "Hello", spanish: "Hola", pronunciation: "/həˈloʊ/" },
        { english: "Good morning", spanish: "Buenos días", pronunciation: "/ɡʊd ˈmɔrnɪŋ/" },
        { english: "My name is...", spanish: "Mi nombre es...", pronunciation: "/maɪ neɪm ɪz/" },
        { english: "Nice to meet you", spanish: "Mucho gusto", pronunciation: "/naɪs tu mit ju/" },
        { english: "Where are you from?", spanish: "¿De dónde eres?", pronunciation: "/wɛr ɑr ju frəm/" },
        { english: "I am from Colombia", spanish: "Soy de Colombia", pronunciation: "/aɪ æm frəm kəˈlʌmbiə/" }
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "¿Cómo dices 'Mucho gusto' en inglés?",
          options: ["Nice to meet you", "How are you?", "Good morning", "See you later"],
          correct: 0
        },
        {
          type: "fill-blank",
          question: "Complete: 'My _____ is María'",
          answer: "name"
        },
        {
          type: "pronunciation",
          word: "Hello",
          pronunciation: "/həˈloʊ/"
        }
      ]
    }
  }
];

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const lesson = lessons.find(l => l.id === parseInt(id || "1"));
  
  if (!lesson) {
    return <div>Lección no encontrada</div>;
  }

  const totalSteps = lesson.content.vocabulary.length + lesson.content.exercises.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleComplete = () => {
    setLessonProgress(100);
    navigate("/lecciones");
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setLessonProgress(((currentStep + 1) / totalSteps) * 100);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setLessonProgress(((currentStep - 1) / totalSteps) * 100);
    }
  };

  const isVocabulary = currentStep < lesson.content.vocabulary.length;
  const vocabularyData = isVocabulary ? lesson.content.vocabulary[currentStep] : null;
  const exerciseData = !isVocabulary ? lesson.content.exercises[currentStep - lesson.content.vocabulary.length] : null;

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
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      Ejercicio
                    </>
                  )}
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
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-full"
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      {isPlaying ? "Pausar" : "Escuchar Pronunciación"}
                    </Button>
                  </div>
                ) : exerciseData ? (
                  <div className="space-y-4">
                    {exerciseData.type === 'multiple-choice' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {exerciseData.question}
                        </h3>
                        <div className="space-y-2">
                          {exerciseData.options?.map((option: string, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left justify-start"
                              onClick={() => {
                                if (index === exerciseData.correct) {
                                  setCompletedExercises([...completedExercises, currentStep]);
                                }
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {exerciseData.type === 'fill-blank' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {exerciseData.question}
                        </h3>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-input rounded-lg"
                          placeholder="Escribe tu respuesta..."
                        />
                      </div>
                    )}
                    
                    {exerciseData.type === 'pronunciation' && (
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold">
                          Practica la pronunciación de:
                        </h3>
                        <div className="bg-muted p-6 rounded-xl">
                          <h2 className="text-2xl font-bold mb-2">
                            {exerciseData.word}
                          </h2>
                          <p className="text-muted-foreground">
                            {exerciseData.pronunciation}
                          </p>
                        </div>
                        <Button variant="lesson" size="lg">
                          <Volume2 className="w-5 h-5 mr-2" />
                          Grabar mi Pronunciación
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Navigation */}
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
                <Button variant="success" onClick={handleComplete}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completar Lección
                </Button>
              ) : (
                <Button variant="lesson" onClick={handleNextStep}>
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
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
                  {lesson.objectives.map((objective, index) => (
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
                    <span>Ejercicios:</span>
                    <span>{completedExercises.length}/{lesson.content.exercises.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vocabulario:</span>
                    <span>{Math.min(currentStep + 1, lesson.content.vocabulary.length)}/{lesson.content.vocabulary.length}</span>
                  </div>
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