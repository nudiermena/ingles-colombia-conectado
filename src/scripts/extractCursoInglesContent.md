# Script para Extraer Contenido de Curso-Ingles.com

## Cómo Usar

Este documento describe cómo extraer el contenido real de las páginas de curso-ingles.com.

## Estructura de URLs

Las URLs siguen este patrón:
- Base: `https://curso-ingles.com/aprender/cursos/nivel-basico/`
- Lección: `{unit}/{lesson-slug}`

Ejemplo:
- `https://curso-ingles.com/aprender/cursos/nivel-basico/pronouns/personal-pronouns`
- `https://curso-ingles.com/aprender/cursos/nivel-basico/sentence-structure/imperative-sentences`

## Contenido a Extraer

Para cada lección, necesitas extraer:

1. **Vocabulary (Vocabulario)**
   - Ejemplos de la tabla en la página
   - Formato: `{ english: "...", spanish: "...", pronunciation: "/.../" }`

2. **Exercises (Ejercicios)**
   - Mencionados en la sección "Ejercicios"
   - Ejemplos: "imperative-sentences", "imperative-sentences-2", "Unit test"

3. **Objectives (Objetivos)**
   - Basados en el contenido de la lección
   - Extraídos de las explicaciones

4. **Content Structure**
   - Estructura de la explicación
   - Ejemplos dados en la página

## Ejemplo: Imperative Sentences

### URL
`https://curso-ingles.com/aprender/cursos/nivel-basico/sentence-structure/imperative-sentences`

### Vocabulary Extraído
```javascript
vocabulary: [
  { english: "Do your homework!", spanish: "¡Haz los deberes!", pronunciation: "/du jʊr ˈhoʊmwɜrk/" },
  { english: "Wash your hands!", spanish: "¡Lavaros las manos!", pronunciation: "/wɑʃ jʊr hændz/" },
  { english: "Tell me the truth!", spanish: "¡Dime la verdad!", pronunciation: "/tɛl mi ðə truθ/" },
  { english: "Do not lie to me!", spanish: "¡No me mientas!", pronunciation: "/du nɑt laɪ tu mi/" },
  { english: "Do not wash in the washing machine", spanish: "No lo lave en la lavadora", pronunciation: "/du nɑt wɑʃ ɪn ðə ˈwɑʃɪŋ məˈʃin/" },
  { english: "Don't hit your sister!", spanish: "¡No le pegues a tu hermana!", pronunciation: "/doʊnt hɪt jʊr ˈsɪstər/" },
  { english: "Let's go!", spanish: "¡Nos vamos!", pronunciation: "/lɛts ɡoʊ/" },
  { english: "Let's not fight", spanish: "No nos peleemos", pronunciation: "/lɛts nɑt faɪt/" }
]
```

### Exercises Extraídos
- "imperative-sentences"
- "imperative-sentences-2"
- "Unit test"

## Lista de Lecciones a Extraer

### Unit 1: Pronouns
- [ ] personal-pronouns
- [ ] possessives
- [ ] demonstrative-pronouns
- [ ] reflexive-pronouns

### Unit 2: The Articles
- [ ] the-definite-article
- [ ] the-indefinite-article

### Unit 3: Prepositions
- [ ] prepositions
- [ ] prepositions-of-place
- [ ] prepositions-of-time
- [ ] prepositions-of-movement-or-direction

### Unit 4: Nouns
- [ ] nouns
- [ ] proper-nouns
- [ ] countable-and-uncountable-nouns
- [ ] there-be
- [ ] quantifiers

### Unit 5: Adjectives
- [ ] adjectives

### Unit 6: Verbs
- [ ] verbs
- [ ] to-be
- [ ] short-forms
- [ ] have-vs-have-got
- [ ] modal-verbs

### Unit 7: Sentence Structure
- [ ] constructing-sentences
- [x] imperative-sentences (COMPLETADO)

### Unit 8: Verb Tenses - Present
- [ ] present-simple
- [ ] present-continuous
- [ ] continuous-verb-tenses

### Unit 9: Numbers, Dates, Time
- [ ] cardinal-numbers
- [ ] ordinal-numbers
- [ ] the-date
- [ ] time

## Proceso Manual

1. Visita cada URL de lección
2. Extrae el vocabulario de las tablas
3. Extrae los ejercicios mencionados
4. Actualiza `src/data/cursoInglesLessons.ts` con el contenido real

## Proceso Automatizado (Futuro)

Se podría crear un script de web scraping, pero requiere:
- Manejo de CORS
- Parsing de HTML
- Extracción de tablas y contenido estructurado

