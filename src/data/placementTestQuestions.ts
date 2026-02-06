/**
 * Comprehensive Placement Test Questions
 * Tagged by CEFR level (A1, A2, B1, B2)
 * Each question includes: question, options, correct answer index, level, skill
 */

export interface PlacementQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  skill: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  explanation?: string;
}

export const placementTestQuestions: PlacementQuestion[] = [
  // ========== A1 LEVEL QUESTIONS (1-20) ==========
  {
    id: 1,
    question: "How do you say 'Hola' in English?",
    options: ["Hello", "Goodbye", "Thanks", "Please"],
    correct: 0,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 2,
    question: "Complete: I ___ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 3,
    question: "What is 'agua' in English?",
    options: ["Water", "Fire", "Earth", "Air"],
    correct: 0,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 4,
    question: "Complete: She ___ from Colombia.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 5,
    question: "How do you say 'gracias' in English?",
    options: ["Please", "Thank you", "Sorry", "Excuse me"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 6,
    question: "Complete: We ___ friends.",
    options: ["am", "is", "are", "be"],
    correct: 2,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 7,
    question: "What number comes after 'ten'?",
    options: ["Nine", "Eleven", "Twelve", "Thirteen"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 8,
    question: "Complete: ___ you a teacher?",
    options: ["Am", "Is", "Are", "Be"],
    correct: 2,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 9,
    question: "What color is 'rojo' in English?",
    options: ["Blue", "Red", "Green", "Yellow"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 10,
    question: "Complete: My name ___ Juan.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 11,
    question: "What is 'libro' in English?",
    options: ["Book", "Pen", "Table", "Chair"],
    correct: 0,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 12,
    question: "Complete: They ___ students.",
    options: ["am", "is", "are", "be"],
    correct: 2,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 13,
    question: "How do you say 'adiós' in English?",
    options: ["Hello", "Goodbye", "Good morning", "Good night"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 14,
    question: "Complete: ___ is my friend.",
    options: ["He", "She", "It", "They"],
    correct: 0,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 15,
    question: "What is 'casa' in English?",
    options: ["Car", "House", "School", "Hospital"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 16,
    question: "Complete: I ___ happy.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 17,
    question: "What is 'perro' in English?",
    options: ["Cat", "Dog", "Bird", "Fish"],
    correct: 1,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 18,
    question: "Complete: This ___ a book.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    level: 'A1',
    skill: 'grammar'
  },
  {
    id: 19,
    question: "How do you say 'buenos días' in English?",
    options: ["Good night", "Good afternoon", "Good morning", "Goodbye"],
    correct: 2,
    level: 'A1',
    skill: 'vocabulary'
  },
  {
    id: 20,
    question: "Complete: ___ are my friends.",
    options: ["He", "She", "It", "They"],
    correct: 3,
    level: 'A1',
    skill: 'grammar'
  },

  // ========== A2 LEVEL QUESTIONS (21-40) ==========
  {
    id: 21,
    question: "What is the past tense of 'go'?",
    options: ["goed", "went", "gone", "going"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 22,
    question: "Complete: Yesterday I ___ to the cinema.",
    options: ["go", "going", "went", "gone"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 23,
    question: "My brother ___ football every weekend.",
    options: ["play", "plays", "playing", "played"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 24,
    question: "I usually ___ breakfast at 7:00.",
    options: ["do", "have", "make", "take"],
    correct: 1,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 25,
    question: "Bogotá is ___ than my town.",
    options: ["big", "more big", "bigger", "the biggest"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 26,
    question: "You buy medicine at the ___.",
    options: ["bank", "pharmacy", "library", "museum"],
    correct: 1,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 27,
    question: "Complete: She ___ her homework yesterday.",
    options: ["do", "does", "did", "done"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 28,
    question: "What is the past tense of 'eat'?",
    options: ["eated", "ate", "eaten", "eating"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 29,
    question: "I ___ to school by bus every day.",
    options: ["go", "goes", "going", "went"],
    correct: 0,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 30,
    question: "The weather is ___ today.",
    options: ["sun", "sunny", "sunning", "sunned"],
    correct: 1,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 31,
    question: "Complete: We ___ a great time at the party.",
    options: ["have", "has", "had", "having"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 32,
    question: "I need to ___ some groceries.",
    options: ["buy", "buying", "bought", "buys"],
    correct: 0,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 33,
    question: "Complete: He ___ English for two years.",
    options: ["study", "studies", "studied", "studying"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 34,
    question: "What is the opposite of 'expensive'?",
    options: ["cheap", "big", "small", "fast"],
    correct: 0,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 35,
    question: "Complete: They ___ to the beach last summer.",
    options: ["go", "goes", "went", "going"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 36,
    question: "I ___ a letter to my friend yesterday.",
    options: ["write", "writes", "wrote", "writing"],
    correct: 2,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 37,
    question: "What is 'biblioteca' in English?",
    options: ["Bookstore", "Library", "School", "Office"],
    correct: 1,
    level: 'A2',
    skill: 'vocabulary'
  },
  {
    id: 38,
    question: "Complete: She is ___ than her sister.",
    options: ["tall", "taller", "tallest", "more tall"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 39,
    question: "I ___ TV every evening.",
    options: ["watch", "watches", "watched", "watching"],
    correct: 0,
    level: 'A2',
    skill: 'grammar'
  },
  {
    id: 40,
    question: "What is the past tense of 'see'?",
    options: ["seed", "saw", "seen", "seeing"],
    correct: 1,
    level: 'A2',
    skill: 'grammar'
  },

  // ========== B1 LEVEL QUESTIONS (41-60) ==========
  {
    id: 41,
    question: "I ___ English for five years.",
    options: ["study", "have studied", "studied", "am studying"],
    correct: 1,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 42,
    question: "They ___ visit their grandparents next weekend.",
    options: ["are going to", "going to", "will to", "are going"],
    correct: 0,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 43,
    question: "We have to do a lot of ___ for our history exam.",
    options: ["homework", "study", "research", "practice"],
    correct: 2,
    level: 'B1',
    skill: 'vocabulary'
  },
  {
    id: 44,
    question: "If it ___ tomorrow, we will stay at home.",
    options: ["rains", "will rain", "rained", "is raining"],
    correct: 0,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 45,
    question: "Our flight was ___, so we arrived very late.",
    options: ["early", "cancelled", "delayed", "direct"],
    correct: 2,
    level: 'B1',
    skill: 'vocabulary'
  },
  {
    id: 46,
    question: "I wish I ___ more time to study.",
    options: ["have", "had", "has", "having"],
    correct: 1,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 47,
    question: "She ___ her keys when she was leaving.",
    options: ["lose", "loses", "lost", "losing"],
    correct: 2,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 48,
    question: "The movie was so ___ that I fell asleep.",
    options: ["interesting", "boring", "exciting", "funny"],
    correct: 1,
    level: 'B1',
    skill: 'vocabulary'
  },
  {
    id: 49,
    question: "Complete: By the time we arrived, the concert ___.",
    options: ["start", "starts", "had started", "starting"],
    correct: 2,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 50,
    question: "I'm not used to ___ so early.",
    options: ["wake up", "waking up", "woke up", "wakes up"],
    correct: 1,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 51,
    question: "The teacher asked us to ___ our essays.",
    options: ["hand in", "hand out", "hand over", "hand up"],
    correct: 0,
    level: 'B1',
    skill: 'vocabulary'
  },
  {
    id: 52,
    question: "Complete: She ___ be at home. The lights are on.",
    options: ["must", "can", "should", "might"],
    correct: 0,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 53,
    question: "I ___ to the gym three times a week.",
    options: ["used to go", "use to go", "am used to go", "used go"],
    correct: 0,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 54,
    question: "The problem is ___ complex than I thought.",
    options: ["much", "more", "most", "very"],
    correct: 1,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 55,
    question: "I ___ my best friend since we were children.",
    options: ["know", "knew", "have known", "am knowing"],
    correct: 2,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 56,
    question: "The company decided to ___ the project.",
    options: ["give up", "give in", "give out", "give away"],
    correct: 0,
    level: 'B1',
    skill: 'vocabulary'
  },
  {
    id: 57,
    question: "Complete: If I ___ you, I would study harder.",
    options: ["am", "was", "were", "be"],
    correct: 2,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 58,
    question: "The book was ___ interesting that I couldn't put it down.",
    options: ["so", "such", "too", "very"],
    correct: 0,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 59,
    question: "I ___ my homework when my friend called.",
    options: ["do", "did", "was doing", "am doing"],
    correct: 2,
    level: 'B1',
    skill: 'grammar'
  },
  {
    id: 60,
    question: "She's very ___ about her future plans.",
    options: ["anxious", "excited", "worried", "concerned"],
    correct: 1,
    level: 'B1',
    skill: 'vocabulary'
  },

  // ========== B2 LEVEL QUESTIONS (61-80) ==========
  {
    id: 61,
    question: "English ___ in many countries around the world.",
    options: ["speaks", "is speaking", "is spoken", "spoken"],
    correct: 2,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 62,
    question: "The teacher ___ teaches us English is from Canada.",
    options: ["who", "which", "whose", "where"],
    correct: 0,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 63,
    question: "Her main ___ is to improve her speaking skills.",
    options: ["goal", "game", "trip", "problem"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 64,
    question: "He studied very hard; ___, he didn't pass the exam.",
    options: ["however", "because", "so", "in addition"],
    correct: 0,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 65,
    question: "The article provides a clear ___ of the educational system.",
    options: ["decision", "description", "solution", "change"],
    correct: 1,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 66,
    question: "Complete: I wish I ___ harder when I was younger.",
    options: ["study", "studied", "had studied", "would study"],
    correct: 2,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 67,
    question: "The company's profits have ___ significantly this year.",
    options: ["increased", "increased by", "increased to", "increased with"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 68,
    question: "Complete: Not only ___ she speak English, but also French.",
    options: ["does", "do", "did", "is"],
    correct: 0,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 69,
    question: "The research ___ that exercise improves mental health.",
    options: ["suggests", "suggests to", "suggests for", "suggests with"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 70,
    question: "Complete: Had I known about the test, I ___ studied more.",
    options: ["will", "would", "would have", "had"],
    correct: 2,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 71,
    question: "The government needs to ___ measures to reduce pollution.",
    options: ["take", "make", "do", "get"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 72,
    question: "Complete: The book ___ I'm reading is very interesting.",
    options: ["who", "which", "that", "what"],
    correct: 2,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 73,
    question: "She has a ___ understanding of the subject.",
    options: ["comprehensive", "comprehensible", "comprehending", "comprehended"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 74,
    question: "Complete: ___ the weather was bad, we decided to go out.",
    options: ["Although", "Because", "So", "Therefore"],
    correct: 0,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 75,
    question: "The project was ___ due to lack of funding.",
    options: ["abandoned", "abandoning", "abandon", "abandons"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 76,
    question: "Complete: I'd rather you ___ me the truth.",
    options: ["tell", "told", "telling", "to tell"],
    correct: 1,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 77,
    question: "The new policy will have a significant ___ on students.",
    options: ["affect", "effect", "affection", "effective"],
    correct: 1,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 78,
    question: "Complete: It's high time we ___ something about this problem.",
    options: ["do", "did", "doing", "to do"],
    correct: 1,
    level: 'B2',
    skill: 'grammar'
  },
  {
    id: 79,
    question: "The meeting was ___ to discuss the new proposals.",
    options: ["convened", "convening", "convene", "convenes"],
    correct: 0,
    level: 'B2',
    skill: 'vocabulary'
  },
  {
    id: 80,
    question: "Complete: ___ I had more time, I would travel more.",
    options: ["If", "Unless", "Whether", "Even if"],
    correct: 0,
    level: 'B2',
    skill: 'grammar'
  },
];

/**
 * Get questions by level
 */
export const getQuestionsByLevel = (level: 'A1' | 'A2' | 'B1' | 'B2'): PlacementQuestion[] => {
  return placementTestQuestions.filter(q => q.level === level);
};

/**
 * Get adaptive test questions (starts easy, gets harder)
 * Returns 40 questions: 10 A1, 10 A2, 10 B1, 10 B2
 */
export const getAdaptiveTestQuestions = (): PlacementQuestion[] => {
  const a1Questions = getQuestionsByLevel('A1').slice(0, 10);
  const a2Questions = getQuestionsByLevel('A2').slice(0, 10);
  const b1Questions = getQuestionsByLevel('B1').slice(0, 10);
  const b2Questions = getQuestionsByLevel('B2').slice(0, 10);
  
  return [...a1Questions, ...a2Questions, ...b1Questions, ...b2Questions];
};

/**
 * Calculate recommended level based on answers
 */
export const calculateLevel = (answers: number[], questions: PlacementQuestion[]): string => {
  if (answers.length !== questions.length) {
    return 'A1';
  }

  // Calculate scores per level
  const levelScores: Record<string, { correct: number; total: number }> = {
    A1: { correct: 0, total: 0 },
    A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 },
    B2: { correct: 0, total: 0 }
  };

  questions.forEach((q, index) => {
    levelScores[q.level].total++;
    if (answers[index] === q.correct) {
      levelScores[q.level].correct++;
    }
  });

  // Determine level based on performance
  // If student scores well on B2, recommend B2
  // If student scores well on B1 but poorly on B2, recommend B1
  // And so on...
  
  const b2Percentage = levelScores.B2.total > 0 
    ? (levelScores.B2.correct / levelScores.B2.total) * 100 
    : 0;
  const b1Percentage = levelScores.B1.total > 0 
    ? (levelScores.B1.correct / levelScores.B1.total) * 100 
    : 0;
  const a2Percentage = levelScores.A2.total > 0 
    ? (levelScores.A2.correct / levelScores.A2.total) * 100 
    : 0;
  const a1Percentage = levelScores.A1.total > 0 
    ? (levelScores.A1.correct / levelScores.A1.total) * 100 
    : 0;

  if (b2Percentage >= 70) return 'B2';
  if (b1Percentage >= 70) return 'B1';
  if (a2Percentage >= 70) return 'A2';
  if (a1Percentage >= 60) return 'A1';
  
  // Default fallback
  return 'A1';
};
