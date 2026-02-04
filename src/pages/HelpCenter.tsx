import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Mail, BookOpen, Users } from "lucide-react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-muted-foreground">Encuentra respuestas a las preguntas más frecuentes</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Lecciones y Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Accede a lecciones interactivas, ejercicios de vocabulario y gramática. Tu progreso se guarda automáticamente.
              </p>
              <Link to="/lecciones" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Ir a Lecciones
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <HelpCircle className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Test de Nivel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Descubre tu nivel actual de ingles con nuestro test de ubicacion basado en el MCER.
              </p>
              <Link to="/placement-test" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Realizar Test
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Si perteneces a una institución educativa, tu profesor puede asignarte lecciones y seguimiento.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Necesitas mas ayuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Contáctanos y te responderemos lo antes posible.</p>
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

export default HelpCenter;
