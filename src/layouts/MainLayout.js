import { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Logo from "@/components/GlobalComponents/Logo";
import { Analytics } from '@vercel/analytics/next';

// User Avatar Component with Placeholder
const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (user?.image) {
    return (
      <img 
        src={user.image} 
        alt={user.name || "User avatar"} 
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white ring-opacity-75 shadow-sm`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-300 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white ring-opacity-75`}>
      {getInitials(user?.name)}
    </div>
  );
};

export default function MainLayout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setShowNav(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Open navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          
          <div className="flex items-center space-x-3">
            <UserAvatar user={session?.user} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex">
        <Sidebar show={showNav} onHide={() => setShowNav(false)} />
        
        <div className="flex-grow min-w-0 flex flex-col">
          {/* Desktop header */}
          <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome back, <span className="text-indigo-600">{session?.user?.name}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your store from this admin dashboard
                  </p>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  {/* Notifications Bell */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  
                  {/* User Profile */}
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                    <UserAvatar user={session?.user} size="md" />
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">
                        {session?.user?.email}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile user info card */}
          <div className="block lg:hidden bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <UserAvatar user={session?.user} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {session?.user?.name}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Admin
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
              {/* Analytics Component */}
              <Analytics />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}