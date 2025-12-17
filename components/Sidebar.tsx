'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/',},
  { name: 'Users', href: '/users',},
  { name: 'Classier', href: '/classiers',},
  { name: 'Galleries', href: '/galleries',},
  { name: 'Programs', href: '/programs',},
  { name: 'Event', href: '/events',},
  { name: 'Musik', href: '/musiks',},
  { name: 'Berita', href: '/beritas',},
  { name: 'Podcast', href: '/podcasts',},
  { name: 'Settings', href: '/settings',},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-900">Classy FM</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
              pathname === item.href 
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
           
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}