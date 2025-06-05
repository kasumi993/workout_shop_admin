import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Logo from "@/components/GlobalComponents/Logo";

export default function Sidebar({ show, onHide }) {
  const inactiveLink = 'flex gap-3 p-3 rounded-lg hover:bg-[#eae8fb] transition-colors duration-200';
  const activeLink = inactiveLink + ' bg-[#eae8fb] text-black';
  const inactiveIcon = 'w-6 h-6 flex-shrink-0';
  const activeIcon = inactiveIcon + ' text-[#5542F6]';
  const router = useRouter();
  const { pathname } = router;
  
  async function handleLogout() {
    await router.push('/');
    await signOut({ callbackUrl: '/login' });
  }
  
  const navItems = [
    {
      link: '/',
      icon: 'home',
      text: 'Dashboard',
    },
    {
      link: '/products',
      icon: 'products',
      text: 'Products',
    },
    {
      link: '/categories',
      icon: 'categories',
      text: 'Categories',
    },
    {
      link: '/orders',
      icon: 'orders',
      text: 'Orders',
    },
    {
      link: '/settings',
      icon: 'settings',
      text: 'Settings',
    },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onHide}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${show ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        fixed md:static
        top-0 left-0
        w-72 md:w-64
        h-full
        bg-[#fbfafd] 
        text-gray-500 
        p-4 
        transition-transform duration-300 ease-in-out
        z-50
        border-r border-gray-200
        flex flex-col
      `}>
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <Logo />
          <button 
            onClick={onHide} 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(item => (
            <Link 
              href={item.link} 
              key={item.link} 
              className={pathname === item.link ? activeLink : inactiveLink}
              onClick={() => {
                // Close mobile menu when navigating
                if (window.innerWidth < 768) {
                  onHide();
                }
              }}
            >
              <Image 
                src={`/icons/${item.icon}.svg`} 
                width={24} 
                height={24} 
                alt="" 
                className={pathname === item.link ? activeIcon : inactiveIcon} 
              />
              <span className="font-medium">{item.text}</span>
            </Link>
          ))}
          
          {/* Logout button */}
          <button 
            onClick={handleLogout} 
            className={`${inactiveLink} mt-auto text-red-600 hover:bg-red-50`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}