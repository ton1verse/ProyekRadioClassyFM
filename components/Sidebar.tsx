'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  Image,
  CalendarDays,
  Calendar,
  Music,
  Newspaper,
  Mic,
  LogOut,
  User
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Classier', href: '/classiers', icon: Layers },
  { name: 'Galleries', href: '/galleries', icon: Image },
  { name: 'Programs', href: '/programs', icon: CalendarDays },
  { name: 'Event', href: '/events', icon: Calendar },
  { name: 'Musik', href: '/musiks', icon: Music },
  { name: 'Berita', href: '/beritas', icon: Newspaper },
  { name: 'Podcast', href: '/dashboard/podcasts', icon: Mic },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ nama: string; foto: string | null } | null>(null);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }); // We need to create this or just delete cookie manually if no route. 
      // For now, simpler to just delete cookie via document if not httpOnly, but it IS httpOnly.
      // So I will create a logout route in a separate tool call.
      // Or I can assume I will create it. Let's create the route too.
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="w-64 min-h-screen shadow-lg border-r border-gray-800 flex flex-col" style={{ backgroundColor: '#001A3A' }}>
      <div className="p-6 border-b border-gray-800 flex justify-center items-center">
        <img
          src="/classy.jpg"
          alt="Classy FM Logo"
          className="w-32 h-auto object-contain"
        />
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-white/10 text-white border-r-4 border-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-400 hover:bg-white/5 hover:text-red-300 transition-all duration-200 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
