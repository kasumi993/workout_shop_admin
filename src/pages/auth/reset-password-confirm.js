import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/GlobalComponents/Logo';

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Handle the auth state change for password reset
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link and is now in recovery state
        setSessionValid(true);
        setError('');
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (event === 'SIGNED_IN' && session) {
        // User successfully signed in through password reset
        setSessionValid(true);
        setError('');
      } else if (event === 'SIGNED_OUT' || !session) {
        // No valid session
        setSessionValid(false);
        if (router.isReady) {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      }
    });

    // Also check current session on load
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
        setError('An error occurred. Please try requesting a new password reset.');
        return;
      }

      if (session) {
        setSessionValid(true);
        setError('');
      } else if (router.isReady) {
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    if (router.isReady) {
      checkSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router.isReady]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password updated successfully. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (router.isReady && !sessionValid && !error) {
    return (
      <div className="bg-[#fbfafd] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-lg border border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfafd] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-lg border border-gray-200">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Error</h3>
                  <div className="mt-1 text-sm">{error}</div>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Success</h3>
                  <div className="mt-1 text-sm">{message}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}