/**
 * Lessons extracted from curso-ingles.com - Nivel Básico (A1)
 * Based on: https://curso-ingles.com/aprender/cursos/nivel-basico
 */

export const cursoInglesLessons: Record<number, any> = {
  // Unit 1: Pronouns
  101: {
    id: 101,
    title: "Personal Pronouns (Los pronombres personales)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Entender qué son los pronombres personales",
      "Diferenciar entre subject pronouns y object pronouns",
      "Usar correctamente 'I', 'you', 'he', 'she', 'it', 'we', 'they'",
      "Usar correctamente 'me', 'you', 'him', 'her', 'it', 'us', 'them'",
      "Entender la forma neutra 'it' y su uso"
    ],
    content: {
      vocabulary: [
        // Subject Pronouns
        { english: "I", spanish: "Yo", pronunciation: "/aɪ/", example: "I am ill. (Yo estoy enfermo.)" },
        { english: "you", spanish: "Tú / Usted", pronunciation: "/ju/", example: "You are tall. (Tú eres alto.)" },
        { english: "he", spanish: "Él", pronunciation: "/hi/", example: "He is handsome. (Él es guapo.)" },
        { english: "she", spanish: "Ella", pronunciation: "/ʃi/", example: "She is pretty. (Ella es guapa.)" },
        { english: "it", spanish: "Ello (neutro)", pronunciation: "/ɪt/", example: "It is cold today. (Hoy hace frío.)" },
        { english: "we", spanish: "Nosotros", pronunciation: "/wi/", example: "We are tired. (Nosotros estamos cansados.)" },
        { english: "you", spanish: "Vosotros / Ustedes", pronunciation: "/ju/", example: "You are angry. (Vosotros estáis enfadados.)" },
        { english: "they", spanish: "Ellos / Ellas", pronunciation: "/ðeɪ/", example: "They are at the cinema. (Ellos están en el cine.)" },
        // Object Pronouns
        { english: "me", spanish: "Mi / A mí", pronunciation: "/mi/", example: "Can you help me? (¿Puedes ayudarme?)" },
        { english: "you", spanish: "A ti / A usted", pronunciation: "/ju/", example: "I can help you. (Puedo ayudarte.)" },
        { english: "him", spanish: "A él", pronunciation: "/hɪm/", example: "Can you see him? (¿Le puedes ver?)" },
        { english: "her", spanish: "A ella", pronunciation: "/hɜr/", example: "Give it to her. (Dáselo a ella.)" },
        { english: "it", spanish: "A ello", pronunciation: "/ɪt/", example: "Give it a kick. (Dale una patada.)" },
        { english: "us", spanish: "A nosotros", pronunciation: "/ʌs/", example: "Can you see us? (¿Nos puedes ver?)" },
        { english: "you", spanish: "A vosotros / A ustedes", pronunciation: "/ju/", example: "I see you. (Os veo.)" },
        { english: "them", spanish: "A ellos", pronunciation: "/ðɛm/", example: "He can help them. (Les puede ayudar.)" },
        // Neuter Form Examples
        { english: "Where is it?", spanish: "¿Dónde está [el libro]?", pronunciation: "/wɛr ɪz ɪt/", example: "Where is it [the book]? (¿Dónde está [el libro]?)" },
        { english: "What time is it?", spanish: "¿Qué hora es?", pronunciation: "/wʌt taɪm ɪz ɪt/", example: "What time is it? (¿Qué hora es?)" },
        { english: "It is raining", spanish: "Está lloviendo", pronunciation: "/ɪt ɪz ˈreɪnɪŋ/", example: "It is raining. (Está lloviendo.)" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es el subject pronoun para 'yo'?", options: ["I", "me", "my", "mine"], correct: 0 },
        { type: "multiple-choice", question: "¿Cuál es el object pronoun para 'él'?", options: ["he", "him", "his", "himself"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I can help _____' (tú)", answer: "you" },
        { type: "fill-blank", question: "Complete: 'Can you see _____?' (él)", answer: "him" },
        { type: "multiple-choice", question: "¿Cuál es correcto? 'The letter is for _____'", options: ["you", "your", "yours", "yourself"], correct: 0 },
        { type: "translation", question: "Traduce: 'Él va a la fiesta con nosotros'", answer: "He is going to the party with us" },
        { type: "multiple-choice", question: "¿Cuál es correcto? '_____ is cold today'", options: ["It", "He", "She", "They"], correct: 0 },
        { type: "fill-blank", question: "Complete: '_____ is raining' (está lloviendo)", answer: "It" },
        { type: "translation", question: "Traduce: '¿Qué hora es?'", answer: "What time is it?" }
      ],
      ejercicioReferences: [
        "personal-pronouns",
        "personal-pronouns-2"
      ]
    }
  },

  102: {
    id: 102,
    title: "Possessives (Los posesivos)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Usar posesivos adjetivos (my, your, his, her, etc.)",
      "Usar posesivos pronombres (mine, yours, his, hers, etc.)",
      "Diferenciar entre 'my house' y 'the house is mine'"
    ],
    content: {
      vocabulary: [
        { english: "my", spanish: "Mi / Mis", pronunciation: "/maɪ/" },
        { english: "your", spanish: "Tu / Tus", pronunciation: "/jʊr/" },
        { english: "his", spanish: "Su / Sus (de él)", pronunciation: "/hɪz/" },
        { english: "her", spanish: "Su / Sus (de ella)", pronunciation: "/hɜr/" },
        { english: "its", spanish: "Su / Sus (de eso)", pronunciation: "/ɪts/" },
        { english: "our", spanish: "Nuestro / Nuestros", pronunciation: "/aʊr/" },
        { english: "their", spanish: "Su / Sus (de ellos)", pronunciation: "/ðɛr/" },
        { english: "mine", spanish: "Mío / Mía", pronunciation: "/maɪn/" },
        { english: "yours", spanish: "Tuyo / Tuya", pronunciation: "/jʊrz/" },
        { english: "hers", spanish: "Suyo / Suya (de ella)", pronunciation: "/hɜrz/" },
        { english: "ours", spanish: "Nuestro / Nuestra", pronunciation: "/aʊrz/" },
        { english: "theirs", spanish: "Suyo / Suya (de ellos)", pronunciation: "/ðɛrz/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'This is _____ house'", options: ["my", "mine", "I", "me"], correct: 0 },
        { type: "multiple-choice", question: "¿Cuál es correcto? 'The pen is _____'", options: ["my", "mine", "I", "me"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'This book is _____' (mío)", answer: "mine" },
        { type: "fill-blank", question: "Complete: 'Is this _____ car?' (tu)", answer: "your" }
      ],
      ejercicioReferences: [
        "possessives",
        "possessives-2",
        "Unit test"
      ]
    }
  },

  103: {
    id: 103,
    title: "Demonstrative Pronouns (Los pronombres demostrativos)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Usar 'this', 'that', 'these', 'those'",
      "Diferenciar entre singular y plural",
      "Diferenciar entre cercano y lejano"
    ],
    content: {
      vocabulary: [
        { english: "this", spanish: "Este / Esta (cercano, singular)", pronunciation: "/ðɪs/" },
        { english: "that", spanish: "Ese / Esa (lejano, singular)", pronunciation: "/ðæt/" },
        { english: "these", spanish: "Estos / Estas (cercano, plural)", pronunciation: "/ðiz/" },
        { english: "those", spanish: "Esos / Esas (lejano, plural)", pronunciation: "/ðoʊz/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál usas para un libro cerca de ti?", options: ["this", "that", "these", "those"], correct: 0 },
        { type: "multiple-choice", question: "¿Cuál usas para coches lejanos?", options: ["this", "that", "these", "those"], correct: 3 },
        { type: "fill-blank", question: "Complete: '_____ book is interesting' (este)", answer: "This" },
        { type: "fill-blank", question: "Complete: '_____ cars are expensive' (esos)", answer: "Those" }
      ],
      ejercicioReferences: [
        "demonstrative-pronouns",
        "demonstrative-pronouns-2",
        "Unit test"
      ]
    }
  },

  104: {
    id: 104,
    title: "Reflexive Pronouns (Los pronombres reflexivos)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.4,
    type: "Gramática",
    objectives: [
      "Entender cuándo usar pronombres reflexivos",
      "Usar 'myself', 'yourself', 'himself', 'herself', etc.",
      "Formar oraciones con acciones reflexivas"
    ],
    content: {
      vocabulary: [
        { english: "myself", spanish: "Mí mismo / Mí misma", pronunciation: "/maɪˈsɛlf/" },
        { english: "yourself", spanish: "Tú mismo / Tú misma", pronunciation: "/jʊrˈsɛlf/" },
        { english: "himself", spanish: "Él mismo", pronunciation: "/hɪmˈsɛlf/" },
        { english: "herself", spanish: "Ella misma", pronunciation: "/hɜrˈsɛlf/" },
        { english: "itself", spanish: "Eso mismo", pronunciation: "/ɪtˈsɛlf/" },
        { english: "ourselves", spanish: "Nosotros mismos", pronunciation: "/aʊrˈsɛlvz/" },
        { english: "yourselves", spanish: "Ustedes mismos", pronunciation: "/jʊrˈsɛlvz/" },
        { english: "themselves", spanish: "Ellos mismos", pronunciation: "/ðɛmˈsɛlvz/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I cooked this _____'", options: ["myself", "me", "my", "mine"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'She did it _____' (ella misma)", answer: "herself" },
        { type: "translation", question: "Traduce: 'Nosotros nos lavamos'", answer: "We wash ourselves" }
      ],
      ejercicioReferences: [
        "reflexive-pronouns",
        "reflexive-pronouns-2",
        "Unit test"
      ]
    }
  },

  // Unit 2: The Articles
  201: {
    id: 201,
    title: "The Definite Article (El artículo determinado)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Entender cuándo usar 'the'",
      "Usar 'the' con sustantivos específicos o conocidos",
      "Diferenciar entre 'the' y 'a/an'"
    ],
    content: {
      vocabulary: [
        { english: "the", spanish: "El / La / Los / Las", pronunciation: "/ðə/ o /ði/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I saw _____ dog' (un perro específico)", options: ["a", "an", "the", "-"], correct: 2 },
        { type: "fill-blank", question: "Complete: '_____ book on the table is mine'", answer: "The" },
        { type: "multiple-choice", question: "¿Cuándo usas 'the'?", options: ["Con sustantivos específicos", "Con sustantivos generales", "Siempre", "Nunca"], correct: 0 }
      ],
      ejercicioReferences: [
        "the-definite-article",
        "the-definite-article-2",
        "Unit test"
      ]
    }
  },

  202: {
    id: 202,
    title: "The Indefinite Article (El artículo indeterminado)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Usar 'a' y 'an' correctamente",
      "Entender cuándo usar cada uno",
      "Usar con sustantivos singulares no específicos"
    ],
    content: {
      vocabulary: [
        { english: "a", spanish: "Un / Una (antes de consonante)", pronunciation: "/ə/" },
        { english: "an", spanish: "Un / Una (antes de vocal)", pronunciation: "/æn/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? '_____ car'", options: ["a", "an", "the", "-"], correct: 0 },
        { type: "multiple-choice", question: "¿Cuál es correcto? '_____ apple'", options: ["a", "an", "the", "-"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I need _____ umbrella'", answer: "an" },
        { type: "fill-blank", question: "Complete: 'She has _____ dog'", answer: "a" }
      ],
      ejercicioReferences: [
        "the-indefinite-article",
        "the-indefinite-article-2",
        "Unit test"
      ]
    }
  },

  // Unit 3: Prepositions
  301: {
    id: 301,
    title: "Prepositions (Las preposiciones)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Entender qué son las preposiciones",
      "Usar 'in', 'on', 'at' para tiempo y lugar",
      "Formar oraciones con preposiciones"
    ],
    content: {
      vocabulary: [
        { english: "in", spanish: "En / Dentro de", pronunciation: "/ɪn/" },
        { english: "on", spanish: "En / Sobre", pronunciation: "/ɑn/" },
        { english: "at", spanish: "En / A", pronunciation: "/æt/" },
        { english: "for", spanish: "Para / Por", pronunciation: "/fɔr/" },
        { english: "to", spanish: "A / Hacia", pronunciation: "/tu/" },
        { english: "with", spanish: "Con", pronunciation: "/wɪð/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'The concert is _____ June'", options: ["in", "on", "at", "for"], correct: 0 },
        { type: "multiple-choice", question: "¿Cuál es correcto? 'The book is _____ the table'", options: ["in", "on", "at", "for"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I'll see you _____ 8 o'clock'", answer: "at" }
      ],
      ejercicioReferences: [
        "prepositions",
        "prepositions-2",
        "Unit test"
      ]
    }
  },

  302: {
    id: 302,
    title: "Prepositions of Place (Las preposiciones de lugar)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Usar preposiciones para expresar ubicación",
      "Diferenciar entre 'in', 'on', 'at', 'under', 'next to', etc.",
      "Describir posiciones de objetos"
    ],
    content: {
      vocabulary: [
        { english: "in", spanish: "En / Dentro de", pronunciation: "/ɪn/" },
        { english: "on", spanish: "Sobre / En", pronunciation: "/ɑn/" },
        { english: "at", spanish: "En / A", pronunciation: "/æt/" },
        { english: "under", spanish: "Debajo de", pronunciation: "/ˈʌndər/" },
        { english: "next to", spanish: "Al lado de", pronunciation: "/nɛkst tu/" },
        { english: "behind", spanish: "Detrás de", pronunciation: "/bɪˈhaɪnd/" },
        { english: "in front of", spanish: "Delante de", pronunciation: "/ɪn frʌnt ʌv/" },
        { english: "between", spanish: "Entre", pronunciation: "/bɪˈtwin/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'The book is _____ the table'", options: ["in", "on", "at", "under"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'The cat is _____ the table' (debajo)", answer: "under" },
        { type: "translation", question: "Traduce: 'El perro está al lado de la casa'", answer: "The dog is next to the house" }
      ],
      ejercicioReferences: [
        "prepositions-of-place",
        "prepositions-of-place-2",
        "Unit test"
      ]
    }
  },

  303: {
    id: 303,
    title: "Prepositions of Time (Las preposiciones de tiempo)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Usar preposiciones para expresar tiempo",
      "Usar 'in', 'on', 'at' con fechas y horas",
      "Usar 'before', 'after', 'during'"
    ],
    content: {
      vocabulary: [
        { english: "in", spanish: "En (meses, años, estaciones)", pronunciation: "/ɪn/" },
        { english: "on", spanish: "En (días de la semana, fechas)", pronunciation: "/ɑn/" },
        { english: "at", spanish: "A (horas específicas)", pronunciation: "/æt/" },
        { english: "before", spanish: "Antes de", pronunciation: "/bɪˈfɔr/" },
        { english: "after", spanish: "Después de", pronunciation: "/ˈæftər/" },
        { english: "during", spanish: "Durante", pronunciation: "/ˈdʊrɪŋ/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I'll see you _____ Monday'", options: ["in", "on", "at", "for"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'Are you going to eat _____ or _____ the cinema?'", answer: "before, after" },
        { type: "translation", question: "Traduce: 'Voy a la fiesta en junio'", answer: "I'm going to the party in June" }
      ],
      ejercicioReferences: [
        "prepositions-of-time",
        "prepositions-of-time-2",
        "Unit test"
      ]
    }
  },

  304: {
    id: 304,
    title: "Prepositions of Movement or Direction (Las preposiciones de movimiento o dirección)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Usar preposiciones para expresar movimiento",
      "Usar 'to', 'through', 'over', 'across', etc.",
      "Describir direcciones y movimientos"
    ],
    content: {
      vocabulary: [
        { english: "to", spanish: "A / Hacia", pronunciation: "/tu/" },
        { english: "through", spanish: "A través de", pronunciation: "/θru/" },
        { english: "over", spanish: "Sobre / Encima de", pronunciation: "/ˈoʊvər/" },
        { english: "across", spanish: "A través de / Al otro lado", pronunciation: "/əˈkrɔs/" },
        { english: "into", spanish: "Dentro de / Hacia dentro", pronunciation: "/ˈɪntu/" },
        { english: "out of", spanish: "Fuera de", pronunciation: "/aʊt ʌv/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'Go _____ the door'", options: ["to", "through", "over", "across"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'Walk _____ the bridge' (a través)", answer: "across" },
        { type: "translation", question: "Traduce: 'Salta sobre la valla'", answer: "Jump over the fence" }
      ],
      ejercicioReferences: [
        "prepositions-of-movement-or-direction",
        "prepositions-of-movement-or-direction-2",
        "Unit test"
      ]
    }
  },

  // Unit 4: Nouns
  401: {
    id: 401,
    title: "Nouns (Los nombres)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Entender qué son los nombres",
      "Identificar nombres de objetos, lugares y personas",
      "Usar nombres en oraciones"
    ],
    content: {
      vocabulary: [
        { english: "ball", spanish: "Pelota", pronunciation: "/bɔl/" },
        { english: "house", spanish: "Casa", pronunciation: "/haʊs/" },
        { english: "friend", spanish: "Amigo", pronunciation: "/frɛnd/" },
        { english: "teacher", spanish: "Maestro", pronunciation: "/ˈtitʃər/" },
        { english: "happiness", spanish: "Felicidad", pronunciation: "/ˈhæpɪnəs/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es un nombre?", options: ["big", "run", "house", "happy"], correct: 2 },
        { type: "fill-blank", question: "Complete: 'I have a _____' (pelota)", answer: "ball" }
      ],
      ejercicioReferences: [
        "nouns",
        "nouns-2",
        "Unit test"
      ]
    }
  },

  402: {
    id: 402,
    title: "Proper Nouns (Los nombres propios)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Entender qué son los nombres propios",
      "Usar mayúsculas con nombres propios",
      "Diferenciar entre nombres comunes y propios"
    ],
    content: {
      vocabulary: [
        { english: "John", spanish: "Juan (nombre propio)", pronunciation: "/dʒɑn/" },
        { english: "London", spanish: "Londres", pronunciation: "/ˈlʌndən/" },
        { english: "Monday", spanish: "Lunes", pronunciation: "/ˈmʌndeɪ/" },
        { english: "Christmas", spanish: "Navidad", pronunciation: "/ˈkrɪsməs/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es un nombre propio?", options: ["city", "John", "book", "car"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I live in _____' (Londres)", answer: "London" }
      ],
      ejercicioReferences: [
        "proper-nouns",
        "proper-nouns-2",
        "Unit test"
      ]
    }
  },

  403: {
    id: 403,
    title: "Countable and Uncountable Nouns (Los nombres contables e incontables)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Diferenciar entre nombres contables e incontables",
      "Usar 'a/an' con contables",
      "Formar plurales de nombres contables"
    ],
    content: {
      vocabulary: [
        { english: "bicycle", spanish: "Bicicleta (contable)", pronunciation: "/ˈbaɪsɪkəl/" },
        { english: "bicycles", spanish: "Bicicletas (plural)", pronunciation: "/ˈbaɪsɪkəlz/" },
        { english: "water", spanish: "Agua (incontable)", pronunciation: "/ˈwɔtər/" },
        { english: "milk", spanish: "Leche (incontable)", pronunciation: "/mɪlk/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es incontable?", options: ["bicycle", "water", "book", "car"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I have 3 _____' (bicicletas)", answer: "bicycles" }
      ],
      ejercicioReferences: [
        "countable-and-uncountable-nouns",
        "countable-and-uncountable-nouns-2",
        "Unit test"
      ]
    }
  },

  404: {
    id: 404,
    title: "There Be (Haber)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Usar 'there is' y 'there are'",
      "Diferenciar entre singular y plural",
      "Formar oraciones con 'there be'"
    ],
    content: {
      vocabulary: [
        { english: "there is", spanish: "Hay (singular)", pronunciation: "/ðɛr ɪz/" },
        { english: "there are", spanish: "Hay (plural)", pronunciation: "/ðɛr ɑr/" },
        { english: "there isn't", spanish: "No hay (singular)", pronunciation: "/ðɛr ˈɪzənt/" },
        { english: "there aren't", spanish: "No hay (plural)", pronunciation: "/ðɛr ɑrnt/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? '_____ a cat'", options: ["There is", "There are", "There be", "There has"], correct: 0 },
        { type: "fill-blank", question: "Complete: '_____ 4 chairs' (hay)", answer: "There are" }
      ],
      ejercicioReferences: [
        "there-be",
        "there-be-2",
        "Unit test"
      ]
    }
  },

  405: {
    id: 405,
    title: "Quantifiers (Los cuantificadores)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Usar 'some' y 'any'",
      "Usar cuantificadores con nombres contables e incontables",
      "Formar preguntas y negaciones"
    ],
    content: {
      vocabulary: [
        { english: "some", spanish: "Algunos / Algo de", pronunciation: "/sʌm/" },
        { english: "any", spanish: "Algún / Alguna / Ningún", pronunciation: "/ˈɛni/" },
        { english: "many", spanish: "Muchos", pronunciation: "/ˈmɛni/" },
        { english: "much", spanish: "Mucho", pronunciation: "/mʌtʃ/" },
        { english: "a lot of", spanish: "Mucho / Muchos", pronunciation: "/ə lɑt ʌv/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'Have you got _____ eggs?'", options: ["some", "any", "many", "much"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'Yes, there are _____ in the fridge'", answer: "some" }
      ],
      ejercicioReferences: [
        "quantifiers",
        "quantifiers-2",
        "Unit test"
      ]
    }
  },

  // Unit 5: Adjectives
  501: {
    id: 501,
    title: "Adjectives (Los adjetivos)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Entender qué son los adjetivos",
      "Usar adjetivos para describir nombres",
      "Colocar adjetivos correctamente en oraciones"
    ],
    content: {
      vocabulary: [
        { english: "big", spanish: "Grande", pronunciation: "/bɪɡ/" },
        { english: "tall", spanish: "Alto", pronunciation: "/tɔl/" },
        { english: "long", spanish: "Largo", pronunciation: "/lɔŋ/" },
        { english: "small", spanish: "Pequeño", pronunciation: "/smɔl/" },
        { english: "beautiful", spanish: "Hermoso", pronunciation: "/ˈbjutəfəl/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es un adjetivo?", options: ["house", "big", "run", "quickly"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'A _____ house' (grande)", answer: "big" }
      ],
      ejercicioReferences: [
        "adjectives",
        "adjectives-2",
        "Unit test"
      ]
    }
  },

  // Unit 6: Verbs
  601: {
    id: 601,
    title: "Verbs (Los verbos)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Entender qué son los verbos",
      "Identificar verbos en oraciones",
      "Usar verbos para expresar acciones"
    ],
    content: {
      vocabulary: [
        { english: "run", spanish: "Correr", pronunciation: "/rʌn/" },
        { english: "like", spanish: "Gustar", pronunciation: "/laɪk/" },
        { english: "is", spanish: "Es / Está", pronunciation: "/ɪz/" },
        { english: "eat", spanish: "Comer", pronunciation: "/it/" },
        { english: "sleep", spanish: "Dormir", pronunciation: "/slip/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es un verbo?", options: ["house", "big", "run", "happy"], correct: 2 },
        { type: "fill-blank", question: "Complete: 'He _____' (corre)", answer: "runs" }
      ],
      ejercicioReferences: [
        "verbs",
        "verbs-2",
        "Unit test"
      ]
    }
  },

  602: {
    id: 602,
    title: "To Be (Ser/Estar)",
    level: "A1",
    duration: "25 min",
    difficulty: "Básico",
    rating: 4.8,
    type: "Gramática",
    objectives: [
      "Conjugar el verbo 'to be'",
      "Usar 'am', 'is', 'are' correctamente",
      "Formar oraciones afirmativas, negativas e interrogativas"
    ],
    content: {
      vocabulary: [
        { english: "am", spanish: "Soy / Estoy (yo)", pronunciation: "/æm/" },
        { english: "is", spanish: "Es / Está (él/ella/eso)", pronunciation: "/ɪz/" },
        { english: "are", spanish: "Son / Están (ellos/nosotros)", pronunciation: "/ɑr/" },
        { english: "was", spanish: "Era / Estaba (pasado)", pronunciation: "/wʌz/" },
        { english: "were", spanish: "Eran / Estaban (pasado)", pronunciation: "/wɜr/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'He _____ my friend'", options: ["am", "is", "are", "be"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'They _____ at school' (estaban)", answer: "were" }
      ],
      ejercicioReferences: [
        "to-be",
        "to-be-2",
        "Unit test"
      ]
    }
  },

  603: {
    id: 603,
    title: "Short Forms (Las formas cortas)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Usar formas cortas en inglés",
      "Contraer 'I am' a 'I'm'",
      "Usar formas cortas en conversación"
    ],
    content: {
      vocabulary: [
        { english: "I'm", spanish: "Yo soy / Yo estoy", pronunciation: "/aɪm/" },
        { english: "you're", spanish: "Tú eres / Tú estás", pronunciation: "/jʊr/" },
        { english: "he's", spanish: "Él es / Él está", pronunciation: "/hiz/" },
        { english: "she's", spanish: "Ella es / Ella está", pronunciation: "/ʃiz/" },
        { english: "it's", spanish: "Eso es / Eso está", pronunciation: "/ɪts/" },
        { english: "we're", spanish: "Nosotros somos / estamos", pronunciation: "/wɪr/" },
        { english: "they're", spanish: "Ellos son / están", pronunciation: "/ðɛr/" }
      ],
      exercises: [
        { type: "fill-blank", question: "Complete: '_____ happy' (Yo estoy)", answer: "I'm" },
        { type: "translation", question: "Traduce: 'Ella es mi hermana'", answer: "She's my sister" }
      ],
      ejercicioReferences: [
        "short-forms",
        "short-forms-2",
        "Unit test"
      ]
    }
  },

  604: {
    id: 604,
    title: "Have vs. Have got (El verbo tener)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Usar 'have' y 'have got'",
      "Expresar posesión",
      "Formar preguntas y negaciones"
    ],
    content: {
      vocabulary: [
        { english: "have", spanish: "Tener", pronunciation: "/hæv/" },
        { english: "have got", spanish: "Tener (más común en UK)", pronunciation: "/hæv ɡɑt/" },
        { english: "has", spanish: "Tiene", pronunciation: "/hæz/" },
        { english: "has got", spanish: "Tiene", pronunciation: "/hæz ɡɑt/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I _____ 2 cats'", options: ["have", "has", "am", "is"], correct: 0 },
        { type: "fill-blank", question: "Complete: '_____ you _____ any pets?'", answer: "Have, got" }
      ],
      ejercicioReferences: [
        "have-vs-have-got",
        "have-vs-have-got-2",
        "Unit test"
      ]
    }
  },

  605: {
    id: 605,
    title: "Modal Verbs (Los verbos modales)",
    level: "A1",
    duration: "25 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Entender qué son los verbos modales",
      "Usar 'can', 'might', 'should', etc.",
      "Expresar habilidad, posibilidad y obligación"
    ],
    content: {
      vocabulary: [
        { english: "can", spanish: "Poder (habilidad)", pronunciation: "/kæn/" },
        { english: "might", spanish: "Podría (posibilidad)", pronunciation: "/maɪt/" },
        { english: "should", spanish: "Debería", pronunciation: "/ʃʊd/" },
        { english: "must", spanish: "Debe", pronunciation: "/mʌst/" },
        { english: "will", spanish: "Voluntad / Futuro", pronunciation: "/wɪl/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál expresa habilidad?", options: ["can", "might", "should", "must"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'She _____ play the piano' (puede)", answer: "can" }
      ],
      ejercicioReferences: [
        "modal-verbs",
        "modal-verbs-2",
        "Unit test"
      ]
    }
  },

  // Unit 7: Sentence Structure
  701: {
    id: 701,
    title: "Constructing Sentences (Construir frases)",
    level: "A1",
    duration: "25 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Entender el orden de palabras en inglés",
      "Construir oraciones afirmativas",
      "Construir oraciones negativas e interrogativas"
    ],
    content: {
      vocabulary: [
        { english: "subject", spanish: "Sujeto", pronunciation: "/ˈsʌbdʒɛkt/" },
        { english: "verb", spanish: "Verbo", pronunciation: "/vɜrb/" },
        { english: "object", spanish: "Objeto", pronunciation: "/ˈɑbdʒɛkt/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es el orden correcto?", options: ["Subject-Verb-Object", "Verb-Subject-Object", "Object-Verb-Subject", "Subject-Object-Verb"], correct: 0 },
        { type: "fill-blank", question: "Ordena: 'English / I / speak'", answer: "I speak English" }
      ],
      ejercicioReferences: [
        "constructing-sentences",
        "constructing-sentences-2",
        "Unit test"
      ]
    }
  },

  702: {
    id: 702,
    title: "Imperative Sentences (Las frases imperativas)",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.5,
    type: "Gramática",
    objectives: [
      "Formar oraciones imperativas",
      "Dar órdenes e instrucciones",
      "Usar 'don't' en imperativas negativas",
      "Usar 'let's' para incluirnos a nosotros mismos"
    ],
    content: {
      vocabulary: [
        { english: "Do your homework!", spanish: "¡Haz los deberes!", pronunciation: "/du jʊr ˈhoʊmwɜrk/" },
        { english: "Wash your hands!", spanish: "¡Lavaros las manos!", pronunciation: "/wɑʃ jʊr hændz/" },
        { english: "Tell me the truth!", spanish: "¡Dime la verdad!", pronunciation: "/tɛl mi ðə truθ/" },
        { english: "Do not lie to me!", spanish: "¡No me mientas!", pronunciation: "/du nɑt laɪ tu mi/" },
        { english: "Do not wash in the washing machine", spanish: "No lo lave en la lavadora", pronunciation: "/du nɑt wɑʃ ɪn ðə ˈwɑʃɪŋ məˈʃin/" },
        { english: "Don't hit your sister!", spanish: "¡No le pegues a tu hermana!", pronunciation: "/doʊnt hɪt jʊr ˈsɪstər/" },
        { english: "Let's go!", spanish: "¡Nos vamos!", pronunciation: "/lɛts ɡoʊ/" },
        { english: "Let's not fight", spanish: "No nos peleemos", pronunciation: "/lɛts nɑt faɪt/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es imperativa?", options: ["I wash my hands", "Wash your hands", "He washes", "They washed"], correct: 1 },
        { type: "multiple-choice", question: "¿Cuál es imperativa negativa?", options: ["Do your homework", "Don't hit your sister", "He doesn't do it", "They don't go"], correct: 1 },
        { type: "fill-blank", question: "Complete: '_____ do that' (no)", answer: "Don't" },
        { type: "fill-blank", question: "Complete: '_____ your hands!' (lava)", answer: "Wash" },
        { type: "translation", question: "Traduce: '¡Dime la verdad!'", answer: "Tell me the truth!" },
        { type: "translation", question: "Traduce: '¡No me mientas!'", answer: "Don't lie to me!" },
        { type: "translation", question: "Traduce: '¡Nos vamos!'", answer: "Let's go!" }
      ],
      ejercicioReferences: [
        "imperative-sentences",
        "imperative-sentences-2",
        "Unit test"
      ]
    }
  },

  // Unit 8: Verb Tenses - Present
  801: {
    id: 801,
    title: "Present Simple (El presente simple)",
    level: "A1",
    duration: "25 min",
    difficulty: "Básico",
    rating: 4.8,
    type: "Gramática",
    objectives: [
      "Usar Present Simple para rutinas",
      "Conjugar verbos en presente",
      "Formar oraciones afirmativas, negativas e interrogativas"
    ],
    content: {
      vocabulary: [
        { english: "speak", spanish: "Hablar", pronunciation: "/spik/" },
        { english: "works", spanish: "Trabaja", pronunciation: "/wɜrks/" },
        { english: "go", spanish: "Ir", pronunciation: "/ɡoʊ/" },
        { english: "do", spanish: "Hacer", pronunciation: "/du/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I _____ English'", options: ["speak", "speaks", "speaking", "spoke"], correct: 0 },
        { type: "fill-blank", question: "Complete: 'He _____ at a factory' (trabaja)", answer: "works" }
      ],
      ejercicioReferences: [
        "present-simple",
        "present-simple-2",
        "Unit test"
      ]
    }
  },

  802: {
    id: 802,
    title: "Present Continuous (El presente continuo)",
    level: "A1",
    duration: "25 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Gramática",
    objectives: [
      "Usar Present Continuous para acciones en progreso",
      "Formar con 'am/is/are + verb-ing'",
      "Diferenciar entre Present Simple y Continuous"
    ],
    content: {
      vocabulary: [
        { english: "am wearing", spanish: "Estoy usando", pronunciation: "/æm ˈwɛrɪŋ/" },
        { english: "is going", spanish: "Está yendo", pronunciation: "/ɪz ˈɡoʊɪŋ/" },
        { english: "are playing", spanish: "Están jugando", pronunciation: "/ɑr ˈpleɪɪŋ/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál es correcto? 'I _____ a blue jacket'", options: ["wear", "wears", "am wearing", "wore"], correct: 2 },
        { type: "fill-blank", question: "Complete: 'She _____ to school' (está yendo)", answer: "is going" }
      ],
      ejercicioReferences: [
        "present-continuous",
        "present-continuous-2",
        "Unit test"
      ]
    }
  },

  803: {
    id: 803,
    title: "Continuous Verb Tenses (Tiempos continuos de los verbos)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Gramática",
    objectives: [
      "Entender qué verbos NO usamos en forma continua",
      "Identificar verbos de estado",
      "Usar correctamente verbos estáticos"
    ],
    content: {
      vocabulary: [
        { english: "know", spanish: "Saber (no continuo)", pronunciation: "/noʊ/" },
        { english: "like", spanish: "Gustar (no continuo)", pronunciation: "/laɪk/" },
        { english: "want", spanish: "Querer (no continuo)", pronunciation: "/wɑnt/" },
        { english: "need", spanish: "Necesitar (no continuo)", pronunciation: "/nid/" }
      ],
      exercises: [
        { type: "multiple-choice", question: "¿Cuál NO se usa en continuo?", options: ["run", "know", "play", "eat"], correct: 1 },
        { type: "fill-blank", question: "Complete: 'I _____ English' (sé) - NO continuo", answer: "know" }
      ],
      ejercicioReferences: [
        "continuous-verb-tenses",
        "continuous-verb-tenses-2",
        "Unit test"
      ]
    }
  },

  // Unit 9: Numbers, Dates, Time
  901: {
    id: 901,
    title: "Cardinal Numbers (Los números cardinales)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.8,
    type: "Vocabulario",
    objectives: [
      "Contar del 1 al 100",
      "Decir números grandes",
      "Usar números en conversación"
    ],
    content: {
      vocabulary: [
        { english: "one", spanish: "Uno", pronunciation: "/wʌn/" },
        { english: "two", spanish: "Dos", pronunciation: "/tu/" },
        { english: "ten", spanish: "Diez", pronunciation: "/tɛn/" },
        { english: "twenty", spanish: "Veinte", pronunciation: "/ˈtwɛnti/" },
        { english: "one hundred", spanish: "Cien", pronunciation: "/wʌn ˈhʌndrəd/" }
      ],
      exercises: [
        { type: "fill-blank", question: "Escribe en inglés: 15", answer: "fifteen" },
        { type: "fill-blank", question: "Escribe en inglés: 50", answer: "fifty" }
      ],
      ejercicioReferences: [
        "cardinal-numbers",
        "cardinal-numbers-2",
        "Unit test"
      ]
    }
  },

  902: {
    id: 902,
    title: "Ordinal Numbers (Los números ordinales)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Vocabulario",
    objectives: [
      "Usar números ordinales",
      "Expresar orden y posición",
      "Formar ordinales correctamente"
    ],
    content: {
      vocabulary: [
        { english: "first", spanish: "Primero", pronunciation: "/fɜrst/" },
        { english: "second", spanish: "Segundo", pronunciation: "/ˈsɛkənd/" },
        { english: "third", spanish: "Tercero", pronunciation: "/θɜrd/" },
        { english: "fourth", spanish: "Cuarto", pronunciation: "/fɔrθ/" },
        { english: "fifth", spanish: "Quinto", pronunciation: "/fɪfθ/" }
      ],
      exercises: [
        { type: "fill-blank", question: "Complete: 'Tom is _____' (primero)", answer: "first" },
        { type: "fill-blank", question: "Complete: 'Sally is _____' (segundo)", answer: "second" }
      ],
      ejercicioReferences: [
        "ordinal-numbers",
        "ordinal-numbers-2",
        "Unit test"
      ]
    }
  },

  903: {
    id: 903,
    title: "The Date (La fecha)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.6,
    type: "Vocabulario",
    objectives: [
      "Decir fechas en inglés",
      "Usar meses y días",
      "Formar fechas correctamente"
    ],
    content: {
      vocabulary: [
        { english: "January", spanish: "Enero", pronunciation: "/ˈdʒænjʊˌɛri/" },
        { english: "December", spanish: "Diciembre", pronunciation: "/dɪˈsɛmbər/" },
        { english: "May", spanish: "Mayo", pronunciation: "/meɪ/" },
        { english: "today", spanish: "Hoy", pronunciation: "/təˈdeɪ/" },
        { english: "birthday", spanish: "Cumpleaños", pronunciation: "/ˈbɜrθdeɪ/" }
      ],
      exercises: [
        { type: "fill-blank", question: "Complete: 'Today is the 14th of _____' (diciembre)", answer: "December" },
        { type: "translation", question: "Traduce: 'Su cumpleaños es en mayo'", answer: "His birthday is in May" }
      ],
      ejercicioReferences: [
        "the-date",
        "the-date-2",
        "Unit test"
      ]
    }
  },

  904: {
    id: 904,
    title: "Time (La hora)",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico",
    rating: 4.7,
    type: "Vocabulario",
    objectives: [
      "Preguntar y decir la hora",
      "Usar 'o'clock', 'half past', 'quarter to'",
      "Expresar horas en formato 12 y 24 horas"
    ],
    content: {
      vocabulary: [
        { english: "o'clock", spanish: "En punto", pronunciation: "/əˈklɑk/" },
        { english: "half past", spanish: "Y media", pronunciation: "/hæf pæst/" },
        { english: "quarter past", spanish: "Y cuarto", pronunciation: "/ˈkwɔrtər pæst/" },
        { english: "quarter to", spanish: "Menos cuarto", pronunciation: "/ˈkwɔrtər tu/" },
        { english: "What time is it?", spanish: "¿Qué hora es?", pronunciation: "/wʌt taɪm ɪz ɪt/" }
      ],
      exercises: [
        { type: "fill-blank", question: "Complete: 'It's four _____' (en punto)", answer: "o'clock" },
        { type: "translation", question: "Traduce: '¿Qué hora es?'", answer: "What time is it?" }
      ],
      ejercicioReferences: [
        "time",
        "time-2",
        "Unit test"
      ]
    }
  }
};

