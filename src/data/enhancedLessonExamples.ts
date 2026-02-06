/**
 * Enhanced Lesson Examples with Reading and Listening Support
 * These examples show the new content structure that includes:
 * - vocabulary (existing)
 * - exercises (existing)
 * - reading (new) - Reading comprehension sections
 * - listening (new) - Listening comprehension sections
 */

export const enhancedLessonExampleA1 = {
  id: 100,
  title: "My Daily Routine - Enhanced",
  level: "A1",
  duration: "20 min",
  difficulty: "Básico",
  rating: 4.8,
  type: "Vocabulario",
  objectives: [
    "Learn daily routine vocabulary",
    "Practice reading simple texts",
    "Improve listening comprehension",
    "Use present simple tense"
  ],
  content: {
    vocabulary: [
      { english: "Wake up", spanish: "Despertarse", pronunciation: "/weɪk ʌp/" },
      { english: "Get up", spanish: "Levantarse", pronunciation: "/ɡɛt ʌp/" },
      { english: "Brush teeth", spanish: "Cepillarse los dientes", pronunciation: "/brʌʃ tiθ/" },
      { english: "Have breakfast", spanish: "Desayunar", pronunciation: "/hæv ˈbrɛkfəst/" },
      { english: "Go to school", spanish: "Ir a la escuela", pronunciation: "/ɡoʊ tu skul/" },
      { english: "Have lunch", spanish: "Almorzar", pronunciation: "/hæv lʌntʃ/" },
      { english: "Do homework", spanish: "Hacer tarea", pronunciation: "/du ˈhoʊmwɜrk/" },
      { english: "Have dinner", spanish: "Cenar", pronunciation: "/hæv ˈdɪnər/" },
      { english: "Go to bed", spanish: "Ir a la cama", pronunciation: "/ɡoʊ tu bɛd/" }
    ],
    exercises: [
      {
        type: "multiple-choice",
        question: "What do you do in the morning?",
        options: ["Wake up", "Go to bed", "Have dinner", "Do homework"],
        correct: 0
      },
      {
        type: "fill-blank",
        question: "I ___ breakfast at 7:00 AM.",
        answer: "have"
      },
      {
        type: "multiple-choice",
        question: "When do you go to school?",
        options: ["In the morning", "At night", "In the afternoon", "Never"],
        correct: 0
      }
    ],
    reading: [
      {
        title: "Maria's Day",
        passage: `My name is Maria. I am 15 years old. I live in Bogotá, Colombia.

Every morning, I wake up at 6:00. I get up and brush my teeth. Then I have breakfast with my family. I usually eat bread and drink coffee.

At 7:30, I go to school. School starts at 8:00. I study many subjects: English, Math, Science, and History. I like English the most.

At 12:30, I have lunch at school. After school, I go home at 3:00 PM. I do my homework and then I play with my friends.

In the evening, I have dinner with my family at 7:00 PM. After dinner, I watch TV or read a book. I go to bed at 10:00 PM.

I like my daily routine because it is organized and I have time for everything.`,
        questions: [
          {
            question: "What time does Maria wake up?",
            options: ["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM"],
            correct: 1,
            explanation: "The text says 'I wake up at 6:00'"
          },
          {
            question: "What does Maria have for breakfast?",
            options: ["Cereal", "Bread and coffee", "Fruit", "Eggs"],
            correct: 1,
            explanation: "The text says 'I usually eat bread and drink coffee'"
          },
          {
            question: "What time does school start?",
            options: ["7:30", "8:00", "12:30", "3:00"],
            correct: 1,
            explanation: "The text says 'School starts at 8:00'"
          },
          {
            question: "What is Maria's favorite subject?",
            options: ["Math", "Science", "English", "History"],
            correct: 2,
            explanation: "The text says 'I like English the most'"
          },
          {
            question: "What time does Maria go to bed?",
            options: ["9:00 PM", "10:00 PM", "11:00 PM", "12:00 PM"],
            correct: 1,
            explanation: "The text says 'I go to bed at 10:00 PM'"
          }
        ]
      }
    ],
    listening: [
      {
        title: "Listen to the Daily Routine",
        // In production, this would be a URL to an audio file
        // For now, we'll use text-to-speech fallback
        textToSpeech: `Hello! My name is Carlos. I wake up at 6:30 every morning. First, I get up and brush my teeth. Then I take a shower. After that, I have breakfast. I usually eat cereal and drink orange juice. At 7:45, I leave home and go to school. I arrive at school at 8:15. Classes start at 8:30.`,
        lang: "en-US",
        transcript: `Hello! My name is Carlos. I wake up at 6:30 every morning. First, I get up and brush my teeth. Then I take a shower. After that, I have breakfast. I usually eat cereal and drink orange juice. At 7:45, I leave home and go to school. I arrive at school at 8:15. Classes start at 8:30.`,
        questions: [
          {
            question: "What time does Carlos wake up?",
            options: ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM"],
            correct: 1
          },
          {
            question: "What does Carlos have for breakfast?",
            options: ["Bread and coffee", "Cereal and orange juice", "Eggs and toast", "Fruit"],
            correct: 1
          },
          {
            question: "What time do classes start?",
            options: ["7:45", "8:15", "8:30", "9:00"],
            correct: 2
          }
        ]
      }
    ]
  }
};

