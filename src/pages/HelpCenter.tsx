import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Mail, BookOpen, Users, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HelpCenter = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const canSubmit = useMemo(() => {
    return Boolean(user) && email.trim() && subject.trim() && message.trim();
  }, [user, email, subject, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para enviar una solicitud de soporte.",
        variant: "destructive",
      });
      return;
    }
    if (!email.trim() || !subject.trim() || !message.trim()) {
      toast({
        title: "Datos incompletos",
        description: "Completa email, asunto y mensaje.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from("support_requests")
        .insert({
          tenant_id: currentTenant?.id ?? null,
          user_id: user.id,
          email: email.trim(),
          full_name: fullName.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
        });

      if (error) throw error;

      toast({
        title: "Solicitud enviada",
        description: "Gracias. Tu mensaje fue enviado a soporte.",
      });

      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo enviar la solicitud. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block">
            Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-muted-foreground">Encuentra respuestas a las preguntas más frecuentes</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Lecciones y Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Accede a lecciones interactivas, ejercicios de vocabulario y gramática. Tu progreso se guarda automáticamente.
              </p>
              <Link to="/lecciones" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Ir a Lecciones
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <HelpCircle className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Test de Nivel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Descubre tu nivel actual de ingles con nuestro test de ubicacion basado en el MCER.
              </p>
              <Link to="/placement-test" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Realizar Test
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Si perteneces a una institución educativa, tu profesor puede asignarte lecciones y seguimiento.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>¿Necesitas más ayuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Contáctanos y te responderemos lo antes posible.</p>
            <div className="flex items-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              <a href="mailto:hola@englishco.com" className="font-medium hover:underline">
                hola@englishco.com
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contactar Soporte</CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
              <p className="text-sm text-muted-foreground">
                Para enviar una solicitud desde la plataforma, inicia sesión. También puedes escribirnos a{" "}
                <a className="text-primary hover:underline" href="mailto:hola@englishco.com">
                  hola@englishco.com
                </a>
                .
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supportName">Nombre (opcional)</Label>
                    <Input
                      id="supportName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportSubject">Asunto</Label>
                  <Input
                    id="supportSubject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ej: No puedo avanzar en una lección"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportMessage">Mensaje</Label>
                  <Textarea
                    id="supportMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos qué pasó y, si puedes, incluye pasos para reproducirlo."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {currentTenant ? `Se enviará asociado a la organización: ${currentTenant.name}.` : "Se enviará como solicitud general."}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
