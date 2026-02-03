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
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'student' || role === 'teacher') {
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
        <LevelsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
