import { Button } from "@/components/ui/button";
import { BookOpen, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

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
          <Link to="/lecciones" className="text-muted-foreground hover:text-foreground transition-colors">
            Lecciones
          </Link>
          <Link to="/progreso" className="text-muted-foreground hover:text-foreground transition-colors">
            Mi Progreso
          </Link>
          <Link to="/certificados" className="text-muted-foreground hover:text-foreground transition-colors">
            Certificados
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/signup">Comenzar Gratis</Link>
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