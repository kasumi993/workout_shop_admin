import LoadingSpinner from "@/components/GlobalComponents/LoadingSpinner";
import { ToastProvider } from "@/components/GlobalComponents/Notifications";
import Unauthorized from "@/components/GlobalComponents/Unauthorized";
import "@/styles/globals.scss";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useEffect } from "react";

function Auth({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const publicRoutes = ['/login', '/debug'];
  const requiresAuth = !publicRoutes.includes(router.pathname);

  useEffect(() => {
    console.log('Auth effect triggered:', { status, requiresAuth, session });
    if (status === 'unauthenticated' && requiresAuth) {
      router.push('/login');
    }
  }, [status, requiresAuth, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (requiresAuth && status === 'unauthenticated') {
    return <LoadingSpinner />;
  }

  if (requiresAuth && session && !session.user.isAdmin) {
    return <Unauthorized />;
  }

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


export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}