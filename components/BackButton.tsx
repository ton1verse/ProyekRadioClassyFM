'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ className }: { className?: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={className || "flex items-center gap-2 text-gray-600 hover:text-[#A12227] transition-colors mb-8 group font-medium"}
            aria-label="Back"
        >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span>Back</span>
        </button>
    );
}
