import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LevelsSection from "@/components/LevelsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";

const Index = () => {
  const { user, loading } = useAuth();
  const { currentTenant, getRoleInTenant, loading: tenantLoading } = useTenant(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !tenantLoading && user && currentTenant) {
      // Redirect logged-in users to their appropriate dashboard
      const role = getRoleInTenant(currentTenant.id);
      if (role === 'admin' || role === 'teacher') {
        navigate('/admin');
      } else if (role === 'student') {
        navigate('/student');
      }
    } else if (!loading && user && !currentTenant) {
      navigate('/tenant-select');
    }
  }, [user, currentTenant, loading, tenantLoading, navigate, getRoleInTenant]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <section className="container mx-auto px-4 py-4">
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Requisitos del navegador para la mejor experiencia:</strong> Usa Chrome, Firefox o Edge (últimas versiones). Asegúrate de tener JavaScript habilitado y una conexión estable. Se recomienda una resolución mínima de 1024×768 y audio para las lecciones de pronunciación.
          </div>
        </section>
        <LevelsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
