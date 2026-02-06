export const lessonsData: Record<number, any> = {
  // A1 LESSONS (1-24)
  1: {
    id: 1, title: "Saludos y Despedidas", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Saludar de manera formal e informal", "Presentarte con tu nombre", "Preguntar y responder sobre el origen", "Usar expresiones de cortesía"],
    content: {
      vocabulary: [
        { english: "Hello", spanish: "Hola", pronunciation: "/həˈloʊ/" },
        { english: "Hi", spanish: "Hola (informal)", pronunciation: "/haɪ/" },
        { english: "Good morning", spanish: "Buenos días", pronunciation: "/ɡʊd ˈmɔrnɪŋ/" },
        { english: "Good afternoon", spanish: "Buenas tardes", pronunciation: "/ɡʊd ˌæftərˈnun/" },
        { english: "Good evening", spanish: "Buenas noches", pronunciation: "/ɡʊd ˈivnɪŋ/" },
        { english: "Good night", spanish: "Buenas noches (despedida)", pronunciation: "/ɡʊd naɪt/" },
        { english: "My name is", spanish: "Mi nombre es", pronunciation: "/maɪ neɪm ɪz/" },
        { english: "What's your name?", spanish: "¿Cómo te llamas?", pronunciation: "/wʌts jʊr neɪm/" },
        { english: "Nice to meet you", spanish: "Mucho gusto", pronunciation: "/naɪs tu mit ju/" },
        { english: "Pleased to meet you", spanish: "Encantado de conocerte", pronunciation: "/plizd tu mit ju/" },
        { english: "How are you?", spanish: "¿Cómo estás?", pronunciation: "/haʊ ɑr ju/" },
        { english: "I'm fine, thank you", spanish: "Estoy bien, gracias", pronunciation: "/aɪm faɪn θæŋk ju/" },
        { english: "And you?", spanish: "¿Y tú?", pronunciation: "/ænd ju/" },
        { english: "Goodbye", spanish: "Adiós", pronunciation: "/ɡʊdˈbaɪ/" },
        { english: "Bye", spanish: "Adiós (informal)", pronunciation: "/baɪ/" },
        { english: "See you later", spanish: "Hasta luego", pronunciation: "/si ju ˈleɪtər/" },
        { english: "See you soon", spanish: "Hasta pronto", pronunciation: "/si ju sun/" },
        { english: "Have a nice day", spanish: "Que tengas un buen día", pronunciation: "/hæv ə naɪs deɪ/" },
        { english: "Take care", spanish: "Cuídate", pronunciation: "/teɪk kɛr/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo dices 'Mucho gusto' en inglés?", options: ["Nice to meet you", "How are you?", "Good morning", "See you later"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'My _____ is María'", answer: "name" },
        { type: "multiple-choice", question: "¿Qué respondes a 'How are you?'", options: ["I'm fine, thank you", "My name is", "Goodbye", "Hello"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'See you _____' (después)", answer: "later" },
        { type: "pronunciation", word: "Hello", pronunciation: "/həˈloʊ/" },
        { type: "pronunciation", word: "Goodbye", pronunciation: "/ɡʊdˈbaɪ/" }
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
        { english: "H", spanish: "H", pronunciation: "/eɪtʃ/" },
        { english: "I", spanish: "I", pronunciation: "/aɪ/" },
        { english: "J", spanish: "J", pronunciation: "/dʒeɪ/" },
        { english: "K", spanish: "K", pronunciation: "/keɪ/" },
        { english: "L", spanish: "L", pronunciation: "/ɛl/" },
        { english: "M", spanish: "M", pronunciation: "/ɛm/" },
        { english: "N", spanish: "N", pronunciation: "/ɛn/" },
        { english: "O", spanish: "O", pronunciation: "/oʊ/" },
        { english: "P", spanish: "P", pronunciation: "/pi/" },
        { english: "Q", spanish: "Q", pronunciation: "/kju/" },
        { english: "R", spanish: "R", pronunciation: "/ɑr/" },
        { english: "S", spanish: "S", pronunciation: "/ɛs/" },
        { english: "T", spanish: "T", pronunciation: "/ti/" },
        { english: "U", spanish: "U", pronunciation: "/ju/" },
        { english: "V", spanish: "V", pronunciation: "/vi/" },
        { english: "W", spanish: "W", pronunciation: "/ˈdʌbəlju/" },
        { english: "X", spanish: "X", pronunciation: "/ɛks/" },
        { english: "Y", spanish: "Y", pronunciation: "/waɪ/" },
        { english: "Z", spanish: "Z", pronunciation: "/zi/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo se pronuncia 'A'?", options: ["/eɪ/", "/a/", "/æ/", "/ɑ/"], correct: 0 },
        { type: "multiple-choice", question: "¿Cómo se pronuncia 'W'?", options: ["/ˈdʌbəlju/", "/wi/", "/waɪ/", "/vɛ/"], correct: 0 },
        { type: "fill-blank", question: "La última letra del alfabeto es ___", answer: "Z" },
        { type: "pronunciation", word: "Alphabet", pronunciation: "/ˈælfəˌbɛt/" },
        { type: "pronunciation", word: "Spell", pronunciation: "/spɛl/" }
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
        { english: "Six", spanish: "Seis", pronunciation: "/sɪks/" },
        { english: "Seven", spanish: "Siete", pronunciation: "/ˈsɛvən/" },
        { english: "Eight", spanish: "Ocho", pronunciation: "/eɪt/" },
        { english: "Nine", spanish: "Nueve", pronunciation: "/naɪn/" },
        { english: "Ten", spanish: "Diez", pronunciation: "/tɛn/" },
        { english: "Eleven", spanish: "Once", pronunciation: "/ɪˈlɛvən/" },
        { english: "Twelve", spanish: "Doce", pronunciation: "/twɛlv/" },
        { english: "Thirteen", spanish: "Trece", pronunciation: "/ˌθɜrˈtin/" },
        { english: "Fourteen", spanish: "Catorce", pronunciation: "/ˌfɔrˈtin/" },
        { english: "Fifteen", spanish: "Quince", pronunciation: "/ˌfɪfˈtin/" },
        { english: "Sixteen", spanish: "Dieciséis", pronunciation: "/ˌsɪksˈtin/" },
        { english: "Seventeen", spanish: "Diecisiete", pronunciation: "/ˌsɛvənˈtin/" },
        { english: "Eighteen", spanish: "Dieciocho", pronunciation: "/ˌeɪˈtin/" },
        { english: "Nineteen", spanish: "Diecinueve", pronunciation: "/ˌnaɪnˈtin/" },
        { english: "Twenty", spanish: "Veinte", pronunciation: "/ˈtwɛnti/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cómo se escribe 7?", options: ["Six", "Seven", "Eight", "Nine"], correct: 1 },
        { type: "fill-blank", question: "5 + 5 = _____", answer: "ten" },
        { type: "multiple-choice", question: "¿Qué número viene después de nineteen?", options: ["Eighteen", "Twenty", "Fifteen"], correct: 1 },
        { type: "fill-blank", question: "12 - 2 = _____", answer: "ten" },
        { type: "pronunciation", word: "Thirteen", pronunciation: "/ˌθɜrˈtin/" }
      ]
    }
  },

  4: {
    id: 4, title: "Los Colores y Objetos", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Identificar colores básicos", "Describir objetos por color", "Vocabulario de objetos comunes", "Combinar colores y objetos"],
    content: {
      vocabulary: [
        { english: "Red", spanish: "Rojo", pronunciation: "/rɛd/" },
        { english: "Blue", spanish: "Azul", pronunciation: "/blu/" },
        { english: "Green", spanish: "Verde", pronunciation: "/ɡrin/" },
        { english: "Yellow", spanish: "Amarillo", pronunciation: "/ˈjɛloʊ/" },
        { english: "Black", spanish: "Negro", pronunciation: "/blæk/" },
        { english: "White", spanish: "Blanco", pronunciation: "/waɪt/" },
        { english: "Orange", spanish: "Naranja", pronunciation: "/ˈɔrɪndʒ/" },
        { english: "Purple", spanish: "Morado", pronunciation: "/ˈpɜrpəl/" },
        { english: "Book", spanish: "Libro", pronunciation: "/bʊk/" },
        { english: "Pen", spanish: "Bolígrafo", pronunciation: "/pɛn/" },
        { english: "Table", spanish: "Mesa", pronunciation: "/ˈteɪbəl/" },
        { english: "Chair", spanish: "Silla", pronunciation: "/tʃɛr/" },
        { english: "Car", spanish: "Carro", pronunciation: "/kɑr/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "What color is the sky?", options: ["Red", "Blue", "Green", "Yellow"], correct: 1 },
        { type: "fill-blank", question: "The ___ is red", answer: "car" },
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
    id: 7, title: "Dias de la Semana Y Meses", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario",
    objectives: ["Aprender los días de la semana", "Aprender los 12 meses", "Preguntar qué día es", "Hablar de fechas", "Hacer planes"],
    content: {
      vocabulary: [
        { english: "Monday", spanish: "Lunes", pronunciation: "/ˈmʌndeɪ/" },
        { english: "Tuesday", spanish: "Martes", pronunciation: "/ˈtuzdeɪ/" },
        { english: "Wednesday", spanish: "Miércoles", pronunciation: "/ˈwɛnzdeɪ/" },
        { english: "Thursday", spanish: "Jueves", pronunciation: "/ˈθɜrzdeɪ/" },
        { english: "Friday", spanish: "Viernes", pronunciation: "/ˈfraɪdeɪ/" },
        { english: "Saturday", spanish: "Sábado", pronunciation: "/ˈsætərdeɪ/" },
        { english: "Sunday", spanish: "Domingo", pronunciation: "/ˈsʌndeɪ/" },
        { english: "January", spanish: "Enero", pronunciation: "/ˈdʒænjuˌɛri/" },
        { english: "February", spanish: "Febrero", pronunciation: "/ˈfɛbruˌɛri/" },
        { english: "March", spanish: "Marzo", pronunciation: "/mɑrtʃ/" },
        { english: "April", spanish: "Abril", pronunciation: "/ˈeɪprəl/" },
        { english: "May", spanish: "Mayo", pronunciation: "/meɪ/" },
        { english: "June", spanish: "Junio", pronunciation: "/dʒun/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "What day comes after Monday?", options: ["Sunday", "Tuesday", "Friday"], correct: 1 },
        { type: "fill-blank", question: "The first month is ___", answer: "January" },
        { type: "pronunciation", word: "Wednesday", pronunciation: "/ˈwɛnzdeɪ/" }
      ]
    }
  },

  8: {
    id: 8, title: "La Familia en Ingles", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.9, type: "Vocabulario",
    objectives: ["Vocabulario familiar", "Hablar de tu familia", "Describir relaciones", "Presentar a tu familia"],
    content: {
      vocabulary: [
        { english: "Mother", spanish: "Madre", pronunciation: "/ˈmʌðər/" },
        { english: "Father", spanish: "Padre", pronunciation: "/ˈfɑðər/" },
        { english: "Sister", spanish: "Hermana", pronunciation: "/ˈsɪstər/" },
        { english: "Brother", spanish: "Hermano", pronunciation: "/ˈbrʌðər/" },
        { english: "Grandmother", spanish: "Abuela", pronunciation: "/ˈɡrændˌmʌðər/" },
        { english: "Grandfather", spanish: "Abuelo", pronunciation: "/ˈɡrændˌfɑðər/" },
        { english: "Aunt", spanish: "Tía", pronunciation: "/ænt/" },
        { english: "Uncle", spanish: "Tío", pronunciation: "/ˈʌŋkəl/" },
        { english: "Cousin", spanish: "Primo/Prima", pronunciation: "/ˈkʌzən/" },
        { english: "Son", spanish: "Hijo", pronunciation: "/sʌn/" },
        { english: "Daughter", spanish: "Hija", pronunciation: "/ˈdɔtər/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "My father's mother is my ___", options: ["Aunt", "Grandmother", "Sister"], correct: 1 },
        { type: "fill-blank", question: "My _____ is my father's son", answer: "brother" },
        { type: "pronunciation", word: "Family", pronunciation: "/ˈfæməli/" }
      ]
    }
  },

  // Continue with remaining A1 lessons (9-24)...
  9: { 
    id: 9, title: "Describing People", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", 
    objectives: ["Describir apariencia física", "Describir personalidad", "Usar adjetivos descriptivos", "Hablar de características"], 
    content: { 
      vocabulary: [
        { english: "Tall", spanish: "Alto", pronunciation: "/tɔl/" }, 
        { english: "Short", spanish: "Bajo", pronunciation: "/ʃɔrt/" }, 
        { english: "Young", spanish: "Joven", pronunciation: "/jʌŋ/" }, 
        { english: "Old", spanish: "Viejo", pronunciation: "/oʊld/" }, 
        { english: "Thin", spanish: "Delgado", pronunciation: "/θɪn/" },
        { english: "Fat", spanish: "Gordo", pronunciation: "/fæt/" },
        { english: "Strong", spanish: "Fuerte", pronunciation: "/strɔŋ/" },
        { english: "Weak", spanish: "Débil", pronunciation: "/wik/" },
        { english: "Friendly", spanish: "Amable", pronunciation: "/ˈfrɛndli/" }, 
        { english: "Smart", spanish: "Inteligente", pronunciation: "/smɑrt/" }, 
        { english: "Beautiful", spanish: "Hermoso/a", pronunciation: "/ˈbjutəfəl/" },
        { english: "Handsome", spanish: "Guapo", pronunciation: "/ˈhænsəm/" },
        { english: "Ugly", spanish: "Feo", pronunciation: "/ˈʌɡli/" },
        { english: "Funny", spanish: "Gracioso", pronunciation: "/ˈfʌni/" },
        { english: "Serious", spanish: "Serio", pronunciation: "/ˈsɪriəs/" },
        { english: "Kind", spanish: "Amable", pronunciation: "/kaɪnd/" },
        { english: "Mean", spanish: "Malo", pronunciation: "/min/" },
        { english: "Happy", spanish: "Feliz", pronunciation: "/ˈhæpi/" },
        { english: "Sad", spanish: "Triste", pronunciation: "/sæd/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "She is very ___", options: ["tall", "talls", "tallest"], correct: 0 }, 
        { type: "fill-blank", question: "He is very _____ (opposite of sad)", answer: "happy" },
        { type: "multiple-choice", question: "My grandfather is ___", options: ["old", "young", "tall"], correct: 0 },
        { type: "fill-blank", question: "She has a _____ personality (nice)", answer: "friendly" },
        { type: "pronunciation", word: "Beautiful", pronunciation: "/ˈbjutəfəl/" },
        { type: "pronunciation", word: "Handsome", pronunciation: "/ˈhænsəm/" }
      ] 
    } 
  },
  10: { id: 10, title: "Adjetivos Básicos", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Describir personas y cosas"], content: { vocabulary: [{ english: "Big", spanish: "Grande", pronunciation: "/bɪɡ/" }, { english: "Small", spanish: "Pequeño", pronunciation: "/smɔl/" }], exercises: [{ type: "multiple-choice", question: "The opposite of 'big' is ___", options: ["Small", "Tall", "Short"], correct: 0 }] } },
  11: { id: 11, title: "Artículos: A, An, The", level: "A1", duration: "22 min", difficulty: "Básico", rating: 4.6, type: "Gramática", objectives: ["Usar artículos correctamente"], content: { vocabulary: [{ english: "A cat", spanish: "Un gato", pronunciation: "/ə kæt/" }, { english: "An apple", spanish: "Una manzana", pronunciation: "/æn ˈæpəl/" }], exercises: [{ type: "fill-blank", question: "I have ___ dog", answer: "a" }] } },
  12: { id: 12, title: "Preguntas con WH", level: "A1", duration: "25 min", difficulty: "Básico", rating: 4.7, type: "Gramática", objectives: ["Hacer preguntas básicas"], content: { vocabulary: [{ english: "What", spanish: "Qué", pronunciation: "/wʌt/" }, { english: "Where", spanish: "Dónde", pronunciation: "/wɛr/" }], exercises: [{ type: "multiple-choice", question: "___ is your name?", options: ["What", "Where", "When"], correct: 0 }] } },
  13: { id: 13, title: "El Clima", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Hablar del tiempo"], content: { vocabulary: [{ english: "Sunny", spanish: "Soleado", pronunciation: "/ˈsʌni/" }, { english: "Rainy", spanish: "Lluvioso", pronunciation: "/ˈreɪni/" }], exercises: [{ type: "pronunciation", word: "Weather", pronunciation: "/ˈwɛðər/" }] } },
  14: { 
    id: 14, title: "Comida y Bebidas", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.9, type: "Vocabulario", 
    objectives: ["Vocabulario de alimentos", "Bebidas comunes", "Comidas del día", "Expresar preferencias"], 
    content: { 
      vocabulary: [
        { english: "Water", spanish: "Agua", pronunciation: "/ˈwɔtər/" }, 
        { english: "Milk", spanish: "Leche", pronunciation: "/mɪlk/" },
        { english: "Coffee", spanish: "Café", pronunciation: "/ˈkɔfi/" },
        { english: "Tea", spanish: "Té", pronunciation: "/ti/" },
        { english: "Juice", spanish: "Jugo", pronunciation: "/dʒus/" },
        { english: "Bread", spanish: "Pan", pronunciation: "/brɛd/" },
        { english: "Butter", spanish: "Mantequilla", pronunciation: "/ˈbʌtər/" },
        { english: "Cheese", spanish: "Queso", pronunciation: "/tʃiz/" },
        { english: "Egg", spanish: "Huevo", pronunciation: "/ɛɡ/" },
        { english: "Meat", spanish: "Carne", pronunciation: "/mit/" },
        { english: "Chicken", spanish: "Pollo", pronunciation: "/ˈtʃɪkən/" },
        { english: "Fish", spanish: "Pescado", pronunciation: "/fɪʃ/" },
        { english: "Rice", spanish: "Arroz", pronunciation: "/raɪs/" },
        { english: "Pasta", spanish: "Pasta", pronunciation: "/ˈpɑstə/" },
        { english: "Salad", spanish: "Ensalada", pronunciation: "/ˈsæləd/" },
        { english: "Fruit", spanish: "Fruta", pronunciation: "/frut/" },
        { english: "Apple", spanish: "Manzana", pronunciation: "/ˈæpəl/" },
        { english: "Banana", spanish: "Plátano", pronunciation: "/bəˈnænə/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "I drink ___", options: ["Water", "Bread", "Chair"], correct: 0 },
        { type: "fill-blank", question: "I like ___ for breakfast", answer: "coffee" },
        { type: "multiple-choice", question: "What do you eat in the morning?", options: ["Bread and butter", "Dinner", "Lunch"], correct: 0 },
        { type: "pronunciation", word: "Chicken", pronunciation: "/ˈtʃɪkən/" },
        { type: "fill-blank", question: "An ___ is a fruit", answer: "apple" }
      ] 
    } 
  },
  15: { id: 15, title: "En el Restaurante", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.7, type: "Conversación", objectives: ["Ordenar comida"], content: { vocabulary: [{ english: "Menu", spanish: "Menú", pronunciation: "/ˈmɛnju/" }, { english: "I would like", spanish: "Me gustaría", pronunciation: "/aɪ wʊd laɪk/" }], exercises: [{ type: "fill-blank", question: "I would ___ a coffee", answer: "like" }] } },
  16: { id: 16, title: "Partes del Cuerpo", level: "A1", duration: "14 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Identificar partes del cuerpo"], content: { vocabulary: [{ english: "Head", spanish: "Cabeza", pronunciation: "/hɛd/" }, { english: "Hand", spanish: "Mano", pronunciation: "/hænd/" }], exercises: [{ type: "pronunciation", word: "Shoulder", pronunciation: "/ˈʃoʊldər/" }] } },
  17: { id: 17, title: "Presente Simple - Escritura", level: "A1", duration: "28 min", difficulty: "Básico", rating: 4.6, type: "Gramática", objectives: ["Formar presente simple", "Escribir oraciones afirmativas", "Formar negaciones", "Hacer preguntas en presente simple"], content: { vocabulary: [{ english: "I work", spanish: "Yo trabajo", pronunciation: "/aɪ wɜrk/" }, { english: "She studies", spanish: "Ella estudia", pronunciation: "/ʃi ˈstʌdiz/" }, { english: "He doesn't play", spanish: "Él no juega", pronunciation: "/hi ˈdʌzənt pleɪ/" }, { english: "Do you like?", spanish: "¿Te gusta?", pronunciation: "/du ju laɪk/" }], exercises: [{ type: "fill-blank", question: "He ___ every day", answer: "works" }, { type: "multiple-choice", question: "She ___ not eat meat", options: ["do", "does", "is"], correct: 1 }] } },
  18: { id: 18, title: "La Hora", level: "A1", duration: "16 min", difficulty: "Básico", rating: 4.7, type: "Vocabulario", objectives: ["Decir la hora"], content: { vocabulary: [{ english: "It's 3 o'clock", spanish: "Son las 3", pronunciation: "/ɪts θri əˈklɑk/" }], exercises: [{ type: "multiple-choice", question: "What time is it? 2:00", options: ["Two o'clock", "Three o'clock"], correct: 0 }] } },
  19: { id: 19, title: "Lugares en la Ciudad", level: "A1", duration: "17 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Vocabulario de lugares"], content: { vocabulary: [{ english: "Bank", spanish: "Banco", pronunciation: "/bæŋk/" }, { english: "Hospital", spanish: "Hospital", pronunciation: "/ˈhɑspɪtəl/" }], exercises: [{ type: "pronunciation", word: "Supermarket", pronunciation: "/ˈsupərˌmɑrkɪt/" }] } },
  20: { id: 20, title: "Direcciones", level: "A1", duration: "19 min", difficulty: "Básico", rating: 4.7, type: "Conversación", objectives: ["Dar direcciones"], content: { vocabulary: [{ english: "Turn left", spanish: "Gira a la izquierda", pronunciation: "/tɜrn lɛft/" }, { english: "Go straight", spanish: "Sigue recto", pronunciation: "/ɡoʊ streɪt/" }], exercises: [{ type: "fill-blank", question: "Turn _____ at the corner", answer: "right" }] } },
  21: { id: 21, title: "La Ropa", level: "A1", duration: "15 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Vocabulario de ropa"], content: { vocabulary: [{ english: "Shirt", spanish: "Camisa", pronunciation: "/ʃɜrt/" }, { english: "Pants", spanish: "Pantalones", pronunciation: "/pænts/" }], exercises: [{ type: "multiple-choice", question: "I wear ___ on my feet", options: ["Shoes", "Hat", "Shirt"], correct: 0 }] } },
  22: { id: 22, title: "Hobbies", level: "A1", duration: "20 min", difficulty: "Básico", rating: 4.9, type: "Conversación", objectives: ["Hablar de pasatiempos"], content: { vocabulary: [{ english: "I like reading", spanish: "Me gusta leer", pronunciation: "/aɪ laɪk ˈridɪŋ/" }], exercises: [{ type: "fill-blank", question: "I love _____ music", answer: "listening" }] } },
  23: { id: 23, title: "En la Casa", level: "A1", duration: "18 min", difficulty: "Básico", rating: 4.8, type: "Vocabulario", objectives: ["Partes de la casa"], content: { vocabulary: [{ english: "Kitchen", spanish: "Cocina", pronunciation: "/ˈkɪtʃən/" }, { english: "Bedroom", spanish: "Dormitorio", pronunciation: "/ˈbɛdrum/" }], exercises: [{ type: "pronunciation", word: "Bathroom", pronunciation: "/ˈbæθrum/" }] } },
  24: { id: 24, title: "Repaso Final A1", level: "A1", duration: "30 min", difficulty: "Básico", rating: 4.9, type: "Evaluación", objectives: ["Repasar todo A1"], content: { vocabulary: [{ english: "Review", spanish: "Repaso", pronunciation: "/rɪˈvju/" }], exercises: [{ type: "multiple-choice", question: "I ___ a student", options: ["am", "is", "are"], correct: 0 }] } },

  // A2 LESSONS (25-56) - 32 lessons
  25: { id: 25, title: "Presente Continuo", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Formar presente continuo", "Describir acciones en curso"], content: { vocabulary: [{ english: "I am working", spanish: "Estoy trabajando", pronunciation: "/aɪ æm ˈwɜrkɪŋ/" }, { english: "She is eating", spanish: "Ella está comiendo", pronunciation: "/ʃi ɪz ˈitɪŋ/" }], exercises: [{ type: "fill-blank", question: "He ___ (run) now", answer: "is running" }, { type: "multiple-choice", question: "They ___ playing", options: ["am", "is", "are"], correct: 2 }] } },
  26: { 
    id: 26, title: "Simple Past - Regular Verbs", level: "A2", duration: "30 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", 
    objectives: ["Formar pasado simple con verbos regulares", "Reglas de -ed", "Pronunciación de -ed", "Escribir oraciones en pasado"], 
    content: { 
      vocabulary: [
        { english: "I worked", spanish: "Trabajé", pronunciation: "/aɪ wɜrkt/" }, 
        { english: "She walked", spanish: "Ella caminó", pronunciation: "/ʃi wɔkt/" }, 
        { english: "They played", spanish: "Ellos jugaron", pronunciation: "/ðeɪ pleɪd/" }, 
        { english: "We studied", spanish: "Estudiamos", pronunciation: "/wi ˈstʌdid/" }, 
        { english: "He watched", spanish: "Él miró", pronunciation: "/hi wɑtʃt/" },
        { english: "I cleaned", spanish: "Limpié", pronunciation: "/aɪ klind/" },
        { english: "They helped", spanish: "Ayudaron", pronunciation: "/ðeɪ hɛlpt/" },
        { english: "She cooked", spanish: "Ella cocinó", pronunciation: "/ʃi kʊkt/" },
        { english: "We visited", spanish: "Visitamos", pronunciation: "/wi ˈvɪzɪtɪd/" },
        { english: "He started", spanish: "Él comenzó", pronunciation: "/hi ˈstɑrtɪd/" },
        { english: "I finished", spanish: "Terminé", pronunciation: "/aɪ ˈfɪnɪʃt/" },
        { english: "They arrived", spanish: "Llegaron", pronunciation: "/ðeɪ əˈraɪvd/" },
        { english: "She talked", spanish: "Ella habló", pronunciation: "/ʃi tɔkt/" },
        { english: "We loved", spanish: "Amamos", pronunciation: "/wi lʌvd/" }
      ], 
      exercises: [
        { type: "fill-blank", question: "Yesterday I ___ (work) all day", answer: "worked" }, 
        { type: "multiple-choice", question: "She ___ the movie", options: ["watched", "watch", "watching"], correct: 0 },
        { type: "fill-blank", question: "They ___ (play) soccer last week", answer: "played" },
        { type: "multiple-choice", question: "We ___ our grandparents", options: ["visited", "visit", "visiting"], correct: 0 },
        { type: "fill-blank", question: "He ___ (finish) his homework", answer: "finished" },
        { type: "pronunciation", word: "Worked", pronunciation: "/wɜrkt/" }
      ] 
    } 
  },
  27: { id: 27, title: "Adverbios de Frecuencia", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Gramática", objectives: ["Always, usually, sometimes, never"], content: { vocabulary: [{ english: "Always", spanish: "Siempre", pronunciation: "/ˈɔlweɪz/" }, { english: "Never", spanish: "Nunca", pronunciation: "/ˈnɛvər/" }], exercises: [{ type: "multiple-choice", question: "I ___ drink coffee", options: ["always", "yesterday"], correct: 0 }] } },
  28: { id: 28, title: "Comparativos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Comparar cosas y personas"], content: { vocabulary: [{ english: "Bigger", spanish: "Más grande", pronunciation: "/ˈbɪɡər/" }, { english: "More beautiful", spanish: "Más hermoso", pronunciation: "/mɔr ˈbjutəfəl/" }], exercises: [{ type: "fill-blank", question: "She is ___ than me (tall)", answer: "taller" }] } },
  29: { id: 29, title: "Superlativos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["El más, la más"], content: { vocabulary: [{ english: "The biggest", spanish: "El más grande", pronunciation: "/ðə ˈbɪɡɪst/" }], exercises: [{ type: "multiple-choice", question: "She is ___ smartest", options: ["a", "an", "the"], correct: 2 }] } },
  30: { id: 30, title: "Preposiciones de Lugar", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["In, on, under, between"], content: { vocabulary: [{ english: "On the table", spanish: "Sobre la mesa", pronunciation: "/ɑn ðə ˈteɪbəl/" }, { english: "Under the bed", spanish: "Debajo de la cama", pronunciation: "/ˈʌndər ðə bɛd/" }], exercises: [{ type: "fill-blank", question: "The book is ___ the table", answer: "on" }] } },
  31: { id: 31, title: "Modal: Can/Could", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Expresar habilidad y posibilidad"], content: { vocabulary: [{ english: "I can swim", spanish: "Puedo nadar", pronunciation: "/aɪ kæn swɪm/" }, { english: "Could you help?", spanish: "¿Podrías ayudar?", pronunciation: "/kʊd ju hɛlp/" }], exercises: [{ type: "multiple-choice", question: "___ you play piano?", options: ["Can", "Are", "Do"], correct: 0 }] } },
  32: { id: 32, title: "Vocabulario de Trabajo", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Profesiones y lugares de trabajo"], content: { vocabulary: [{ english: "Teacher", spanish: "Profesor", pronunciation: "/ˈtitʃər/" }, { english: "Office", spanish: "Oficina", pronunciation: "/ˈɔfɪs/" }], exercises: [{ type: "pronunciation", word: "Engineer", pronunciation: "/ˌɛndʒɪˈnɪr/" }] } },
  
  // Continue with more A2 lessons (33-56)...
  33: { id: 33, title: "En el Aeropuerto", level: "A2", duration: "23 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Check-in, gate, boarding"], content: { vocabulary: [{ english: "Flight", spanish: "Vuelo", pronunciation: "/flaɪt/" }, { english: "Passport", spanish: "Pasaporte", pronunciation: "/ˈpæspɔrt/" }], exercises: [{ type: "fill-blank", question: "Show me your ___, please", answer: "passport" }] } },
  34: { 
    id: 34, title: "Shopping and Money", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Conversación", 
    objectives: ["Precios y dinero", "Comprar en tiendas", "Tallas y devoluciones", "Formas de pago"], 
    content: { 
      vocabulary: [
        { english: "How much", spanish: "Cuánto cuesta", pronunciation: "/haʊ mʌtʃ/" }, 
        { english: "How many", spanish: "Cuántos", pronunciation: "/haʊ ˈmɛni/" },
        { english: "Dollar", spanish: "Dólar", pronunciation: "/ˈdɑlər/" }, 
        { english: "Cent", spanish: "Centavo", pronunciation: "/sɛnt/" },
        { english: "Price", spanish: "Precio", pronunciation: "/praɪs/" },
        { english: "Expensive", spanish: "Caro", pronunciation: "/ɪkˈspɛnsɪv/" },
        { english: "Cheap", spanish: "Barato", pronunciation: "/tʃip/" },
        { english: "Discount", spanish: "Descuento", pronunciation: "/ˈdɪskaʊnt/" },
        { english: "Sale", spanish: "Rebaja", pronunciation: "/seɪl/" },
        { english: "Change", spanish: "Cambio", pronunciation: "/tʃeɪndʒ/" }, 
        { english: "Cash", spanish: "Efectivo", pronunciation: "/kæʃ/" }, 
        { english: "Credit card", spanish: "Tarjeta de crédito", pronunciation: "/ˈkrɛdɪt kɑrd/" }, 
        { english: "Debit card", spanish: "Tarjeta de débito", pronunciation: "/ˈdɛbɪt kɑrd/" },
        { english: "Receipt", spanish: "Recibo", pronunciation: "/rɪˈsit/" },
        { english: "Size", spanish: "Talla", pronunciation: "/saɪz/" },
        { english: "Return", spanish: "Devolución", pronunciation: "/rɪˈtɜrn/" },
        { english: "Refund", spanish: "Reembolso", pronunciation: "/ˈrifʌnd/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "___ is this shirt?", options: ["How much", "How many"], correct: 0 }, 
        { type: "fill-blank", question: "I'll pay by ___", answer: "cash" },
        { type: "multiple-choice", question: "This is too ___!", options: ["expensive", "expense", "expensively"], correct: 0 },
        { type: "fill-blank", question: "Can I get a ___? (devolución)", answer: "refund" },
        { type: "pronunciation", word: "Receipt", pronunciation: "/rɪˈsit/" },
        { type: "fill-blank", question: "There's a ___ on shoes today", answer: "sale" }
      ] 
    } 
  },
  35: { id: 35, title: "Futuro con Will", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Planes futuros"], content: { vocabulary: [{ english: "I will go", spanish: "Iré", pronunciation: "/aɪ wɪl ɡoʊ/" }], exercises: [{ type: "fill-blank", question: "She ___ travel tomorrow", answer: "will" }] } },
  36: { 
    id: 36, title: "Future Plans and Going to", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", 
    objectives: ["Hablar de planes futuros", "Usar going to", "Expresar intenciones", "Hacer predicciones"], 
    content: { 
      vocabulary: [
        { english: "I'm going to study", spanish: "Voy a estudiar", pronunciation: "/aɪm ˈɡoʊɪŋ tu ˈstʌdi/" }, 
        { english: "We're going to travel", spanish: "Vamos a viajar", pronunciation: "/wir ˈɡoʊɪŋ tu ˈtrævəl/" }, 
        { english: "She's going to buy", spanish: "Ella va a comprar", pronunciation: "/ʃiz ˈɡoʊɪŋ tu baɪ/" }, 
        { english: "He's going to eat", spanish: "Él va a comer", pronunciation: "/hiz ˈɡoʊɪŋ tu it/" },
        { english: "They're going to play", spanish: "Ellos van a jugar", pronunciation: "/ðɛr ˈɡoʊɪŋ tu pleɪ/" },
        { english: "I'm not going to work", spanish: "No voy a trabajar", pronunciation: "/aɪm nɑt ˈɡoʊɪŋ tu wɜrk/" },
        { english: "What are you going to do?", spanish: "¿Qué vas a hacer?", pronunciation: "/wʌt ɑr ju ˈɡoʊɪŋ tu du/" },
        { english: "Where are you going to go?", spanish: "¿A dónde vas a ir?", pronunciation: "/wɛr ɑr ju ˈɡoʊɪŋ tu ɡoʊ/" },
        { english: "When is she going to arrive?", spanish: "¿Cuándo va a llegar?", pronunciation: "/wɛn ɪz ʃi ˈɡoʊɪŋ tu əˈraɪv/" },
        { english: "It's going to rain", spanish: "Va a llover", pronunciation: "/ɪts ˈɡoʊɪŋ tu reɪn/" },
        { english: "Tomorrow", spanish: "Mañana", pronunciation: "/təˈmɑroʊ/" },
        { english: "Next week", spanish: "La próxima semana", pronunciation: "/nɛkst wik/" },
        { english: "Soon", spanish: "Pronto", pronunciation: "/sun/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "He ___ visit his family", options: ["is going to", "will going", "going"], correct: 0 }, 
        { type: "fill-blank", question: "They ___ to the concert tomorrow", answer: "are going" },
        { type: "multiple-choice", question: "___ you going to study tonight?", options: ["Are", "Is", "Am"], correct: 0 },
        { type: "fill-blank", question: "I'm ___ buy a new car", answer: "going to" },
        { type: "fill-blank", question: "It ___ rain tomorrow", answer: "is going to" },
        { type: "pronunciation", word: "Tomorrow", pronunciation: "/təˈmɑroʊ/" }
      ] 
    } 
  },
  37: { id: 37, title: "Comida y Nutrición", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Alimentos saludables"], content: { vocabulary: [{ english: "Vegetables", spanish: "Verduras", pronunciation: "/ˈvɛdʒtəbəlz/" }, { english: "Healthy", spanish: "Saludable", pronunciation: "/ˈhɛlθi/" }], exercises: [{ type: "pronunciation", word: "Nutritious", pronunciation: "/nuˈtrɪʃəs/" }] } },
  38: { id: 38, title: "Deportes", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", objectives: ["Vocabulario deportivo"], content: { vocabulary: [{ english: "Soccer", spanish: "Fútbol", pronunciation: "/ˈsɑkər/" }, { english: "Basketball", spanish: "Baloncesto", pronunciation: "/ˈbæskɪtˌbɔl/" }], exercises: [{ type: "fill-blank", question: "I play ___ every weekend", answer: "soccer" }] } },
  39: { id: 39, title: "Tecnología", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.7, type: "Vocabulario", objectives: ["Dispositivos y apps"], content: { vocabulary: [{ english: "Computer", spanish: "Computadora", pronunciation: "/kəmˈpjutər/" }, { english: "Download", spanish: "Descargar", pronunciation: "/ˈdaʊnˌloʊd/" }], exercises: [{ type: "pronunciation", word: "Application", pronunciation: "/ˌæplɪˈkeɪʃən/" }] } },
  40: { id: 40, title: "Medio Ambiente", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.6, type: "Vocabulario", objectives: ["Naturaleza y ecología"], content: { vocabulary: [{ english: "Recycle", spanish: "Reciclar", pronunciation: "/riˈsaɪkəl/" }, { english: "Environment", spanish: "Medio ambiente", pronunciation: "/ɪnˈvaɪrənmənt/" }], exercises: [{ type: "fill-blank", question: "We should ___ plastic", answer: "recycle" }] } },
  41: { id: 41, title: "Modal: Should/Must", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", objectives: ["Consejos y obligaciones"], content: { vocabulary: [{ english: "You should study", spanish: "Deberías estudiar", pronunciation: "/ju ʃʊd ˈstʌdi/" }], exercises: [{ type: "multiple-choice", question: "You ___ eat healthy", options: ["should", "can", "will"], correct: 0 }] } },
  42: { id: 42, title: "Conectores", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Gramática", objectives: ["And, but, or, because"], content: { vocabulary: [{ english: "Because", spanish: "Porque", pronunciation: "/bɪˈkɔz/" }], exercises: [{ type: "fill-blank", question: "I stayed home ___ it rained", answer: "because" }] } },
  43: { id: 43, title: "Experiencias", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Hablar del pasado"], content: { vocabulary: [{ english: "I have been to", spanish: "He estado en", pronunciation: "/aɪ hæv bin tu/" }], exercises: [{ type: "multiple-choice", question: "Have you ___ been to Paris?", options: ["ever", "never", "always"], correct: 0 }] } },
  44: { id: 44, title: "Expresiones de Tiempo", level: "A2", duration: "22 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Yesterday, tomorrow, last week"], content: { vocabulary: [{ english: "Last week", spanish: "La semana pasada", pronunciation: "/læst wik/" }], exercises: [{ type: "fill-blank", question: "I saw him ___ month", answer: "last" }] } },
  45: { id: 45, title: "Adjetivos para Personas", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", objectives: ["Adjetivos de apariencia física", "Adjetivos de personalidad", "Comparar personas"], content: { vocabulary: [{ english: "Tall", spanish: "Alto", pronunciation: "/tɔl/" }, { english: "Friendly", spanish: "Amable", pronunciation: "/ˈfrɛndli/" }, { english: "Intelligent", spanish: "Inteligente", pronunciation: "/ɪnˈtɛlɪdʒənt/" }, { english: "Kind", spanish: "Amable", pronunciation: "/kaɪnd/" }], exercises: [{ type: "pronunciation", word: "Personality", pronunciation: "/ˌpɜrsəˈnæləti/" }] } },
  46: { id: 46, title: "Sentimientos", level: "A2", duration: "20 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Expresar emociones"], content: { vocabulary: [{ english: "Happy", spanish: "Feliz", pronunciation: "/ˈhæpi/" }, { english: "Sad", spanish: "Triste", pronunciation: "/sæd/" }], exercises: [{ type: "fill-blank", question: "I feel ___ today", answer: "happy" }] } },
  47: { id: 47, title: "En el Médico", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Síntomas y tratamientos"], content: { vocabulary: [{ english: "Pain", spanish: "Dolor", pronunciation: "/peɪn/" }, { english: "Medicine", spanish: "Medicina", pronunciation: "/ˈmɛdɪsən/" }], exercises: [{ type: "multiple-choice", question: "I have a ___", options: ["headache", "head", "hurt"], correct: 0 }] } },
  48: { id: 48, title: "Cuantificadores", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Some, any, much, many"], content: { vocabulary: [{ english: "Some water", spanish: "Algo de agua", pronunciation: "/sʌm ˈwɔtər/" }], exercises: [{ type: "fill-blank", question: "Do you have ___ questions?", answer: "any" }] } },
  49: { id: 49, title: "Actividades de Tiempo Libre", level: "A2", duration: "23 min", difficulty: "Intermedio", rating: 4.8, type: "Vocabulario", objectives: ["Entretenimiento"], content: { vocabulary: [{ english: "Cinema", spanish: "Cine", pronunciation: "/ˈsɪnəmə/" }, { english: "Concert", spanish: "Concierto", pronunciation: "/ˈkɑnsərt/" }], exercises: [{ type: "pronunciation", word: "Entertainment", pronunciation: "/ˌɛntərˈteɪnmənt/" }] } },
  50: { id: 50, title: "Rutinas Diarias", level: "A2", duration: "24 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Describir tu día"], content: { vocabulary: [{ english: "Wake up", spanish: "Despertarse", pronunciation: "/weɪk ʌp/" }, { english: "Get dressed", spanish: "Vestirse", pronunciation: "/ɡɛt drɛst/" }], exercises: [{ type: "fill-blank", question: "I ___ up at 7am", answer: "wake" }] } },
  51: { 
    id: 51, title: "Past Tense Stories", level: "A2", duration: "30 min", difficulty: "Intermedio", rating: 4.7, type: "Gramática", 
    objectives: ["Narrar eventos pasados", "Usar past simple y past continuous", "Conectar eventos con conectores", "Escribir historias cortas"], 
    content: { 
      vocabulary: [
        { english: "I was walking when...", spanish: "Estaba caminando cuando...", pronunciation: "/aɪ wʌz ˈwɔkɪŋ wɛn/" }, 
        { english: "She was reading", spanish: "Ella estaba leyendo", pronunciation: "/ʃi wʌz ˈridɪŋ/" },
        { english: "They were playing", spanish: "Ellos estaban jugando", pronunciation: "/ðeɪ wɜr ˈpleɪɪŋ/" },
        { english: "While", spanish: "Mientras", pronunciation: "/waɪl/" },
        { english: "When", spanish: "Cuando", pronunciation: "/wɛn/" },
        { english: "Suddenly", spanish: "De repente", pronunciation: "/ˈsʌdənli/" }, 
        { english: "Then", spanish: "Entonces", pronunciation: "/ðɛn/" }, 
        { english: "After that", spanish: "Después de eso", pronunciation: "/ˈæftər ðæt/" }, 
        { english: "Next", spanish: "Luego", pronunciation: "/nɛkst/" },
        { english: "Later", spanish: "Más tarde", pronunciation: "/ˈleɪtər/" },
        { english: "Finally", spanish: "Finalmente", pronunciation: "/ˈfaɪnəli/" },
        { english: "In the end", spanish: "Al final", pronunciation: "/ɪn ði ɛnd/" },
        { english: "First", spanish: "Primero", pronunciation: "/fɜrst/" },
        { english: "At first", spanish: "Al principio", pronunciation: "/æt fɜrst/" },
        { english: "Meanwhile", spanish: "Mientras tanto", pronunciation: "/ˈminˌwaɪl/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "She ___ reading when I called", options: ["was", "were", "is"], correct: 0 }, 
        { type: "fill-blank", question: "___, he left the house", answer: "Suddenly" },
        { type: "multiple-choice", question: "I was sleeping ___ the phone rang", options: ["when", "while", "then"], correct: 0 },
        { type: "fill-blank", question: "___, we went home", answer: "Finally" },
        { type: "fill-blank", question: "___ I was cooking, he was watching TV", answer: "While" },
        { type: "pronunciation", word: "Meanwhile", pronunciation: "/ˈminˌwaɪl/" }
      ] 
    } 
  },
  52: { id: 52, title: "Dando Consejos", level: "A2", duration: "25 min", difficulty: "Intermedio", rating: 4.8, type: "Conversación", objectives: ["Why don't you, How about"], content: { vocabulary: [{ english: "Why don't you", spanish: "¿Por qué no", pronunciation: "/waɪ doʊnt ju/" }], exercises: [{ type: "fill-blank", question: "___ about going to the park?", answer: "How" }] } },
  53: { id: 53, title: "Problemas y Soluciones", level: "A2", duration: "27 min", difficulty: "Intermedio", rating: 4.7, type: "Conversación", objectives: ["Expresar problemas"], content: { vocabulary: [{ english: "Problem", spanish: "Problema", pronunciation: "/ˈprɑbləm/" }, { english: "Solution", spanish: "Solución", pronunciation: "/səˈluʃən/" }], exercises: [{ type: "pronunciation", word: "Difficulty", pronunciation: "/ˈdɪfɪkəlti/" }] } },
  54: { id: 54, title: "Pronombres Objeto", level: "A2", duration: "26 min", difficulty: "Intermedio", rating: 4.6, type: "Gramática", objectives: ["Me, you, him, her, us, them"], content: { vocabulary: [{ english: "Call me", spanish: "Llámame", pronunciation: "/kɔl mi/" }], exercises: [{ type: "fill-blank", question: "I love ___ (she)", answer: "her" }] } },
  55: { 
    id: 55, title: "Travel and Transportation", level: "A2", duration: "28 min", difficulty: "Intermedio", rating: 4.9, type: "Vocabulario", 
    objectives: ["Vocabulario de viaje", "Medios de transporte", "En el hotel", "Turismo"], 
    content: { 
      vocabulary: [
        { english: "Bus", spanish: "Autobús", pronunciation: "/bʌs/" }, 
        { english: "Train", spanish: "Tren", pronunciation: "/treɪn/" }, 
        { english: "Airplane", spanish: "Avión", pronunciation: "/ˈɛrˌpleɪn/" }, 
        { english: "Taxi", spanish: "Taxi", pronunciation: "/ˈtæksi/" }, 
        { english: "Subway", spanish: "Metro", pronunciation: "/ˈsʌbˌweɪ/" }, 
        { english: "Car", spanish: "Carro", pronunciation: "/kɑr/" },
        { english: "Bicycle", spanish: "Bicicleta", pronunciation: "/ˈbaɪsɪkəl/" },
        { english: "Boat", spanish: "Barco", pronunciation: "/boʊt/" },
        { english: "Ship", spanish: "Nave", pronunciation: "/ʃɪp/" },
        { english: "Airport", spanish: "Aeropuerto", pronunciation: "/ˈɛrˌpɔrt/" },
        { english: "Station", spanish: "Estación", pronunciation: "/ˈsteɪʃən/" },
        { english: "Hotel", spanish: "Hotel", pronunciation: "/hoʊˈtɛl/" },
        { english: "Reservation", spanish: "Reservación", pronunciation: "/ˌrɛzərˈveɪʃən/" }, 
        { english: "Check-in", spanish: "Registro", pronunciation: "/ˈtʃɛk ɪn/" },
        { english: "Check-out", spanish: "Salida", pronunciation: "/ˈtʃɛk aʊt/" },
        { english: "Luggage", spanish: "Equipaje", pronunciation: "/ˈlʌɡɪdʒ/" },
        { english: "Suitcase", spanish: "Maleta", pronunciation: "/ˈsutˌkeɪs/" }, 
        { english: "Ticket", spanish: "Boleto", pronunciation: "/ˈtɪkɪt/" },
        { english: "Boarding pass", spanish: "Pase de abordar", pronunciation: "/ˈbɔrdɪŋ pæs/" },
        { english: "Destination", spanish: "Destino", pronunciation: "/ˌdɛstəˈneɪʃən/" },
        { english: "Tourist", spanish: "Turista", pronunciation: "/ˈtʊrɪst/" },
        { english: "Map", spanish: "Mapa", pronunciation: "/mæp/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "I travel by ___", options: ["train", "trains", "training"], correct: 0 }, 
        { type: "fill-blank", question: "I need to make a ___ for the hotel", answer: "reservation" },
        { type: "multiple-choice", question: "Where is my boarding ___?", options: ["pass", "ticket", "card"], correct: 0 },
        { type: "fill-blank", question: "Pack your ___ for the trip", answer: "suitcase" },
        { type: "pronunciation", word: "Transportation", pronunciation: "/ˌtrænspərˈteɪʃən/" },
        { type: "pronunciation", word: "Destination", pronunciation: "/ˌdɛstəˈneɪʃən/" }
      ] 
    } 
  },
  56: { id: 56, title: "Repaso Final A2", level: "A2", duration: "35 min", difficulty: "Intermedio", rating: 4.8, type: "Evaluación", objectives: ["Evaluar conocimientos A2"], content: { vocabulary: [{ english: "Comprehensive review", spanish: "Repaso completo", pronunciation: "/ˌkɑmprɪˈhɛnsɪv rɪˈvju/" }], exercises: [{ type: "multiple-choice", question: "I ___ to the beach yesterday", options: ["go", "went", "going"], correct: 1 }] } },

  // B1 LESSONS (57-96) - 40 lessons
  57: { 
    id: 57, title: "Present Perfect vs Simple Past", level: "B1", duration: "35 min", difficulty: "Avanzado", rating: 4.7, type: "Gramática", 
    objectives: ["Diferenciar presente perfecto y pasado simple", "Usar marcadores temporales", "Experiencias vs eventos específicos", "Just, already, yet"], 
    content: { 
      vocabulary: [
        { english: "I have seen", spanish: "He visto", pronunciation: "/aɪ hæv sin/" }, 
        { english: "I saw", spanish: "Vi", pronunciation: "/aɪ sɔ/" }, 
        { english: "I have been", spanish: "He estado", pronunciation: "/aɪ hæv bin/" },
        { english: "I went", spanish: "Fui", pronunciation: "/aɪ wɛnt/" },
        { english: "Have you ever been?", spanish: "¿Alguna vez has estado?", pronunciation: "/hæv ju ˈɛvər bin/" }, 
        { english: "I went yesterday", spanish: "Fui ayer", pronunciation: "/aɪ wɛnt ˈjɛstərdeɪ/" }, 
        { english: "Just", spanish: "Justo/Apenas", pronunciation: "/dʒʌst/" }, 
        { english: "Already", spanish: "Ya", pronunciation: "/ɔlˈrɛdi/" },
        { english: "Yet", spanish: "Todavía/Aún", pronunciation: "/jɛt/" },
        { english: "Ever", spanish: "Alguna vez", pronunciation: "/ˈɛvər/" },
        { english: "Never", spanish: "Nunca", pronunciation: "/ˈnɛvər/" },
        { english: "Recently", spanish: "Recientemente", pronunciation: "/ˈrisəntli/" },
        { english: "Lately", spanish: "Últimamente", pronunciation: "/ˈleɪtli/" },
        { english: "So far", spanish: "Hasta ahora", pronunciation: "/soʊ fɑr/" },
        { english: "For two years", spanish: "Por dos años", pronunciation: "/fɔr tu jɪrz/" },
        { english: "Since 2020", spanish: "Desde 2020", pronunciation: "/sɪns ˈtwɛnti ˈtwɛnti/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "I ___ Paris last year", options: ["visited", "have visited", "visit"], correct: 0 }, 
        { type: "fill-blank", question: "She ___ (already/finish) her homework", answer: "has already finished" },
        { type: "multiple-choice", question: "Have you ___ been to Japan?", options: ["ever", "never", "yet"], correct: 0 },
        { type: "fill-blank", question: "I haven't done it ___", answer: "yet" },
        { type: "multiple-choice", question: "They ___ here since Monday", options: ["have been", "were", "are"], correct: 0 },
        { type: "fill-blank", question: "I ___ just arrived", answer: "have" },
        { type: "pronunciation", word: "Recently", pronunciation: "/ˈrisəntli/" }
      ] 
    } 
  },
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
  69: { id: 69, title: "Cartas Formales", level: "B1", duration: "28 min", difficulty: "Avanzado", rating: 4.7, type: "Conversación", objectives: ["Estructura de cartas formales"], content: { vocabulary: [{ english: "Dear Sir", spanish: "Estimado señor", pronunciation: "/dɪr sɜr/" }], exercises: [{ type: "fill-blank", question: "Yours ___", answer: "sincerely" }] } },
  70: { id: 70, title: "Expresiones Idiomáticas", level: "B1", duration: "29 min", difficulty: "Avanzado", rating: 4.9, type: "Vocabulario", objectives: ["Modismos comunes"], content: { vocabulary: [{ english: "Break a leg", spanish: "Buena suerte", pronunciation: "/breɪk ə lɛɡ/" }], exercises: [{ type: "pronunciation", word: "Piece of cake", pronunciation: "/pis ʌv keɪk/" }] } },
  71: { id: 71, title: "Cultura Anglosajona", level: "B1", duration: "26 min", difficulty: "Avanzado", rating: 4.8, type: "Cultural", objectives: ["Costumbres y tradiciones"], content: { vocabulary: [{ english: "Thanksgiving", spanish: "Día de Acción de Gracias", pronunciation: "/ˌθæŋksˈɡɪvɪŋ/" }], exercises: [{ type: "multiple-choice", question: "When is Independence Day?", options: ["July 4", "December 25"], correct: 0 }] } },
  72: { id: 72, title: "Literatura en Inglés", level: "B1", duration: "30 min", difficulty: "Avanzado", rating: 4.6, type: "Cultural", objectives: ["Autores y obras"], content: { vocabulary: [{ english: "Novel", spanish: "Novela", pronunciation: "/ˈnɑvəl/" }], exercises: [{ type: "pronunciation", word: "Shakespeare", pronunciation: "/ˈʃeɪkspɪr/" }] } },
  73: { id: 73, title: "Debates y Opiniones", level: "B1", duration: "32 min", difficulty: "Avanzado", rating: 4.7, type: "Conversación", objectives: ["Expresar y defender opiniones"], content: { vocabulary: [{ english: "In my opinion", spanish: "En mi opinión", pronunciation: "/ɪn maɪ əˈpɪnjən/" }], exercises: [{ type: "fill-blank", question: "I ___ agree with you", answer: "don't" }] } },
  74: { 
    id: 74, title: "Job Interviews in English", level: "B1", duration: "35 min", difficulty: "Avanzado", rating: 4.9, type: "Conversación", 
    objectives: ["Preparar entrevistas de trabajo", "Responder preguntas comunes", "Hablar de experiencia laboral", "Presentarse profesionalmente"], 
    content: { 
      vocabulary: [
        { english: "Strengths", spanish: "Fortalezas", pronunciation: "/strɛŋθs/" }, 
        { english: "Weaknesses", spanish: "Debilidades", pronunciation: "/ˈwiknəsɪz/" }, 
        { english: "Experience", spanish: "Experiencia", pronunciation: "/ɪkˈspɪriəns/" }, 
        { english: "Qualification", spanish: "Calificación", pronunciation: "/ˌkwɑləfəˈkeɪʃən/" }, 
        { english: "Skills", spanish: "Habilidades", pronunciation: "/skɪlz/" },
        { english: "Resume", spanish: "Currículum", pronunciation: "/ˈrɛzəˌmeɪ/" },
        { english: "Background", spanish: "Antecedentes", pronunciation: "/ˈbækˌɡraʊnd/" },
        { english: "Position", spanish: "Puesto", pronunciation: "/pəˈzɪʃən/" },
        { english: "Salary", spanish: "Salario", pronunciation: "/ˈsæləri/" },
        { english: "Benefits", spanish: "Beneficios", pronunciation: "/ˈbɛnəfɪts/" },
        { english: "Team player", spanish: "Trabajador en equipo", pronunciation: "/tim ˈpleɪər/" },
        { english: "Tell me about yourself", spanish: "Háblame de ti", pronunciation: "/tɛl mi əˈbaʊt jʊrˈsɛlf/" }, 
        { english: "Why should we hire you?", spanish: "¿Por qué deberíamos contratarte?", pronunciation: "/waɪ ʃʊd wi haɪr ju/" },
        { english: "What are your goals?", spanish: "¿Cuáles son tus metas?", pronunciation: "/wʌt ɑr jʊr ɡoʊlz/" },
        { english: "Where do you see yourself?", spanish: "¿Dónde te ves?", pronunciation: "/wɛr du ju si jʊrˈsɛlf/" },
        { english: "Why do you want this job?", spanish: "¿Por qué quieres este trabajo?", pronunciation: "/waɪ du ju wɑnt ðɪs dʒɑb/" },
        { english: "I'm a hard worker", spanish: "Soy trabajador", pronunciation: "/aɪm ə hɑrd ˈwɜrkər/" }
      ], 
      exercises: [
        { type: "multiple-choice", question: "What are your ___?", options: ["strengths", "strong", "strength"], correct: 0 }, 
        { type: "fill-blank", question: "I have 5 years of ___", answer: "experience" },
        { type: "multiple-choice", question: "Please send me your ___", options: ["resume", "résumé", "CV"], correct: 0 },
        { type: "fill-blank", question: "I'm a good team ___", answer: "player" },
        { type: "fill-blank", question: "What ___ do you have?", answer: "skills" },
        { type: "pronunciation", word: "Qualification", pronunciation: "/ˌkwɑləfəˈkeɪʃən/" }
      ] 
    } 
  },
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
