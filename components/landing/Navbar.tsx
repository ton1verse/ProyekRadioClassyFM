import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-[#001A3A] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
            <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded-md">
                    <img src="/classy.jpg" alt="Classy FM Logo" className="h-8 md:h-10 w-auto" />
                </div>
            </div>

            <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider">
                <Link href="/" className="hover:text-[#A12227] transition">Home</Link>
                <Link href="#profile" className="hover:text-[#A12227] transition">Profile</Link>
                <Link href="#product" className="hover:text-[#A12227] transition">Product</Link>
                <Link href="#news" className="hover:text-[#A12227] transition">News</Link>
                <Link href="#podcast" className="hover:text-[#A12227] transition">Podcast</Link>
                <Link href="#chart" className="hover:text-[#A12227] transition">Chart</Link>
            </div>

            <button className="bg-[#A12227] text-white hover:bg-red-800 px-6 py-2 rounded-full font-bold flex items-center space-x-2 transition text-sm shadow-sm">
                <Play size={16} fill="currentColor" />
                <span>Listen Now</span>
            </button>
        </nav>
    );
}
