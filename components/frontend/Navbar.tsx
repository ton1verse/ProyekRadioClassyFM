'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Profile', href: '/profile' },
        { name: 'Product', href: '/product' },
        { name: 'News', href: '/news' },
        { name: 'Podcast', href: '/podcast' },
        { name: 'Chart', href: '/chart' },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        if (path === '/product') {
            return pathname.startsWith('/product') || pathname.startsWith('/programs') || pathname.startsWith('/events');
        }
        if (path === '/chart') {
            return pathname.startsWith('/chart') || pathname.startsWith('/play');
        }
        return pathname.startsWith(path);
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#001A3A] text-white py-3 px-4 md:px-6 w-full flex justify-between items-center sticky top-0 z-50 shadow-md text-lg">
            <div className="flex items-center space-x-2">
                <div className="bg-white p-2 rounded-md">
                    <img src="/classy.jpg" alt="Classy FM Logo" className="h-12 md:h-14 w-auto" />
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 text-xl font-medium uppercase tracking-wider">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`transition hover:text-[#A12227] ${isActive(link.href) ? 'text-[#A12227]' : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {/* Listen Now - RED #A12227 */}
                <Link href="/listen" className="hidden md:block">
                    <button className="bg-[#A12227] text-white hover:bg-red-800 px-6 py-2 rounded-full font-bold flex items-center space-x-2 transition text-2xl shadow-sm">
                        <Play size={16} fill="currentColor" />
                        <span>Listen Now</span>
                    </button>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-[#001A3A] text-white shadow-xl md:hidden flex flex-col items-center py-6 space-y-6 animate-fade-in z-40 border-t border-gray-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-xl font-medium uppercase tracking-wider transition hover:text-[#A12227] ${isActive(link.href) ? 'text-[#A12227]' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/listen" onClick={() => setIsOpen(false)}>
                        <button className="bg-[#A12227] text-white hover:bg-red-800 px-8 py-3 rounded-full font-bold flex items-center space-x-2 transition text-xl shadow-sm mt-2">
                            <Play size={20} fill="currentColor" />
                            <span>Listen Now</span>
                        </button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
