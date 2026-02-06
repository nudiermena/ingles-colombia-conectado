# Enhanced Lessons & Placement Test Guide

## 🎉 New Features

Your English learning platform now supports:

1. **Audio/Listening Capabilities** - Audio player with support for audio files and text-to-speech fallback
2. **Reading Comprehension** - Interactive reading passages with comprehension questions
3. **Comprehensive Placement Test** - 80 questions across A1-B2 levels with intelligent level recommendation

---

## 📚 Enhanced Lesson Content Structure

Lessons now support four content types in the `content` JSONB field:

### 1. Vocabulary (Existing)
```json
{
  "vocabulary": [
    {
      "english": "Hello",
      "spanish": "Hola",
      "pronunciation": "/həˈloʊ/",
      "example": "Hello, how are you? (Hola, ¿cómo estás?)"
    }
  ]
}
```

### 2. Exercises (Existing)
```json
{
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "How do you say 'Hola'?",
      "options": ["Hello", "Goodbye", "Thanks"],
      "correct": 0,
      "explanation": "Hello is the correct translation"
    }
  ]
}
```

### 3. Reading (NEW)
```json
{
  "reading": [
    {
      "title": "My Daily Routine",
      "passage": "My name is Maria. I wake up at 6:00...",
      "questions": [
        {
          "question": "What time does Maria wake up?",
          "options": ["5:00", "6:00", "7:00"],
          "correct": 1,
          "explanation": "The text says 'I wake up at 6:00'"
        }
      ]
    }
  ]
}
```

### 4. Listening (NEW)
```json
{
  "listening": [
    {
      "title": "Listen to the Conversation",
      "audioUrl": "https://example.com/audio.mp3",  // Optional: URL to audio file
      "textToSpeech": "Hello, my name is...",  // Fallback: text for TTS
      "lang": "en-US",
      "transcript": "Full transcript of the audio...",
      "questions": [
        {
          "question": "What is the speaker's name?",
          "options": ["Maria", "Carlos", "Ana"],
          "correct": 1
        }
      ]
    }
  ]
}
```

---

## 🎧 Audio Player Component

The `AudioPlayer` component supports:

- **Audio Files**: Play MP3/WAV files from URLs (Supabase Storage or external)
- **Text-to-Speech Fallback**: Automatically uses browser TTS if no audio URL provided
- **Progress Tracking**: Shows playback progress and time
- **Transcript**: Optional transcript display for accessibility

### Usage in Lessons

```typescript
import { AudioPlayer } from '@/components/lesson/AudioPlayer';

<AudioPlayer
  audioUrl="https://storage.supabase.co/audio/lesson1.mp3"  // Optional
  textToSpeech="Hello, welcome to the lesson..."  // Fallback
  lang="en-US"
  title="Listening Exercise"
  transcript="Full transcript here..."
/>
```

---

## 📖 Reading Comprehension Component

The `ReadingComprehension` component provides:

- **Passage Display**: Large, readable text with show/hide toggle
- **Multiple Choice Questions**: Interactive questions with immediate feedback
- **Score Tracking**: Automatic scoring and feedback
- **Explanations**: Optional explanations for each question

### Usage in Lessons

```typescript
import { ReadingComprehension } from '@/components/lesson/ReadingComprehension';

<ReadingComprehension
  passage="Long reading passage here..."
  title="Reading: My Daily Routine"
  questions={[
    {
      question: "What time does she wake up?",
      options: ["6:00", "7:00", "8:00"],
      correct: 0,
      explanation: "The text states..."
    }
  ]}
  onComplete={(score, total) => {
    console.log(`Score: ${score}/${total}`);
  }}
/>
```

---

## 🎯 Enhanced Placement Test

### Features

- **80 Questions Total**: 20 questions per level (A1, A2, B1, B2)
- **Adaptive Testing**: Starts with A1, progresses to higher levels
- **Intelligent Scoring**: Analyzes performance per level to recommend the best starting point
- **Detailed Results**: Shows breakdown by level and overall score

### Question Structure

Each question includes:
- `id`: Unique identifier
- `question`: The question text
- `options`: Array of answer choices
- `correct`: Index of correct answer (0-based)
- `level`: CEFR level (A1, A2, B1, B2)
- `skill`: Type (grammar, vocabulary, reading, listening)
- `explanation`: Optional explanation

### Level Recommendation Logic

The system calculates scores per level:
- **B2 ≥ 70%**: Recommended B2
- **B1 ≥ 70%**: Recommended B1
- **A2 ≥ 70%**: Recommended A2
- **A1 ≥ 60%**: Recommended A1
- **Default**: A1

---

## 📝 Creating Enhanced Lessons

### Option 1: Using Admin Panel

1. Go to `/admin` → "Lecciones" tab
2. Click "Nueva Lección"
3. Fill in basic information (title, level, type, etc.)
4. In the Content JSON field, include all four sections:

```json
{
  "vocabulary": [...],
  "exercises": [...],
  "reading": [...],
  "listening": [...]
}
```

### Option 2: Using Seed Scripts

See `src/data/enhancedLessonExamples.ts` for complete examples.

Update your seed script to include reading and listening sections:

```typescript
const lesson = {
  title: "My Daily Routine",
  level: "A1",
  // ... other fields
  content: {
    vocabulary: [...],
    exercises: [...],
    reading: [
      {
        title: "Maria's Day",
        passage: "My name is Maria...",
        questions: [...]
      }
    ],
    listening: [
      {
        title: "Listen to Carlos",
        textToSpeech: "Hello! My name is Carlos...",
        lang: "en-US",
        transcript: "...",
        questions: [...]
      }
    ]
  }
};
```

