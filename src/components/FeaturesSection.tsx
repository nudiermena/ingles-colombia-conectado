import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Mic, 
  BarChart3, 
  Download, 
  Award, 
  Users,
  Zap,
  BookOpenCheck
} from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Aprendizaje Gamificado",
    description: "Ejercicios interactivos, puntos, badges y niveles que hacen del aprendizaje una aventura divertida.",
    highlight: "Juega mientras aprendes"
  },
  {
    icon: Mic,
    title: "Pronunciación con IA",
    description: "Reconocimiento de voz avanzado que evalúa tu pronunciación y te da feedback instantáneo.",
    highlight: "Habla como un nativo"
  },
  {
    icon: BarChart3,
    title: "Seguimiento Inteligente",
    description: "Analytics detallados de tu progreso, fortalezas y áreas de mejora personalizadas.",
    highlight: "Conoce tu evolución"
  },
  {
    icon: Download,
    title: "Modo Offline",
    description: "Descarga lecciones y continúa aprendiendo sin conexión a internet en cualquier lugar.",
    highlight: "Aprende en cualquier lugar"
  },
  {
    icon: Award,
    title: "Certificados Oficiales",
    description: "Obtén certificados digitales validados que puedes usar en tu perfil académico.",
    highlight: "Certifica tu nivel"
  },
  {
    icon: Users,
    title: "Contenido Colombiano",
    description: "Ejemplos, contextos y situaciones diseñadas específicamente para estudiantes colombianos.",
    highlight: "100% localizado"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Zap className="w-4 h-4 mr-2" />
            Características Únicas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Una experiencia de aprendizaje 
            <span className="text-transparent bg-gradient-primary bg-clip-text">
              {" "}revolucionaria
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Combinamos la mejor tecnología educativa con metodologías probadas 
            para crear la plataforma de inglés más efectiva para estudiantes colombianos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-border hover:shadow-card transition-all duration-300 group hover:scale-105"
            >
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {feature.highlight}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>

              <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-hero text-white border-0 max-w-2xl mx-auto">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <BookOpenCheck className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">¿Listo para comenzar tu aventura?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-6">
                Únete a miles de estudiantes que ya están mejorando su inglés con nuestra plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                  Comenzar Gratis
                </button>
                <button className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                  Ver Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;