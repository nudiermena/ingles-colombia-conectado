import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">EnglishCo</span>
          </Link>
        </div>

        <Card className="hover:shadow-card transition-all duration-300">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl text-center">
              {isSubmitted ? "¡Correo Enviado!" : "Recuperar Contraseña"}
            </CardTitle>
            <p className="text-muted-foreground text-center">
              {isSubmitted 
                ? "Revisa tu correo electrónico para las instrucciones de recuperación"
                : "Te enviaremos un enlace para restablecer tu contraseña"
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button variant="hero" className="w-full" size="lg" type="submit">
                  Enviar Enlace de Recuperación
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un correo a:
                  </p>
                  <p className="font-medium">{email}</p>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                  Si no recibes el correo en los próximos minutos, revisa tu carpeta de spam
                  o contacta a nuestro soporte.
                </div>

                <Button variant="hero" className="w-full" size="lg" asChild>
                  <Link to="/login">Volver al Inicio de Sesión</Link>
                </Button>
              </div>
            )}

            {/* Back to Login */}
            {!isSubmitted && (
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio de sesión
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;