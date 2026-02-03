# Guía para Extraer Lecciones de Curso-Ingles.com

## Opciones Disponibles

### Opción 1: Extracción Manual (Recomendado)
1. Visita cada página de lección en curso-ingles.com
2. Copia el contenido (vocabulario, ejemplos, ejercicios)
3. Proporciónalo y lo agregaré al archivo `cursoInglesLessons.ts`

### Opción 2: Script de Navegador (Semi-Automático)
Puedo crear un script que ejecutes en la consola del navegador para extraer el contenido automáticamente.

### Opción 3: Lista de URLs
Proporcióname las URLs de todas las lecciones y te ayudo a estructurar el proceso de extracción.

## Estructura de Datos Necesaria

Para cada lección necesitamos:

```typescript
{
  id: number,
  title: string,
  level: "A1",
  duration: string,
  difficulty: string,
  rating: number,
  type: string,
  objectives: string[],
  content: {
    vocabulary: [
      {
        english: string,
        spanish: string,
        pronunciation: string,
        example: string  // NUEVO: Ejemplo de uso
      }
    ],
    exercises: [
      {
        type: "multiple-choice" | "fill-blank" | "translation" | "matching",
        question: string,
        options?: string[],  // Para multiple-choice
        answer?: string,     // Para fill-blank y translation
        correct?: number     // Para multiple-choice (índice)
      }
    ],
    ejercicioReferences: string[]  // Referencias a ejercicios adicionales
  }
}
```

## URLs de Lecciones A1

Basado en la estructura de curso-ingles.com:

### Unit 1: Pronouns
- Personal Pronouns: https://curso-ingles.com/aprender/cursos/nivel-basico/pronouns/personal-pronouns
- Possessives: https://curso-ingles.com/aprender/cursos/nivel-basico/pronouns/possessives
- Demonstrative Pronouns: https://curso-ingles.com/aprender/cursos/nivel-basico/pronouns/demonstrative-pronouns
- Reflexive Pronouns: https://curso-ingles.com/aprender/cursos/nivel-basico/pronouns/reflexive-pronouns

### Unit 2: Articles
- Definite Article: https://curso-ingles.com/aprender/cursos/nivel-basico/articles/definite-article
- Indefinite Article: https://curso-ingles.com/aprender/cursos/nivel-basico/articles/indefinite-article

### Unit 3: Prepositions
- Prepositions of Place: https://curso-ingles.com/aprender/cursos/nivel-basico/prepositions/prepositions-of-place
- Prepositions of Time: https://curso-ingles.com/aprender/cursos/nivel-basico/prepositions/prepositions-of-time
- Prepositions of Movement: https://curso-ingles.com/aprender/cursos/nivel-basico/prepositions/prepositions-of-movement

### Unit 4: Nouns
- Nouns: https://curso-ingles.com/aprender/cursos/nivel-basico/nouns/nouns
- Proper Nouns: https://curso-ingles.com/aprender/cursos/nivel-basico/nouns/proper-nouns
- Countable and Uncountable Nouns: https://curso-ingles.com/aprender/cursos/nivel-basico/nouns/countable-and-uncountable-nouns
- There Be: https://curso-ingles.com/aprender/cursos/nivel-basico/nouns/there-be
- Quantifiers: https://curso-ingles.com/aprender/cursos/nivel-basico/nouns/quantifiers

### Unit 5: Adjectives
- Adjectives: https://curso-ingles.com/aprender/cursos/nivel-basico/adjectives/adjectives

### Unit 6: Verbs
- To Be: https://curso-ingles.com/aprender/cursos/nivel-basico/verbs/to-be
- Short Forms: https://curso-ingles.com/aprender/cursos/nivel-basico/verbs/short-forms
- Have vs. Have got: https://curso-ingles.com/aprender/cursos/nivel-basico/verbs/have-vs-have-got
- Modal Verbs: https://curso-ingles.com/aprender/cursos/nivel-basico/verbs/modal-verbs

### Unit 7: Sentence Structure
- Constructing Sentences: https://curso-ingles.com/aprender/cursos/nivel-basico/sentence-structure/constructing-sentences
- Imperative Sentences: https://curso-ingles.com/aprender/cursos/nivel-basico/sentence-structure/imperative-sentences

### Unit 8: Verb Tenses: Present
- Present Simple: https://curso-ingles.com/aprender/cursos/nivel-basico/verb-tenses-present/present-simple
- Present Continuous: https://curso-ingles.com/aprender/cursos/nivel-basico/verb-tenses-present/present-continuous
- Continuous Verb Tenses: https://curso-ingles.com/aprender/cursos/nivel-basico/verb-tenses-present/continuous-verb-tenses

### Unit 9: Numbers, Dates, Time
- Cardinal Numbers: https://curso-ingles.com/aprender/cursos/nivel-basico/numbers-dates-time/cardinal-numbers
- Ordinal Numbers: https://curso-ingles.com/aprender/cursos/nivel-basico/numbers-dates-time/ordinal-numbers
- The Date: https://curso-ingles.com/aprender/cursos/nivel-basico/numbers-dates-time/the-date
- Time: https://curso-ingles.com/aprender/cursos/nivel-basico/numbers-dates-time/time

## Qué Extraer de Cada Página

### 1. Vocabulario (Vocabulary)
- Busca las tablas con palabras en inglés y español
- Extrae: palabra en inglés, traducción, pronunciación (si está disponible)
- Extrae los ejemplos de uso (las frases de ejemplo en las tablas)

### 2. Ejercicios (Exercises)
- Busca la sección "Ejercicios" al final de la página
- Anota los nombres de los ejercicios (ej: "personal-pronouns", "personal-pronouns-2")
- Si hay ejercicios interactivos en la página, extrae:
  - Preguntas
  - Opciones (para multiple-choice)
  - Respuestas correctas

### 3. Objetivos (Objectives)
- Basados en el contenido de la lección
- Extrae de las secciones principales

## Próximos Pasos

1. **Proporcióname las URLs** de las lecciones que quieres que actualice
2. **O proporciona el contenido** de páginas específicas y lo estructuraré
3. **O ejecuta el script** que puedo crear para extraer el contenido automáticamente

¿Qué opción prefieres?

