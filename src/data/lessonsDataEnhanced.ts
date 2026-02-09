/**
 * Enhanced lesson content: extra exercises, reading, and listening sections.
 * Keyed by "title::level" to merge into lessonsData when seeding.
 * Use getEnhancedLessonsData() to get the full lessons object with enhancements applied.
 */

import { lessonsData } from './lessonsData';

export type ContentEnhancement = {
  exercises?: Array<Record<string, unknown>>;
  reading?: Array<{
    title: string;
    passage: string;
    questions: Array<{
      question: string;
      options: string[];
      correct: number;
      explanation?: string;
    }>;
  }>;
  listening?: Array<{
    title: string;
    textToSpeech?: string;
    lang?: string;
    transcript?: string;
    questions?: Array<{
      question: string;
      options: string[];
      correct: number;
    }>;
  }>;
};

const enhancements: Record<string, ContentEnhancement> = {
  'Saludos y Despedidas::A1': {
    // Only extra exercises not already in base lesson (base has MC/fill for Mucho gusto, How are you, name, later + pronunciation Hello/Goodbye)
    exercises: [
      { type: 'multiple-choice', question: "What is 'Good morning' in Spanish?", options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Adiós'], correct: 1 },
      { type: 'fill-blank', question: "Complete: 'Nice to _____ you'", answer: 'meet' },
      { type: 'multiple-choice', question: "Which is informal: 'Hi' or 'Hello'?", options: ['Hello', 'Hi', 'Both', 'Neither'], correct: 1 },
    ],
    reading: [
      {
        title: 'Meeting Someone New',
        passage: `Hello! My name is Ana. I am from Bogotá, Colombia. I am 15 years old.

When I meet someone new, I say "Hello" or "Hi". I ask "What's your name?" and they tell me. Then I say "Nice to meet you". Sometimes I say "Pleased to meet you" – it is more formal.

When I leave, I say "Goodbye" or "Bye". I also say "See you later" or "Have a nice day". My friends say "Take care" to me.

It is important to be polite. I always say "Please" and "Thank you".`,
        questions: [
          { question: "Where is Ana from?", options: ['Medellín', 'Bogotá', 'Cali', 'Barranquilla'], correct: 1, explanation: 'The text says "I am from Bogotá, Colombia".' },
          { question: "What does Ana say when she meets someone new?", options: ['Goodbye', 'Nice to meet you', 'See you later', 'Take care'], correct: 1, explanation: 'She says "Nice to meet you" when she meets someone new.' },
          { question: "Which is more formal?", options: ['Bye', 'Pleased to meet you', 'Hi', 'See you later'], correct: 1, explanation: 'The text says "Pleased to meet you" is more formal.' },
          { question: "What do Ana's friends say when they leave?", options: ['Hello', 'What\'s your name?', 'Take care', 'Please'], correct: 2, explanation: 'The text says "My friends say \'Take care\' to me."' },
        ],
      },
    ],
    listening: [
      {
        title: 'Listen: Greetings',
        textToSpeech: 'Hello! My name is Carlos. I am from Medellín. Nice to meet you! How are you? I am fine, thank you. And you? Goodbye! See you later!',
        lang: 'en-US',
        transcript: 'Hello! My name is Carlos. I am from Medellín. Nice to meet you! How are you? I am fine, thank you. And you? Goodbye! See you later!',
        questions: [
          { question: "What is the speaker's name?", options: ['Ana', 'Carlos', 'María', 'Juan'], correct: 1 },
          { question: "Where is he from?", options: ['Bogotá', 'Cali', 'Medellín', 'Barranquilla'], correct: 2 },
          { question: "What does he say at the end?", options: ['Hello', 'Nice to meet you', 'See you later', 'How are you?'], correct: 2 },
        ],
      },
    ],
  },
  'Números del 1 al 20::A1': {
    exercises: [
      { type: 'multiple-choice', question: '¿Cómo se escribe 7?', options: ['Six', 'Seven', 'Eight', 'Nine'], correct: 1 },
      { type: 'fill-blank', question: '5 + 5 = _____', answer: 'ten' },
      { type: 'multiple-choice', question: '¿Qué número viene después de nineteen?', options: ['Eighteen', 'Twenty', 'Fifteen'], correct: 1 },
      { type: 'fill-blank', question: '12 - 2 = _____', answer: 'ten' },
      { type: 'multiple-choice', question: 'How do you say 15 in English?', options: ['Fiveteen', 'Fifteen', 'Fifty', 'Fiveteen'], correct: 1 },
      { type: 'fill-blank', question: '3 + 4 = _____', answer: 'seven' },
      { type: 'multiple-choice', question: 'Which number is "eleven"?', options: ['10', '11', '12', '13'], correct: 1 },
      { type: 'pronunciation', word: 'Thirteen', pronunciation: '/ˌθɜrˈtin/' },
    ],
  },
  'Los Colores y Objetos::A1': {
    exercises: [
      { type: 'multiple-choice', question: 'What color is the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 1 },
      { type: 'fill-blank', question: 'The ___ is red', answer: 'car' },
      { type: 'multiple-choice', question: "What color is 'naranja' in English?", options: ['Orange', 'Apple', 'Red', 'Yellow'], correct: 0 },
      { type: 'fill-blank', question: 'I read a ___ (libro)', answer: 'book' },
      { type: 'multiple-choice', question: 'You sit on a ___', options: ['Table', 'Chair', 'Book', 'Pen'], correct: 1 },
      { type: 'pronunciation', word: 'Purple', pronunciation: '/ˈpɜrpəl/' },
    ],
  },
  'La Familia en Ingles::A1': {
    exercises: [
      { type: 'multiple-choice', question: "My father's mother is my ___", options: ['Aunt', 'Grandmother', 'Sister'], correct: 1 },
      { type: 'fill-blank', question: "My _____ is my father's son", answer: 'brother' },
      { type: 'multiple-choice', question: "My mother's sister is my ___", options: ['Grandmother', 'Aunt', 'Cousin'], correct: 1 },
      { type: 'fill-blank', question: "My father's father is my _____", answer: 'grandfather' },
      { type: 'pronunciation', word: 'Family', pronunciation: '/ˈfæməli/' },
    ],
  },
  'Comida y Bebidas::A1': {
    exercises: [
      { type: 'multiple-choice', question: 'I drink ___', options: ['Water', 'Bread', 'Chair'], correct: 0 },
      { type: 'fill-blank', question: 'I like ___ for breakfast', answer: 'coffee' },
      { type: 'multiple-choice', question: 'What do you eat in the morning?', options: ['Bread and butter', 'Dinner', 'Lunch'], correct: 0 },
      { type: 'pronunciation', word: 'Chicken', pronunciation: '/ˈtʃɪkən/' },
      { type: 'fill-blank', question: 'An ___ is a fruit', answer: 'apple' },
      { type: 'multiple-choice', question: "What is 'queso' in English?", options: ['Cheese', 'Bread', 'Butter', 'Milk'], correct: 0 },
      { type: 'fill-blank', question: 'I eat _____ and eggs for breakfast', answer: 'bread' },
      { type: 'multiple-choice', question: "What is 'agua' in English?", options: ['Water', 'Milk', 'Juice', 'Coffee'], correct: 0 },
      { type: 'fill-blank', question: 'I have _____ and cereal for breakfast', answer: 'milk' },
      { type: 'multiple-choice', question: 'Which is a vegetable?', options: ['Apple', 'Carrot', 'Banana', 'Orange'], correct: 1 },
    ],
  },
  'El Alfabeto en Inglés::A1': {
    exercises: [
      { type: 'multiple-choice', question: "Which letter sounds like /eɪ/?", options: ['A', 'E', 'I', 'O'], correct: 0 },
      { type: 'fill-blank', question: "Spell 'cat': C - ___ - T", answer: 'A' },
      { type: 'multiple-choice', question: "How many letters are in the English alphabet?", options: ['24', '25', '26', '27'], correct: 2 },
      { type: 'multiple-choice', question: "Which letter comes after 'M'?", options: ['L', 'N', 'O', 'P'], correct: 1 },
      { type: 'fill-blank', question: "The first letter of 'book' is ___", answer: 'B' },
      { type: 'multiple-choice', question: "Which letter is pronounced /waɪ/?", options: ['W', 'Y', 'U', 'I'], correct: 1 },
      { type: 'pronunciation', word: 'Letter', pronunciation: '/ˈlɛtər/' },
      { type: 'fill-blank', question: "Spell 'dog': D - ___ - G", answer: 'O' },
    ],
  },
  'Pronombres Personales::A1': {
    exercises: [
      { type: 'multiple-choice', question: "___ am a student.", options: ['I', 'You', 'He', 'She'], correct: 0 },
      { type: 'fill-blank', question: "___ is my friend. (él)", answer: 'He' },
      { type: 'multiple-choice', question: "___ are from Colombia.", options: ['I', 'You', 'He', 'We'], correct: 3 },
      { type: 'fill-blank', question: "___ is a teacher. (ella)", answer: 'She' },
      { type: 'multiple-choice', question: "What pronoun do we use for a thing?", options: ['He', 'She', 'It', 'They'], correct: 2 },
      { type: 'fill-blank', question: "___ are my classmates.", answer: 'They' },
      { type: 'multiple-choice', question: "Replace 'María and I' with a pronoun.", options: ['We', 'They', 'You', 'Us'], correct: 0 },
      { type: 'pronunciation', word: 'They', pronunciation: '/ðeɪ/' },
    ],
  },
};

/**
 * Returns lessonsData with enhancements merged in.
 * For each lesson, if an enhancement exists for "title::level", we merge:
 * - exercises: append enhancement exercises to existing
 * - reading: use enhancement reading (or add to existing if we had any)
 * - listening: use enhancement listening
 */
export function getEnhancedLessonsData(): Record<number, any> {
  const result: Record<number, any> = {};
  for (const [idStr, lesson] of Object.entries(lessonsData)) {
    const id = Number(idStr);
    const key = `${lesson.title}::${lesson.level}`;
    const enhancement = enhancements[key];
    if (!enhancement) {
      result[id] = { ...lesson };
      continue;
    }
    const content = { ...lesson.content };
    if (enhancement.exercises?.length) {
      content.exercises = [...(content.exercises || []), ...enhancement.exercises];
    }
    if (enhancement.reading?.length) {
      content.reading = [...(content.reading || []), ...enhancement.reading];
    }
    if (enhancement.listening?.length) {
      content.listening = [...(content.listening || []), ...enhancement.listening];
    }
    result[id] = { ...lesson, content };
  }
  return result;
}
