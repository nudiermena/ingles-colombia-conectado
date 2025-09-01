import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Calendar, Mail, Lock, Eye, UserCheck } from "lucide-react";

const Privacy = () => {
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
            Política de Privacidad
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
                  <Shield className="w-5 h-5" />
                  1. Información que Recopilamos
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h4>Información que Usted Proporciona:</h4>
                <ul>
                  <li>Nombre completo y dirección de correo electrónico</li>
                  <li>Información de perfil y preferencias de aprendizaje</li>
                  <li>Respuestas a ejercicios y evaluaciones</li>
                  <li>Comunicaciones que nos envía</li>
                </ul>
                
                <h4>Información Recopilada Automáticamente:</h4>
                <ul>
                  <li>Datos de uso de la plataforma (tiempo de estudio, lecciones completadas)</li>
                  <li>Información del dispositivo y navegador</li>
                  <li>Dirección IP y datos de ubicación general</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2. Cómo Utilizamos su Información
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>Utilizamos la información recopilada para:</p>
                <ul>
                  <li>Proporcionar y personalizar nuestros servicios educativos</li>
                  <li>Hacer seguimiento de su progreso de aprendizaje</li>
                  <li>Generar certificaciones y reportes de progreso</li>
                  <li>Comunicarnos con usted sobre su cuenta y servicios</li>
                  <li>Mejorar nuestros contenidos y funcionalidades</li>
                  <li>Detectar y prevenir fraudes o actividades maliciosas</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  3. Compartir Información
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>No vendemos su información personal. Podemos compartir información en los siguientes casos:</p>
                <ul>
                  <li><strong>Proveedores de servicios:</strong> Terceros que nos ayudan a operar la plataforma</li>
                  <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades</li>
                  <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos o los de otros usuarios</li>
                  <li><strong>Transacciones comerciales:</strong> En caso de fusión, adquisición o venta de activos</li>
                  <li><strong>Con su consentimiento:</strong> Cuando usted autorice expresamente el compartir</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  4. Seguridad de los Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
                  su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
                <h4>Medidas de Seguridad:</h4>
                <ul>
                  <li>Encriptación de datos en tránsito y en reposo</li>
                  <li>Controles de acceso estrictos a datos personales</li>
                  <li>Monitoreo regular de seguridad</li>
                  <li>Capacitación del personal en protección de datos</li>
                  <li>Auditorías de seguridad periódicas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Sus Derechos de Privacidad</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>Usted tiene los siguientes derechos respecto a su información personal:</p>
                <ul>
                  <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
                  <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                  <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos bajo ciertas circunstancias</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                  <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                  <li><strong>Limitación:</strong> Solicitar la limitación del procesamiento</li>
                </ul>
                <p>
                  Para ejercer estos derechos, contáctenos en privacy@englishco.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies y Tecnologías Similares</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>Utilizamos cookies y tecnologías similares para:</p>
                <ul>
                  <li>Mantener su sesión iniciada</li>
                  <li>Recordar sus preferencias</li>
                  <li>Analizar el uso de la plataforma</li>
                  <li>Personalizar contenido y anuncios</li>
                </ul>
                <p>
                  Puede controlar las cookies a través de la configuración de su navegador, 
                  aunque esto puede afectar la funcionalidad de la plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Retención de Datos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Conservamos su información personal durante el tiempo necesario para cumplir 
                  con los propósitos descritos en esta política, a menos que la ley requiera 
                  o permita un período de retención más largo.
                </p>
                <p>
                  Los datos de progreso académico se conservan indefinidamente para permitir 
                  la emisión de certificaciones futuras, a menos que solicite su eliminación.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cambios a esta Política</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos 
                  sobre cambios significativos publicando la nueva política en esta página y 
                  actualizando la fecha de "última actualización".
                </p>
                <p>
                  Le recomendamos revisar esta política periódicamente para estar informado 
                  sobre cómo protegemos su información.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Privacidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <div className="font-medium">Datos Protegidos</div>
                    <div className="text-muted-foreground">Encriptación de extremo a extremo</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">No Vendemos Datos</div>
                    <div className="text-muted-foreground">Su información no se comercializa</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <UserCheck className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <div className="font-medium">Control Total</div>
                    <div className="text-muted-foreground">Puede acceder y eliminar sus datos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacto de Privacidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Para consultas sobre privacidad:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>privacy@englishco.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/terms" 
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm">Términos y Condiciones</div>
                  <div className="text-xs text-muted-foreground">
                    Reglas de uso de la plataforma
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;