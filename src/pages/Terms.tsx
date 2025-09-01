import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Calendar, Mail } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Volver al inicio
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Términos y Condiciones
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Última actualización: 1 de septiembre, 2024</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  1. Aceptación de los Términos
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Al acceder y utilizar la plataforma EnglishCo, usted acepta cumplir y estar sujeto 
                  a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de 
                  estos términos, no debe utilizar nuestro servicio.
                </p>
                <p>
                  Estos términos se aplican a todos los visitantes, usuarios y otras personas que 
                  accedan o utilicen el servicio.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Descripción del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  EnglishCo es una plataforma de aprendizaje de inglés en línea que ofrece:
                </p>
                <ul>
                  <li>Lecciones interactivas estructuradas por niveles (A1, A2, B1)</li>
                  <li>Ejercicios de gramática, vocabulario y pronunciación</li>
                  <li>Seguimiento de progreso personalizado</li>
                  <li>Certificaciones oficiales al completar cada nivel</li>
                  <li>Herramientas de práctica y evaluación</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Registro y Cuenta de Usuario</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Para acceder a ciertas funciones del servicio, debe crear una cuenta proporcionando 
                  información precisa y completa. Usted es responsable de:
                </p>
                <ul>
                  <li>Mantener la confidencialidad de su contraseña</li>
                  <li>Toda la actividad que ocurra bajo su cuenta</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Mantener actualizada su información de contacto</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Uso Aceptable</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>Usted se compromete a NO utilizar el servicio para:</p>
                <ul>
                  <li>Violar cualquier ley local, estatal, nacional o internacional aplicable</li>
                  <li>Compartir credenciales de acceso con terceros</li>
                  <li>Intentar hackear, alterar o modificar el sistema</li>
                  <li>Distribuir contenido ofensivo o inapropiado</li>
                  <li>Interferir con el funcionamiento normal de la plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Todo el contenido de la plataforma, incluyendo pero no limitado a texto, gráficos, 
                  logos, íconos, imágenes, audio, video y software, es propiedad de EnglishCo o 
                  sus licenciantes y está protegido por las leyes de derechos de autor.
                </p>
                <p>
                  Se le otorga una licencia limitada, no exclusiva e intransferible para acceder 
                  y utilizar el contenido únicamente para fines de aprendizaje personal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Pagos y Suscripciones</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Algunos servicios pueden requerir el pago de tarifas. Al realizar un pago, 
                  usted acepta:
                </p>
                <ul>
                  <li>Proporcionar información de facturación precisa y completa</li>
                  <li>El cobro automático para suscripciones recurrentes</li>
                  <li>Que las tarifas no son reembolsables salvo lo expresamente indicado</li>
                  <li>Nuestra política de cancelación de suscripciones</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  EnglishCo no será responsable por daños indirectos, incidentales, especiales, 
                  consecuentes o punitivos, incluyendo pero no limitado a pérdida de beneficios, 
                  datos, uso, goodwill u otras pérdidas intangibles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Modificaciones de los Términos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Las modificaciones entrarán en vigor inmediatamente después de su publicación 
                  en la plataforma. El uso continuado del servicio después de dichas modificaciones 
                  constituye su aceptación de los nuevos términos.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  to="/privacy" 
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm">Política de Privacidad</div>
                  <div className="text-xs text-muted-foreground">
                    Cómo manejamos tu información personal
                  </div>
                </Link>
                
                <div className="p-3 rounded-lg border">
                  <div className="font-medium text-sm">Política de Cookies</div>
                  <div className="text-xs text-muted-foreground">
                    Uso de cookies en nuestra plataforma
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Tienes Preguntas?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Si tienes dudas sobre estos términos, contáctanos:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>legal@englishco.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;