import Link from "next/link";
import {useRouter} from "next/router";
import {signOut} from "next-auth/react";
import Image from "next/image";
import Logo from "@/components/GlobalComponents/Logo";

export default function Sidebar({show}) {
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+' bg-highlight text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';
  const router = useRouter();
  const {pathname} = router;
  async function logout() {
    await router.push('/');
    await signOut();
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
    <aside className={(show?'left-0':'-left-full')+" top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"}>
      <div className="mb-4 mr-4">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <Link href={item.link} key={item.link} className={pathname === item.link ? activeLink : inactiveLink}>
            <Image src={`/icons/${item.icon}.svg`} width={24} height={24} alt={item.text} className={pathname === item.link ? activeIcon : inactiveIcon} />
            {item.text}
          </Link>
        ))}
        <button onClick={logout} className={inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
}