---

## 🎨 UI Components

### New Components Created

1. **`src/components/lesson/AudioPlayer.tsx`**
   - Audio playback with progress
   - TTS fallback support
   - Transcript display

2. **`src/components/lesson/ReadingComprehension.tsx`**
   - Reading passage display
   - Interactive questions
   - Score tracking

### Updated Components

1. **`src/pages/LessonDetail.tsx`**
   - Now supports reading and listening sections
   - Sequential navigation through all content types
   - Progress tracking for all sections

2. **`src/pages/PlacementTest.tsx`**
   - Uses comprehensive question bank
   - Adaptive testing logic
   - Detailed results breakdown

---

## 📊 Data Files

### New Files

- `src/data/placementTestQuestions.ts` - 80 placement test questions
- `src/data/enhancedLessonExamples.ts` - Example lessons with reading/listening

### Question Bank Structure

```typescript
export const placementTestQuestions: PlacementQuestion[] = [
  // A1 questions (1-20)
  // A2 questions (21-40)
  // B1 questions (41-60)
  // B2 questions (61-80)
];

// Helper functions:
getQuestionsByLevel('A1')  // Get all A1 questions
getAdaptiveTestQuestions()  // Get 40 questions (10 per level)
calculateLevel(answers, questions)  // Calculate recommended level
```

---

## 🚀 Usage Examples

### Example 1: A1 Lesson with Reading

```typescript
{
  "title": "My Family",
  "level": "A1",
  "content": {
    "vocabulary": [
      { "english": "Mother", "spanish": "Madre", "pronunciation": "/ˈmʌðər/" }
    ],
    "reading": [
      {
        "title": "My Family",
        "passage": "I have a big family. I have a mother, a father, and two sisters...",
        "questions": [
          {
            "question": "How many sisters does the author have?",
            "options": ["One", "Two", "Three", "Four"],
            "correct": 1
          }
        ]
      }
    ]
  }
}
```

### Example 2: A2 Lesson with Listening

```typescript
{
  "title": "Past Experiences",
  "level": "A2",
  "content": {
    "listening": [
      {
        "title": "Weekend Conversation",
        "textToSpeech": "A: How was your weekend? B: It was great! I went to...",
        "lang": "en-US",
        "transcript": "Full transcript...",
        "questions": [
          {
            "question": "What did the person do on the weekend?",
            "options": ["Stayed home", "Went to the beach", "Visited friends"],
            "correct": 2
          }
        ]
      }
    ]
  }
}
```

---

## 🔧 Technical Details

### Audio Support

- **Primary**: Audio file URLs (MP3, WAV, OGG)
- **Fallback**: Browser Text-to-Speech API
- **Storage**: Can use Supabase Storage or external URLs

### Reading Support

- **Format**: Plain text passages
- **Questions**: Multiple choice with explanations
- **Scoring**: Automatic score calculation

### Progress Tracking

All content types are tracked in lesson progress:
- Vocabulary items viewed
- Exercises completed
- Reading sections completed
- Listening sections completed

---

## 📈 Next Steps

### Recommended Enhancements

1. **Audio File Upload**
   - Add file upload to Supabase Storage
   - Link audio files to lessons
   - Support multiple audio formats

2. **More Question Types**
   - True/False questions
   - Fill-in-the-blank for reading
   - Drag-and-drop exercises

3. **Advanced Placement Test**
   - Adaptive algorithm (stop when level determined)
   - Speaking assessment
   - Writing sample

4. **Analytics**
   - Track reading/listening completion rates
   - Identify difficult questions
   - Student performance analytics

---

## 📚 Resources

- **Example Lessons**: `src/data/enhancedLessonExamples.ts`
- **Placement Questions**: `src/data/placementTestQuestions.ts`
- **Components**: `src/components/lesson/`
- **Pages**: `src/pages/LessonDetail.tsx`, `src/pages/PlacementTest.tsx`

---

## ❓ FAQ

**Q: Can I use both audio files and text-to-speech?**
A: Yes! If `audioUrl` is provided, it will be used. Otherwise, `textToSpeech` will be used as fallback.

**Q: How many reading/listening sections can a lesson have?**
A: As many as needed! They're stored as arrays, so you can have multiple reading passages or listening exercises per lesson.

**Q: Can I add images to reading passages?**
A: Currently, reading passages support text only. Images can be added by including image URLs in the passage text using Markdown or HTML (if your renderer supports it).

**Q: How accurate is the placement test?**
A: The test uses 80 questions across 4 levels. The recommendation algorithm analyzes performance per level to provide accurate placement. For best results, students should answer honestly.

---

## 🎓 Best Practices

1. **Reading Passages**
   - Keep A1 passages short (50-100 words)
   - A2: 100-200 words
   - B1: 200-300 words
   - B2: 300-500 words

2. **Listening Exercises**
   - A1: 30-60 seconds
   - A2: 1-2 minutes
   - B1: 2-3 minutes
   - B2: 3-5 minutes

3. **Questions**
   - 3-5 questions per reading/listening section
   - Mix comprehension and inference questions
   - Include explanations for learning

4. **Placement Test**
   - Students should complete in one sitting
   - No time limit, but recommend 15-20 minutes
   - Encourage honest answers

---

**Happy Teaching! 🎉**
