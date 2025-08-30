import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                ✨ Diseñado para estudiantes colombianos
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Aprende inglés de forma 
                <span className="text-transparent bg-gradient-primary bg-clip-text">
                  {" "}divertida
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Plataforma interactiva diseñada especialmente para estudiantes de bachillerato. 
                Avanza desde A1 hasta B1 con lecciones gamificadas y contenido localizado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/signup">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Comenzar mi Aventura
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/demo">Ver Demo Gratis</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-gradient-success rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-secondary rounded-full border-2 border-background"></div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold">4.9</span>
                  </div>
                  <p className="text-muted-foreground">+10k estudiantes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-5 h-5 text-success" />
                <span className="text-muted-foreground">Certificado oficial</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage} 
                alt="Estudiantes colombianos aprendiendo inglés" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-success text-success-foreground p-3 rounded-xl shadow-lg animate-bounce">
              <Users className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-xl shadow-lg animate-pulse">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;