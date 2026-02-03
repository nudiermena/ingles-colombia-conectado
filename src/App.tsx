import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
import Certificates from "./pages/Certificates";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Demo from "./pages/Demo";
import TenantSelect from "./pages/TenantSelect";
import LevelA1 from "./pages/LevelA1";
import LevelA2 from "./pages/LevelA2";
import LevelB1 from "./pages/LevelB1";
import LessonDetail from "./pages/LessonDetail";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AcceptInvitation from "./pages/AcceptInvitation";
import StudentDashboard from "./pages/StudentDashboard";
import SeedLessons from "./pages/SeedLessons";
import PlacementTest from "./pages/PlacementTest";

const queryClient = new QueryClient();

// React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={future}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lecciones" element={<Lessons />} />
            <Route path="/progreso" element={<Progress />} />
            <Route path="/certificados" element={<Certificates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/tenant-select" element={<TenantSelect />} />
            <Route path="/nivel/a1" element={<LevelA1 />} />
            <Route path="/nivel/a2" element={<LevelA2 />} />
            <Route path="/nivel/b1" element={<LevelB1 />} />
            <Route path="/leccion/:id" element={<LessonDetail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
            <Route path="/seed-lessons" element={<SeedLessons />} />
            <Route path="/placement-test" element={<PlacementTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
