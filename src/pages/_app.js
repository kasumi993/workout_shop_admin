import { ToastProvider } from "@/components/GlobalComponents/Notifications";
import "@/styles/globals.scss";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

// Wrapper component to protect routes
function Auth({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/login'];
  const requiresAuth = !publicRoutes.includes(router.pathname);
  
  // If authentication is still loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5542F6]"></div>
      </div>
    );
  }
  
  // If the route requires auth and the user is not logged in
  if (requiresAuth && !session) {
    router.push('/login');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5542F6]"></div>
      </div>
    );
  }
  
  // If the route requires auth and the user is not an admin
  if (requiresAuth && session && !session.user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Unauthorized - Admin access required</h1>
      </div>
    );
  }
  
  // If the user is authenticated or the route is public
  return children;
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Auth>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </Auth>
    </SessionProvider>
  );
}