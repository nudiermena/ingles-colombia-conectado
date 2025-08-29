import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LevelsSection from "@/components/LevelsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
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
