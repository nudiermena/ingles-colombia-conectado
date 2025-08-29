import { Button } from "@/components/ui/button";
import { BookOpen, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">EnglishCo</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Lecciones
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Mi Progreso
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Certificados
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Iniciar Sesión
          </Button>
          <Button variant="hero" size="sm">
            Comenzar Gratis
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;