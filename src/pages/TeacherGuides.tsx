import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Users, Award, Mail } from "lucide-react";

const TeacherGuides = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Guías para Docentes</h1>
          <p className="text-xl text-muted-foreground">Recursos y guías para aprovechar EnglishCo en el aula</p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestión de Usuarios y Asignación de Lecciones
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Como profesor o administrador, puedes invitar estudiantes a tu organización, gestionar usuarios y
                asignar lecciones específicas a cada estudiante. Los estudiantes solo podrán descargar certificados
                cuando completen todas las lecciones que les hayas asignado para ese nivel.
              </p>
              <ul>
                <li>Panel Admin → Usuarios → Click en el icono de libro junto al estudiante para asignar lecciones</li>
                <li>Selecciona las lecciones requeridas para cada nivel (A1, A2, B1)</li>
                <li>El progreso del estudiante se actualiza automáticamente</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Lecciones y Contenido
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Las lecciones están organizadas por niveles del MCER (A1, A2, B1). Puedes gestionar el contenido
                de la plataforma desde el panel de administración en las pestañas Lecciones, Contenido y Cursos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificados
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Los certificados se generan cuando el estudiante completa el 100% de las lecciones asignadas
                para ese nivel. Asegúrate de asignar lecciones antes de que los estudiantes comiencen.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>¿Preguntas para el equipo educativo?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Contacta al equipo de soporte para docentes.</p>
            <div className="flex items-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              <a href="mailto:hola@englishco.com" className="font-medium hover:underline">
                hola@englishco.com
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherGuides;
