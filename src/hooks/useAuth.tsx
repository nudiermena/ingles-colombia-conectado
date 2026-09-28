import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, username?: string) => Promise<{ error: any }>;
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

  const signIn = async (identifier: string, password: string) => {
    const cleanIdentifier = identifier?.trim();
    if (!cleanIdentifier) {
      return { error: new Error("Por favor ingresa tu correo electrónico o nombre de usuario") };
    }

    let emailToUse = cleanIdentifier;

    // Si no contiene '@', buscamos el correo asociado a ese nombre de usuario
    if (!cleanIdentifier.includes('@')) {
      try {
        const { data: resolvedEmail, error: rpcError } = await (supabase as any).rpc('get_email_by_identifier', {
          _identifier: cleanIdentifier,
        });

        if (!rpcError && resolvedEmail) {
          emailToUse = resolvedEmail;
        } else {
          // Fallback consultando profiles directamente si la función RPC aún no está creada
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .or(`username.ilike.${cleanIdentifier},email.ilike.${cleanIdentifier}`)
            .maybeSingle();

          if (profile?.email) {
            emailToUse = profile.email;
          } else if (rpcError && (rpcError.message?.includes('does not exist') || rpcError.code === '42883')) {
            return {
              error: new Error(
                "Para iniciar sesión con nombre de usuario, ejecuta el script ENABLE_USERNAME_LOGIN.sql en Supabase. Mientras tanto, puedes ingresar con tu correo electrónico."
              ),
            };
          } else {
            return {
              error: new Error("No se encontró ningún usuario con ese nombre de usuario o correo."),
            };
          }
        }
      } catch (err: any) {
        console.error("Error al resolver username:", err);
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (!error) {
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });
      // Navigation will be handled by the component based on role
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, username?: string) => {
    const cleanUsername = username?.trim() || email.split('@')[0];
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          username: cleanUsername,
        },
      },
    });

    if (!error) {
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      });
      // Navigation will be handled by the component based on role
      // For new users without invitation, they'll need to select/create a tenant
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