import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  currentTenantId: string | null;
  setCurrentTenantId: (tenantId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Load tenant ID from localStorage
        if (session?.user) {
          const savedTenantId = localStorage.getItem('currentTenantId');
          if (savedTenantId) {
            setCurrentTenantId(savedTenantId);
          }
        } else {
          setCurrentTenantId(null);
          localStorage.removeItem('currentTenantId');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const savedTenantId = localStorage.getItem('currentTenantId');
        if (savedTenantId) {
          setCurrentTenantId(savedTenantId);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });
      navigate('/');
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error) {
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      });
      navigate('/');
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentTenantId(null);
    localStorage.removeItem('currentTenantId');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/login');
  };

  const updateCurrentTenantId = (tenantId: string | null) => {
    setCurrentTenantId(tenantId);
    if (tenantId) {
      localStorage.setItem('currentTenantId', tenantId);
    } else {
      localStorage.removeItem('currentTenantId');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        currentTenantId,
        setCurrentTenantId: updateCurrentTenantId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};