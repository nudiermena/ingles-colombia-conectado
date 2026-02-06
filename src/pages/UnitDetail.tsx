import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  FileText,
  Headphones,
  MessageCircle,
  PenLine,
  Sparkles,
  Globe,
  Video,
  ExternalLink,
} from "lucide-react";

interface Unit {
  id: string;
  unit_number: number | null;
  title: string;
  is_welcome_unit: boolean;
  course_id: string;
}

interface UnitContent {
  id: string;
  content_type: string;
  title: string | null;
  content: any;
  order_index: number;
}

interface Resource {
  id: string;
  resource_type: string;
  title: string;
  url: string | null;
  description: string | null;
  is_teacher_only: boolean;
}

const CONTENT_LABELS: Record<string, { label: string; icon: any }> = {
  vocabulary: { label: "Vocabulario", icon: BookOpen },
  grammar: { label: "Gramática", icon: FileText },
  listening: { label: "Listening", icon: Headphones },
  reading: { label: "Reading", icon: BookOpen },
  speaking: { label: "Speaking & Pronunciation", icon: MessageCircle },
  writing: { label: "Writing", icon: PenLine },
  learning_for_life: { label: "Learning for Life", icon: Sparkles },
  culture_clil: { label: "Culture & CLIL/SDG", icon: Globe },
};

const UnitDetail = () => {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [contents, setContents] = useState<UnitContent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vocabulary");

  useEffect(() => {
    if (unitId) {
      fetchUnit();
      fetchContents();
      fetchResources();
    }
  }, [unitId]);

  const fetchUnit = async () => {
    if (!unitId) return;

    try {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("id", unitId)
        .single();

      if (error) throw error;
      setUnit(data);
    } catch (error: any) {
      console.error("Error fetching unit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContents = async () => {
    if (!unitId) return;

    try {
      const { data, error } = await supabase
        .from("unit_content")
        .select("id, content_type, title, content, order_index")
        .eq("unit_id", unitId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setContents(data || []);
      if (data && data.length > 0) {
        setActiveTab(data[0].content_type);
      }
    } catch (error: any) {
      console.error("Error fetching contents:", error);
    }
  };

  const fetchResources = async () => {
    if (!unitId) return;

    try {
      const { data, error } = await supabase
        .from("course_resources")
        .select("id, resource_type, title, url, description, is_teacher_only")
        .eq("unit_id", unitId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      const list = (data || []).filter((r) => !r.is_teacher_only);
      setResources(list);
    } catch (error: any) {
      console.error("Error fetching resources:", error);
    }
  };

  const updateProgress = async () => {
    if (!user || !currentTenant || !unitId) return;

    try {
      await supabase.from("unit_progress").upsert(
        {
          user_id: user.id,
          tenant_id: currentTenant.id,
          unit_id: unitId,
          progress_percentage: 100,
          completed: true,
          last_accessed_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,tenant_id,unit_id" }
      );
    } catch (error: any) {
      console.error("Error updating progress:", error);
    }
  };

  const renderContent = (content: UnitContent) => {
    const c = content.content;
    if (!c) return <p className="text-muted-foreground">Sin contenido.</p>;

    if (typeof c === "string") return <p className="whitespace-pre-wrap">{c}</p>;
    if (c.text) return <p className="whitespace-pre-wrap">{c.text}</p>;

    if (content.content_type === "vocabulary" && c.words) {
      return (
        <ul className="space-y-2">
          {c.words.map((w: any, i: number) => (
            <li key={i} className="py-2 border-b last:border-0 grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <span className="font-medium">{w.english}</span>
              <span className="text-muted-foreground">{w.spanish}</span>
              {w.pronunciation ? (
                <span className="text-xs text-muted-foreground">{w.pronunciation}</span>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (c.explanation) return <p className="whitespace-pre-wrap">{c.explanation}</p>;
    if (c.examples && Array.isArray(c.examples)) {
      return (
        <div className="space-y-2">
          <p className="font-medium">Ejemplos:</p>
          <ul className="list-disc list-inside space-y-1">
            {c.examples.map((ex: string, i: number) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      );
    }

    return <pre className="text-sm overflow-auto rounded bg-muted p-4">{JSON.stringify(c, null, 2)}</pre>;
  };

  const contentsByType = contents.reduce((acc, c) => {
    if (!acc[c.content_type]) acc[c.content_type] = [];
    acc[c.content_type].push(c);
    return acc;
  }, {} as Record<string, UnitContent[]>);

  if (isLoading || !unit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al curso
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {unit.is_welcome_unit ? "Welcome Unit" : `Unit ${unit.unit_number}`}: {unit.title}
          </h1>
        </div>

        {contents.length === 0 && resources.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Esta unidad aún no tiene contenido.
            </CardContent>
          </Card>
        ) : (
          <>
            {contents.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="flex flex-wrap gap-1 mb-4">
                  {Object.entries(contentsByType).map(([type, items]) => {
                    const config = CONTENT_LABELS[type] || { label: type, icon: FileText };
                    const Icon = config.icon;
                    return (
                      <TabsTrigger key={type} value={type} className="gap-1">
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {Object.entries(contentsByType).map(([type, items]) => (
                  <TabsContent key={type} value={type} className="space-y-4">
                    {items.map((content) => (
                      <Card key={content.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {content.title || CONTENT_LABELS[type]?.label || type}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderContent(content)}</CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}

            {resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resources.map((res) => (
                      <li key={res.id}>
                        {res.url ? (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            {res.title}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">{res.title}</span>
                        )}
                        {res.description && (
                          <p className="text-sm text-muted-foreground ml-6">{res.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="mt-6">
              <Button onClick={() => { updateProgress(); navigate(`/course/${courseId}`); }}>
                Marcar como completado y volver al curso
              </Button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UnitDetail;
