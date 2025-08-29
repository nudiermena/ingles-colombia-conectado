import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Download, Share2, Calendar, CheckCircle2, Lock } from "lucide-react";

const certificates = [
  {
    id: 1,
    level: "A1",
    title: "Certificado Básico de Inglés",
    description: "Completaste exitosamente el nivel A1 - Fundamentos del Inglés",
    dateEarned: "15 de Marzo, 2024",
    progress: 100,
    status: "earned",
    skills: ["Vocabulario básico", "Presente simple", "Saludos y presentaciones", "Números y colores"]
  },
  {
    id: 2,
    level: "A2",
    title: "Certificado Pre-Intermedio",
    description: "Dominio del nivel A2 - Inglés Pre-Intermedio",
    dateEarned: null,
    progress: 45,
    status: "in-progress", 
    skills: ["Pasado simple", "Conversaciones cotidianas", "Descripción de personas", "Planes futuros"]
  },
  {
    id: 3,
    level: "B1",
    title: "Certificado Intermedio", 
    description: "Certificación del nivel B1 - Inglés Intermedio",
    dateEarned: null,
    progress: 0,
    status: "locked",
    skills: ["Expresar opiniones", "Situaciones de viaje", "Describir experiencias", "Debates básicos"]
  }
];

const Certificates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mis Certificados
          </h1>
          <p className="text-xl text-muted-foreground">
            Documenta tu progreso con certificaciones oficiales
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-8 bg-gradient-card hover:shadow-card transition-all duration-300">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-success mb-2">1</div>
                <p className="text-muted-foreground">Certificados Obtenidos</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning mb-2">1</div>
                <p className="text-muted-foreground">En Progreso</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground mb-2">3</div>
                <p className="text-muted-foreground">Total Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <Card 
              key={cert.id}
              className={`hover:shadow-card transition-all duration-300 relative overflow-hidden ${
                cert.status === 'earned' ? 'border-success bg-success/5' :
                cert.status === 'in-progress' ? 'border-warning bg-warning/5' :
                'border-muted bg-muted/20 opacity-75'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={cert.level === "A1" ? "secondary" : cert.level === "A2" ? "default" : "outline"}
                    className="text-lg px-3 py-1"
                  >
                    {cert.level}
                  </Badge>
                  {cert.status === 'earned' && (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  )}
                  {cert.status === 'locked' && (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar for in-progress certificates */}
                {cert.status === 'in-progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-warning h-2 rounded-full transition-all duration-500"
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Date for earned certificates */}
                {cert.status === 'earned' && cert.dateEarned && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Obtenido el {cert.dateEarned}</span>
                  </div>
                )}

                {/* Skills List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Habilidades Cubiertas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex}
                        variant="outline" 
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {cert.status === 'earned' && (
                    <>
                      <Button variant="success" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  {cert.status === 'in-progress' && (
                    <Button variant="lesson" size="sm" className="w-full">
                      Continuar Aprendiendo
                    </Button>
                  )}
                  
                  {cert.status === 'locked' && (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Bloqueado
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Certificate Badge Overlay */}
              {cert.status === 'earned' && (
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-success-foreground" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-hero text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6" />
              Sobre Nuestros Certificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-white/90">
              <div className="space-y-2">
                <h3 className="font-semibold">Reconocimiento Oficial</h3>
                <p className="text-sm">
                  Nuestros certificados están alineados con el Marco Común Europeo de Referencia (MCER)
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Válidos Académicamente</h3>
                <p className="text-sm">
                  Incluye en tu perfil académico y profesional para demostrar tu nivel de inglés
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Button variant="secondary" size="lg">
                Más Información sobre Certificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Certificates;