export const enhancedLessonExampleA2 = {
  id: 101,
  title: "Past Experiences - Enhanced",
  level: "A2",
  duration: "25 min",
  difficulty: "Intermedio",
  rating: 4.7,
  type: "Gramática",
  objectives: [
    "Use past simple tense",
    "Read about past experiences",
    "Listen to past tense conversations",
    "Describe past events"
  ],
  content: {
    vocabulary: [
      { english: "Travel", spanish: "Viajar", pronunciation: "/ˈtrævəl/" },
      { english: "Visit", spanish: "Visitar", pronunciation: "/ˈvɪzɪt/" },
      { english: "Explore", spanish: "Explorar", pronunciation: "/ɪkˈsplɔr/" },
      { english: "Experience", spanish: "Experiencia", pronunciation: "/ɪkˈspɪriəns/" },
      { english: "Adventure", spanish: "Aventura", pronunciation: "/ædˈvɛntʃər/" }
    ],
    exercises: [
      {
        type: "multiple-choice",
        question: "What is the past tense of 'go'?",
        options: ["goed", "went", "gone", "going"],
        correct: 1
      },
      {
        type: "fill-blank",
        question: "Last year, I ___ to Cartagena.",
        answer: "went"
      }
    ],
    reading: [
      {
        title: "My Trip to Medellín",
        passage: `Last summer, I traveled to Medellín with my family. It was my first time visiting this beautiful city. We stayed there for five days.

On the first day, we arrived at the airport in the morning. We took a taxi to our hotel in the center of the city. After checking in, we went to explore the city. We visited the Botero Plaza and saw many beautiful sculptures.

The next day, we took a cable car to the mountains. The view was amazing! We could see the entire city from above. In the afternoon, we visited a coffee farm and learned about coffee production.

On the third day, we went to a traditional market. I bought souvenirs for my friends. We also tried typical Colombian food like arepas and bandeja paisa. It was delicious!

The last two days, we relaxed and enjoyed the city. We went to parks, museums, and restaurants. On our last night, we watched a traditional dance show.

I really enjoyed my trip to Medellín. The people were friendly, the food was great, and the city was beautiful. I want to visit again soon!`,
        questions: [
          {
            question: "How long did the author stay in Medellín?",
            options: ["Three days", "Four days", "Five days", "Six days"],
            correct: 2,
            explanation: "The text says 'We stayed there for five days'"
          },
          {
            question: "What did they see at the Botero Plaza?",
            options: ["Paintings", "Sculptures", "Fountains", "Gardens"],
            correct: 1,
            explanation: "The text says 'We visited the Botero Plaza and saw many beautiful sculptures'"
          },
          {
            question: "What did they learn about at the coffee farm?",
            options: ["Coffee history", "Coffee production", "Coffee prices", "Coffee shops"],
            correct: 1,
            explanation: "The text says 'we visited a coffee farm and learned about coffee production'"
          },
          {
            question: "What traditional food did they try?",
            options: ["Pizza and pasta", "Arepas and bandeja paisa", "Tacos and burritos", "Sushi"],
            correct: 1,
            explanation: "The text mentions 'arepas and bandeja paisa'"
          }
        ]
      }
    ],
    listening: [
      {
        title: "Conversation About Weekend",
        textToSpeech: `A: Hi Sarah! How was your weekend?
B: It was great! On Saturday, I went to the cinema with my friends. We watched a new action movie. It was really exciting!
A: That sounds fun! What did you do on Sunday?
B: On Sunday morning, I visited my grandmother. We had lunch together and talked for hours. In the afternoon, I did some shopping and bought a new dress.
A: Nice! Did you do anything else?
B: Yes! In the evening, I went to a concert with my sister. The music was amazing!
A: Wow! You had a busy weekend!
B: Yes, but it was wonderful!`,
        lang: "en-US",
        transcript: `A: Hi Sarah! How was your weekend?
B: It was great! On Saturday, I went to the cinema with my friends. We watched a new action movie. It was really exciting!
A: That sounds fun! What did you do on Sunday?
B: On Sunday morning, I visited my grandmother. We had lunch together and talked for hours. In the afternoon, I did some shopping and bought a new dress.
A: Nice! Did you do anything else?
B: Yes! In the evening, I went to a concert with my sister. The music was amazing!
A: Wow! You had a busy weekend!
B: Yes, but it was wonderful!`,
        questions: [
          {
            question: "What did Sarah do on Saturday?",
            options: ["Went shopping", "Went to the cinema", "Visited her grandmother", "Went to a concert"],
            correct: 1
          },
          {
            question: "What did Sarah do on Sunday morning?",
            options: ["Went shopping", "Went to the cinema", "Visited her grandmother", "Went to a concert"],
            correct: 2
          },
          {
            question: "Who did Sarah go to the concert with?",
            options: ["Her friends", "Her grandmother", "Her sister", "Her mother"],
            correct: 2
          }
        ]
      }
    ]
  }
};

