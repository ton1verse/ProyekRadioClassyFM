'use client';

import AboutUs from '@/components/landing/AboutUs';

export default function ProfilePage() {
    return (
        <main className="bg-white min-h-screen">
            {/* Header / Title Section */}
            <div className="pt-12 pb-4 bg-gray-50 text-center">
                <h1 className="text-5xl font-black text-[#001A3A] tracking-tighter mb-4">Company Profile</h1>
                <div className="w-24 h-1 bg-[#A12227] mx-auto rounded-full"></div>
            </div>

            {/* Profile Content */}
            <AboutUs compact={true} />
        </main>
    );
}
