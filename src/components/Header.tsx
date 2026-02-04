import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, User, Menu, Shield, LogOut, Settings, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";

const Header = () => {
  const { user, signOut } = useAuth();
  const { currentTenant, getRoleInTenant } = useTenant(user?.id);
  const isAdmin = currentTenant && getRoleInTenant(currentTenant.id) === 'admin';
  const isTeacher = currentTenant && getRoleInTenant(currentTenant.id) === 'teacher';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            EnglishCo
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link to="/lecciones" className="text-muted-foreground hover:text-foreground transition-colors">
                Lecciones
              </Link>
              <Link to="/progreso" className="text-muted-foreground hover:text-foreground transition-colors">
                Mi Progreso
              </Link>
              <Link to="/certificados" className="text-muted-foreground hover:text-foreground transition-colors">
                Certificados
              </Link>
              {(isAdmin || isTeacher) && (
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.email?.substring(0, 15)}...</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.email}</p>
                    {currentTenant && (
                      <p className="text-xs text-muted-foreground">{currentTenant.name}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/progreso" className="cursor-pointer">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Mi Progreso
                  </Link>
                </DropdownMenuItem>
                {(isAdmin || isTeacher) && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="w-4 h-4 mr-2" />
                      Panel de Administración
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/tenant-select" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Cambiar Organización
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Comenzar Gratis</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;