export const enhancedLessonExampleB1 = {
  id: 102,
  title: "Environmental Issues - Enhanced",
  level: "B1",
  duration: "30 min",
  difficulty: "Intermedio",
  rating: 4.9,
  type: "Cultural",
  objectives: [
    "Discuss environmental problems",
    "Read articles about climate change",
    "Listen to environmental discussions",
    "Express opinions about solutions"
  ],
  content: {
    vocabulary: [
      { english: "Pollution", spanish: "Contaminación", pronunciation: "/pəˈluʃən/" },
      { english: "Climate change", spanish: "Cambio climático", pronunciation: "/ˈklaɪmɪt tʃeɪndʒ/" },
      { english: "Recycle", spanish: "Reciclar", pronunciation: "/riˈsaɪkəl/" },
      { english: "Sustainable", spanish: "Sostenible", pronunciation: "/səˈsteɪnəbəl/" },
      { english: "Renewable energy", spanish: "Energía renovable", pronunciation: "/rɪˈnuəbəl ˈɛnərdʒi/" }
    ],
    exercises: [
      {
        type: "multiple-choice",
        question: "What is the main cause of climate change?",
        options: ["Natural disasters", "Human activities", "Animal behavior", "Ocean currents"],
        correct: 1
      }
    ],
    reading: [
      {
        title: "Protecting Our Planet",
        passage: `Climate change is one of the most serious challenges facing our planet today. Scientists have been studying this problem for decades, and the evidence is clear: human activities are causing the Earth's temperature to rise.

The main cause of climate change is the increase in greenhouse gases, especially carbon dioxide. These gases come from burning fossil fuels like coal, oil, and gas. When we burn these fuels for energy, transportation, and industry, we release carbon dioxide into the atmosphere.

The effects of climate change are already visible. We see more extreme weather events, such as hurricanes, floods, and droughts. Sea levels are rising, and glaciers are melting. Many animal species are in danger because their habitats are changing.

However, there is hope. Many countries are working together to reduce greenhouse gas emissions. They are investing in renewable energy sources like solar and wind power. People are also changing their habits: they are recycling more, using less plastic, and choosing sustainable products.

Individual actions matter too. We can help by using public transportation, reducing energy consumption at home, and supporting companies that care about the environment. Every small action counts in the fight against climate change.

The future of our planet depends on the choices we make today. We need to act quickly and work together to protect the Earth for future generations.`,
        questions: [
          {
            question: "What is the main cause of climate change according to the text?",
            options: ["Natural disasters", "Increase in greenhouse gases", "Animal behavior", "Ocean currents"],
            correct: 1,
            explanation: "The text states 'The main cause of climate change is the increase in greenhouse gases'"
          },
          {
            question: "What are examples of renewable energy sources mentioned?",
            options: ["Coal and oil", "Solar and wind power", "Gas and nuclear", "Hydroelectric and geothermal"],
            correct: 1,
            explanation: "The text mentions 'renewable energy sources like solar and wind power'"
          },
          {
            question: "What individual actions can help fight climate change?",
            options: ["Using more plastic", "Driving more", "Using public transportation", "Ignoring the problem"],
            correct: 2,
            explanation: "The text suggests 'using public transportation, reducing energy consumption'"
          },
          {
            question: "What is the author's main message?",
            options: ["Climate change is not real", "We should give up", "We need to act together", "Nothing can be done"],
            correct: 2,
            explanation: "The text emphasizes 'We need to act quickly and work together'"
          }
        ]
      }
    ],
    listening: [
      {
        title: "Environmental Discussion",
        textToSpeech: `Interviewer: Welcome to our program. Today we're talking about environmental issues with Dr. Martinez, an environmental scientist. Dr. Martinez, what do you think are the most urgent environmental problems we face today?

Dr. Martinez: Well, there are several critical issues. First, climate change is definitely the most urgent. The Earth's temperature is rising, and this affects everything: weather patterns, sea levels, and ecosystems.

Interviewer: What can ordinary people do to help?

Dr. Martinez: There are many things individuals can do. First, reduce energy consumption at home. Turn off lights when you're not using them, use energy-efficient appliances, and consider installing solar panels if possible.

Second, reduce waste. Recycle as much as you can, avoid single-use plastics, and buy products with less packaging. Third, use sustainable transportation. Walk, bike, or use public transport instead of driving alone.

Interviewer: What about governments and companies?

Dr. Martinez: They have a crucial role. Governments need to create policies that encourage renewable energy and protect natural areas. Companies should invest in sustainable practices and reduce their carbon footprint. It's a collective effort - we all need to work together.

Interviewer: Thank you, Dr. Martinez, for these important insights.`,
        lang: "en-US",
        transcript: `Interviewer: Welcome to our program. Today we're talking about environmental issues with Dr. Martinez, an environmental scientist. Dr. Martinez, what do you think are the most urgent environmental problems we face today?

Dr. Martinez: Well, there are several critical issues. First, climate change is definitely the most urgent. The Earth's temperature is rising, and this affects everything: weather patterns, sea levels, and ecosystems.

Interviewer: What can ordinary people do to help?

Dr. Martinez: There are many things individuals can do. First, reduce energy consumption at home. Turn off lights when you're not using them, use energy-efficient appliances, and consider installing solar panels if possible.

Second, reduce waste. Recycle as much as you can, avoid single-use plastics, and buy products with less packaging. Third, use sustainable transportation. Walk, bike, or use public transport instead of driving alone.

Interviewer: What about governments and companies?

Dr. Martinez: They have a crucial role. Governments need to create policies that encourage renewable energy and protect natural areas. Companies should invest in sustainable practices and reduce their carbon footprint. It's a collective effort - we all need to work together.

Interviewer: Thank you, Dr. Martinez, for these important insights.`,
        questions: [
          {
            question: "What does Dr. Martinez say is the most urgent environmental problem?",
            options: ["Pollution", "Climate change", "Deforestation", "Water shortage"],
            correct: 1
          },
          {
            question: "What is one way individuals can reduce energy consumption?",
            options: ["Leave lights on", "Use energy-efficient appliances", "Use more electricity", "Ignore the problem"],
            correct: 1
          },
          {
            question: "What should companies do according to Dr. Martinez?",
            options: ["Ignore environmental issues", "Invest in sustainable practices", "Increase pollution", "Reduce employees"],
            correct: 1
          }
        ]
      }
    ]
  }
};

/**
 * Helper function to convert enhanced lesson to database format
 */
export const convertToLessonFormat = (enhancedLesson: any) => {
  return {
    title: enhancedLesson.title,
    level: enhancedLesson.level,
    duration: enhancedLesson.duration,
    difficulty: enhancedLesson.difficulty,
    rating: enhancedLesson.rating,
    type: enhancedLesson.type,
    objectives: enhancedLesson.objectives,
    content: enhancedLesson.content
  };
};
