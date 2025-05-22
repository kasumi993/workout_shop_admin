import { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Logo from "@/components/GlobalComponents/Logo";

export default function MainLayout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  
  return (
    <div className="bg-[#fbfafd] min-h-screen">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Sidebar show={showNav} onHide={() => setShowNav(false)} />
        <div className="flex-grow p-4">
          <div className="text-blue-900 flex justify-between mb-6">
            <h2>
              Hello, <b>{session?.user?.name}</b>
            </h2>
            <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden items-center">
              {session?.user?.image && <img src={session.user.image} alt="" className="w-6 h-6" />}
              <span className="px-2">
                {session?.user?.name}
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}