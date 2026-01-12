'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === 'home') return pathname === '/';
        if (path === 'profile') return pathname.startsWith('/profile');
        if (path === 'product') return pathname.startsWith('/product') || pathname.startsWith('/programs') || pathname.startsWith('/events');
        if (path === 'news') return pathname.startsWith('/news');
        if (path === 'podcast') return pathname.startsWith('/podcast');
        if (path === 'chart') return pathname.startsWith('/chart') || pathname.startsWith('/play');
        return false;
    };

    const getLinkClass = (path: string) => {
        const baseClass = "transition text-sm font-medium uppercase tracking-wider";
        const activeClass = "text-[#A12227] font-bold";
        const inactiveClass = "text-white/90 hover:text-[#A12227]";

        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    return (
        <nav className="bg-[#001A3A] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
            <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded-md">
                    <img src="/classy.jpg" alt="Classy FM Logo" className="h-8 md:h-10 w-auto" />
                </div>
            </div>

            <div className="hidden md:flex space-x-8">
                <Link href="/" className={getLinkClass('home')}>Home</Link>
                <Link href="/#profile" className={getLinkClass('profile')}>Profile</Link>
                <Link href="/#product" className={getLinkClass('product')}>Product</Link>
                <Link href="/#news" className={getLinkClass('news')}>News</Link>
                <Link href="/#podcast" className={getLinkClass('podcast')}>Podcast</Link>
                <Link href="/#chart" className={getLinkClass('chart')}>Chart</Link>
            </div>

            <button className="bg-[#A12227] text-white hover:bg-red-800 px-6 py-2 rounded-full font-bold flex items-center space-x-2 transition text-sm shadow-sm group">
                <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                <span>Listen Now</span>
            </button>
        </nav>
    );
}
