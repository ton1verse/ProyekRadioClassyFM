'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<{ nama: string; foto: string | null } | null>(null);

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

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-6 flex items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {user.foto ? (
                <img
                  src={user.foto}
                  alt={user.nama}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600 w-6 h-6" />
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg">{user.nama}</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
