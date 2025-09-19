import LoadingSpinner from "@/components/GlobalComponents/LoadingSpinner";
import { ToastProvider } from "@/components/GlobalComponents/Notifications";
import Unauthorized from "@/components/GlobalComponents/Unauthorized";
import "@/styles/globals.scss";
import { useRouter } from "next/router";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, createContext, useContext } from "react";

// Create auth context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading, supabase, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const publicRoutes = ['/login', '/reset-password', '/auth/callback', '/auth/reset-password-confirm', '/unauthorized'];
  const requiresAuth = !publicRoutes.includes(router.pathname);

  useEffect(() => {
    if (!loading && !user && requiresAuth) {
      router.push('/login');
    }
  }, [loading, user, requiresAuth, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requiresAuth && !user) {
    return <LoadingSpinner />;
  }

  if (requiresAuth && user && !user.user_metadata?.isAdmin) {
    return <Unauthorized />;
  }

  return children;
}


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Auth>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </Auth>
    </AuthProvider>
  );
}