import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  return (
    <div>
      <h1>Session Debug Information</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold mb-4">Session Status</h2>
        <p className="mb-2">
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded ${
            status === 'authenticated' ? 'bg-green-100 text-green-800' : 
            status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </p>
        
        {session && (
          <>
            <h3 className="text-md font-semibold mt-4 mb-2">User Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {session.user?.id || 'N/A'}</p>
              <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
              <p><strong>Is Admin:</strong> {session.user?.isAdmin ? 'Yes' : 'No'}</p>
              <p><strong>Has Access Token:</strong> {session.accessToken ? 'Yes' : 'No'}</p>
            </div>
            
            <h3 className="text-md font-semibold mt-4 mb-2">Raw Session Data</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </>
        )}
        
        <div className="mt-6 flex gap-2">
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="btn-default"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}