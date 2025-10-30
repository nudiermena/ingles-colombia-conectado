export const lessonsData: Record<number, any> = {
  // A1 LESSONS (1-24)
  1: {
    id: 1, title: "Saludos y Despedidas", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Saludar de manera formal e informal", "Presentarte con tu nombre", "Preguntar y responder sobre el origen", "Usar expresiones de cortesía"],
    content: {
      vocabulary: [
        { english: "Hello", spanish: "Hola", pronunciation: "/həˈloʊ/" },
        { english: "Good morning", spanish: "Buenos días", pronunciation: "/ɡʊd ˈmɔrnɪŋ/" },
        { english: "Good afternoon", spanish: "Buenas tardes", pronunciation: "/ɡʊd ˌæftərˈnun/" },
        { english: "Good evening", spanish: "Buenas noches", pronunciation: "/ɡʊd ˈivnɪŋ/" },
        { english: "My name is", spanish: "Mi nombre es", pronunciation: "/maɪ neɪm ɪz/" },
        { english: "Nice to meet you", spanish: "Mucho gusto", pronunciation: "/naɪs tu mit ju/" },
        { english: "How are you?", spanish: "¿Cómo estás?", pronunciation: "/haʊ ɑr ju/" },
        { english: "I'm fine, thank you", spanish: "Estoy bien, gracias", pronunciation: "/aɪm faɪn θæŋk ju/" },
        { english: "Goodbye", spanish: "Adiós", pronunciation: "/ɡʊdˈbaɪ/" },
        { english: "See you later", spanish: "Hasta luego", pronunciation: "/si ju ˈleɪtər/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo dices 'Mucho gusto' en inglés?", options: ["Nice to meet you", "How are you?", "Good morning", "See you later"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'My _____ is María'", answer: "name" },
        { type: "pronunciation", word: "Hello", pronunciation: "/həˈloʊ/" }
      ]
    }
  },
  
  2: {
    id: 2, title: "El Alfabeto en Inglés", level: "A1", duration: "10 min", difficulty: "Básico", rating: 4.9, type: "Pronunciación",
    objectives: ["Pronunciar las 26 letras", "Deletrear palabras básicas", "Entender deletreos", "Practicar con nombres"],
    content: {
      vocabulary: [
        { english: "A", spanish: "A", pronunciation: "/eɪ/" },
        { english: "B", spanish: "B", pronunciation: "/bi/" },
        { english: "C", spanish: "C", pronunciation: "/si/" },
        { english: "D", spanish: "D", pronunciation: "/di/" },
        { english: "E", spanish: "E", pronunciation: "/i/" },
        { english: "F", spanish: "F", pronunciation: "/ɛf/" },
        { english: "G", spanish: "G", pronunciation: "/dʒi/" },
        { english: "H", spanish: "H", pronunciation: "/eɪtʃ/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo se pronuncia 'A'?", options: ["/eɪ/", "/a/", "/æ/", "/ɑ/"], correct: 0 },
        { type: "pronunciation", word: "Alphabet", pronunciation: "/ˈælfəˌbɛt/" }
      ]
    }
  },

  3: {
    id: 3, title: "Números del 1 al 20", level: "A1", duration: "12 min", difficulty: "Básico", rating: 4.7, type: "Vocabulario",
    objectives: ["Contar del 1 al 20", "Decir tu edad", "Preguntar cantidades"],
    content: {
      vocabulary: [
        { english: "One", spanish: "Uno", pronunciation: "/wʌn/" },
        { english: "Two", spanish: "Dos", pronunciation: "/tu/" },
        { english: "Three", spanish: "Tres", pronunciation: "/θri/" },
        { english: "Four", spanish: "Cuatro", pronunciation: "/fɔr/" },
        { english: "Five", spanish: "Cinco", pronunciation: "/faɪv/" },
        { english: "Ten", spanish: "Diez", pronunciation: "/tɛn/" },
        { english: "Fifteen", spanish: "Quince", pronunciation: "/ˌfɪfˈtin/" },
        { english: "Twenty", spanish: "Veinte", pronunciation: "/ˈtwɛnti/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo se escribe 7?", options: ["Six", "Seven", "Eight", "Nine"], correct: 1 },
        { type: "fill-blank", question: "5 + 5 = _____", answer: "ten" }
      ]
    }
  },

  4: {
    id: 4, title: "Colores Básicos", level: "A1", duration: "8 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Identificar colores básicos", "Describir objetos por color", "Preguntar por colores"],
    content: {
      vocabulary: [
        { english: "Red", spanish: "Rojo", pronunciation: "/rɛd/" },
        { english: "Blue", spanish: "Azul", pronunciation: "/blu/" },
        { english: "Green", spanish: "Verde", pronunciation: "/ɡrin/" },
        { english: "Yellow", spanish: "Amarillo", pronunciation: "/ˈjɛloʊ/" },
        { english: "Black", spanish: "Negro", pronunciation: "/blæk/" },
        { english: "White", spanish: "Blanco", pronunciation: "/waɪt/" },
        { english: "Orange", spanish: "Naranja", pronunciation: "/ˈɔrɪndʒ/" },
        { english: "Purple", spanish: "Morado", pronunciation: "/ˈpɜrpəl/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "What color is the sky?", options: ["Red", "Blue", "Green", "Yellow"], correct: 1 },
        { type: "pronunciation", word: "Purple", pronunciation: "/ˈpɜrpəl/" }
      ]
    }
  },

  5: {
    id: 5, title: "Pronombres Personales", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.6, type: "Gramática",
    objectives: ["Usar I, you, he, she, it", "Diferenciar we, they", "Usar pronombres correctamente"],
    content: {
      vocabulary: [
        { english: "I", spanish: "Yo", pronunciation: "/aɪ/" },
        { english: "You", spanish: "Tú/Usted", pronunciation: "/ju/" },
        { english: "He", spanish: "Él", pronunciation: "/hi/" },
        { english: "She", spanish: "Ella", pronunciation: "/ʃi/" },
        { english: "It", spanish: "Eso/Ello", pronunciation: "/ɪt/" },
        { english: "We", spanish: "Nosotros", pronunciation: "/wi/" },
        { english: "They", spanish: "Ellos/Ellas", pronunciation: "/ðeɪ/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "María is a girl. _____ is smart", options: ["He", "She", "It", "They"], correct: 1 },
        { type: "fill-blank", question: "_____ am a student", answer: "I" }
      ]
    }
  },

  6: {
    id: 6, title: "Verbo 'To Be' - Presente", level: "A1", duration: "25 min", difficulty: "Básico", rating: 4.7, type: "Gramática",
    objectives: ["Conjugar to be", "Formar oraciones afirmativas", "Hacer preguntas"],
    content: {
      vocabulary: [
        { english: "I am", spanish: "Yo soy/estoy", pronunciation: "/aɪ æm/" },
        { english: "You are", spanish: "Tú eres/estás", pronunciation: "/ju ɑr/" },
        { english: "He is", spanish: "Él es/está", pronunciation: "/hi ɪz/" },
        { english: "She is", spanish: "Ella es/está", pronunciation: "/ʃi ɪz/" },
        { english: "We are", spanish: "Nosotros somos", pronunciation: "/wi ɑr/" },
        { english: "They are", spanish: "Ellos son", pronunciation: "/ðeɪ ɑr/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "Complete: I _____ happy", options: ["am", "is", "are"], correct: 0 },
        { type: "fill-blank", question: "She _____ a teacher", answer: "is" }
      ]
    }
  },

  7: {
    id: 7, title: "Días de la Semana", level: "A1", duration: "10 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Aprender los días", "Preguntar qué día es", "Hacer planes"],
    content: {
      vocabulary: [
        { english: "Monday", spanish: "Lunes", pronunciation: "/ˈmʌndeɪ/" },
        { english: "Tuesday", spanish: "Martes", pronunciation: "/ˈtuzdeɪ/" },
        { english: "Wednesday", spanish: "Miércoles", pronunciation: "/ˈwɛnzdeɪ/" },
        { english: "Thursday", spanish: "Jueves", pronunciation: "/ˈθɜrzdeɪ/" },
        { english: "Friday", spanish: "Viernes", pronunciation: "/ˈfraɪdeɪ/" },
        { english: "Saturday", spanish: "Sábado", pronunciation: "/ˈsætərdeɪ/" },
        { english: "Sunday", spanish: "Domingo", pronunciation: "/ˈsʌndeɪ/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "What day comes after Monday?", options: ["Sunday", "Tuesday", "Friday"], correct: 1 },
        { type: "pronunciation", word: "Wednesday", pronunciation: "/ˈwɛnzdeɪ/" }
      ]
    }
  },

  8: {
    id: 8, title: "La Familia", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.9, type: "Vocabulario",
    objectives: ["Vocabulario familiar", "Hablar de tu familia", "Describir relaciones"],
    content: {
      vocabulary: [
        { english: "Mother", spanish: "Madre", pronunciation: "/ˈmʌðər/" },
        { english: "Father", spanish: "Padre", pronunciation: "/ˈfɑðər/" },
        { english: "Sister", spanish: "Hermana", pronunciation: "/ˈsɪstər/" },
        { english: "Brother", spanish: "Hermano", pronunciation: "/ˈbrʌðər/" },
        { english: "Grandmother", spanish: "Abuela", pronunciation: "/ˈɡrændˌmʌðər/" },
        { english: "Grandfather", spanish: "Abuelo", pronunciation: "/ˈɡrændˌfɑðər/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "My father's mother is my ___", options: ["Aunt", "Grandmother", "Sister"], correct: 1 },
        { type: "fill-blank", question: "My _____ is my father's son", answer: "brother" }
      ]
    }
  },

  // Continue with remaining A1 lessons (9-24)...
  9: { id: 9, title: "Meses del Año", level: "A1", duration: "12 min", difficulty: "Básico", rating: 4.7, type: "Vocabulario", objectives: ["Aprender los 12 meses", "Hablar de fechas"], content: { vocabulary: [{ english: "January", spanish: "Enero", pronunciation: "/ˈdʒænjuˌɛri/" }, { english: "February", spanish: "Febrero", pronunciation: "/ˈfɛbruˌɛri/" }], exercises: [{ type: "pronunciation", word: "February", pronunciation: "/ˈfɛbruˌɛri/" }] } },
  10: { id: 10, title: "Adjetivos Básicos", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Describir personas y cosas"], content: { vocabulary: [{ english: "Big", spanish: "Grande", pronunciation: "/bɪɡ/" }, { english: "Small", spanish: "Pequeño", pronunciation: "/smɔl/" }], exercises: [{ type: "multiple-choice", question: "The opposite of 'big' is ___", options: ["Small", "Tall", "Short"], correct: 0 }] } },
  11: { id: 11, title: "Artículos: A, An, The", level: "A1", duration: "22 min", difficulty: "Básico", rating: 4.6, type: "Gramática", objectives: ["Usar artículos correctamente"], content: { vocabulary: [{ english: "A cat", spanish: "Un gato", pronunciation: "/ə kæt/" }, { english: "An apple", spanish: "Una manzana", pronunciation: "/æn ˈæpəl/" }], exercises: [{ type: "fill-blank", question: "I have ___ dog", answer: "a" }] } },
  12: { id: 12, title: "Preguntas con WH", level: "A1", duration: "25 min", difficulty: "Básico", rating: 4.7, type: "Gramática", objectives: ["Hacer preguntas básicas"], content: { vocabulary: [{ english: "What", spanish: "Qué", pronunciation: "/wʌt/" }, { english: "Where", spanish: "Dónde", pronunciation: "/wɛr/" }], exercises: [{ type: "multiple-choice", question: "___ is your name?", options: ["What", "Where", "When"], correct: 0 }] } },
  13: { id: 13, title: "El Clima", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Hablar del tiempo"], content: { vocabulary: [{ english: "Sunny", spanish: "Soleado", pronunciation: "/ˈsʌni/" }, { english: "Rainy", spanish: "Lluvioso", pronunciation: "/ˈreɪni/" }], exercises: [{ type: "pronunciation", word: "Weather", pronunciation: "/ˈwɛðər/" }] } },
  14: { id: 14, title: "Comida y Bebidas", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.9, type: "Vocabulario", objectives: ["Vocabulario de alimentos"], content: { vocabulary: [{ english: "Water", spanish: "Agua", pronunciation: "/ˈwɔtər/" }, { english: "Bread", spanish: "Pan", pronunciation: "/brɛd/" }], exercises: [{ type: "multiple-choice", question: "I drink ___", options: ["Water", "Bread", "Chair"], correct: 0 }] } },
  15: { id: 15, title: "En el Restaurante", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.7, type: "Conversación", objectives: ["Ordenar comida"], content: { vocabulary: [{ english: "Menu", spanish: "Menú", pronunciation: "/ˈmɛnju/" }, { english: "I would like", spanish: "Me gustaría", pronunciation: "/aɪ wʊd laɪk/" }], exercises: [{ type: "fill-blank", question: "I would ___ a coffee", answer: "like" }] } },
  16: { id: 16, title: "Partes del Cuerpo", level: "A1", duration: "14 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Identificar partes del cuerpo"], content: { vocabulary: [{ english: "Head", spanish: "Cabeza", pronunciation: "/hɛd/" }, { english: "Hand", spanish: "Mano", pronunciation: "/hænd/" }], exercises: [{ type: "pronunciation", word: "Shoulder", pronunciation: "/ˈʃoʊldər/" }] } },
  17: { id: 17, title: "Presente Simple", level: "A1", duration: "28 min", difficulty: "Básico", rating: 4.6, type: "Gramática", objectives: ["Formar presente simple"], content: { vocabulary: [{ english: "I work", spanish: "Yo trabajo", pronunciation: "/aɪ wɜrk/" }, { english: "She studies", spanish: "Ella estudia", pronunciation: "/ʃi ˈstʌdiz/" }], exercises: [{ type: "fill-blank", question: "He ___ every day", answer: "works" }] } },
  18: { id: 18, title: "La Hora", level: "A1", duration: "16 min", difficulty: "Básico", rating: 4.7, type: "Vocabulario", objectives: ["Decir la hora"], content: { vocabulary: [{ english: "It's 3 o'clock", spanish: "Son las 3", pronunciation: "/ɪts θri əˈklɑk/" }], exercises: [{ type: "multiple-choice", question: "What time is it? 2:00", options: ["Two o'clock", "Three o'clock"], correct: 0 }] } },
  19: { id: 19, title: "Lugares en la Ciudad", level: "A1", duration: "17 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Vocabulario de lugares"], content: { vocabulary: [{ english: "Bank", spanish: "Banco", pronunciation: "/bæŋk/" }, { english: "Hospital", spanish: "Hospital", pronunciation: "/ˈhɑspɪtəl/" }], exercises: [{ type: "pronunciation", word: "Supermarket", pronunciation: "/ˈsupərˌmɑrkɪt/" }] } },
  20: { id: 20, title: "Direcciones", level: "A1", duration: "19 min", difficulty: "Básico", rating: 4.7, type: "Conversación", objectives: ["Dar direcciones"], content: { vocabulary: [{ english: "Turn left", spanish: "Gira a la izquierda", pronunciation: "/tɜrn lɛft/" }, { english: "Go straight", spanish: "Sigue recto", pronunciation: "/ɡoʊ streɪt/" }], exercises: [{ type: "fill-blank", question: "Turn _____ at the corner", answer: "right" }] } },
  21: { id: 21, title: "La Ropa", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Vocabulario de ropa"], content: { vocabulary: [{ english: "Shirt", spanish: "Camisa", pronunciation: "/ʃɜrt/" }, { english: "Pants", spanish: "Pantalones", pronunciation: "/pænts/" }], exercises: [{ type: "multiple-choice", question: "I wear ___ on my feet", options: ["Shoes", "Hat", "Shirt"], correct: 0 }] } },
  22: { id: 22, title: "Hobbies", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.9, type: "Conversación", objectives: ["Hablar de pasatiempos"], content: { vocabulary: [{ english: "I like reading", spanish: "Me gusta leer", pronunciation: "/aɪ laɪk ˈridɪŋ/" }], exercises: [{ type: "fill-blank", question: "I love _____ music", answer: "listening" }] } },
  23: { id: 23, title: "En la Casa", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Partes de la casa"], content: { vocabulary: [{ english: "Kitchen", spanish: "Cocina", pronunciation: "/ˈkɪtʃən/" }, { english: "Bedroom", spanish: "Dormitorio", pronunciation: "/ˈbɛdrum/" }], exercises: [{ type: "pronunciation", word: "Bathroom", pronunciation: "/ˈbæθrum/" }] } },
  24: { id: 24, title: "Repaso Final A1", level: "A1", duration: "30 min", difficulty: "Básico", rating: 4.9, type: "Evaluación", objectives: ["Repasar todo A1"], content: { vocabulary: [{ english: "Review", spanish: "Repaso", pronunciation: "/rɪˈvju/" }], exercises: [{ type: "multiple-choice", question: "I ___ a student", options: ["am", "is", "are"], correct: 0 }] } },

  // A2 LESSONS (25-56) - 32 lessons
  25: { id: 25, title: "Presente Continuo", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Formar presente continuo", "Describir acciones en curso"], content: { vocabulary: [{ english: "I am working", spanish: "Estoy trabajando", pronunciation: "/aɪ æm ˈwɜrkɪŋ/" }, { english: "She is eating", spanish: "Ella está comiendo", pronunciation: "/ʃi ɪz ˈitɪŋ/" }], exercises: [{ type: "fill-blank", question: "He ___ (run) now", answer: "is running" }, { type: "multiple-choice", question: "They ___ playing", options: ["am", "is", "are"], correct: 2 }] } },
  26: { id: 26, title: "Pasado Simple", level: "A2", duration: "30 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Formar pasado simple", "Verbos regulares e irregulares"], content: { vocabulary: [{ english: "I worked", spanish: "Trabajé", pronunciation: "/aɪ wɜrkt/" }, { english: "I went", spanish: "Fui", pronunciation: "/aɪ wɛnt/" }], exercises: [{ type: "fill-blank", question: "Yesterday I ___ (go) to school", answer: "went" }] } },
  27: { id: 27, title: "Adverbios de Frecuencia", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Gramática", objectives: ["Always, usually, sometimes, never"], content: { vocabulary: [{ english: "Always", spanish: "Siempre", pronunciation: "/ˈɔlweɪz/" }, { english: "Never", spanish: "Nunca", pronunciation: "/ˈnɛvər/" }], exercises: [{ type: "multiple-choice", question: "I ___ drink coffee", options: ["always", "yesterday"], correct: 0 }] } },
  28: { id: 28, title: "Comparativos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Comparar cosas y personas"], content: { vocabulary: [{ english: "Bigger", spanish: "Más grande", pronunciation: "/ˈbɪɡər/" }, { english: "More beautiful", spanish: "Más hermoso", pronunciation: "/mɔr ˈbjutəfəl/" }], exercises: [{ type: "fill-blank", question: "She is ___ than me (tall)", answer: "taller" }] } },
  29: { id: 29, title: "Superlativos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["El más, la más"], content: { vocabulary: [{ english: "The biggest", spanish: "El más grande", pronunciation: "/ðə ˈbɪɡɪst/" }], exercises: [{ type: "multiple-choice", question: "She is ___ smartest", options: ["a", "an", "the"], correct: 2 }] } },
  30: { id: 30, title: "Preposiciones de Lugar", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["In, on, under, between"], content: { vocabulary: [{ english: "On the table", spanish: "Sobre la mesa", pronunciation: "/ɑn ðə ˈteɪbəl/" }, { english: "Under the bed", spanish: "Debajo de la cama", pronunciation: "/ˈʌndər ðə bɛd/" }], exercises: [{ type: "fill-blank", question: "The book is ___ the table", answer: "on" }] } },
  31: { id: 31, title: "Modal: Can/Could", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Expresar habilidad y posibilidad"], content: { vocabulary: [{ english: "I can swim", spanish: "Puedo nadar", pronunciation: "/aɪ kæn swɪm/" }, { english: "Could you help?", spanish: "¿Podrías ayudar?", pronunciation: "/kʊd ju hɛlp/" }], exercises: [{ type: "multiple-choice", question: "___ you play piano?", options: ["Can", "Are", "Do"], correct: 0 }] } },
  32: { id: 32, title: "Vocabulario de Trabajo", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Profesiones y lugares de trabajo"], content: { vocabulary: [{ english: "Teacher", spanish: "Profesor", pronunciation: "/ˈtitʃər/" }, { english: "Office", spanish: "Oficina", pronunciation: "/ˈɔfɪs/" }], exercises: [{ type: "pronunciation", word: "Engineer", pronunciation: "/ˌɛndʒɪˈnɪr/" }] } },
  
  // Continue with more A2 lessons (33-56)...
  33: { id: 33, title: "En el Aeropuerto", level: "A2", duration: "23 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Check-in, gate, boarding"], content: { vocabulary: [{ english: "Flight", spanish: "Vuelo", pronunciation: "/flaɪt/" }, { english: "Passport", spanish: "Pasaporte", pronunciation: "/ˈpæspɔrt/" }], exercises: [{ type: "fill-blank", question: "Show me your ___, please", answer: "passport" }] } },
  34: { id: 34, title: "Haciendo Compras", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Conversación", objectives: ["Precios, tallas, devoluciones"], content: { vocabulary: [{ english: "How much", spanish: "Cuánto cuesta", pronunciation: "/haʊ mʌtʃ/" }], exercises: [{ type: "multiple-choice", question: "___  is this shirt?", options: ["How much", "How many"], correct: 0 }] } },
  35: { id: 35, title: "Futuro con Will", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Planes futuros"], content: { vocabulary: [{ english: "I will go", spanish: "Iré", pronunciation: "/aɪ wɪl ɡoʊ/" }], exercises: [{ type: "fill-blank", question: "She ___ travel tomorrow", answer: "will" }] } },
  36: { id: 36, title: "Futuro con Going To", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Intenciones futuras"], content: { vocabulary: [{ english: "I'm going to study", spanish: "Voy a estudiar", pronunciation: "/aɪm ˈɡoʊɪŋ tu ˈstʌdi/" }], exercises: [{ type: "multiple-choice", question: "He ___ visit his family", options: ["is going to", "will going", "going"], correct: 0 }] } },
  37: { id: 37, title: "Comida y Nutrición", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Alimentos saludables"], content: { vocabulary: [{ english: "Vegetables", spanish: "Verduras", pronunciation: "/ˈvɛdʒtəbəlz/" }, { english: "Healthy", spanish: "Saludable", pronunciation: "/ˈhɛlθi/" }], exercises: [{ type: "pronunciation", word: "Nutritious", pronunciation: "/nuˈtrɪʃəs/" }] } },
  38: { id: 38, title: "Deportes", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", objectives: ["Vocabulario deportivo"], content: { vocabulary: [{ english: "Soccer", spanish: "Fútbol", pronunciation: "/ˈsɑkər/" }, { english: "Basketball", spanish: "Baloncesto", pronunciation: "/ˈbæskɪtˌbɔl/" }], exercises: [{ type: "fill-blank", question: "I play ___ every weekend", answer: "soccer" }] } },
  39: { id: 39, title: "Tecnología", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.7, type: "Vocabulario", objectives: ["Dispositivos y apps"], content: { vocabulary: [{ english: "Computer", spanish: "Computadora", pronunciation: "/kəmˈpjutər/" }, { english: "Download", spanish: "Descargar", pronunciation: "/ˈdaʊnˌloʊd/" }], exercises: [{ type: "pronunciation", word: "Application", pronunciation: "/ˌæplɪˈkeɪʃən/" }] } },
  40: { id: 40, title: "Medio Ambiente", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.6, type: "Vocabulario", objectives: ["Naturaleza y ecología"], content: { vocabulary: [{ english: "Recycle", spanish: "Reciclar", pronunciation: "/riˈsaɪkəl/" }, { english: "Environment", spanish: "Medio ambiente", pronunciation: "/ɪnˈvaɪrənmənt/" }], exercises: [{ type: "fill-blank", question: "We should ___ plastic", answer: "recycle" }] } },
  41: { id: 41, title: "Modal: Should/Must", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Consejos y obligaciones"], content: { vocabulary: [{ english: "You should study", spanish: "Deberías estudiar", pronunciation: "/ju ʃʊd ˈstʌdi/" }], exercises: [{ type: "multiple-choice", question: "You ___ eat healthy", options: ["should", "can", "will"], correct: 0 }] } },
  42: { id: 42, title: "Conectores", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Gramática", objectives: ["And, but, or, because"], content: { vocabulary: [{ english: "Because", spanish: "Porque", pronunciation: "/bɪˈkɔz/" }], exercises: [{ type: "fill-blank", question: "I stayed home ___ it rained", answer: "because" }] } },
  43: { id: 43, title: "Experiencias", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Hablar del pasado"], content: { vocabulary: [{ english: "I have been to", spanish: "He estado en", pronunciation: "/aɪ hæv bin tu/" }], exercises: [{ type: "multiple-choice", question: "Have you ___ been to Paris?", options: ["ever", "never", "always"], correct: 0 }] } },
  44: { id: 44, title: "Expresiones de Tiempo", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Yesterday, tomorrow, last week"], content: { vocabulary: [{ english: "Last week", spanish: "La semana pasada", pronunciation: "/læst wik/" }], exercises: [{ type: "fill-blank", question: "I saw him ___ month", answer: "last" }] } },
  45: { id: 45, title: "Describiendo Personas", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", objectives: ["Apariencia física y personalidad"], content: { vocabulary: [{ english: "Tall", spanish: "Alto", pronunciation: "/tɔl/" }, { english: "Friendly", spanish: "Amable", pronunciation: "/ˈfrɛndli/" }], exercises: [{ type: "pronunciation", word: "Personality", pronunciation: "/ˌpɜrsəˈnæləti/" }] } },
  46: { id: 46, title: "Sentimientos", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Expresar emociones"], content: { vocabulary: [{ english: "Happy", spanish: "Feliz", pronunciation: "/ˈhæpi/" }, { english: "Sad", spanish: "Triste", pronunciation: "/sæd/" }], exercises: [{ type: "fill-blank", question: "I feel ___ today", answer: "happy" }] } },
  47: { id: 47, title: "En el Médico", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Síntomas y tratamientos"], content: { vocabulary: [{ english: "Pain", spanish: "Dolor", pronunciation: "/peɪn/" }, { english: "Medicine", spanish: "Medicina", pronunciation: "/ˈmɛdɪsən/" }], exercises: [{ type: "multiple-choice", question: "I have a ___", options: ["headache", "head", "hurt"], correct: 0 }] } },
  48: { id: 48, title: "Cuantificadores", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Some, any, much, many"], content: { vocabulary: [{ english: "Some water", spanish: "Algo de agua", pronunciation: "/sʌm ˈwɔtər/" }], exercises: [{ type: "fill-blank", question: "Do you have ___ questions?", answer: "any" }] } },
  49: { id: 49, title: "Actividades de Tiempo Libre", level: "A2", duration: "23 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Entretenimiento"], content: { vocabulary: [{ english: "Cinema", spanish: "Cine", pronunciation: "/ˈsɪnəmə/" }, { english: "Concert", spanish: "Concierto", pronunciation: "/ˈkɑnsərt/" }], exercises: [{ type: "pronunciation", word: "Entertainment", pronunciation: "/ˌɛntərˈteɪnmənt/" }] } },
  50: { id: 50, title: "Rutinas Diarias", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Describir tu día"], content: { vocabulary: [{ english: "Wake up", spanish: "Despertarse", pronunciation: "/weɪk ʌp/" }, { english: "Get dressed", spanish: "Vestirse", pronunciation: "/ɡɛt drɛst/" }], exercises: [{ type: "fill-blank", question: "I ___ up at 7am", answer: "wake" }] } },
  51: { id: 51, title: "Pasado Continuo", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Acciones en progreso en el pasado"], content: { vocabulary: [{ english: "I was studying", spanish: "Estaba estudiando", pronunciation: "/aɪ wʌz ˈstʌdiɪŋ/" }], exercises: [{ type: "multiple-choice", question: "She ___ watching TV", options: ["was", "were", "is"], correct: 0 }] } },
  52: { id: 52, title: "Dando Consejos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Conversación", objectives: ["Why don't you, How about"], content: { vocabulary: [{ english: "Why don't you", spanish: "¿Por qué no", pronunciation: "/waɪ doʊnt ju/" }], exercises: [{ type: "fill-blank", question: "___ about going to the park?", answer: "How" }] } },
  53: { id: 53, title: "Problemas y Soluciones", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Expresar problemas"], content: { vocabulary: [{ english: "Problem", spanish: "Problema", pronunciation: "/ˈprɑbləm/" }, { english: "Solution", spanish: "Solución", pronunciation: "/səˈluʃən/" }], exercises: [{ type: "pronunciation", word: "Difficulty", pronunciation: "/ˈdɪfɪkəlti/" }] } },
  54: { id: 54, title: "Pronombres Objeto", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Me, you, him, her, us, them"], content: { vocabulary: [{ english: "Call me", spanish: "Llámame", pronunciation: "/kɔl mi/" }], exercises: [{ type: "fill-blank", question: "I love ___ (she)", answer: "her" }] } },
  55: { id: 55, title: "Vocabulario de Viaje", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", objectives: ["Hotel, turismo, transporte"], content: { vocabulary: [{ english: "Reservation", spanish: "Reservación", pronunciation: "/ˌrɛzərˈveɪʃən/" }, { english: "Suitcase", spanish: "Maleta", pronunciation: "/ˈsutˌkeɪs/" }], exercises: [{ type: "pronunciation", word: "Accommodation", pronunciation: "/əˌkɑməˈdeɪʃən/" }] } },
  56: { id: 56, title: "Repaso Final A2", level: "A2", duration: "35 min", difficulty: "Intermedio", rating: 4.8, type: "Evaluación", objectives: ["Evaluar conocimientos A2"], content: { vocabulary: [{ english: "Comprehensive review", spanish: "Repaso completo", pronunciation: "/ˌkɑmprɪˈhɛnsɪv rɪˈvju/" }], exercises: [{ type: "multiple-choice", question: "I ___ to the beach yesterday", options: ["go", "went", "going"], correct: 1 }] } },

  // B1 LESSONS (57-96) - 40 lessons
  57: { id: 57, title: "Presente Perfecto", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["Have/has + participio"], content: { vocabulary: [{ english: "I have seen", spanish: "He visto", pronunciation: "/aɪ hæv sin/" }], exercises: [{ type: "fill-blank", question: "She ___ (visit) Paris", answer: "has visited" }] } },
  58: { id: 58, title: "Presente Perfecto Continuo", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.6, type: "Gramática", objectives: ["Acciones que comenzaron en el pasado"], content: { vocabulary: [{ english: "I have been working", spanish: "He estado trabajando", pronunciation: "/aɪ hæv bin ˈwɜrkɪŋ/" }], exercises: [{ type: "multiple-choice", question: "She ___ been studying", options: ["have", "has", "is"], correct: 1 }] } },
  59: { id: 59, title: "Voz Pasiva", level: "B1", duration: "35 min", difficulty: "Avanzado", rating: 4.5, type: "Gramática", objectives: ["Formar oraciones pasivas"], content: { vocabulary: [{ english: "The car was made", spanish: "El carro fue hecho", pronunciation: "/ðə kɑr wʌz meɪd/" }], exercises: [{ type: "fill-blank", question: "The book ___ written by him", answer: "was" }] } },
  60: { id: 60, title: "Condicionales Tipo 1", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["If + presente, will"], content: { vocabulary: [{ english: "If it rains, I will stay", spanish: "Si llueve, me quedaré", pronunciation: "/ɪf ɪt reɪnz aɪ wɪl steɪ/" }], exercises: [{ type: "multiple-choice", question: "If you study, you ___ pass", options: ["will", "would", "can"], correct: 0 }] } },
  61: { id: 61, title: "Condicionales Tipo 2", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.6, type: "Gramática", objectives: ["If + pasado, would"], content: { vocabulary: [{ english: "If I had time, I would travel", spanish: "Si tuviera tiempo, viajaría", pronunciation: "/ɪf aɪ hæd taɪm aɪ wʊd ˈtrævəl/" }], exercises: [{ type: "fill-blank", question: "If I ___ rich, I would buy a house", answer: "were" }] } },
  62: { id: 62, title: "Reported Speech", level: "B1", duration: "33 min", difficulty: "Avanzado", rating: 4.5, type: "Gramática", objectives: ["Estilo indirecto"], content: { vocabulary: [{ english: "He said that", spanish: "Él dijo que", pronunciation: "/hi sɛd ðæt/" }], exercises: [{ type: "multiple-choice", question: "She said she ___ tired", options: ["is", "was", "been"], correct: 1 }] } },
  63: { id: 63, title: "Phrasal Verbs 1", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Get up, give up, look for"], content: { vocabulary: [{ english: "Look for", spanish: "Buscar", pronunciation: "/lʊk fɔr/" }], exercises: [{ type: "fill-blank", question: "I'm looking ___ my keys", answer: "for" }] } },
  64: { id: 64, title: "Phrasal Verbs 2", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.7, type: "Vocabulario", objectives: ["Turn on, turn off, put on"], content: { vocabulary: [{ english: "Turn on", spanish: "Encender", pronunciation: "/tɜrn ɑn/" }], exercises: [{ type: "pronunciation", word: "Turn off", pronunciation: "/tɜrn ɔf/" }] } },
  65: { id: 65, title: "Modal Verbs Avanzado", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.6, type: "Gramática", objectives: ["May, might, must"], content: { vocabulary: [{ english: "It might rain", spanish: "Podría llover", pronunciation: "/ɪt maɪt reɪn/" }], exercises: [{ type: "multiple-choice", question: "You ___ be tired", options: ["must", "can", "will"], correct: 0 }] } },
  66: { id: 66, title: "Artículos Avanzado", level: "B1", duration: "27 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["Uso avanzado de artículos"], content: { vocabulary: [{ english: "The United States", spanish: "Estados Unidos", pronunciation: "/ðə juˈnaɪtɪd steɪts/" }], exercises: [{ type: "fill-blank", question: "___ sun is bright", answer: "The" }] } },
  67: { id: 67, title: "Gerundios e Infinitivos", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.5, type: "Gramática", objectives: ["Like + -ing, want + to"], content: { vocabulary: [{ english: "I enjoy swimming", spanish: "Disfruto nadar", pronunciation: "/aɪ ɪnˈdʒɔɪ ˈswɪmɪŋ/" }], exercises: [{ type: "multiple-choice", question: "I want ___ learn", options: ["to", "for", "at"], correct: 0 }] } },
  68: { id: 68, title: "Vocabulario de Negocios", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Reuniones, emails, presentaciones"], content: { vocabulary: [{ english: "Meeting", spanish: "Reunión", pronunciation: "/ˈmitɪŋ/" }], exercises: [{ type: "pronunciation", word: "Presentation", pronunciation: "/ˌprɛzənˈteɪʃən/" }] } },
  69: { id: 69, title: "Cartas Formales", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.7, type: "Escritura", objectives: ["Estructura de cartas"], content: { vocabulary: [{ english: "Dear Sir", spanish: "Estimado señor", pronunciation: "/dɪr sɜr/" }], exercises: [{ type: "fill-blank", question: "Yours ___", answer: "sincerely" }] } },
  70: { id: 70, title: "Expresiones Idiomáticas", level: "B1", duration: "29 min", difficulty: "Avanzado", rating: 4.9, type: "Vocabulario", objectives: ["Modismos comunes"], content: { vocabulary: [{ english: "Break a leg", spanish: "Buena suerte", pronunciation: "/breɪk ə lɛɡ/" }], exercises: [{ type: "pronunciation", word: "Piece of cake", pronunciation: "/pis ʌv keɪk/" }] } },
  71: { id: 71, title: "Cultura Anglosajona", level: "B1", duration: "26 min", difficulty: "Avanzado", rating: 4.8, type: "Cultural", objectives: ["Costumbres y tradiciones"], content: { vocabulary: [{ english: "Thanksgiving", spanish: "Día de Acción de Gracias", pronunciation: "/ˌθæŋksˈɡɪvɪŋ/" }], exercises: [{ type: "multiple-choice", question: "When is Independence Day?", options: ["July 4", "December 25"], correct: 0 }] } },
  72: { id: 72, title: "Literatura en Inglés", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.6, type: "Cultural", objectives: ["Autores y obras"], content: { vocabulary: [{ english: "Novel", spanish: "Novela", pronunciation: "/ˈnɑvəl/" }], exercises: [{ type: "pronunciation", word: "Shakespeare", pronunciation: "/ˈʃeɪkspɪr/" }] } },
  73: { id: 73, title: "Debates y Opiniones", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.7, type: "Conversación", objectives: ["Expresar y defender opiniones"], content: { vocabulary: [{ english: "In my opinion", spanish: "En mi opinión", pronunciation: "/ɪn maɪ əˈpɪnjən/" }], exercises: [{ type: "fill-blank", question: "I ___ agree with you", answer: "don't" }] } },
  74: { id: 74, title: "Entrevistas de Trabajo", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.9, type: "Conversación", objectives: ["Preparar entrevistas"], content: { vocabulary: [{ english: "Strengths", spanish: "Fortalezas", pronunciation: "/strɛŋθs/" }, { english: "Weaknesses", spanish: "Debilidades", pronunciation: "/ˈwiknəsɪz/" }], exercises: [{ type: "multiple-choice", question: "What are your ___?", options: ["strengths", "strong", "strength"], correct: 0 }] } },
  75: { id: 75, title: "Verbos Compuestos Avanzado", level: "B1", duration: "31 min", difficulty: "Avanzado", rating: 4.6, type: "Gramática", objectives: ["Phrasal verbs complejos"], content: { vocabulary: [{ english: "Put up with", spanish: "Tolerar", pronunciation: "/pʊt ʌp wɪð/" }], exercises: [{ type: "fill-blank", question: "I can't put ___ with this", answer: "up" }] } },
  76: { id: 76, title: "Vocabulario Académico", level: "B1", duration: "29 min", difficulty: "Avanzado", rating: 4.7, type: "Vocabulario", objectives: ["Universidad y estudios"], content: { vocabulary: [{ english: "Thesis", spanish: "Tesis", pronunciation: "/ˈθisɪs/" }], exercises: [{ type: "pronunciation", word: "Research", pronunciation: "/rɪˈsɜrtʃ/" }] } },
  77: { id: 77, title: "Inglés Científico", level: "B1", duration: "33 min", difficulty: "Avanzado", rating: 4.5, type: "Vocabulario", objectives: ["Términos científicos"], content: { vocabulary: [{ english: "Hypothesis", spanish: "Hipótesis", pronunciation: "/haɪˈpɑθəsɪs/" }], exercises: [{ type: "multiple-choice", question: "A scientific ___", options: ["experiment", "experience"], correct: 0 }] } },
  78: { id: 78, title: "Medios de Comunicación", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Prensa, TV, radio"], content: { vocabulary: [{ english: "Headline", spanish: "Titular", pronunciation: "/ˈhɛdlaɪn/" }], exercises: [{ type: "fill-blank", question: "Read the ___", answer: "newspaper" }] } },
  79: { id: 79, title: "Cláusulas Relativas", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.6, type: "Gramática", objectives: ["Who, which, that"], content: { vocabulary: [{ english: "The man who", spanish: "El hombre que", pronunciation: "/ðə mæn hu/" }], exercises: [{ type: "multiple-choice", question: "The book ___ I read", options: ["that", "what", "where"], correct: 0 }] } },
  80: { id: 80, title: "Conectores Avanzados", level: "B1", duration: "29 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["However, therefore, moreover"], content: { vocabulary: [{ english: "However", spanish: "Sin embargo", pronunciation: "/haʊˈɛvər/" }], exercises: [{ type: "fill-blank", question: "I'm tired, ___, I'll continue", answer: "however" }] } },
  81: { id: 81, title: "Vocabulario Médico", level: "B1", duration: "27 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Enfermedades y tratamientos"], content: { vocabulary: [{ english: "Prescription", spanish: "Receta", pronunciation: "/prɪˈskrɪpʃən/" }], exercises: [{ type: "pronunciation", word: "Diagnosis", pronunciation: "/ˌdaɪəɡˈnoʊsɪs/" }] } },
  82: { id: 82, title: "Arte y Cultura", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.7, type: "Vocabulario", objectives: ["Museos, galerías, exposiciones"], content: { vocabulary: [{ english: "Exhibition", spanish: "Exposición", pronunciation: "/ˌɛksəˈbɪʃən/" }], exercises: [{ type: "fill-blank", question: "Visit the art ___", answer: "gallery" }] } },
  83: { id: 83, title: "Películas y Entretenimiento", level: "B1", duration: "26 min", difficulty: "Avanzado", rating: 4.9, type: "Conversación", objectives: ["Hablar de cine"], content: { vocabulary: [{ english: "Plot", spanish: "Trama", pronunciation: "/plɑt/" }], exercises: [{ type: "multiple-choice", question: "The ___ was amazing", options: ["plot", "plat", "plote"], correct: 0 }] } },
  84: { id: 84, title: "Música", level: "B1", duration: "25 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Instrumentos y géneros"], content: { vocabulary: [{ english: "Guitar", spanish: "Guitarra", pronunciation: "/ɡɪˈtɑr/" }], exercises: [{ type: "pronunciation", word: "Orchestra", pronunciation: "/ˈɔrkɪstrə/" }] } },
  85: { id: 85, title: "Inversión y Dinero", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.6, type: "Vocabulario", objectives: ["Finanzas personales"], content: { vocabulary: [{ english: "Savings", spanish: "Ahorros", pronunciation: "/ˈseɪvɪŋz/" }], exercises: [{ type: "fill-blank", question: "I need to ___ money", answer: "save" }] } },
  86: { id: 86, title: "Condicionales Mixtos", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.5, type: "Gramática", objectives: ["Combinaciones de condicionales"], content: { vocabulary: [{ english: "If I had studied", spanish: "Si hubiera estudiado", pronunciation: "/ɪf aɪ hæd ˈstʌdid/" }], exercises: [{ type: "multiple-choice", question: "If I ___ known", options: ["had", "have", "has"], correct: 0 }] } },
  87: { id: 87, title: "Wish y Hope", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["Expresar deseos"], content: { vocabulary: [{ english: "I wish I could", spanish: "Ojalá pudiera", pronunciation: "/aɪ wɪʃ aɪ kʊd/" }], exercises: [{ type: "fill-blank", question: "I ___ you the best", answer: "wish" }] } },
  88: { id: 88, title: "Used to", level: "B1", duration: "27 min", difficulty: "Avanzado", rating: 4.8, type: "Gramática", objectives: ["Hábitos pasados"], content: { vocabulary: [{ english: "I used to play", spanish: "Solía jugar", pronunciation: "/aɪ just tu pleɪ/" }], exercises: [{ type: "multiple-choice", question: "I ___ to live there", options: ["used", "use", "using"], correct: 0 }] } },
  89: { id: 89, title: "Question Tags", level: "B1", duration: "26 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", objectives: ["Preguntas de confirmación"], content: { vocabulary: [{ english: "Isn't it?", spanish: "¿Verdad?", pronunciation: "/ˈɪzənt ɪt/" }], exercises: [{ type: "fill-blank", question: "She's beautiful, ___ she?", answer: "isn't" }] } },
  90: { id: 90, title: "Sufijos y Prefijos", level: "B1", duration: "29 min", difficulty: "Avanzado", rating: 4.6, type: "Vocabulario", objectives: ["Formación de palabras"], content: { vocabulary: [{ english: "Unhappy", spanish: "Infeliz", pronunciation: "/ʌnˈhæpi/" }], exercises: [{ type: "multiple-choice", question: "Un + happy = ___", options: ["Unhappy", "Dishappy"], correct: 0 }] } },
  91: { id: 91, title: "Palabras Homófonas", level: "B1", duration: "25 min", difficulty: "Avanzado", rating: 4.8, type: "Vocabulario", objectives: ["Their/there/they're"], content: { vocabulary: [{ english: "Their house", spanish: "Su casa", pronunciation: "/ðɛr haʊs/" }], exercises: [{ type: "fill-blank", question: "___ going to the store", answer: "They're" }] } },
  92: { id: 92, title: "False Friends", level: "B1", duration: "27 min", difficulty: "Avanzado", rating: 4.7, type: "Vocabulario", objectives: ["Falsos cognados"], content: { vocabulary: [{ english: "Actually", spanish: "En realidad", pronunciation: "/ˈæktʃuəli/" }], exercises: [{ type: "pronunciation", word: "Eventually", pronunciation: "/ɪˈvɛntʃuəli/" }] } },
  93: { id: 93, title: "Pronunciación Avanzada", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.9, type: "Pronunciación", objectives: ["Sonidos difíciles"], content: { vocabulary: [{ english: "Through", spanish: "A través", pronunciation: "/θru/" }], exercises: [{ type: "pronunciation", word: "Throughout", pronunciation: "/θruˈaʊt/" }] } },
  94: { id: 94, title: "Preparación IELTS", level: "B1", duration: "35 min", difficulty: "Avanzado", rating: 4.6, type: "Evaluación", objectives: ["Tips para el examen"], content: { vocabulary: [{ english: "Speaking section", spanish: "Sección oral", pronunciation: "/ˈspikɪŋ ˈsɛkʃən/" }], exercises: [{ type: "multiple-choice", question: "IELTS has ___ sections", options: ["4", "3", "5"], correct: 0 }] } },
  95: { id: 95, title: "Preparación TOEFL", level: "B1", duration: "35 min", difficulty: "Avanzado", rating: 4.7, type: "Evaluación", objectives: ["Estructura del examen"], content: { vocabulary: [{ english: "Reading comprehension", spanish: "Comprensión de lectura", pronunciation: "/ˈridɪŋ ˌkɑmprɪˈhɛnʃən/" }], exercises: [{ type: "fill-blank", question: "TOEFL tests your English ___", answer: "proficiency" }] } },
  96: { id: 96, title: "Repaso Final B1", level: "B1", duration: "40 min", difficulty: "Avanzado", rating: 4.8, type: "Evaluación", objectives: ["Evaluar nivel B1 completo"], content: { vocabulary: [{ english: "Congratulations", spanish: "Felicidades", pronunciation: "/kənˌɡrætʃuˈleɪʃənz/" }], exercises: [{ type: "multiple-choice", question: "You have ___ completed B1", options: ["successfully", "success", "succeed"], correct: 0 }] } }
};
