import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/GlobalComponents/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        const { session } = data;

        if (!session) {
          router.push('/login?error=no_session');
          return;
        }

        // Check if user is admin
        if (!session.user.user_metadata?.isAdmin) {
          await supabase.auth.signOut();
          router.push('/login?error=admin_required');
          return;
        }

        // Successful admin login
        router.push('/');
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        router.push('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}