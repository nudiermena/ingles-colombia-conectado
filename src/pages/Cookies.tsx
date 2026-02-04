import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Calendar } from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Política de Cookies</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Última actualización: 1 de septiembre, 2024</span>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                ¿Qué son las cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.
                Nos ayudan a mejorar su experiencia, recordar sus preferencias y mantener su sesión activa.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cookies que utilizamos</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ul>
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio (sesión, autenticación)</li>
                <li><strong>Cookies de preferencias:</strong> Recuerdan su idioma y configuración</li>
                <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo usan la plataforma para mejorarla</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gestión de cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Puede configurar su navegador para rechazar o eliminar cookies. Tenga en cuenta que desactivar
                algunas cookies puede afectar el funcionamiento de la plataforma.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Link to="/privacy" className="text-primary hover:underline">Ver Política de Privacidad</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
