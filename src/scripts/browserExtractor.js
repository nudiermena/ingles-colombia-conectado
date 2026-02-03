/**
 * Script para extraer contenido de curso-ingles.com
 * 
 * INSTRUCCIONES:
 * 1. Abre la página de la lección en curso-ingles.com
 * 2. Abre la consola del navegador (F12)
 * 3. Pega este script completo
 * 4. Ejecuta: extractLessonContent()
 * 5. Copia el resultado JSON
 */

function extractLessonContent() {
  const result = {
    title: '',
    vocabulary: [],
    exercises: [],
    ejercicioReferences: [],
    objectives: []
  };

  // Extraer título
  const titleElement = document.querySelector('h1');
  if (titleElement) {
    result.title = titleElement.textContent.trim();
  }

  // Extraer vocabulario de las tablas
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const english = cells[0]?.textContent.trim() || '';
        const spanish = cells[1]?.textContent.trim() || '';
        
        // Buscar pronunciación en el texto
        const pronunciationMatch = english.match(/\[([^\]]+)\]/);
        const pronunciation = pronunciationMatch ? pronunciationMatch[1] : '';
        
        // Buscar ejemplo (si hay un tercer elemento o enlace)
        const exampleLink = row.querySelector('a[href*="#"]');
        let example = '';
        if (exampleLink) {
          const exampleText = exampleLink.getAttribute('href');
          if (exampleText) {
            const exampleElement = document.querySelector(exampleText);
            if (exampleElement) {
              example = exampleElement.textContent.trim();
            }
          }
        }

        if (english && spanish) {
          result.vocabulary.push({
            english: english.replace(/\[([^\]]+)\]/g, '').trim(),
            spanish: spanish,
            pronunciation: pronunciation || '',
            example: example || ''
          });
        }
      }
    });
  });

  // Extraer ejercicios referenciados
  const ejercicioSection = document.querySelector('h2, h3, .ejercicios, [class*="ejercicio"]');
  if (ejercicioSection) {
    const ejercicioLinks = ejercicioSection.parentElement?.querySelectorAll('a[href*="ejercicio"], a[href*="exercise"]');
    if (ejercicioLinks) {
      ejercicioLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const match = href.match(/([^\/]+)$/);
          if (match) {
            result.ejercicioReferences.push(match[1]);
          }
        }
      });
    }
  }

  // Buscar texto de ejercicios en la página
  const ejercicioText = document.querySelectorAll('a[href*="personal-pronouns"], a[href*="ejercicio"]');
  ejercicioText.forEach(link => {
    const text = link.textContent.trim();
    if (text && !result.ejercicioReferences.includes(text)) {
      result.ejercicioReferences.push(text.toLowerCase().replace(/\s+/g, '-'));
    }
  });

  // Extraer objetivos de las secciones principales
  const sections = document.querySelectorAll('h2, h3');
  sections.forEach(section => {
    const text = section.textContent.trim();
    if (text && text.length < 100) {
      result.objectives.push(text);
    }
  });

  console.log('=== CONTENIDO EXTRAÍDO ===');
  console.log(JSON.stringify(result, null, 2));
  
  // Copiar al portapapeles si es posible
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => {
      console.log('✓ Contenido copiado al portapapeles');
    });
  }

  return result;
}

// Función mejorada para extraer ejemplos específicos
function extractExamples() {
  const examples = [];
  
  // Buscar enlaces con anclas (#)
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    const anchor = link.getAttribute('href');
    if (anchor && anchor !== '#') {
      const target = document.querySelector(anchor);
      if (target) {
        const text = target.textContent.trim();
        if (text && text.length > 10 && text.length < 200) {
          examples.push({
            anchor: anchor,
            text: text
          });
        }
      }
    }
  });

  console.log('=== EJEMPLOS ENCONTRADOS ===');
  console.log(JSON.stringify(examples, null, 2));
  
  return examples;
}

// Función para extraer ejercicios de la sección "Ejercicios"
function extractExercises() {
  const exercises = [];
  
  // Buscar sección de ejercicios
  const ejercicioSection = Array.from(document.querySelectorAll('h2, h3, h4')).find(
    el => el.textContent.toLowerCase().includes('ejercicio') || 
          el.textContent.toLowerCase().includes('exercise')
  );

  if (ejercicioSection) {
    let currentElement = ejercicioSection.nextElementSibling;
    let exerciseCount = 0;
    
    while (currentElement && exerciseCount < 10) {
      const text = currentElement.textContent.trim();
      
      // Buscar preguntas
      if (text.includes('?') || text.includes('¿')) {
        const question = text.split('?')[0] + '?';
        exercises.push({
          type: 'multiple-choice', // Default, puede necesitar ajuste
          question: question,
          options: [],
          correct: 0
        });
        exerciseCount++;
      }
      
      currentElement = currentElement.nextElementSibling;
    }
  }

  console.log('=== EJERCICIOS ENCONTRADOS ===');
  console.log(JSON.stringify(exercises, null, 2));
  
  return exercises;
}

// Función completa que extrae todo
function extractAll() {
  console.log('Iniciando extracción completa...\n');
  
  const content = extractLessonContent();
  const examples = extractExamples();
  const exercises = extractExercises();
  
  const fullResult = {
    ...content,
    extractedExamples: examples,
    extractedExercises: exercises
  };
  
  console.log('\n=== RESULTADO COMPLETO ===');
  console.log(JSON.stringify(fullResult, null, 2));
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(fullResult, null, 2)).then(() => {
      console.log('\n✓ Todo el contenido copiado al portapapeles');
    });
  }
  
  return fullResult;
}

// Exportar funciones para uso en consola
window.extractLessonContent = extractLessonContent;
window.extractExamples = extractExamples;
window.extractExercises = extractExercises;
window.extractAll = extractAll;

console.log(`
╔══════════════════════════════════════════════════════════╗
║  Script de Extracción de Curso-Ingles.com               ║
╚══════════════════════════════════════════════════════════╝

Funciones disponibles:
- extractLessonContent()  → Extrae vocabulario y estructura básica
- extractExamples()       → Extrae ejemplos de la página
- extractExercises()      → Extrae ejercicios
- extractAll()            → Extrae todo el contenido

Ejemplo de uso:
  extractAll()

El resultado se mostrará en la consola y se copiará al portapapeles.
`);

