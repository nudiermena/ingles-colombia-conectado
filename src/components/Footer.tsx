import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">EnglishCo</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              La plataforma líder en aprendizaje de inglés para estudiantes colombianos. 
              Aprende, practica y certifica tu nivel.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plataforma</h3>
            <div className="space-y-2">
              <Link to="/lecciones" className="block text-muted-foreground hover:text-foreground transition-colors">
                Lecciones
              </Link>
              <Link to="/lecciones" className="block text-muted-foreground hover:text-foreground transition-colors">
                Ejercicios
              </Link>
              <Link to="/certificados" className="block text-muted-foreground hover:text-foreground transition-colors">
                Certificados
              </Link>
              <Link to="/placement-test" className="block text-muted-foreground hover:text-foreground transition-colors">
                Test de Nivel
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Soporte</h3>
            <div className="space-y-2">
              <Link to="/ayuda" className="block text-muted-foreground hover:text-foreground transition-colors">
                Centro de Ayuda
              </Link>
              <Link to="/guias-docentes" className="block text-muted-foreground hover:text-foreground transition-colors">
                Guías para Docentes
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hola@englishco.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+57(313)7076032</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 EnglishCo. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;