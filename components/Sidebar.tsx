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
  User,
  Menu
} from 'lucide-react';
import LogoutModal from './LogoutModal';

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
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
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile when closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 bg-[#001A3A] text-white rounded-md shadow-lg md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay - Visible only on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`
            fixed inset-y-0 left-0 z-50 w-64 h-screen 
            bg-[#001A3A] text-white shadow-xl border-r border-gray-800 
            transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:static md:sticky md:top-0 md:shadow-lg
            flex flex-col print:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex justify-center w-full">
            <img
              src="/classy.jpg"
              alt="Classy FM Logo"
              className="w-32 h-auto object-contain"
            />
          </div>
          {/* Close Button for Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <LogOut className="w-5 h-5 rotate-180" />
            {/* Reusing LogOut icon as 'Back' arrow or could use X if imported */}
          </button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.name === 'Classier' && pathname === '/dashboard/laporan-honor');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-500 hover:bg-white/5 hover:text-red-400 transition-all duration-200 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>


      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
