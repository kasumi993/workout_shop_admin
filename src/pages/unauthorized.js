import { useRouter } from 'next/router';
import Logo from '@/components/GlobalComponents/Logo';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="bg-[#fbfafd] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-lg border border-gray-200">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin panel. Admin privileges are required.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}