import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, BookOpen, Eye, Volume2, Loader2 } from 'lucide-react';

interface ReadingQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface ReadingComprehensionProps {
  passage: string;
  title?: string;
  questions: ReadingQuestion[];
  onComplete?: (score: number, total: number) => void;
  showAnswers?: boolean;
  /** Language for TTS (e.g. 'en-US'). If set, shows "Escuchar texto" to read passage aloud */
  lang?: string;
}

export const ReadingComprehension = ({
  passage,
  title = 'Reading Comprehension',
  questions,
  onComplete,
  showAnswers: initialShowAnswers = false
}: ReadingComprehensionProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(initialShowAnswers);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPassage, setShowPassage] = useState(true);

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (isCompleted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, q, index) => {
      return acc + (selectedAnswers[index] === q.correct ? 1 : 0);
    }, 0);
    setIsCompleted(true);
    setShowAnswers(true);
    onComplete?.(score, questions.length);
  };

  const allAnswered = questions.every((_, index) => selectedAnswers[index] !== undefined);
  const score = isCompleted
    ? questions.reduce((acc, q, index) => {
        return acc + (selectedAnswers[index] === q.correct ? 1 : 0);
      }, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Reading Passage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {passage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={speakPassage}
                  title="Escuchar texto (síntesis de voz)"
                >
                  {isSpeaking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {isSpeaking ? 'Detener' : 'Escuchar texto'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassage(!showPassage)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPassage ? 'Ocultar' : 'Mostrar'} Texto
              </Button>
            </div>
          </div>
        </CardHeader>
        {showPassage && (
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line bg-muted/50 p-6 rounded-lg">
                {passage}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehension Questions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Lee el texto y responde las siguientes preguntas
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q, questionIndex) => {
            const selected = selectedAnswers[questionIndex];
            const isCorrect = selected === q.correct;
            const showResult = showAnswers && selected !== undefined;

            return (
              <div key={questionIndex} className="space-y-3">
                <h4 className="font-semibold text-base">
                  {questionIndex + 1}. {q.question}
                </h4>
                <div className="space-y-2">
                  {q.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const isCorrectOption = optionIndex === q.correct;

                    return (
                      <div key={optionIndex} className="flex gap-2">
                        <Button
                          variant={
                            showResult
                              ? isCorrectOption
                                ? 'default'
                                : isSelected && !isCorrectOption
                                ? 'destructive'
                                : 'outline'
                              : isSelected
                              ? 'default'
                              : 'outline'
                          }
                          className={`flex-1 text-left justify-start ${
                            showResult && isCorrectOption
                              ? 'bg-success text-success-foreground'
                              : ''
                          }`}
                          onClick={() => handleAnswer(questionIndex, optionIndex)}
                          disabled={isCompleted}
                        >
                          {showResult && isCorrectOption && (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          {showResult && isSelected && !isCorrectOption && (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          <span className="font-semibold mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          {option}
                        </Button>
                      </div>
                    );
                  })}
                </div>
                {showResult && q.explanation && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <strong>Explicación:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!isCompleted && (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full"
              size="lg"
            >
              Verificar Respuestas
            </Button>
          )}

          {isCompleted && (
            <div className="space-y-4 pt-4 border-t">
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Puntuación: {score} / {questions.length}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {score === questions.length
                    ? '¡Excelente! Respondiste todas correctamente.'
                    : score >= questions.length * 0.7
                    ? '¡Buen trabajo! Sigue practicando.'
                    : 'Sigue estudiando. Revisa el texto y las respuestas.'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
